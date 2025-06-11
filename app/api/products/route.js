import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;

    await client.connect();
    const db = client.db('gurun');
    const collection = db.collection('products');

    // Toplam ürün sayısını al
    const totalProducts = await collection.countDocuments(
      category ? { category } : {}
    );

    // Ürünleri getir
    const products = await collection
      .find(category ? { category } : {})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Ürünler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  try {
    const { name, description, price, category, image } = await request.json();

    // Gerekli alanları kontrol et
    if (!name || !price || !category || !image) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurun' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db('gurun');
    const collection = db.collection('products');

    const result = await collection.insertOne({
      name,
      description: description || '',
      price,
      category,
      image,
      createdAt: new Date()
    });

    return NextResponse.json({
      message: 'Ürün başarıyla eklendi',
      product: {
        _id: result.insertedId,
        name,
        description: description || '',
        price,
        category,
        image,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Ürün eklenirken bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Ürün ID\'si gerekli' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db('gurun');
    const collection = db.collection('products');

    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Ürün silinirken bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 