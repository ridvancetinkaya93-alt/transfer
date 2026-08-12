import { getAuthenticatedUser } from '@/lib/auth/customer';
import { useMockBackend } from '@/lib/app-mode';
import { isUserAdmin } from '@/lib/auth/admin-check';

export async function isAdminAuthenticated(): Promise<boolean> {
  if (useMockBackend()) return false;

  const { createSupabaseServerClient } = await import('@/lib/supabase/ssr-server');
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  return isUserAdmin(supabase, user.id);
}

export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  if (useMockBackend()) throw new Error('Admin panel mock modda devre dışı.');

  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Oturum gerekli.');

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const admin = requireSupabaseAdmin();
  const { data, error } = await admin
    .from('profiles')
    .select('is_admin, email')
    .eq('id', user.id)
    .single();

  if (error || !data?.is_admin) throw new Error('Yetkisiz erişim.');

  return { userId: user.id, email: data.email };
}
