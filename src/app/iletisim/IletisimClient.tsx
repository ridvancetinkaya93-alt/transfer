'use client';
import { useState } from 'react';
import { siteConfig, telLink, whatsappLink } from '@/lib/site-config';
import styles from './page.module.css';

export default function IletisimClient() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Genel Bilgi',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Mesaj gönderilemedi.');
        return;
      }

      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: 'Genel Bilgi', message: '' });
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>mail</span>
            İletişim
          </p>
          <h1 className={styles.title}>Bize Ulaşın</h1>
          <p className={styles.desc}>
            Villa kiralama, VIP transfer veya özel organizasyon talepleriniz için ekibimiz size yardımcı olmaktan mutluluk duyar.
          </p>
        </div>
      </section>

      <div className="container">
        <div className={styles.grid}>
          <div className={styles.formCard}>
            {success ? (
              <div className={styles.successBox}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '48px', color: 'var(--color-success)' }}>
                  check_circle
                </span>
                <h2>Mesajınız İletildi</h2>
                <p>En kısa sürede size dönüş yapacağız.</p>
                <button className="btn btn-secondary" onClick={() => setSuccess(false)}>
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.formTitle}>İletişim Formu</h2>

                {error && (
                  <div className={styles.errorBox}>
                    <span className="material-symbols-outlined">error</span>
                    {error}
                  </div>
                )}

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Ad Soyad</label>
                    <input className="input" required value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Adınız Soyadınız" />
                  </div>
                  <div className={styles.field}>
                    <label>E-posta</label>
                    <input type="email" className="input" required value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ornek@email.com" />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Telefon</label>
                    <input type="tel" className="input" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+90 5XX XXX XX XX" />
                  </div>
                  <div className={styles.field}>
                    <label>Konu</label>
                    <select className="input" value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option>Genel Bilgi</option>
                      <option>Villa Kiralama</option>
                      <option>VIP Transfer</option>
                      <option>Rezervasyon İptali</option>
                      <option>Özel Organizasyon</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Mesajınız</label>
                  <textarea className="input" required rows={5} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Mesajınızı buraya yazın..." style={{ resize: 'none' }} />
                </div>

                <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                  {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            )}
          </div>

          <aside className={styles.side}>
            <div className={styles.contactCard}>
              <h3>Doğrudan İletişim</h3>
              <a href={telLink()} className={styles.contactItem}>
                <span className="material-symbols-outlined icon-filled">call</span>
                <div>
                  <span>Telefon</span>
                  <strong>{siteConfig.phoneDisplay}</strong>
                </div>
              </a>
              <a href={`mailto:${siteConfig.email}`} className={styles.contactItem}>
                <span className="material-symbols-outlined icon-filled">mail</span>
                <div>
                  <span>E-posta</span>
                  <strong>{siteConfig.email}</strong>
                </div>
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <span className="material-symbols-outlined icon-filled" style={{ color: '#25D366' }}>chat</span>
                <div>
                  <span>WhatsApp</span>
                  <strong>7/24 Anlık Yanıt</strong>
                </div>
              </a>
              <div className={styles.contactItem}>
                <span className="material-symbols-outlined icon-filled">location_on</span>
                <div>
                  <span>Adres</span>
                  <strong>Fethiye, Muğla / Türkiye</strong>
                </div>
              </div>
            </div>

            <div className={styles.hoursCard}>
              <h3>Çalışma Saatleri</h3>
              <p>Pazartesi – Pazar: 09:00 – 22:00</p>
              <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>Acil durumlar için 7/24 WhatsApp</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
