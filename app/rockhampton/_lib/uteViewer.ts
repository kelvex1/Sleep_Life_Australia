/**
 * WebGL viewer for the supplied Toyota Hilux glTF.
 *
 * three.js and the loader are vendored into public/rmae/vendor rather than
 * pulled from a CDN: the artifact sandbox blocks third-party scripts, and
 * shipping them with the site means one code path that can actually be tested.
 * Everything is loaded on demand, so the 6MB of model and library only
 * downloads once the section scrolls into view.
 */

export type Vec3 = [number, number, number]
export type Hotspot = { id: string; title: string; text: string; pos: Vec3 }

/**
 * Anchors in the model's own space, after it is centred and scaled below.
 * Measured off a side-on render at 153px per metre: the nose sits at z=+2.7,
 * the tail at z=-2.7 and the roof at y=1.99. Each one is on the centreline so
 * it stays on the right panel from every angle as the model turns.
 */
export const HOTSPOTS: Hotspot[] = [
  { id: 'charging', title: 'Alternators and charging', pos: [0, 1.4, 1.95],
    text: 'Alternators, starters, batteries and the earths everyone forgets. Tested under load, not just eyeballed.' },
  { id: 'diagnostics', title: 'Scan tool diagnostics', pos: [0, 1.45, 1.2],
    text: 'Live data off the scan tool, modules, fuses, and harness repair for the wiring nobody wants to chase.' },
  { id: 'aircon', title: 'Air conditioning', pos: [0, 1.55, 0.3],
    text: 'Re-gas, leak testing, compressors and blower faults. Cold air before the next Rocky summer.' },
  { id: 'accessories', title: 'Accessory installation', pos: [0, 1.98, 0.05],
    text: 'Driving lights, light bars, UHF and reverse cameras. Fused and loomed, not tapped into the nearest wire.' },
  { id: 'dual', title: 'Dual battery and solar', pos: [0, 1.25, -1.65],
    text: 'Dual battery and solar charging systems, DC-DC, fridges and inverters. Labelled and tidy.' },
  { id: 'brakes', title: 'Electric brake controls', pos: [0, 0.78, -2.6],
    text: 'Electric brake controllers, trailer plugs and lighting, set up and tested with the van on the back.' },
]

export type Projected = { x: number; y: number; depth: number; front: boolean; visible: boolean }

export type Scene = {
  destroy: () => void
  onFrame: (cb: (pts: Projected[]) => void) => void
}

export type Sources = {
  /** Script URLs, or empty when the libraries are already on the page. */
  three: string
  loader: string
  decoder: string
  /** Model URL, or supply the bytes directly via modelData. */
  model?: string
  modelData?: ArrayBuffer
}

declare global {
  interface Window { THREE?: any }
}

const loading = new Map<string, Promise<void>>()

function script(src: string) {
  let p = loading.get(src)
  if (!p) {
    p = new Promise<void>((resolve, reject) => {
      const el = document.createElement('script')
      el.src = src
      el.async = true
      el.onload = () => resolve()
      el.onerror = () => reject(new Error(`could not load ${src}`))
      document.head.appendChild(el)
    })
    loading.set(src, p)
  }
  return p
}

const TARGET_LENGTH = 5.4

export async function createUteScene(
  canvas: HTMLCanvasElement,
  src: Sources,
  reduced = false,
): Promise<Scene> {
  // Empty sources mean the libraries are already inlined on the page.
  if (src.three) await script(src.three)
  if (src.loader) await script(src.loader)
  // The model ships meshopt-compressed: 5.4MB of geometry down to 1.3MB.
  if (src.decoder) await script(src.decoder)
  const THREE = window.THREE

  const coarse = window.matchMedia('(pointer: coarse)').matches
  const renderer = new THREE.WebGLRenderer({
    canvas,
    // antialiasing is expensive fill on phones, and they have the DPR to spare
    antialias: !coarse,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.92

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200)

  // Key, fill and rim, so a dark vehicle still reads against a dark card.
  scene.add(new THREE.HemisphereLight(0x8ec8f5, 0x070a0f, 0.55))
  const key = new THREE.DirectionalLight(0xfff1e0, 2.9)
  key.position.set(4, 7, 5)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x64b9ff, 1.0)
  fill.position.set(-6, 3, 2)
  scene.add(fill)
  const rim = new THREE.DirectionalLight(0xff8a2b, 1.4)
  rim.position.set(-3, 2, -6)
  scene.add(rim)

  const grid = new THREE.GridHelper(16, 16, 0x3d5566, 0x1e2a33)
  ;(grid.material as any).transparent = true
  ;(grid.material as any).opacity = 0.35
  scene.add(grid)

  const pivot = new THREE.Group()
  scene.add(pivot)

  const loader = new THREE.GLTFLoader()
  const decoder = (window as any).MeshoptDecoder
  if (decoder) loader.setMeshoptDecoder(decoder)
  const gltf = await new Promise<any>((resolve, reject) => {
    if (src.modelData) loader.parse(src.modelData, '', resolve, reject)
    else loader.load(src.model!, resolve, undefined, reject)
  })
  const model = gltf.scene

  // Centre on the ground and scale to a real 5.4m. Measured on the centred
  // model, the nose sits at +z and the tail at -z, which is what the hotspot
  // anchors above assume; the camera simply starts on the +z side.
  let boxfit = new THREE.Box3().setFromObject(model)
  const size = boxfit.getSize(new THREE.Vector3())
  const scale = TARGET_LENGTH / Math.max(size.x, size.y, size.z)
  model.scale.setScalar(scale)
  boxfit = new THREE.Box3().setFromObject(model)
  const centre = boxfit.getCenter(new THREE.Vector3())
  model.position.set(-centre.x, -boxfit.min.y, -centre.z)
  pivot.add(model)

  model.traverse((o: any) => {
    if (!o.isMesh) return
    o.castShadow = false
    o.receiveShadow = false
    const mats = Array.isArray(o.material) ? o.material : [o.material]
    for (const m of mats) {
      if (!m) continue
      m.side = THREE.DoubleSide            // several panels are single sided
      if (m.metalness !== undefined) m.metalness = Math.min(0.85, (m.metalness ?? 0.4) + 0.25)
      if (m.roughness !== undefined) m.roughness = Math.max(0.18, (m.roughness ?? 0.6) - 0.12)
    }
  })

  let yaw = 0.72
  let pitch = 0.3
  let dist = 11
  let dragging = false
  let lastX = 0
  let lastY = 0
  let spin = 0
  let onScreen = true
  let raf = 0
  let listener: ((pts: Projected[]) => void) | null = null
  let w = 1
  let h = 1

  function resize() {
    const r = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Pull back on narrow cards so the whole vehicle stays in frame. Phones
    // start closer, otherwise a 5.4m ute on a 300px canvas is a postage stamp
    // and the hotspots land on top of each other.
    dist = (coarse ? 9.6 : 11) * Math.max(1, 1.55 / camera.aspect)
    camera.updateProjectionMatrix()
  }

  const anchor = new THREE.Vector3()
  function frame() {
    raf = 0
    if (!dragging) {
      // carry a flick, then settle back into the slow idle turn
      if (Math.abs(spin) > 0.00025) {
        yaw += spin
        spin *= 0.94
      } else if (!reduced) {
        yaw += 0.0022
      }
    }
    camera.position.set(
      Math.sin(yaw) * Math.cos(pitch) * dist,
      Math.sin(pitch) * dist + 0.7,
      Math.cos(yaw) * Math.cos(pitch) * dist,
    )
    camera.lookAt(0, 0.95, 0)
    renderer.render(scene, camera)

    if (listener) {
      listener(HOTSPOTS.map((hs) => {
        anchor.set(hs.pos[0], hs.pos[1], hs.pos[2])
        const d = anchor.distanceTo(camera.position)
        anchor.project(camera)
        return {
          x: (anchor.x * 0.5 + 0.5) * w,
          y: (-anchor.y * 0.5 + 0.5) * h,
          depth: d,
          front: d < dist,
          visible: anchor.z < 1,
        }
      }))
    }
    schedule()
  }
  function schedule() {
    if (!raf && onScreen) raf = requestAnimationFrame(frame)
  }

  // Stop rendering entirely when the section is scrolled away: on a phone this
  // is the difference between a warm battery and a flat one.
  const vis = new IntersectionObserver((entries) => {
    onScreen = entries.some((e) => e.isIntersecting)
    if (onScreen) schedule()
  }, { rootMargin: '120px' })
  vis.observe(canvas)

  function onDown(e: PointerEvent) {
    dragging = true
    spin = 0
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
    schedule()
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return
    const dx = e.clientX - lastX
    yaw -= dx * 0.008
    spin = -dx * 0.008
    // touch keeps the page scrollable vertically, so only mice pitch the camera
    if (e.pointerType !== 'touch') {
      pitch = Math.max(0.03, Math.min(0.72, pitch + (e.clientY - lastY) * 0.004))
    }
    lastX = e.clientX
    lastY = e.clientY
    schedule()
  }
  function onUp(e: PointerEvent) {
    dragging = false
    try { canvas.releasePointerCapture(e.pointerId) } catch { /* pointer already gone */ }
  }

  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  window.addEventListener('resize', resize)

  resize()
  schedule()

  return {
    destroy() {
      if (raf) cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', resize)
      vis.disconnect()
      renderer.dispose()
    },
    onFrame(cb) { listener = cb },
  }
}
