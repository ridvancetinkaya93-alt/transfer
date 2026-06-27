import type { Metadata } from 'next';
import { Suspense } from 'react';
import GirisClient from './GirisClient';

export const metadata: Metadata = {
  title: 'Giriş Yap',
  description: 'RCetinkaya Turizm müşteri hesabınıza giriş yapın.',
};

export default function GirisPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Yükleniyor...</main>}>
      <GirisClient />
    </Suspense>
  );
}
