import type { Metadata } from 'next';
import KartlarClient from './KartlarClient';

export const metadata: Metadata = {
  title: 'Kayıtlı Kartlar',
};

export default function KartlarPage() {
  return <KartlarClient />;
}
