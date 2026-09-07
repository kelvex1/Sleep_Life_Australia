'use client'

import { useCallback } from 'react'
import {
  Gauge, Snowflake, BatteryCharging, Truck, CircuitBoard, Caravan,
} from 'lucide-react'

const SERVICES = [
  {
    icon: Gauge,
    title: 'Diagnostics & fault finding',
    body: 'Scan tools, wiring diagrams and a meter — not guesswork. We find the actual fault before anyone spends money on parts.',
    points: ['Intermittent no-starts', 'Warning lights & modules', 'Parasitic battery drain'],
  },
  {
    icon: Snowflake,
    title: 'Auto air conditioning',
    body: 'Blowing warm in a Rocky summer is not a small problem. Leak testing, re-gas, compressors and condensers, on site.',
    points: ['Licensed re-gas', 'Leak detection', 'Compressor & condenser'],
  },
  {
    icon: BatteryCharging,
    title: 'Starting & charging',
    body: 'Batteries, alternators, starters and the earths everyone forgets. Tested properly so it does not come back next week.',
    points: ['Alternator & starter', 'Battery testing', 'Earth & cable repairs'],
  },
  {
    icon: Caravan,
    title: 'Dual battery & 12V fitouts',
    body: 'Canopies, campers, caravans and tourers wired to do a full trip — DC-DC charging, solar, fridges, lighting, inverters.',
    points: ['DC-DC & solar', 'Anderson plugs', 'Fridge, lights, inverter'],
  },
  {
    icon: CircuitBoard,
    title: 'Rewiring & accessories',
    body: 'Light bars, winches, UHF, cameras and trailer plugs installed so they are fused, loomed and tidy behind the dash.',
    points: ['Light bars & winches', 'Reverse cameras', 'Trailer wiring'],
  },
  {
    icon: Truck,
    title: 'Fleet & heavy vehicle',
    body: 'Trucks, earthmoving and ag gear kept moving with scheduled electrical servicing at your yard or on the job.',
    points: ['On-site servicing', 'Scheduled fleet checks', 'Breakdown support'],
  },
]

export function Services() {
  // Cheap pointer-tracked glow + tilt. No library, no layout thrash.
  const onMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-3px)`
  }, [])

  const onLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = ''
  }, [])

  return (
    <section className="rmae-section" id="services">
      <div className="rmae-shell">
        <header className="rmae-section-head rmae-reveal">
          <span className="rmae-eyebrow">What we do</span>
          <h2 className="rmae-h2">
            Everything electrical,
            <br />
            <em>without the tow truck</em>
          </h2>
          <p className="rmae-lede">
            One van, one sparky, the full kit. Most jobs are finished where the vehicle is
            parked — which means no towing bill and no day off work.
          </p>
        </header>

        <div className="rmae-grid-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="rmae-svc rmae-reveal"
              style={{ ['--d' as string]: `${i * 70}ms` }}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
            >
              <svg className="rmae-svc-circuit" viewBox="0 0 150 150" aria-hidden>
                <path d="M10 40 H60 V10 M60 40 H100 V80 H140 M20 90 H70 V130 H130 M100 10 V50 H130" />
                <circle cx="60" cy="40" r="2.6" fill="#38E1FF" stroke="none" />
                <circle cx="100" cy="80" r="2.6" fill="#38E1FF" stroke="none" />
                <circle cx="70" cy="130" r="2.6" fill="#38E1FF" stroke="none" />
              </svg>

              <span className="rmae-svc-ico">
                <s.icon size={22} strokeWidth={2} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <span className="rmae-svc-num" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
