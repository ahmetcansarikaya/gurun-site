import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// GET all gallery images
export async function GET() {
  try {
    await client.connect();
    const database = client.db('gurun-site');
    const collection = database.collection('gallery');
    const images = await collection.find({}).toArray();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

// POST new gallery image
export async function POST(request) {
  try {
    const { title, category, image, date } = await request.json();
    
    await client.connect();
    const database = client.db('gurun-site');
    const collection = database.collection('gallery');
    
    const result = await collection.insertOne({
      title,
      category,
      image,
      date,
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

// DELETE gallery image
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    await client.connect();
    const database = client.db('gurun-site');
    const collection = database.collection('gallery');
    
    await collection.deleteOne({ _id: id });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
} 