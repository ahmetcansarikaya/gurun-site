import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('gurun');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// GET all gallery images
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;

    // Kategori kontrolü
    if (category && !['fabrika', 'ekip'].includes(category)) {
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db('gurun');
    const collection = db.collection('gallery');

    // Toplam görsel sayısını al
    const totalImages = await collection.countDocuments(
      category ? { category } : {}
    );

    // Görselleri getir
    const images = await collection
      .find(category ? { category } : {})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        totalImages,
        totalPages: Math.ceil(totalImages / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Görseller getirilirken bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST new gallery image
export async function POST(request) {
  try {
    const { url, title, category } = await request.json();

    // Gerekli alanları kontrol et
    if (!url || !category) {
      return NextResponse.json(
        { error: 'URL ve kategori alanları zorunludur' },
        { status: 400 }
      );
    }

    // Kategori kontrolü
    if (!['fabrika', 'ekip'].includes(category)) {
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db('gurun');
    const collection = db.collection('gallery');

    const result = await collection.insertOne({
      url,
      title: title || '',
      category,
      createdAt: new Date()
    });

    return NextResponse.json({
      message: 'Görsel başarıyla eklendi',
      image: {
        _id: result.insertedId,
        url,
        title: title || '',
        category,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json(
      { error: 'Görsel eklenirken bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE gallery image
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

    await client.connect();
    const db = client.db('gurun');
    const collection = db.collection('gallery');

    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Görsel bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Görsel başarıyla silindi'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Görsel silinirken bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 