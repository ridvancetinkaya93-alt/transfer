/**
 * Yerel seed görsel yolları — public/seed/ altında.
 * Gerçek fotoğraflarınızla değiştirin; dosya adları ve yollar aynı kalabilir.
 * Detay: public/seed/README.md
 */
export const seedImages = {
  site: {
    heroMain: '/seed/site/hero-main.jpg',
    vipTransferHero: '/seed/site/vip-transfer-hero.jpg',
    ogImage: '/seed/site/og-social.jpg',
  },
  regions: {
    fethiye: '/seed/regions/fethiye.jpg',
    bodrum: '/seed/regions/bodrum.jpg',
    antalya: '/seed/regions/antalya.jpg',
    kalkan: '/seed/regions/kalkan.jpg',
    kas: '/seed/regions/kas.jpg',
    izmir: '/seed/regions/izmir.jpg',
  },
  villas: {
    'villa-azure-horizon': [
      '/seed/villas/villa-azure-horizon/01-cover.jpg',
      '/seed/villas/villa-azure-horizon/02-gallery.jpg',
      '/seed/villas/villa-azure-horizon/03-gallery.jpg',
      '/seed/villas/villa-azure-horizon/04-gallery.jpg',
      '/seed/villas/villa-azure-horizon/05-gallery.jpg',
    ],
    'villa-moonlight-bodrum': [
      '/seed/villas/villa-moonlight-bodrum/01-cover.jpg',
      '/seed/villas/villa-moonlight-bodrum/02-gallery.jpg',
      '/seed/villas/villa-moonlight-bodrum/03-gallery.jpg',
      '/seed/villas/villa-moonlight-bodrum/04-gallery.jpg',
      '/seed/villas/villa-moonlight-bodrum/05-gallery.jpg',
    ],
    'villa-foresta-fethiye': [
      '/seed/villas/villa-foresta-fethiye/01-cover.jpg',
      '/seed/villas/villa-foresta-fethiye/02-gallery.jpg',
      '/seed/villas/villa-foresta-fethiye/03-gallery.jpg',
      '/seed/villas/villa-foresta-fethiye/04-gallery.jpg',
      '/seed/villas/villa-foresta-fethiye/05-gallery.jpg',
    ],
    'villa-zen-belek': [
      '/seed/villas/villa-zen-belek/01-cover.jpg',
      '/seed/villas/villa-zen-belek/02-gallery.jpg',
      '/seed/villas/villa-zen-belek/03-gallery.jpg',
      '/seed/villas/villa-zen-belek/04-gallery.jpg',
      '/seed/villas/villa-zen-belek/05-gallery.jpg',
    ],
    'villa-coral-pearl-kalkan': [
      '/seed/villas/villa-coral-pearl-kalkan/01-cover.jpg',
      '/seed/villas/villa-coral-pearl-kalkan/02-gallery.jpg',
      '/seed/villas/villa-coral-pearl-kalkan/03-gallery.jpg',
      '/seed/villas/villa-coral-pearl-kalkan/04-gallery.jpg',
      '/seed/villas/villa-coral-pearl-kalkan/05-gallery.jpg',
    ],
    'infinity-view-mansion-bodrum': [
      '/seed/villas/infinity-view-mansion-bodrum/01-cover.jpg',
      '/seed/villas/infinity-view-mansion-bodrum/02-gallery.jpg',
      '/seed/villas/infinity-view-mansion-bodrum/03-gallery.jpg',
      '/seed/villas/infinity-view-mansion-bodrum/04-gallery.jpg',
      '/seed/villas/infinity-view-mansion-bodrum/05-gallery.jpg',
    ],
    'olive-grove-retreat-fethiye': [
      '/seed/villas/olive-grove-retreat-fethiye/01-cover.jpg',
      '/seed/villas/olive-grove-retreat-fethiye/02-gallery.jpg',
      '/seed/villas/olive-grove-retreat-fethiye/03-gallery.jpg',
      '/seed/villas/olive-grove-retreat-fethiye/04-gallery.jpg',
      '/seed/villas/olive-grove-retreat-fethiye/05-gallery.jpg',
    ],
    'villa-aegean-pearl-cesme': [
      '/seed/villas/villa-aegean-pearl-cesme/01-cover.jpg',
      '/seed/villas/villa-aegean-pearl-cesme/02-gallery.jpg',
      '/seed/villas/villa-aegean-pearl-cesme/03-gallery.jpg',
      '/seed/villas/villa-aegean-pearl-cesme/04-gallery.jpg',
      '/seed/villas/villa-aegean-pearl-cesme/05-gallery.jpg',
    ],
  },
  transfers: {
    vito: '/seed/transfers/vito.jpg',
    'e-serisi': '/seed/transfers/e-serisi.jpg',
    'v-serisi': '/seed/transfers/v-serisi.jpg',
    sprinter: '/seed/transfers/sprinter.jpg',
  },
} as const;

/** İndirme scripti için kaynak URL'ler (Unsplash — yalnızca seed oluşturma) */
export const seedImageSources: Record<string, string> = {
  '/seed/site/hero-main.jpg': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80',
  '/seed/site/vip-transfer-hero.jpg': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80',
  '/seed/site/og-social.jpg': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
  '/seed/regions/fethiye.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '/seed/regions/bodrum.jpg': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
  '/seed/regions/antalya.jpg': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  '/seed/regions/kalkan.jpg': 'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800&q=80',
  '/seed/regions/kas.jpg': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  '/seed/regions/izmir.jpg': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  '/seed/transfers/vito.jpg': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
  '/seed/transfers/e-serisi.jpg': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
  '/seed/transfers/v-serisi.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  '/seed/transfers/sprinter.jpg': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
};

// Villa görselleri — catalog ile eşleşen Unsplash kaynakları
const villaSources: Record<string, string[]> = {
  'villa-azure-horizon': [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  ],
  'villa-moonlight-bodrum': [
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
  ],
  'villa-foresta-fethiye': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  ],
  'villa-zen-belek': [
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  ],
  'villa-coral-pearl-kalkan': [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800&q=80',
    'https://images.unsplash.com/photo-1533044309907-0fa3413da946?w=800&q=80',
  ],
  'infinity-view-mansion-bodrum': [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
    'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=800&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
  ],
  'olive-grove-retreat-fethiye': [
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1200&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80',
  ],
  'villa-aegean-pearl-cesme': [
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
    'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
  ],
};

for (const [slug, paths] of Object.entries(seedImages.villas)) {
  const urls = villaSources[slug];
  if (urls) {
    paths.forEach((path, i) => {
      if (urls[i]) seedImageSources[path] = urls[i];
    });
  }
}
