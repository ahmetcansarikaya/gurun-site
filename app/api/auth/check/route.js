import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('adminToken');

    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'Token bulunamadı'
        },
        { status: 401 }
      );
    }

    console.log('Token found:', token.value);

    // Token'ın geçerliliğini kontrol et
    if (token.value.startsWith('dummy-token-')) {
      return NextResponse.json({ 
        authenticated: true,
        message: 'Oturum aktif'
      });
    }

    console.log('Invalid token format');
    return NextResponse.json(
      { 
        authenticated: false,
        message: 'Geçersiz token'
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        message: 'Kimlik doğrulama kontrolü sırasında bir hata oluştu',
        error: error.message
      },
      { status: 500 }
    );
  }
} 