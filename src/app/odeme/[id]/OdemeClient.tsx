'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Reservation, SavedCard } from '@/types/database';
import { formatPriceShort } from '@/lib/utils';
import PaymentLogos from '@/components/ui/PaymentLogos';
import styles from './page.module.css';

interface Props {
  reservation: Reservation;
}

export default function OdemeClient({ reservation }: Props) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [saveCard, setSaveCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/customer/me')
      .then(res => res.ok ? res.json() : null)
      .then(async data => {
        if (!data?.authenticated) return;
        setAuthenticated(true);
        const cardsRes = await fetch('/api/customer/cards');
        if (cardsRes.ok) {
          const cardsData = await cardsRes.json();
          const cards = cardsData.cards || [];
          setSavedCards(cards);
          const defaultCard = cards.find((c: SavedCard) => c.isDefault);
          if (defaultCard) setSelectedCardId(defaultCard.id);
        }
      })
      .catch(() => {});
  }, []);

  const handlePay = async () => {
    setError('');
    setPaying(true);

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: reservation.id,
          saveCard: authenticated && saveCard && !selectedCardId,
          savedCardId: selectedCardId || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ödeme başlatılamadı.');
        return;
      }

      if (data.devMode) {
        router.push(
          `/rezervasyon-onay?code=${data.reservation.code}&total=${data.reservation.totalPrice}&email=${encodeURIComponent(data.reservation.guestEmail)}`
        );
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setError('Ödeme sayfası yüklenemedi.');
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerBadge}>
            <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px', color: 'var(--color-success)' }}>lock</span>
            Güvenli Ödeme — iyzico 3D Secure
          </div>
          <h1 className={styles.pageTitle}>Ödemenizi Tamamlayın</h1>
          <p style={{ color: 'var(--color-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            Rezervasyon kodu: <strong style={{ color: 'var(--color-primary)' }}>{reservation.code}</strong>
            · {reservation.villaName}
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.formArea}>
            <div className={styles.formCard}>
              <div className={styles.iyzicoBanner}>
                <PaymentLogos variant="payment" />
              </div>

              {authenticated && savedCards.length > 0 && (
                <div className={styles.savedCards}>
                  <p className={styles.savedCardsTitle}>Kayıtlı Kartlarınız</p>
                  {savedCards.map(card => (
                    <label
                      key={card.id}
                      className={`${styles.savedCardOption} ${selectedCardId === card.id ? styles.savedCardSelected : ''}`}
                    >
                      <input
                        type="radio"
                        name="savedCard"
                        checked={selectedCardId === card.id}
                        onChange={() => {
                          setSelectedCardId(card.id);
                          setSaveCard(false);
                        }}
                      />
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>credit_card</span>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                        {card.cardAlias || 'Kartım'} · •••• {card.lastFour}
                      </span>
                      {card.isDefault && <span className={styles.defaultBadge}>Varsayılan</span>}
                    </label>
                  ))}
                  <label className={`${styles.savedCardOption} ${!selectedCardId ? styles.savedCardSelected : ''}`}>
                    <input
                      type="radio"
                      name="savedCard"
                      checked={!selectedCardId}
                      onChange={() => setSelectedCardId(null)}
                    />
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>add_card</span>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Yeni kart ile öde</span>
                  </label>
                </div>
              )}

              {authenticated && !selectedCardId && (
                <label className={styles.saveCardRow}>
                  <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} />
                  <span>Bu kartı gelecek ödemeler için kaydet</span>
                </label>
              )}

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                Ödeme işleminiz iyzico güvenli ödeme altyapısı üzerinden gerçekleştirilir.
                Kart bilgileriniz sistemimizde saklanmaz{authenticated && saveCard ? '; yalnızca token kaydedilir' : ''}.
              </p>

              {error && (
                <div className={styles.errorBox}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  {error}
                </div>
              )}

              <button
                className={`btn btn-primary btn-full btn-lg ${styles.payBtn}`}
                onClick={handlePay}
                disabled={paying}
              >
                {paying ? (
                  <>
                    <span className={styles.spinner} />
                    Yönlendiriliyor...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined icon-filled">lock</span>
                    {formatPriceShort(reservation.totalPrice)} — Güvenle Öde
                  </>
                )}
              </button>

              <div className={styles.securityRow}>
                <div className={styles.secBadge}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-success)' }}>verified_user</span>
                  3D Secure
                </div>
                <div className={styles.secBadge}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                  SSL 256-bit
                </div>
              </div>

              {authenticated ? (
                <Link href="/hesabim/panel/rezervasyonlar" className={styles.trackLink}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>dashboard</span>
                  Panele dön — daha sonra öde
                </Link>
              ) : (
                <Link href="/rezervasyon-takibi" className={styles.trackLink}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>confirmation_number</span>
                  Rezervasyonu daha sonra öde
                </Link>
              )}
            </div>
          </div>

          <aside className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Ödeme Özeti</h3>
              <div className={styles.summaryItem}>
                <span>Giriş — Çıkış</span>
                <span>{reservation.checkIn} → {reservation.checkOut}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Misafir</span>
                <span>{reservation.guests} kişi</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryTotal}>
                <span>Toplam Tutar</span>
                <span className={styles.totalAmount}>{formatPriceShort(reservation.totalPrice)}</span>
              </div>
              <p className={styles.summaryNote}>
                Ödeme başarılı olduktan sonra onay e-postası gönderilecektir.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
