'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig, telLink, whatsappLink } from '@/lib/site-config';
import styles from './page.module.css';

interface TransferVehicle {
  id: string;
  name: string;
  category: string;
  capacity: string;
  luggage: string;
  features: string[];
  priceFrom: number;
  image: string;
  badge: string;
  badgeColor: string;
  description: string;
}

const services = [
  {
    icon: 'flight_land',
    title: 'Havalimanı Karşılama',
    desc: 'Uçuş takibi ile gecikmelerde bile sizi bekleriz. İsim tabelası ile kapıda karşılama.',
    color: 'var(--color-primary)',
    bg: 'rgba(186,0,54,0.06)',
  },
  {
    icon: 'flight_takeoff',
    title: 'Havalimanı Bırakma',
    desc: 'Uçuşunuza göre planlanan zamanlama ile konaklamadan havalimanına stressiz yolculuk.',
    color: 'var(--color-primary)',
    bg: 'rgba(186,0,54,0.06)',
  },
  {
    icon: 'villa',
    title: 'Villa–Villa Transfer',
    desc: 'Villa konaklamalarınız arasında veya villa ile restoran / marina arasında özel transfer.',
    color: '#006a45',
    bg: 'rgba(0,106,69,0.06)',
  },
  {
    icon: 'directions_car',
    title: 'Günlük Şoförlü Araç',
    desc: 'Tüm gün özel şoförünüz ve aracınız sizinle. Alışveriş, tur, toplantı — her şey dahil.',
    color: '#1b1c1c',
    bg: 'rgba(27,28,28,0.05)',
  },
  {
    icon: 'directions_boat',
    title: 'Marina & Yat Transferi',
    desc: 'Marina, tekne iskeleti ve yat transferlerinde VIP araç ve kapı önü hizmet.',
    color: '#006a45',
    bg: 'rgba(0,106,69,0.06)',
  },
  {
    icon: 'celebration',
    title: 'Özel Etkinlik Transferi',
    desc: 'Düğün, gala, özel davet ve iş toplantıları için tam protokol transfer hizmeti.',
    color: 'var(--color-primary)',
    bg: 'rgba(186,0,54,0.06)',
  },
];

const airports = [
  { code: 'AYT', name: 'Antalya', duration: '~35 dk', desc: 'Kaş, Kalkan, Belek, Kemer' },
  { code: 'BJV', name: 'Bodrum–Milas', duration: '~45 dk', desc: 'Bodrum, Türkbükü, Gündoğan' },
  { code: 'DLM', name: 'Dalaman', duration: '~50 dk', desc: 'Fethiye, Ölüdeniz, Marmaris' },
  { code: 'ADB', name: 'İzmir–Adnan Menderes', duration: '~55 dk', desc: 'Alaçatı, Çeşme, Urla' },
];

const faqs = [
  { q: 'Rezervasyonu ne zaman yapmalıyım?', a: 'En az 24 saat önceden rezervasyon yapmanızı öneririz. Yoğun sezonda (Temmuz–Ağustos) 48 saat önceden rezervasyon yapmanız güvence sağlar.' },
  { q: 'Uçağım gecikirse ne olur?', a: 'Anlık uçuş takibi yapıyoruz. Uçuşunuz gecikse bile ek ücret olmaksızın sizi bekliyoruz. Havalimanı bekleme süresi 1 saate kadar ücretsizdir.' },
  { q: 'Ödeme nasıl yapılır?', a: 'Kredi kartı, banka transferi veya nakit ödeme seçeneklerimiz mevcuttur. Online rezervasyonda %20 depozito alınır, kalan tutar transfer günü ödenir.' },
  { q: 'Çocuk koltuğu temin edilebilir mi?', a: 'Evet, talep üzerine ücretsiz bebek/çocuk koltuğu sağlıyoruz. Rezervasyon sırasında belirtmeniz yeterli.' },
  { q: 'Fatura düzenleniyor mu?', a: 'Evet, bireysel ve kurumsal fatura düzenleyebiliyoruz. Kurumsal müşterilerimize özel fiyat anlaşmaları yapılmaktadır.' },
];

export default function VipTransferClient() {
  const [vehicles, setVehicles] = useState<TransferVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    type: 'airport-pickup',
    from: '',
    to: '',
    date: '',
    time: '',
    passengers: '2',
    vehicle: '',
    name: '',
    phone: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [transferCode, setTransferCode] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetch('/api/transfers/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data.vehicles || []))
      .catch(() => setVehicles([]));

    fetch('/api/customer/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.profile) {
          const fullName = `${data.profile.firstName} ${data.profile.lastName}`.trim();
          setForm(prev => ({
            ...prev,
            name: fullName || prev.name,
            phone: data.profile.phone || prev.phone,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          from: form.from,
          to: form.to,
          date: form.date,
          time: form.time,
          passengers: Number(form.passengers),
          vehicle: form.vehicle || undefined,
          name: form.name,
          phone: form.phone,
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Talep gönderilemedi.');
        return;
      }
      setTransferCode(data.transfer?.code || '');
      setSubmitted(true);
    } catch {
      setSubmitError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src={siteConfig.vipTransferHero}
            alt="VIP Transfer"
            className={styles.heroBgImg}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className="material-symbols-outlined icon-filled" style={{ fontSize: '14px' }}>diamond</span>
            Premium VIP Transfer Hizmeti
          </div>
          <h1 className={styles.heroTitle}>
            Varış Anından<br />
            <span className={styles.heroAccent}>İtibaren Lüks</span>
          </h1>
          <p className={styles.heroDesc}>
            Profesyonel şoförler, en son model Mercedes araçlar ve kapıdan kapıya VIP hizmetle seyahat edin. Havalimanı, marina, villa — her güzergahta yanınızdayız.
          </p>
          <div className={styles.heroActions}>
            <a href="#rezervasyon" className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">calendar_add_on</span>
              Transfer Rezerve Et
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
              <span className="material-symbols-outlined icon-filled" style={{ color: '#25D366' }}>chat</span>
              WhatsApp ile İletişim
            </a>
          </div>
          <div className={styles.heroBadges}>
            <div className={styles.heroBadgeItem}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px', color: '#f59e0b' }}>star</span>
              4.98 / 5.0 Puan
            </div>
            <div className={styles.heroBadgeItem}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px', color: 'var(--color-primary-fixed-dim)' }}>verified</span>
              TÜRSAB Onaylı
            </div>
            <div className={styles.heroBadgeItem}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px', color: 'var(--color-primary-fixed-dim)' }}>schedule</span>
              7/24 Hizmet
            </div>
          </div>
        </div>
      </section>

      {/* ── Hizmetlerimiz ─────────────────────────────────── */}
      <section className={`section-padding ${styles.servicesSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>directions_car</span>
              Hizmetlerimiz
            </p>
            <h2 className={styles.sectionTitle}>Her Güzergahta VIP Deneyim</h2>
            <p className={styles.sectionDesc}>
              Havalimanından vilanıza, marinadan restoranınıza — seyahat detaylarını bize bırakın.
            </p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((s, i) => (
              <div key={s.title} className={styles.serviceCard} style={{ animationDelay: `${i * 80}ms` }}>
                <div className={styles.serviceIcon} style={{ background: s.bg, color: s.color }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px' }}>{s.icon}</span>
                </div>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Araç Filosu ───────────────────────────────────── */}
      <section className={`section-padding ${styles.fleetSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>directions_car</span>
              Araç Filosu
            </p>
            <h2 className={styles.sectionTitle}>Premium Mercedes Filo</h2>
            <p className={styles.sectionDesc}>
              Tüm araçlarımız 2022 model ve üzeri, tam sigortalı ve periyodik bakımlıdır.
            </p>
          </div>
          <div className={styles.fleetGrid}>
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={`${styles.vehicleCard} ${selectedVehicle === v.id ? styles.vehicleSelected : ''}`}
                onClick={() => setSelectedVehicle(selectedVehicle === v.id ? null : v.id)}
              >
                <div className={styles.vehicleImgWrap}>
                  <img src={v.image} alt={v.name} className={styles.vehicleImg} />
                  <span className={styles.vehicleBadge} style={{ background: v.badgeColor }}>
                    {v.badge}
                  </span>
                </div>
                <div className={styles.vehicleBody}>
                  <p className={styles.vehicleCategory}>{v.category}</p>
                  <h3 className={styles.vehicleName}>{v.name}</h3>
                  <p className={styles.vehicleDesc}>{v.description}</p>
                  <div className={styles.vehicleSpecs}>
                    <span className={styles.vehicleSpec}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>group</span>
                      {v.capacity}
                    </span>
                    <span className={styles.vehicleSpec}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>luggage</span>
                      {v.luggage}
                    </span>
                  </div>
                  <div className={styles.vehicleFeatures}>
                    {v.features.map(f => (
                      <span key={f} className={styles.vehicleFeature}>
                        <span className="material-symbols-outlined icon-filled" style={{ fontSize: '12px', color: 'var(--color-success)' }}>check_circle</span>
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className={styles.vehiclePrice}>
                    <span className={styles.vehiclePriceLabel}>itibaren</span>
                    <span className={styles.vehiclePriceAmount}>₺{v.priceFrom.toLocaleString('tr-TR')}</span>
                    <span className={styles.vehiclePriceUnit}>/transfer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Havalimanları ─────────────────────────────────── */}
      <section className={`${styles.airportsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>flight</span>
              Güzergahlar
            </p>
            <h2 className={styles.sectionTitle}>Hizmet Verdiğimiz Havalimanları</h2>
          </div>
          <div className={styles.airportsGrid}>
            {airports.map((a) => (
              <div key={a.code} className={styles.airportCard}>
                <div className={styles.airportCode}>{a.code}</div>
                <div>
                  <h3 className={styles.airportName}>{a.name} Havalimanı</h3>
                  <p className={styles.airportDuration}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>schedule</span>
                    Ortalama {a.duration}
                  </p>
                  <p className={styles.airportDesc}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rezervasyon Formu ─────────────────────────────── */}
      <section id="rezervasyon" className={`section-padding ${styles.formSection}`}>
        <div className="container">
          <div className={styles.formLayout}>
            {/* Sol: Form */}
            <div className={styles.formWrap}>
              <div className={styles.sectionHeader}>
                <p className={styles.eyebrow}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_add_on</span>
                  Transfer Rezervasyonu
                </p>
                <h2 className={styles.sectionTitle}>Hemen Rezervasyon Yap</h2>
              </div>

              {submitted ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '48px', color: 'var(--color-success)' }}>check_circle</span>
                  </div>
                  <h3 className={styles.successTitle}>Talebiniz Alındı!</h3>
                  <p className={styles.successDesc}>
                    Transfer talebiniz başarıyla iletildi{transferCode && <> — talep kodu: <strong>{transferCode}</strong></>}.
                    Ekibimiz en geç <strong>2 saat</strong> içinde sizinle iletişime geçecek.
                  </p>
                  <div className={styles.successActions}>
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <span className="material-symbols-outlined icon-filled">chat</span>
                      WhatsApp ile Takip Et
                    </a>
                    <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                      Yeni Rezervasyon
                    </button>
                  </div>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  {submitError && (
                    <div style={{
                      padding: 'var(--space-3)', background: 'rgba(186,26,26,0.08)',
                      border: '1px solid rgba(186,26,26,0.2)', borderRadius: 'var(--radius-md)',
                      color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)',
                    }}>{submitError}</div>
                  )}
                  {/* Transfer Tipi */}
                  <div className={styles.typeGrid}>
                    {[
                      { val: 'airport-pickup', label: 'Havalimanı Karşılama', icon: 'flight_land' },
                      { val: 'airport-dropoff', label: 'Havalimanı Bırakma', icon: 'flight_takeoff' },
                      { val: 'city', label: 'Şehir İçi Transfer', icon: 'directions_car' },
                      { val: 'daily', label: 'Günlük Şoförlü Araç', icon: 'schedule' },
                    ].map(t => (
                      <button
                        key={t.val}
                        type="button"
                        className={`${styles.typeBtn} ${form.type === t.val ? styles.typeBtnActive : ''}`}
                        onClick={() => setForm(f => ({ ...f, type: t.val }))}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Kalkış Noktası</label>
                      <div className={styles.inputWrap}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>location_on</span>
                        <input
                          className="input"
                          placeholder="Havalimanı, otel veya adres..."
                          value={form.from}
                          onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Varış Noktası</label>
                      <div className={styles.inputWrap}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>flag</span>
                        <input
                          className="input"
                          placeholder="Villa, otel veya adres..."
                          value={form.to}
                          onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Tarih</label>
                      <div className={styles.inputWrap}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>calendar_today</span>
                        <input
                          type="date"
                          className="input"
                          value={form.date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Saat</label>
                      <div className={styles.inputWrap}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>schedule</span>
                        <input
                          type="time"
                          className="input"
                          value={form.time}
                          onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Yolcu Sayısı</label>
                      <div className={styles.inputWrap}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>group</span>
                        <select
                          className="input"
                          value={form.passengers}
                          onChange={e => setForm(f => ({ ...f, passengers: e.target.value }))}
                        >
                          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => (
                            <option key={n} value={n}>{n} Kişi</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Araç Tercihi</label>
                      <div className={styles.inputWrap}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>directions_car</span>
                        <select
                          className="input"
                          value={form.vehicle}
                          onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))}
                        >
                          <option value="">Fark Etmez — Otomatik Seçim</option>
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.name} (maks. {v.capacity})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={`${styles.fieldGroup} ${styles.colSpan2}`}>
                      <label className={styles.label}>Adınız Soyadınız</label>
                      <div className={styles.inputWrap}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>person</span>
                        <input
                          className="input"
                          placeholder="Ad Soyad"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className={`${styles.fieldGroup} ${styles.colSpan2}`}>
                      <label className={styles.label}>Telefon</label>
                      <div className={styles.inputWrap}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>phone</span>
                        <input
                          className="input"
                          placeholder="+90 5XX XXX XX XX"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className={`${styles.fieldGroup} ${styles.colSpan2}`}>
                      <label className={styles.label}>Ekstra Notlar</label>
                      <textarea
                        className={`input ${styles.textarea}`}
                        placeholder="Özel istekler, uçuş numarası, bebek koltuğu talebi..."
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>

                  <button type="submit" className={`btn btn-primary btn-lg btn-full ${styles.submitBtn}`} disabled={submitting}>
                    <span className="material-symbols-outlined">{submitting ? 'hourglass_empty' : 'send'}</span>
                    {submitting ? 'Gönderiliyor...' : 'Transfer Talebi Gönder'}
                  </button>
                  <p className={styles.formNote}>
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '14px', color: 'var(--color-success)' }}>info</span>
                    Talebinize en geç 2 saat içinde dönüş yapılır. Ödeme transferde alınır.
                  </p>
                </form>
              )}
            </div>

            {/* Sağ: Bilgi Kartları */}
            <div className={styles.formSide}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>
                  <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-primary)' }}>local_phone</span>
                  Anında İletişim
                </h3>
                <div className={styles.contactLinks}>
                  <a href={telLink()} className={styles.contactLink}>
                    <div className={styles.contactIcon}>
                      <span className="material-symbols-outlined icon-filled">call</span>
                    </div>
                    <div>
                      <p className={styles.contactLabel}>Telefon</p>
                      <p className={styles.contactValue}>{siteConfig.phoneDisplay}</p>
                    </div>
                  </a>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                    <div className={styles.contactIcon} style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
                      <span className="material-symbols-outlined icon-filled">chat</span>
                    </div>
                    <div>
                      <p className={styles.contactLabel}>WhatsApp</p>
                      <p className={styles.contactValue}>7/24 Anlık Yanıt</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>
                  <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-primary)' }}>shield</span>
                  Güvencelerimiz
                </h3>
                <ul className={styles.guaranteeList}>
                  {[
                    'Uçuş takipli karşılama — gecikme yok',
                    'Sabit fiyat — sayaç yok',
                    '1 saate kadar bekleme ücretsiz',
                    'Tam kasko araçlar',
                    'Profesyonel & tecrübeli şoförler',
                    'İptal: 24 saat öncesine kadar ücretsiz',
                  ].map(item => (
                    <li key={item} className={styles.guaranteeItem}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px', color: 'var(--color-success)', flexShrink: 0 }}>check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.ratingCard}>
                <div className={styles.ratingStars}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined icon-filled" style={{ fontSize: '20px', color: '#f59e0b' }}>star</span>
                  ))}
                </div>
                <p className={styles.ratingScore}>4.98 / 5.0</p>
                <p className={styles.ratingCount}>847 değerlendirme</p>
                <p className={styles.ratingQuote}>&ldquo;Havalimanında bizi güler yüzle karşıladılar. Araç muhteşemdi, şoför çok kibardı. Kesinlikle tekrar tercih edeceğiz.&rdquo;</p>
                <p className={styles.ratingAuthor}>— Selin D., Bodrum Transfer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SSS ───────────────────────────────────────────── */}
      <section className={`section-padding ${styles.faqSection}`}>
        <div className="container">
          <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <p className={styles.eyebrow} style={{ justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>help</span>
              Sıkça Sorulan Sorular
            </p>
            <h2 className={styles.sectionTitle}>Merak Ettikleriniz</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                <button className={styles.faqBtn} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className={styles.faqQ}>{faq.q}</span>
                  <span className={`material-symbols-outlined ${styles.faqChevron}`} style={{ fontSize: '20px' }}>
                    {openFaq === i ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBanner}>
            <div>
              <h2 className={styles.ctaTitle}>Seyahatinizi Planlayın</h2>
              <p className={styles.ctaDesc}>WhatsApp veya telefon ile 7/24 ulaşın, anında fiyat alın.</p>
            </div>
            <div className={styles.ctaBtns}>
              <a href="#rezervasyon" className="btn btn-primary btn-lg">
                <span className="material-symbols-outlined">calendar_add_on</span>
                Rezervasyon Yap
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={styles.ctaWaBtn}>
                <span className="material-symbols-outlined icon-filled">chat</span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
