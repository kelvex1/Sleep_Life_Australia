'use client'

import { Phone } from 'lucide-react'

/**
 * The fixed phone-only action bar. It has to live outside the z-indexed
 * content wrapper in page.tsx: inside it, the bar's z-index is scoped to that
 * wrapper's stacking context and the hero's enquiry card paints over it.
 */
export function CallBar() {
  return (
    <div className="rmae-callbar">
      <a className="rmae-btn" href="tel:+61427667996">
        <Phone size={16} strokeWidth={2.4} /> Call now
      </a>
      <a className="rmae-btn rmae-btn-ghost" href="#quote">
        Get a quote
      </a>
    </div>
  )
}
