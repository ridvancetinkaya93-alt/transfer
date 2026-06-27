import { NextRequest, NextResponse } from 'next/server';
import { reservationCreateSchema } from '@/lib/validation/schemas';
import { createReservation } from '@/lib/db/reservations';
import { sendReservationPending, sendNewReservationAdminNotification } from '@/lib/email/send';
import { getAuthenticatedUser } from '@/lib/auth/customer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reservationCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Geçersiz istek.' },
        { status: 400 }
      );
    }

    const { data } = parsed;
    const user = await getAuthenticatedUser();

    const { reservation, error } = await createReservation({
      villaSlug: data.villaSlug,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      tcNo: data.tcNo,
      notes: data.notes,
      extras: data.extras,
      customerId: user?.id,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 409 });
    }

    await sendReservationPending(reservation.guestEmail, {
      code: reservation.code,
      villaName: reservation.villaName,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      total: reservation.totalPrice,
      reservationId: reservation.id,
      guestEmail: reservation.guestEmail,
    });

    await sendNewReservationAdminNotification({
      code: reservation.code,
      villaName: reservation.villaName,
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail,
      guestPhone: reservation.guestPhone,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      total: reservation.totalPrice,
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
