import { NextRequest, NextResponse } from 'next/server';
import { transferRequestSchema } from '@/lib/validation/schemas';
import { createTransferRequest } from '@/lib/db/transfers';
import { sendTransferNotification } from '@/lib/email/send';
import { getAuthenticatedUser } from '@/lib/auth/customer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = transferRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Geçersiz form.' },
        { status: 400 }
      );
    }

    const user = await getAuthenticatedUser();
    const transfer = await createTransferRequest({
      type: parsed.data.type,
      from: parsed.data.from,
      to: parsed.data.to,
      date: parsed.data.date,
      time: parsed.data.time,
      passengers: parsed.data.passengers,
      vehicle: parsed.data.vehicle,
      name: parsed.data.name,
      phone: parsed.data.phone,
      notes: parsed.data.notes,
      customerId: user?.id,
      guestEmail: user?.email,
    });
    await sendTransferNotification({
      code: transfer.code,
      name: transfer.guestName,
      phone: transfer.guestPhone,
      from: transfer.fromLocation,
      to: transfer.toLocation,
      date: transfer.date,
      time: transfer.time,
      passengers: transfer.passengers,
      vehicle: transfer.vehicleSlug,
    });

    return NextResponse.json({ success: true, transfer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
