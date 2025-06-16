import { NextResponse } from 'next/server';

export function middleware(request) {
  // Admin sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfası hariç tüm admin sayfalarını kontrol et
    if (request.nextUrl.pathname !== '/admin/login') {
      const token = request.cookies.get('adminToken');
      
      // Token yoksa login sayfasına yönlendir
      if (!token) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Origin', '*');
        return response;
      }
    }
  }

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}

export const config = {
  matcher: '/admin/:path*',
}; 