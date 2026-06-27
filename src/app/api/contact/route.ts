import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation/schemas';
import { createContactMessage } from '@/lib/db/contacts';
import { sendContactNotification } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Geçersiz form.' },
        { status: 400 }
      );
    }

    const message = await createContactMessage(parsed.data);
    await sendContactNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    return NextResponse.json({ success: true, id: message.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
