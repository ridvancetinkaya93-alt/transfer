import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getVillaBySlug, getAllVillaSlugs } from '@/lib/db/villas';
import ReservasyonClient from './ReservasyonClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: 'Rezervasyon Yap',
  description: 'Villa rezervasyonunuzu tamamlayın.',
};

export async function generateStaticParams() {
  const slugs = await getAllVillaSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function ReservasyonPage({ params }: Props) {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);
  if (!villa) notFound();

  return (
    <Suspense fallback={<div style={{ paddingTop: 'var(--nav-height)', minHeight: '50vh' }} />}>
      <ReservasyonClient villa={villa} />
    </Suspense>
  );
}
