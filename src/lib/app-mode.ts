import { isSupabaseConfigured } from '@/lib/supabase/config';

/** Harici servis yok — varsayılan mock mod (env gerekmez). */
export function useMockBackend(): boolean {
  if (process.env.USE_LIVE_BACKEND === '1') {
    return !isSupabaseFullyConfigured();
  }
  return true;
}

export function isSupabaseFullyConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isLivePaymentsEnabled(): boolean {
  return process.env.USE_LIVE_BACKEND === '1' && Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

export function isLiveEmailEnabled(): boolean {
  return process.env.USE_LIVE_BACKEND === '1' && Boolean(process.env.RESEND_API_KEY);
}
