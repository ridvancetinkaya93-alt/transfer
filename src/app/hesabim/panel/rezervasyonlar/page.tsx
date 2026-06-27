import type { Metadata } from 'next';
import RezervasyonlarClient from './RezervasyonlarClient';

export const metadata: Metadata = {
  title: 'Rezervasyonlarım',
};

export default function RezervasyonlarPage() {
  return <RezervasyonlarClient />;
}
