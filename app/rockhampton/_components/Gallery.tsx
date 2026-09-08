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
            The rig that
            <br />
            <em>turns up</em>
          </h2>
          <p className="rmae-lede">
            A fully kitted dual cab, so the job gets finished where the vehicle is parked.
            These are stand-in images, not photos of his van or his jobs. Every slot is
            sized and captioned and swaps straight out for the real thing.
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
