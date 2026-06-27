'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { CustomerProfile } from '@/types/database';
import styles from './panel.module.css';

const navItems = [
  { href: '/hesabim/panel', icon: 'dashboard', label: 'Genel Bakış', exact: true },
  { href: '/hesabim/panel/rezervasyonlar', icon: 'confirmation_number', label: 'Rezervasyonlarım' },
  { href: '/hesabim/panel/transferler', icon: 'airport_shuttle', label: 'Transfer Talepleri' },
  { href: '/hesabim/panel/kartlar', icon: 'credit_card', label: 'Kayıtlı Kartlar' },
  { href: '/hesabim/panel/profil', icon: 'person', label: 'Profil & Ayarlar' },
];

const titles: Record<string, string> = {
  '/hesabim/panel': 'Genel Bakış',
  '/hesabim/panel/rezervasyonlar': 'Rezervasyonlarım',
  '/hesabim/panel/transferler': 'Transfer Talepleri',
  '/hesabim/panel/kartlar': 'Kayıtlı Kartlar',
  '/hesabim/panel/profil': 'Profil & Ayarlar',
};

export default function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    fetch('/api/customer/me')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setProfile(data.profile);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/customer/logout', { method: 'POST' });
    router.push('/hesabim/giris');
    router.refresh();
  };

  const pageTitle = titles[pathname] ||
    (pathname.includes('/rezervasyonlar/') ? 'Rezervasyon Detayı' : 'Hesabım');

  return (
    <div className={styles.app}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHead}>
          <div className={styles.logoRow}>
            <div className={styles.logoMark}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'white', fontSize: '22px' }}>villa</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>RCetinkaya</p>
              <p style={{ fontSize: '10px', color: 'var(--color-secondary)' }}>Müşteri Paneli</p>
            </div>
          </div>
          {profile && (
            <div className={styles.userBlock}>
              <p className={styles.userName}>{profile.firstName} {profile.lastName}</p>
              <p className={styles.userEmail}>{profile.email}</p>
            </div>
          )}
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sideFooter}>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            Çıkış Yap
          </button>
          <Link href="/" className={styles.siteLink}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
            Siteye Dön
          </Link>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button type="button" className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
        </header>
        <div className={styles.content}>{children}</div>
      </div>

      {sidebarOpen && <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
