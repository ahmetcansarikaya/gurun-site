import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db('gurun-site');
    
    // Test collections
    const products = await database.collection('products').find({}).toArray();
    const gallery = await database.collection('gallery').find({}).toArray();
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      collections: {
        products: products.length,
        gallery: gallery.length
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'MongoDB connection failed',
        error: error.message
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 