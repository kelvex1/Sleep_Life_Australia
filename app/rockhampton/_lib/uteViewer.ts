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

/** Anchors in the model's own space, after it is centred and scaled below. */
export const HOTSPOTS: Hotspot[] = [
  { id: 'bonnet', title: 'Under the bonnet', pos: [0, 1.15, 1.75],
    text: 'Alternator, starter, battery, earths. Tested under load, not just eyeballed.' },
  { id: 'dash', title: 'Behind the dash', pos: [0, 1.34, 0.5],
    text: 'Scan-tool diagnostics, modules, fuses and the wiring nobody wants to chase.' },
  { id: 'cabin', title: 'Cabin and air con', pos: [0.98, 1.5, -0.3],
    text: 'Licensed re-gas, leak testing, blower and compressor faults. Cold air, fast.' },
  { id: 'roof', title: 'Roof and accessories', pos: [0, 1.98, -0.2],
    text: 'Light bars, driving lights, UHF aerials and winches. Fused and loomed, not tapped into the nearest wire.' },
  { id: 'tray', title: 'Tray and canopy', pos: [0, 1.2, -1.85],
    text: 'Dual battery, DC-DC, solar, fridge and lighting. Fused, loomed and labelled.' },
  { id: 'tow', title: 'Rear and towing', pos: [0, 0.6, -2.75],
    text: 'Trailer plugs, brake controllers, reverse cameras and lighting done properly.' },
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

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
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

  // Centre on the ground and scale to a real 5.4m. The source model faces -z,
  // so an outer group turns it around: everything downstream, the hotspot
  // anchors included, can then assume the nose points along +z.
  let boxfit = new THREE.Box3().setFromObject(model)
  const size = boxfit.getSize(new THREE.Vector3())
  const scale = TARGET_LENGTH / Math.max(size.x, size.y, size.z)
  model.scale.setScalar(scale)
  boxfit = new THREE.Box3().setFromObject(model)
  const centre = boxfit.getCenter(new THREE.Vector3())
  model.position.set(-centre.x, -boxfit.min.y, -centre.z)
  const facing = new THREE.Group()
  facing.rotation.y = Math.PI
  facing.add(model)
  pivot.add(facing)

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

  let yaw = 2.42
  let pitch = 0.3
  let dist = 11
  let dragging = false
  let lastX = 0
  let lastY = 0
  let raf = 0
  let listener: ((pts: Projected[]) => void) | null = null
  let w = 1
  let h = 1

  function resize() {
    const r = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // pull back on narrow cards so the whole vehicle stays in frame
    dist = 11 * Math.max(1, 1.55 / camera.aspect)
    camera.updateProjectionMatrix()
  }

  const anchor = new THREE.Vector3()
  function frame() {
    raf = 0
    if (!dragging && !reduced) yaw += 0.0022
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
    if (!raf) raf = requestAnimationFrame(frame)
  }

  function onDown(e: PointerEvent) {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return
    yaw -= (e.clientX - lastX) * 0.008
    pitch = Math.max(0.03, Math.min(0.72, pitch + (e.clientY - lastY) * 0.004))
    lastX = e.clientX
    lastY = e.clientY
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
      renderer.dispose()
    },
    onFrame(cb) { listener = cb },
  }
}
