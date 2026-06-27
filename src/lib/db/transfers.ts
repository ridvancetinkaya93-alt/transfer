import { randomUUID } from 'crypto';
import type { TransferRequest } from '@/types/database';
import { requireSupabaseAdmin } from '@/lib/supabase/require';
import { generateReservationCode } from '@/lib/utils';

function generateTransferCode(): string {
  return 'TRF-' + generateReservationCode().replace('RCT-', '');
}

export async function createTransferRequest(input: {
  type: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  vehicle?: string;
  name: string;
  phone: string;
  notes?: string;
  customerId?: string;
  guestEmail?: string;
}): Promise<TransferRequest> {
  const id = randomUUID();
  const code = generateTransferCode();
  const createdAt = new Date().toISOString();
  const supabase = requireSupabaseAdmin();

  const { error } = await supabase.from('transfer_requests').insert({
    id,
    code,
    type: input.type,
    from_location: input.from,
    to_location: input.to,
    date: input.date,
    time: input.time,
    passengers: input.passengers,
    vehicle_slug: input.vehicle || null,
    guest_name: input.name,
    guest_phone: input.phone,
    notes: input.notes || null,
    status: 'new',
    customer_id: input.customerId || null,
    guest_email: input.guestEmail || null,
  });

  if (error) throw new Error(`Transfer talebi kaydedilemedi: ${error.message}`);

  return {
    id,
    code,
    type: input.type,
    fromLocation: input.from,
    toLocation: input.to,
    date: input.date,
    time: input.time,
    passengers: input.passengers,
    vehicleSlug: input.vehicle,
    guestName: input.name,
    guestPhone: input.phone,
    notes: input.notes,
    status: 'new',
    createdAt,
  };
}

export async function getAllTransferRequests(): Promise<TransferRequest[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('transfer_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Transfer talepleri alınamadı: ${error.message}`);

  return (data || []).map(row => ({
    id: row.id,
    code: row.code,
    type: row.type,
    fromLocation: row.from_location,
    toLocation: row.to_location,
    date: row.date,
    time: row.time,
    passengers: row.passengers,
    vehicleSlug: row.vehicle_slug || undefined,
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    notes: row.notes || undefined,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function updateTransferStatus(
  id: string,
  status: TransferRequest['status']
): Promise<TransferRequest | null> {
  const supabase = requireSupabaseAdmin();
  const { error } = await supabase.from('transfer_requests').update({ status }).eq('id', id);
  if (error) throw new Error(`Transfer durumu güncellenemedi: ${error.message}`);

  const all = await getAllTransferRequests();
  return all.find(t => t.id === id) || null;
}

export async function getTransfersByCustomerId(customerId: string): Promise<TransferRequest[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('transfer_requests')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Transfer talepleri alınamadı: ${error.message}`);

  return (data || []).map(row => ({
    id: row.id,
    code: row.code,
    type: row.type,
    fromLocation: row.from_location,
    toLocation: row.to_location,
    date: row.date,
    time: row.time,
    passengers: row.passengers,
    vehicleSlug: row.vehicle_slug || undefined,
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    notes: row.notes || undefined,
    status: row.status,
    createdAt: row.created_at,
  }));
}
