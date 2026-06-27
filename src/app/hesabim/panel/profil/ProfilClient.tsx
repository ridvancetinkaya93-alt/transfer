'use client';
import { useEffect, useState } from 'react';
import type { CustomerProfile } from '@/types/database';
import styles from '../panel.module.css';

export default function ProfilClient() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/customer/me')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setProfile(data.profile);
          setFirstName(data.profile.firstName);
          setLastName(data.profile.lastName);
          setPhone(data.profile.phone || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone: phone || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Güncelleme başarısız.');
        return;
      }

      setProfile(data.profile);
      setMessage('Profiliniz güncellendi.');
    } catch {
      setError('Bağlantı hatası. Tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--color-secondary)' }}>Yükleniyor...</p>;

  return (
    <div className={styles.detailGrid}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Kişisel Bilgiler</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.formGrid}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginBottom: '6px' }}>Ad</label>
              <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginBottom: '6px' }}>Soyad</label>
              <input className="input" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginBottom: '6px' }}>Telefon</label>
              <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="05XX XXX XX XX" />
            </div>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginBottom: '6px' }}>E-posta</label>
              <input className="input" type="email" value={profile?.email || ''} disabled style={{ opacity: 0.7 }} />
            </div>
          </div>
          {error && <p style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)' }}>{error}</p>}
          {message && <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)' }}>{message}</p>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }} disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Hesap Bilgileri</h2>
        </div>
        <div className={styles.formCard}>
          <div className={styles.infoRows}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Hesap ID</span>
              <span className={styles.infoValue} style={{ fontSize: 'var(--text-xs)' }}>{profile?.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Kayıt Tarihi</span>
              <span className={styles.infoValue}>
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)', marginTop: 'var(--space-6)', lineHeight: 1.6 }}>
            E-posta adresiniz giriş için kullanılır ve değiştirilemez. Geçmiş rezervasyonlarınız kayıt sırasında e-posta eşleşmesiyle hesabınıza bağlanır.
          </p>
        </div>
      </div>
    </div>
  );
}
