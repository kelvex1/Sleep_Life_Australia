'use client'

import { useEffect, useRef, useState } from 'react'

const R = 50
const C = 2 * Math.PI * R

const GAUGES = [
  { label: 'Google rating', value: 4.9, max: 5, display: '4.9', unit: 'out of 5' },
  { label: 'Reviews', value: 39, max: 50, display: '39', unit: 'and counting' },
  { label: 'Jobs done on site', value: 92, max: 100, display: '92%', unit: 'no tow needed' },
  { label: 'Call-back time', value: 78, max: 100, display: '<1h', unit: 'business hours' },
]

export function Cluster() {
  const box = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLive(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="rmae-shell">
      <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="rmae-gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F26F1F" />
            <stop offset="100%" stopColor="#38E1FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="rmae-cluster rmae-reveal" ref={box}>
        {GAUGES.map((g) => {
          const pct = live ? Math.min(1, g.value / g.max) : 0
          return (
            <div className="rmae-gauge" key={g.label}>
              <div className="rmae-gauge-dial">
                <svg viewBox="0 0 118 118" width="118" height="118">
                  <circle className="rmae-gauge-track" cx="59" cy="59" r={R} />
                  <circle
                    className="rmae-gauge-arc"
                    cx="59"
                    cy="59"
                    r={R}
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - pct * 0.82)}
                  />
                </svg>
                <span className="rmae-gauge-val">{g.display}</span>
              </div>
              <b>{g.label}</b>
              <span>{g.unit}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
