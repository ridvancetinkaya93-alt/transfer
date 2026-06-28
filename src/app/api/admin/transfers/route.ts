import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllTransferRequests, updateTransferStatus } from '@/lib/db/transfers';
import type { TransferStatus } from '@/types/database';

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Yetkisiz erişim.';
    const status = message === 'Oturum gerekli.' ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }

  const transfers = await getAllTransferRequests();
  return NextResponse.json({ transfers, count: transfers.length });
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Yetkisiz erişim.';
    const status = message === 'Oturum gerekli.' ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
    }

    const updated = await updateTransferStatus(id, status as TransferStatus);
    if (!updated) {
      return NextResponse.json({ error: 'Talep bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, transfer: updated });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
