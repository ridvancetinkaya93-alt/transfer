import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllReservations } from '@/lib/db/reservations';
import { getVillas } from '@/lib/db/villas';

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Yetkisiz erişim.';
    const status = message === 'Oturum gerekli.' ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
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
