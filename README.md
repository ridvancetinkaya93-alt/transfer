# RCetinkaya Turizm

Villa kiralama, VIP transfer ve müşteri paneli — Next.js 16 + Supabase.

## Kurulum

```bash
npm install
cp .env.example .env.local   # Supabase ve site ayarlarını doldurun
npm run db:migrate           # SUPABASE_DB_URL varsa; yoksa SQL Editor
npm run seed:images          # public/seed örnek görselleri
npm run db:seed              # Supabase katalog verisi
npm run dev
```

## Seed görseller

Örnek fotoğraflar `public/seed/` altında. Hangi dosya nerede kullanılır: `public/seed/README.md`.

Kendi görsellerinizi aynı dosya adlarıyla değiştirin, sonra `npm run db:seed`.

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run seed:images` | Seed görsellerini indir/güncelle |
| `npm run db:seed` | Supabase seed |
| `npm run db:migrate` | SQL migration'ları |

## Ortam değişkenleri

`.env.example` dosyasına bakın. `.env.local` asla commit edilmez.

## GitLab

https://gitlab.com/ridvancetinkaya93-group/ridvancetinkaya93-project
