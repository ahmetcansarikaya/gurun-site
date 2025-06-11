import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// GET - Bilgileri getir
export async function GET(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    db = await openDb();

    // Tablo var mı kontrol et
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge_base'"
    );

    if (!tableExists) {
      // Tablo yoksa oluştur
      await db.exec(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Toplam bilgi sayısını al
    let totalResult;
    if (category === 'all') {
      totalResult = await db.get('SELECT COUNT(*) as total FROM knowledge_base');
    } else {
      totalResult = await db.get(
        'SELECT COUNT(*) as total FROM knowledge_base WHERE category = ?',
        [category]
      );
    }
    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    // Bilgileri getir
    let items;
    if (category === 'all') {
      items = await db.all(
        'SELECT * FROM knowledge_base ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
    } else {
      items = await db.all(
        'SELECT * FROM knowledge_base WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [category, limit, offset]
      );
    }

    return NextResponse.json({
      items: items || [],
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Bilgiler getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Bilgiler getirilirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error('Veritabanı kapatılırken hata:', closeError);
      }
    }
  }
}

// POST - Yeni bilgi ekle
export async function POST(request) {
  let db;
  try {
    const body = await request.json();
    const { title, content, category } = body;

    // Gerekli alanları kontrol et
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Başlık, içerik ve kategori zorunludur' },
        { status: 400 }
      );
    }

    // Geçerli kategorileri kontrol et
    const validCategories = ['urunler', 'projeler', 'referanslar'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    db = await openDb();

    // Tablo var mı kontrol et
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge_base'"
    );

    if (!tableExists) {
      // Tablo yoksa oluştur
      await db.exec(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Bilgiyi ekle
    const result = await db.run(
      'INSERT INTO knowledge_base (title, content, category, created_at) VALUES (?, ?, ?, datetime("now"))',
      [title, content, category]
    );

    // Eklenen bilgiyi getir
    const newItem = await db.get(
      'SELECT * FROM knowledge_base WHERE id = ?',
      [result.lastID]
    );

    return NextResponse.json({
      message: 'Bilgi başarıyla eklendi',
      item: newItem
    });
  } catch (error) {
    console.error('Bilgi eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Bilgi eklenirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error('Veritabanı kapatılırken hata:', closeError);
      }
    }
  }
}

// DELETE - Bilgi sil
export async function DELETE(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Bilgi ID\'si gerekli' },
        { status: 400 }
      );
    }

    db = await openDb();

    // Bilgiyi sil
    const result = await db.run(
      'DELETE FROM knowledge_base WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Bilgi bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Bilgi başarıyla silindi'
    });
  } catch (error) {
    console.error('Bilgi silinirken hata:', error);
    return NextResponse.json(
      { error: 'Bilgi silinirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error('Veritabanı kapatılırken hata:', closeError);
      }
    }
  }
} 