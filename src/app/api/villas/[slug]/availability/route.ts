import { NextRequest, NextResponse } from 'next/server';
import { getVillaBySlug } from '@/lib/db/villas';
import { checkAvailability, getBlockedDates } from '@/lib/db/reservations';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);

  if (!villa) {
    return NextResponse.json({ error: 'Villa bulunamadı.' }, { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  const blockedDates = await getBlockedDates(villa.id);

  if (checkIn && checkOut) {
    const availability = await checkAvailability(villa.id, checkIn, checkOut);
    return NextResponse.json({
      available: availability.available,
      reason: availability.reason,
      blockedDates,
      minNights: villa.minNights,
    });
  }

  return NextResponse.json({ blockedDates, minNights: villa.minNights });
}
