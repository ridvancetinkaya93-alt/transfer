// Production seed catalog — yalnızca `npm run db:seed` ile Supabase'e yüklenir.
import { seedImages } from './images';

function villaImages(slug: keyof typeof seedImages.villas): string[] {
  return [...seedImages.villas[slug]];
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

export const villas: Villa[] = [
  {
    id: '1',
    slug: 'villa-azure-horizon',
    name: 'Villa Azure Horizon',
    location: 'Kaş, Antalya',
    region: 'kas',
    shortDescription: 'Akdeniz\'in masmavi sularına hakim, sonsuzluk havuzlu lüks villa',
    description: `Akdeniz'in masmavi sularına hakim bir konumda yer alan Villa Azure Horizon, lüks ve konforun en ince detayına kadar düşünüldüğü eşsiz bir mimariye sahiptir. Kaş'ın sakin atmosferinde, tamamen size özel bir sonsuzluk havuzu ve modern iç mekan tasarımıyla hayalinizdeki tatili yaşayacaksınız.

Geniş cam yüzeyleri sayesinde günün her saati doğal ışıkla dolan villa, her biri deniz manzaralı dört yatak odası ile misafirlerine mahremiyet ve huzur sunar. Tam donanımlı mutfağı ve açık hava yemek alanı ile keyifli akşam yemeklerinin tadını çıkarabilirsiniz.

Terrazzolu terasından gündoğumunu izleyebilir, özel sonsuzluk havuzunda serinleyebilir ve geceleri Akdeniz'in yıldızlı gökyüzünün altında şarabınızı yudumlarken eşsiz manzaranın tadını çıkarabilirsiniz.`,
    pricePerNight: 14500,
    cleaningFee: 2500,
    serviceFee: 5200,
    rating: 4.92,
    reviewCount: 24,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 4,
    squareMeters: 450,
    images: villaImages('villa-azure-horizon'),
    features: ['Sonsuzluk Havuzu', 'Deniz Manzarası', 'Özel Bahçe', 'Güvenli'],
    amenities: [
      { icon: 'wifi', name: 'Yüksek Hızlı Wi-Fi' },
      { icon: 'pool', name: 'Özel Sonsuzluk Havuzu' },
      { icon: 'ac_unit', name: 'Merkezi Klima' },
      { icon: 'skillet', name: 'Tam Donanımlı Mutfak' },
      { icon: 'tv', name: 'Smart TV & Netflix' },
      { icon: 'local_parking', name: 'Ücretsiz Otopark' },
      { icon: 'outdoor_grill', name: 'Barbekü Alanı' },
      { icon: 'hot_tub', name: 'Jakuzi' },
      { icon: 'security', name: '7/24 Güvenlik' },
      { icon: 'local_laundry_service', name: 'Çamaşır Makinesi' },
    ],
    rules: [
      'Giriş: 15:00 - 20:00 / Çıkış: En geç 10:00',
      'İç mekanda sigara içilmesi yasaktır.',
      'Evcil hayvan kabul edilmemektedir.',
      'Parti veya etkinlik düzenlenemez.',
    ],
    coordinates: { lat: 36.1979, lng: 29.6431 },
    isFeatured: true,
    isAvailable: true,
    tags: ['POPÜLER', 'Sonsuzluk Havuzu', 'Deniz Manzarası'],
    checkInTime: '15:00',
    checkOutTime: '10:00',
    minNights: 3,
  },
  {
    id: '2',
    slug: 'villa-moonlight-bodrum',
    name: 'Villa Moonlight',
    location: 'Bodrum, Muğla',
    region: 'bodrum',
    shortDescription: 'Bodrum körfezine nazır, muhteşem yat limanı manzaralı butik villa',
    description: `Bodrum yarımadasının en prestijli bölgesinde yer alan Villa Moonlight, Ege'nin kristal berraklığındaki sularına bakan konumuyla ziyaretçilerine soluksuz bir manzara sunar. Bodrum'un ikonik yat limanına yakın mesafede konumlanan villa, geleneksel Bodrum mimarisini modern lüksle buluşturmaktadır.

Beş yatak odasıyla on misafire kadar konaklama imkânı sunan villa, geniş terası, özel yüzme havuzu ve peyzaj düzenlenmiş bahçesiyle her anın tadını çıkarmanızı sağlar. Zeytinliklerin arasında gizlenmiş özel oturma alanları ve teraslı yapısıyla villa, adeta bir sanat eseri gibi tasarlanmıştır.`,
    pricePerNight: 15000,
    cleaningFee: 3000,
    serviceFee: 6000,
    rating: 5.0,
    reviewCount: 31,
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 5,
    squareMeters: 520,
    images: villaImages('villa-moonlight-bodrum'),
    features: ['Özel Havuz', 'Yat Limanı Manzarası', 'Zeytinlik', 'Butik'],
    amenities: [
      { icon: 'wifi', name: 'Fiber İnternet' },
      { icon: 'pool', name: 'Özel Yüzme Havuzu' },
      { icon: 'ac_unit', name: 'Merkezi Klima' },
      { icon: 'skillet', name: 'Şef Mutfağı' },
      { icon: 'tv', name: 'Home Cinema' },
      { icon: 'local_parking', name: '2 Araçlık Otopark' },
      { icon: 'spa', name: 'Masaj Odası' },
      { icon: 'fitness_center', name: 'Özel Gym' },
      { icon: 'outdoor_grill', name: 'Barbekü' },
      { icon: 'wine_bar', name: 'Şarap Mahzeni' },
    ],
    rules: [
      'Giriş: 16:00 - 21:00 / Çıkış: En geç 11:00',
      'İç ve dış mekanda sigara yasaktır.',
      'Evcil hayvan kabul edilmez.',
      'Gürültü saatleri: 23:00 - 08:00 arası sessizlik.',
    ],
    coordinates: { lat: 37.0360, lng: 27.4305 },
    isFeatured: true,
    isAvailable: true,
    tags: ['LÜKS', 'Deniz Manzarası', 'Büyük Grup'],
    checkInTime: '16:00',
    checkOutTime: '11:00',
    minNights: 5,
  },
  {
    id: '3',
    slug: 'villa-foresta-fethiye',
    name: 'Villa Foresta',
    location: 'Ölüdeniz, Fethiye',
    region: 'fethiye',
    shortDescription: 'Çam ormanlarıyla çevrili, Ölüdeniz\'e yürüme mesafesinde huzur köşesi',
    description: `Ölüdeniz'in efsanevi mavi lagününe sadece birkaç dakika yürüme mesafesinde yer alan Villa Foresta, çam ormanlarının ortasında gizlenmiş bir doğa harikasıdır. Doğayla iç içe tasarlanan bu villa, misafirlerine modern konfor ile doğallığın mükemmel birleşimini sunmaktadır.

Üç yatak odalı villa, özel havuzu, geniş terası ve doğayla bütünleşen peyzajıyla aileler ve çiftler için ideal bir seçimdir. Sabahları kuş sesleriyle uyanıp terasta kahvaltınızı yapabilir, öğleden sonra lagünde yüzüp akşamları havuz başında kokteyl içebilirsiniz.`,
    pricePerNight: 8750,
    cleaningFee: 1500,
    serviceFee: 3200,
    rating: 4.8,
    reviewCount: 18,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    squareMeters: 280,
    images: villaImages('villa-foresta-fethiye'),
    features: ['Orman İçi', 'Lagün Yakını', 'Doğa', 'Huzur'],
    amenities: [
      { icon: 'wifi', name: 'Wi-Fi' },
      { icon: 'pool', name: 'Özel Havuz' },
      { icon: 'ac_unit', name: 'Klima' },
      { icon: 'skillet', name: 'Tam Mutfak' },
      { icon: 'tv', name: 'Smart TV' },
      { icon: 'outdoor_grill', name: 'Barbekü' },
      { icon: 'local_parking', name: 'Otopark' },
    ],
    rules: [
      'Giriş: 15:00 / Çıkış: 10:00',
      'İç mekanda sigara yasaktır.',
      'Küçük evcil hayvanlara izin verilir.',
    ],
    coordinates: { lat: 36.5497, lng: 29.1184 },
    isFeatured: true,
    isAvailable: true,
    tags: ['YENİ', 'Doğa İçi', 'Aile Dostu'],
    checkInTime: '15:00',
    checkOutTime: '10:00',
    minNights: 3,
  },
  {
    id: '4',
    slug: 'villa-zen-belek',
    name: 'Villa Zen',
    location: 'Belek, Antalya',
    region: 'antalya',
    shortDescription: 'Golf sahası manzaralı, minimalist tasarımlı meditasyon odaklı lüks villa',
    description: `Antalya'nın ünlü golf destinasyonu Belek'te yer alan Villa Zen, minimalist Japon tasarım anlayışını Akdeniz lüksüyle buluşturan özgün bir yapıdır. Golf sahasına sıfır konumuyla golf tutkunları için ideal olan villa, aynı zamanda dinlenme ve ruhsal yenilenme arayanlar için de mükemmel bir retreat mekanıdır.

Doğayla iç içe tasarlanan zen bahçesi, özel yüzme havuzu ve meditasyon terrası ile villa, günlük hayatın stresinden uzaklaşmak isteyenlere eşsiz bir kaçış ortamı sunar.`,
    pricePerNight: 10200,
    cleaningFee: 2000,
    serviceFee: 4000,
    rating: 4.7,
    reviewCount: 15,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    squareMeters: 320,
    images: villaImages('villa-zen-belek'),
    features: ['Golf Manzarası', 'Zen Bahçesi', 'Meditasyon', 'Minimalist'],
    amenities: [
      { icon: 'wifi', name: 'Wi-Fi' },
      { icon: 'pool', name: 'Yüzme Havuzu' },
      { icon: 'spa', name: 'Spa & Sauna' },
      { icon: 'ac_unit', name: 'Klima' },
      { icon: 'skillet', name: 'Modern Mutfak' },
      { icon: 'fitness_center', name: 'Fitness Odası' },
      { icon: 'local_parking', name: 'Otopark' },
    ],
    rules: [
      'Giriş: 15:00 / Çıkış: 10:00',
      'Tüm alanlarda sigara yasaktır.',
      'Evcil hayvan kabul edilmez.',
    ],
    coordinates: { lat: 36.8560, lng: 31.0553 },
    isFeatured: true,
    isAvailable: true,
    tags: ['Golf', 'Spa', 'Minimalist'],
    checkInTime: '15:00',
    checkOutTime: '10:00',
    minNights: 2,
  },
  {
    id: '5',
    slug: 'villa-coral-pearl-kalkan',
    name: 'Villa Coral Pearl',
    location: 'Kalkan, Antalya',
    region: 'kalkan',
    shortDescription: 'Kalkan\'ın taş sokakları üzerinde, Akdeniz\'e bakan tarihi taş villa',
    description: `Kalkan'ın büyüleyici taş sokaklarının üzerinde, Akdeniz'e hakim bir konumda yükselen Villa Coral Pearl, geleneksel Likya mimarisinin zarifliğini günümüzün konforuyla buluşturmaktadır. Tarihi dokuya saygı gösteren taş duvarları ve otantik detaylarıyla villa, adeta yaşayan bir tarih müzesi gibidir.

Üst kattaki açık teras oturma alanından Kalkan körfezinin ve Akdeniz'in nefes kesen manzarasını izleyebilir, özel sonsuzluk havuzunda serinleyebilirsiniz. Villanın yemyeşil bahçesindeki bougainvillea çiçekleri ve limon ağaçları, size Akdeniz'in tüm renklerini sunar.`,
    pricePerNight: 12000,
    cleaningFee: 2200,
    serviceFee: 4800,
    rating: 4.9,
    reviewCount: 27,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 4,
    squareMeters: 380,
    images: villaImages('villa-coral-pearl-kalkan'),
    features: ['Tarihi Yapı', 'Sonsuzluk Havuzu', 'Deniz Manzarası', 'Otantik'],
    amenities: [
      { icon: 'wifi', name: 'Wi-Fi' },
      { icon: 'pool', name: 'Sonsuzluk Havuzu' },
      { icon: 'ac_unit', name: 'Klima' },
      { icon: 'skillet', name: 'Mutfak' },
      { icon: 'tv', name: 'Smart TV' },
      { icon: 'outdoor_grill', name: 'Barbekü' },
    ],
    rules: [
      'Giriş: 14:00 - 20:00 / Çıkış: 10:00',
      'Sigara sadece dış alanda izinlidir.',
      'Evcil hayvan kabul edilmez.',
    ],
    coordinates: { lat: 36.2668, lng: 29.4130 },
    isFeatured: false,
    isAvailable: true,
    tags: ['Tarihi', 'Panoramik Manzara', 'Butik'],
    checkInTime: '14:00',
    checkOutTime: '10:00',
    minNights: 4,
  },
  {
    id: '6',
    slug: 'infinity-view-mansion-bodrum',
    name: 'Infinity View Mansion',
    location: 'Türkbükü, Bodrum',
    region: 'bodrum',
    shortDescription: 'Türkbükü\'nün mavi sularına karşı, ultra modern geometrik lüks villa',
    description: `Türkbükü'nün yat limanına sıfır konumda yer alan Infinity View Mansion, çarpıcı geometrik mimarisi ve sınırsız Ege manzarasıyla Türkiye'nin en prestijli konaklama mekânlarından biridir. Altı yatak odalı bu dev mansiyonda 12 misafire kadar konfor ve mahremiyet sunulmaktadır.

Dev sonsuzluk havuzu, rooftop teras, şef mutfağı, home cinema ve özel spa alanıyla villa, adeta küçük bir otel kompleksi gibi donanımlıdır. Türkbükü'nün ünlü restoranlarına ve bohem atmosferine yürüme mesafesindeki konumuyla tatilinize sosyal bir boyut da katmaktadır.`,
    pricePerNight: 21500,
    cleaningFee: 4000,
    serviceFee: 8000,
    rating: 4.95,
    reviewCount: 12,
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 7,
    squareMeters: 750,
    images: villaImages('infinity-view-mansion-bodrum'),
    features: ['Ultra Lüks', 'Rooftop Teras', 'Özel Spa', 'Büyük Grup'],
    amenities: [
      { icon: 'wifi', name: 'Fiber İnternet' },
      { icon: 'pool', name: 'Dev Sonsuzluk Havuzu' },
      { icon: 'spa', name: 'Özel Spa & Hamam' },
      { icon: 'fitness_center', name: 'Özel Gym' },
      { icon: 'wine_bar', name: 'Şarap Mahzeni' },
      { icon: 'skillet', name: 'Şef Mutfağı' },
      { icon: 'tv', name: 'Home Cinema' },
      { icon: 'security', name: '7/24 Güvenlik' },
      { icon: 'local_parking', name: '4 Araçlık Garaj' },
      { icon: 'hot_tub', name: 'Jakuzi & Sauna' },
    ],
    rules: [
      'Giriş: 16:00 - 22:00 / Çıkış: 12:00',
      'Tüm alanlarda sigara yasaktır.',
      'Evcil hayvan kabul edilmez.',
      'Catering hizmet talebi önceden bildirilmelidir.',
    ],
    coordinates: { lat: 37.0987, lng: 27.3812 },
    isFeatured: false,
    isAvailable: true,
    tags: ['ULTRA LÜKS', 'Türkbükü', 'Büyük Grup'],
    checkInTime: '16:00',
    checkOutTime: '12:00',
    minNights: 7,
  },
  {
    id: '7',
    slug: 'olive-grove-retreat-fethiye',
    name: 'Olive Grove Retreat',
    location: 'Hisarönü, Fethiye',
    region: 'fethiye',
    shortDescription: 'Zeytin bahçesinin ortasında, geleneksel taş ve ahşap işçiliğiyle süslenmiş çiftlik villası',
    description: `Fethiye'nin sakin Hisarönü köyünde, asırlık zeytin ağaçlarının arasına gizlenmiş Olive Grove Retreat, şehrin gürültüsünden kaçıp doğanın kucağında huzur bulmak isteyenler için tasarlanmıştır. Geleneksel taş ve ahşap kullanımıyla inşa edilen villa, bölgenin otantik mimari dokusunu yansıtmaktadır.

Açık teras mutfağında sabah kahvaltısı yapabilir, meyve bahçesinde gezinti yapabilir ve akşamları ateş başında yerel halk ile tanışabilirsiniz. Ölüdeniz ve Babadağ'a yakın konumuyla yamaç paraşütü başta olmak üzere pek çok macera aktivitesine erişim imkânı da sunmaktadır.`,
    pricePerNight: 9800,
    cleaningFee: 1800,
    serviceFee: 3600,
    rating: 4.85,
    reviewCount: 22,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 350,
    images: villaImages('olive-grove-retreat-fethiye'),
    features: ['Zeytin Bahçesi', 'Otantik', 'Doğa', 'Aktivite'],
    amenities: [
      { icon: 'wifi', name: 'Wi-Fi' },
      { icon: 'pool', name: 'Yüzme Havuzu' },
      { icon: 'ac_unit', name: 'Klima' },
      { icon: 'skillet', name: 'Açık Mutfak' },
      { icon: 'outdoor_grill', name: 'Mangal & Barbekü' },
      { icon: 'local_parking', name: 'Otopark' },
    ],
    rules: [
      'Giriş: 15:00 / Çıkış: 10:00',
      'Bahçede ateş yakılabilir.',
      'Küçük evcil hayvanlara izin verilir.',
    ],
    coordinates: { lat: 36.5819, lng: 29.1024 },
    isFeatured: false,
    isAvailable: true,
    tags: ['Otantik', 'Aile', 'Macera'],
    checkInTime: '15:00',
    checkOutTime: '10:00',
    minNights: 3,
  },
  {
    id: '8',
    slug: 'villa-aegean-pearl-cesme',
    name: 'Villa Aegean Pearl',
    location: 'Alaçatı, Çeşme',
    region: 'izmir',
    shortDescription: 'Alaçatı\'nın taş sokakları kalbinde, butik otel konforunda özel villa',
    description: `Ege'nin moda destinasyonu Alaçatı'nın tarihi taş binaları arasında yer alan Villa Aegean Pearl, Yunanlılardan kalma taş duvarları ve renkli ahşap kepenklerini günümüzün minimalist tasarım anlayışıyla buluşturuyor. Küçük ve özel bu villa, çiftler ve küçük aileler için ideal bir kaçış noktasıdır.

Alaçatı'nın ünlü butik restoranlarına ve rüzgar sörfü merkezlerine yürüyerek ulaşılabilen villada taş havuz, çiçek bahçesi ve serin bir iç avlu bulunmaktadır. Her sabah kapınıza organik kahvaltı sepeti bırakılması, villada konaklamanın birbirinden leziz ayrıcalıklarından biridir.`,
    pricePerNight: 7500,
    cleaningFee: 1200,
    serviceFee: 2800,
    rating: 4.88,
    reviewCount: 35,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    squareMeters: 180,
    images: villaImages('villa-aegean-pearl-cesme'),
    features: ['Taş Ev', 'Alaçatı Merkez', 'Organik Kahvaltı', 'Butik'],
    amenities: [
      { icon: 'wifi', name: 'Wi-Fi' },
      { icon: 'pool', name: 'Taş Havuz' },
      { icon: 'ac_unit', name: 'Klima' },
      { icon: 'skillet', name: 'Küçük Mutfak' },
      { icon: 'tv', name: 'Smart TV' },
    ],
    rules: [
      'Giriş: 14:00 / Çıkış: 10:00',
      'Tüm alanlarda sigara yasaktır.',
      'Evcil hayvan kabul edilmez.',
    ],
    coordinates: { lat: 38.2770, lng: 26.3780 },
    isFeatured: false,
    isAvailable: true,
    tags: ['Rüzgar Sörfü', 'Alaçatı', 'Romantik'],
    checkInTime: '14:00',
    checkOutTime: '10:00',
    minNights: 2,
  },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    villaId: '1',
    author: 'Selin Demir',
    avatar: '',
    date: 'Ağustos 2024',
    rating: 5,
    comment: 'Harika bir deneyimdi! Manzara kesinlikle nefes kesici. Temizlik ve hizmet kalitesi beklediğimizin çok üzerindeydi. Kesinlikle tekrar geleceğiz.',
  },
  {
    id: 'r2',
    villaId: '1',
    author: 'Murat Yılmaz',
    avatar: '',
    date: 'Temmuz 2024',
    rating: 5,
    comment: 'Villa Azure\'da ailece çok keyifli vakit geçirdik. RCetinkaya Turizm ekibine her şey için teşekkür ederiz. Sonsuzluk havuzu muhteşemdi.',
  },
  {
    id: 'r3',
    villaId: '1',
    author: 'Ayşe Kara',
    avatar: '',
    date: 'Haziran 2024',
    rating: 5,
    comment: 'Gece manzarası inanılmaz. Çok sessiz ve huzurlu bir ortam. Mutfak eksiksiz donanımlıydı. Rezervasyon süreci de çok kolaydi.',
  },
  {
    id: 'r4',
    villaId: '2',
    author: 'Emre Öztürk',
    avatar: '',
    date: 'Ağustos 2024',
    rating: 5,
    comment: 'Bodrum\'da bu kalitede bir villa bulmak çok zordu. Tüm beklentilerimizi karşıladı ve aştı. Havuz alanı ve teras muhteşem.',
  },
];

export const regions = [
  { id: 'fethiye', name: 'Fethiye', villaCount: 0, image: seedImages.regions.fethiye },
  { id: 'bodrum', name: 'Bodrum', villaCount: 0, image: seedImages.regions.bodrum },
  { id: 'antalya', name: 'Antalya', villaCount: 0, image: seedImages.regions.antalya },
  { id: 'kalkan', name: 'Kalkan', villaCount: 0, image: seedImages.regions.kalkan },
  { id: 'kas', name: 'Kaş', villaCount: 0, image: seedImages.regions.kas },
  { id: 'izmir', name: 'İzmir', villaCount: 0, image: seedImages.regions.izmir },
];

export const bookingExtras = [
  { slug: 'transfer', icon: 'airport_shuttle', name: 'Havalimanı Transferi', description: 'Gidiş-Dönüş', price: 1800 },
  { slug: 'chef', icon: 'restaurant', name: 'Özel Şef Hizmeti', description: 'Günlük (kahvaltı dahil)', price: 2500 },
  { slug: 'cleaning', icon: 'cleaning_services', name: 'Günlük Temizlik', description: 'Her gün temizlik', price: 800 },
  { slug: 'baby', icon: 'crib', name: 'Bebek Karyolası', description: 'Bebek ekipmanı seti', price: 350 },
];

export const transferVehicles = [
  {
    slug: 'vito',
    name: 'Mercedes-Benz Vito',
    category: 'BUSINESS VAN',
    capacity: '1–7 Kişi',
    luggage: '7 Valiz',
    features: ['Klima', 'Deri Koltuk', 'USB Şarj', 'Su İkramı'],
    priceFrom: 2800,
    image: seedImages.transfers.vito,
    badge: 'EN POPÜLER',
    badgeColor: '#ba0036',
    description: 'Geniş iç hacmi ve konforlu koltuklarıyla gruplar için ideal seçim.',
  },
  {
    slug: 'e-serisi',
    name: 'Mercedes-Benz E-Serisi',
    category: 'BUSINESS SEDAN',
    capacity: '1–3 Kişi',
    luggage: '3 Valiz',
    features: ['Klima', 'Masaj Koltuğu', 'WiFi', 'Mini Bar'],
    priceFrom: 2200,
    image: seedImages.transfers['e-serisi'],
    badge: 'EXECUTIVE',
    badgeColor: '#1b1c1c',
    description: 'İş seyahatlerinin vazgeçilmez tercihi, şık ve konforlu.',
  },
  {
    slug: 'v-serisi',
    name: 'Mercedes-Benz V-Serisi',
    category: 'LUXURY VAN',
    capacity: '1–8 Kişi',
    luggage: '8 Valiz',
    features: ['Panoramik Cam', 'VIP Koltuk', 'WiFi', 'TV Ekranı', 'Mini Bar'],
    priceFrom: 4500,
    image: seedImages.transfers['v-serisi'],
    badge: 'ULTRA VIP',
    badgeColor: '#ba0036',
    description: 'En özel anlara özel VIP deneyim.',
  },
  {
    slug: 'sprinter',
    name: 'Mercedes Sprinter VIP',
    category: 'GRUP VAN',
    capacity: '1–14 Kişi',
    luggage: '14 Valiz',
    features: ['VIP Koltuk', 'Klima', 'USB Şarj', 'Su & İkram'],
    priceFrom: 5500,
    image: seedImages.transfers.sprinter,
    badge: 'BÜYÜK GRUP',
    badgeColor: '#006a45',
    description: 'Büyük aile veya iş grupları için tam donanımlı lüks araç.',
  },
];
