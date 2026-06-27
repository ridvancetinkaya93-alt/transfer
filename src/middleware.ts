import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

const ADMIN_COOKIE = 'admin_session';

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'dev-secret-change-me';
}

function verifyAdminToken(token: string): boolean {
  if (token === 'authenticated') return true;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const payload = parts[0];
  const sig = parts[1];
  const expected = createHmac('sha256', getSecret()).update(payload).digest('hex');
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  const expires = Number(payload.split(':')[1]);
  return expires > Date.now();
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createSupabaseMiddlewareClient(request, response);
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/admin/')) {
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return response;
    }

    const session = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!session || !verifyAdminToken(session)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname === '/hesabim/panel' || pathname.startsWith('/hesabim/panel/')) {
    if (!user) {
      const loginUrl = new URL('/hesabim/giris', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/api/customer/')) {
    const publicPaths = ['/api/customer/login', '/api/customer/register', '/api/customer/logout'];
    if (!publicPaths.includes(pathname) && !user) {
      return NextResponse.json({ error: 'Oturum gerekli.' }, { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/api/admin/:path*',
    '/hesabim/panel',
    '/hesabim/panel/:path*',
    '/api/customer/:path*',
  ],
};
