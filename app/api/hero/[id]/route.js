import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import { Database } from 'sqlite3';

// Veritabanı bağlantısı
async function getDb() {
  return open({
    filename: './gurun.db',
    driver: Database
  });
}

// Tek bir hero görselini getir
export async function GET(request, { params }) {
  try {
    const db = await getDb();
    const image = await db.get(
      'SELECT * FROM hero_images WHERE id = ?',
      params.id
    );

    if (!image) {
      return NextResponse.json(
        { error: 'Görsel bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Hero image fetch error:', error);
    return NextResponse.json(
      { error: 'Görsel yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Hero görselini güncelle
export async function PATCH(request, { params }) {
  try {
    const db = await getDb();
    const data = await request.json();

    const result = await db.run(
      `UPDATE hero_images 
       SET is_active = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [data.is_active ? 1 : 0, params.id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Görsel bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Görsel başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Hero image update error:', error);
    return NextResponse.json(
      { error: 'Görsel güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Hero görselini sil
export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const result = await db.run(
      'DELETE FROM hero_images WHERE id = ?',
      params.id
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
    console.error('Hero image delete error:', error);
    return NextResponse.json(
      { error: 'Görsel silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 