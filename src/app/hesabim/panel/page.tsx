import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Hesabım',
};

export default function PanelPage() {
  return <DashboardClient />;
}
