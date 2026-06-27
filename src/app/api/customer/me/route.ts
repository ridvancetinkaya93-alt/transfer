import { NextResponse } from 'next/server';
import { getAuthenticatedUser, getCustomerProfile } from '@/lib/auth/customer';
import { getCustomerStats } from '@/lib/db/customers';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const profile = await getCustomerProfile(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Profil bulunamadı.' }, { status: 404 });
    }

    const stats = await getCustomerStats(user.id, profile.email);

    return NextResponse.json({ authenticated: true, profile, stats });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
