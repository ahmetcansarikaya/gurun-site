import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
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

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('Successfully connected to MongoDB');
    
    const database = client.db('gurun-site');
    console.log('Connected to database: gurun-site');
    
    // Test collections
    const products = await database.collection('products').find({}).toArray();
    const gallery = await database.collection('gallery').find({}).toArray();
    
    console.log('Successfully retrieved data from collections');
    
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
        error: error.message,
        uri: uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') // Hide credentials in logs
      },
      { status: 500 }
    );
  }
} 