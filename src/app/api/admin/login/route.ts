import { NextRequest, NextResponse } from 'next/server';
import { setAdminSessionCookie } from '@/lib/auth/admin-session';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rcetinkayaturizm.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur.' },
        { status: 400 }
      );
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı adı veya şifre.' },
        { status: 401 }
      );
    }

    await setAdminSessionCookie();

    return NextResponse.json(
      { success: true, message: 'Giriş başarılı.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası.' },
      { status: 500 }
    );
  }
}
