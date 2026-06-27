'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { whatsappLink } from '@/lib/site-config';
import styles from './page.module.css';

const reasons: Record<string, string> = {
  payment_failed: 'Ödeme işlemi bankanız tarafından reddedildi veya iptal edildi.',
  missing_token: 'Ödeme oturumu bulunamadı.',
  server_error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.',
};

export default function OdemeHataClient() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'payment_failed';
  const message = reasons[reason] || reasons.payment_failed;

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--color-error)' }}>error</span>
        <h1>Ödeme Tamamlanamadı</h1>
        <p>{message}</p>
        <div className={styles.actions}>
          <Link href="/rezervasyon-takibi" className="btn btn-primary">
            Rezervasyon Takibi
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Destek Al
          </a>
        </div>
      </div>
    </main>
  );
}
