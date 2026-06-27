import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth/customer';
import { updateCustomerProfile } from '@/lib/db/customers';
import { customerProfileSchema } from '@/lib/validation/schemas';

export async function PATCH(request: Request) {
  try {
    const { userId } = await requireCustomer();
    const body = await request.json();
    const parsed = customerProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Geçersiz form.' },
        { status: 400 }
      );
    }

    const profile = await updateCustomerProfile(userId, parsed.data);
    return NextResponse.json({ profile });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası.';
    const status = message === 'Oturum gerekli.' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
