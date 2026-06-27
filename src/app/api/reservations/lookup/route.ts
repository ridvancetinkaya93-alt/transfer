import { NextRequest, NextResponse } from 'next/server';
import { reservationLookupSchema } from '@/lib/validation/schemas';
import { lookupReservation } from '@/lib/db/reservations';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code') || '';
  const email = searchParams.get('email') || '';

  const parsed = reservationLookupSchema.safeParse({ code, email });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz kod veya e-posta.' }, { status: 400 });
  }

  const reservation = await lookupReservation(parsed.data.code, parsed.data.email);
  if (!reservation) {
    return NextResponse.json({ error: 'Rezervasyon bulunamadı.' }, { status: 404 });
  }

  return NextResponse.json({ reservation });
}
