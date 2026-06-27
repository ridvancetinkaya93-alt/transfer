import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth/customer';
import { getSavedCards, deleteSavedCard } from '@/lib/db/customers';

export async function GET() {
  try {
    const { userId } = await requireCustomer();
    const cards = await getSavedCards(userId);
    return NextResponse.json({ cards, count: cards.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası.';
    const status = message === 'Oturum gerekli.' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await requireCustomer();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Kart ID gerekli.' }, { status: 400 });
    }
    await deleteSavedCard(userId, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası.';
    const status = message === 'Oturum gerekli.' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
