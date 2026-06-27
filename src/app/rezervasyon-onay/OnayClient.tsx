'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatPriceShort } from '@/lib/utils';
import { whatsappLink } from '@/lib/site-config';
import styles from './page.module.css';

export default function OnayClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || 'RCT-XXXXXXXX';
  const total = Number(searchParams.get('total')) || 0;
  const email = searchParams.get('email') || '';
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    fetch('/api/customer/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setAuthenticated(Boolean(data?.authenticated)))
      .catch(() => {});
    return () => clearTimeout(timer);
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const trackingHref = email
    ? `/rezervasyon-takibi?code=${code}&email=${encodeURIComponent(email)}`
    : `/rezervasyon-takibi?code=${code}`;

  return (
    <main className={styles.main}>
      {visible && (
        <div className={styles.confettiWrap} aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={styles.confetti}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                background: ['#ba0036', '#f59e0b', '#006a45', '#e21e4a', '#ffb2b6'][i % 5],
              }}
            />
          ))}
        </div>
      )}

      <div className={styles.content}>
        <div className={`${styles.checkCircle} ${visible ? styles.checkVisible : ''}`}>
          <svg viewBox="0 0 52 52" className={styles.checkSvg}>
            <circle cx="26" cy="26" r="25" fill="none" stroke="white" strokeWidth="2" />
            <path
              d="M14 26 L22 34 L38 18"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={visible ? styles.checkPath : ''}
            />
          </svg>
        </div>

        <div className={`${styles.textContent} ${visible ? styles.textVisible : ''}`}>
          <h1 className={styles.title}>Rezervasyonunuz Onaylandı!</h1>
          <p className={styles.subtitle}>
            Ödemeniz başarıyla alındı. Rezervasyon detayları e-posta adresinize gönderildi.
          </p>
        </div>

        <div className={`${styles.codeCard} ${visible ? styles.codeVisible : ''}`}>
          <p className={styles.codeLabel}>Rezervasyon Kodunuz</p>
          <div className={styles.codeDisplay}>{code}</div>
          <button type="button" className={styles.copyBtn} onClick={copyCode}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Kopyalandı!' : 'Kodu Kopyala'}
          </button>
          <p className={styles.codeNote}>Bu kodu kaydedin — rezervasyon takibi için kullanacaksınız.</p>
        </div>

        {total > 0 && (
          <div className={`${styles.totalCard} ${visible ? styles.totalVisible : ''}`}>
            <span className={styles.totalLabel}>Ödenen Tutar</span>
            <span className={styles.totalAmount}>{formatPriceShort(total)}</span>
          </div>
        )}

        <div className={`${styles.actions} ${visible ? styles.actionsVisible : ''}`}>
          {authenticated ? (
            <Link href="/hesabim/panel/rezervasyonlar" className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">dashboard</span>
              Müşteri Paneline Git
            </Link>
          ) : (
            <Link href={trackingHref} className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">confirmation_number</span>
              Rezervasyonu Takip Et
            </Link>
          )}
          <Link href="/" className="btn btn-secondary btn-lg">
            <span className="material-symbols-outlined">home</span>
            Ana Sayfaya Dön
          </Link>
          <a
            href={whatsappLink(`Rezervasyon kodum: ${code}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-lg"
          >
            <span className="material-symbols-outlined icon-filled" style={{color:'#25D366'}}>chat</span>
            WhatsApp&apos;ta Paylaş
          </a>
        </div>
      </div>
    </main>
  );
}
