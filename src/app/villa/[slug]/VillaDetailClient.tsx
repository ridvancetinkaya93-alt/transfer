'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Villa, Review } from '@/types/database';
import { formatPriceShort, getNightCount, calculateTotalPrice, getTodayString, addDays } from '@/lib/utils';
import { whatsappLink } from '@/lib/site-config';
import VillaCard from '@/components/ui/VillaCard';
import ReviewAvatar from '@/components/ui/ReviewAvatar';
import styles from './page.module.css';

interface Props {
  villa: Villa;
  reviews: Review[];
  similarVillas: Villa[];
}

export default function VillaDetailClient({ villa, reviews, similarVillas }: Props) {
  const router = useRouter();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [reserveError, setReserveError] = useState('');
  const [checking, setChecking] = useState(false);

  const today = getTodayString();
  const nights = checkIn && checkOut ? getNightCount(checkIn, checkOut) : 0;
  const pricing = nights > 0 ? calculateTotalPrice(villa.pricePerNight, nights, villa.cleaningFee, villa.serviceFee) : null;

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      setReserveError('Lütfen giriş ve çıkış tarihlerini seçin.');
      return;
    }
    if (nights < villa.minNights) {
      setReserveError(`Minimum ${villa.minNights} gece konaklama gereklidir.`);
      return;
    }

    setChecking(true);
    setReserveError('');
    try {
      const params = new URLSearchParams({ checkIn, checkOut });
      const res = await fetch(`/api/villas/${villa.slug}/availability?${params}`);
      const data = await res.json();
      if (!data.available) {
        setReserveError(data.reason || 'Seçilen tarihler müsait değil.');
        return;
      }
      router.push(`/rezervasyon/${villa.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    } catch {
      setReserveError('Müsaitlik kontrol edilemedi. Lütfen tekrar deneyin.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav className={styles.breadcrumbNav}>
            <Link href="/">Ana Sayfa</Link>
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>chevron_right</span>
            <Link href="/villalar">Villalar</Link>
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>chevron_right</span>
            <span>{villa.name}</span>
          </nav>
        </div>
      </div>

      <div className="container">
        {/* Gallery Grid */}
        <section className={styles.gallery}>
          {/* Main Photo */}
          <div className={styles.galleryMain} onClick={() => { setActiveImg(0); setGalleryOpen(true); }}>
            <Image
              src={villa.images[0]}
              alt={villa.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
              className={styles.galleryImg}
            />
            <div className={styles.galleryHover}>
              <span className="material-symbols-outlined" style={{fontSize:'32px', color:'white'}}>open_in_full</span>
            </div>
          </div>

          {/* Secondary Photos */}
          <div className={styles.gallerySecondary}>
            {villa.images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className={`${styles.galleryThumb} ${i === 3 ? styles.galleryThumbLast : ''}`}
                onClick={() => { setActiveImg(i + 1); setGalleryOpen(true); }}
              >
                <Image
                  src={img}
                  alt={`${villa.name} — ${i + 2}`}
                  fill
                  sizes="25vw"
                  className={styles.galleryImg}
                />
                {i === 3 && (
                  <div className={styles.galleryMoreOverlay}>
                    <span className="material-symbols-outlined" style={{fontSize:'24px'}}>photo_library</span>
                    <span>Tüm Fotoğrafları Gör</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Main Layout */}
        <div className={styles.layout}>
          {/* Left: Villa Info */}
          <div className={styles.content}>

            {/* Title & Location */}
            <section className={styles.titleSection}>
              <div className={styles.titleBadge}>
                <span className="material-symbols-outlined icon-filled" style={{fontSize:'13px'}}>star</span>
                Premium Koleksiyon
              </div>
              <h1 className={styles.villaTitle}>{villa.name}</h1>
              <div className={styles.titleMeta}>
                <span className={styles.location}>
                  <span className="material-symbols-outlined" style={{fontSize:'18px'}}>location_on</span>
                  {villa.location}
                </span>
                <a href="#harita" className={styles.mapLink}>Haritada Görüntüle</a>
              </div>
              <div className={styles.titleRating}>
                <div className={styles.ratingBadge}>
                  <span className="material-symbols-outlined icon-filled" style={{fontSize:'16px', color:'#f59e0b'}}>star</span>
                  <strong>{villa.rating}</strong>
                  <span className={styles.ratingCount}>({villa.reviewCount} yorum)</span>
                </div>
                {villa.tags.map(tag => (
                  <span key={tag} className={styles.villaTag}>{tag}</span>
                ))}
              </div>
            </section>

            <hr className="divider" />

            {/* Capacity Stats */}
            <section className={styles.stats}>
              <div className={styles.statItem}>
                <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'28px'}}>group</span>
                <span className={styles.statValue}>{villa.maxGuests} Misafir</span>
                <span className={styles.statLabel}>Maksimum</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'28px'}}>bed</span>
                <span className={styles.statValue}>{villa.bedrooms} Yatak Odası</span>
                <span className={styles.statLabel}>Geniş & Ferah</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'28px'}}>bathtub</span>
                <span className={styles.statValue}>{villa.bathrooms} Banyo</span>
                <span className={styles.statLabel}>Ebeveyn Banyolu</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'28px'}}>straighten</span>
                <span className={styles.statValue}>{villa.squareMeters} m²</span>
                <span className={styles.statLabel}>Toplam Alan</span>
              </div>
            </section>

            <hr className="divider" />

            {/* Description */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Villa Hakkında</h2>
              {villa.description.split('\n\n').map((para, i) => (
                <p key={i} className={styles.bodyText}>{para}</p>
              ))}
            </section>

            <hr className="divider" />

            {/* Amenities */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Sunulan İmkânlar</h2>
              <div className={styles.amenitiesGrid}>
                {villa.amenities.map(amenity => (
                  <div key={amenity.name} className={styles.amenityItem}>
                    <div className={styles.amenityIcon}>
                      <span className="material-symbols-outlined">{amenity.icon}</span>
                    </div>
                    <span className={styles.amenityName}>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="divider" />

            {/* House Rules */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Konaklama Kuralları</h2>
              <div className={styles.rulesCard}>
                <div className={styles.rulesTime}>
                  <div className={styles.ruleTime}>
                    <span className="material-symbols-outlined" style={{fontSize:'20px', color:'var(--color-primary)'}}>login</span>
                    <div>
                      <p className={styles.ruleTimeLabel}>Giriş</p>
                      <p className={styles.ruleTimeValue}>{villa.checkInTime}</p>
                    </div>
                  </div>
                  <div className={styles.ruleTime}>
                    <span className="material-symbols-outlined" style={{fontSize:'20px', color:'var(--color-primary)'}}>logout</span>
                    <div>
                      <p className={styles.ruleTimeLabel}>Çıkış</p>
                      <p className={styles.ruleTimeValue}>{villa.checkOutTime}</p>
                    </div>
                  </div>
                  <div className={styles.ruleTime}>
                    <span className="material-symbols-outlined" style={{fontSize:'20px', color:'var(--color-primary)'}}>nights_stay</span>
                    <div>
                      <p className={styles.ruleTimeLabel}>Min. Konaklama</p>
                      <p className={styles.ruleTimeValue}>{villa.minNights} Gece</p>
                    </div>
                  </div>
                </div>
                <ul className={styles.rulesList}>
                  {villa.rules.map((rule, i) => (
                    <li key={i} className={styles.ruleItem}>
                      <span className="material-symbols-outlined" style={{fontSize:'18px', color:'var(--color-primary)', flexShrink:0}}>info</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Map Placeholder */}
            <section className={styles.section} id="harita">
              <h2 className={styles.sectionTitle}>Konum</h2>
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapContent}>
                  <span className="material-symbols-outlined icon-filled" style={{fontSize:'40px', color:'var(--color-primary)'}}>location_on</span>
                  <p className={styles.mapAddress}>{villa.location}</p>
                  <p className={styles.mapCoords}>
                    {villa.coordinates.lat.toFixed(4)}° K, {villa.coordinates.lng.toFixed(4)}° D
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${villa.coordinates.lat},${villa.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'16px'}}>map</span>
                    Google Maps'te Aç
                  </a>
                </div>
              </div>
            </section>

            {/* Reviews */}
            {reviews.length > 0 && (
              <section className={styles.section}>
                <div className={styles.reviewsHeader}>
                  <h2 className={styles.sectionTitle}>Misafir Değerlendirmeleri</h2>
                  <div className={styles.overallRating}>
                    <span className="material-symbols-outlined icon-filled" style={{fontSize:'20px', color:'#f59e0b'}}>star</span>
                    <strong style={{fontSize:'var(--text-xl)'}}>{villa.rating}</strong>
                    <span style={{color:'var(--color-secondary)', fontSize:'var(--text-sm)'}}>({villa.reviewCount} yorum)</span>
                  </div>
                </div>
                <div className={styles.reviewsGrid}>
                  {reviews.map(review => (
                    <div key={review.id} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <ReviewAvatar name={review.author} avatar={review.avatar} className={styles.avatar} />
                        <div>
                          <h4 className={styles.reviewAuthor}>{review.author}</h4>
                          <p className={styles.reviewDate}>{review.date}</p>
                        </div>
                        <div className={styles.reviewStars}>
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i} className="material-symbols-outlined icon-filled" style={{fontSize:'13px', color:'#f59e0b'}}>star</span>
                          ))}
                        </div>
                      </div>
                      <p className={styles.reviewText}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Booking Widget */}
          <aside className={styles.sidebar}>
            <div className={styles.bookingWidget}>
              {/* Price Header */}
              <div className={styles.priceHeader}>
                <div>
                  <span className={styles.priceAmount}>{formatPriceShort(villa.pricePerNight)}</span>
                  <span className={styles.priceLabel}> / gece</span>
                </div>
                <div className={styles.widgetRating}>
                  <span className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'#f59e0b'}}>star</span>
                  <strong>{villa.rating}</strong>
                </div>
              </div>

              {/* Date Inputs */}
              <div className={styles.dateGrid}>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel}>GİRİŞ</label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={checkIn}
                    min={today}
                    onChange={e => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) {
                        setCheckOut(addDays(e.target.value, villa.minNights));
                      }
                    }}
                  />
                </div>
                <div className={styles.dateField} style={{borderLeft: '1px solid rgba(229,189,190,0.2)'}}>
                  <label className={styles.dateLabel}>ÇIKIŞ</label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={checkOut}
                    min={checkIn ? addDays(checkIn, villa.minNights) : addDays(today, villa.minNights)}
                    onChange={e => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              {/* Guest Select */}
              <div className={styles.guestField}>
                <label className={styles.dateLabel}>MİSAFİR SAYISI</label>
                <div className={styles.guestStepper}>
                  <button
                    className={styles.stepperBtn}
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'20px'}}>remove</span>
                  </button>
                  <span className={styles.guestCount}>
                    <strong>{guests}</strong> Misafir
                  </span>
                  <button
                    className={styles.stepperBtn}
                    onClick={() => setGuests(Math.min(villa.maxGuests, guests + 1))}
                    disabled={guests >= villa.maxGuests}
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'20px'}}>add</span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              {pricing && (
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceRow}>
                    <span>{formatPriceShort(villa.pricePerNight)} × {nights} gece</span>
                    <span>{formatPriceShort(pricing.subtotal)}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Temizlik ücreti</span>
                    <span>{formatPriceShort(pricing.cleaning)}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Hizmet bedeli</span>
                    <span>{formatPriceShort(pricing.service)}</span>
                  </div>
                  <div className={styles.priceTotal}>
                    <span>Toplam</span>
                    <span>{formatPriceShort(pricing.total)}</span>
                  </div>
                </div>
              )}

              {reserveError && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', marginBottom: 'var(--space-2)' }}>
                  {reserveError}
                </p>
              )}

              {/* Reserve Button */}
              <button
                className={`btn btn-primary btn-full btn-lg ${styles.reserveBtn}`}
                onClick={handleReserve}
                disabled={checking}
              >
                <span className="material-symbols-outlined">{checking ? 'hourglass_empty' : 'calendar_add_on'}</span>
                {checking ? 'Kontrol ediliyor...' : 'Hemen Rezervasyon Yap'}
              </button>

              {/* WhatsApp Button */}
              <a
                href={whatsappLink(`Merhaba, ${villa.name} hakkında bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-secondary btn-full`}
              >
                <span className="material-symbols-outlined icon-filled" style={{color:'#25D366', fontSize:'20px'}}>chat</span>
                WhatsApp ile Sor
              </a>

              <p className={styles.noCharge}>Rezervasyon anında herhangi bir ücret alınmaz.</p>

              {/* Trust Badges */}
              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>
                  <span className="material-symbols-outlined icon-filled" style={{fontSize:'16px', color:'var(--color-success)'}}>verified_user</span>
                  <span>Güvenli Ödeme</span>
                </div>
                <div className={styles.trustBadge}>
                  <span className="material-symbols-outlined icon-filled" style={{fontSize:'16px', color:'var(--color-primary)'}}>verified</span>
                  <span>TÜRSAB Onaylı</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Villas */}
        {similarVillas.length > 0 && (
          <section className={styles.similarSection}>
            <div className={styles.similarHeader}>
              <h2 className={styles.sectionTitle}>Benzer Villalar</h2>
              <Link href={`/villalar?region=${villa.region}`} className={styles.seeAll}>
                Tümünü Gör
                <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_forward</span>
              </Link>
            </div>
            <div className={styles.similarGrid}>
              {similarVillas.map((v, i) => (
                <VillaCard key={v.id} villa={v} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Gallery */}
      {galleryOpen && (
        <div className={styles.lightbox}>
          <div className={styles.lightboxBackdrop} onClick={() => setGalleryOpen(false)} />
          <div className={styles.lightboxContent}>
            <button className={styles.lightboxClose} onClick={() => setGalleryOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <button
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={() => setActiveImg((activeImg - 1 + villa.images.length) % villa.images.length)}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className={styles.lightboxImg}>
              <Image
                src={villa.images[activeImg]}
                alt={`${villa.name} — ${activeImg + 1}`}
                fill
                sizes="90vw"
                className={styles.galleryImg}
              />
            </div>
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={() => setActiveImg((activeImg + 1) % villa.images.length)}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <div className={styles.lightboxCounter}>
              {activeImg + 1} / {villa.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Booking Bar */}
      <div className={styles.mobileBookingBar}>
        <div>
          <span className={styles.mobilePrice}>{formatPriceShort(villa.pricePerNight)}</span>
          <span style={{fontSize:'var(--text-xs)', color:'var(--color-secondary)'}}> / gece</span>
        </div>
        <button className="btn btn-primary" onClick={handleReserve}>
          Rezervasyon Yap
        </button>
      </div>
    </main>
  );
}
