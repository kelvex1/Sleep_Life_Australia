const ITEMS = [
  'Air conditioning', 'Scan tool diagnostics', 'Harness repair', 'Accessory installation',
  'Dual battery & solar charging', 'Alternators', 'Electric brake controls',
  'Servicing & mechanical repairs',
]

export function Marquee() {
  const run = (
    <span>
      {ITEMS.map((t) => (
        <span key={t} style={{ display: 'contents' }}>
          {t}
          <i aria-hidden>◆</i>
        </span>
      ))}
    </span>
  )

  return (
    <div className="rmae-marquee" aria-hidden>
      <div className="rmae-marquee-track">
        {run}
        {run}
      </div>
    </div>
  )
}
