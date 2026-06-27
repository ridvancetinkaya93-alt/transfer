# Seed Görseller — Ne Nerede?

Bu klasördeki dosyalar **örnek (seed)** görsellerdir. Kendi fotoğraflarınızla değiştirin; **dosya adı ve yol aynı** kalsa site ve veritabanı otomatik güncellenir.

Yeniden indirme: `npm run seed:images`  
Supabase güncelleme: `npm run db:seed`

## Site genel

| Dosya | Kullanım yeri |
|-------|----------------|
| `site/hero-main.jpg` | Ana sayfa hero arka planı (`NEXT_PUBLIC_HERO_IMAGE` varsayılan) |
| `site/vip-transfer-hero.jpg` | VIP Transfer sayfası hero |
| `site/og-social.jpg` | Sosyal medya / paylaşım önizlemesi (isteğe bağlı) |

## Bölgeler (ana sayfa “Popüler Bölgeler”)

| Dosya | Bölge |
|-------|--------|
| `regions/fethiye.jpg` | Fethiye kartı |
| `regions/bodrum.jpg` | Bodrum kartı |
| `regions/antalya.jpg` | Antalya kartı |
| `regions/kalkan.jpg` | Kalkan kartı |
| `regions/kas.jpg` | Kaş kartı |
| `regions/izmir.jpg` | İzmir / Alaçatı kartı |

## Villalar

Her villa klasöründe:

- `01-cover.jpg` — Liste kartı, kapak, rezervasyon özeti (ilk görsel)
- `02-gallery.jpg` … `05-gallery.jpg` — Villa detay sayfası galeri

| Klasör | Villa adı |
|--------|-----------|
| `villas/villa-azure-horizon/` | Villa Azure Horizon (Kaş) |
| `villas/villa-moonlight-bodrum/` | Villa Moonlight (Bodrum) |
| `villas/villa-foresta-fethiye/` | Villa Foresta (Ölüdeniz) |
| `villas/villa-zen-belek/` | Villa Zen (Belek) |
| `villas/villa-coral-pearl-kalkan/` | Villa Coral Pearl (Kalkan) |
| `villas/infinity-view-mansion-bodrum/` | Infinity View Mansion (Türkbükü) |
| `villas/olive-grove-retreat-fethiye/` | Olive Grove Retreat (Hisarönü) |
| `villas/villa-aegean-pearl-cesme/` | Villa Aegean Pearl (Alaçatı) |

## VIP Transfer araçları

| Dosya | Araç |
|-------|------|
| `transfers/vito.jpg` | Mercedes Vito |
| `transfers/e-serisi.jpg` | Mercedes E-Serisi |
| `transfers/v-serisi.jpg` | Mercedes V-Serisi |
| `transfers/sprinter.jpg` | Mercedes Sprinter VIP |

## Ödeme ikonları (değiştirmeyin)

`public/payments/` — iyzico, Visa, Mastercard logoları
