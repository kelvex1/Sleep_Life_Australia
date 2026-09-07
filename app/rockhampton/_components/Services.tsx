'use client'

import { useCallback } from 'react'
import {
  Gauge, Snowflake, BatteryCharging, Truck, CircuitBoard, Caravan, Plug, Wrench,
} from 'lucide-react'

const SERVICES = [
  {
    icon: Gauge,
    title: 'Scan tool diagnostics',
    body: 'Live data off the scan tool instead of guesswork, so the actual fault is found before anyone spends money on parts.',
    points: ['Intermittent no-starts', 'Warning lights and modules', 'Parasitic battery drain'],
  },
  {
    icon: Snowflake,
    title: 'Air conditioning',
    body: 'Blowing warm through a Rocky summer is not a small problem. Leak testing, re-gas, compressors and condensers, on site.',
    points: ['Licensed re-gas', 'Leak detection', 'Compressor and blower faults'],
  },
  {
    icon: BatteryCharging,
    title: 'Alternators',
    body: 'Alternators, starters, batteries and the earths everyone forgets. Tested under load so it does not come back next week.',
    points: ['Alternators and starters', 'Battery and charge testing', 'Cable and earth repairs'],
  },
  {
    icon: Caravan,
    title: 'Dual battery and solar',
    body: 'Dual battery and solar charging systems for canopies, campers and caravans, wired to do a full trip.',
    points: ['DC-DC and solar', 'Anderson plugs', 'Fridge, lights, inverter'],
  },
  {
    icon: CircuitBoard,
    title: 'Harness repair',
    body: 'Chafed looms, corroded connectors and previous repairs put right, then loomed and labelled so the next person can follow it.',
    points: ['Chafed and burnt looms', 'Connector and pin repairs', 'Rewiring and fault finding'],
  },
  {
    icon: Plug,
    title: 'Accessory installation',
    body: 'Driving lights, light bars, UHF, reverse cameras and trailer plugs, installed fused and tidy rather than tapped into the nearest wire.',
    points: ['Driving lights and light bars', 'UHF and reverse cameras', 'Trailer wiring'],
  },
  {
    icon: Truck,
    title: 'Electric brake controls',
    body: 'Electric brake controllers supplied, fitted and set up with the van or trailer on the back, then tested properly.',
    points: ['Controller supply and fit', 'Trailer plugs and lighting', 'Set up and tested loaded'],
  },
  {
    icon: Wrench,
    title: 'Servicing and mechanical',
    body: 'Not just the electrical side. Servicing and mechanical repairs for commercial and light vehicles across Central Queensland.',
    points: ['Logbook and general servicing', 'Mechanical repairs', 'Commercial and light vehicles'],
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
            Everything on the side of the truck, done at your place. Servicing Central
            Queensland commercial and light vehicles, so most jobs are finished where the
            vehicle is parked: no towing bill and no day off work.
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
