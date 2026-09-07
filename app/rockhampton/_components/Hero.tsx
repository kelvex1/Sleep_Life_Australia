'use client'

import { Fragment } from 'react'
import { Phone, Star, MapPin, Zap } from 'lucide-react'
import { EnquiryForm } from './EnquiryForm'
import { HERO_LOCAL, HERO_REMOTE } from '../_lib/media'

const LINES = ['Mobile auto', 'electrics that', 'come to you']
const HIGHLIGHT = 2 // index of the line painted in RMAE orange

/** Splits a line into per-character spans so each letter can arc in on its own beat. */
function Line({ text, base, hot }: { text: string; base: number; hot: boolean }) {
  let i = 0
  return (
    <span className="rmae-line">
      <span className={hot ? 'rmae-volt' : undefined}>
        {text.split('').map((ch, idx) => {
          const delay = base + i * 34
          if (ch !== ' ') i += 1
          return (
            <Fragment key={idx}>
              {ch === ' ' ? (
                ' '
              ) : (
                <span className="rmae-ch" style={{ ['--cd' as string]: `${delay}ms` }}>
                  {ch}
                </span>
              )}
            </Fragment>
          )
        })}
      </span>
    </span>
  )
}

export function Hero() {
  return (
    <section className="rmae-hero" id="top">
      <div className="rmae-hero-media">
        {/* Painted gradient sits behind the clip so the hero never flashes white. */}
        <div className="rmae-hero-fallback" aria-hidden />
        <video autoPlay muted loop playsInline preload="auto" aria-hidden>
          {/* Local file wins if it exists; otherwise the browser falls through. */}
          <source src={HERO_LOCAL} type="video/mp4" />
          <source src={HERO_REMOTE} type="video/mp4" />
        </video>
      </div>

      <div className="rmae-hero-veil" aria-hidden />
      <div className="rmae-hero-grid" aria-hidden />
      <div className="rmae-hero-scan" aria-hidden />

      <svg className="rmae-scope" viewBox="0 0 900 200" preserveAspectRatio="none" aria-hidden>
        <path d="M0 100 H180 l14 -62 l16 124 l14 -92 l18 58 l12 -28 H420 l16 -74 l14 132 l16 -84 l14 26 H900" />
      </svg>

      <div className="rmae-shell rmae-hero-in">
        <div className="rmae-hero-copy">
          <span className="rmae-eyebrow">
            <MapPin size={12} strokeWidth={2.5} /> Rockhampton &amp; Central Queensland
          </span>

          <h1 className="rmae-h1">
            {LINES.map((line, i) => (
              <Line key={line} text={line} base={220 + i * 300} hot={i === HIGHLIGHT} />
            ))}
          </h1>

          <p className="rmae-hero-sub">
            Fully equipped mobile auto electrical and air conditioning service. Your driveway,
            your worksite, your yard. We turn up with the workshop on the back and fix it there.
          </p>

          <div className="rmae-hero-actions">
            <a className="rmae-btn" href="#quote">
              <Zap size={16} strokeWidth={2.6} /> Get a call back
            </a>
            <a className="rmae-btn rmae-btn-ghost" href="tel:+61427667996">
              <Phone size={16} strokeWidth={2.4} /> 0427 667 996
            </a>
          </div>

          <div className="rmae-trust">
            <div className="rmae-trust-item">
              <span className="rmae-stars" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <b>4.9</b>
              <span>from 39 Google reviews</span>
            </div>
            <div className="rmae-trust-item">
              <b>100%</b>
              <span>mobile, we come to you</span>
            </div>
            <div className="rmae-trust-item">
              <b>Sat</b>
              <span>mornings by arrangement</span>
            </div>
          </div>
        </div>

        <EnquiryForm />
      </div>

      <div className="rmae-scrollcue" aria-hidden>
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}
