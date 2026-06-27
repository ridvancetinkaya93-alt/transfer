import type { Metadata } from 'next';
import { Suspense } from 'react';
import VillalarClient from './VillalarClient';

export const metadata: Metadata = {
  title: 'Villalar | Türkiye\'nin En Lüks Villa Portföyü',
  description: 'Fethiye, Bodrum, Antalya, Kalkan ve Kaş\'ta 200\'den fazla lüks villa. Filtreleyerek hayalinizdeki villayı bulun.',
};

export default function VillalarPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 'var(--nav-height)', minHeight: '50vh' }} />}>
      <VillalarClient />
    </Suspense>
  );
}
