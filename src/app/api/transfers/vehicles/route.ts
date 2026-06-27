import { NextResponse } from 'next/server';
import { getTransferVehicles } from '@/lib/db/transfer-vehicles';

export async function GET() {
  try {
    const vehicles = await getTransferVehicles();
    return NextResponse.json({ vehicles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
