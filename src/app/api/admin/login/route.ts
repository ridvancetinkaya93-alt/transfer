import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { customerLoginSchema } from '@/lib/validation/schemas';
import { isUserAdmin } from '@/lib/auth/admin-check';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = customerLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Geçersiz form.' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı.' }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Giriş başarısız.' }, { status: 401 });
    }

    const admin = await isUserAdmin(supabase, data.user.id);
    if (!admin) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'Bu hesabın admin yetkisi yok. Supabase profiles.is_admin = true gerekli.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Giriş işlemi başarısız.' }, { status: 500 });
  }
}
