import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getAuthenticatedUser } from '@/lib/auth/customer';
import ReservasyonTakibiClient from './ReservasyonTakibiClient';

export const metadata: Metadata = {
  title: 'Rezervasyon Takibi | Rezervasyonunuzu Sorgulayın',
  description: 'Rezervasyon kodunuz ile rezervasyonunuzun durumunu, detaylarını ve ödeme bilgilerini sorgulayın.',
  robots: { index: false, follow: false },
};

export default async function ReservasyonTakibiPage() {
  const user = await getAuthenticatedUser();
  if (user) {
    redirect('/hesabim/panel/rezervasyonlar');
  }

  return (
    <Suspense fallback={<div style={{ paddingTop: 'var(--nav-height)', minHeight: '50vh' }} />}>
      <ReservasyonTakibiClient />
    </Suspense>
  );
}
