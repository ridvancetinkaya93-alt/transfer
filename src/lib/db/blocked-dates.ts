import { useMockBackend } from '@/lib/app-mode';

export async function getBlockedDatesForVilla(_villaId: string): Promise<string[]> {
  if (useMockBackend()) return [];

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('date')
    .eq('villa_id', _villaId);

  if (error) throw new Error(`Bloklu tarihler alınamadı: ${error.message}`);

  return (data || []).map(row => row.date).sort();
}

export async function addBlockedDate(villaId: string, date: string, reason?: string): Promise<void> {
  if (useMockBackend()) return;

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const supabase = requireSupabaseAdmin();
  const { error } = await supabase.from('blocked_dates').upsert({
    villa_id: villaId,
    date,
    reason: reason || null,
  });

  if (error) throw new Error(`Bloklu tarih eklenemedi: ${error.message}`);
}
