'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function GirisClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Giriş başarısız.');
        return;
      }

      const redirect = searchParams.get('redirect') || '/hesabim/panel';
      router.push(redirect);
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
            <span className="material-symbols-outlined icon-filled" style={{ color: 'white', fontSize: '26px' }}>person</span>
          </div>
          <div>
            <p className={styles.brandName}>RCetinkaya Turizm</p>
            <p className={styles.brandSub}>Müşteri Hesabı</p>
          </div>
        </div>

        <h1 className={styles.title}>Hoş Geldiniz</h1>
        <p className={styles.subtitle}>Rezervasyonlarınızı yönetin, transfer taleplerinizi takip edin.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>E-posta</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" required />
          </div>
          <div className={styles.field}>
            <label>Şifre</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className={styles.footerLink}>
          Hesabınız yok mu? <Link href="/hesabim/kayit">Kayıt olun</Link>
        </p>
      </div>
    </main>
  );
}
