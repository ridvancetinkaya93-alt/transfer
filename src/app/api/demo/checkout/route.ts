import { NextResponse } from 'next/server';
import { DEMO_GUEST, DEMO_VILLA_SLUG, getDemoCheckInOut } from '@/lib/mock/demo-catalog';
import { createReservation } from '@/lib/db/reservations';

export async function POST() {
  try {
    const { checkIn, checkOut } = getDemoCheckInOut();

    const { reservation, error } = await createReservation({
      villaSlug: DEMO_VILLA_SLUG,
      checkIn,
      checkOut,
      guests: 2,
      firstName: DEMO_GUEST.firstName,
      lastName: DEMO_GUEST.lastName,
      email: DEMO_GUEST.email,
      phone: DEMO_GUEST.phone,
      tcNo: DEMO_GUEST.tcNo,
      notes: 'Banka / iyzico test rezervasyonu',
    });

    if (error || !reservation) {
      return NextResponse.json({ error: error || 'Demo rezervasyon oluşturulamadı.' }, { status: 500 });
    }

    return NextResponse.json({
      reservation,
      redirectUrl: `/odeme/${reservation.id}?email=${encodeURIComponent(reservation.guestEmail)}`,
    });
  } catch (err) {
    console.error('[Demo checkout]', err);
    return NextResponse.json({ error: 'Demo ödeme başlatılamadı.' }, { status: 500 });
  }
}
