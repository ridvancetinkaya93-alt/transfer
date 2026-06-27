'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import VillaCard from '@/components/ui/VillaCard';
import type { Villa } from '@/types/database';
import styles from './page.module.css';

const regionLabels: Record<string, string> = {
  fethiye: 'Fethiye',
  bodrum: 'Bodrum',
  antalya: 'Antalya',
  kalkan: 'Kalkan',
  kas: 'Kaş',
  izmir: 'İzmir',
};

type SortOption = 'recommended' | 'price_asc' | 'price_desc' | 'rating';

export default function VillalarClient() {
  const searchParams = useSearchParams();
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [maxGuests, setMaxGuests] = useState(Number(searchParams.get('guests')) || 0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [hasPool, setHasPool] = useState(false);
  const [hasSeaView, setHasSeaView] = useState(false);
  const [sort, setSort] = useState<SortOption>('recommended');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadVillas() {
      try {
        const params = new URLSearchParams();
        if (region) params.set('region', region);
        if (maxGuests > 0) params.set('guests', String(maxGuests));
        const urlCheckIn = searchParams.get('checkIn');
        const urlCheckOut = searchParams.get('checkOut');
        const feature = searchParams.get('feature');
        if (urlCheckIn) params.set('checkIn', urlCheckIn);
        if (urlCheckOut) params.set('checkOut', urlCheckOut);
        if (feature) params.set('feature', feature);

        const res = await fetch(`/api/villas?${params}`);
        const data = await res.json();
        setVillas(data.villas || []);
      } catch {
        setVillas([]);
      } finally {
        setLoading(false);
      }
    }
    loadVillas();
  }, [searchParams, region, maxGuests]);

  const filtered = useMemo(() => {
    let result = [...villas];

    if (region) result = result.filter(v => v.region === region);
    if (maxGuests > 0) result = result.filter(v => v.maxGuests >= maxGuests);
    if (minPrice > 0) result = result.filter(v => v.pricePerNight >= minPrice);
    if (maxPrice < 25000) result = result.filter(v => v.pricePerNight <= maxPrice);
    if (hasPool) result = result.filter(v => v.amenities.some(a => a.icon === 'pool'));
    if (hasSeaView) result = result.filter(v => v.features.some(f => f.toLowerCase().includes('deniz')));

    result.sort((a, b) => {
      if (sort === 'price_asc') return a.pricePerNight - b.pricePerNight;
      if (sort === 'price_desc') return b.pricePerNight - a.pricePerNight;
      if (sort === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

    return result;
  }, [villas, region, maxGuests, minPrice, maxPrice, hasPool, hasSeaView, sort]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className="container">
            <h1 className={styles.pageTitle}>Lüks Villalar</h1>
          </div>
        </div>
        <div className="container" style={{ padding: 'var(--space-16)', textAlign: 'center', color: 'var(--color-secondary)' }}>
          Villalar yükleniyor...
        </div>
      </div>
    );
  }

  const resetFilters = () => {
    setRegion('');
    setMaxGuests(0);
    setMinPrice(0);
    setMaxPrice(25000);
    setHasPool(false);
    setHasSeaView(false);
  };

  const hasActiveFilters = region || maxGuests > 0 || minPrice > 0 || maxPrice < 25000 || hasPool || hasSeaView;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Lüks Villalar</h1>
          <p className={styles.pageDesc}>
            Türkiye'nin en özel villalarını keşfedin
            {region && ` — ${regionLabels[region] || region}`}
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          {/* Left: Quick Filters */}
          <div className={styles.quickFilters}>
            {/* Region Pills */}
            <div className={styles.regionPills}>
              <button
                className={`${styles.pill} ${!region ? styles.pillActive : ''}`}
                onClick={() => setRegion('')}
              >
                Tümü
              </button>
              {Object.entries(regionLabels).map(([key, label]) => (
                <button
                  key={key}
                  className={`${styles.pill} ${region === key ? styles.pillActive : ''}`}
                  onClick={() => setRegion(key === region ? '' : key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sort + View + Filter Button */}
          <div className={styles.filterActions}>
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
            >
              <option value="recommended">Önerilen</option>
              <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="rating">En Yüksek Puan</option>
            </select>

            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid görünüm"
              >
                <span className="material-symbols-outlined" style={{fontSize:'20px'}}>grid_view</span>
              </button>
              <button
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="Liste görünüm"
              >
                <span className="material-symbols-outlined" style={{fontSize:'20px'}}>view_list</span>
              </button>
            </div>

            <button
              className={`${styles.filterBtn} ${hasActiveFilters ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterOpen(true)}
            >
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>tune</span>
              Filtrele
              {hasActiveFilters && <span className={styles.filterDot} />}
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className={styles.resultsSummary}>
          <span className={styles.resultsCount}>
            <strong>{filtered.length}</strong> villa bulundu
          </span>
          {hasActiveFilters && (
            <button className={styles.resetBtn} onClick={resetFilters}>
              Filtreleri Temizle
              <span className="material-symbols-outlined" style={{fontSize:'16px'}}>close</span>
            </button>
          )}
        </div>

        {/* Villa Grid */}
        {filtered.length > 0 ? (
          <div className={viewMode === 'grid' ? styles.villaGrid : styles.villaList}>
            {filtered.map((villa, i) => (
              <VillaCard key={villa.id} villa={villa} index={i} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <span className="material-symbols-outlined" style={{fontSize:'48px', color:'var(--color-outline-variant)'}}>search_off</span>
            </div>
            <h3 className={styles.emptyTitle}>Sonuç Bulunamadı</h3>
            <p className={styles.emptyDesc}>Seçtiğiniz kriterlere uygun villa bulunamadı. Filtreleri değiştirmeyi deneyin.</p>
            <button className="btn btn-primary" onClick={resetFilters}>
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* Filter Drawer (Mobile) */}
      {filterOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setFilterOpen(false)} />
          <div className={styles.filterDrawer}>
            <div className={styles.drawerHead}>
              <h3 className={styles.drawerTitle}>Filtrele</h3>
              <button className={styles.closeBtn} onClick={() => setFilterOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Bölge */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Bölge</label>
                <select className="input" value={region} onChange={e => setRegion(e.target.value)}>
                  <option value="">Tüm Bölgeler</option>
                  {Object.entries(regionLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Kişi Sayısı */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Minimum Kişi Kapasitesi</label>
                <select className="input" value={maxGuests} onChange={e => setMaxGuests(Number(e.target.value))}>
                  <option value={0}>Farketmez</option>
                  {[2,4,6,8,10,12].map(n => (
                    <option key={n} value={n}>{n}+ Kişi</option>
                  ))}
                </select>
              </div>

              {/* Fiyat */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Fiyat Aralığı (gecelik)</label>
                <div className={styles.priceRange}>
                  <div className={styles.priceInput}>
                    <span className={styles.priceCurrency}>₺</span>
                    <input
                      type="number"
                      className="input"
                      placeholder="Min"
                      value={minPrice || ''}
                      onChange={e => setMinPrice(Number(e.target.value))}
                    />
                  </div>
                  <span>—</span>
                  <div className={styles.priceInput}>
                    <span className={styles.priceCurrency}>₺</span>
                    <input
                      type="number"
                      className="input"
                      placeholder="Max"
                      value={maxPrice < 25000 ? maxPrice : ''}
                      onChange={e => setMaxPrice(Number(e.target.value) || 25000)}
                    />
                  </div>
                </div>
              </div>

              {/* Özellikler */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Özellikler</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={hasPool}
                      onChange={e => setHasPool(e.target.checked)}
                    />
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>pool</span>
                    Özel Havuz
                  </label>
                  <label className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={hasSeaView}
                      onChange={e => setHasSeaView(e.target.checked)}
                    />
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>waves</span>
                    Deniz Manzarası
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button className="btn btn-secondary btn-full" onClick={resetFilters}>
                Temizle
              </button>
              <button className="btn btn-primary btn-full" onClick={() => setFilterOpen(false)}>
                Uygula ({filtered.length} villa)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
