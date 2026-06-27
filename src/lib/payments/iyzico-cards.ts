import { randomUUID } from 'crypto';

function getIyzicoAuth(): { baseUrl: string; auth: string } | null {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  if (!apiKey || !secretKey) return null;

  const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';
  const auth = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
  return { baseUrl, auth };
}

async function iyzicoPost(path: string, body: Record<string, unknown>) {
  const config = getIyzicoAuth();
  if (!config) throw new Error('iyzico yapılandırılmamış.');

  const res = await fetch(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${config.auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export function isIyzicoCardStorageAvailable(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

export function generateCardUserKey(customerId: string): string {
  return `RC-${customerId.replace(/-/g, '').slice(0, 24)}`;
}

export async function deleteIyzicoCard(cardUserKey: string, cardToken: string): Promise<boolean> {
  const data = await iyzicoPost('/cardstorage/card/delete', {
    locale: 'tr',
    conversationId: randomUUID(),
    cardUserKey,
    cardToken,
  });
  return data.status === 'success';
}

export interface SavedCardFromPayment {
  cardUserKey: string;
  cardToken: string;
  lastFour: string;
  cardBrand?: string;
  cardAlias?: string;
}

/** Ödeme callback yanıtından kart bilgisini çıkarır */
export function extractCardFromPaymentDetail(data: Record<string, unknown>): SavedCardFromPayment | null {
  const cardUserKey = data.cardUserKey as string | undefined;
  const cardToken = data.cardToken as string | undefined;
  const lastFourRaw = (data.lastFourDigits as string) || (data.binNumber as string);

  if (!cardUserKey || !cardToken || !lastFourRaw) return null;

  const lastFour = lastFourRaw.length >= 4 ? lastFourRaw.slice(-4) : lastFourRaw;

  return {
    cardUserKey,
    cardToken,
    lastFour,
    cardBrand: (data.cardFamily as string) || (data.cardType as string) || undefined,
    cardAlias: (data.cardAlias as string) || undefined,
  };
}
