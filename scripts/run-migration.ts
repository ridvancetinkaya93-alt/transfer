/**
 * Supabase SQL migration runner (requires database password).
 * Set SUPABASE_DB_URL in .env.local, e.g.:
 * postgresql://postgres.[ref]:[YOUR-DB-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(process.cwd(), 'supabase/migrations');

async function main() {
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.log('SUPABASE_DB_URL tanımlı değil.');
    console.log('Migration\'ları Supabase Dashboard → SQL Editor üzerinden çalıştırın:');
    const files = readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
    files.forEach(f => console.log(`  supabase/migrations/${f}`));
    process.exit(0);
  }

  const { default: pg } = await import('pg');
  const files = readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();

  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    for (const file of files) {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
      console.log(`Uygulanıyor: ${file}`);
      await client.query(sql);
      console.log(`  ✓ ${file}`);
    }
    console.log('Tüm migration\'lar başarıyla uygulandı.');
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Migration hatası:', err.message);
  process.exit(1);
});
