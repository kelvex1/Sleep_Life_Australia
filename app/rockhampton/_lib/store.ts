'use client'

/**
 * Demo enquiry store.
 *
 * The site is a static export, so there is no server to post to. Enquiries are
 * kept in localStorage instead, which is exactly what makes the pitch land:
 * the enquiry someone types into the hero form shows up in the admin dashboard
 * a click later. Swapping this for a real endpoint is a one-file change.
 */

export type Status = 'new' | 'quoted' | 'booked' | 'done'

export type Enquiry = {
  id: string
  name: string
  phone: string
  email: string
  vehicle: string
  service: string
  urgency: 'today' | 'this-week' | 'planning'
  notes: string
  createdAt: string
  status: Status
  value: number
  source: 'Website form' | 'Google' | 'Facebook' | 'Phone' | 'Referral'
}

const KEY = 'rmae.enquiries.v1'

export const STATUS_ORDER: Status[] = ['new', 'quoted', 'booked', 'done']

export const STATUS_LABEL: Record<Status, string> = {
  new: 'New',
  quoted: 'Quoted',
  booked: 'Booked',
  done: 'Complete',
}

export function ref(id: string) {
  const tail = id.replace(/[^a-z0-9]/gi, '').slice(-5).toUpperCase()
  return `RMAE-${tail.padStart(5, '0')}`
}

/** Seeded rows so the dashboard never looks empty in front of a client. */
export function seedEnquiries(): Enquiry[] {
  const now = Date.now()
  const hrs = (h: number) => new Date(now - h * 3600_000).toISOString()
  return [
    {
      id: 's-1001', name: 'Dave Kerrigan', phone: '0412 884 210', email: 'dave.k@example.com',
      vehicle: '2019 Toyota Hilux SR5', service: 'Dual battery system', urgency: 'this-week',
      notes: 'Wants a DC-DC charger and Anderson plug for the camper.',
      createdAt: hrs(3), status: 'new', value: 1450, source: 'Website form',
    },
    {
      id: 's-1002', name: 'Megan Foulis', phone: '0433 190 776', email: 'megan.f@example.com',
      vehicle: '2015 Mazda CX-5', service: 'Air conditioning re-gas', urgency: 'today',
      notes: 'Blowing warm. Parked at work in Kent St all day.',
      createdAt: hrs(6), status: 'quoted', value: 320, source: 'Google',
    },
    {
      id: 's-1003', name: 'Rocky Earthworks', phone: '0455 022 118', email: 'ops@example.com',
      vehicle: 'Kenworth T659 (fleet x3)', service: 'Fleet electrical service', urgency: 'planning',
      notes: 'Quarterly check on three prime movers. On-site at Gracemere.',
      createdAt: hrs(26), status: 'booked', value: 2760, source: 'Referral',
    },
    {
      id: 's-1004', name: 'Sam Whitcombe', phone: '0407 613 402', email: 'sam.w@example.com',
      vehicle: '2008 Nissan Patrol GU', service: 'Auto electrical diagnostics', urgency: 'today',
      notes: 'Intermittent no-start, suspect ignition switch or earth strap.',
      createdAt: hrs(31), status: 'booked', value: 480, source: 'Facebook',
    },
    {
      id: 'ss-1005', name: 'Priya Raman', phone: '0421 550 903', email: 'priya.r@example.com',
      vehicle: '2021 Isuzu D-Max', service: '12V camper fitout', urgency: 'planning',
      notes: 'Full canopy fitout — fridge, lighting, inverter, solar.',
      createdAt: hrs(50), status: 'done', value: 3180, source: 'Website form',
    },
    {
      id: 's-1006', name: 'Trent Mabo', phone: '0438 771 245', email: 'trent.m@example.com',
      vehicle: '2013 Ford Ranger PX', service: 'Trailer wiring & lights', urgency: 'this-week',
      notes: 'New 7-pin flat plug plus a reverse camera while it is in.',
      createdAt: hrs(72), status: 'done', value: 640, source: 'Phone',
    },
  ]
}

export function loadEnquiries(): Enquiry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) {
      const seeded = seedEnquiries()
      window.localStorage.setItem(KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Enquiry[]) : seedEnquiries()
  } catch {
    return seedEnquiries()
  }
}

export function saveEnquiries(rows: Enquiry[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rows))
  } catch {
    /* private browsing — the demo still works, it just will not persist */
  }
}

export function addEnquiry(e: Omit<Enquiry, 'id' | 'createdAt' | 'status' | 'value' | 'source'>) {
  const row: Enquiry = {
    ...e,
    id: `w-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    value: 0,
    source: 'Website form',
  }
  const rows = [row, ...loadEnquiries()]
  saveEnquiries(rows)
  return row
}

export function timeAgo(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const h = Math.round(mins / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
