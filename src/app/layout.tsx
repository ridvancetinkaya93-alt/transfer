import type { Metadata, Viewport } from 'next';
import ConditionalShell from '@/components/layout/ConditionalShell';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ba0036',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'RCetinkaya Turizm | Lüks Villa Kiralama & VIP Transfer',
    template: '%s | RCetinkaya Turizm',
  },
  description: 'Türkiye\'nin en lüks villalarını keşfedin. Fethiye, Bodrum, Antalya, Kalkan ve Kaş\'ta özel villa kiralama ve VIP transfer hizmetleri. TÜRSAB onaylı, güvenli rezervasyon.',
  keywords: ['villa kiralama', 'lüks villa', 'Bodrum villa', 'Fethiye villa', 'Kalkan villa', 'VIP transfer', 'tatil', 'Türkiye'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://rcetinkayaturizm.com',
    siteName: 'RCetinkaya Turizm',
    title: 'RCetinkaya Turizm | Lüks Villa Kiralama',
    description: 'Hayalinizdeki tatili lüks villalarımızla gerçeğe dönüştürüyoruz.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RCetinkaya Turizm | Lüks Villa Kiralama',
    description: 'Hayalinizdeki tatili lüks villalarımızla gerçeğe dönüştürüyoruz.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>
        <ConditionalShell>
          {children}
        </ConditionalShell>
      </body>
    </html>
  );
}
