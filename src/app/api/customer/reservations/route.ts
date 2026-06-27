import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth/customer';
import { getReservationsByCustomerId } from '@/lib/db/reservations';

export async function GET() {
  try {
    const { userId } = await requireCustomer();
    const reservations = await getReservationsByCustomerId(userId);
    return NextResponse.json({ reservations, count: reservations.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası.';
    const status = message === 'Oturum gerekli.' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
