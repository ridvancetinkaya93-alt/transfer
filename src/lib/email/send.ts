import {
  adminNewReservationTemplate,
  contactAdminTemplate,
  contactCustomerTemplate,
  reservationPaidTemplate,
  reservationPendingTemplate,
  transferAdminTemplate,
  transferCustomerTemplate,
} from '@/lib/email/templates';

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'RCetinkaya Turizm <noreply@rcetinkayaturizm.com>';

  if (!apiKey) {
    console.log('[Email Dev]', options.to, options.subject);
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
}

export async function sendReservationPending(
  email: string,
  data: {
    code: string;
    villaName: string;
    checkIn: string;
    checkOut: string;
    total: number;
    reservationId: string;
    guestEmail: string;
  }
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Rezervasyonunuz Oluşturuldu — ${data.code}`,
    html: reservationPendingTemplate(data),
  });
}

export async function sendReservationConfirmation(
  email: string,
  data: {
    code: string;
    villaName: string;
    checkIn: string;
    checkOut: string;
    total: number;
    guestName?: string;
    guestPhone?: string;
  }
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Rezervasyon Onayı — ${data.code}`,
    html: reservationPaidTemplate(data),
  });

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `Ödeme Alındı — ${data.code}`,
      html: adminNewReservationTemplate({
        code: data.code,
        villaName: data.villaName,
        guestName: data.guestName || '—',
        guestEmail: email,
        guestPhone: data.guestPhone || '—',
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        total: data.total,
        status: 'Onaylandı (Ödendi)',
      }),
    });
  }
}

export async function sendNewReservationAdminNotification(data: {
  code: string;
  villaName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  total: number;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return;

  await sendEmail({
    to: adminEmail,
    subject: `Yeni Rezervasyon — ${data.code}`,
    html: adminNewReservationTemplate({
      ...data,
      status: 'Ödeme Bekliyor',
    }),
  });
}

export async function sendTransferNotification(data: {
  code: string;
  name: string;
  phone: string;
  email?: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  vehicle?: string;
}): Promise<void> {
  if (data.email) {
    await sendEmail({
      to: data.email,
      subject: `Transfer Talebiniz Alındı — ${data.code}`,
      html: transferCustomerTemplate({
        code: data.code,
        from: data.from,
        to: data.to,
        date: data.date,
        time: data.time,
        guestName: data.name,
      }),
    });
  }

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `Yeni Transfer Talebi — ${data.code}`,
      html: transferAdminTemplate(data),
    });
  }
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: 'Mesajınızı Aldık — RCetinkaya Turizm',
    html: contactCustomerTemplate({ name: data.name, subject: data.subject }),
  });

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `İletişim Formu — ${data.subject}`,
      html: contactAdminTemplate(data),
    });
  }
}
