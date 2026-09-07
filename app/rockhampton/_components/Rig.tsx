'use client'

import { useState } from 'react'
import { Wrench, Clock3, Receipt } from 'lucide-react'

/* Hotspots are positioned against the drawing's 720x320 user space. */
const HOTSPOTS = [
  { x: 160, y: 160, title: 'Under the bonnet', text: 'Alternator, starter, battery, earths. Tested under load, not just eyeballed.' },
  { x: 288, y: 136, title: 'Behind the dash', text: 'Scan-tool diagnostics, modules, fuses and the wiring nobody wants to chase.' },
  { x: 392, y: 92, title: 'Cabin and air con', text: 'Licensed re-gas, leak testing, blower and compressor faults. Cold air, fast.' },
  { x: 388, y: 36, title: 'Roof and accessories', text: 'Light bars, driving lights, UHF aerials and winches. Fused and loomed, not tapped into the nearest wire.' },
  { x: 585, y: 176, title: 'Tray and canopy', text: 'Dual battery, DC-DC, solar, fridge and lighting. Fused, loomed and labelled.' },
  { x: 666, y: 204, title: 'Rear and towing', text: 'Trailer plugs, brake controllers, reverse cameras and lighting done properly.' },
]

const PROMISES = [
  { icon: Clock3, title: 'We turn up when we say', body: 'You get a time window and a call when the van is on its way. No all-day waiting.' },
  { icon: Receipt, title: 'A price before the spanners', body: 'Diagnosis first, then a number. You approve the work before anything gets touched.' },
  { icon: Wrench, title: 'Fixed properly, once', body: 'Loomed, fused and labelled to a standard you would be happy to open up in five years.' },
]

/* Side profile of a dual-cab 4x4 ute, set out to measured proportions rather
   than eyeballed: 5.35m long, 1.82m high, 3.09m wheelbase, 0.80m tyres, at a
   scale of 1m = 119 user units. Ground sits at y=272, roof at y=54. */
const AXLE_F = 151
const AXLE_R = 518
const AXLE_Y = 224
const TYRE = 48

const BODY =
  'M 44 218 L 44 152 C 44 142, 50 137, 62 136 L 258 132 L 324 58 ' +
  'C 326 55, 330 54, 336 54 L 449 54 C 454 54, 458 56, 460 60 ' +
  'L 484 132 L 484 142 L 678 142 L 678 218 ' +
  'L 570 218 A 52 52 0 0 0 466 218 L 203 218 A 52 52 0 0 0 99 218 Z'

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle className="rmae-rig-tyre" cx={cx} cy={AXLE_Y} r={TYRE} />
      <circle className="rmae-rig-rim" cx={cx} cy={AXLE_Y} r="29" />
      <circle className="rmae-rig-rim" cx={cx} cy={AXLE_Y} r="10" />
      {[18, 90, 162, 234, 306].map((a) => {
        const r = (a * Math.PI) / 180
        return (
          <line
            key={a}
            className="rmae-rig-spoke"
            x1={cx + Math.cos(r) * 12}
            y1={AXLE_Y + Math.sin(r) * 12}
            x2={cx + Math.cos(r) * 27}
            y2={AXLE_Y + Math.sin(r) * 27}
          />
        )
      })}
    </g>
  )
}

export function Rig() {
  const [active, setActive] = useState(0)
  const hot = HOTSPOTS[active]

  return (
    <section className="rmae-section" id="work">
      <div className="rmae-shell rmae-split">
        <div className="rmae-rig rmae-reveal">
          <svg
            className="rmae-rig-svg"
            viewBox="0 0 720 300"
            role="img"
            aria-label="Side view of a dual-cab four wheel drive ute, with the areas we work on marked"
          >
            <defs>
              <radialGradient id="rmae-rig-shadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse cx="360" cy="276" rx="306" ry="9" fill="url(#rmae-rig-shadow)" />
            <line className="rmae-rig-ground" x1="16" y1="272" x2="704" y2="272" />

            {/* bull bar, forward of the bumper */}
            <path className="rmae-rig-detail" d="M 42 152 C 33 152 30 158 30 166 L 30 206 C 30 214 34 218 42 218" />
            <line className="rmae-rig-detail" x1="30" y1="184" x2="44" y2="184" />

            {/* roof light bar */}
            <rect className="rmae-rig-detail" x="356" y="42" width="64" height="8" rx="3" />
            <line className="rmae-rig-detail" x1="366" y1="50" x2="366" y2="55" />
            <line className="rmae-rig-detail" x1="412" y1="50" x2="412" y2="55" />

            {/* snorkel up the guard */}
            <path className="rmae-rig-detail" d="M 254 130 L 250 72 C 250 66 254 63 260 63" />

            <path className="rmae-rig-body" d={BODY} />

            {/* glass */}
            <path className="rmae-rig-glass" d="M 330 62 L 362 62 L 362 124 L 268 124 Z" />
            <path className="rmae-rig-glass" d="M 368 62 L 412 62 L 412 124 L 368 124 Z" />
            <path className="rmae-rig-glass" d="M 418 62 L 448 62 L 464 124 L 418 124 Z" />

            {/* beltline, door shuts, handles, side steps, tray */}
            <line className="rmae-rig-detail" x1="266" y1="126" x2="482" y2="126" />
            <line className="rmae-rig-detail" x1="366" y1="126" x2="366" y2="214" />
            <line className="rmae-rig-detail" x1="416" y1="126" x2="416" y2="214" />
            <line className="rmae-rig-handle" x1="376" y1="140" x2="396" y2="140" />
            <line className="rmae-rig-handle" x1="426" y1="140" x2="446" y2="140" />
            <line className="rmae-rig-detail" x1="205" y1="224" x2="464" y2="224" />
            <line className="rmae-rig-detail" x1="488" y1="150" x2="674" y2="150" />
            <line className="rmae-rig-detail" x1="646" y1="144" x2="646" y2="216" />
            <path className="rmae-rig-detail" d="M 678 198 L 694 198 L 694 214 L 678 214" />
            <path className="rmae-rig-detail" d="M 640 218 L 640 232 L 656 232" />
            <path className="rmae-rig-detail" d="M 46 148 L 84 144 L 84 160 L 46 164 Z" />

            <Wheel cx={AXLE_F} />
            <Wheel cx={AXLE_R} />

            {HOTSPOTS.map((h, i) => (
              <g
                key={h.title}
                className={`rmae-hot${i === active ? ' rmae-hot-on' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActive(i)}
                aria-label={h.title}
              >
                <circle className="rmae-hot-ring" cx={h.x} cy={h.y} r="6" />
                <circle className="rmae-hot-core" cx={h.x} cy={h.y} r="4.5" />
                <circle cx={h.x} cy={h.y} r="18" fill="transparent" />
              </g>
            ))}
          </svg>

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
              Tap a point on the rig. Every one of those is a job we do at your place: daily
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
