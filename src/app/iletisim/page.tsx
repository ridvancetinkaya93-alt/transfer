import type { Metadata } from 'next';
import { Suspense } from 'react';
import IletisimClient from './IletisimClient';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'RCetinkaya Turizm ile iletişime geçin. Villa kiralama, VIP transfer ve özel organizasyon talepleriniz için bize ulaşın.',
};

export default function IletisimPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 'var(--nav-height)', minHeight: '50vh' }} />}>
      <IletisimClient />
    </Suspense>
  );
}
