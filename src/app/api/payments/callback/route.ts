import { NextRequest, NextResponse } from 'next/server';
import { handlePaymentCallback } from '@/lib/payments/iyzico';
import { getSiteUrl } from '@/lib/supabase/config';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(`${getSiteUrl()}/odeme/hata?reason=missing_token`);
    }

    const result = await handlePaymentCallback(token);

    if (!result.success || !result.reservationId) {
      return NextResponse.redirect(`${getSiteUrl()}/odeme/hata?reason=payment_failed`);
    }

    const { getReservationById } = await import('@/lib/db/reservations');
    const reservation = await getReservationById(result.reservationId);

    if (reservation) {
      return NextResponse.redirect(
        `${getSiteUrl()}/rezervasyon-onay?code=${reservation.code}&total=${reservation.totalPrice}`
      );
    }

    return NextResponse.redirect(`${getSiteUrl()}/rezervasyon-onay`);
  } catch {
    return NextResponse.redirect(`${getSiteUrl()}/odeme/hata?reason=server_error`);
  }
}
