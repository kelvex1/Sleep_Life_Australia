import type { Metadata } from 'next'
import './rmae.css'

export const metadata: Metadata = {
  title: 'Rockhampton Mobile Auto Electrics — 12V, air con & diagnostics that come to you',
  description:
    'Mobile auto electrical and air conditioning service across Rockhampton and Central Queensland. Dual battery systems, 12V fitouts, diagnostics, rewiring and fleet work — on site, at your place.',
}

export default function RockhamptonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
