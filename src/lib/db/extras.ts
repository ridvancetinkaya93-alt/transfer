import { requireSupabaseAdmin } from '@/lib/supabase/require';

export interface BookingExtra {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  price: number;
}

export async function getBookingExtras(): Promise<BookingExtra[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('extras')
    .select('*')
    .eq('is_active', true)
    .order('slug');

  if (error) throw new Error(`Ekstra hizmetler alınamadı: ${error.message}`);

  return (data || []).map(row => ({
    id: row.id,
    slug: row.slug,
    icon: row.icon || 'add',
    name: row.name,
    description: row.description || '',
    price: row.price,
  }));
}

export async function getExtrasMap(): Promise<Record<string, { name: string; price: number }>> {
  const extras = await getBookingExtras();
  return Object.fromEntries(extras.map(e => [e.slug, { name: e.name, price: e.price }]));
}
