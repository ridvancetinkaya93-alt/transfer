'use client';
import { useEffect, useState } from 'react';
import type { SavedCard } from '@/types/database';
import styles from '../panel.module.css';

export default function KartlarClient() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadCards = () => {
    fetch('/api/customer/cards')
      .then(res => res.json())
      .then(data => setCards(data.cards || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch('/api/customer/cards', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCards(prev => prev.filter(c => c.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <p style={{ color: 'var(--color-secondary)' }}>Yükleniyor...</p>;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Kayıtlı Kartlar</h2>
        <span className={styles.badge}>{cards.length} kart</span>
      </div>
      {cards.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>credit_card</span>
          </div>
          <p>Kayıtlı kartınız bulunmuyor.</p>
          <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)', maxWidth: '360px', margin: 'var(--space-2) auto 0' }}>
            Ödeme sırasında &quot;kartı kaydet&quot; seçeneğini işaretleyerek kart ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <>
          {cards.map(card => (
            <div key={card.id} className={styles.cardRow}>
              <div className={styles.cardBrand}>
                <div className={styles.cardIcon}>{card.cardBrand?.slice(0, 4).toUpperCase() || 'KART'}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                    {card.cardAlias || 'Kartım'} · •••• {card.lastFour}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>
                    {card.isDefault ? 'Varsayılan kart' : 'Kayıtlı kart'}
                    {card.createdAt && ` · ${new Date(card.createdAt).toLocaleDateString('tr-TR')}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDelete(card.id)}
                disabled={deleting === card.id}
              >
                {deleting === card.id ? 'Siliniyor...' : 'Kaldır'}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
