import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır.'),
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Konu en az 3 karakter olmalıdır.'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır.'),
});

export const reservationCreateSchema = z.object({
  villaSlug: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(20),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  tcNo: z.string().optional(),
  notes: z.string().optional(),
  kvkk: z.literal(true, { message: 'KVKK onayı zorunludur.' }),
  extras: z.array(z.string()).optional().default([]),
});

export const reservationLookupSchema = z.object({
  code: z.string().min(5),
  email: z.string().email(),
});

export const transferRequestSchema = z.object({
  type: z.enum(['airport-pickup', 'airport-dropoff', 'city', 'daily']),
  from: z.string().min(2),
  to: z.string().min(2),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  passengers: z.number().int().min(1).max(14),
  vehicle: z.string().optional(),
  name: z.string().min(2),
  phone: z.string().min(10),
  notes: z.string().optional(),
});

export const paymentInitiateSchema = z.object({
  reservationId: z.string().uuid(),
  saveCard: z.boolean().optional(),
  savedCardId: z.string().uuid().optional(),
});

export const customerRegisterSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır.'),
  lastName: z.string().min(2, 'Ad en az 2 karakter olmalıdır.'),
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası girin.'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır.'),
});

export const customerLoginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  password: z.string().min(1, 'Şifre zorunludur.'),
});

export const customerProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10).optional(),
});
