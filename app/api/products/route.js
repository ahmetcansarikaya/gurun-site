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
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 9;
  const category = searchParams.get('category') || 'all';
  const skip = (page - 1) * limit;

  let db;
  try {
    db = await connectToDatabase();
    const collection = db.collection('products');

    // Kategori filtresi
    const filter = category === 'all' ? {} : { category };

    // Toplam ürün sayısını al
    const total = await collection.countDocuments(filter);

    // Ürünleri getir
    const products = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  } finally {
    if (db) {
      await client.close();
    }
  }
}

export async function POST(request) {
  let db;
  try {
    const body = await request.json();
    const { name, description, image, category } = body;

    if (!name || !description || !image || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    db = await connectToDatabase();
    const collection = db.collection('products');

    const result = await collection.insertOne({
      name,
      description,
      image,
      category,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      productId: result.insertedId
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  } finally {
    if (db) {
      await client.close();
    }
  }
}

export async function DELETE(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    db = await connectToDatabase();
    const collection = db.collection('products');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  } finally {
    if (db) {
      await client.close();
    }
  }
} 