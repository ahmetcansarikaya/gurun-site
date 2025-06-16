import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// PUT: Bilgiyi güncelle
export async function PUT(request, { params }) {
  let db;
  try {
    const { id } = params;
    const { title, content, category } = await request.json();
    
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Başlık, içerik ve kategori alanları zorunludur' },
        { status: 400 }
      );
    }
    
    db = await openDb();
    
    // Önce bilginin var olup olmadığını kontrol et
    const existingArticle = await db.get(
      'SELECT * FROM knowledge WHERE id = ?',
      [id]
    );

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Bilgi bulunamadı' },
        { status: 404 }
      );
    }
    
    // Bilgiyi güncelle
    const result = await db.run(
      'UPDATE knowledge SET title = ?, content = ?, category = ? WHERE id = ?',
      [title, content, category, id]
    );
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Bilgi güncellenemedi' },
        { status: 500 }
      );
    }
    
    // Güncellenmiş bilgiyi getir
    const updatedArticle = await db.get(
      'SELECT * FROM knowledge WHERE id = ?',
      [id]
    );
    
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating knowledge article:', error);
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

// DELETE: Bilgiyi sil
export async function DELETE(request, { params }) {
  let db;
  try {
    const { id } = params;
    
    db = await openDb();
    
    // Önce bilginin var olup olmadığını kontrol et
    const existingArticle = await db.get(
      'SELECT * FROM knowledge WHERE id = ?',
      [id]
    );

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Bilgi bulunamadı' },
        { status: 404 }
      );
    }
    
    // Bilgiyi sil
    const result = await db.run(
      'DELETE FROM knowledge WHERE id = ?',
      [id]
    );
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Bilgi silinemedi' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Bilgi başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting knowledge article:', error);
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