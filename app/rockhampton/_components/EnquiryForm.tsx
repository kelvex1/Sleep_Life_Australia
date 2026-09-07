'use client'

import { useState } from 'react'
import { ArrowRight, Check, ShieldCheck, Loader2 } from 'lucide-react'
import { addEnquiry, ref as makeRef } from '../_lib/store'

const SERVICES = [
  'Air conditioning',
  'Scan tool diagnostics',
  'Harness repair',
  'Accessory installation',
  'Dual battery & solar charging',
  'Alternators, starting & charging',
  'Electric brake controls',
  'Servicing & mechanical repairs',
  'Something else',
]

type Errors = Partial<Record<'name' | 'phone' | 'service', string>>

export function EnquiryForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [reference, setReference] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    service: '',
    urgency: 'this-week' as 'today' | 'this-week' | 'planning',
    notes: '',
  })

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (form.name.trim().length < 2) next.name = 'Tell us who to ask for.'
    if (form.phone.replace(/\D/g, '').length < 8) next.phone = 'We need a number to call you back on.'
    if (!form.service) next.service = 'Pick the closest one. We will sort the detail on the phone.'
    setErrors(next)
    if (Object.keys(next).length) return

    setState('sending')
    // No server in a static export: the enquiry lands in the dashboard instead.
    window.setTimeout(() => {
      const row = addEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        vehicle: form.vehicle.trim() || 'Not supplied',
        service: form.service,
        urgency: form.urgency,
        notes: form.notes.trim(),
      })
      setReference(makeRef(row.id))
      setState('sent')
    }, 850)
  }

  if (state === 'sent') {
    return (
      <div className="rmae-card" id="quote">
        <div className="rmae-sent">
          <div className="rmae-sent-ring">
            <Check size={30} strokeWidth={2.6} />
          </div>
          <h4>Booked in the queue</h4>
          <p>
            Thanks {form.name.split(' ')[0]}, your job is sitting in the workshop dashboard now.
            Expect a call back on {form.phone}.
          </p>
          <code>{reference}</code>
          <a className="rmae-btn rmae-btn-ghost" href="/rockhampton/admin">
            See it land in the dashboard <ArrowRight size={16} />
          </a>
          <button
            style={{ fontSize: '.78rem', color: 'var(--text-3)' }}
            onClick={() => setState('idle')}
          >
            Send another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rmae-card" id="quote">
      <div className="rmae-card-head">
        <div>
          <h3>Get a straight answer</h3>
          <p>Tell us the vehicle and the fault. We&apos;ll call you back with a price, not a runaround.</p>
        </div>
        <span className="rmae-chip">
          <i className="rmae-live-dot" aria-hidden />
          Open now
        </span>
      </div>

      <form className="rmae-form" onSubmit={onSubmit} noValidate>
        <div className="rmae-row">
          <div className={`rmae-field${errors.name ? ' rmae-bad' : ''}`}>
            <label htmlFor="rmae-name">Your name</label>
            <input id="rmae-name" value={form.name} onChange={set('name')} placeholder="Dave" autoComplete="name" />
            {errors.name && <span className="rmae-err">{errors.name}</span>}
          </div>
          <div className={`rmae-field${errors.phone ? ' rmae-bad' : ''}`}>
            <label htmlFor="rmae-phone">Mobile</label>
            <input id="rmae-phone" value={form.phone} onChange={set('phone')} placeholder="0412 345 678" inputMode="tel" autoComplete="tel" />
            {errors.phone && <span className="rmae-err">{errors.phone}</span>}
          </div>
        </div>

        <div className="rmae-row">
          <div className="rmae-field">
            <label htmlFor="rmae-email">Email (optional)</label>
            <input id="rmae-email" value={form.email} onChange={set('email')} placeholder="you@example.com" inputMode="email" autoComplete="email" />
          </div>
          <div className="rmae-field">
            <label htmlFor="rmae-vehicle">Vehicle</label>
            <input id="rmae-vehicle" value={form.vehicle} onChange={set('vehicle')} placeholder="2019 Hilux SR5" />
          </div>
        </div>

        <div className={`rmae-field${errors.service ? ' rmae-bad' : ''}`}>
          <label htmlFor="rmae-service">What do you need?</label>
          <select id="rmae-service" value={form.service} onChange={set('service')}>
            <option value="">Choose a job type…</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.service && <span className="rmae-err">{errors.service}</span>}
        </div>

        <div className="rmae-field">
          <label htmlFor="rmae-urgency">How soon?</label>
          <select id="rmae-urgency" value={form.urgency} onChange={set('urgency')}>
            <option value="today">Today, it&apos;s off the road</option>
            <option value="this-week">This week</option>
            <option value="planning">Just planning / after a price</option>
          </select>
        </div>

        <div className="rmae-field">
          <label htmlFor="rmae-notes">What&apos;s it doing? (optional)</label>
          <textarea id="rmae-notes" value={form.notes} onChange={set('notes')} placeholder="Won't crank in the mornings, clicks once then nothing…" />
        </div>

        <div className="rmae-form-foot">
          <small>
            <ShieldCheck size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
            No spam. Straight to the workshop.
          </small>
          <button className="rmae-btn" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? (
              <>
                <Loader2 size={16} className="rmae-spin" /> Sending…
              </>
            ) : (
              <>
                Send it through <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
