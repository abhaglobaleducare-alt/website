import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPortalPath } from './lib/auth/helpers';

const PUBLIC_PATHS = ['/login', '/forgot-password', '/invite'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const role = request.cookies.get('abha-role')?.value;
    if (pathname === '/login' && role) {
      return NextResponse.redirect(new URL(getPortalPath(role), request.url));
    }
    return NextResponse.next();
  }

  const role = request.cookies.get('abha-role')?.value;
  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/admin') && !['director', 'admin'].includes(role)) {
    return NextResponse.redirect(new URL(getPortalPath(role), request.url));
  }

  if (pathname.startsWith('/staff') && role !== 'staff') {
    return NextResponse.redirect(new URL(getPortalPath(role), request.url));
  }

  if (pathname.startsWith('/hostel') && role !== 'hostel_manager') {
    return NextResponse.redirect(new URL(getPortalPath(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
