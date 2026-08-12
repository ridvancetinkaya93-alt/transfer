'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PaymentLogos from '@/components/ui/PaymentLogos';
import { DEMO_GUEST, DEMO_VILLA_SLUG, demoVillaDefinition } from '@/lib/mock/demo-catalog';
import { formatPriceShort } from '@/lib/utils';
import styles from './page.module.css';

export default function DemoOdemeClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = demoVillaDefinition.pricePerNight + demoVillaDefinition.cleaningFee + demoVillaDefinition.serviceFee;

  const startCheckout = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/demo/checkout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Demo ödeme başlatılamadı.');
        return;
      }
      router.push(data.redirectUrl);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.hero}>
          <span className={styles.badge}>Banka / iyzico Test</span>
          <h1 className={styles.title}>Demo Ödeme Ekranı</h1>
          <p className={styles.desc}>
            Ödeme kuruluşu incelemesi için hazırlanmış test ürünü. Tek tıkla sepete ekleyip kredi kartı ödeme
            adımına gidebilirsiniz.
          </p>
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <div className={styles.productHeader}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-primary)' }}>villa</span>
              <div>
                <h2>{demoVillaDefinition.name}</h2>
                <p>{demoVillaDefinition.location}</p>
              </div>
            </div>

            <p className={styles.productDesc}>{demoVillaDefinition.shortDescription}</p>

            <ul className={styles.steps}>
              <li>Demo ürün sepete eklenir (100 ₺ / 1 gece)</li>
              <li>Ödeme sayfasında kredi kartı formu açılır</li>
              <li>iyzico 3D Secure altyapısı kullanılır</li>
            </ul>

            <div className={styles.priceRow}>
              <span>Test tutarı</span>
              <strong>{formatPriceShort(total)}</strong>
            </div>

            <div className={styles.iyzicoBanner}>
              <PaymentLogos variant="payment" />
            </div>

            {error && (
              <div className={styles.errorBox}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                {error}
              </div>
            )}

            <button
              type="button"
              className={`btn btn-primary btn-full btn-lg ${styles.cta}`}
              onClick={startCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Ödeme ekranına yönlendiriliyor...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined icon-filled">shopping_cart_checkout</span>
                  Sepete Ekle ve Ödemeye Git
                </>
              )}
            </button>

            <p className={styles.guestNote}>
              Test misafir: {DEMO_GUEST.firstName} {DEMO_GUEST.lastName} · {DEMO_GUEST.email}
            </p>
          </section>

          <aside className={styles.aside}>
            <h3>Alternatif test yolu</h3>
            <p>Manuel akış için demo villayı seçip rezervasyon adımlarını da tamamlayabilirsiniz:</p>
            <Link href={`/villa/${DEMO_VILLA_SLUG}`} className={styles.linkBtn}>
              Demo Villa Sayfasına Git
            </Link>
            <Link href={`/rezervasyon/${DEMO_VILLA_SLUG}`} className={styles.linkBtnSecondary}>
              Rezervasyon Formunu Aç
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
