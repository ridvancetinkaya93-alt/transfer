import type { Metadata } from 'next';
import ProfilClient from './ProfilClient';

export const metadata: Metadata = {
  title: 'Profil & Ayarlar',
};

export default function ProfilPage() {
  return <ProfilClient />;
}
