import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllContactMessages } from '@/lib/db/contacts';

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Yetkisiz erişim.';
    const status = message === 'Oturum gerekli.' ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }

  const messages = await getAllContactMessages();
  return NextResponse.json({ messages, count: messages.length });
}
