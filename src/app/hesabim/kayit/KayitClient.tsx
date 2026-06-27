'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function KayitClient() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Kayıt başarısız.');
        return;
      }

      router.push('/hesabim/panel');
      router.refresh();
    } catch {
      setError('Bağlantı hatası. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <span className="material-symbols-outlined icon-filled" style={{ color: 'white', fontSize: '26px' }}>person_add</span>
          </div>
          <div>
            <p className={styles.brandName}>RCetinkaya Turizm</p>
            <p className={styles.brandSub}>Ücretsiz Hesap</p>
          </div>
        </div>

        <h1 className={styles.title}>Hesap Oluştur</h1>
        <p className={styles.subtitle}>Geçmiş rezervasyonlarınız otomatik hesabınıza bağlanır.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Ad</label>
              <input className="input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div className={styles.field}>
              <label>Soyad</label>
              <input className="input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
            </div>
          </div>
          <div className={styles.field}>
            <label>E-posta</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>Telefon</label>
            <input className="input" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+90 5XX XXX XX XX" required />
          </div>
          <div className={styles.field}>
            <label>Şifre</label>
            <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="En az 8 karakter" required minLength={8} />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <span className="material-symbols-outlined icon-filled">confirmation_number</span>
            Tüm rezervasyonlarınız tek panelde
          </div>
          <div className={styles.benefit}>
            <span className="material-symbols-outlined icon-filled">payments</span>
            Ödeme durumu ve timeline takibi
          </div>
          <div className={styles.benefit}>
            <span className="material-symbols-outlined icon-filled">airport_shuttle</span>
            VIP transfer talepleri
          </div>
        </div>

        <p className={styles.footerLink}>
          Zaten hesabınız var? <Link href="/hesabim/giris">Giriş yapın</Link>
        </p>
      </div>
    </main>
  );
}
