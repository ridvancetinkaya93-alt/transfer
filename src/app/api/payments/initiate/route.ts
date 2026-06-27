import { NextRequest, NextResponse } from 'next/server';
import { paymentInitiateSchema } from '@/lib/validation/schemas';
import { initiatePayment, completeDevPayment } from '@/lib/payments/iyzico';
import { getAuthenticatedUser } from '@/lib/auth/customer';
import {
  getIyzicoCardUserKey,
  getSavedCardById,
} from '@/lib/db/customers';
import { generateCardUserKey } from '@/lib/payments/iyzico-cards';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = paymentInitiateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz rezervasyon.' }, { status: 400 });
    }

    const user = await getAuthenticatedUser();
    const paymentOptions: {
      saveCard?: boolean;
      customerId?: string;
      cardUserKey?: string;
      cardToken?: string;
    } = {};

    if (user) {
      paymentOptions.customerId = user.id;

      if (parsed.data.saveCard) {
        paymentOptions.saveCard = true;
        const existingKey = await getIyzicoCardUserKey(user.id);
        paymentOptions.cardUserKey = existingKey || generateCardUserKey(user.id);
      }

      if (parsed.data.savedCardId) {
        const savedCard = await getSavedCardById(user.id, parsed.data.savedCardId);
        if (savedCard) {
          paymentOptions.cardUserKey = savedCard.cardUserKey;
          paymentOptions.cardToken = savedCard.cardToken;
        }
      }
    }

    const result = await initiatePayment(parsed.data.reservationId, paymentOptions);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result.devMode) {
      const completed = await completeDevPayment(parsed.data.reservationId, paymentOptions);
      if (!completed.success) {
        return NextResponse.json({ error: completed.error }, { status: 500 });
      }
      return NextResponse.json({
        devMode: true,
        reservation: completed.reservation,
        cardSaved: Boolean(parsed.data.saveCard && user),
      });
    }

    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
      checkoutHtml: result.checkoutHtml,
      token: result.paymentId,
    });
  } catch {
    return NextResponse.json({ error: 'Ödeme başlatılamadı.' }, { status: 500 });
  }
}
