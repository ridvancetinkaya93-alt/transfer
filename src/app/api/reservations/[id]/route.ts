import { NextRequest, NextResponse } from 'next/server';
import { getReservationForPayment } from '@/lib/db/reservations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const email = request.nextUrl.searchParams.get('email') || undefined;

  const reservation = await getReservationForPayment(id, email);
  if (!reservation) {
    return NextResponse.json({ error: 'Rezervasyon bulunamadı.' }, { status: 404 });
  }

  return NextResponse.json({ reservation });
}
