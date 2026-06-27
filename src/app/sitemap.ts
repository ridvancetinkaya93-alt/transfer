import type { MetadataRoute } from 'next';
import { getAllVillaSlugs } from '@/lib/db/villas';
import { siteConfig } from '@/lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const slugs = await getAllVillaSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/villalar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/vip-transfer`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/yat-kiralama`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/hakkimizda`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const villaPages: MetadataRoute.Sitemap = slugs.map(slug => ({
    url: `${base}/villa/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...villaPages];
}
