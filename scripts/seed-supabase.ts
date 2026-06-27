import { createClient } from '@supabase/supabase-js';
import { villas, reviews, regions, bookingExtras, transferVehicles } from './seed/catalog';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureSchema() {
  const { error } = await supabase.from('villas').select('id').limit(1);
  if (error?.message?.includes('does not exist') || error?.code === '42P01') {
    console.error('\nTablolar bulunamadı. Supabase SQL Editor\'da şu dosyaları çalıştırın:');
    console.error('  1. supabase/migrations/001_initial_schema.sql');
    console.error('  2. supabase/migrations/002_transfer_vehicles.sql\n');
    process.exit(1);
  }
  if (error) {
    console.error('Supabase bağlantı hatası:', error.message);
    process.exit(1);
  }
}

async function seedRegions() {
  const counts = villas.reduce<Record<string, number>>((acc, v) => {
    acc[v.region] = (acc[v.region] || 0) + 1;
    return acc;
  }, {});

  for (const region of regions) {
    const { error } = await supabase.from('regions').upsert(
      {
        slug: region.id,
        name: region.name,
        image_url: region.image,
        villa_count: counts[region.id] || 0,
        sort_order: regions.indexOf(region),
      },
      { onConflict: 'slug' }
    );
    if (error) throw new Error(`Region ${region.id}: ${error.message}`);
  }
  console.log(`✓ ${regions.length} bölge`);
}

async function seedExtras() {
  for (const extra of bookingExtras) {
    const { error } = await supabase.from('extras').upsert(
      {
        slug: extra.slug,
        name: extra.name,
        description: extra.description,
        price: extra.price,
        icon: extra.icon,
        is_active: true,
      },
      { onConflict: 'slug' }
    );
    if (error) throw new Error(`Extra ${extra.slug}: ${error.message}`);
  }
  console.log(`✓ ${bookingExtras.length} ekstra hizmet`);
}

async function seedTransferVehicles() {
  let order = 0;
  for (const vehicle of transferVehicles) {
    const { error } = await supabase.from('transfer_vehicles').upsert(
      {
        slug: vehicle.slug,
        name: vehicle.name,
        category: vehicle.category,
        capacity: vehicle.capacity,
        luggage: vehicle.luggage,
        features: vehicle.features,
        price_from: vehicle.priceFrom,
        image_url: vehicle.image,
        badge: vehicle.badge,
        badge_color: vehicle.badgeColor,
        description: vehicle.description,
        sort_order: order++,
        is_active: true,
      },
      { onConflict: 'slug' }
    );
    if (error) {
      if (error.message.includes('does not exist')) {
        console.error('\ntransfer_vehicles tablosu yok. Önce 002_transfer_vehicles.sql migration çalıştırın.\n');
        process.exit(1);
      }
      throw new Error(`Vehicle ${vehicle.slug}: ${error.message}`);
    }
  }
  console.log(`✓ ${transferVehicles.length} transfer aracı`);
}

async function seedVillas(): Promise<Map<string, string>> {
  const slugToId = new Map<string, string>();

  for (const villa of villas) {
    const { data: existing } = await supabase
      .from('villas')
      .select('id')
      .eq('slug', villa.slug)
      .maybeSingle();

    let villaId = existing?.id;

    const row = {
      slug: villa.slug,
      name: villa.name,
      region_slug: villa.region,
      location: villa.location,
      short_description: villa.shortDescription,
      description: villa.description,
      price_per_night: villa.pricePerNight,
      cleaning_fee: villa.cleaningFee,
      service_fee: villa.serviceFee,
      rating: villa.rating,
      review_count: villa.reviewCount,
      max_guests: villa.maxGuests,
      bedrooms: villa.bedrooms,
      bathrooms: villa.bathrooms,
      square_meters: villa.squareMeters,
      coordinates_lat: villa.coordinates.lat,
      coordinates_lng: villa.coordinates.lng,
      is_featured: villa.isFeatured,
      is_active: villa.isAvailable,
      tags: villa.tags,
      check_in_time: villa.checkInTime,
      check_out_time: villa.checkOutTime,
      min_nights: villa.minNights,
    };

    if (villaId) {
      const { error } = await supabase.from('villas').update(row).eq('id', villaId);
      if (error) throw new Error(`Villa update ${villa.slug}: ${error.message}`);
    } else {
      const { data, error } = await supabase.from('villas').insert(row).select('id').single();
      if (error) throw new Error(`Villa insert ${villa.slug}: ${error.message}`);
      villaId = data.id;
    }

    slugToId.set(villa.slug, villaId!);

    await supabase.from('villa_images').delete().eq('villa_id', villaId);
    await supabase.from('villa_amenities').delete().eq('villa_id', villaId);
    await supabase.from('villa_features').delete().eq('villa_id', villaId);
    await supabase.from('villa_rules').delete().eq('villa_id', villaId);

    if (villa.images.length) {
      const { error } = await supabase.from('villa_images').insert(
        villa.images.map((imageUrl, i) => ({
          villa_id: villaId,
          url: imageUrl,
          sort_order: i,
          is_primary: i === 0,
        }))
      );
      if (error) throw new Error(`Images ${villa.slug}: ${error.message}`);
    }

    if (villa.amenities.length) {
      const { error } = await supabase.from('villa_amenities').insert(
        villa.amenities.map(a => ({ villa_id: villaId, icon: a.icon, name: a.name }))
      );
      if (error) throw new Error(`Amenities ${villa.slug}: ${error.message}`);
    }

    if (villa.features.length) {
      const { error } = await supabase.from('villa_features').insert(
        villa.features.map(name => ({ villa_id: villaId, name }))
      );
      if (error) throw new Error(`Features ${villa.slug}: ${error.message}`);
    }

    if (villa.rules.length) {
      const { error } = await supabase.from('villa_rules').insert(
        villa.rules.map((rule_text, i) => ({ villa_id: villaId, rule_text, sort_order: i }))
      );
      if (error) throw new Error(`Rules ${villa.slug}: ${error.message}`);
    }
  }

  console.log(`✓ ${villas.length} villa`);
  return slugToId;
}

async function seedReviews(slugToId: Map<string, string>) {
  const staticIdToSlug = new Map(villas.map(v => [v.id, v.slug]));
  let count = 0;

  for (const review of reviews) {
    const slug = staticIdToSlug.get(review.villaId);
    const villaId = slug ? slugToId.get(slug) : undefined;
    if (!villaId) continue;

    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('villa_id', villaId)
      .eq('author', review.author)
      .maybeSingle();

    const row = {
      villa_id: villaId,
      author: review.author,
      avatar: review.avatar || null,
      rating: review.rating,
      comment: review.comment,
      is_published: true,
    };

    if (existing?.id) {
      await supabase.from('reviews').update(row).eq('id', existing.id);
    } else {
      await supabase.from('reviews').insert(row);
    }
    count++;
  }

  console.log(`✓ ${count} yorum`);
}

async function main() {
  console.log('Supabase seed başlıyor...\n');
  await ensureSchema();
  await seedRegions();
  await seedExtras();
  await seedTransferVehicles();
  const slugToId = await seedVillas();
  await seedReviews(slugToId);
  console.log('\nSeed tamamlandı.');
}

main().catch(err => {
  console.error('\nSeed hatası:', err.message || err);
  process.exit(1);
});
