import type { Metadata } from 'next'
import './rmae.css'

export const metadata: Metadata = {
  title: 'Rockhampton Mobile Auto Electrics | 12V, air con and diagnostics that come to you',
  description:
    'Mobile auto electrical service across Rockhampton and Central Queensland. Air conditioning, scan tool diagnostics, harness repair, accessory installation, dual battery and solar charging, alternators, electric brake controls, servicing and mechanical repairs.',
}

export default function RockhamptonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
