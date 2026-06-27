import { NextRequest, NextResponse } from 'next/server';
import { getVillas, type VillaFilters } from '@/lib/db/villas';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filters: VillaFilters = {
    region: searchParams.get('region') || undefined,
    guests: searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    hasPool: searchParams.get('hasPool') === 'true',
    hasSeaView: searchParams.get('hasSeaView') === 'true',
    featured: searchParams.get('featured') === 'true',
    feature: searchParams.get('feature') || undefined,
    checkIn: searchParams.get('checkIn') || undefined,
    checkOut: searchParams.get('checkOut') || undefined,
    sort: (searchParams.get('sort') as VillaFilters['sort']) || 'recommended',
  };

  const villas = await getVillas(filters);
  return NextResponse.json({ villas, count: villas.length });
}
