import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tls: true,
  tlsInsecure: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const client = new MongoClient(uri, options);

async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('gurun-site');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const skip = (page - 1) * limit;

    const database = await connectToDatabase();
    const collection = database.collection('products');

    // Get total count for pagination
    const total = await collection.countDocuments();
    const hasMore = skip + limit < total;

    // Get paginated products
    const products = await collection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      products,
      hasMore,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, image, category } = body;

    if (!name || !description || !image || !category) {
      return NextResponse.json(
        { error: 'Name, description, image and category are required' },
        { status: 400 }
      );
    }

    const database = await connectToDatabase();
    const collection = database.collection('products');

    const result = await collection.insertOne({
      name,
      description,
      image,
      category,
      createdAt: new Date()
    });

    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const database = await connectToDatabase();
    const collection = database.collection('products');

    const result = await collection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 