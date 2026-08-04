'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Reservation, SavedCard } from '@/types/database';
import { formatPriceShort } from '@/lib/utils';
import PaymentLogos from '@/components/ui/PaymentLogos';
import {
  type CardFormValues,
  formatCardNumber,
  detectCardBrand,
  maskCardNumber,
  validateCardForm,
  injectCheckoutHtml,
} from '@/lib/payments/card-form';
import styles from './page.module.css';

interface Props {
  reservation: Reservation;
}

const emptyCard: CardFormValues = {
  cardHolder: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
};

export default function OdemeClient({ reservation }: Props) {
  const router = useRouter();
  const checkoutRef = useRef<HTMLDivElement>(null);

  const [paying, setPaying] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [saveCard, setSaveCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cardsLoaded, setCardsLoaded] = useState(false);

  const [cardForm, setCardForm] = useState<CardFormValues>(emptyCard);
  const [cvvFocused, setCvvFocused] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(true);
  const [iyzicoEmbedded, setIyzicoEmbedded] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);

  const cardBrand = detectCardBrand(cardForm.cardNumber);
  const displayNumber = maskCardNumber(cardForm.cardNumber);

  useEffect(() => {
    fetch('/api/customer/me')
      .then(res => (res.ok ? res.json() : null))
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
      .catch(() => {})
      .finally(() => setCardsLoaded(true));
  }, []);

  const loadCheckout = useCallback(async () => {
    if (selectedCardId) {
      setShowCustomForm(false);
      setIyzicoEmbedded(false);
      setCheckoutLoading(false);
      return;
    }

    setCheckoutLoading(true);
    setError('');
    setIyzicoEmbedded(false);
    setCheckoutUrl(null);
    setIsDevMode(false);

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: reservation.id,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setShowCustomForm(true);
        setError(data.error || 'Ödeme formu yüklenemedi.');
        return;
      }

      if (data.devMode) {
        setIsDevMode(true);
        setShowCustomForm(true);
        return;
      }

      if (data.checkoutHtml && checkoutRef.current) {
        injectCheckoutHtml(checkoutRef.current, data.checkoutHtml);
        setShowCustomForm(false);
        setIyzicoEmbedded(true);
        return;
      }

      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
        setShowCustomForm(true);
        return;
      }

      setShowCustomForm(true);
      setError('Ödeme formu yüklenemedi.');
    } catch {
      setShowCustomForm(true);
      setError('Ödeme formu yüklenemedi. Lütfen sayfayı yenileyin.');
    } finally {
      setCheckoutLoading(false);
    }
  }, [reservation.id, selectedCardId]);

  useEffect(() => {
    if (!cardsLoaded) return;
    loadCheckout();
  }, [cardsLoaded, selectedCardId, loadCheckout]);

  const updateCardField = (field: keyof CardFormValues, value: string) => {
    setCardForm(prev => {
      if (field === 'cardNumber') return { ...prev, cardNumber: formatCardNumber(value) };
      if (field === 'expiryMonth') return { ...prev, expiryMonth: value.replace(/\D/g, '').slice(0, 2) };
      if (field === 'expiryYear') return { ...prev, expiryYear: value.replace(/\D/g, '').slice(0, 2) };
      if (field === 'cvv') return { ...prev, cvv: value.replace(/\D/g, '').slice(0, 4) };
      return { ...prev, [field]: value };
    });
  };

  const handlePay = async () => {
    setError('');
    setPaying(true);

    try {
      if (!selectedCardId && showCustomForm) {
        const validationError = validateCardForm(cardForm);
        if (validationError) {
          setError(validationError);
          return;
        }

        if (checkoutUrl && !isDevMode) {
          window.location.href = checkoutUrl;
          return;
        }
      }

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

      if (data.checkoutHtml && checkoutRef.current) {
        injectCheckoutHtml(checkoutRef.current, data.checkoutHtml);
        setShowCustomForm(false);
        setIyzicoEmbedded(true);
        return;
      }

      setError('Ödeme sayfası yüklenemedi.');
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setPaying(false);
    }
  };

  const showPayButton = selectedCardId || showCustomForm;
  const showCardEntry = !selectedCardId && (showCustomForm || checkoutLoading);

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

              {showCardEntry && (
                <>
                  <p className={styles.formSectionTitle}>Kredi / Banka Kartı Bilgileri</p>

                  <div
                    className={styles.cardVisualWrap}
                    onClick={() => setCvvFocused(prev => !prev)}
                    role="presentation"
                  >
                    <div className={`${styles.cardVisual} ${cvvFocused ? styles.flipped : ''}`}>
                      <div className={styles.cardFront}>
                        <div className={styles.cardLogo}>
                          <div className={styles.cardChip}>
                            <div className={styles.chipRow} />
                            <div className={styles.chipRow} />
                            <div className={styles.chipRow} />
                          </div>
                        </div>
                        <div className={styles.cardNumber}>{displayNumber}</div>
                        <div className={styles.cardBottom}>
                          <div>
                            <div className={styles.cardMicroLabel}>Kart Sahibi</div>
                            <div className={styles.cardValue}>
                              {cardForm.cardHolder.toUpperCase() || 'AD SOYAD'}
                            </div>
                          </div>
                          <div>
                            <div className={styles.cardMicroLabel}>SKT</div>
                            <div className={styles.cardValue}>
                              {cardForm.expiryMonth || 'MM'}/{cardForm.expiryYear || 'YY'}
                            </div>
                          </div>
                          <div className={styles.cardNetworkLogo}>
                            {cardBrand === 'visa' ? 'VISA' : cardBrand === 'mastercard' ? 'MC' : '•••'}
                          </div>
                        </div>
                      </div>
                      <div className={styles.cardBack}>
                        <div className={styles.cardStripe} />
                        <div className={styles.cardCvvBox}>
                          <span className={styles.cardCvvLabel}>CVV</span>
                          <span className={styles.cardCvvVal}>{cardForm.cvv || '•••'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {checkoutLoading ? (
                    <div className={styles.checkoutLoading}>
                      <span className={styles.spinner} />
                      Güvenli ödeme formu hazırlanıyor...
                    </div>
                  ) : showCustomForm && (
                    <div className={styles.cardFormFields}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="cardHolder">Kart Üzerindeki İsim</label>
                        <div className={styles.inputWrap}>
                          <input
                            id="cardHolder"
                            className="input"
                            type="text"
                            autoComplete="cc-name"
                            placeholder="Ad Soyad"
                            value={cardForm.cardHolder}
                            onChange={e => updateCardField('cardHolder', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="cardNumber">Kart Numarası</label>
                        <div className={styles.inputWrap}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary)' }}>credit_card</span>
                          <input
                            id="cardNumber"
                            className="input"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="0000 0000 0000 0000"
                            value={cardForm.cardNumber}
                            onChange={e => updateCardField('cardNumber', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className={styles.twoCol}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="expiryMonth">Son Kullanma</label>
                          <div className={styles.inputWrap}>
                            <input
                              id="expiryMonth"
                              className="input"
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-exp-month"
                              placeholder="AA"
                              value={cardForm.expiryMonth}
                              onChange={e => updateCardField('expiryMonth', e.target.value)}
                              aria-label="Son kullanma ayı"
                            />
                            <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>/</span>
                            <input
                              className="input"
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-exp-year"
                              placeholder="YY"
                              value={cardForm.expiryYear}
                              onChange={e => updateCardField('expiryYear', e.target.value)}
                              aria-label="Son kullanma yılı"
                            />
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="cvv">CVV</label>
                          <div className={styles.inputWrap}>
                            <input
                              id="cvv"
                              className="input"
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              placeholder="•••"
                              value={cardForm.cvv}
                              onFocus={() => setCvvFocused(true)}
                              onBlur={() => setCvvFocused(false)}
                              onChange={e => updateCardField('cvv', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {isDevMode && (
                        <p className={styles.devModeNote}>
                          Test ortamı: Kart bilgileri doğrulama amaçlıdır; gerçek ödeme alınmaz.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              <div
                ref={checkoutRef}
                className={`${styles.iyzicoCheckout} ${iyzicoEmbedded ? styles.iyzicoCheckoutVisible : ''}`}
                aria-live="polite"
              />

              {authenticated && !selectedCardId && showCustomForm && !checkoutLoading && (
                <label className={styles.saveCardRow}>
                  <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} />
                  <span>Bu kartı gelecek ödemeler için kaydet</span>
                </label>
              )}

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-secondary)', lineHeight: 1.7 }}>
                Ödeme işleminiz iyzico güvenli ödeme altyapısı üzerinden gerçekleştirilir.
                Kart bilgileriniz sistemimizde saklanmaz{authenticated && saveCard ? '; yalnızca token kaydedilir' : ''}.
              </p>

              {error && (
                <div className={styles.errorBox}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  {error}
                </div>
              )}

              {showPayButton && (
                <button
                  className={`btn btn-primary btn-full btn-lg ${styles.payBtn}`}
                  onClick={handlePay}
                  disabled={paying || checkoutLoading}
                >
                  {paying ? (
                    <>
                      <span className={styles.spinner} />
                      {isDevMode ? 'Ödeme tamamlanıyor...' : 'Yönlendiriliyor...'}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined icon-filled">lock</span>
                      {formatPriceShort(reservation.totalPrice)} — Güvenle Öde
                    </>
                  )}
                </button>
              )}

              {iyzicoEmbedded && (
                <p className={styles.iyzicoEmbedNote}>
                  Kart bilgilerinizi yukarıdaki güvenli iyzico formuna girerek 3D Secure doğrulamasını tamamlayın.
                </p>
              )}

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
