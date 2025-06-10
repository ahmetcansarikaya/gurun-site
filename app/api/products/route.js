import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db('gurun-site');
    const collection = database.collection('products');
    const products = await collection.find({}).toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, category, image } = body;

    if (!name || !category || !image) {
      return NextResponse.json(
        { error: 'Name, category and image are required' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db('gurun-site');
    const collection = database.collection('products');

    const result = await collection.insertOne({
      name,
      description,
      category,
      image,
      createdAt: new Date()
    });

    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

    await client.connect();
    const database = client.db('gurun-site');
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
} 