import { getSupabaseAdmin } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { SupabaseClient } from '@supabase/supabase-js';

export function requireSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase yapılandırılmamış. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local dosyasında olmalı.'
    );
  }
  const client = getSupabaseAdmin();
  if (!client) {
    throw new Error('Supabase admin client oluşturulamadı. SUPABASE_SERVICE_ROLE_KEY kontrol edin.');
  }
  return client;
}
