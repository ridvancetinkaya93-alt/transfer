import { NextResponse } from 'next/server';
import { getBookingExtras } from '@/lib/db/extras';

export async function GET() {
  try {
    const extras = await getBookingExtras();
    return NextResponse.json({ extras });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
