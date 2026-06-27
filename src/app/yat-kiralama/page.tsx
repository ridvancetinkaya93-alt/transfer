import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Yat Kiralama',
  description: 'Bodrum, Fethiye ve Türkiye\'nin en güzel kıyılarında lüks yat kiralama hizmeti.',
};

export default function YatKiralamaPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>directions_boat</span>
            Denizde Lüks
          </p>
          <h1 className={styles.title}>Yat Kiralama</h1>
          <p className={styles.desc}>
            Akdeniz ve Ege&apos;de özel yat, gulet ve motor yat kiralama hizmetimizle denizde de aynı lüks deneyimi yaşayın.
          </p>
          <div className={styles.actions}>
            <Link href="/iletisim" className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">mail</span>
              Talep Oluştur
            </Link>
            <Link href="/vip-transfer" className="btn btn-secondary btn-lg">
              VIP Transfer
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.card}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-primary)', fontSize: '32px' }}>sailing</span>
              <h2>Gulet & Motor Yat</h2>
              <p>Günlük ve haftalık kiralama seçenekleri, profesyonel kaptan ve mürettebat.</p>
            </div>
            <div className={styles.card}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-primary)', fontSize: '32px' }}>anchor</span>
              <h2>Marina Transfer</h2>
              <p>Villa konaklamanızla entegre marina ve yat iskelesi transfer hizmeti.</p>
            </div>
            <div className={styles.card}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-primary)', fontSize: '32px' }}>restaurant</span>
              <h2>Özel Menü</h2>
              <p>Deniz ürünleri ve Akdeniz mutfağı ile özel yemek organizasyonu.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
