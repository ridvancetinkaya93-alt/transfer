import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth/customer';
import { getReservationForCustomer } from '@/lib/db/reservations';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireCustomer();
    const { id } = await params;
    const reservation = await getReservationForCustomer(userId, id);

    if (!reservation) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ reservation });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası.';
    const status = message === 'Oturum gerekli.' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
