import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Kullanıcı adı ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Basit doğrulama - gerçek uygulamada daha güvenli bir yöntem kullanılmalı
    if (username === 'admin' && password === 'admin123') {
      // Başarılı giriş - token oluştur ve cookie'ye kaydet
      const token = 'dummy-token-' + Date.now();
      const response = NextResponse.json({ 
        success: true,
        message: 'Giriş başarılı'
      });

      // Cookie'yi response header'ına ekle
      response.cookies.set('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 gün
      });

      return response;
    }

    return NextResponse.json(
      { message: 'Kullanıcı adı veya şifre hatalı' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        message: 'Giriş işlemi sırasında bir hata oluştu',
        error: error.message
      },
      { status: 500 }
    );
  }
} 