import { useMockBackend } from '@/lib/app-mode';

/** Mock modda Supabase'e yazma — no-op. */
export async function ensureDemoCatalog(): Promise<string> {
  if (useMockBackend()) {
    const { DEMO_VILLA_ID } = await import('@/lib/mock/demo-catalog');
    return DEMO_VILLA_ID;
  }

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const {
    DEMO_REGION_SLUG,
    DEMO_VILLA_ID,
    DEMO_VILLA_SLUG,
    demoVillaDefinition,
  } = await import('@/lib/mock/demo-catalog');
  const supabase = requireSupabaseAdmin();

  const { error: regionError } = await supabase.from('regions').upsert(
    {
      slug: DEMO_REGION_SLUG,
      name: 'Fethiye',
      image_url: '/og-image.svg',
      villa_count: 1,
      sort_order: 0,
    },
    { onConflict: 'slug' }
  );
  if (regionError) throw new Error(`Demo bölge eklenemedi: ${regionError.message}`);

  const { error: villaError } = await supabase.from('villas').upsert(
    {
      id: DEMO_VILLA_ID,
      slug: DEMO_VILLA_SLUG,
      name: demoVillaDefinition.name,
      region_slug: DEMO_REGION_SLUG,
      location: demoVillaDefinition.location,
      short_description: demoVillaDefinition.shortDescription,
      description: demoVillaDefinition.description,
      price_per_night: demoVillaDefinition.pricePerNight,
      cleaning_fee: demoVillaDefinition.cleaningFee,
      service_fee: demoVillaDefinition.serviceFee,
      rating: demoVillaDefinition.rating,
      review_count: demoVillaDefinition.reviewCount,
      max_guests: demoVillaDefinition.maxGuests,
      bedrooms: demoVillaDefinition.bedrooms,
      bathrooms: demoVillaDefinition.bathrooms,
      square_meters: demoVillaDefinition.squareMeters,
      coordinates_lat: demoVillaDefinition.coordinates.lat,
      coordinates_lng: demoVillaDefinition.coordinates.lng,
      is_featured: true,
      is_active: true,
      tags: demoVillaDefinition.tags,
      check_in_time: demoVillaDefinition.checkInTime,
      check_out_time: demoVillaDefinition.checkOutTime,
      min_nights: demoVillaDefinition.minNights,
    },
    { onConflict: 'slug' }
  );
  if (villaError) throw new Error(`Demo villa eklenemedi: ${villaError.message}`);

  await supabase.from('villa_images').delete().eq('villa_id', DEMO_VILLA_ID);
  await supabase.from('villa_images').insert({
    villa_id: DEMO_VILLA_ID,
    url: demoVillaDefinition.images[0],
    sort_order: 0,
    is_primary: true,
  });

  return DEMO_VILLA_ID;
}
