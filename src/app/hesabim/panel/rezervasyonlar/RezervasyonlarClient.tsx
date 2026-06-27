'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPriceShort } from '@/lib/utils';
import type { Reservation } from '@/types/database';
import styles from '../panel.module.css';

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Onaylı', color: 'var(--color-success)', bg: 'rgba(0,106,69,0.1)' },
  pending: { label: 'Beklemede', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
  cancelled: { label: 'İptal', color: 'var(--color-primary)', bg: 'rgba(186,0,54,0.08)' },
  completed: { label: 'Tamamlandı', color: 'var(--color-secondary)', bg: 'var(--color-surface-low)' },
};

export default function RezervasyonlarClient() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customer/reservations')
      .then(res => res.json())
      .then(data => setReservations(data.reservations || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ color: 'var(--color-secondary)' }}>Yükleniyor...</p>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Tüm Rezervasyonlar</h2>
        <span className={styles.badge}>{reservations.length} kayıt</span>
      </div>
      {reservations.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>confirmation_number</span>
          </div>
          <p>Rezervasyon bulunamadı.</p>
          <Link href="/villalar" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-4)' }}>Villa Ara</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {reservations.map(r => {
            const st = statusStyle[r.status] || statusStyle.pending;
            return (
              <Link key={r.id} href={`/hesabim/panel/rezervasyonlar/${r.id}`} className={styles.listItem}>
                {r.villaImage && <img src={r.villaImage} alt="" className={styles.thumb} />}
                <div className={styles.itemMain}>
                  <p className={styles.itemTitle}>{r.villaName}</p>
                  <p className={styles.itemMeta}>
                    {r.code} · {r.guests} kişi · {r.nights} gece
                  </p>
                  <p className={styles.itemMeta}>{r.checkIn} → {r.checkOut}</p>
                </div>
                <span className={styles.statusPill} style={{ color: st.color, background: st.bg }}>{st.label}</span>
                <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formatPriceShort(r.totalPrice)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
