import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('adminToken');

    if (!token) {
      return NextResponse.json(
        { message: 'Kullanıcı zaten çıkış yapmış' },
        { status: 200 }
      );
    }

    // Token'ı sil
    cookieStore.delete('adminToken');
    
    return NextResponse.json({ 
      success: true,
      message: 'Çıkış başarılı'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        message: 'Çıkış yapılırken bir hata oluştu',
        error: error.message
      },
      { status: 500 }
    );
  }
} 