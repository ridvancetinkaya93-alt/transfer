import type { Villa } from '@/types/database';

export const DEMO_VILLA_SLUG = 'demo-villa-banka-test';
export const DEMO_VILLA_ID = '00000000-0000-4000-a000-000000000001';
export const DEMO_REGION_SLUG = 'fethiye';

export const DEMO_GUEST = {
  firstName: 'Test',
  lastName: 'Kullanici',
  email: 'demo@rcetinkayaturizm.com',
  phone: '+905551234567',
  tcNo: '11111111111',
};

/** Banka / iyzico incelemesi için sabit düşük tutarlı demo ürün */
export const demoVillaDefinition: Omit<Villa, 'id'> & { id: string } = {
  id: DEMO_VILLA_ID,
  slug: DEMO_VILLA_SLUG,
  name: 'Demo Villa — Banka Test',
  location: 'Fethiye, Muğla (Test)',
  region: DEMO_REGION_SLUG,
  shortDescription: 'Banka ve ödeme kuruluşu test incelemesi için demo villa ürünü',
  description:
    'Bu ürün yalnızca ödeme akışının test edilmesi amacıyla oluşturulmuştur. Gerçek konaklama hizmeti sunmaz. Banka ve iyzico merchant onay sürecinde sepete ekleme ve kredi kartı ödeme ekranının doğrulanması için kullanılır.',
  pricePerNight: 100,
  cleaningFee: 0,
  serviceFee: 0,
  rating: 5,
  reviewCount: 0,
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 1,
  squareMeters: 120,
  images: ['/og-image.svg'],
  features: ['Demo Ürün', 'Banka Testi'],
  amenities: [
    { icon: 'credit_card', name: 'Test Ödeme' },
    { icon: 'verified', name: 'iyzico 3D Secure' },
  ],
  rules: ['Bu bir test ürünüdür.', 'Gerçek rezervasyon için diğer villaları inceleyin.'],
  coordinates: { lat: 36.6213, lng: 29.1164 },
  isFeatured: true,
  isAvailable: true,
  tags: ['BANKA TEST', 'DEMO'],
  checkInTime: '14:00',
  checkOutTime: '11:00',
  minNights: 1,
};

export function isDemoVillaSlug(slug: string): boolean {
  return slug === DEMO_VILLA_SLUG;
}

export function getDemoVilla(): Villa {
  return { ...demoVillaDefinition };
}

export function getDemoCheckInOut(): { checkIn: string; checkOut: string } {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 30);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 1);

  return {
    checkIn: checkIn.toISOString().split('T')[0],
    checkOut: checkOut.toISOString().split('T')[0],
  };
}
