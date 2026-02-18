import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read our privacy policy to understand how Sleep Life Australia collects, uses, and protects your personal and medical information.',
  openGraph: {
    title: 'Privacy Policy | Sleep Life Australia',
    description: 'Our commitment to protecting your privacy and personal information.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
