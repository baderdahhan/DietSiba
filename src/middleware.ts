import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // /admin shortcut → redirect to /en/admin/login
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(new URL('/en/admin/login', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|ar|tr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
