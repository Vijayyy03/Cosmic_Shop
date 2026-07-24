import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authCookie = request.cookies.get('admin_token');
    
    // We could do JWT verification here, but for simplicity we'll just check if it matches the password.
    if (!authCookie || authCookie.value !== process.env.ADMIN_PASSWORD) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Protect admin API routes too, except auth
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
    const authCookie = request.cookies.get('admin_token');
    if (!authCookie || authCookie.value !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
