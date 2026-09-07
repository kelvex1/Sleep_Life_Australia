'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, Inbox, CalendarDays, Search, ArrowUpRight, ArrowDownRight,
  ArrowLeft, Phone, Sparkles,
} from 'lucide-react'
import {
  Enquiry, STATUS_LABEL, STATUS_ORDER, Status,
  loadEnquiries, ref as makeRef, saveEnquiries, timeAgo,
} from '../_lib/store'

// Recharts measures its container, so it only mounts in the browser.
const RevenueChart = dynamic(() => import('./RevenueChart').then((m) => m.RevenueChart), {
  ssr: false,
  loading: () => <div style={{ height: 230 }} />,
})

type Tab = 'dashboard' | 'enquiries' | 'jobs'

const TODAY_JOBS = [
  { time: '07:45', who: 'Megan Foulis', what: 'Air con re-gas · Kent St (at her work)', tag: 'Quoted' },
  { time: '09:30', who: 'Sam Whitcombe', what: 'GU Patrol · intermittent no-start · Frenchville', tag: 'Booked' },
  { time: '11:15', who: 'Rocky Earthworks', what: 'Fleet check ×3 · Gracemere yard', tag: 'Booked' },
  { time: '14:00', who: 'Dave Kerrigan', what: 'Dual battery + DC-DC quote · Parkhurst', tag: 'New' },
]

const TAG_CLASS: Record<string, string> = {
  New: 'rmadm-t-new',
  Quoted: 'rmadm-t-quoted',
  Booked: 'rmadm-t-booked',
  Complete: 'rmadm-t-done',
}

function Spark({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points, 1)
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * 96},${46 - (p / max) * 38 - 4}`)
    .join(' ')
  return (
    <svg className="rmadm-spark" viewBox="0 0 96 46" aria-hidden>
      <polyline points={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [rows, setRows] = useState<Enquiry[]>([])
  const [q, setQ] = useState('')
  const [clock, setClock] = useState('')
  const [freshIds, setFreshIds] = useState<string[]>([])

  useEffect(() => {
    const loaded = loadEnquiries()
    setRows(loaded)
    // Anything sent from the website in the last two minutes gets the landing flash.
    setFreshIds(
      loaded
        .filter((r) => Date.now() - new Date(r.createdAt).getTime() < 120_000)
        .map((r) => r.id),
    )
  }, [])

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString('en-AU', {
          hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Brisbane',
        }),
      )
    tick()
    const t = window.setInterval(tick, 30_000)
    return () => window.clearInterval(t)
  }, [])

  function advance(id: string) {
    setRows((prev) => {
      const next = prev.map((r) => {
        if (r.id !== id) return r
        const i = STATUS_ORDER.indexOf(r.status)
        const status = STATUS_ORDER[Math.min(i + 1, STATUS_ORDER.length - 1)]
        return { ...r, status }
      })
      saveEnquiries(next)
      return next
    })
  }

  const counts = useMemo(() => {
    const by = (s: Status) => rows.filter((r) => r.status === s).length
    return {
      new: by('new'), quoted: by('quoted'), booked: by('booked'), done: by('done'),
      total: rows.length,
      pipeline: rows.filter((r) => r.status !== 'done').reduce((a, r) => a + r.value, 0),
      won: rows.filter((r) => r.status === 'done').reduce((a, r) => a + r.value, 0),
    }
  }, [rows])

  const chart = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const base = [4, 6, 5, 8, 9, 3, 2]
    const booked = [2, 4, 3, 5, 6, 2, 1]
    // Anything typed into the website form today lands on the current weekday.
    const todayIdx = (new Date().getDay() + 6) % 7
    const fromSite = rows.filter((r) => r.id.startsWith('w-')).length
    return days.map((day, i) => ({
      day,
      enquiries: base[i] + (i === todayIdx ? fromSite : 0),
      booked: booked[i],
    }))
  }, [rows])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((r) =>
      [r.name, r.phone, r.vehicle, r.service, r.notes, makeRef(r.id)]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [rows, q])

  const pipeline = STATUS_ORDER.map((s) => ({
    status: s,
    label: STATUS_LABEL[s],
    n: rows.filter((r) => r.status === s).length,
    color: { new: '#38E1FF', quoted: '#FFC24B', booked: '#F26F1F', done: '#3DDC97' }[s],
  }))

  const title = { dashboard: 'Today at a glance', enquiries: 'Enquiries', jobs: "Today's run sheet" }[tab]
  const sub = {
    dashboard: 'Everything the website sent through, plus what is booked.',
    enquiries: 'Click the arrow on a row to move it along the pipeline.',
    jobs: 'Ordered by start time. Tap a job to call the customer.',
  }[tab]

  return (
    <div className="rmadm">
      <aside className="rmadm-rail">
        <a className="rmadm-rail-brand" href="/rockhampton">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rmae/logo.svg" alt="" width={36} height={36} />
          <span>
            <b>RMAE Workshop</b>
            <span>Owner dashboard</span>
          </span>
        </a>

        <nav className="rmadm-nav">
          <button className={tab === 'dashboard' ? 'rmadm-on' : ''} onClick={() => setTab('dashboard')}>
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button className={tab === 'enquiries' ? 'rmadm-on' : ''} onClick={() => setTab('enquiries')}>
            <Inbox size={16} /> Enquiries
            <span className="rmadm-nav-count">{counts.new}</span>
          </button>
          <button className={tab === 'jobs' ? 'rmadm-on' : ''} onClick={() => setTab('jobs')}>
            <CalendarDays size={16} /> Jobs today
            <span className="rmadm-nav-count">{TODAY_JOBS.length}</span>
          </button>
        </nav>

        <div className="rmadm-rail-foot">
          <div className="rmadm-health">
            <div className="rmadm-health-row"><span>Website form</span><b>Live</b></div>
            <div className="rmadm-health-row"><span>Google listing</span><b>4.9 ★</b></div>
            <div className="rmadm-health-row"><span>Unread</span><b>{counts.new}</b></div>
          </div>
          <a className="rmadm-back" href="/rockhampton">
            <ArrowLeft size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
            Back to the website
          </a>
        </div>
      </aside>

      <main className="rmadm-main">
        <header className="rmadm-top">
          <div>
            <h1>{title}</h1>
            <p>{sub}</p>
          </div>
          <div className="rmadm-search">
            <Search size={14} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, rego, job…"
              aria-label="Search enquiries"
            />
          </div>
          <div className="rmadm-clock">
            <span className="rmadm-pulse" aria-hidden />
            {clock} AEST
          </div>
        </header>

        {tab === 'dashboard' && (
          <>
            <div className="rmadm-kpis">
              <div className="rmadm-kpi">
                <h4>New enquiries</h4>
                <div className="rmadm-kpi-val">{counts.new}</div>
                <div className="rmadm-kpi-delta rmadm-up"><ArrowUpRight size={12} /> waiting on a call back</div>
                <Spark points={[2, 3, 2, 4, 5, 3, counts.new || 1]} color="#38E1FF" />
              </div>
              <div className="rmadm-kpi">
                <h4>Booked this week</h4>
                <div className="rmadm-kpi-val">{counts.booked + counts.done}</div>
                <div className="rmadm-kpi-delta rmadm-up"><ArrowUpRight size={12} /> +18% on last week</div>
                <Spark points={[3, 4, 4, 6, 5, 7, 8]} color="#F26F1F" />
              </div>
              <div className="rmadm-kpi">
                <h4>Quoted &amp; open</h4>
                <div className="rmadm-kpi-val">${counts.pipeline.toLocaleString('en-AU')}</div>
                <div className="rmadm-kpi-delta rmadm-up"><ArrowUpRight size={12} /> {counts.quoted + counts.booked} jobs live</div>
                <Spark points={[4, 5, 7, 6, 8, 9, 9]} color="#FFC24B" />
              </div>
              <div className="rmadm-kpi">
                <h4>Avg. call back</h4>
                <div className="rmadm-kpi-val">41m</div>
                <div className="rmadm-kpi-delta rmadm-down"><ArrowDownRight size={12} /> 12m faster than last month</div>
                <Spark points={[9, 8, 8, 6, 5, 5, 4]} color="#3DDC97" />
              </div>
            </div>

            <div className="rmadm-cols">
              <section className="rmadm-panel">
                <div className="rmadm-panel-head">
                  <h3>Enquiries vs booked</h3>
                  <span className="rmadm-hint">last 7 days</span>
                </div>
                <div className="rmadm-panel-body">
                  <RevenueChart data={chart} />
                  <div className="rmadm-legend">
                    <span><i style={{ background: '#F26F1F' }} />Enquiries in</span>
                    <span><i style={{ background: '#38E1FF' }} />Converted to a booking</span>
                  </div>
                  <div className="rmadm-note">
                    <Sparkles size={14} />
                    <span>
                      <b>Try it:</b> send an enquiry from the website form and it appears in this
                      dashboard straight away — no refresh, no spreadsheet.
                    </span>
                  </div>
                </div>
              </section>

              <div style={{ display: 'grid', gap: '.85rem', alignContent: 'start' }}>
                <section className="rmadm-panel">
                  <div className="rmadm-panel-head"><h3>Pipeline</h3><span className="rmadm-hint">{counts.total} total</span></div>
                  <div className="rmadm-panel-body">
                    <div className="rmadm-pipe">
                      {pipeline.map((p) => (
                        <div className="rmadm-pipe-row" key={p.status}>
                          <div className="rmadm-pipe-top"><span>{p.label}</span><b>{p.n}</b></div>
                          <div className="rmadm-pipe-bar">
                            <div
                              className="rmadm-pipe-fill"
                              style={{
                                width: `${counts.total ? (p.n / counts.total) * 100 : 0}%`,
                                background: p.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rmadm-panel">
                  <div className="rmadm-panel-head"><h3>Next up</h3><span className="rmadm-hint">today</span></div>
                  <div className="rmadm-panel-body">
                    <div className="rmadm-jobs">
                      {TODAY_JOBS.slice(0, 3).map((j) => (
                        <div className="rmadm-job" key={j.time}>
                          <span className="rmadm-job-time">{j.time}</span>
                          <span><b>{j.who}</b><span>{j.what}</span></span>
                          <span className={`rmadm-tag ${TAG_CLASS[j.tag]}`}><i />{j.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        {tab === 'enquiries' && (
          <section className="rmadm-panel">
            <div className="rmadm-panel-head">
              <h3>All enquiries</h3>
              <span className="rmadm-hint">{filtered.length} shown</span>
            </div>
            <div className="rmadm-panel-body rmadm-flush">
              {filtered.length === 0 ? (
                <div className="rmadm-empty">
                  <Inbox size={24} />
                  <span>Nothing matches “{q}”.</span>
                </div>
              ) : (
                <div className="rmadm-tbl-wrap">
                  <table className="rmadm-tbl">
                    <thead>
                      <tr>
                        <th>Customer</th><th>Vehicle</th><th>Job</th><th>Source</th>
                        <th>Received</th><th>Status</th><th />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr key={r.id} className={freshIds.includes(r.id) ? 'rmadm-fresh' : undefined}>
                          <td className="rmadm-who">
                            <b>{r.name}</b>
                            <span>{r.phone} · {makeRef(r.id)}</span>
                          </td>
                          <td>{r.vehicle}</td>
                          <td>
                            {r.service}
                            {r.notes && (
                              <div style={{ color: 'var(--text-3)', fontSize: '.78rem', marginTop: 2, maxWidth: 260 }}>
                                {r.notes}
                              </div>
                            )}
                          </td>
                          <td className="rmadm-muted">{r.source}</td>
                          <td className="rmadm-muted">{timeAgo(r.createdAt)}</td>
                          <td>
                            <span className={`rmadm-tag ${TAG_CLASS[STATUS_LABEL[r.status]]}`}>
                              <i />{STATUS_LABEL[r.status]}
                            </span>
                            {r.urgency === 'today' && r.status !== 'done' && (
                              <span className="rmadm-tag rmadm-t-urgent" style={{ marginLeft: 6 }}><i />Today</span>
                            )}
                          </td>
                          <td>
                            {r.status !== 'done' && (
                              <button className="rmadm-step-btn" onClick={() => advance(r.id)}>
                                Move to {STATUS_LABEL[STATUS_ORDER[STATUS_ORDER.indexOf(r.status) + 1]]}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === 'jobs' && (
          <section className="rmadm-panel">
            <div className="rmadm-panel-head">
              <h3>Run sheet</h3>
              <span className="rmadm-hint">{new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="rmadm-panel-body">
              <div className="rmadm-jobs">
                {TODAY_JOBS.map((j) => (
                  <div className="rmadm-job" key={j.time}>
                    <span className="rmadm-job-time">{j.time}</span>
                    <span><b>{j.who}</b><span>{j.what}</span></span>
                    <span style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                      <span className={`rmadm-tag ${TAG_CLASS[j.tag]}`}><i />{j.tag}</span>
                      <a className="rmadm-step-btn" href="tel:+61427667996">
                        <Phone size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
                        Call
                      </a>
                    </span>
                  </div>
                ))}
              </div>
              <div className="rmadm-note">
                <Sparkles size={14} />
                <span>
                  <b>Where this goes next:</b> the run sheet can pull straight from the calendar,
                  text the customer a &ldquo;on my way&rdquo; message, and drop the invoice into
                  Xero when the job is marked complete.
                </span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
