import type { CustomerProfile } from '@/types/database';
import { useMockBackend } from '@/lib/app-mode';

export async function getAuthenticatedUser() {
  if (useMockBackend()) return null;

  const { createSupabaseServerClient } = await import('@/lib/supabase/ssr-server');
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
  if (useMockBackend()) return null;

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const admin = requireSupabaseAdmin();
  const { data, error } = await admin.from('profiles').select('*').eq('id', userId).single();
  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone || undefined,
    createdAt: data.created_at,
  };
}

export async function requireCustomer(): Promise<{ userId: string; profile: CustomerProfile }> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Oturum gerekli.');

  const profile = await getCustomerProfile(user.id);
  if (!profile) throw new Error('Profil bulunamadı.');

  return { userId: user.id, profile };
}

export async function linkPastRecordsToCustomer(userId: string, email: string, phone?: string) {
  if (useMockBackend()) return;

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const admin = requireSupabaseAdmin();
  const normalizedEmail = email.toLowerCase().trim();

  await admin
    .from('reservations')
    .update({ customer_id: userId })
    .eq('guest_email', normalizedEmail)
    .is('customer_id', null);

  if (phone) {
    await admin
      .from('transfer_requests')
      .update({ customer_id: userId, guest_email: normalizedEmail })
      .eq('guest_phone', phone)
      .is('customer_id', null);
  }
}
