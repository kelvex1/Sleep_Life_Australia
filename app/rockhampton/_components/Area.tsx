'use client'

const PINS = [
  { x: 50, y: 16, label: 'Yeppoon' },
  { x: 79, y: 34, label: 'Emu Park' },
  { x: 22, y: 40, label: 'Gracemere' },
  { x: 72, y: 72, label: 'Bouldercombe' },
  { x: 26, y: 76, label: 'Mount Morgan' },
]

const TOWNS = [
  'Rockhampton City', 'North Rockhampton', 'Parkhurst', 'Norman Gardens', 'Frenchville',
  'Berserker', 'Wandal', 'Gracemere', 'Yeppoon', 'Emu Park', 'Mount Morgan',
  'Bouldercombe', 'Marmor', 'Capricorn Coast',
]

export function Area() {
  return (
    <section className="rmae-section" id="area">
      <div className="rmae-shell rmae-split">
        <div className="rmae-reveal">
          <div className="rmae-radar">
            <div className="rmae-radar-ring" />
            <div className="rmae-radar-ring" />
            <div className="rmae-radar-ring" />
            <div className="rmae-radar-ring" />
            <div className="rmae-radar-sweep" />
            <div className="rmae-radar-core">
              <b>Rockhampton</b>
              <span>Base · Kent St</span>
            </div>
            {PINS.map((p) => (
              <div className="rmae-pin" key={p.label} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <i />
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <header className="rmae-section-head rmae-reveal" style={{ marginBottom: '1.2rem' }}>
            <span className="rmae-eyebrow">Where we go</span>
            <h2 className="rmae-h2">
              Rocky, the coast
              <br />
              <em>and everything between</em>
            </h2>
            <p className="rmae-lede">
              Based at Unit 2b/197 Kent Street and mobile across the region every day. Outside the
              list? Ring us — if we can get there, we will.
            </p>
          </header>
          <ul className="rmae-towns rmae-reveal">
            {TOWNS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
