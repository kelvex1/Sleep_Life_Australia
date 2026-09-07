const ITEMS = [
  'Auto electrical', 'Air conditioning', 'Dual battery systems', '12V fitouts',
  'Diagnostics', 'Rewiring', 'Starting & charging', 'Trailer wiring',
  'Light bars & winches', 'Fleet servicing',
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
