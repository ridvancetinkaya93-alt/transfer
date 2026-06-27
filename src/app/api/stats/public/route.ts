import { NextResponse } from 'next/server';
import { getSiteStats } from '@/lib/db/villas';

export async function GET() {
  const stats = await getSiteStats();
  return NextResponse.json({ stats });
}
