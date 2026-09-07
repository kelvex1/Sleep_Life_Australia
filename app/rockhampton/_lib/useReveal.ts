'use client'

import { useEffect } from 'react'

/**
 * Adds .rmae-in to anything carrying .rmae-reveal (or .rmae-step) once it
 * enters the viewport. One observer for the whole page rather than one per
 * component, and it re-scans on mutation so late-mounted sections still animate.
 */
export function useReveal(rootSelector = '.rmae-root') {
  useEffect(() => {
    const root = document.querySelector(rootSelector)
    if (!root) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('rmae-in')
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    const scan = () => {
      root
        .querySelectorAll('.rmae-reveal:not(.rmae-in), .rmae-step:not(.rmae-in)')
        .forEach((el) => io.observe(el))
    }

    scan()
    const mo = new MutationObserver(scan)
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [rootSelector])
}

/** Normalised 0..1 scroll progress of the document, updated on rAF. */
export function useScrollProgress(onChange: (p: number) => void) {
  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      onChange(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [onChange])
}
