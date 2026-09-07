'use client'

import { Nav } from './_components/Nav'
import { Hero } from './_components/Hero'
import { Marquee } from './_components/Marquee'
import { Loom } from './_components/Loom'
import { Services } from './_components/Services'
import { Cluster } from './_components/Cluster'
import { Rig } from './_components/Rig'
import { Process } from './_components/Process'
import { Reviews } from './_components/Reviews'
import { Area } from './_components/Area'
import { Closing } from './_components/Closing'
import { useReveal } from './_lib/useReveal'

export default function RockhamptonPage() {
  useReveal()

  return (
    <main className="rmae-root">
      <div className="rmae-grain" aria-hidden />
      <Nav />
      <Hero />
      <Marquee />

      {/* Everything below the fold shares one scroll-driven wiring loom. */}
      <div style={{ position: 'relative' }}>
        <Loom />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Services />
          <section className="rmae-section" style={{ paddingTop: 0 }}>
            <Cluster />
          </section>
          <Rig />
          <Process />
          <Reviews />
          <Area />
          <Closing />
        </div>
      </div>
    </main>
  )
}
