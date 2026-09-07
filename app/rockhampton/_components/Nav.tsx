'use client'

import { useEffect, useState } from 'react'
import { Phone, Menu, X } from 'lucide-react'

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'What we fix' },
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
    <header className={`rmae-nav${stuck ? ' rmae-nav-stuck' : ''}`}>
      <div className="rmae-shell rmae-nav-in">
        <a className="rmae-brand" href="#top" aria-label="Rockhampton Mobile Auto Electrics — home">
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
        <div
          className="rmae-shell"
          style={{ paddingBottom: '1rem', display: 'grid', gap: '.15rem' }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ padding: '.6rem .2rem', color: 'var(--text-2)' }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
