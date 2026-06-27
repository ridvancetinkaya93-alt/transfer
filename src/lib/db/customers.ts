import type { CustomerProfile, SavedCard } from '@/types/database';
import { requireSupabaseAdmin } from '@/lib/supabase/require';

export async function updateCustomerProfile(
  userId: string,
  data: { firstName: string; lastName: string; phone?: string }
): Promise<CustomerProfile> {
  const admin = requireSupabaseAdmin();
  const { data: row, error } = await admin
    .from('profiles')
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error || !row) throw new Error('Profil güncellenemedi.');

  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone || undefined,
    createdAt: row.created_at,
  };
}

export async function getSavedCards(customerId: string): Promise<SavedCard[]> {
  const admin = requireSupabaseAdmin();
  const { data, error } = await admin
    .from('saved_cards')
    .select('*')
    .eq('customer_id', customerId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error('Kartlar alınamadı.');

  return (data || []).map(row => ({
    id: row.id,
    cardAlias: row.card_alias || undefined,
    cardBrand: row.card_brand || undefined,
    lastFour: row.last_four,
    isDefault: row.is_default,
    createdAt: row.created_at,
  }));
}

export async function deleteSavedCard(customerId: string, cardId: string): Promise<void> {
  const admin = requireSupabaseAdmin();

  const { data: card } = await admin
    .from('saved_cards')
    .select('card_user_key, card_token')
    .eq('id', cardId)
    .eq('customer_id', customerId)
    .single();

  if (card) {
    try {
      const { deleteIyzicoCard, isIyzicoCardStorageAvailable } = await import('@/lib/payments/iyzico-cards');
      if (isIyzicoCardStorageAvailable()) {
        await deleteIyzicoCard(card.card_user_key, card.card_token);
      }
    } catch {
      // iyzico silme başarısız olsa da yerel kaydı kaldır
    }
  }

  const { error } = await admin
    .from('saved_cards')
    .delete()
    .eq('id', cardId)
    .eq('customer_id', customerId);

  if (error) throw new Error('Kart silinemedi.');
}

export async function getIyzicoCardUserKey(customerId: string): Promise<string | null> {
  const admin = requireSupabaseAdmin();
  const { data } = await admin
    .from('profiles')
    .select('iyzico_card_user_key')
    .eq('id', customerId)
    .single();

  return data?.iyzico_card_user_key || null;
}

export async function setIyzicoCardUserKey(customerId: string, cardUserKey: string): Promise<void> {
  const admin = requireSupabaseAdmin();
  await admin
    .from('profiles')
    .update({ iyzico_card_user_key: cardUserKey, updated_at: new Date().toISOString() })
    .eq('id', customerId);
}

export async function addSavedCard(
  customerId: string,
  card: {
    cardUserKey: string;
    cardToken: string;
    lastFour: string;
    cardBrand?: string;
    cardAlias?: string;
    isDefault?: boolean;
  }
): Promise<SavedCard> {
  const admin = requireSupabaseAdmin();

  await setIyzicoCardUserKey(customerId, card.cardUserKey);

  const { count } = await admin
    .from('saved_cards')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', customerId);

  const isDefault = card.isDefault ?? (count === 0);

  if (isDefault) {
    await admin.from('saved_cards').update({ is_default: false }).eq('customer_id', customerId);
  }

  const { data: row, error } = await admin
    .from('saved_cards')
    .upsert(
      {
        customer_id: customerId,
        card_user_key: card.cardUserKey,
        card_token: card.cardToken,
        card_alias: card.cardAlias || 'Kartım',
        card_brand: card.cardBrand || null,
        last_four: card.lastFour,
        is_default: isDefault,
      },
      { onConflict: 'customer_id,card_token' }
    )
    .select('*')
    .single();

  if (error || !row) throw new Error('Kart kaydedilemedi.');

  return {
    id: row.id,
    cardAlias: row.card_alias || undefined,
    cardBrand: row.card_brand || undefined,
    lastFour: row.last_four,
    isDefault: row.is_default,
    createdAt: row.created_at,
  };
}

export async function getSavedCardById(customerId: string, cardId: string) {
  const admin = requireSupabaseAdmin();
  const { data } = await admin
    .from('saved_cards')
    .select('*')
    .eq('id', cardId)
    .eq('customer_id', customerId)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    cardUserKey: data.card_user_key,
    cardToken: data.card_token,
    cardAlias: data.card_alias,
    cardBrand: data.card_brand,
    lastFour: data.last_four,
    isDefault: data.is_default,
  };
}

export async function getCustomerStats(customerId: string, email: string) {
  const admin = requireSupabaseAdmin();

  const [reservations, transfers, cards] = await Promise.all([
    admin.from('reservations').select('status, payment_status').eq('customer_id', customerId),
    admin.from('transfer_requests').select('status').eq('customer_id', customerId),
    admin.from('saved_cards').select('id', { count: 'exact', head: true }).eq('customer_id', customerId),
  ]);

  const resList = reservations.data || [];
  const activeReservations = resList.filter(
    r => r.status === 'confirmed' || r.status === 'pending'
  ).length;
  const paidReservations = resList.filter(r => r.payment_status === 'paid').length;
  const transferList = transfers.data || [];
  const activeTransfers = transferList.filter(t => t.status === 'new' || t.status === 'contacted').length;

  return {
    totalReservations: resList.length,
    activeReservations,
    paidReservations,
    totalTransfers: transferList.length,
    activeTransfers,
    savedCards: cards.count || 0,
  };
}
