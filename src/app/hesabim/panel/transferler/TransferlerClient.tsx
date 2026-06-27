'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TransferRequest } from '@/types/database';
import styles from '../panel.module.css';

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Yeni', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
  contacted: { label: 'İletişimde', color: 'var(--color-secondary)', bg: 'var(--color-surface-low)' },
  confirmed: { label: 'Onaylı', color: 'var(--color-success)', bg: 'rgba(0,106,69,0.1)' },
  cancelled: { label: 'İptal', color: 'var(--color-primary)', bg: 'rgba(186,0,54,0.08)' },
};

const typeLabels: Record<string, string> = {
  'airport-pickup': 'Havalimanı Karşılama',
  'airport-dropoff': 'Havalimanı Uğurlama',
  city: 'Şehir İçi',
  daily: 'Günlük Transfer',
};

export default function TransferlerClient() {
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customer/transfers')
      .then(res => res.json())
      .then(data => setTransfers(data.transfers || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: 'var(--color-secondary)' }}>Yükleniyor...</p>;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Transfer Talepleri</h2>
        <span className={styles.badge}>{transfers.length} kayıt</span>
      </div>
      {transfers.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>airport_shuttle</span>
          </div>
          <p>Henüz transfer talebiniz yok.</p>
          <Link href="/vip-transfer" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-4)' }}>
            Transfer Talep Et
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {transfers.map(t => {
            const st = statusStyle[t.status] || statusStyle.new;
            return (
              <div key={t.id} className={styles.listItem} style={{ cursor: 'default' }}>
                <div className={styles.statIcon} style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' }}>
                  <span className="material-symbols-outlined icon-filled">airport_shuttle</span>
                </div>
                <div className={styles.itemMain}>
                  <p className={styles.itemTitle}>{typeLabels[t.type] || t.type}</p>
                  <p className={styles.itemMeta}>{t.code} · {t.date} {t.time}</p>
                  <p className={styles.itemMeta}>{t.fromLocation} → {t.toLocation}</p>
                  <p className={styles.itemMeta}>{t.passengers} yolcu · {t.guestPhone}</p>
                </div>
                <span className={styles.statusPill} style={{ color: st.color, background: st.bg }}>{st.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
