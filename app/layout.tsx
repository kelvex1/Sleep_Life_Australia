import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const VoiceflowChat = dynamic(() => import('@/components/VoiceflowChat').then(mod => ({ default: mod.VoiceflowChat })), { ssr: false, loading: () => null });

export const metadata: Metadata = {
  title: 'Sleep Life Australia | Expert Sleep Health',
  description: 'Expert sleep studies, CPAP therapy, and sleep consultations across Perth and Albany. Convenient at-home sleep studies and online booking available.',
  keywords: 'sleep studies, CPAP therapy, sleep apnea, Perth sleep clinic, Albany sleep clinic, at-home sleep test',
  openGraph: {
    title: 'Sleep Life Australia | Expert Sleep Health',
    description: 'Expert sleep studies, CPAP therapy, and sleep consultations across Perth and Albany.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Suspense fallback={null}>
          <VoiceflowChat />
        </Suspense>
      </body>
    </html>
  );
}
