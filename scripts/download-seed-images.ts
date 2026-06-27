/**
 * public/seed/ altına örnek görselleri indirir.
 * npm run seed:images
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { seedImageSources } from './seed/images';

const PUBLIC_ROOT = join(process.cwd(), 'public');

async function download(path: string, url: string) {
  const fullPath = join(PUBLIC_ROOT, path.replace(/^\//, ''));
  if (existsSync(fullPath)) {
    console.log(`  atlandı (var): ${path}`);
    return;
  }

  mkdirSync(dirname(fullPath), { recursive: true });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(fullPath, buffer);
  console.log(`  ✓ ${path}`);
}

async function main() {
  const entries = Object.entries(seedImageSources);
  console.log(`${entries.length} seed görsel indiriliyor...\n`);

  for (const [path, url] of entries) {
    try {
      await download(path, url);
    } catch (err) {
      console.error(`  ✗ ${path}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('\nTamamlandı. Görseller: public/seed/');
  console.log('Rehber: public/seed/README.md');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
