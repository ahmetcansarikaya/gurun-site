import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// GET - Hero görsellerini getir
export async function GET() {
  try {
    const db = await openDb();
    
    // Tablo var mı kontrol et
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='hero_images'"
    );

    if (!tableExists) {
      // Tablo yoksa oluştur
      await db.exec(`
        CREATE TABLE IF NOT EXISTS hero_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          image_url TEXT NOT NULL,
          button_text TEXT,
          button_link TEXT,
          is_active INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    const items = await db.all(
      'SELECT * FROM hero_images ORDER BY created_at DESC'
    );

    console.log('Retrieved hero images:', items); // Debug için
    return NextResponse.json(items);
  } catch (error) {
    console.error('Hero görselleri getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Hero görselleri getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni hero görseli ekle
export async function POST(request) {
  try {
    const db = await openDb();
    const data = await request.json();
    console.log('Received hero image data:', data); // Debug için

    // Gerekli alanları kontrol et
    if (!data.image_url) {
      return NextResponse.json(
        { error: 'Görsel URL zorunludur' },
        { status: 400 }
      );
    }

    // Eğer bu görsel aktif yapılacaksa, diğer görselleri pasif yap
    if (data.is_active) {
      await db.run('UPDATE hero_images SET is_active = 0');
    }

    // Yeni görseli ekle
    const result = await db.run(
      `INSERT INTO hero_images (
        title, description, image_url, button_text, button_link, is_active
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.title || '',
        data.description || '',
        data.image_url,
        data.button_text || '',
        data.button_link || '',
        data.is_active ? 1 : 0
      ]
    );

    console.log('Inserted hero image:', result); // Debug için

    return NextResponse.json({
      id: result.lastID,
      message: 'Hero görseli başarıyla eklendi'
    });
  } catch (error) {
    console.error('Hero görseli eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Hero görseli eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Hero görseli sil
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Görsel ID\'si gerekli' },
        { status: 400 }
      );
    }

    const db = await openDb();
    await db.run('DELETE FROM hero_images WHERE id = ?', [id]);

    return NextResponse.json({
      message: 'Hero görseli başarıyla silindi'
    });
  } catch (error) {
    console.error('Hero görseli silinirken hata:', error);
    return NextResponse.json(
      { error: 'Hero görseli silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PATCH - Hero görseli güncelle
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Görsel ID\'si gerekli' },
        { status: 400 }
      );
    }

    const db = await openDb();

    // Eğer görsel aktif yapılacaksa, diğer görselleri pasif yap
    if (data.is_active) {
      await db.run('UPDATE hero_images SET is_active = 0');
    }

    // Görseli güncelle
    await db.run(
      `UPDATE hero_images SET 
        title = ?,
        description = ?,
        image_url = ?,
        button_text = ?,
        button_link = ?,
        is_active = ?
      WHERE id = ?`,
      [
        data.title,
        data.description,
        data.image_url,
        data.button_text || '',
        data.button_link || '',
        data.is_active ? 1 : 0,
        id
      ]
    );

    return NextResponse.json({
      message: 'Hero görseli başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Hero görseli güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Hero görseli güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 