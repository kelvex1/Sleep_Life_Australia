'use client'

const STEPS = [
  { n: 'Step 01', t: 'You call or send the form', d: 'Thirty seconds. Vehicle, suburb, what it is doing. That is all we need to start.' },
  { n: 'Step 02', t: 'We book a real time slot', d: 'A window that suits you: home, work or the yard. You get a heads-up call before we roll.' },
  { n: 'Step 03', t: 'Diagnosis, then a price', d: 'We find the actual fault on site and quote it before we touch anything.' },
  { n: 'Step 04', t: 'Fixed and tested there', d: 'Repaired, load-tested and tidied up. Invoice and warranty in your inbox before we leave.' },
]

export function Process() {
  return (
    <section className="rmae-section" id="process">
      <div className="rmae-shell">
        <header className="rmae-section-head rmae-reveal">
          <span className="rmae-eyebrow">How it works</span>
          <h2 className="rmae-h2">
            Four steps, <em>no towing</em>
          </h2>
        </header>

        <div className="rmae-steps">
          {STEPS.map((s, i) => (
            <article className="rmae-step rmae-reveal" key={s.n} style={{ ['--d' as string]: `${i * 110}ms` }}>
              <div className="rmae-step-n">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
