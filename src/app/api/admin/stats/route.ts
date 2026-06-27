import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllReservations } from '@/lib/db/reservations';
import { getVillas } from '@/lib/db/villas';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  const [reservations, villas] = await Promise.all([getAllReservations(), getVillas({})]);

  const totalRevenue = reservations
    .filter(r => r.status !== 'cancelled' && r.paymentStatus === 'paid')
    .reduce((s, r) => s + r.totalPrice, 0);

  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  const avgRating =
    villas.length > 0
      ? (villas.reduce((s, v) => s + v.rating, 0) / villas.length).toFixed(1)
      : '0';

  return NextResponse.json({
    stats: {
      villaCount: villas.length,
      confirmedCount,
      pendingCount,
      totalRevenue,
      avgRating,
      reservationCount: reservations.length,
    },
  });
}
