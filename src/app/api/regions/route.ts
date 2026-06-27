import { NextResponse } from 'next/server';
import { getRegions } from '@/lib/db/villas';

export async function GET() {
  const regions = await getRegions();
  return NextResponse.json({ regions });
}
