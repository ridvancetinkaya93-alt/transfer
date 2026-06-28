'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Geçersiz kullanıcı adı veya şifre.');
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Background */}
      <div className={styles.bg} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <span className="material-symbols-outlined icon-filled" style={{fontSize:'28px', color:'white'}}>villa</span>
          </div>
          <div>
            <h1 className={styles.brandName}>RCetinkaya Turizm</h1>
            <p className={styles.brandSub}>Admin Paneli</p>
          </div>
        </div>

        <div className={styles.divider} />

        <h2 className={styles.title}>Giriş Yap</h2>
        <p className={styles.subtitle}>
          Supabase hesabınızla giriş yapın. Admin yetkisi için <code>profiles.is_admin = true</code> gerekir.
        </p>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && (
            <div className={styles.errorBox}>
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>error</span>
              {error}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>E-posta Adresi</label>
            <div className={styles.inputWrap}>
              <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'20px'}}>mail</span>
              <input
                type="email"
                className="input"
                placeholder="admin@rcetinkayaturizm.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Şifre</label>
            <div className={styles.inputWrap}>
              <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'20px'}}>lock</span>
              <input
                type={showPass ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(!showPass)}
              >
                <span className="material-symbols-outlined" style={{fontSize:'18px'}}>
                  {showPass ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-full btn-lg ${styles.loginBtn}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Giriş Yapılıyor...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined icon-filled">login</span>
                Giriş Yap
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <span className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'var(--color-success)'}}>verified_user</span>
          Güvenli admin girişi
        </div>
      </div>
    </main>
  );
}
