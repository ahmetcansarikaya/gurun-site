import { NextResponse } from 'next/server';

export function middleware(request) {
  // Admin sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfası hariç tüm admin sayfalarını kontrol et
    if (request.nextUrl.pathname !== '/admin/login') {
      const token = request.cookies.get('adminToken');
      
      // Token yoksa login sayfasına yönlendir
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 