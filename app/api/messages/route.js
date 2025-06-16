import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// GET - Mesajları getir
export async function GET(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    db = await openDb();

    // Toplam mesaj sayısını al
    const totalResult = await db.get('SELECT COUNT(*) as total FROM messages');
    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    // Mesajları getir
    const messages = await db.all(
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Mesajlar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Mesajlar getirilirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Yeni mesaj ekle
export async function POST(request) {
  let db;
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Gerekli alanları kontrol et
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'İsim, e-posta ve mesaj alanları zorunludur' },
        { status: 400 }
      );
    }

    db = await openDb();

    // Mesajı ekle
    const result = await db.run(
      'INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone || '', message]
    );

    return NextResponse.json({
      message: 'Mesajınız başarıyla gönderildi',
      messageId: result.lastID
    });
  } catch (error) {
    console.error('Mesaj eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Mesaj eklenirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Mesaj sil
export async function DELETE(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Mesaj ID\'si gerekli' },
        { status: 400 }
      );
    }

    db = await openDb();

    // Mesajı sil
    const result = await db.run(
      'DELETE FROM messages WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Mesaj bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Mesaj başarıyla silindi'
    });
  } catch (error) {
    console.error('Mesaj silinirken hata:', error);
    return NextResponse.json(
      { error: 'Mesaj silinirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
} 