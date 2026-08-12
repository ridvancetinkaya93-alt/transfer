import type { Villa, Region } from '@/types/database';
import { getDemoVilla } from '@/lib/mock/demo-catalog';

const villaForesta: Villa = {
  id: 'mock-villa-foresta',
  slug: 'villa-foresta-fethiye',
  name: 'Villa Foresta',
  location: 'Ölüdeniz, Fethiye',
  region: 'fethiye',
  shortDescription: 'Çam ormanlarıyla çevrili, Ölüdeniz\'e yürüme mesafesinde huzur köşesi',
  description: 'Demo katalog villa — test amaçlı.',
  pricePerNight: 8750,
  cleaningFee: 1500,
  serviceFee: 3200,
  rating: 4.8,
  reviewCount: 18,
  maxGuests: 6,
  bedrooms: 3,
  bathrooms: 3,
  squareMeters: 280,
  images: ['/og-image.svg'],
  features: ['Özel Havuz', 'Doğa Manzarası'],
  amenities: [
    { icon: 'wifi', name: 'Wi-Fi' },
    { icon: 'pool', name: 'Özel Havuz' },
  ],
  rules: ['Giriş: 15:00 / Çıkış: 10:00'],
  coordinates: { lat: 36.549, lng: 29.115 },
  isFeatured: true,
  isAvailable: true,
  tags: ['POPÜLER'],
  checkInTime: '15:00',
  checkOutTime: '10:00',
  minNights: 3,
};

const villaMoonlight: Villa = {
  id: 'mock-villa-moonlight',
  slug: 'villa-moonlight-bodrum',
  name: 'Villa Moonlight',
  location: 'Bodrum, Muğla',
  region: 'bodrum',
  shortDescription: 'Bodrum körfezine nazır butik villa',
  description: 'Demo katalog villa — test amaçlı.',
  pricePerNight: 15000,
  cleaningFee: 3000,
  serviceFee: 6000,
  rating: 5,
  reviewCount: 31,
  maxGuests: 10,
  bedrooms: 5,
  bathrooms: 5,
  squareMeters: 520,
  images: ['/og-image.svg'],
  features: ['Özel Havuz', 'Deniz Manzarası'],
  amenities: [
    { icon: 'wifi', name: 'Fiber İnternet' },
    { icon: 'pool', name: 'Özel Yüzme Havuzu' },
  ],
  rules: ['Giriş: 16:00 / Çıkış: 11:00'],
  coordinates: { lat: 37.036, lng: 27.43 },
  isFeatured: true,
  isAvailable: true,
  tags: ['LÜKS'],
  checkInTime: '16:00',
  checkOutTime: '11:00',
  minNights: 5,
};

export const mockVillas: Villa[] = [getDemoVilla(), villaForesta, villaMoonlight];

export const mockRegions: Region[] = [
  { id: 'fethiye', name: 'Fethiye', villaCount: 2, image: '/og-image.svg' },
  { id: 'bodrum', name: 'Bodrum', villaCount: 1, image: '/og-image.svg' },
];

export const mockBookingExtras = [
  { id: '1', slug: 'transfer', icon: 'airport_shuttle', name: 'Havalimanı Transferi', description: 'Gidiş-Dönüş', price: 1800 },
  { id: '2', slug: 'chef', icon: 'restaurant', name: 'Özel Şef Hizmeti', description: 'Günlük', price: 2500 },
  { id: '3', slug: 'cleaning', icon: 'cleaning_services', name: 'Günlük Temizlik', description: 'Her gün', price: 800 },
  { id: '4', slug: 'baby', icon: 'crib', name: 'Bebek Karyolası', description: 'Bebek seti', price: 350 },
];

export const mockTransferVehicles = [
  {
    id: '1',
    slug: 'vito',
    name: 'Mercedes-Benz Vito',
    category: 'BUSINESS VAN',
    capacity: '1–7 Kişi',
    luggage: '7 Valiz',
    features: ['Klima', 'Deri Koltuk'],
    priceFrom: 2800,
    image: '/og-image.svg',
    badge: 'EN POPÜLER',
    badgeColor: '#ba0036',
    description: 'Grup transferleri için ideal.',
  },
];
