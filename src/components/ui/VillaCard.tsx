'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Villa } from '@/types/database';
import { formatPriceShort } from '@/lib/utils';
import styles from './VillaCard.module.css';

interface VillaCardProps {
  villa: Villa;
  index?: number;
}

export default function VillaCard({ villa, index = 0 }: VillaCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image Container */}
      <div className={styles.imageWrap}>
        <Link href={`/villa/${villa.slug}`} className={styles.imageLink}>
          <Image
            src={imgError || !villa.images[0] ? '/og-image.svg' : villa.images[0]}
            alt={villa.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={styles.image}
            onError={() => setImgError(true)}
          />
        </Link>

        {/* Tags */}
        {villa.tags[0] && (
          <div className={styles.tag}>
            {villa.tags[0]}
          </div>
        )}

        {/* Favorite Button */}
        <button
          className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        >
          <span className={`material-symbols-outlined ${isFavorite ? 'icon-filled' : ''}`}>
            favorite
          </span>
        </button>
      </div>

      {/* Info */}
      <Link href={`/villa/${villa.slug}`} className={styles.info}>
        {/* Location */}
        <p className={styles.location}>
          <span className="material-symbols-outlined" style={{fontSize:'14px'}}>location_on</span>
          {villa.location}
        </p>

        {/* Title */}
        <h3 className={styles.title}>{villa.name}</h3>

        {/* Stats */}
        <div className={styles.stats}>
          <span className={styles.stat}>
            <span className="material-symbols-outlined" style={{fontSize:'14px'}}>group</span>
            {villa.maxGuests} kişi
          </span>
          <span className={styles.dot}>·</span>
          <span className={styles.stat}>
            <span className="material-symbols-outlined" style={{fontSize:'14px'}}>bed</span>
            {villa.bedrooms} yatak
          </span>
          <span className={styles.dot}>·</span>
          <span className={styles.stat}>
            <span className="material-symbols-outlined" style={{fontSize:'14px'}}>bathtub</span>
            {villa.bathrooms} banyo
          </span>
        </div>

        {/* Price + Rating */}
        <div className={styles.bottom}>
          <div className={styles.price}>
            <span className={styles.priceAmount}>{formatPriceShort(villa.pricePerNight)}</span>
            <span className={styles.priceLabel}> / gece</span>
          </div>
          <div className={styles.rating}>
            <span className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'#f59e0b'}}>star</span>
            <span className={styles.ratingValue}>{villa.rating}</span>
            <span className={styles.ratingCount}>({villa.reviewCount})</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
