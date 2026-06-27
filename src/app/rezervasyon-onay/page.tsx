import type { Metadata } from 'next';
import { Suspense } from 'react';
import OnayClient from './OnayClient';

export const metadata: Metadata = {
  title: 'Rezervasyon Onaylandı | RCetinkaya Turizm',
  description: 'Rezervasyonunuz başarıyla tamamlandı.',
  robots: { index: false, follow: false },
};

export default function OnayPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 'var(--nav-height)', minHeight: '50vh' }} />}>
      <OnayClient />
    </Suspense>
  );
}
