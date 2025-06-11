import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('adminToken');
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'No token found' },
        { status: 401 }
      );
    }

    // Token varsa kullanıcı giriş yapmış demektir
    return NextResponse.json({ 
      authenticated: true,
      message: 'User is authenticated'
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        message: 'Authentication check failed',
        error: error.message
      },
      { status: 500 }
    );
  }
} 