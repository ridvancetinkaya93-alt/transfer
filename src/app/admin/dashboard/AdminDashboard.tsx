'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPriceShort } from '@/lib/utils';
import type { Reservation, TransferRequest, ContactMessage, ReservationStatus, TransferStatus } from '@/types/database';
import styles from './page.module.css';

const transferStatusMap = {
  new: { label: 'Yeni', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
  contacted: { label: 'İletişimde', color: 'var(--color-secondary)', bg: 'var(--color-surface-low)' },
  confirmed: { label: 'Onaylı', color: 'var(--color-success)', bg: 'rgba(0,106,69,0.08)' },
  cancelled: { label: 'İptal', color: 'var(--color-primary)', bg: 'rgba(186,0,54,0.08)' },
};

const reservationStatuses: ReservationStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
const transferStatuses: TransferStatus[] = ['new', 'contacted', 'confirmed', 'cancelled'];

const statusMap = {
  confirmed: { label: 'Onaylı', color: 'var(--color-success)', bg: 'rgba(0,106,69,0.08)' },
  pending: { label: 'Beklemede', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
  completed: { label: 'Tamamlandı', color: 'var(--color-secondary)', bg: 'var(--color-surface-low)' },
  cancelled: { label: 'İptal', color: 'var(--color-primary)', bg: 'rgba(186,0,54,0.08)' },
};

const navItems = [
  { id: 'dashboard', icon: 'dashboard', label: 'Gösterge Paneli' },
  { id: 'reservations', icon: 'confirmation_number', label: 'Rezervasyonlar' },
  { id: 'transfers', icon: 'airport_shuttle', label: 'Transfer Talepleri' },
  { id: 'contacts', icon: 'mail', label: 'İletişim Mesajları' },
  { id: 'villas', icon: 'villa', label: 'Villalar' },
];

interface AdminVilla {
  id: string;
  slug: string;
  name: string;
  location: string;
  bedrooms: number;
  maxGuests: number;
  pricePerNight: number;
  rating: number;
  images: string[];
}

interface Stats {
  villaCount: number;
  confirmedCount: number;
  pendingCount: number;
  totalRevenue: number;
  avgRating: string;
  reservationCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [villas, setVillas] = useState<AdminVilla[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resRes, villaRes, statsRes, transferRes, contactRes] = await Promise.all([
          fetch('/api/admin/reservations'),
          fetch('/api/villas'),
          fetch('/api/admin/stats'),
          fetch('/api/admin/transfers'),
          fetch('/api/admin/contacts'),
        ]);
        if (resRes.status === 401) {
          router.push('/admin/login');
          return;
        }
        const resData = await resRes.json();
        const villaData = await villaRes.json();
        const statsData = await statsRes.json();
        const transferData = await transferRes.json();
        const contactData = await contactRes.json();
        setReservations(resData.reservations || []);
        setTransfers(transferData.transfers || []);
        setContacts(contactData.messages || []);
        setVillas(villaData.villas || []);
        setStats(statsData.stats || null);
      } catch {
        console.error('Admin data load failed');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleReservationStatus = async (id: string, status: ReservationStatus) => {
    const res = await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const data = await res.json();
      setReservations(prev => prev.map(r => r.id === id ? data.reservation : r));
    }
  };

  const handleTransferStatus = async (id: string, status: TransferStatus) => {
    const res = await fetch('/api/admin/transfers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const data = await res.json();
      setTransfers(prev => prev.map(t => t.id === id ? data.transfer : t));
    }
  };

  const tableReservations = reservations.map(r => ({
    id: r.id,
    code: r.code,
    villaName: r.villaName,
    guest: r.guestName,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    guests: r.guests,
    total: r.totalPrice,
    status: r.status,
  }));

  const totalRevenue = stats?.totalRevenue || 0;
  const confirmedCount = stats?.confirmedCount || 0;

  if (loading) {
    return (
      <div className={styles.app}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--color-secondary)' }}>
          Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoMark}>
            <span className="material-symbols-outlined icon-filled" style={{fontSize:'22px', color:'white'}}>villa</span>
          </div>
          <div>
            <p style={{fontFamily:'var(--font-headline)', fontWeight:700, color:'white', fontSize:'var(--text-sm)'}}>RCetinkaya</p>
            <p style={{fontSize:'10px', color:'rgba(255,255,255,0.5)', fontWeight:500}}>Admin Paneli</p>
          </div>
        </div>

        <nav className={styles.sideNav}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            >
              <span className="material-symbols-outlined" style={{fontSize:'20px'}}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sideFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>logout</span>
            Çıkış Yap
          </button>
          <Link href="/" target="_blank" className={styles.siteLink}>
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>open_in_new</span>
            Siteye Git
          </Link>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className={styles.pageTitle}>
            {navItems.find(n => n.id === activeTab)?.label}
          </h1>
          <div className={styles.topbarRight}>
            <div className={styles.adminBadge}>
              <span className="material-symbols-outlined icon-filled" style={{fontSize:'18px', color:'var(--color-primary)'}}>admin_panel_settings</span>
              Admin
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {activeTab === 'dashboard' && (
            <div className={styles.tab}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{background:'rgba(186,0,54,0.1)', color:'var(--color-primary)'}}>
                    <span className="material-symbols-outlined icon-filled">villa</span>
                  </div>
                  <div>
                    <p className={styles.statValue}>{stats?.villaCount || villas.length}</p>
                    <p className={styles.statLabel}>Aktif Villa</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{background:'rgba(0,106,69,0.1)', color:'var(--color-success)'}}>
                    <span className="material-symbols-outlined icon-filled">confirmation_number</span>
                  </div>
                  <div>
                    <p className={styles.statValue}>{confirmedCount}</p>
                    <p className={styles.statLabel}>Onaylı Rezervasyon</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{background:'rgba(245,158,11,0.1)', color:'var(--color-warning)'}}>
                    <span className="material-symbols-outlined icon-filled">payments</span>
                  </div>
                  <div>
                    <p className={styles.statValue}>{formatPriceShort(totalRevenue)}</p>
                    <p className={styles.statLabel}>Toplam Gelir</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{background:'rgba(91,62,65,0.1)', color:'var(--color-on-surface-variant)'}}>
                    <span className="material-symbols-outlined icon-filled">star</span>
                  </div>
                  <div>
                    <p className={styles.statValue}>{stats?.avgRating || '4.9'}</p>
                    <p className={styles.statLabel}>Ortalama Puan</p>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Son Rezervasyonlar</h2>
                  <button className={styles.viewAllBtn} onClick={() => setActiveTab('reservations')}>
                    Tümünü Gör
                    <span className="material-symbols-outlined" style={{fontSize:'16px'}}>arrow_forward</span>
                  </button>
                </div>
                <div className={styles.tableWrap}>
                  <ReservationsTable
                    reservations={tableReservations.slice(0, 5)}
                    onStatusChange={handleReservationStatus}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className={styles.tab}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Tüm Rezervasyonlar</h2>
                  <span className={styles.badge}>{tableReservations.length} Toplam</span>
                </div>
                <div className={styles.tableWrap}>
                  {tableReservations.length === 0 ? (
                    <p style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-secondary)' }}>
                      Henüz rezervasyon bulunmuyor.
                    </p>
                  ) : (
                    <ReservationsTable
                      reservations={tableReservations}
                      onStatusChange={handleReservationStatus}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transfers' && (
            <div className={styles.tab}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Transfer Talepleri</h2>
                  <span className={styles.badge}>{transfers.length} Toplam</span>
                </div>
                {transfers.length === 0 ? (
                  <p style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-secondary)' }}>
                    Henüz transfer talebi yok.
                  </p>
                ) : (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Kod</th>
                          <th>Misafir</th>
                          <th>Güzergah</th>
                          <th>Tarih</th>
                          <th>Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfers.map(t => (
                          <tr key={t.id}>
                            <td><code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>{t.code}</code></td>
                            <td>{t.guestName}<br /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>{t.guestPhone}</span></td>
                            <td style={{ fontSize: 'var(--text-xs)' }}>{t.fromLocation} → {t.toLocation}</td>
                            <td style={{ fontSize: 'var(--text-xs)' }}>{t.date} {t.time}</td>
                            <td>
                              <select
                                value={t.status}
                                onChange={e => handleTransferStatus(t.id, e.target.value as TransferStatus)}
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--color-outline-variant)',
                                  background: 'var(--color-surface)',
                                }}
                              >
                                {transferStatuses.map(s => (
                                  <option key={s} value={s}>{transferStatusMap[s].label}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className={styles.tab}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>İletişim Mesajları</h2>
                  <span className={styles.badge}>{contacts.length} Toplam</span>
                </div>
                {contacts.length === 0 ? (
                  <p style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-secondary)' }}>
                    Henüz mesaj yok.
                  </p>
                ) : (
                  <div className={styles.reviewsList}>
                    {contacts.map(msg => (
                      <div key={msg.id} className={styles.reviewRow}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <strong style={{ fontSize: 'var(--text-sm)' }}>{msg.name}</strong>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>{msg.email}</span>
                          </div>
                          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>{msg.subject}</p>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-secondary)', lineHeight: 1.6 }}>{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'villas' && (
            <div className={styles.tab}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Villa Portföyü</h2>
                  <span className={styles.badge}>{villas.length} Villa</span>
                </div>
                <div className={styles.villaList}>
                  {villas.map(villa => (
                    <div key={villa.id} className={styles.villaRow}>
                      <div className={styles.villaThumb}>
                        <img src={villa.images[0]} alt={villa.name} />
                      </div>
                      <div className={styles.villaInfo}>
                        <p className={styles.villaName}>{villa.name}</p>
                        <p className={styles.villaLoc}>{villa.location}</p>
                      </div>
                      <div className={styles.villaStats}>
                        <span>{villa.bedrooms} Yatak</span>
                        <span>{villa.maxGuests} Kişi</span>
                      </div>
                      <div className={styles.villaPrice}>
                        {formatPriceShort(villa.pricePerNight)}<span style={{fontSize:'var(--text-xs)',color:'var(--color-secondary)'}}>/gece</span>
                      </div>
                      <div className={styles.villaRating}>
                        <span className="material-symbols-outlined icon-filled" style={{fontSize:'14px', color:'#f59e0b'}}>star</span>
                        {villa.rating}
                      </div>
                      <Link href={`/villa/${villa.slug}`} target="_blank" className={styles.viewBtn}>
                        <span className="material-symbols-outlined" style={{fontSize:'16px'}}>open_in_new</span>
                        Görüntüle
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

function ReservationsTable({
  reservations,
  onStatusChange,
}: {
  reservations: Array<{
    id: string;
    code: string;
    villaName: string;
    guest: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    total: number;
    status: string;
  }>;
  onStatusChange?: (id: string, status: ReservationStatus) => void;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Kod</th>
          <th>Villa</th>
          <th>Misafir</th>
          <th>Tarihler</th>
          <th>Kişi</th>
          <th>Tutar</th>
          <th>Durum</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map(r => {
          const status = statusMap[r.status as keyof typeof statusMap] || statusMap.pending;
          return (
            <tr key={r.id}>
              <td><code style={{fontSize:'var(--text-xs)', color:'var(--color-primary)'}}>{r.code}</code></td>
              <td style={{fontWeight:600}}>{r.villaName}</td>
              <td>{r.guest}</td>
              <td style={{fontSize:'var(--text-xs)', color:'var(--color-secondary)'}}>
                {r.checkIn} → {r.checkOut}
              </td>
              <td>{r.guests} kişi</td>
              <td style={{fontFamily:'var(--font-headline)', fontWeight:700, color:'var(--color-primary)'}}>{formatPriceShort(r.total)}</td>
              <td>
                {onStatusChange ? (
                  <select
                    value={r.status}
                    onChange={e => onStatusChange(r.id, e.target.value as ReservationStatus)}
                    style={{
                      fontSize: 'var(--text-xs)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-outline-variant)',
                      background: 'var(--color-surface)',
                      color: status.color,
                    }}
                  >
                    {reservationStatuses.map(s => (
                      <option key={s} value={s}>{statusMap[s].label}</option>
                    ))}
                  </select>
                ) : (
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:'4px',
                    padding:'3px 10px', borderRadius:'999px', fontSize:'var(--text-xs)',
                    fontWeight:700, color: status.color, background: status.bg,
                  }}>
                    {status.label}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
