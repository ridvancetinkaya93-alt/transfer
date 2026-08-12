import { cookies } from 'next/headers';
import type { Reservation } from '@/types/database';

const COOKIE_PREFIX = 'mock_res_';

export async function persistMockReservation(reservation: Reservation): Promise<void> {
  const jar = await cookies();
  jar.set(`${COOKIE_PREFIX}${reservation.id}`, JSON.stringify(reservation), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/',
  });
}

export async function readMockReservation(id: string): Promise<Reservation | null> {
  const jar = await cookies();
  const raw = jar.get(`${COOKIE_PREFIX}${id}`)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Reservation;
  } catch {
    return null;
  }
}

export async function updateMockReservationCookie(reservation: Reservation): Promise<void> {
  await persistMockReservation(reservation);
}
