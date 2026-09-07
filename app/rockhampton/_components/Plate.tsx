'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import type { Shot } from '../_lib/media'

/**
 * An image slot that is designed before it is filled. The plate underneath
 * carries the brief for the shot; the photograph fades in over it only once
 * it has actually decoded, so a blocked or missing file leaves a labelled
 * card rather than a broken image.
 */
export function Plate({ shot, className }: { shot: Shot; className?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure className={`rmae-plate${className ? ' ' + className : ''}`}>
      <div className="rmae-plate-slot">
        <Camera size={20} strokeWidth={1.8} aria-hidden />
        <b>Photo to come</b>
        <span>{shot.note}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.src}
        alt={shot.alt}
        loading="lazy"
        decoding="async"
        className={loaded ? 'rmae-plate-on' : undefined}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      {loaded && (
        <figcaption>
          <i aria-hidden />
          {shot.caption}
        </figcaption>
      )}
    </figure>
  )
}
