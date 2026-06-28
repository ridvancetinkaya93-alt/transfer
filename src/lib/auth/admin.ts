import { getAuthenticatedUser } from '@/lib/auth/customer';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { requireSupabaseAdmin } from '@/lib/supabase/require';
import { isUserAdmin } from '@/lib/auth/admin-check';

export async function isAdminAuthenticated(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  return isUserAdmin(supabase, user.id);
}

export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Oturum gerekli.');

  const admin = requireSupabaseAdmin();
  const { data, error } = await admin
    .from('profiles')
    .select('is_admin, email')
    .eq('id', user.id)
    .single();

  if (error || !data?.is_admin) throw new Error('Yetkisiz erişim.');

  return { userId: user.id, email: data.email };
}
