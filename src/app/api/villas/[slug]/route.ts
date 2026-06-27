import { NextRequest, NextResponse } from 'next/server';
import { getVillaBySlug, getReviewsByVillaId } from '@/lib/db/villas';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);

  if (!villa) {
    return NextResponse.json({ error: 'Villa bulunamadı.' }, { status: 404 });
  }

  const reviews = await getReviewsByVillaId(villa.id);
  return NextResponse.json({ villa, reviews });
}
