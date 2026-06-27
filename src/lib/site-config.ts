export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'RCetinkaya Turizm',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rcetinkayaturizm.com',
  phone: process.env.NEXT_PUBLIC_SITE_PHONE || '',
  phoneDisplay: process.env.NEXT_PUBLIC_SITE_PHONE_DISPLAY || '',
  whatsapp: (process.env.NEXT_PUBLIC_SITE_WHATSAPP || '').replace(/\D/g, ''),
  email: process.env.NEXT_PUBLIC_SITE_EMAIL || 'info@rcetinkayaturizm.com',
  address: process.env.NEXT_PUBLIC_SITE_ADDRESS || 'Fethiye, Muğla / Türkiye',
  tursab: process.env.NEXT_PUBLIC_TURSAB_LABEL || 'TÜRSAB Onaylı Acente',
  heroImage: process.env.NEXT_PUBLIC_HERO_IMAGE || '/seed/site/hero-main.jpg',
  vipTransferHero: process.env.NEXT_PUBLIC_VIP_TRANSFER_HERO || '/seed/site/vip-transfer-hero.jpg',
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/rcetinkayaturizm',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/rcetinkayaturizm',
  },
};

export function telLink(): string {
  return siteConfig.phone ? `tel:${siteConfig.phone}` : '#';
}

export function whatsappLink(text?: string): string {
  if (!siteConfig.whatsapp) return '#';
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
