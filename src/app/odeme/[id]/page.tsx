import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getReservationForPayment } from '@/lib/db/reservations';
import OdemeClient from './OdemeClient';

export const metadata: Metadata = {
  title: 'Güvenli Ödeme | RCetinkaya Turizm',
  description: 'Rezervasyonunuzu güvenle tamamlayın.',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string }>;
}

export default async function OdemePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { email } = await searchParams;

  const reservation = await getReservationForPayment(id, email);
  if (!reservation) notFound();

  if (reservation.paymentStatus === 'paid') {
    notFound();
  }

  return (
    <Suspense fallback={<div style={{ paddingTop: 'var(--nav-height)', minHeight: '50vh' }} />}>
      <OdemeClient reservation={reservation} />
    </Suspense>
  );
}
