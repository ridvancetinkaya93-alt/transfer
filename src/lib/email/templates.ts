import { getSiteUrl } from '@/lib/supabase/config';
import { siteConfig } from '@/lib/site-config';

const BRAND = {
  primary: '#ba0036',
  primaryDark: '#920029',
  surface: '#fbf9f9',
  surfaceLow: '#f5f3f3',
  text: '#1b1c1c',
  textMuted: '#5f5e5e',
  success: '#006a45',
  border: '#e5bdbe',
  white: '#ffffff',
};

function formatMoney(amount: number): string {
  return `₺${amount.toLocaleString('tr-TR')}`;
}

function ctaButton(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px">
      <tr>
        <td style="border-radius:10px;background:${BRAND.primary}">
          <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:${BRAND.white};text-decoration:none;border-radius:10px">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;color:${BRAND.textMuted};font-size:14px;border-bottom:1px solid ${BRAND.surfaceLow}">${label}</td>
      <td style="padding:10px 0;font-size:14px;color:${BRAND.text};font-weight:600;border-bottom:1px solid ${BRAND.surfaceLow};text-align:right">${value}</td>
    </tr>
  `;
}

function detailsTable(rows: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-collapse:collapse">
      ${rows}
    </table>
  `;
}

function emailLayout(options: {
  title: string;
  preheader?: string;
  body: string;
  cta?: { href: string; label: string };
}): string {
  const siteUrl = getSiteUrl();
  const preheader = options.preheader || options.title;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${options.title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.surfaceLow};font-family:Arial,Helvetica,sans-serif;color:${BRAND.text}">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surfaceLow};padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
          <tr>
            <td style="padding:0 8px 20px;text-align:center">
              <a href="${siteUrl}" style="text-decoration:none">
                <span style="display:inline-block;padding:10px 18px;background:${BRAND.primary};border-radius:12px">
                  <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;color:${BRAND.white};letter-spacing:0.3px">
                    RCetinkaya <span style="font-weight:400">Turizm</span>
                  </span>
                </span>
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:${BRAND.textMuted};letter-spacing:0.6px;text-transform:uppercase">
                Lüks Villa & VIP Transfer
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:${BRAND.white};border-radius:16px;border:1px solid ${BRAND.border};padding:36px 32px;box-shadow:0 8px 32px rgba(27,28,28,0.06)">
              <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;color:${BRAND.text}">
                ${options.title}
              </h1>
              <div style="width:48px;height:3px;background:${BRAND.primary};border-radius:2px;margin-bottom:24px"></div>
              ${options.body}
              ${options.cta ? ctaButton(options.cta.href, options.cta.label) : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;text-align:center">
              <p style="margin:0 0 8px;font-size:13px;color:${BRAND.textMuted}">
                <span style="color:${BRAND.success};font-weight:700">TÜRSAB Onaylı</span> · Güvenli Ödeme · 7/24 Destek
              </p>
              <p style="margin:0 0 12px;font-size:12px;color:${BRAND.textMuted}">
                ${siteConfig.phoneDisplay} · ${siteConfig.email}
              </p>
              <p style="margin:0;font-size:11px;color:${BRAND.textMuted}">
                <a href="${siteUrl}" style="color:${BRAND.primary};text-decoration:none">rcetinkayaturizm.com</a>
                · <a href="${siteUrl}/hakkimizda#kvkk" style="color:${BRAND.textMuted};text-decoration:none">KVKK</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function reservationPaidTemplate(data: {
  code: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  total: number;
}): string {
  const siteUrl = getSiteUrl();
  return emailLayout({
    title: 'Rezervasyonunuz Onaylandı',
    preheader: `${data.code} — ${data.villaName} rezervasyonunuz onaylandı.`,
    body: `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.textMuted}">
        Sayın misafirimiz, ödemeniz alındı ve rezervasyonunuz kesinleşti. Tatiliniz için hazırlıklarımızı başlattık.
      </p>
      <p style="margin:0 0 8px;font-size:15px;color:${BRAND.text}">
        <strong>${data.villaName}</strong>
      </p>
      ${detailsTable([
        detailRow('Rezervasyon Kodu', data.code),
        detailRow('Giriş Tarihi', data.checkIn),
        detailRow('Çıkış Tarihi', data.checkOut),
        detailRow('Toplam Tutar', formatMoney(data.total)),
        detailRow('Durum', 'Onaylandı'),
      ].join(''))}
      <p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:${BRAND.textMuted}">
        Rezervasyon detaylarınızı her zaman takip edebilir, giriş belgelerinizi görüntüleyebilirsiniz.
      </p>
    `,
    cta: { href: `${siteUrl}/rezervasyon-takibi`, label: 'Rezervasyonu Takip Et' },
  });
}

export function reservationPendingTemplate(data: {
  code: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  total: number;
  reservationId: string;
  guestEmail: string;
}): string {
  const siteUrl = getSiteUrl();
  const paymentUrl = `${siteUrl}/odeme/${data.reservationId}?email=${encodeURIComponent(data.guestEmail)}`;

  return emailLayout({
    title: 'Rezervasyonunuz Oluşturuldu',
    preheader: `Ödemenizi tamamlayın — ${data.code}`,
    body: `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.textMuted}">
        Rezervasyon talebiniz başarıyla kaydedildi. Konaklamanızı kesinleştirmek için ödemenizi tamamlamanız gerekiyor.
      </p>
      ${detailsTable([
        detailRow('Rezervasyon Kodu', data.code),
        detailRow('Villa', data.villaName),
        detailRow('Giriş', data.checkIn),
        detailRow('Çıkış', data.checkOut),
        detailRow('Ödenecek Tutar', formatMoney(data.total)),
        detailRow('Durum', 'Ödeme Bekliyor'),
      ].join(''))}
      <p style="margin:16px 0 0;padding:14px 16px;background:${BRAND.surface};border-radius:10px;font-size:13px;line-height:1.6;color:${BRAND.textMuted}">
        Ödeme işleminiz 3D Secure ile korunur. Rezervasyonunuz ödeme onayı sonrası kesinleşir.
      </p>
    `,
    cta: { href: paymentUrl, label: 'Ödemeyi Tamamla' },
  });
}

export function adminNewReservationTemplate(data: {
  code: string;
  villaName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: string;
}): string {
  return emailLayout({
    title: 'Yeni Rezervasyon',
    preheader: `Yeni rezervasyon: ${data.code}`,
    body: `
      <p style="margin:0 0 16px;font-size:15px;color:${BRAND.textMuted}">
        Admin panelinden yeni bir rezervasyon kaydı oluşturuldu.
      </p>
      ${detailsTable([
        detailRow('Kod', data.code),
        detailRow('Villa', data.villaName),
        detailRow('Misafir', data.guestName),
        detailRow('E-posta', data.guestEmail),
        detailRow('Telefon', data.guestPhone),
        detailRow('Giriş', data.checkIn),
        detailRow('Çıkış', data.checkOut),
        detailRow('Tutar', formatMoney(data.total)),
        detailRow('Durum', data.status),
      ].join(''))}
    `,
    cta: { href: `${getSiteUrl()}/admin/dashboard`, label: 'Admin Paneli' },
  });
}

export function transferCustomerTemplate(data: {
  code: string;
  from: string;
  to: string;
  date: string;
  time: string;
  guestName: string;
}): string {
  return emailLayout({
    title: 'Transfer Talebiniz Alındı',
    preheader: `Transfer kodunuz: ${data.code}`,
    body: `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.textMuted}">
        Sayın ${data.guestName}, VIP transfer talebiniz başarıyla kaydedildi. Ekibimiz en kısa sürede sizinle iletişime geçecek.
      </p>
      ${detailsTable([
        detailRow('Talep Kodu', data.code),
        detailRow('Nereden', data.from),
        detailRow('Nereye', data.to),
        detailRow('Tarih', data.date),
        detailRow('Saat', data.time),
        detailRow('Durum', 'İnceleniyor'),
      ].join(''))}
      <p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:${BRAND.textMuted}">
        Acil durumlar için WhatsApp üzerinden bize ulaşabilirsiniz.
      </p>
    `,
    cta: { href: `https://wa.me/${siteConfig.whatsapp}`, label: 'WhatsApp ile İletişim' },
  });
}

export function transferAdminTemplate(data: {
  code: string;
  name: string;
  phone: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  vehicle?: string;
}): string {
  return emailLayout({
    title: 'Yeni Transfer Talebi',
    preheader: `${data.code} — ${data.name}`,
    body: `
      ${detailsTable([
        detailRow('Kod', data.code),
        detailRow('Misafir', data.name),
        detailRow('Telefon', data.phone),
        detailRow('Güzergah', `${data.from} → ${data.to}`),
        detailRow('Tarih', data.date),
        detailRow('Saat', data.time),
        detailRow('Kişi', String(data.passengers)),
        ...(data.vehicle ? [detailRow('Araç', data.vehicle)] : []),
      ].join(''))}
    `,
    cta: { href: `${getSiteUrl()}/admin/dashboard`, label: 'Talebi Görüntüle' },
  });
}

export function contactCustomerTemplate(data: {
  name: string;
  subject: string;
}): string {
  return emailLayout({
    title: 'Mesajınızı Aldık',
    preheader: 'Talebiniz ekibimize iletildi.',
    body: `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.textMuted}">
        Sayın ${data.name}, <strong>${data.subject}</strong> konulu mesajınız başarıyla alındı.
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:${BRAND.textMuted}">
        Müşteri temsilcilerimiz talebinizi inceleyecek ve en kısa sürede size dönüş yapacaktır.
        Genellikle iş günlerinde 24 saat içinde yanıt veriyoruz.
      </p>
    `,
  });
}

export function contactAdminTemplate(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): string {
  return emailLayout({
    title: 'Yeni İletişim Mesajı',
    preheader: `${data.name} — ${data.subject}`,
    body: `
      ${detailsTable([
        detailRow('Gönderen', data.name),
        detailRow('E-posta', data.email),
        ...(data.phone ? [detailRow('Telefon', data.phone)] : []),
        detailRow('Konu', data.subject),
      ].join(''))}
      <div style="margin-top:20px;padding:16px;background:${BRAND.surface};border-radius:10px;border-left:4px solid ${BRAND.primary}">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:0.5px">Mesaj</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:${BRAND.text}">${data.message}</p>
      </div>
    `,
    cta: { href: `${getSiteUrl()}/admin/dashboard`, label: 'Admin Paneli' },
  });
}
