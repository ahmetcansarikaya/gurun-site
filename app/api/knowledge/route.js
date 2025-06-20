import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Veritabanı bağlantısı
async function getDb() {
  return open({
    filename: path.join(process.cwd(), 'gurun.db'),
    driver: sqlite3.Database
  });
}

// Tablo oluşturma
async function createTable() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'urunler',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// GET - Tüm bilgileri getir
export async function GET() {
  try {
    const db = await getDb();
    await createTable();
    
    const articles = await db.all('SELECT * FROM knowledge ORDER BY created_at DESC');
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Bilgiler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni bilgi ekle
export async function POST(request) {
  try {
    const db = await getDb();
    await createTable();

    const { title, content, category } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Başlık ve içerik zorunludur' },
        { status: 400 }
      );
    }

    const result = await db.run(
      'INSERT INTO knowledge (title, content, category) VALUES (?, ?, ?)',
      [title, content, category || 'urunler']
    );

    return NextResponse.json({
      message: 'Bilgi başarıyla eklendi',
      id: result.lastID
    });
  } catch (error) {
    console.error('Error adding article:', error);
    return NextResponse.json(
      { error: 'Bilgi eklenirken bir hata oluştu' },
      { status: 500 }
    );
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

    db = await getDb();

    // Bilgiyi sil
    const result = await db.run(
      'DELETE FROM knowledge WHERE id = ?',
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

// PUT - Bilgi güncelle
export async function PUT(request) {
  let db;
  try {
    const { id, title, content, category } = await request.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: 'ID, başlık ve içerik zorunludur' },
        { status: 400 }
      );
    }

    db = await getDb();

    // Bilgiyi güncelle
    const result = await db.run(
      'UPDATE knowledge SET title = ?, content = ?, category = ? WHERE id = ?',
      [title, content, category || 'urunler', id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Bilgi bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Bilgi başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Bilgi güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Bilgi güncellenirken bir hata oluştu: ' + error.message },
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