import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/customer';

export default async function HesabimPage() {
  const user = await getAuthenticatedUser();
  if (user) redirect('/hesabim/panel');
  redirect('/hesabim/giris');
}
