'use client'

import { Plate } from './Plate'
import { GALLERY } from '../_lib/media'

export function Gallery() {
  return (
    <section className="rmae-section" id="gallery">
      <div className="rmae-shell">
        <header className="rmae-section-head rmae-reveal">
          <span className="rmae-eyebrow">On the job</span>
          <h2 className="rmae-h2">
            The van, the bench,
            <br />
            <em>and the work itself</em>
          </h2>
          <p className="rmae-lede">
            Real jobs around Rockhampton and the Capricorn Coast. Every slot here is sized and
            captioned, ready for your own photos to drop straight in.
          </p>
        </header>

        <div className="rmae-gallery rmae-reveal">
          {GALLERY.map((shot) => (
            <Plate key={shot.id} shot={shot} />
          ))}
        </div>
      </div>
    </section>
  )
}
