import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// GET - Görselleri getir
export async function GET(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    db = await openDb();

    // Toplam görsel sayısını al
    const totalResult = await db.get(
      'SELECT COUNT(*) as total FROM gallery WHERE category = ? OR ? = "all"',
      [category, category]
    );
    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    // Görselleri getir
    const images = await db.all(
      'SELECT * FROM gallery WHERE category = ? OR ? = "all" ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [category, category, limit, offset]
    );

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Görseller getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Görseller getirilirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Yeni görsel ekle
export async function POST(request) {
  let db;
  try {
    const body = await request.json();
    const { title, category, url } = body;

    // Gerekli alanları kontrol et
    if (!title || !category || !url) {
      return NextResponse.json(
        { error: 'Başlık, kategori ve görsel zorunludur' },
        { status: 400 }
      );
    }

    // Geçerli kategorileri kontrol et
    const validCategories = ['fabrika', 'ekip'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    db = await openDb();

    // Görseli ekle
    const result = await db.run(
      'INSERT INTO gallery (title, category, url) VALUES (?, ?, ?)',
      [title, category, url]
    );

    return NextResponse.json({
      message: 'Görsel başarıyla eklendi',
      imageId: result.lastID
    });
  } catch (error) {
    console.error('Görsel eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Görsel eklenirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Görsel sil
export async function DELETE(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Görsel ID\'si gerekli' },
        { status: 400 }
      );
    }

    db = await openDb();

    // Görseli sil
    const result = await db.run(
      'DELETE FROM gallery WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Görsel bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Görsel başarıyla silindi'
    });
  } catch (error) {
    console.error('Görsel silinirken hata:', error);
    return NextResponse.json(
      { error: 'Görsel silinirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { title, category } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Görsel ID\'si gerekli' },
        { status: 400 }
      );
    }

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Başlık ve kategori gerekli' },
        { status: 400 }
      );
    }

    const db = await openDb();
    const result = await db.run(
      'UPDATE gallery SET title = ?, category = ? WHERE id = ?',
      [title, category, id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Görsel bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Görsel güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 