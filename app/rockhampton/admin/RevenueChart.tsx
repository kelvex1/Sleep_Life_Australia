'use client'

import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

export type Point = { day: string; enquiries: number; booked: number }

export function RevenueChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="rmadm-g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F26F1F" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#F26F1F" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rmadm-g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38E1FF" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#38E1FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#67707F', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#67707F', fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
        <Tooltip
          contentStyle={{
            background: '#0C0F15',
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 10,
            fontSize: 12,
            color: '#EEF1F6',
          }}
          cursor={{ stroke: 'rgba(255,255,255,.15)' }}
        />
        <Area type="monotone" dataKey="enquiries" stroke="#F26F1F" strokeWidth={2} fill="url(#rmadm-g1)" name="Enquiries" />
        <Area type="monotone" dataKey="booked" stroke="#38E1FF" strokeWidth={2} fill="url(#rmadm-g2)" name="Booked" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
