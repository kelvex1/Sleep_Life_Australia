/**
 * A hand-built 3D model of a dual-cab 4x4 ute.
 *
 * No library and no external asset: the geometry is defined here in metres,
 * lit, depth-sorted and projected by hand onto a 2D canvas. That keeps it
 * working anywhere the page loads, including sandboxes that block CDNs.
 *
 * Surfaces are drawn back to front (painter's algorithm) rather than as a
 * wireframe. A wireframe of a solid object shows every hidden edge at once
 * and reads as a pile of boxes; filling the faces gives a readable silhouette
 * with the panel lines glowing over it.
 *
 * Dimensions are a real dual-cab: 5.33m long, 1.855m wide, 1.815m high,
 * 3.085m wheelbase, 0.80m tyres. Origin sits at the centre of the wheelbase
 * with y = 0 on the ground and +z toward the front of the vehicle.
 */

export type Vec3 = [number, number, number]

export type Hotspot = { id: string; title: string; text: string; pos: Vec3 }

export const HOTSPOTS: Hotspot[] = [
  { id: 'bonnet', title: 'Under the bonnet', pos: [0, 1.2, 1.6],
    text: 'Alternator, starter, battery, earths. Tested under load, not just eyeballed.' },
  { id: 'dash', title: 'Behind the dash', pos: [0, 1.3, 0.5],
    text: 'Scan-tool diagnostics, modules, fuses and the wiring nobody wants to chase.' },
  { id: 'cabin', title: 'Cabin and air con', pos: [0.95, 1.55, -0.3],
    text: 'Licensed re-gas, leak testing, blower and compressor faults. Cold air, fast.' },
  { id: 'roof', title: 'Roof and accessories', pos: [0, 1.95, -0.06],
    text: 'Light bars, driving lights, UHF aerials and winches. Fused and loomed, not tapped into the nearest wire.' },
  { id: 'tray', title: 'Tray and canopy', pos: [0, 1.14, -2.0],
    text: 'Dual battery, DC-DC, solar, fridge and lighting. Fused, loomed and labelled.' },
  { id: 'tow', title: 'Rear and towing', pos: [0, 0.6, -3.0],
    text: 'Trailer plugs, brake controllers, reverse cameras and lighting done properly.' },
]

/* ---------- geometry ---------- */

type Face = { idx: number[]; n: Vec3; edge: number }

const V: Vec3[] = []
const F: Face[] = []

function vert(x: number, y: number, z: number) {
  V.push([x, y, z])
  return V.length - 1
}

function centroid(idx: number[]): Vec3 {
  let x = 0, y = 0, z = 0
  for (const i of idx) { x += V[i][0]; y += V[i][1]; z += V[i][2] }
  return [x / idx.length, y / idx.length, z / idx.length]
}

/** Adds a face with its normal turned to point away from the part's centre. */
function face(idx: number[], origin: Vec3, edge = 1) {
  const [ax, ay, az] = V[idx[0]]
  const [bx, by, bz] = V[idx[1]]
  const [cx, cy, cz] = V[idx[2]]
  let n: Vec3 = [
    (by - ay) * (cz - az) - (bz - az) * (cy - ay),
    (bz - az) * (cx - ax) - (bx - ax) * (cz - az),
    (bx - ax) * (cy - ay) - (by - ay) * (cx - ax),
  ]
  const len = Math.hypot(n[0], n[1], n[2]) || 1
  n = [n[0] / len, n[1] / len, n[2] / len]
  const c = centroid(idx)
  const out: Vec3 = [c[0] - origin[0], c[1] - origin[1], c[2] - origin[2]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0) n = [-n[0], -n[1], -n[2]]
  F.push({ idx, n, edge })
}

/** An axis-aligned box, optionally tapered toward the top (roof, greenhouse). */
function box(
  x: number, y0: number, y1: number, z0: number, z1: number,
  edge = 1, topX = x, topZ0 = z0, topZ1 = z1, offX = 0,
) {
  const b = [
    vert(offX - x, y0, z0), vert(offX + x, y0, z0),
    vert(offX + x, y0, z1), vert(offX - x, y0, z1),
  ]
  const t = [
    vert(offX - topX, y1, topZ0), vert(offX + topX, y1, topZ0),
    vert(offX + topX, y1, topZ1), vert(offX - topX, y1, topZ1),
  ]
  const o: Vec3 = [offX, (y0 + y1) / 2, (z0 + z1) / 2]
  face([b[0], b[1], b[2], b[3]], o, edge)
  face([t[0], t[1], t[2], t[3]], o, edge)
  face([b[3], b[2], t[2], t[3]], o, edge)
  face([b[0], b[1], t[1], t[0]], o, edge)
  face([b[0], b[3], t[3], t[0]], o, edge)
  face([b[1], b[2], t[2], t[1]], o, edge)
}

const HALF = 0.9275
const SILL = 0.45
const BELT = 1.22
const BONNET = 1.16
const ROOF = 1.815
const Z_NOSE = 2.4425
const Z_COWL = 0.6425
const Z_ROOF_F = 0.0925
const Z_ROOF_R = -1.0075
const Z_CAB_R = -1.2575
const Z_TAIL = -2.8825
const AXLE_F = 1.5425
const AXLE_R = -1.5425
const TYRE = 0.4

// front body: guards and bonnet
box(HALF, SILL, BONNET, Z_COWL, Z_NOSE)
// cab lower, up to the window line
box(HALF, SILL, BELT, Z_CAB_R, Z_COWL)
// greenhouse: narrower and shorter at the roof, which gives the screen its rake
box(0.9, BELT, ROOF, Z_CAB_R, Z_COWL, 1, 0.78, Z_ROOF_R, Z_ROOF_F)
// tray, then the raised side rails so it reads as an open tub
box(HALF, SILL, 0.98, Z_TAIL, Z_CAB_R)
box(0.075, 0.98, 1.12, Z_TAIL, Z_CAB_R, 0.6, 0.075, Z_TAIL, Z_CAB_R, -HALF + 0.075)
box(0.075, 0.98, 1.12, Z_TAIL, Z_CAB_R, 0.6, 0.075, Z_TAIL, Z_CAB_R, HALF - 0.075)
box(HALF, 0.98, 1.12, Z_TAIL, Z_TAIL + 0.13, 0.6)
box(HALF, 0.98, 1.12, Z_CAB_R - 0.13, Z_CAB_R, 0.6)
// bull bar, roof light bar, side steps, tow bar, snorkel
box(0.92, 0.5, 1.04, Z_NOSE, Z_NOSE + 0.22, 0.6)
box(0.55, ROOF, ROOF + 0.1, -0.17, 0.01, 0.6)
box(0.06, 0.38, 0.46, -1.15, 0.6, 0.6, 0.06, -1.15, 0.6, -0.98)
box(0.06, 0.38, 0.46, -1.15, 0.6, 0.6, 0.06, -1.15, 0.6, 0.98)
box(0.17, 0.33, 0.47, Z_TAIL - 0.18, Z_TAIL, 0.6)
box(0.07, BONNET, 1.87, 0.5, 0.66, 0.6, 0.07, 0.5, 0.66, 0.9)

/** A wheel: a faceted cylinder lying on the x axis. */
function wheel(cx: number, cz: number) {
  const N = 14
  const hw = 0.15
  const o: Vec3 = [cx, TYRE, cz]
  const inner: number[] = []
  const outer: number[] = []
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const y = TYRE + Math.sin(a) * TYRE
    const z = cz + Math.cos(a) * TYRE
    inner.push(vert(cx - hw, y, z))
    outer.push(vert(cx + hw, y, z))
  }
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    face([inner[i], inner[j], outer[j], outer[i]], o, 0.32)
  }
  face(inner.slice(), o, 0.45)
  face(outer.slice(), o, 0.45)
}
for (const cx of [-0.805, 0.805]) {
  wheel(cx, AXLE_F)
  wheel(cx, AXLE_R)
}

/* ---------- renderer ---------- */

export type Projected = { x: number; y: number; depth: number; front: boolean; visible: boolean }

export type Scene = {
  destroy: () => void
  onFrame: (cb: (pts: Projected[]) => void) => void
  setPaused: (paused: boolean) => void
}

const LOOK_Y = 0.92
const DIST = 7.8
/** Anything closer than this is behind the lens and gets clipped away. */
const NEAR = 0.6
/** Key light in view space: high, slightly left, and toward the camera. */
const LIGHT: Vec3 = [-0.34, 0.74, -0.58]

export function createUteScene(canvas: HTMLCanvasElement, reduced = false): Scene {
  const ctx = canvas.getContext('2d')!
  let yaw = 2.42
  let pitch = 0.26
  let dragging = false
  let paused = false
  let lastX = 0
  let lastY = 0
  let raf = 0
  let listener: ((pts: Projected[]) => void) | null = null
  let w = 0
  let h = 0

  type View = { x: number; y: number; z: number }

  function resize() {
    const r = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function toView(p: Vec3): View {
    const cy = Math.cos(yaw)
    const sy = Math.sin(yaw)
    const x1 = p[0] * cy + p[2] * sy
    const z1 = -p[0] * sy + p[2] * cy
    const y0 = p[1] - LOOK_Y
    const cp = Math.cos(pitch)
    const sp = Math.sin(pitch)
    // +pitch lifts the camera above the vehicle, so ground further away rises
    // toward the horizon rather than dropping off the bottom of the frame
    return { x: x1, y: y0 * cp + z1 * sp, z: -y0 * sp + z1 * cp + DIST }
  }

  function flatten(v: View) {
    const f = Math.min(w, h * 1.55) * 0.94
    return { x: w / 2 + (f * v.x) / v.z, y: h / 2 - (f * v.y) / v.z }
  }

  function project(p: Vec3): Projected {
    const v = toView(p)
    const s = flatten(v)
    return { x: s.x, y: s.y, depth: v.z, front: v.z < DIST, visible: v.z > NEAR }
  }

  /** Rotate a world normal through the same yaw and pitch as the camera. */
  function viewNormal(n: Vec3): Vec3 {
    const cy = Math.cos(yaw)
    const sy = Math.sin(yaw)
    const x1 = n[0] * cy + n[2] * sy
    const z1 = -n[0] * sy + n[2] * cy
    const cp = Math.cos(pitch)
    const sp = Math.sin(pitch)
    return [x1, n[1] * cp + z1 * sp, -n[1] * sp + z1 * cp]
  }

  function gridLine(a: Vec3, b: Vec3, alpha: number) {
    // walked in short steps so the part that runs past the lens simply stops
    const STEPS = 20
    for (let i = 0; i < STEPS; i++) {
      const t0 = i / STEPS
      const t1 = (i + 1) / STEPS
      const p = toView([a[0] + (b[0] - a[0]) * t0, 0, a[2] + (b[2] - a[2]) * t0])
      const q = toView([a[0] + (b[0] - a[0]) * t1, 0, a[2] + (b[2] - a[2]) * t1])
      if (p.z < 1.8 || q.z < 1.8) continue
      const fade = alpha * Math.max(0, 1 - (p.z - DIST + 5) / 11)
      if (fade <= 0.004) continue
      const s = flatten(p)
      const e = flatten(q)
      ctx.strokeStyle = `rgba(126,158,182,${fade.toFixed(3)})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(e.x, e.y)
      ctx.stroke()
    }
  }

  function draw() {
    raf = 0
    ctx.clearRect(0, 0, w, h)
    if (!dragging && !paused && !reduced) yaw += 0.0022

    const G = 5
    for (let i = -G; i <= G; i++) {
      const a = Math.max(0, 1 - Math.abs(i) / (G + 1)) * 0.16
      gridLine([i, 0, -G], [i, 0, G], a)
      gridLine([-G, 0, i], [G, 0, i], a)
    }

    const views = V.map(toView)

    const drawable = F.map((f) => {
      let z = 0
      for (const i of f.idx) z += views[i].z
      return { f, z: z / f.idx.length }
    })
      .filter((d) => {
        for (const i of d.f.idx) if (views[i].z <= NEAR) return false
        return true
      })
      .sort((a, b) => b.z - a.z)

    for (const { f, z } of drawable) {
      const n = viewNormal(f.n)
      // faces turned away from the camera are the far side of a closed shape
      if (n[2] > 0.02) continue
      const lam = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2])
      const cue = Math.max(0.45, Math.min(1, (DIST + 3.6 - z) / 6.2))
      const r = Math.round((17 + lam * 36) * cue)
      const g = Math.round((22 + lam * 48) * cue)
      const b = Math.round((31 + lam * 62) * cue)

      ctx.beginPath()
      for (let i = 0; i < f.idx.length; i++) {
        const s = flatten(views[f.idx[i]])
        if (i === 0) ctx.moveTo(s.x, s.y)
        else ctx.lineTo(s.x, s.y)
      }
      ctx.closePath()
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fill()
      ctx.strokeStyle = `rgba(198,228,242,${(0.1 + 0.34 * f.edge * cue).toFixed(3)})`
      ctx.lineWidth = f.edge > 0.9 ? 1.15 : 1
      ctx.stroke()
    }

    if (listener) listener(HOTSPOTS.map((hs) => project(hs.pos)))
    schedule()
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(draw)
  }

  function onDown(e: PointerEvent) {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return
    yaw += (e.clientX - lastX) * 0.008
    pitch = Math.max(-0.05, Math.min(0.6, pitch + (e.clientY - lastY) * 0.004))
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
    },
    onFrame(cb) { listener = cb },
    setPaused(p) { paused = p; schedule() },
  }
}
