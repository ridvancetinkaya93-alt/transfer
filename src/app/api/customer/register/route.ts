import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { customerRegisterSchema } from '@/lib/validation/schemas';
import { linkPastRecordsToCustomer } from '@/lib/auth/customer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = customerRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Geçersiz form.' },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, password } = parsed.data;
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, phone },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      await linkPastRecordsToCustomer(data.user.id, email, phone);
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch {
    return NextResponse.json({ error: 'Kayıt işlemi başarısız.' }, { status: 500 });
  }
}
