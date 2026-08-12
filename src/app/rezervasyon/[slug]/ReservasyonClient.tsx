'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Villa } from '@/types/database';
import { formatPriceShort, getNightCount, calculateTotalPrice, getTodayString } from '@/lib/utils';
import styles from './page.module.css';

interface Props { villa: Villa; }

interface ExtraOption {
  id: string;
  icon: string;
  name: string;
  desc: string;
  price: number;
}

const steps = [
  { id: 1, label: 'Tarihler' },
  { id: 2, label: 'Ek Hizmetler' },
  { id: 3, label: 'Bilgiler' },
  { id: 4, label: 'Özet & Ödeme' },
];

export default function ReservasyonClient({ villa }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [extras, setExtras] = useState<ExtraOption[]>([]);
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', tcNo: '', notes: '', kvkk: false, mesafeli: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const today = getTodayString();
  const nights = checkIn && checkOut ? getNightCount(checkIn, checkOut) : 0;
  const pricing = nights > 0 ? calculateTotalPrice(villa.pricePerNight, nights, villa.cleaningFee, villa.serviceFee) : null;
  const extraTotal = extras.filter(e => selectedExtras.includes(e.id)).reduce((sum, e) => sum + e.price, 0);
  const grandTotal = (pricing?.total || 0) + extraTotal;

  useEffect(() => {
    fetch('/api/extras')
      .then(res => res.json())
      .then(data => {
        setExtras((data.extras || []).map((e: { slug: string; icon: string; name: string; description: string; price: number }) => ({
          id: e.slug,
          icon: e.icon,
          name: e.name,
          desc: e.description,
          price: e.price,
        })));
      })
      .catch(() => setExtras([]));

    fetch('/api/customer/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.profile) {
          setAuthenticated(true);
          setForm(prev => ({
            ...prev,
            firstName: data.profile.firstName || prev.firstName,
            lastName: data.profile.lastName || prev.lastName,
            email: data.profile.email || prev.email,
            phone: data.profile.phone || prev.phone,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const canProceed = () => {
    if (step === 1) return nights >= villa.minNights && guests >= 1 && !availabilityError;
    if (step === 3) return form.firstName && form.lastName && form.email && form.phone && form.kvkk && form.mesafeli;
    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      setCheckingAvailability(true);
      setAvailabilityError('');
      try {
        const params = new URLSearchParams({ checkIn, checkOut });
        const res = await fetch(`/api/villas/${villa.slug}/availability?${params}`);
        const data = await res.json();
        if (!data.available) {
          setAvailabilityError(data.reason || 'Seçilen tarihler müsait değil.');
          return;
        }
        setStep(2);
      } catch {
        setAvailabilityError('Müsaitlik kontrol edilemedi.');
      } finally {
        setCheckingAvailability(false);
      }
      return;
    }

    if (step < 4) {
      setStep(step + 1);
      setSubmitError('');
    } else {
      setSubmitting(true);
      setSubmitError('');
      try {
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            villaSlug: villa.slug,
            checkIn,
            checkOut,
            guests,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            tcNo: form.tcNo || undefined,
            notes: form.notes || undefined,
            kvkk: form.kvkk,
            extras: selectedExtras,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSubmitError(data.error || 'Rezervasyon oluşturulamadı.');
          return;
        }
        router.push(`/odeme/${data.reservation.id}?email=${encodeURIComponent(data.reservation.guestEmail)}`);
      } catch {
        setSubmitError('Bağlantı hatası. Lütfen tekrar deneyin.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <main className={styles.main}>
      <div className="container">
        {/* Stepper */}
        <div className={styles.stepper}>
          <div className={styles.stepperTrack}>
            <div className={styles.stepperProgress} style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} />
          </div>
          {steps.map(s => (
            <div key={s.id} className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${step > s.id ? styles.stepDone : ''} ${step === s.id ? styles.stepCurrent : ''}`}>
                {step > s.id ? (
                  <span className="material-symbols-outlined icon-filled" style={{fontSize:'18px'}}>check</span>
                ) : (
                  <span>{s.id}</span>
                )}
              </div>
              <span className={`${styles.stepLabel} ${step === s.id ? styles.stepLabelActive : ''}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Left: Form */}
          <div className={styles.formArea}>

            {/* Step 1: Dates */}
            {step === 1 && (
              <div className={`${styles.formCard} animate-fadeUp`}>
                <h2 className={styles.stepTitle}>Tarih ve Misafir Bilgileri</h2>
                <p className={styles.stepDesc}>Konaklama tarihlerinizi ve misafir sayınızı seçin.</p>

                <div className={styles.dateRow}>
                  <div className={styles.dateField}>
                    <label className={styles.fieldLabel} htmlFor="rez-checkin">Giriş Tarihi</label>
                    <div className={styles.fieldWrap}>
                      <span className="material-symbols-outlined" style={{color:'var(--color-primary)'}} aria-hidden>calendar_today</span>
                      <input
                        id="rez-checkin"
                        type="date"
                        className="input"
                        value={checkIn}
                        min={today}
                        onChange={e => { setCheckIn(e.target.value); setAvailabilityError(''); }}
                      />
                    </div>
                  </div>
                  <div className={styles.dateField}>
                    <label className={styles.fieldLabel} htmlFor="rez-checkout">Çıkış Tarihi</label>
                    <div className={styles.fieldWrap}>
                      <span className="material-symbols-outlined" style={{color:'var(--color-primary)'}} aria-hidden>calendar_month</span>
                      <input
                        id="rez-checkout"
                        type="date"
                        className="input"
                        value={checkOut}
                        min={checkIn || today}
                        onChange={e => { setCheckOut(e.target.value); setAvailabilityError(''); }}
                      />
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className={styles.guestRow}>
                  <label className={styles.fieldLabel}>Misafir Sayısı</label>
                  <div className={styles.guestStepper}>
                    <button className={styles.stepBtn} onClick={() => setGuests(Math.max(1, guests - 1))}>
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <div className={styles.guestDisplay}>
                      <span className={styles.guestNum}>{guests}</span>
                      <span className={styles.guestLabel}>Misafir</span>
                    </div>
                    <button className={styles.stepBtn} onClick={() => setGuests(Math.min(villa.maxGuests, guests + 1))}>
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <p style={{fontSize:'var(--text-xs)', color:'var(--color-secondary)'}}>Maksimum kapasite: {villa.maxGuests} kişi</p>
                </div>

                {nights > 0 && nights < villa.minNights && (
                  <div className={styles.warningBox}>
                    <span className="material-symbols-outlined" style={{color:'var(--color-warning)'}}>warning</span>
                    <p>Bu villa için minimum {villa.minNights} gece konaklamanız gerekmektedir.</p>
                  </div>
                )}

                {availabilityError && (
                  <div className={styles.warningBox} style={{ borderColor: 'var(--color-error)', background: 'rgba(186,26,26,0.06)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-error)' }}>event_busy</span>
                    <p>{availabilityError}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Extras */}
            {step === 2 && (
              <div className={`${styles.formCard} animate-fadeUp`}>
                <h2 className={styles.stepTitle}>Ek Hizmetler</h2>
                <p className={styles.stepDesc}>İsteğe bağlı ek hizmetleri seçebilirsiniz.</p>

                <div className={styles.extrasList}>
                  {extras.map(extra => (
                    <label key={extra.id} className={`${styles.extraItem} ${selectedExtras.includes(extra.id) ? styles.extraSelected : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.id)}
                        onChange={() => toggleExtra(extra.id)}
                        style={{display:'none'}}
                      />
                      <div className={styles.extraIcon}>
                        <span className="material-symbols-outlined">{extra.icon}</span>
                      </div>
                      <div className={styles.extraInfo}>
                        <span className={styles.extraName}>{extra.name}</span>
                        <span className={styles.extraDesc}>{extra.desc}</span>
                      </div>
                      <span className={styles.extraPrice}>+{formatPriceShort(extra.price)}</span>
                      <div className={styles.extraCheck}>
                        {selectedExtras.includes(extra.id) && (
                          <span className="material-symbols-outlined icon-filled" style={{fontSize:'20px', color:'var(--color-primary)'}}>check_circle</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Personal Info */}
            {step === 3 && (
              <div className={`${styles.formCard} animate-fadeUp`}>
                <h2 className={styles.stepTitle}>Kişisel Bilgilerinizi Girin</h2>
                <p className={styles.stepDesc}>Rezervasyonunuz için gerekli bilgileri doldurun.</p>

                {authenticated && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-5)',
                    background: 'rgba(0,106,69,0.06)', border: '1px solid rgba(0,106,69,0.15)',
                    borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-success)',
                  }}>
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '18px' }}>person</span>
                    Hesap bilgilerinizle dolduruldu. Rezervasyon panelinizde görünecek.
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Ad</label>
                    <input className="input" placeholder="Ahmet" value={form.firstName}
                      onChange={e => setForm({...form, firstName: e.target.value})} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Soyad</label>
                    <input className="input" placeholder="Yılmaz" value={form.lastName}
                      onChange={e => setForm({...form, lastName: e.target.value})} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>E-posta</label>
                    <input type="email" className="input" placeholder="ahmet@email.com" value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Telefon</label>
                    <input type="tel" className="input" placeholder="+90 5XX XXX XX XX" value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className={`${styles.fieldGroup} ${styles.colSpan2}`}>
                    <label className={styles.fieldLabel}>T.C. Kimlik No</label>
                    <input className="input" placeholder="11 haneli kimlik numarası" maxLength={11} value={form.tcNo}
                      onChange={e => setForm({...form, tcNo: e.target.value})} />
                  </div>
                  <div className={`${styles.fieldGroup} ${styles.colSpan2}`}>
                    <label className={styles.fieldLabel}>Ek Notlar (İsteğe Bağlı)</label>
                    <textarea className="input" rows={3} placeholder="Özel istekleriniz..." value={form.notes}
                      onChange={e => setForm({...form, notes: e.target.value})} style={{resize:'none'}} />
                  </div>
                  <div className={`${styles.fieldGroup} ${styles.colSpan2} ${styles.kvkk}`}>
                    <label className={styles.kvkkLabel}>
                      <input type="checkbox" checked={form.kvkk}
                        onChange={e => setForm({...form, kvkk: e.target.checked})} />
                      <a href="/hakkimizda#kvkk" target="_blank" style={{color:'var(--color-primary)', textDecoration:'underline'}}>
                        KVKK Aydınlatma Metni
                      </a>
                      'ni okudum ve onaylıyorum.
                    </label>
                  </div>
                  <div className={`${styles.fieldGroup} ${styles.colSpan2} ${styles.kvkk}`}>
                    <label className={styles.kvkkLabel}>
                      <input type="checkbox" checked={form.mesafeli}
                        onChange={e => setForm({...form, mesafeli: e.target.checked})} />
                      <a href="/hakkimizda#mesafeli" target="_blank" style={{color:'var(--color-primary)', textDecoration:'underline'}}>
                        Mesafeli Satış Sözleşmesi
                      </a>
                      'ni okudum ve onaylıyorum.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Summary */}
            {step === 4 && (
              <div className={`${styles.formCard} animate-fadeUp`}>
                <h2 className={styles.stepTitle}>Rezervasyon Özeti</h2>
                <p className={styles.stepDesc}>Bilgilerinizi kontrol edin ve ödemeye geçin.</p>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Villa</span>
                  <span className={styles.summaryValue}>{villa.name}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Konum</span>
                  <span className={styles.summaryValue}>{villa.location}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Giriş</span>
                  <span className={styles.summaryValue}>{checkIn}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Çıkış</span>
                  <span className={styles.summaryValue}>{checkOut}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Misafir</span>
                  <span className={styles.summaryValue}>{guests} Kişi</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Ad Soyad</span>
                  <span className={styles.summaryValue}>{form.firstName} {form.lastName}</span>
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{nights} gece × {formatPriceShort(villa.pricePerNight)}</span>
                  <span className={styles.summaryValue}>{formatPriceShort(pricing?.subtotal || 0)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Temizlik ücreti</span>
                  <span className={styles.summaryValue}>{formatPriceShort(villa.cleaningFee)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Hizmet bedeli</span>
                  <span className={styles.summaryValue}>{formatPriceShort(villa.serviceFee)}</span>
                </div>
                {extraTotal > 0 && (
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Ek hizmetler</span>
                    <span className={styles.summaryValue}>{formatPriceShort(extraTotal)}</span>
                  </div>
                )}
                <div className={styles.summaryTotal}>
                  <span>Genel Toplam</span>
                  <span className={styles.summaryTotalAmount}>{formatPriceShort(grandTotal)}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {submitError && step === 4 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)',
                background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)',
                borderRadius: 'var(--radius-md)', color: 'var(--color-error)', fontSize: 'var(--text-sm)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                {submitError}
              </div>
            )}
            <div className={styles.navBtns}>
              {step > 1 && (
                <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                  <span className="material-symbols-outlined">arrow_back</span>
                  Geri
                </button>
              )}
              <button
                className="btn btn-primary btn-lg"
                onClick={handleNext}
                disabled={!canProceed() || submitting || checkingAvailability}
                style={{ marginLeft: 'auto' }}
              >
                {submitting ? (
                  <>
                    <span className={styles.spinner} />
                    İşleniyor...
                  </>
                ) : checkingAvailability ? (
                  <>
                    <span className={styles.spinner} />
                    Müsaitlik kontrol ediliyor...
                  </>
                ) : step === 4 ? (
                  <>
                    <span className="material-symbols-outlined">credit_card</span>
                    Ödemeye Geç
                  </>
                ) : (
                  <>
                    Devam Et
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Summary Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.sideImg}>
                <Image src={villa.images[0]} alt={villa.name} fill sizes="400px" style={{objectFit:'cover'}} />
                <div className={styles.sideOverlay} />
                <div className={styles.sideInfo}>
                  <span style={{fontSize:'var(--text-xs)', color:'rgba(255,255,255,0.7)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em'}}>Villa Kiralama</span>
                  <h3 style={{fontFamily:'var(--font-headline)', color:'white', fontWeight:700, fontSize:'var(--text-lg)'}}>{villa.name}</h3>
                </div>
              </div>

              <div className={styles.sideMeta}>
                {checkIn && checkOut && (
                  <div className={styles.sideRow}>
                    <span className="material-symbols-outlined" style={{fontSize:'18px', color:'var(--color-primary)'}}>calendar_today</span>
                    <span style={{fontSize:'var(--text-sm)', color:'var(--color-secondary)'}}>
                      {checkIn} — {checkOut} ({nights} gece)
                    </span>
                  </div>
                )}
                <div className={styles.sideRow}>
                  <span className="material-symbols-outlined" style={{fontSize:'18px', color:'var(--color-primary)'}}>group</span>
                  <span style={{fontSize:'var(--text-sm)', color:'var(--color-secondary)'}}>{guests} Misafir</span>
                </div>

                {pricing && (
                  <>
                    <div className={styles.sideDivider} />
                    <div className={styles.sidePriceTotal}>
                      <span style={{fontSize:'var(--text-xs)', color:'var(--color-secondary)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:700}}>Toplam Tutar</span>
                      <span style={{fontFamily:'var(--font-headline)', fontSize:'var(--text-2xl)', fontWeight:800, color:'var(--color-primary)'}}>
                        {formatPriceShort(grandTotal)}
                      </span>
                    </div>
                  </>
                )}

                <div className={styles.trustRow}>
                  <span className="material-symbols-outlined icon-filled" style={{fontSize:'16px', color:'var(--color-success)'}}>verified_user</span>
                  <span style={{fontSize:'var(--text-xs)', color:'var(--color-success)', fontWeight:700}}>Güvenli Ödeme Altyapısı</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
