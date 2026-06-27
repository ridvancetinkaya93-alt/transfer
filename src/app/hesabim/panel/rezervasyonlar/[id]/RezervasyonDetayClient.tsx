'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPriceShort } from '@/lib/utils';
import type { Reservation } from '@/types/database';
import styles from '../../panel.module.css';

export default function RezervasyonDetayClient() {
  const params = useParams();
  const id = params.id as string;
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customer/reservations/${id}`)
      .then(res => res.json())
      .then(data => setReservation(data.reservation || null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ color: 'var(--color-secondary)' }}>Yükleniyor...</p>;
  if (!reservation) return <p>Rezervasyon bulunamadı.</p>;

  return (
    <div>
      <Link href="/hesabim/panel/rezervasyonlar" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, marginBottom: 'var(--space-4)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        Rezervasyonlara Dön
      </Link>

      {reservation.villaImage && (
        <img src={reservation.villaImage} alt={reservation.villaName} className={styles.detailHero} />
      )}

      <div className={styles.detailGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{reservation.villaName}</h2>
            <code style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{reservation.code}</code>
          </div>
          <div className={styles.formCard}>
            <div className={styles.infoRows}>
              <div className={styles.infoRow}><span className={styles.infoLabel}>Konum</span><span className={styles.infoValue}>{reservation.villaLocation}</span></div>
              <div className={styles.infoRow}><span className={styles.infoLabel}>Giriş</span><span className={styles.infoValue}>{reservation.checkIn}</span></div>
              <div className={styles.infoRow}><span className={styles.infoLabel}>Çıkış</span><span className={styles.infoValue}>{reservation.checkOut}</span></div>
              <div className={styles.infoRow}><span className={styles.infoLabel}>Misafir</span><span className={styles.infoValue}>{reservation.guests} kişi · {reservation.nights} gece</span></div>
              <div className={styles.infoRow}><span className={styles.infoLabel}>Ödeme</span><span className={styles.infoValue}>{reservation.paymentStatus === 'paid' ? 'Ödendi' : 'Bekliyor'}</span></div>
              <div className={styles.infoRow}><span className={styles.infoLabel}>Toplam</span><span className={styles.infoValue} style={{ color: 'var(--color-primary)', fontSize: 'var(--text-lg)' }}>{formatPriceShort(reservation.totalPrice)}</span></div>
            </div>
            {reservation.paymentStatus === 'pending' && (
              <Link
                href={`/odeme/${reservation.id}?email=${encodeURIComponent(reservation.guestEmail)}`}
                className="btn btn-primary btn-full"
                style={{ marginTop: 'var(--space-6)' }}
              >
                Ödemeyi Tamamla
              </Link>
            )}
            <Link href={`/villa/${reservation.villaSlug}`} className="btn btn-secondary btn-full" style={{ marginTop: 'var(--space-3)' }}>
              Villa Sayfası
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Rezervasyon Akışı</h2>
          </div>
          <div className={styles.timeline}>
            {reservation.timeline.map((item, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${item.done ? styles.timelineDone : styles.timelinePending}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{item.icon}</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.status}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
