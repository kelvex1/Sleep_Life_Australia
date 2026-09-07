'use client'

import { useState } from 'react'
import { Wrench, Clock3, Receipt } from 'lucide-react'

const HOTSPOTS = [
  { x: 78,  y: 152, title: 'Under the bonnet',  text: 'Alternator, starter, battery, earths. Tested under load, not just eyeballed.' },
  { x: 152, y: 118, title: 'Behind the dash',   text: 'Scan-tool diagnostics, modules, fuses and the wiring nobody wants to chase.' },
  { x: 214, y: 100, title: 'Cabin & air con',   text: 'Licensed re-gas, leak testing, blower and compressor faults. Cold air, fast.' },
  { x: 420, y: 116, title: 'Tray & canopy',     text: 'Dual battery, DC-DC, solar, fridge and lighting — fused, loomed and labelled.' },
  { x: 560, y: 158, title: 'Rear & towing',     text: 'Trailer plugs, brake controllers, reverse cameras and lighting done properly.' },
]

const PROMISES = [
  { icon: Clock3, title: 'We turn up when we say', body: 'You get a time window and a call when the van is on its way. No all-day waiting.' },
  { icon: Receipt, title: 'A price before the spanners', body: 'Diagnosis first, then a number. You approve the work before anything gets touched.' },
  { icon: Wrench, title: 'Fixed properly, once', body: 'Loomed, fused and labelled to a standard you would be happy to open up in five years.' },
]

export function Rig() {
  const [active, setActive] = useState(0)
  const hot = HOTSPOTS[active]

  return (
    <section className="rmae-section" id="work">
      <div className="rmae-shell rmae-split">
        <div className="rmae-rig rmae-reveal">
          <svg className="rmae-rig-svg" viewBox="0 0 600 240" role="img" aria-label="Diagram of a dual-cab ute with the areas we work on">
            {/* body */}
            <path
              className="rmae-rig-body"
              d="M28 184 L30 152 C31 142 38 137 50 136 L98 133 L134 92 C139 85 146 82 154 82 L262 82 C271 82 277 86 280 93 L300 133 L316 133 L316 128 L572 128 L572 184 Z"
            />
            {/* glass + panel lines */}
            <path className="rmae-rig-detail" d="M140 130 L166 96 L196 96 L196 130 Z" />
            <path className="rmae-rig-detail" d="M206 130 L206 96 L258 96 L276 130 Z" />
            <path className="rmae-rig-detail" d="M316 128 L316 178 M470 128 L470 178" />
            <path className="rmae-rig-detail" d="M30 160 L96 158" />
            {/* wheels */}
            <g className="rmae-rig-body">
              <circle cx="112" cy="184" r="30" />
              <circle cx="112" cy="184" r="13" />
              <circle cx="486" cy="184" r="30" />
              <circle cx="486" cy="184" r="13" />
            </g>
            <path className="rmae-rig-detail" d="M0 214 H600" />

            {HOTSPOTS.map((h, i) => (
              <g
                key={h.title}
                className={`rmae-hot${i === active ? ' rmae-hot-on' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActive(i)}
                aria-label={h.title}
              >
                <circle className="rmae-hot-ring" cx={h.x} cy={h.y} r="6" />
                <circle className="rmae-hot-core" cx={h.x} cy={h.y} r="4.5" />
                <circle cx={h.x} cy={h.y} r="17" fill="transparent" />
              </g>
            ))}
          </svg>

          <div className="rmae-rig-readout">
            <span className="rmae-caret" aria-hidden />
            <span aria-live="polite">
              <b>{hot.title}</b> — {hot.text}
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
              Tap a point on the rig. Every one of those is a job we do at your place — daily
              drivers, tourers, trucks and machinery.
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
