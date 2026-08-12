'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBar.module.css';
import { getTodayString, addDays } from '@/lib/utils';

interface Region {
  id: string;
  name: string;
}

export default function SearchBar() {
  const router = useRouter();
  const today = getTodayString();
  const [regions, setRegions] = useState<Region[]>([]);
  const [region, setRegion] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    fetch('/api/regions')
      .then(r => r.json())
      .then(data => setRegions(data.regions || []))
      .catch(() => setRegions([]));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (region) params.set('region', region);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    router.push(`/villalar?${params.toString()}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div className={styles.field}>
          <label className={styles.label}>Nereye?</label>
          <div className={styles.inputWrap}>
            <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'20px'}}>location_on</span>
            <select
              className={styles.select}
              value={region}
              onChange={e => setRegion(e.target.value)}
            >
              <option value="">Tüm Bölgeler</option>
              {regions.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="search-checkin">Giriş Tarihi</label>
          <div className={styles.inputWrap}>
            <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'20px'}} aria-hidden>calendar_today</span>
            <input
              id="search-checkin"
              type="date"
              className={styles.dateInput}
              value={checkIn}
              min={today}
              onChange={e => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value >= checkOut) {
                  setCheckOut(addDays(e.target.value, 3));
                }
              }}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="search-checkout">Çıkış Tarihi</label>
          <div className={styles.inputWrap}>
            <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'20px'}} aria-hidden>calendar_month</span>
            <input
              id="search-checkout"
              type="date"
              className={styles.dateInput}
              value={checkOut}
              min={checkIn || addDays(today, 1)}
              onChange={e => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.field}>
          <label className={styles.label}>Kişi Sayısı</label>
          <div className={styles.inputWrap}>
            <span className="material-symbols-outlined" style={{color:'var(--color-primary)', fontSize:'20px'}}>group</span>
            <select
              className={styles.select}
              value={guests}
              onChange={e => setGuests(e.target.value)}
            >
              {[1,2,3,4,5,6,7,8,9,10,12].map(n => (
                <option key={n} value={n}>{n} Misafir</option>
              ))}
            </select>
          </div>
        </div>

        <button className={styles.searchBtn} onClick={handleSearch}>
          <span className="material-symbols-outlined" style={{fontSize:'22px'}}>search</span>
          <span className={styles.searchLabel}>Villa Ara</span>
        </button>
      </div>
    </div>
  );
}
