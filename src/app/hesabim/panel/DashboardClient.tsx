'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPriceShort } from '@/lib/utils';
import type { Reservation } from '@/types/database';
import styles from './panel.module.css';

interface Stats {
  totalReservations: number;
  activeReservations: number;
  paidReservations: number;
  totalTransfers: number;
  activeTransfers: number;
  savedCards: number;
}

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Onaylı', color: 'var(--color-success)', bg: 'rgba(0,106,69,0.1)' },
  pending: { label: 'Beklemede', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
  cancelled: { label: 'İptal', color: 'var(--color-primary)', bg: 'rgba(186,0,54,0.08)' },
  completed: { label: 'Tamamlandı', color: 'var(--color-secondary)', bg: 'var(--color-surface-low)' },
};

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Reservation[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/customer/me').then(r => r.json()),
      fetch('/api/customer/reservations').then(r => r.json()),
    ]).then(([me, resData]) => {
      if (me.stats) setStats(me.stats);
      setRecent((resData.reservations || []).slice(0, 3));
    });
  }, []);

  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(186,0,54,0.1)', color: 'var(--color-primary)' }}>
            <span className="material-symbols-outlined icon-filled">confirmation_number</span>
          </div>
          <div>
            <p className={styles.statValue}>{stats?.totalReservations ?? '—'}</p>
            <p className={styles.statLabel}>Toplam Rezervasyon</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(0,106,69,0.1)', color: 'var(--color-success)' }}>
            <span className="material-symbols-outlined icon-filled">verified</span>
          </div>
          <div>
            <p className={styles.statValue}>{stats?.activeReservations ?? '—'}</p>
            <p className={styles.statLabel}>Aktif Rezervasyon</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' }}>
            <span className="material-symbols-outlined icon-filled">airport_shuttle</span>
          </div>
          <div>
            <p className={styles.statValue}>{stats?.totalTransfers ?? '—'}</p>
            <p className={styles.statLabel}>Transfer Talebi</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(91,62,65,0.1)', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined icon-filled">credit_card</span>
          </div>
          <div>
            <p className={styles.statValue}>{stats?.savedCards ?? '—'}</p>
            <p className={styles.statLabel}>Kayıtlı Kart</p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Son Rezervasyonlar</h2>
          <Link href="/hesabim/panel/rezervasyonlar" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>
            Tümünü Gör
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>event_busy</span>
            </div>
            <p>Henüz rezervasyonunuz yok.</p>
            <Link href="/villalar" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-4)' }}>
              Villa Keşfet
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {recent.map(r => {
              const st = statusStyle[r.status] || statusStyle.pending;
              return (
                <Link key={r.id} href={`/hesabim/panel/rezervasyonlar/${r.id}`} className={styles.listItem}>
                  {r.villaImage && <img src={r.villaImage} alt="" className={styles.thumb} />}
                  <div className={styles.itemMain}>
                    <p className={styles.itemTitle}>{r.villaName}</p>
                    <p className={styles.itemMeta}>{r.code} · {r.checkIn} → {r.checkOut}</p>
                  </div>
                  <span className={styles.statusPill} style={{ color: st.color, background: st.bg }}>{st.label}</span>
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>
                    {formatPriceShort(r.totalPrice)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
