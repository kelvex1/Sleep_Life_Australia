'use client'

import { useEffect, useRef, useState } from 'react'
import { Wrench, Clock3, Receipt, RotateCcw, Move3d } from 'lucide-react'
import { HOTSPOTS, createUteScene, type Projected } from '../_lib/ute3d'

const PROMISES = [
  { icon: Clock3, title: 'We turn up when we say', body: 'You get a time window and a call when the van is on its way. No all-day waiting.' },
  { icon: Receipt, title: 'A price before the spanners', body: 'Diagnosis first, then a number. You approve the work before anything gets touched.' },
  { icon: Wrench, title: 'Fixed properly, once', body: 'Loomed, fused and labelled to a standard you would be happy to open up in five years.' },
]

export function Rig() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const pins = useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const hot = HOTSPOTS[active]

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = createUteScene(el, reduced)

    // The pins are DOM buttons so they stay keyboard reachable; the scene just
    // tells us where each anchor landed on screen this frame.
    scene.onFrame((pts: Projected[]) => {
      pts.forEach((p, i) => {
        const pin = pins.current[i]
        if (!pin) return
        const scale = Math.max(0.62, Math.min(1.1, 11 / p.depth))
        pin.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`
        pin.style.opacity = p.visible ? (p.front ? '1' : '0.34') : '0'
        pin.style.pointerEvents = p.visible ? 'auto' : 'none'
        pin.style.zIndex = p.front ? '3' : '1'
      })
    })
    setReady(true)
    return () => scene.destroy()
  }, [])

  return (
    <section className="rmae-section" id="work">
      <div className="rmae-shell rmae-split">
        <div className="rmae-rig rmae-reveal">
          <div className="rmae-stage">
            <canvas ref={canvas} className="rmae-stage-canvas" aria-hidden />

            <div className={`rmae-pins${ready ? ' rmae-pins-on' : ''}`}>
              {HOTSPOTS.map((h, i) => (
                <button
                  key={h.id}
                  ref={(el) => { pins.current[i] = el }}
                  className={`rmae-pin3${i === active ? ' rmae-pin3-on' : ''}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={h.title}
                >
                  <span aria-hidden />
                </button>
              ))}
            </div>

            <div className="rmae-stage-hint">
              <Move3d size={12} strokeWidth={2.2} aria-hidden />
              Drag to spin
            </div>
            <div className="rmae-stage-tag">
              <RotateCcw size={11} strokeWidth={2.2} aria-hidden />
              Live model
            </div>
          </div>

          <div className="rmae-rig-readout">
            <span className="rmae-caret" aria-hidden />
            <span aria-live="polite">
              <b>{hot.title}:</b> {hot.text}
            </span>
          </div>
        </div>

        <div>
          <header className="rmae-section-head rmae-reveal" style={{ marginBottom: '1.4rem' }}>
            <span className="rmae-eyebrow">Front bar to towbar</span>
            <h2 className="rmae-h2">
              If it runs on volts,
              <br />
              <em>it&apos;s our problem</em>
            </h2>
            <p className="rmae-lede">
              Spin the rig and tap a point. Every one of those is a job we do at your place:
              daily drivers, tourers, trucks and machinery.
            </p>
          </header>

          <div className="rmae-checks">
            {PROMISES.map((p, i) => (
              <div className="rmae-check rmae-reveal" key={p.title} style={{ ['--d' as string]: `${i * 90}ms` }}>
                <span className="rmae-check-ico">
                  <p.icon size={16} strokeWidth={2.2} />
                </span>
                <div>
                  <b>{p.title}</b>
                  <p>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
