import { randomUUID } from 'crypto';
import { getSiteUrl } from '@/lib/supabase/config';
import { isLivePaymentsEnabled } from '@/lib/app-mode';
import { getReservationById, markReservationPaid } from '@/lib/db/reservations';
import { sendReservationConfirmation } from '@/lib/email/send';
import {
  extractCardFromPaymentDetail,
  generateCardUserKey,
  isIyzicoCardStorageAvailable,
} from '@/lib/payments/iyzico-cards';
import { addSavedCard } from '@/lib/db/customers';

export function isIyzicoConfigured(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  checkoutHtml?: string;
  error?: string;
  devMode?: boolean;
}

interface PaymentOptions {
  saveCard?: boolean;
  customerId?: string;
  cardUserKey?: string;
  cardToken?: string;
}

export async function initiatePayment(
  reservationId: string,
  options: PaymentOptions = {}
): Promise<PaymentResult> {
  const reservation = await getReservationById(reservationId);
  if (!reservation) return { success: false, error: 'Rezervasyon bulunamadı.' };
  if (reservation.paymentStatus === 'paid') {
    return { success: false, error: 'Bu rezervasyon zaten ödenmiş.' };
  }

  if (!isIyzicoConfigured() || !isLivePaymentsEnabled()) {
    return {
      success: true,
      devMode: true,
      paymentId: `dev-${randomUUID()}`,
    };
  }

  const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';
  const siteUrl = getSiteUrl();

  const body: Record<string, unknown> = {
    locale: 'tr',
    conversationId: reservation.id,
    price: reservation.totalPrice.toFixed(2),
    paidPrice: reservation.totalPrice.toFixed(2),
    currency: 'TRY',
    basketId: reservation.code,
    paymentGroup: 'PRODUCT',
    callbackUrl: `${siteUrl}/api/payments/callback`,
    enabledInstallments: [1],
    buyer: {
      id: reservation.id,
      name: reservation.guestFirstName,
      surname: reservation.guestLastName,
      email: reservation.guestEmail,
      identityNumber: reservation.guestTcNo || '11111111111',
      registrationAddress: reservation.villaLocation,
      city: 'Istanbul',
      country: 'Turkey',
    },
    shippingAddress: {
      contactName: reservation.guestName,
      city: 'Istanbul',
      country: 'Turkey',
      address: reservation.villaLocation,
    },
    billingAddress: {
      contactName: reservation.guestName,
      city: 'Istanbul',
      country: 'Turkey',
      address: reservation.villaLocation,
    },
    basketItems: [
      {
        id: reservation.villaId,
        name: reservation.villaName,
        category1: 'Villa Kiralama',
        itemType: 'VIRTUAL',
        price: reservation.totalPrice.toFixed(2),
      },
    ],
  };

  if (options.cardUserKey && options.cardToken) {
    body.paymentCardUserKey = options.cardUserKey;
    body.paymentCardToken = options.cardToken;
  }

  if (options.saveCard && options.customerId) {
    body.registerCard = 1;
    body.cardUserKey = options.cardUserKey || generateCardUserKey(options.customerId);
  }

  try {
    const auth = Buffer.from(
      `${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
    ).toString('base64');

    const res = await fetch(`${baseUrl}/payment/iyzipos/checkoutform/initialize/auth/ecom`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.status === 'success') {
      return {
        success: true,
        paymentId: data.token,
        checkoutUrl: data.paymentPageUrl,
        checkoutHtml: data.checkoutFormContent,
      };
    }

    return { success: false, error: data.errorMessage || 'Ödeme başlatılamadı.' };
  } catch {
    return { success: false, error: 'Ödeme servisine bağlanılamadı.' };
  }
}

export async function completeDevPayment(
  reservationId: string,
  options: PaymentOptions = {}
): Promise<{
  success: boolean;
  reservation?: Awaited<ReturnType<typeof markReservationPaid>>;
  error?: string;
}> {
  const paymentId = `dev-${randomUUID()}`;
  const reservation = await markReservationPaid(reservationId, paymentId);

  if (!reservation) return { success: false, error: 'Rezervasyon güncellenemedi.' };

  if (options.saveCard && options.customerId) {
    const cardUserKey = options.cardUserKey || generateCardUserKey(options.customerId);
    try {
      await addSavedCard(options.customerId, {
        cardUserKey,
        cardToken: `dev-token-${randomUUID().slice(0, 8)}`,
        lastFour: '0008',
        cardBrand: 'Mastercard',
        cardAlias: 'Test Kartım',
        isDefault: true,
      });
    } catch {
      // dev kart kaydı başarısız olsa ödeme tamamlanmış kalır
    }
  }

  await sendReservationConfirmation(reservation.guestEmail, {
    code: reservation.code,
    villaName: reservation.villaName,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    total: reservation.totalPrice,
    guestName: reservation.guestName,
    guestPhone: reservation.guestPhone,
  });

  return { success: true, reservation };
}

export async function handlePaymentCallback(token: string): Promise<{
  success: boolean;
  reservationId?: string;
  error?: string;
}> {
  if (!isIyzicoConfigured() || !isLivePaymentsEnabled()) {
    return { success: false, error: 'iyzico devre dışı (mock mod).' };
  }

  const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';
  const auth = Buffer.from(
    `${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
  ).toString('base64');

  const res = await fetch(`${baseUrl}/payment/iyzipos/checkoutform/auth/ecom/detail`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ locale: 'tr', token }),
  });

  const data = await res.json();
  if (data.status !== 'success' || data.paymentStatus !== 'SUCCESS') {
    return { success: false, error: data.errorMessage || 'Ödeme başarısız.' };
  }

  const reservationId = data.conversationId;
  const reservation = await markReservationPaid(reservationId, data.paymentId, 'iyzico');

  if (reservation) {
    await sendReservationConfirmation(reservation.guestEmail, {
      code: reservation.code,
      villaName: reservation.villaName,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      total: reservation.totalPrice,
      guestName: reservation.guestName,
      guestPhone: reservation.guestPhone,
    });

    const fullReservation = await getReservationById(reservationId);
    if (fullReservation?.customerId && isIyzicoCardStorageAvailable()) {
      const cardInfo = extractCardFromPaymentDetail(data as Record<string, unknown>);
      if (cardInfo) {
        try {
          await addSavedCard(fullReservation.customerId, {
            cardUserKey: cardInfo.cardUserKey,
            cardToken: cardInfo.cardToken,
            lastFour: cardInfo.lastFour,
            cardBrand: cardInfo.cardBrand,
            cardAlias: cardInfo.cardAlias,
          });
        } catch {
          // kart kaydı başarısız olsa ödeme tamamlanmış kalır
        }
      }
    }
  }

  return { success: true, reservationId };
}
