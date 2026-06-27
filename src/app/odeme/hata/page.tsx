import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import OdemeHataClient from './OdemeHataClient';

export const metadata: Metadata = {
  title: 'Ödeme Başarısız',
  description: 'Ödeme işlemi tamamlanamadı.',
};

export default function OdemeHataPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 'var(--nav-height)', minHeight: '50vh' }} />}>
      <OdemeHataClient />
    </Suspense>
  );
}
