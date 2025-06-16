import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// GET - Ürünleri getir
export async function GET(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const offset = (page - 1) * limit;

    db = await openDb();

    // Toplam ürün sayısını al
    let totalResult;
    if (category) {
      totalResult = await db.get(
        'SELECT COUNT(*) as total FROM products WHERE category = ?',
        [category]
      );
    } else {
      totalResult = await db.get('SELECT COUNT(*) as total FROM products');
    }
    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    // Ürünleri getir
    let products;
    if (category) {
      products = await db.all(
        'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [category, limit, offset]
      );
    } else {
      products = await db.all(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
    }

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Ürünler getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Ürünler getirilirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Yeni ürün ekle
export async function POST(request) {
  let db;
  try {
    const body = await request.json();
    const { name, description, price, category, image } = body;

    // Gerekli alanları kontrol et
    if (!name || !price || !category || !image) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }

    db = await openDb();

    // Ürünü ekle
    const result = await db.run(
      'INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', price, category, image]
    );

    return NextResponse.json({
      message: 'Ürün başarıyla eklendi',
      productId: result.lastID
    });
  } catch (error) {
    console.error('Ürün eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Ürün eklenirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Ürün sil
export async function DELETE(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Ürün ID\'si gerekli' },
        { status: 400 }
      );
    }

    db = await openDb();

    // Ürünü sil
    const result = await db.run(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    return NextResponse.json(
      { error: 'Ürün silinirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const formData = await request.formData();

    if (!id) {
      return NextResponse.json(
        { error: 'Ürün ID\'si gerekli' },
        { status: 400 }
      );
    }

    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const category = formData.get('category');
    const image = formData.get('image');

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }

    const db = await openDb();
    let imageUrl = null;

    // Eğer yeni bir görsel yüklendiyse
    if (image && image.size > 0) {
      // Önce görseli yükle
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Görsel yüklenirken bir hata oluştu');
      }

      const uploadData = await uploadResponse.json();
      imageUrl = uploadData.url;
    }

    // Ürünü güncelle
    const result = await db.run(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, category = ?${imageUrl ? ', image = ?' : ''}
       WHERE id = ?`,
      imageUrl 
        ? [name, description, price, category, imageUrl, id]
        : [name, description, price, category, id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Ürün güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 