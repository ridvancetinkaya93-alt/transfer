import { randomUUID } from 'crypto';
import type { Reservation, ReservationStatus, PaymentStatus, TimelineItem } from '@/types/database';
import { getVillaBySlug, getVillaById } from '@/lib/db/villas';
import { getNightCount, generateReservationCode } from '@/lib/utils';
import { requireSupabaseAdmin } from '@/lib/supabase/require';
import { getExtrasMap } from '@/lib/db/extras';
import { getBlockedDatesForVilla } from '@/lib/db/blocked-dates';

export interface CreateReservationInput {
  villaSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tcNo?: string;
  notes?: string;
  extras?: string[];
  customerId?: string;
}

interface StoredReservation extends Reservation {
  villaId: string;
}

function buildTimeline(res: StoredReservation): TimelineItem[] {
  const items: TimelineItem[] = [
    {
      date: res.createdAt.split('T')[0],
      status: 'Rezervasyon Oluşturuldu',
      icon: 'confirmation_number',
      done: true,
    },
  ];

  if (res.paymentStatus === 'paid') {
    items.push({
      date: res.paymentDate || res.createdAt.split('T')[0],
      status: 'Ödeme Alındı',
      icon: 'payments',
      done: true,
    });
    if (res.status === 'confirmed') {
      items.push({
        date: res.paymentDate || res.createdAt.split('T')[0],
        status: 'Rezervasyon Onaylandı',
        icon: 'verified',
        done: true,
      });
    }
  } else {
    items.push({ date: '—', status: 'Ödeme Bekleniyor', icon: 'payments', done: false });
    items.push({ date: '—', status: 'Rezervasyon Onayı', icon: 'verified', done: false });
  }

  items.push(
    { date: '—', status: 'Giriş Bilgisi Gönderilecek', icon: 'mail', done: false },
    { date: res.checkIn, status: 'Giriş Günü', icon: 'villa', done: false },
    { date: res.checkOut, status: 'Çıkış Günü', icon: 'logout', done: false }
  );

  return items;
}

function toPublicReservation(res: StoredReservation): Reservation {
  const nights = getNightCount(res.checkIn, res.checkOut);
  return {
    ...res,
    guestName: `${res.guestFirstName} ${res.guestLastName}`,
    nights,
    timeline: buildTimeline(res),
  };
}

function mapSupabaseRow(row: Record<string, unknown>): StoredReservation {
  return {
    id: row.id as string,
    code: row.code as string,
    status: row.status as ReservationStatus,
    villaId: row.villa_id as string,
    villaSlug: '',
    villaName: '',
    villaImage: '',
    villaLocation: '',
    checkIn: row.check_in as string,
    checkOut: row.check_out as string,
    guests: row.guests as number,
    nights: getNightCount(row.check_in as string, row.check_out as string),
    pricePerNight: 0,
    cleaningFee: row.cleaning_fee as number,
    serviceFee: row.service_fee as number,
    extrasTotal: row.extras_total as number,
    totalPrice: row.total_price as number,
    guestFirstName: row.guest_first_name as string,
    guestLastName: row.guest_last_name as string,
    guestName: `${row.guest_first_name} ${row.guest_last_name}`,
    guestEmail: row.guest_email as string,
    guestPhone: row.guest_phone as string,
    guestTcNo: row.guest_tc_no as string | undefined,
    notes: row.notes as string | undefined,
    paymentStatus: row.payment_status as PaymentStatus,
    paymentDate: row.updated_at as string,
    paymentMethod: row.payment_method as string | undefined,
    createdAt: row.created_at as string,
    extras: [],
    timeline: [],
    customerId: row.customer_id as string | undefined,
  };
}

async function enrichReservation(mapped: StoredReservation): Promise<StoredReservation> {
  const v = await getVillaById(mapped.villaId);
  if (v) {
    mapped.villaSlug = v.slug;
    mapped.villaName = v.name;
    mapped.villaImage = v.images[0] || '';
    mapped.villaLocation = v.location;
    mapped.pricePerNight = v.pricePerNight;
  }
  return mapped;
}

export async function checkAvailability(
  villaId: string,
  checkIn: string,
  checkOut: string,
  excludeReservationId?: string
): Promise<{ available: boolean; reason?: string }> {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (end <= start) {
    return { available: false, reason: 'Çıkış tarihi girişten sonra olmalıdır.' };
  }

  const reservations = await getReservationsForVilla(villaId);
  const conflicting = reservations.filter(r => {
    if (excludeReservationId && r.id === excludeReservationId) return false;
    if (r.status === 'cancelled') return false;
    const rStart = new Date(r.checkIn);
    const rEnd = new Date(r.checkOut);
    return start < rEnd && end > rStart;
  });

  if (conflicting.length > 0) {
    return { available: false, reason: 'Seçilen tarihler müsait değil.' };
  }

  return { available: true };
}

async function getReservationsForVilla(villaId: string): Promise<StoredReservation[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('villa_id', villaId)
    .neq('status', 'cancelled');

  if (error) throw new Error(`Rezervasyonlar alınamadı: ${error.message}`);
  return (data || []).map(row => mapSupabaseRow(row));
}

export async function createReservation(input: CreateReservationInput): Promise<{
  reservation: Reservation;
  error?: string;
}> {
  const villa = await getVillaBySlug(input.villaSlug);
  if (!villa) return { reservation: null as unknown as Reservation, error: 'Villa bulunamadı.' };

  const nights = getNightCount(input.checkIn, input.checkOut);
  if (nights < villa.minNights) {
    return {
      reservation: null as unknown as Reservation,
      error: `Bu villa için minimum ${villa.minNights} gece konaklama gereklidir.`,
    };
  }
  if (input.guests > villa.maxGuests) {
    return { reservation: null as unknown as Reservation, error: 'Misafir sayısı villa kapasitesini aşıyor.' };
  }

  const availability = await checkAvailability(villa.id, input.checkIn, input.checkOut);
  if (!availability.available) {
    return { reservation: null as unknown as Reservation, error: availability.reason };
  }

  const extrasMap = await getExtrasMap();
  const selectedExtras = (input.extras || [])
    .filter(slug => extrasMap[slug])
    .map(slug => ({ slug, ...extrasMap[slug] }));

  const extrasTotal = selectedExtras.reduce((s, e) => s + e.price, 0);
  const subtotal = villa.pricePerNight * nights;
  const totalPrice = subtotal + villa.cleaningFee + villa.serviceFee + extrasTotal;
  const code = generateReservationCode();
  const id = randomUUID();
  const now = new Date().toISOString();
  const supabase = requireSupabaseAdmin();

  const { error } = await supabase.from('reservations').insert({
    id,
    code,
    villa_id: villa.id,
    status: 'pending',
    check_in: input.checkIn,
    check_out: input.checkOut,
    guests: input.guests,
    guest_first_name: input.firstName,
    guest_last_name: input.lastName,
    guest_email: input.email.toLowerCase(),
    guest_phone: input.phone,
    guest_tc_no: input.tcNo || null,
    notes: input.notes || null,
    kvkk_accepted_at: now,
    subtotal,
    cleaning_fee: villa.cleaningFee,
    service_fee: villa.serviceFee,
    extras_total: extrasTotal,
    total_price: totalPrice,
    payment_status: 'pending',
    customer_id: input.customerId || null,
  });

  if (error) {
    return { reservation: null as unknown as Reservation, error: 'Rezervasyon kaydedilemedi.' };
  }

  for (const extra of selectedExtras) {
    await supabase.from('reservation_extras').insert({
      reservation_id: id,
      extra_slug: extra.slug,
      extra_name: extra.name,
      price: extra.price,
    });
  }

  await supabase.from('reservation_timeline').insert({
    reservation_id: id,
    status: 'Rezervasyon Oluşturuldu',
    note: code,
  });

  const stored: StoredReservation = {
    id,
    code,
    status: 'pending',
    villaId: villa.id,
    villaSlug: villa.slug,
    villaName: villa.name,
    villaImage: villa.images[0] || '',
    villaLocation: villa.location,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    nights,
    pricePerNight: villa.pricePerNight,
    cleaningFee: villa.cleaningFee,
    serviceFee: villa.serviceFee,
    extrasTotal,
    totalPrice,
    guestFirstName: input.firstName,
    guestLastName: input.lastName,
    guestName: `${input.firstName} ${input.lastName}`,
    guestEmail: input.email.toLowerCase(),
    guestPhone: input.phone,
    guestTcNo: input.tcNo,
    notes: input.notes,
    paymentStatus: 'pending',
    createdAt: now,
    extras: selectedExtras.map(e => e.name),
    timeline: [],
  };

  return { reservation: toPublicReservation(stored) };
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase.from('reservations').select('*').eq('id', id).single();

  if (error || !data) return null;
  const mapped = await enrichReservation(mapSupabaseRow(data));
  return toPublicReservation(mapped);
}

export async function lookupReservation(code: string, email: string): Promise<Reservation | null> {
  const normalizedCode = code.toUpperCase().trim();
  const normalizedEmail = email.toLowerCase().trim();
  const supabase = requireSupabaseAdmin();

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('code', normalizedCode)
    .eq('guest_email', normalizedEmail)
    .maybeSingle();

  if (error || !data) return null;
  const mapped = await enrichReservation(mapSupabaseRow(data));
  return toPublicReservation(mapped);
}

export async function markReservationPaid(
  reservationId: string,
  paymentId: string,
  paymentMethod = 'Kredi Kartı'
): Promise<Reservation | null> {
  const supabase = requireSupabaseAdmin();
  const { error } = await supabase
    .from('reservations')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      payment_id: paymentId,
      payment_method: paymentMethod,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reservationId);

  if (error) throw new Error(`Ödeme kaydı güncellenemedi: ${error.message}`);

  await supabase.from('reservation_timeline').insert([
    { reservation_id: reservationId, status: 'Ödeme Alındı' },
    { reservation_id: reservationId, status: 'Rezervasyon Onaylandı' },
  ]);

  return getReservationById(reservationId);
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<Reservation | null> {
  const supabase = requireSupabaseAdmin();
  const { error } = await supabase
    .from('reservations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Rezervasyon durumu güncellenemedi: ${error.message}`);

  await supabase.from('reservation_timeline').insert({
    reservation_id: id,
    status: `Durum: ${status}`,
  });

  return getReservationById(id);
}

export async function getAllReservations(): Promise<Reservation[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Rezervasyon listesi alınamadı: ${error.message}`);

  const enriched = await Promise.all(
    (data || []).map(async row => toPublicReservation(await enrichReservation(mapSupabaseRow(row))))
  );
  return enriched;
}

export async function getReservationForPayment(
  id: string,
  email?: string
): Promise<Reservation | null> {
  const reservation = await getReservationById(id);
  if (!reservation) return null;
  if (email && reservation.guestEmail.toLowerCase() !== email.toLowerCase().trim()) {
    return null;
  }
  return reservation;
}

export async function getBlockedDates(villaId: string): Promise<string[]> {
  const reservations = await getReservationsForVilla(villaId);
  const dates = new Set<string>();

  for (const res of reservations) {
    if (res.status === 'cancelled') continue;
    const start = new Date(res.checkIn);
    const end = new Date(res.checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.add(d.toISOString().split('T')[0]);
    }
  }

  const manualBlocked = await getBlockedDatesForVilla(villaId);
  manualBlocked.forEach(d => dates.add(d));

  return Array.from(dates).sort();
}

export async function getReservationsByCustomerId(customerId: string): Promise<Reservation[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Rezervasyonlar alınamadı: ${error.message}`);

  const enriched = await Promise.all(
    (data || []).map(async row => toPublicReservation(await enrichReservation(mapSupabaseRow(row))))
  );
  return enriched;
}

export async function getReservationForCustomer(
  customerId: string,
  reservationId: string
): Promise<Reservation | null> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', reservationId)
    .eq('customer_id', customerId)
    .maybeSingle();

  if (error || !data) return null;
  return toPublicReservation(await enrichReservation(mapSupabaseRow(data)));
}
