'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig, telLink, whatsappLink } from '@/lib/site-config';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/villalar', label: 'Villalar' },
  { href: '/vip-transfer', label: 'VIP Transfer' },
  { href: '/rezervasyon-takibi', label: 'Rezervasyon Takibi' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/customer/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setAuthenticated(Boolean(data?.authenticated)))
      .catch(() => setAuthenticated(false));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <span className="material-symbols-outlined icon-filled">villa</span>
            </span>
            <span className={styles.logoText}>RCetinkaya<span className={styles.logoBold}> Turizm</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className={styles.actions}>
            <Link
              href={authenticated ? '/hesabim/panel' : '/hesabim/giris'}
              className={styles.accountBtn}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
              {authenticated ? 'Hesabım' : 'Giriş'}
            </Link>
            <Link href="/villalar" className={`btn btn-primary ${styles.ctaBtn}`}>
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>search</span>
              Villa Ara
            </Link>
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menüyü Aç"
            >
              <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
              <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
              <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <span className={styles.logoText}>RCetinkaya<span className={styles.logoBold}> Turizm</span></span>
          </Link>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className={styles.drawerNav}>
          <Link
            href={authenticated ? '/hesabim/panel' : '/hesabim/giris'}
            className={`${styles.drawerLink} ${pathname.startsWith('/hesabim') ? styles.drawerLinkActive : ''}`}
            style={{ animationDelay: '0ms' }}
            onClick={() => setMenuOpen(false)}
          >
            {authenticated ? 'Hesabım' : 'Giriş Yap'}
            <span className="material-symbols-outlined" style={{fontSize:'18px', color:'var(--color-primary)'}}>chevron_right</span>
          </Link>
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.drawerLink} ${pathname === link.href ? styles.drawerLinkActive : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <span className="material-symbols-outlined" style={{fontSize:'18px', color:'var(--color-primary)'}}>chevron_right</span>
            </Link>
          ))}
        </nav>
        <div className={styles.drawerFooter}>
          <Link href="/villalar" className="btn btn-primary btn-full btn-lg" onClick={() => setMenuOpen(false)}>
            <span className="material-symbols-outlined">search</span>
            Villa Ara
          </Link>
          <div className={styles.drawerContacts}>
            <a href={telLink()} className={styles.contactItem}>
              <span className="material-symbols-outlined icon-filled" style={{color:'var(--color-primary)'}}>call</span>
              {siteConfig.phoneDisplay}
            </a>
            <a href={whatsappLink()} className={styles.contactItem}>
              <span className="material-symbols-outlined icon-filled" style={{color:'#25D366'}}>chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
