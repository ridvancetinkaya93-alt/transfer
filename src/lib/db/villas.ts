import type { Villa, Region, Review } from '@/types/database';
import { useMockBackend } from '@/lib/app-mode';
import { mockRegions, mockVillas } from '@/lib/mock/catalog-data';

export interface VillaFilters {
  region?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  hasPool?: boolean;
  hasSeaView?: boolean;
  featured?: boolean;
  sort?: 'recommended' | 'price_asc' | 'price_desc' | 'rating';
  checkIn?: string;
  checkOut?: string;
  feature?: string;
}

function applyFilters(villaList: Villa[], filters: VillaFilters): Villa[] {
  let result = [...villaList];

  if (filters.region) result = result.filter(v => v.region === filters.region);
  if (filters.guests && filters.guests > 0) result = result.filter(v => v.maxGuests >= filters.guests!);
  if (filters.minPrice && filters.minPrice > 0) result = result.filter(v => v.pricePerNight >= filters.minPrice!);
  if (filters.maxPrice && filters.maxPrice < 25000) result = result.filter(v => v.pricePerNight <= filters.maxPrice!);
  if (filters.hasPool) result = result.filter(v => v.amenities.some(a => a.icon === 'pool'));
  if (filters.hasSeaView) {
    result = result.filter(v => v.features.some(f => f.toLowerCase().includes('deniz')));
  }
  if (filters.featured) result = result.filter(v => v.isFeatured);
  if (filters.feature === 'yat') {
    result = result.filter(v =>
      v.tags.some(t => t.toLowerCase().includes('yat')) ||
      v.features.some(f => f.toLowerCase().includes('marina') || f.toLowerCase().includes('yat'))
    );
  }

  const sort = filters.sort || 'recommended';
  result.sort((a, b) => {
    if (sort === 'price_asc') return a.pricePerNight - b.pricePerNight;
    if (sort === 'price_desc') return b.pricePerNight - a.pricePerNight;
    if (sort === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return result;
}

async function applyAvailabilityFilter(
  villas: Villa[],
  checkIn?: string,
  checkOut?: string
): Promise<Villa[]> {
  if (!checkIn || !checkOut) return villas;
  const { checkAvailability } = await import('@/lib/db/reservations');
  const checks = await Promise.all(
    villas.map(async villa => ({
      villa,
      available: (await checkAvailability(villa.id, checkIn, checkOut)).available,
    }))
  );
  return checks.filter(c => c.available).map(c => c.villa);
}

async function loadBaseVillas(): Promise<Villa[]> {
  if (useMockBackend()) return mockVillas;

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const { ensureDemoCatalog } = await import('@/lib/mock/ensure-demo-catalog');
  const { getDemoVilla } = await import('@/lib/mock/demo-catalog');

  await ensureDemoCatalog().catch(err => console.error('[Demo catalog]', err));

  try {
    const supabase = requireSupabaseAdmin();
    const { data, error } = await supabase.from('villas').select('*').eq('is_active', true);
    if (error) throw error;
    if (!data?.length) return [getDemoVilla()];

    return Promise.all(
      data.map(async row => {
        const [images, amenities, features, rules] = await Promise.all([
          supabase.from('villa_images').select('url').eq('villa_id', row.id).order('sort_order'),
          supabase.from('villa_amenities').select('icon, name').eq('villa_id', row.id),
          supabase.from('villa_features').select('name').eq('villa_id', row.id),
          supabase.from('villa_rules').select('rule_text').eq('villa_id', row.id).order('sort_order'),
        ]);

        return {
          id: row.id,
          slug: row.slug,
          name: row.name,
          location: row.location,
          region: row.region_slug,
          shortDescription: row.short_description,
          description: row.description,
          pricePerNight: row.price_per_night,
          cleaningFee: row.cleaning_fee,
          serviceFee: row.service_fee,
          rating: Number(row.rating),
          reviewCount: row.review_count,
          maxGuests: row.max_guests,
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          squareMeters: row.square_meters,
          images: images.data?.map(i => i.url) || [],
          features: features.data?.map(f => f.name) || [],
          amenities: amenities.data || [],
          rules: rules.data?.map(r => r.rule_text) || [],
          coordinates: { lat: Number(row.coordinates_lat), lng: Number(row.coordinates_lng) },
          isFeatured: row.is_featured,
          isAvailable: true,
          tags: row.tags || [],
          checkInTime: row.check_in_time,
          checkOutTime: row.check_out_time,
          minNights: row.min_nights,
        };
      })
    );
  } catch (err) {
    console.error('[Villas fallback]', err);
    return mockVillas;
  }
}

export async function getVillas(filters: VillaFilters = {}): Promise<Villa[]> {
  const base = await loadBaseVillas();
  let result = applyFilters(base, filters);
  result = await applyAvailabilityFilter(result, filters.checkIn, filters.checkOut);
  return result;
}

export async function getVillaBySlug(slug: string): Promise<Villa | null> {
  const all = await getVillas({});
  return all.find(v => v.slug === slug) || null;
}

export async function getVillaById(id: string): Promise<Villa | null> {
  const all = await getVillas({});
  return all.find(v => v.id === id) || null;
}

export async function getFeaturedVillas(): Promise<Villa[]> {
  return getVillas({ featured: true, sort: 'recommended' });
}

export async function getRegions(): Promise<Region[]> {
  if (useMockBackend()) return mockRegions;

  try {
    const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
    const supabase = requireSupabaseAdmin();
    const villas = await getVillas({});
    const counts = villas.reduce<Record<string, number>>((acc, v) => {
      acc[v.region] = (acc[v.region] || 0) + 1;
      return acc;
    }, {});

    const { data, error } = await supabase.from('regions').select('*').order('sort_order');
    if (error) throw error;

    return (data || []).map(r => ({
      id: r.slug,
      name: r.name,
      villaCount: counts[r.slug] ?? r.villa_count,
      image: r.image_url,
    }));
  } catch {
    return mockRegions;
  }
}

export async function getReviewsByVillaId(_villaId: string): Promise<Review[]> {
  return [];
}

export async function getAllReviews(): Promise<Review[]> {
  return [];
}

export async function getSiteStats(): Promise<{
  villaCount: number;
  regionCount: number;
  avgRating: string;
  reviewCount: number;
}> {
  const villas = await getVillas({});
  const regions = await getRegions();
  const avgRating =
    villas.length > 0
      ? (villas.reduce((s, v) => s + v.rating, 0) / villas.length).toFixed(1)
      : '0';

  return {
    villaCount: villas.length,
    regionCount: regions.length,
    avgRating,
    reviewCount: villas.reduce((s, v) => s + v.reviewCount, 0),
  };
}

export async function getAllVillaSlugs(): Promise<string[]> {
  const villas = await getVillas({});
  return villas.map(v => v.slug);
}
