import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Basit doğrulama - gerçek uygulamada daha güvenli bir yöntem kullanılmalı
    if (username === 'admin' && password === 'admin123') {
      // Başarılı giriş - token oluştur ve cookie'ye kaydet
      const token = 'dummy-token-' + Date.now();
      cookies().set('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 gün
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { message: 'Kullanıcı adı veya şifre hatalı' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 