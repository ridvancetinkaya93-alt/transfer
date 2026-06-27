export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type TransferStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled';

export interface Amenity {
  icon: string;
  name: string;
}

export interface Review {
  id: string;
  villaId: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Villa {
  id: string;
  slug: string;
  name: string;
  location: string;
  region: string;
  shortDescription: string;
  description: string;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  images: string[];
  features: string[];
  amenities: Amenity[];
  rules: string[];
  coordinates: { lat: number; lng: number };
  isFeatured: boolean;
  isAvailable: boolean;
  tags: string[];
  checkInTime: string;
  checkOutTime: string;
  minNights: number;
}

export interface Region {
  id: string;
  name: string;
  villaCount: number;
  image: string;
}

export interface ExtraService {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface ReservationExtra {
  slug: string;
  name: string;
  price: number;
}

export interface TimelineItem {
  date: string;
  status: string;
  icon: string;
  done: boolean;
}

export interface Reservation {
  id: string;
  code: string;
  status: ReservationStatus;
  villaId: string;
  villaSlug: string;
  villaName: string;
  villaImage: string;
  villaLocation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  extrasTotal: number;
  totalPrice: number;
  guestFirstName: string;
  guestLastName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestTcNo?: string;
  notes?: string;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  paymentMethod?: string;
  createdAt: string;
  extras: string[];
  timeline: TimelineItem[];
  customerId?: string;
}

export interface TransferRequest {
  id: string;
  code: string;
  type: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  passengers: number;
  vehicleSlug?: string;
  guestName: string;
  guestPhone: string;
  notes?: string;
  status: TransferStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
}

export interface SavedCard {
  id: string;
  cardAlias?: string;
  cardBrand?: string;
  lastFour: string;
  isDefault: boolean;
  createdAt: string;
}
