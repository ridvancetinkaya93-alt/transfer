import { NextResponse } from 'next/server';
import { getAllContactMessages } from '@/lib/db/contacts';

export async function GET() {
  const messages = await getAllContactMessages();
  return NextResponse.json({ messages, count: messages.length });
}
