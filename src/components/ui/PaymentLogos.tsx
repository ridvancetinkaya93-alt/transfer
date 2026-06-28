import styles from './PaymentLogos.module.css';

interface Props {
  variant?: 'footer' | 'payment';
  showIyzico?: boolean;
}

export default function PaymentLogos({ variant = 'footer', showIyzico = true }: Props) {
  const className = variant === 'payment' ? styles.paymentPage : styles.footer;

  return (
    <div className={className}>
      {showIyzico && (
        <span className={styles.iyzicoBadge} aria-label="iyzico ile Öde">
          <svg viewBox="0 0 120 32" className={styles.iyzicoSvg} role="img" aria-hidden="true">
            <rect x="0" y="0" width="120" height="32" rx="6" fill="#1DBF73" />
            <text x="14" y="21" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="700">iyzico</text>
            <text x="68" y="21" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="600" opacity="0.95">ile Öde</text>
          </svg>
        </span>
      )}

      <span className={styles.visaBadge} aria-label="Visa">
        <svg viewBox="0 0 60 20" className={styles.visaSvg} role="img" aria-hidden="true">
          <rect width="60" height="20" rx="3" fill="#1A1F71" />
          <path fill="#fff" d="M24.5 14.5h-2.8L25.2 5.5h2.8l-2.5 9zm8.5-6.5c-.6-.2-1.5-.5-2.6-.5-2.9 0-5 1.5-5 3.7 0 1.6 1.4 2.5 2.6 3.1 1.1.6 1.6.9 1.6 1.4 0 .7-.9 1.1-1.8 1.1-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.6c.7.3 1.9.6 3.2.6 3.1 0 5.1-1.6 5.1-4 0-1.3-.8-2.3-2.6-3.1-1.1-.6-1.7-.9-1.7-1.5 0-.5.6-1 1.8-1 1.1 0 1.8.2 2.4.5l.2.1.4-2.6zm7.8-.3h-2.1c-.7 0-1.2.2-1.5.8l-4.1 9.5h2.9l.6-1.6h3.6l.3 1.6h2.6l-3.4-9.3zm-3.1 6.1c.2-.7 1.2-3.2 1.2-3.2-.1.1.2-.7.4-1.1l.2 1s.6 2.9.7 3.3h-2.5zM20.5 5.5l-2.8 8.8-.3-1.6c-.6-1.9-2.4-4-4.5-5l2.5 9.5h2.9L21.5 5.5h-1z" />
          <path fill="#F7A600" d="M9.2 5.5H5.8L5.7 5.8c3.1.8 5.6 3.1 6.8 5.8l-1.3-5.5c-.3-.4-.7-.6-1.6-.6z" />
        </svg>
      </span>

      <span className={styles.mcBadge} aria-label="Mastercard">
        <svg viewBox="0 0 44 28" className={styles.mcSvg} role="img" aria-hidden="true">
          <rect width="44" height="28" rx="4" fill="#252525" />
          <circle cx="17" cy="14" r="8" fill="#EB001B" />
          <circle cx="27" cy="14" r="8" fill="#F79E1B" />
          <path d="M22 7.5a8 8 0 0 0 0 13 8 8 0 0 0 0-13z" fill="#FF5F00" />
        </svg>
      </span>
    </div>
  );
}
