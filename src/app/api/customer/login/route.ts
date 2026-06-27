import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { customerLoginSchema } from '@/lib/validation/schemas';
import { linkPastRecordsToCustomer } from '@/lib/auth/customer';

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

    if (data.user) {
      const phone = data.user.user_metadata?.phone as string | undefined;
      await linkPastRecordsToCustomer(data.user.id, email, phone);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Giriş işlemi başarısız.' }, { status: 500 });
  }
}
