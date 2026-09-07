'use client'

import { useCallback, useRef } from 'react'
import { useScrollProgress } from '../_lib/useReveal'

/**
 * The signature interaction: two wiring looms running down the page margins.
 * A dim trace is always there; the live orange-to-cyan trace is drawn by scroll
 * position, and a cyan "current" pulse chases along it continuously. Sitting in
 * the gutters keeps it out of the way of the copy at any width.
 */
const LEFT = [
  'M 4 0',
  'C 4 70, 1.5 100, 1.5 170',
  'C 1.5 240, 8 260, 8 330',
  'C 8 400, 2 420, 2 490',
  'C 2 560, 7.5 580, 7.5 650',
  'C 7.5 720, 2 740, 2 810',
  'C 2 880, 5 910, 5 1000',
].join(' ')

const RIGHT = [
  'M 96 0',
  'C 96 70, 98.5 100, 98.5 170',
  'C 98.5 240, 92 260, 92 330',
  'C 92 400, 98 420, 98 490',
  'C 98 560, 92.5 580, 92.5 650',
  'C 92.5 720, 98 740, 98 810',
  'C 98 880, 95 910, 95 1000',
].join(' ')

export function Loom() {
  const wires = useRef<(SVGPathElement | null)[]>([])

  const onProgress = useCallback((p: number) => {
    // ease the draw so it reads as current filling the wire, not a scrubber
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    for (const el of wires.current) {
      if (!el) continue
      const len = el.getTotalLength()
      el.style.strokeDasharray = `${len}`
      el.style.strokeDashoffset = `${len * (1 - Math.min(1, eased * 1.08))}`
    }
  }, [])

  useScrollProgress(onProgress)

  return (
    <div className="rmae-loom" aria-hidden>
      <svg viewBox="0 0 100 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rmae-loom-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F26F1F" />
            <stop offset="55%" stopColor="#FF8A2B" />
            <stop offset="100%" stopColor="#38E1FF" />
          </linearGradient>
        </defs>

        {[LEFT, RIGHT].map((d, i) => (
          <g key={i}>
            <path className="rmae-loom-base" d={d} vectorEffect="non-scaling-stroke" />
            <path
              ref={(el) => {
                wires.current[i] = el
              }}
              className="rmae-loom-live"
              d={d}
              vectorEffect="non-scaling-stroke"
            />
            <path className="rmae-loom-pulse" d={d} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </svg>
    </div>
  )
}
