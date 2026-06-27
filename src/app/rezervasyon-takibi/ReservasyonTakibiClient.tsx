'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatPriceShort, formatDate } from '@/lib/utils';
import type { Reservation } from '@/types/database';
import { telLink, whatsappLink } from '@/lib/site-config';
import styles from './page.module.css';

const statusConfig: Record<Reservation['status'], { label: string; color: string; bg: string; icon: string }> = {
  confirmed: { label: 'Onaylandı', color: 'var(--color-success)', bg: 'rgba(0,106,69,0.08)', icon: 'verified' },
  pending: { label: 'Ödeme Bekleniyor', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', icon: 'pending' },
  cancelled: { label: 'İptal Edildi', color: 'var(--color-primary)', bg: 'rgba(186,0,54,0.08)', icon: 'cancel' },
  completed: { label: 'Tamamlandı', color: 'var(--color-secondary)', bg: 'var(--color-surface-low)', icon: 'done_all' },
};

const paymentConfig: Record<Reservation['paymentStatus'], { label: string; color: string }> = {
  paid: { label: 'Ödendi', color: 'var(--color-success)' },
  pending: { label: 'Bekliyor', color: 'var(--color-warning)' },
  failed: { label: 'Başarısız', color: 'var(--color-error)' },
  refunded: { label: 'İade Edildi', color: 'var(--color-secondary)' },
};

export default function ReservasyonTakibiClient() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [searched, setSearched] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode && !searched) {
      setCode(urlCode);
    }
  }, [searchParams, searched]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setReservation(null);

    try {
      const params = new URLSearchParams({
        code: code.toUpperCase().trim(),
        email: email.toLowerCase().trim(),
      });
      const res = await fetch(`/api/reservations/lookup?${params}`);
      const data = await res.json();

      setLoading(false);
      setSearched(true);

      if (res.ok && data.reservation) {
        setReservation(data.reservation);
      } else {
        setNotFound(true);
      }
    } catch {
      setLoading(false);
      setSearched(true);
      setNotFound(true);
    }
  };

  const status = reservation ? statusConfig[reservation.status] : null;
  const payment = reservation ? paymentConfig[reservation.paymentStatus] : null;

  return (
    <main className={styles.main}>
      {/* ── Header ────────────────────────────────────────── */}
      <section className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px', color: 'white' }}>search</span>
            </div>
            <h1 className={styles.headerTitle}>Rezervasyon Takibi</h1>
            <p className={styles.headerDesc}>
              Rezervasyon kodunuzu girerek rezervasyonunuzun güncel durumunu, detaylarını ve ödeme bilgilerini sorgulayabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* ── Arama Formu ───────────────────────────────────── */}
      <section className={styles.searchSection}>
        <div className="container">
          <div className={styles.searchCard}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.searchFields}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Rezervasyon Kodu</label>
                  <div className={styles.inputWrap}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>confirmation_number</span>
                    <input
                      className="input"
                      placeholder="Örn: RCT-AB12CD34"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      required
                    />
                  </div>
                  <p className={styles.fieldHint}>Rezervasyon onay e-postanızda bulabilirsiniz.</p>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>E-posta Adresi</label>
                  <div className={styles.inputWrap}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>mail</span>
                    <input
                      type="email"
                      className="input"
                      placeholder="rezervasyonda kullandığınız e-posta"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className={styles.fieldHint}>Gizlilik için e-posta doğrulaması yapılır.</p>
                </div>
              </div>
              <button
                type="submit"
                className={`btn btn-primary btn-lg ${styles.searchBtn}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Sorgulanıyor...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">search</span>
                    Rezervasyonu Sorgula
                  </>
                )}
              </button>
            </form>

            {/* Demo hint removed in production */}
          </div>
        </div>
      </section>

      {/* ── Sonuç: Bulunamadı ─────────────────────────────── */}
      {notFound && (
        <section className={styles.resultSection}>
          <div className="container">
            <div className={styles.notFoundCard}>
              <span className="material-symbols-outlined" style={{ fontSize: '56px', color: 'var(--color-outline-variant)' }}>search_off</span>
              <h2 className={styles.notFoundTitle}>Rezervasyon Bulunamadı</h2>
              <p className={styles.notFoundDesc}>
                <strong>{code.toUpperCase()}</strong> kodlu bir rezervasyon bulunamadı. Kodu ve e-posta adresinizi kontrol edip tekrar deneyin.
              </p>
              <div className={styles.notFoundActions}>
                <button className="btn btn-secondary" onClick={() => { setCode(''); setEmail(''); setNotFound(false); setSearched(false); }}>
                  Tekrar Dene
                </button>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <span className="material-symbols-outlined icon-filled">chat</span>
                  Destek Al
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Sonuç: Rezervasyon Detayı ─────────────────────── */}
      {reservation && status && payment && (
        <section className={styles.resultSection}>
          <div className="container">
            {/* Status Banner */}
            <div className={styles.statusBanner} style={{ background: status.bg, border: `1px solid ${status.color}30` }}>
              <div className={styles.statusBannerLeft}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '24px', color: status.color }}>{status.icon}</span>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)', fontWeight: 600 }}>Rezervasyon Durumu</p>
                  <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: status.color, fontSize: 'var(--text-lg)' }}>{status.label}</p>
                </div>
              </div>
              <code className={styles.codeDisplay}>{reservation.code}</code>
            </div>

            <div className={styles.detailLayout}>
              {/* Sol Kolon */}
              <div className={styles.detailMain}>
                {/* Villa Kartı */}
                <div className={styles.villaCard}>
                  <img src={reservation.villaImage} alt={reservation.villaName} className={styles.villaImg} />
                  <div className={styles.villaBody}>
                    <p className={styles.villaLocation}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                      {reservation.villaLocation}
                    </p>
                    <h2 className={styles.villaName}>{reservation.villaName}</h2>
                    <div className={styles.villaDates}>
                      <div className={styles.villaDate}>
                        <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>login</span>
                        <div>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>Giriş</p>
                          <p style={{ fontWeight: 700, color: 'var(--color-on-surface)' }}>{formatDate(reservation.checkIn)}</p>
                        </div>
                      </div>
                      <div className={styles.nightsBadge}>{reservation.nights} Gece</div>
                      <div className={styles.villaDate}>
                        <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>logout</span>
                        <div>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>Çıkış</p>
                          <p style={{ fontWeight: 700, color: 'var(--color-on-surface)' }}>{formatDate(reservation.checkOut)}</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.villaGuests}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>group</span>
                      {reservation.guests} Misafir
                    </div>
                    <Link href={`/villa/${reservation.villaSlug}`} className="btn btn-secondary btn-sm" style={{ width: 'fit-content', marginTop: 'var(--space-2)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                      Villa Detayı
                    </Link>
                  </div>
                </div>

                {/* Zaman Çizelgesi */}
                <div className={styles.timelineCard}>
                  <h3 className={styles.cardTitle}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>timeline</span>
                    Rezervasyon Akışı
                  </h3>
                  <div className={styles.timeline}>
                    {reservation.timeline.map((item, i) => (
                      <div key={i} className={`${styles.timelineItem} ${item.done ? styles.timelineDone : styles.timelinePending}`}>
                        <div className={styles.timelineConnector}>
                          <div className={styles.timelineDot}>
                            <span className="material-symbols-outlined icon-filled" style={{ fontSize: '14px' }}>{item.icon}</span>
                          </div>
                          {i < reservation.timeline.length - 1 && <div className={styles.timelineLine} />}
                        </div>
                        <div className={styles.timelineContent}>
                          <p className={styles.timelineStatus}>{item.status}</p>
                          <p className={styles.timelineDate}>{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sağ Kolon */}
              <div className={styles.detailSide}>
                {/* Fiyat Özeti */}
                <div className={styles.priceCard}>
                  <h3 className={styles.cardTitle}>
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>payments</span>
                    Ödeme Özeti
                  </h3>
                  <div className={styles.priceRows}>
                    <div className={styles.priceRow}>
                      <span>{formatPriceShort(reservation.pricePerNight)} × {reservation.nights} gece</span>
                      <span>{formatPriceShort(reservation.pricePerNight * reservation.nights)}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span>Temizlik ücreti</span>
                      <span>{formatPriceShort(reservation.cleaningFee)}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span>Hizmet bedeli</span>
                      <span>{formatPriceShort(reservation.serviceFee)}</span>
                    </div>
                    {reservation.extras.length > 0 && reservation.extras.map(e => (
                      <div key={e} className={styles.priceRow}>
                        <span>{e}</span>
                        <span style={{ color: 'var(--color-secondary)' }}>Dahil</span>
                      </div>
                    ))}
                    <div className={styles.priceDivider} />
                    <div className={styles.priceTotal}>
                      <span>Toplam</span>
                      <span>{formatPriceShort(reservation.totalPrice)}</span>
                    </div>
                  </div>
                  <div className={styles.paymentStatus}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-secondary)' }}>Ödeme Durumu:</span>
                    <span style={{ fontWeight: 700, color: payment.color }}>
                      {payment.label}
                    </span>
                  </div>
                  <div className={styles.paymentMeta}>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>Yöntem</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{reservation.paymentMethod || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>Tarih</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{reservation.paymentDate ? formatDate(reservation.paymentDate) : '—'}</p>
                    </div>
                  </div>
                  {reservation.paymentStatus === 'pending' && (
                    <Link
                      href={`/odeme/${reservation.id}?email=${encodeURIComponent(reservation.guestEmail)}`}
                      className="btn btn-primary btn-full"
                      style={{ marginTop: 'var(--space-4)' }}
                    >
                      <span className="material-symbols-outlined">credit_card</span>
                      Ödemeyi Tamamla — {formatPriceShort(reservation.totalPrice)}
                    </Link>
                  )}
                </div>

                {/* Misafir Bilgileri */}
                <div className={styles.guestCard}>
                  <h3 className={styles.cardTitle}>
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>person</span>
                    Misafir Bilgileri
                  </h3>
                  <div className={styles.guestInfo}>
                    <div className={styles.guestRow}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>badge</span>
                      <div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>Ad Soyad</p>
                        <p style={{ fontWeight: 700, color: 'var(--color-on-surface)' }}>{reservation.guestName}</p>
                      </div>
                    </div>
                    <div className={styles.guestRow}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>mail</span>
                      <div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>E-posta</p>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-on-surface)' }}>{reservation.guestEmail}</p>
                      </div>
                    </div>
                    <div className={styles.guestRow}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>phone</span>
                      <div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>Telefon</p>
                        <p style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{reservation.guestPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destek */}
                <div className={styles.supportCard}>
                  <p className={styles.supportTitle}>Yardıma mı ihtiyacınız var?</p>
                  <div className={styles.supportLinks}>
                    <a href={telLink()} className={styles.supportLink}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>call</span>
                      Bizi Arayın
                    </a>
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={styles.supportLink}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px', color: '#25D366' }}>chat</span>
                      WhatsApp
                    </a>
                  </div>
                  <p className={styles.cancelNote}>
                    İptal talebi için giriş tarihinden 30 gün önce iletişime geçiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Yardım Bölümü (arama yapılmadıysa) ──────────── */}
      {!searched && !loading && (
        <section className={`section-padding ${styles.helpSection}`}>
          <div className="container">
            <div className={styles.helpGrid}>
              <div className={styles.helpCard}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>mail</span>
                <h3>Kod Nerede?</h3>
                <p>Rezervasyonunuz onaylandığında e-postanıza <strong>RCT-XXXXXXXX</strong> formatında bir rezervasyon kodu gönderilir.</p>
              </div>
              <div className={styles.helpCard}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>support_agent</span>
                <h3>Hâlâ Bulamıyor musunuz?</h3>
                <p>Destek ekibimize WhatsApp veya telefon ile ulaşın, kodu hemen yardımcı olalım.</p>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`btn btn-primary btn-sm ${styles.helpBtn}`}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>chat</span>
                  WhatsApp Destek
                </a>
              </div>
              <div className={styles.helpCard}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>verified_user</span>
                <h3>Gizlilik</h3>
                <p>Rezervasyon bilgileriniz yalnızca kod ve e-posta eşleşmesi ile görüntülenebilir. Verileriniz güvendedir.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
