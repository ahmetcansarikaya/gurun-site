import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('adminToken');

    // CORS headers ekle
    const response = NextResponse.json(
      token ? 
      { 
        authenticated: true,
        message: 'Oturum aktif'
      } : 
      { 
        authenticated: false,
        message: 'Token bulunamadı'
      },
      { status: token ? 200 : 401 }
    );

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', 'https://prestijstudio.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie');

    return response;
  } catch (error) {
    console.error('Auth check error:', error);
    const response = NextResponse.json(
      { 
        authenticated: false,
        message: 'Kimlik doğrulama kontrolü sırasında bir hata oluştu',
        error: error.message
      },
      { status: 500 }
    );

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', 'https://prestijstudio.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie');

    return response;
  }
} 