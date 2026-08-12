import type { Metadata } from 'next';
import DemoOdemeClient from './DemoOdemeClient';

export const metadata: Metadata = {
  title: 'Demo Ödeme — Banka Test | RCetinkaya Turizm',
  description: 'Banka ve ödeme kuruluşu test incelemesi için demo ürün ve kredi kartı ödeme ekranı.',
  robots: { index: false, follow: false },
};

export default function DemoOdemePage() {
  return <DemoOdemeClient />;
}
