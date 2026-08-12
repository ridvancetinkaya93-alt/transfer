import { randomUUID } from 'crypto';
import type { ContactMessage } from '@/types/database';
import { useMockBackend } from '@/lib/app-mode';

export async function createContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<ContactMessage> {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  if (useMockBackend()) {
    return { id, ...input, createdAt };
  }

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const supabase = requireSupabaseAdmin();

  const { error } = await supabase.from('contact_messages').insert({
    id,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    subject: input.subject,
    message: input.message,
  });

  if (error) throw new Error(`İletişim mesajı kaydedilemedi: ${error.message}`);

  return { id, ...input, createdAt };
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  if (useMockBackend()) return [];

  const { requireSupabaseAdmin } = await import('@/lib/supabase/require');
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`İletişim mesajları alınamadı: ${error.message}`);

  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    subject: row.subject,
    message: row.message,
    createdAt: row.created_at,
  }));
}
