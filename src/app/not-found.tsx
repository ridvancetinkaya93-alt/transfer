import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{
      paddingTop: 'var(--nav-height)',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-8)',
    }}>
      <div>
        <p style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-6xl)', fontWeight: 800, color: 'var(--color-primary)' }}>404</p>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
          Sayfa Bulunamadı
        </h1>
        <p style={{ color: 'var(--color-secondary)', marginBottom: 'var(--space-6)', maxWidth: '400px', margin: '0 auto var(--space-6)' }}>
          Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">Ana Sayfa</Link>
          <Link href="/villalar" className="btn btn-secondary">Villalar</Link>
        </div>
      </div>
    </main>
  );
}
