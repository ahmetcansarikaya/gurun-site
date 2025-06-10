import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const database = client.db('gurun-site');
    return database;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// GET all gallery images
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const skip = (page - 1) * limit;

    const database = await connectToDatabase();
    const collection = database.collection('gallery');

    // Get total count for pagination
    const total = await collection.countDocuments();
    const hasMore = skip + limit < total;

    // Get paginated images
    const images = await collection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      images,
      hasMore,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST new gallery image
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, image } = body;

    if (!title || !category || !image) {
      return NextResponse.json(
        { error: 'Title, category and image are required' },
        { status: 400 }
      );
    }

    const database = await connectToDatabase();
    const collection = database.collection('gallery');

    const result = await collection.insertOne({
      title,
      category,
      image,
      createdAt: new Date()
    });

    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE gallery image
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const database = await connectToDatabase();
    const collection = database.collection('gallery');

    const result = await collection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 