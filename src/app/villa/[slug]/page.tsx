import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVillaBySlug, getAllVillaSlugs, getReviewsByVillaId, getVillas } from '@/lib/db/villas';
import { siteConfig } from '@/lib/site-config';
import VillaDetailClient from './VillaDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);
  if (!villa) return { title: 'Villa Bulunamadı' };

  return {
    title: `${villa.name} | ${villa.location}`,
    description: villa.shortDescription,
    openGraph: {
      title: `${villa.name} — ${villa.location}`,
      description: villa.shortDescription,
      images: [{ url: villa.images[0] }],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllVillaSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function VillaDetailPage({ params }: Props) {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);
  if (!villa) notFound();

  const [reviews, regionVillas] = await Promise.all([
    getReviewsByVillaId(villa.id),
    getVillas({ region: villa.region }),
  ]);
  const similarVillas = regionVillas.filter(v => v.id !== villa.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: villa.name,
    description: villa.shortDescription,
    image: villa.images[0],
    url: `${siteConfig.url}/villa/${villa.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: villa.location,
      addressCountry: 'TR',
    },
    priceRange: `₺${villa.pricePerNight}+`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: villa.rating,
      reviewCount: villa.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VillaDetailClient villa={villa} reviews={reviews} similarVillas={similarVillas} />
    </>
  );
}
