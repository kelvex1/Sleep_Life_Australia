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
  /** True once the view has been panned away from its starting position. */
  isPanned: () => boolean
  recentre: () => void
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

/**
 * A small photographic studio: a dark box with a big soft top light, a warm
 * panel on one side, a cool panel on the other and a strip behind, so the
 * paint picks up long highlights as the vehicle turns. Rendered once through
 * PMREMGenerator into the scene environment.
 */
function studioScene(THREE: any) {
  const s = new THREE.Scene()
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(30, 14, 30),
    new THREE.MeshStandardMaterial({ color: 0x0a0c11, side: THREE.BackSide, roughness: 1, metalness: 0 }),
  )
  room.position.y = 6
  s.add(room)
  const panel = (w: number, h: number, color: number, intensity: number, pos: [number, number, number], look: [number, number, number]) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }),
    )
    m.position.set(...pos)
    m.lookAt(...look)
    s.add(m)
  }
  panel(16, 7, 0xffffff, 7.0, [0, 12.5, 0], [0, 0, 0])          // big soft top
  panel(12, 3.2, 0xfff4e8, 3.6, [13, 5, 4], [0, 1, 0])          // side, barely warm
  panel(12, 3.2, 0xe8f2ff, 3.0, [-13, 4, -2], [0, 1, 0])        // side, barely cool
  panel(18, 1.8, 0xff9a4a, 1.6, [0, 3.0, -14], [0, 1, 0])       // amber strip behind
  panel(10, 2.0, 0xffffff, 2.6, [0, 2.6, 14], [0, 1, 0])        // front
  s.add(new THREE.AmbientLight(0xffffff, 0.25))
  return s
}

/**
 * Smooth normals that respect hard edges. A port of three's
 * BufferGeometryUtils.toCreasedNormals (MIT), done here because the vendored
 * bundle is core only. Reads quantised positions by hand: r147's attribute
 * getters do not denormalise.
 */
function creasedNormals(THREE: any, geometry: any, creaseAngle: number) {
  const creaseDot = Math.cos(creaseAngle)
  const src = geometry.index ? geometry.toNonIndexed() : geometry
  const pos = src.attributes.position
  const arr = pos.array
  const div = pos.normalized
    ? (arr instanceof Int16Array ? 32767 : arr instanceof Int8Array ? 127 : arr instanceof Uint16Array ? 65535 : arr instanceof Uint8Array ? 255 : 1)
    : 1
  const count = pos.count
  const px = (i: number) => arr[i * 3] / div
  const py = (i: number) => arr[i * 3 + 1] / div
  const pz = (i: number) => arr[i * 3 + 2] / div

  // scale the hash to the model's extent, so buckets are ~1/2000 of its size
  let maxAbs = 0
  for (let i = 0; i < count; i++) maxAbs = Math.max(maxAbs, Math.abs(px(i)), Math.abs(py(i)), Math.abs(pz(i)))
  const mult = 2000 / Math.max(maxAbs, 1e-6)
  const hash = (i: number) => `${Math.round(px(i) * mult)},${Math.round(py(i) * mult)},${Math.round(pz(i) * mult)}`

  const faceN = new Float32Array(count) // per-vertex face normal, xyz per tri repeated
  const buckets = new Map<string, number[]>() // hash -> list of face indices
  const keys: string[] = new Array(count)
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), n = new THREE.Vector3()
  for (let f = 0; f < count / 3; f++) {
    const i = f * 3
    a.set(px(i), py(i), pz(i)); b.set(px(i + 1), py(i + 1), pz(i + 1)); c.set(px(i + 2), py(i + 2), pz(i + 2))
    e1.subVectors(c, b); e2.subVectors(a, b); n.crossVectors(e1, e2).normalize()
    faceN[i] = n.x; faceN[i + 1] = n.y; faceN[i + 2] = n.z
    for (let k = 0; k < 3; k++) {
      const key = hash(i + k)
      keys[i + k] = key
      let list = buckets.get(key)
      if (!list) { list = []; buckets.set(key, list) }
      list.push(f)
    }
  }
  const out = new Float32Array(count * 3)
  for (let v = 0; v < count; v++) {
    const f = Math.floor(v / 3) * 3
    const fx = faceN[f], fy = faceN[f + 1], fz = faceN[f + 2]
    let sx = 0, sy = 0, sz = 0
    const list = buckets.get(keys[v])!
    for (let k = 0; k < list.length; k++) {
      const g = list[k] * 3
      const gx = faceN[g], gy = faceN[g + 1], gz = faceN[g + 2]
      if (fx * gx + fy * gy + fz * gz > creaseDot) { sx += gx; sy += gy; sz += gz }
    }
    const len = Math.hypot(sx, sy, sz) || 1
    out[v * 3] = sx / len; out[v * 3 + 1] = sy / len; out[v * 3 + 2] = sz / len
  }
  src.setAttribute('normal', new THREE.BufferAttribute(out, 3, false))
  return src
}

/** Fine grid, fading to nothing towards the edges of the stage. */
function gridCanvas() {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const g = c.getContext('2d')!
  g.clearRect(0, 0, 1024, 1024)
  g.strokeStyle = 'rgba(130, 200, 230, 0.7)'
  g.lineWidth = 1
  for (let i = 0; i <= 1024; i += 64) {
    g.beginPath(); g.moveTo(i + 0.5, 0); g.lineTo(i + 0.5, 1024); g.stroke()
    g.beginPath(); g.moveTo(0, i + 0.5); g.lineTo(1024, i + 0.5); g.stroke()
  }
  g.globalCompositeOperation = 'destination-in'
  const fade = g.createRadialGradient(512, 512, 40, 512, 512, 500)
  fade.addColorStop(0, 'rgba(0,0,0,0.9)')
  fade.addColorStop(0.45, 'rgba(0,0,0,0.5)')
  fade.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = fade
  g.fillRect(0, 0, 1024, 1024)
  return c
}

/** Soft dark ellipse: the contact shadow that grounds the vehicle. */
function blobCanvas() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(256, 256, 20, 256, 256, 250)
  grad.addColorStop(0, 'rgba(0,0,0,0.95)')
  grad.addColorStop(0.55, 'rgba(0,0,0,0.55)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 512, 512)
  return c
}

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
  renderer.toneMappingExposure = 1.0
  renderer.physicallyCorrectLights = true
  // Real cast shadows on desktop. On phones the baked contact blob does the job.
  renderer.shadowMap.enabled = !coarse
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200)

  // A studio environment is what makes paint look like paint: metallic
  // materials with nothing to reflect render as chalk. Built procedurally from
  // a few emissive panels so there is no HDR file to ship.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(studioScene(THREE), 0.04).texture
  scene.environment = envTex

  // Key, fill and rim on top of the environment. Intensities are in
  // physically-correct units, so they are larger than the old values.
  scene.add(new THREE.HemisphereLight(0x9fd0ff, 0x0a0c10, 0.35))
  const key = new THREE.DirectionalLight(0xfff6ea, 2.4)
  key.position.set(5, 8, 4)
  key.castShadow = !coarse
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.left = -5; key.shadow.camera.right = 5
  key.shadow.camera.top = 5; key.shadow.camera.bottom = -5
  key.shadow.camera.near = 1; key.shadow.camera.far = 30
  key.shadow.bias = -0.0006
  key.shadow.normalBias = 0.02
  key.shadow.radius = 4
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x8cc8ff, 0.7)
  fill.position.set(-7, 3, 3)
  scene.add(fill)
  const rim = new THREE.DirectionalLight(0xff8a2b, 1.6)
  rim.position.set(-3, 3, -7)
  scene.add(rim)

  // Floor: a fine grid that fades out radially (so it reads as a stage, not
  // a dev tool), a soft contact shadow under the vehicle, and on desktop a
  // shadow-catching plane for the key light.
  const floorTex = new THREE.CanvasTexture(gridCanvas())
  floorTex.encoding = THREE.sRGBEncoding
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 22),
    new THREE.MeshBasicMaterial({ map: floorTex, transparent: true, depthWrite: false }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.005
  scene.add(floor)

  const blobTex = new THREE.CanvasTexture(blobCanvas())
  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: coarse ? 0.75 : 0.45 }),
  )
  blob.rotation.x = -Math.PI / 2
  blob.scale.set(3.6, 6.6, 1)
  blob.position.y = 0.002
  scene.add(blob)

  if (!coarse) {
    const catcher = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 22),
      new THREE.ShadowMaterial({ opacity: 0.5 }),
    )
    catcher.rotation.x = -Math.PI / 2
    catcher.position.y = 0.004
    catcher.receiveShadow = true
    scene.add(catcher)
  }

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

  // The model is a SketchUp export: flat colours, no PBR maps, one material
  // per part. Materials are graded by name; the body paint has no name that
  // survived export, so the largest opaque surface is taken as the paint.
  const tris = new Map<any, number>()
  const seen = new Set<any>()
  model.traverse((o: any) => {
    if (!o.isMesh) return
    o.castShadow = !coarse
    o.receiveShadow = false
    // The shipped normals are quantised to 8 bits, which reads as speckle on
    // every curved surface. Rebuild them from the positions, keeping creases.
    o.geometry = creasedNormals(THREE, o.geometry, Math.PI / 3.4)
    const mats = Array.isArray(o.material) ? o.material : [o.material]
    const n = o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3
    for (const m of mats) {
      if (!m) continue
      seen.add(m)
      tris.set(m, (tris.get(m) || 0) + n / mats.length)
    }
  })
  const mats = Array.from(seen)
  let paint: any = null
  for (const m of mats) {
    if (m.transparent) continue
    if (!paint || (tris.get(m) || 0) > (tris.get(paint) || 0)) paint = m
  }
  for (const m of mats) {
    m.side = THREE.DoubleSide            // several panels are single sided
    m.envMapIntensity = 1.1
    const name = String(m.name || '').toLowerCase()
    const glass = /glass|trans|vidro|material_4$/.test(name)
    if (m === paint) {
      m.metalness = 0.55
      m.roughness = 0.24
      m.envMapIntensity = 1.3
      if (m.clearcoat !== undefined) { m.clearcoat = 1; m.clearcoatRoughness = 0.06 }
    } else if (glass) {
      m.transparent = true
      m.opacity = Math.min(m.opacity ?? 1, 0.42)
      m.metalness = 0.0
      m.roughness = 0.05
      m.envMapIntensity = 1.8
      m.depthWrite = false
    } else if (/rims|crom|chrome|silver|metal|reflect|seamed/.test(name)) {
      // The rims were exported as a blend material, which is why the wheels
      // read as mush: the spokes showed the hub geometry through themselves.
      m.transparent = false
      m.opacity = 1
      m.metalness = 0.92
      m.roughness = 0.28
      m.envMapIntensity = 1.4
    } else if (/tire|tyre/.test(name)) {
      if (m.color) m.color.setHex(0x15161a)
      m.metalness = 0.0
      m.roughness = 0.94
      m.envMapIntensity = 0.35
    } else if (/plastic|charcoal|inferior|interno|housing|edge_color000/.test(name)) {
      m.metalness = 0.05
      m.roughness = 0.86
      m.envMapIntensity = 0.5
    } else {
      m.metalness = Math.min(0.5, (m.metalness ?? 0.2) + 0.1)
      m.roughness = Math.max(0.3, (m.roughness ?? 0.6) - 0.1)
    }
    m.needsUpdate = true
  }
  if (typeof location !== 'undefined' && location.search.includes('mats')) {
    ;(window as any).__rmaeMats = mats.map((m: any) => [m.name, Math.round(tris.get(m) || 0), m === paint, m.transparent])
  }

  let yaw = 0.95
  let pitch = 0.2
  let dist = 11
  let dragging = false
  /** 'spin' when the drag started on the vehicle, 'pan' when it started on the
      background. Decided once on pointerdown by a raycast, so a gesture never
      changes its mind halfway through. */
  let mode: 'spin' | 'pan' = 'spin'
  let lastX = 0
  let lastY = 0
  let spin = 0
  let onScreen = true
  let raf = 0
  let recentring = false
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
    dist = (coarse ? 8.2 : 9.4) * Math.max(1, 1.55 / camera.aspect)
    camera.updateProjectionMatrix()
  }

  // The point the camera orbits. Panning slides it in the camera's own screen
  // plane, which is what makes the vehicle track the pointer one to one.
  const HOME = new THREE.Vector3(0, 0.95, 0)
  const target = HOME.clone()
  const PAN_LIMIT = 2.2
  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const right = new THREE.Vector3()
  const up = new THREE.Vector3()

  /** Did this pointer land on the vehicle, or on empty space behind it? */
  function hitsModel(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
    return raycaster.intersectObject(model, true).length > 0
  }

  /** Metres of world movement per pixel of drag, at the target's depth. */
  function metresPerPixel() {
    return (2 * dist * Math.tan((camera.fov * Math.PI) / 360)) / Math.max(1, h)
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
    if (recentring) {
      target.lerp(HOME, 0.14)
      if (target.distanceTo(HOME) < 0.005) {
        target.copy(HOME)
        recentring = false
      }
    }
    camera.position.set(
      target.x + Math.sin(yaw) * Math.cos(pitch) * dist,
      target.y + Math.sin(pitch) * dist + 0.7 - 0.95,
      target.z + Math.cos(yaw) * Math.cos(pitch) * dist,
    )
    camera.lookAt(target)
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
    recentring = false
    mode = hitsModel(e) ? 'spin' : 'pan'
    canvas.style.cursor = mode === 'pan' ? 'move' : 'grabbing'
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
    schedule()
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY

    if (mode === 'pan') {
      const k = metresPerPixel()
      const m = camera.matrixWorld.elements
      right.set(m[0], m[1], m[2])
      up.set(m[4], m[5], m[6])
      target.addScaledVector(right, -dx * k)
      // touch keeps the page scrollable, so a finger only pans sideways
      if (e.pointerType !== 'touch') target.addScaledVector(up, dy * k)
      target.x = Math.max(HOME.x - PAN_LIMIT, Math.min(HOME.x + PAN_LIMIT, target.x))
      target.y = Math.max(HOME.y - 0.9, Math.min(HOME.y + 1.5, target.y))
      target.z = Math.max(HOME.z - PAN_LIMIT, Math.min(HOME.z + PAN_LIMIT, target.z))
    } else {
      yaw -= dx * 0.008
      spin = -dx * 0.008
      if (e.pointerType !== 'touch') {
        pitch = Math.max(0.03, Math.min(0.72, pitch + dy * 0.004))
      }
    }

    lastX = e.clientX
    lastY = e.clientY
    schedule()
  }
  /** Double click or double tap puts it back where it started. */
  function onDouble() {
    recentring = true
    schedule()
  }
  function onUp(e: PointerEvent) {
    dragging = false
    canvas.style.cursor = 'grab'
    try { canvas.releasePointerCapture(e.pointerId) } catch { /* pointer already gone */ }
  }

  canvas.style.cursor = 'grab'
  canvas.addEventListener('dblclick', onDouble)
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
      canvas.removeEventListener('dblclick', onDouble)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', resize)
      vis.disconnect()
      envTex.dispose()
      pmrem.dispose()
      floorTex.dispose()
      blobTex.dispose()
      renderer.dispose()
    },
    onFrame(cb) { listener = cb },
    isPanned: () => target.distanceTo(HOME) > 0.05,
    recentre: () => { recentring = true; schedule() },
  }
}
