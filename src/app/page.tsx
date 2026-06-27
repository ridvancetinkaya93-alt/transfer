import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/ui/SearchBar';
import VillaCard from '@/components/ui/VillaCard';
import ReviewAvatar from '@/components/ui/ReviewAvatar';
import { getFeaturedVillas, getRegions, getSiteStats, getAllReviews } from '@/lib/db/villas';
import { whatsappLink, siteConfig } from '@/lib/site-config';
import { formatPriceShort } from '@/lib/utils';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'RCetinkaya Turizm | Lüks Villa Kiralama & VIP Transfer',
  description: 'Türkiye\'nin en lüks villalarını keşfedin. Fethiye, Bodrum, Antalya, Kalkan ve Kaş\'ta özel villa kiralama.',
};

const trustItems = [
  {
    icon: 'verified_user',
    title: 'TÜRSAB Onaylı Acente',
    desc: 'Türkiye Seyahat Acentaları Birliği onaylı, kayıtlı turizm acentamız güvencesiyle hizmetinizdeyiz.',
  },
  {
    icon: 'security',
    title: 'Güvenli Ödeme',
    desc: 'SSL şifrelemeli, 3D Secure destekli ödeme altyapımız ile kişisel ve finansal bilgileriniz tamamen güvende.',
  },
  {
    icon: 'support_agent',
    title: '7/24 Destek',
    desc: 'Tatil öncesi, sırası ve sonrasında WhatsApp ve telefon ile her an yanınızdayız.',
  },
  {
    icon: 'star',
    title: 'Seçkin Portföy',
    desc: 'Her villa titizlikle denetlenmiş ve kalite sertifikasyonundan geçirilmiş özel konaklama seçeneklerimizden oluşur.',
  },
];

const steps = [
  { num: '01', title: 'Villa Seç', desc: 'İhtiyacınıza, bütçenize ve konumunuza göre filtreleme yapın, hayalinizdeki villayı bulun.' },
  { num: '02', title: 'Tarih & Kişi Belirle', desc: 'Giriş-çıkış tarihlerinizi ve misafir sayısını seçerek anlık müsaitlik durumunu görün.' },
  { num: '03', title: 'Güvenle Öde', desc: '3D Secure korumalı ödeme sistemiyle rezervasyonunuzu saniyeler içinde tamamlayın.' },
];

export default async function HomePage() {
  const [featuredVillas, regions, stats, reviews] = await Promise.all([
    getFeaturedVillas(),
    getRegions(),
    getSiteStats(),
    getAllReviews(),
  ]);

  return (
    <main className={styles.main}>
      {/* ── Hero Section ─────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Background Image */}
        <div className={styles.heroBg}>
          <Image
            src={siteConfig.heroImage}
            alt="Lüks villa manzarası"
            fill
            priority
            sizes="100vw"
            className={styles.heroBgImg}
          />
          <div className={styles.heroGradient} />
        </div>

        {/* Hero Content */}
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <span className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'var(--color-primary-fixed-dim)'}}>star</span>
              Türkiye'nin Premium Villa Deneyimi
            </div>
            <h1 className={`${styles.heroTitle} animate-fadeUp`}>
              Lüks Villa ve<br />
              <span className={styles.heroTitleAccent}>VIP Transfer</span><br />
              Hizmetleri
            </h1>
            <p className={`${styles.heroDesc} animate-fadeUp delay-200`}>
              Akdeniz'in en özel villalarında hayalinizdeki tatili yaşayın. TÜRSAB onaylı güvencemizle rezervasyon yapın.
            </p>
          </div>

          {/* Search Bar */}
          <div className={`${styles.searchWrap} animate-fadeUp delay-300`}>
            <SearchBar />
          </div>

          {/* Stats */}
          <div className={`${styles.heroStats} animate-fadeUp delay-400`}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.villaCount}+</span>
              <span className={styles.statLabel}>Lüks Villa</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.reviewCount.toLocaleString('tr-TR')}+</span>
              <span className={styles.statLabel}>Mutlu Misafir</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.regionCount}</span>
              <span className={styles.statLabel}>Popüler Bölge</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.avgRating}★</span>
              <span className={styles.statLabel}>Ortalama Puan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Villas ───────────────────────────────── */}
      <section className={`section-padding ${styles.featuredSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>
                <span className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'var(--color-primary)'}}>star</span>
                Öne Çıkan Villalar
              </p>
              <h2 className={styles.sectionTitle}>En Özel Konaklama Seçenekleri</h2>
            </div>
            <Link href="/villalar" className={styles.seeAll}>
              Tümünü Gör
              <span className="material-symbols-outlined" style={{fontSize:'20px'}}>arrow_forward</span>
            </Link>
          </div>

          <div className={styles.villaGrid}>
            {featuredVillas.map((villa, i) => (
              <VillaCard key={villa.id} villa={villa} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Regions ──────────────────────────────────────── */}
      <section className={`${styles.regionsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>
                <span className="material-symbols-outlined" style={{fontSize:'14px', color:'var(--color-primary)'}}>location_on</span>
                Bölgelerimiz
              </p>
              <h2 className={styles.sectionTitle}>Popüler Tatil Destinasyonları</h2>
            </div>
          </div>

          <div className={styles.regionsGrid}>
            {regions.map((region, i) => (
              <Link
                key={region.id}
                href={`/villalar?region=${region.id}`}
                className={styles.regionCard}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Image
                  src={region.image}
                  alt={region.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.regionImg}
                />
                <div className={styles.regionOverlay} />
                <div className={styles.regionInfo}>
                  <h3 className={styles.regionName}>{region.name}</h3>
                  <p className={styles.regionCount}>{region.villaCount} villa</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ─────────────────────────────────── */}
      <section className={`section-padding ${styles.trustSection}`}>
        <div className="container">
          <div className={styles.sectionHeaderCenter}>
            <p className={styles.sectionEyebrow}>
              <span className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'var(--color-primary)'}}>verified_user</span>
              Neden Biz?
            </p>
            <h2 className={styles.sectionTitle}>Güven, Kalite ve Huzur</h2>
            <p className={styles.sectionDesc}>
              Her rezervasyonunuzda yanınızda olan, deneyimli ekibimizle lüks tatil deneyimi sunuyoruz.
            </p>
          </div>

          <div className={styles.trustGrid}>
            {trustItems.map((item, i) => (
              <div key={item.title} className={styles.trustCard} style={{ animationDelay: `${i * 100}ms` }}>
                <div className={styles.trustIcon}>
                  <span className="material-symbols-outlined icon-filled">{item.icon}</span>
                </div>
                <h3 className={styles.trustTitle}>{item.title}</h3>
                <p className={styles.trustDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className={styles.howSection}>
        <div className="container">
          <div className={styles.sectionHeaderCenter}>
            <p className={styles.sectionEyebrowLight}>Rezervasyon Akışı</p>
            <h2 className={styles.sectionTitleLight}>3 Adımda Lüks Tatil</h2>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step, i) => (
              <div key={step.num} className={styles.step}>
                <div className={styles.stepNum}>{step.num}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className={styles.stepArrow}>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.howCta}>
            <Link href="/villalar" className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">search</span>
              Villa Bulmaya Başla
            </Link>
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────── */}
      <section className={`section-padding ${styles.reviewsSection}`}>
        <div className="container">
          <div className={styles.sectionHeaderCenter}>
            <p className={styles.sectionEyebrow}>
              <span className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'var(--color-primary)'}}>format_quote</span>
              Misafir Yorumları
            </p>
            <h2 className={styles.sectionTitle}>Misafirlerimiz Ne Diyor?</h2>
          </div>

          <div className={styles.reviewsGrid}>
            {reviews.map((review, i) => (
              <div key={review.id} className={styles.reviewCard} style={{ animationDelay: `${i * 100}ms` }}>
                <div className={styles.reviewHeader}>
                  <ReviewAvatar name={review.author} avatar={review.avatar} className={styles.reviewAvatar} />
                  <div>
                    <h4 className={styles.reviewAuthor}>{review.author}</h4>
                    <p className={styles.reviewDate}>{review.date}</p>
                  </div>
                  <div className={styles.reviewStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'#f59e0b'}}>star</span>
                    ))}
                  </div>
                </div>
                <p className={styles.reviewText}>&ldquo;{review.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBanner}>
            <div className={styles.ctaText}>
              <h2 className={styles.ctaTitle}>Hayalinizdeki Tatil Sizi Bekliyor</h2>
              <p className={styles.ctaDesc}>{stats.villaCount}+ lüks villa arasından size en uygun olanı seçin. Güvenli rezervasyon garantisiyle.</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link href="/villalar" className="btn btn-primary btn-lg">
                Villa Ara
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`btn btn-secondary btn-lg`}>
                <span className="material-symbols-outlined icon-filled" style={{color:'#25D366'}}>chat</span>
                WhatsApp Danışman
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
