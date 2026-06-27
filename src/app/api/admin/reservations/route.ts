import { NextRequest, NextResponse } from 'next/server';
import { getAllReservations, updateReservationStatus } from '@/lib/db/reservations';
import type { ReservationStatus } from '@/types/database';

export async function GET(request: NextRequest) {
  const reservations = await getAllReservations();
  const status = request.nextUrl.searchParams.get('status');

  const filtered = status
    ? reservations.filter(r => r.status === status)
    : reservations;

  return NextResponse.json({ reservations: filtered, count: filtered.length });
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
    }

    const updated = await updateReservationStatus(id, status as ReservationStatus);
    if (!updated) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, reservation: updated });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
