// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('next-auth.session-token') ||
                     request.cookies.has('__Secure-next-auth.session-token');

  if (!isLoggedIn && request.nextUrl.pathname !== '/Login') {
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api/auth).*)'],
};
