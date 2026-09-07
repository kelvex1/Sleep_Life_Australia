import type { Metadata } from 'next'
import '../rmae.css'
import './admin.css'

export const metadata: Metadata = {
  title: 'RMAE Workshop owner dashboard',
  description: 'Demo dashboard: enquiries, pipeline and the day’s jobs for Rockhampton Mobile Auto Electrics.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
