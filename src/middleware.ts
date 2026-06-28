import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';
import { isUserAdmin } from '@/lib/auth/admin-check';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createSupabaseMiddlewareClient(request, response);
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (
    pathname === '/admin/dashboard' ||
    pathname.startsWith('/admin/dashboard/') ||
    pathname.startsWith('/api/admin/')
  ) {
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return response;
    }

    if (!user || !(await isUserAdmin(supabase, user.id))) {
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
    '/admin/dashboard',
    '/admin/dashboard/:path*',
    '/api/admin/:path*',
    '/hesabim/panel',
    '/hesabim/panel/:path*',
    '/api/customer/:path*',
  ],
};
