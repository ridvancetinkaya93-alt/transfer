import { randomUUID } from 'crypto';
import type { Reservation, ReservationStatus, PaymentStatus } from '@/types/database';
import { getNightCount, generateReservationCode } from '@/lib/utils';
import { getVillaById, getVillaBySlug } from '@/lib/db/villas';
import { mockBookingExtras } from '@/lib/mock/catalog-data';
import { DEMO_VILLA_ID, isDemoVillaSlug } from '@/lib/mock/demo-catalog';
import type { CreateReservationInput } from '@/lib/db/reservations';

interface StoredReservation extends Reservation {
  villaId: string;
}

type ReservationStore = Map<string, StoredReservation>;

declare global {
  // eslint-disable-next-line no-var
  var __mockReservations: ReservationStore | undefined;
}

function store(): ReservationStore {
  if (!globalThis.__mockReservations) {
    globalThis.__mockReservations = new Map();
  }
  return globalThis.__mockReservations;
}

function extrasMap() {
  return Object.fromEntries(mockBookingExtras.map(e => [e.slug, { name: e.name, price: e.price }]));
}

function buildTimeline(res: StoredReservation) {
  const items = [
    { date: res.createdAt.split('T')[0], status: 'Rezervasyon Oluşturuldu', icon: 'confirmation_number', done: true },
  ];
  if (res.paymentStatus === 'paid') {
    items.push({ date: res.paymentDate || res.createdAt.split('T')[0], status: 'Ödeme Alındı', icon: 'payments', done: true });
    items.push({ date: res.paymentDate || res.createdAt.split('T')[0], status: 'Rezervasyon Onaylandı', icon: 'verified', done: true });
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

function toPublic(res: StoredReservation): Reservation {
  return {
    ...res,
    guestName: `${res.guestFirstName} ${res.guestLastName}`,
    nights: getNightCount(res.checkIn, res.checkOut),
    timeline: buildTimeline(res),
  };
}

async function enrich(stored: StoredReservation): Promise<StoredReservation> {
  const villa = await getVillaById(stored.villaId);
  if (villa) {
    stored.villaSlug = villa.slug;
    stored.villaName = villa.name;
    stored.villaImage = villa.images[0] || '';
    stored.villaLocation = villa.location;
    stored.pricePerNight = villa.pricePerNight;
  }
  return stored;
}

export async function mockCheckAvailability(
  villaId: string,
  checkIn: string,
  checkOut: string,
  excludeReservationId?: string
): Promise<{ available: boolean; reason?: string }> {
  if (villaId === DEMO_VILLA_ID) return { available: true };

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (end <= start) return { available: false, reason: 'Çıkış tarihi girişten sonra olmalıdır.' };

  for (const res of store().values()) {
    if (res.villaId !== villaId || res.status === 'cancelled') continue;
    if (excludeReservationId && res.id === excludeReservationId) continue;
    const rStart = new Date(res.checkIn);
    const rEnd = new Date(res.checkOut);
    if (start < rEnd && end > rStart) {
      return { available: false, reason: 'Seçilen tarihler müsait değil.' };
    }
  }
  return { available: true };
}

export async function mockCreateReservation(input: CreateReservationInput): Promise<{
  reservation: Reservation;
  error?: string;
}> {
  const villa = await getVillaBySlug(input.villaSlug);
  if (!villa) return { reservation: null as unknown as Reservation, error: 'Villa bulunamadı.' };

  const nights = getNightCount(input.checkIn, input.checkOut);
  if (!isDemoVillaSlug(input.villaSlug) && nights < villa.minNights) {
    return { reservation: null as unknown as Reservation, error: `Bu villa için minimum ${villa.minNights} gece konaklama gereklidir.` };
  }
  if (input.guests > villa.maxGuests) {
    return { reservation: null as unknown as Reservation, error: 'Misafir sayısı villa kapasitesini aşıyor.' };
  }

  const availability = await mockCheckAvailability(villa.id, input.checkIn, input.checkOut);
  if (!availability.available) {
    return { reservation: null as unknown as Reservation, error: availability.reason };
  }

  const map = extrasMap();
  const selectedExtras = (input.extras || []).filter(slug => map[slug]).map(slug => ({ slug, ...map[slug] }));
  const extrasTotal = selectedExtras.reduce((s, e) => s + e.price, 0);
  const totalPrice = villa.pricePerNight * nights + villa.cleaningFee + villa.serviceFee + extrasTotal;
  const now = new Date().toISOString();

  const stored: StoredReservation = {
    id: randomUUID(),
    code: generateReservationCode(),
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
    customerId: input.customerId,
  };

  store().set(stored.id, stored);
  const reservation = toPublic(stored);
  const { persistMockReservation } = await import('@/lib/mock/reservation-cookies');
  await persistMockReservation(reservation);
  return { reservation };
}

export async function mockGetReservationById(id: string): Promise<Reservation | null> {
  const res = store().get(id);
  if (res) return toPublic(await enrich({ ...res }));

  const { readMockReservation } = await import('@/lib/mock/reservation-cookies');
  return readMockReservation(id);
}

export async function mockLookupReservation(code: string, email: string): Promise<Reservation | null> {
  const normalizedCode = code.toUpperCase().trim();
  const normalizedEmail = email.toLowerCase().trim();
  for (const res of store().values()) {
    if (res.code === normalizedCode && res.guestEmail === normalizedEmail) {
      return toPublic(await enrich({ ...res }));
    }
  }
  return null;
}

export async function mockMarkReservationPaid(
  reservationId: string,
  paymentId: string,
  paymentMethod = 'Kredi Kartı'
): Promise<Reservation | null> {
  const res = store().get(reservationId);
  if (!res) return null;
  res.paymentStatus = 'paid' as PaymentStatus;
  res.status = 'confirmed';
  res.paymentDate = new Date().toISOString();
  res.paymentMethod = paymentMethod;
  store().set(reservationId, res);
  const paid = await mockGetReservationById(reservationId);
  if (paid) {
    const { updateMockReservationCookie } = await import('@/lib/mock/reservation-cookies');
    await updateMockReservationCookie(paid);
  }
  return paid;
}

export async function mockUpdateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
  const res = store().get(id);
  if (!res) return null;
  res.status = status;
  store().set(id, res);
  return mockGetReservationById(id);
}

export async function mockGetAllReservations(): Promise<Reservation[]> {
  const all = await Promise.all([...store().keys()].map(id => mockGetReservationById(id)));
  return all.filter((r): r is Reservation => r !== null);
}

export async function mockGetReservationsByCustomerId(customerId: string): Promise<Reservation[]> {
  const all = await mockGetAllReservations();
  return all.filter(r => r.customerId === customerId);
}

export async function mockGetReservationForCustomer(customerId: string, reservationId: string): Promise<Reservation | null> {
  const res = await mockGetReservationById(reservationId);
  if (!res || res.customerId !== customerId) return null;
  return res;
}

export async function mockGetBlockedDates(villaId: string): Promise<string[]> {
  const dates = new Set<string>();
  for (const res of store().values()) {
    if (res.villaId !== villaId || res.status === 'cancelled') continue;
    const start = new Date(res.checkIn);
    const end = new Date(res.checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.add(d.toISOString().split('T')[0]);
    }
  }
  return Array.from(dates).sort();
}

export async function mockGetReservationsForVilla(villaId: string): Promise<StoredReservation[]> {
  return [...store().values()].filter(r => r.villaId === villaId && r.status !== 'cancelled');
}
