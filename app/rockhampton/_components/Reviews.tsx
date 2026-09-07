'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

/** Real reviews from the business's Google listing (4.9 from 39 at time of build). */
const QUOTES = [
  {
    text: 'Workmanship, Service and Price were all outstanding.',
    who: 'A.',
    tint: '#F26F1F',
  },
  {
    text: 'Spotless workshop — a sign of well organised and quality service.',
    who: 'D.',
    tint: '#3DDC97',
  },
  {
    text: 'Answered all my questions and explained everything, all on a Saturday morning!',
    who: 'J.',
    tint: '#38E1FF',
  },
]

export function Reviews() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % QUOTES.length), 5200)
    return () => window.clearInterval(t)
  }, [])

  return (
    <section className="rmae-section" id="reviews">
      <div className="rmae-shell rmae-reviews">
        <div className="rmae-score rmae-reveal">
          <span className="rmae-eyebrow">Google reviews</span>
          <div className="rmae-score-big">4.9</div>
          <span className="rmae-stars" aria-hidden>
            {[0, 1, 2, 3, 4].map((s) => (
              <Star key={s} size={18} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          <p>39 reviews from Rockhampton locals, tradies and fleet operators.</p>
          <div className="rmae-dots">
            {QUOTES.map((q, idx) => (
              <button
                key={q.who}
                className={idx === i ? 'rmae-on' : undefined}
                onClick={() => setI(idx)}
                aria-label={`Show review ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="rmae-quotes rmae-reveal">
          {QUOTES.map((q, idx) => (
            <figure className={`rmae-quote${idx === i ? ' rmae-on' : ''}`} key={q.who}>
              <blockquote>&ldquo;{q.text}&rdquo;</blockquote>
              <footer>
                <span className="rmae-avatar" style={{ background: q.tint }} aria-hidden>
                  {q.who.replace('.', '')}
                </span>
                <span className="rmae-stars" aria-hidden>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={12} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                Verified Google review
              </footer>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
