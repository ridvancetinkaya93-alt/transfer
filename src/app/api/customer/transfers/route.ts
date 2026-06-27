import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth/customer';
import { getTransfersByCustomerId } from '@/lib/db/transfers';

export async function GET() {
  try {
    const { userId } = await requireCustomer();
    const transfers = await getTransfersByCustomerId(userId);
    return NextResponse.json({ transfers, count: transfers.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası.';
    const status = message === 'Oturum gerekli.' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
