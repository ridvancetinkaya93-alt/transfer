import { useMockBackend } from '@/lib/app-mode';
import { mockTransferVehicles } from '@/lib/mock/catalog-data';

export interface TransferVehicle {
  id: string;
  slug: string;
  name: string;
  category: string;
  capacity: string;
  luggage: string;
  features: string[];
  priceFrom: number;
  image: string;
  badge: string;
  badgeColor: string;
  description: string;
}

export async function getTransferVehicles(): Promise<TransferVehicle[]> {
  if (useMockBackend()) return mockTransferVehicles;

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('transfer_vehicles')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw new Error(`Transfer araçları alınamadı: ${error.message}`);

  return (data || []).map(row => ({
    id: row.slug,
    slug: row.slug,
    name: row.name,
    category: row.category,
    capacity: row.capacity,
    luggage: row.luggage,
    features: row.features || [],
    priceFrom: row.price_from,
    image: row.image_url,
    badge: row.badge || '',
    badgeColor: row.badge_color || '#ba0036',
    description: row.description || '',
  }));
}
