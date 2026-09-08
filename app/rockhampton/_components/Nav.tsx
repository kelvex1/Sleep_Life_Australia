'use client'

import { useEffect, useState } from 'react'
import { Phone, Menu, X, ArrowRight } from 'lucide-react'

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'What we fix' },
  { href: '#gallery', label: 'Our work' },
  { href: '#process', label: 'How it works' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#area', label: 'Service area' },
]

export function Nav() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`rmae-nav${stuck || open ? ' rmae-nav-stuck' : ''}${open ? ' rmae-nav-open' : ''}`}>
      <div className="rmae-shell rmae-nav-in">
        <a className="rmae-brand" href="#top" aria-label="Rockhampton Mobile Auto Electrics, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rmae/logo.svg" alt="" width={46} height={46} />
          <span className="rmae-brand-txt">
            <b>Rockhampton Mobile</b>
            <span>Auto Electrics · Rockhampton QLD</span>
          </span>
        </a>

        <nav className="rmae-nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="rmae-nav-call" href="tel:+61427667996">
          <i className="rmae-live-dot" aria-hidden />
          <Phone size={15} strokeWidth={2.4} aria-hidden />
          <span>0427 667 996</span>
        </a>

        <button
          className="rmae-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="rmae-shell rmae-menu" aria-label="Primary, mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="rmae-menu-actions">
            <a className="rmae-btn" href="tel:+61427667996" onClick={() => setOpen(false)}>
              <Phone size={16} strokeWidth={2.4} /> 0427 667 996
            </a>
            <a className="rmae-btn rmae-btn-ghost" href="#quote" onClick={() => setOpen(false)}>
              Get a quote <ArrowRight size={16} />
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
