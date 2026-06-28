import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Paneli | RCetinkaya Turizm',
  description: 'Admin yönetim paneli',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}
