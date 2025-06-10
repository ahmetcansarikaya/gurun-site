import { NextResponse } from 'next/server';

// Database connection
async function openDb() {
  const sqlite3 = (await import('sqlite3')).default;
  const { open } = await import('sqlite');
  return open({
    filename: './gurun.db',
    driver: sqlite3.Database
  });
}

// GET all gallery images
export async function GET() {
  try {
    const db = await openDb();
    const images = await db.all('SELECT * FROM gallery_images ORDER BY date DESC');
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

// POST new gallery image
export async function POST(request) {
  try {
    const db = await openDb();
    const { title, category, image, date } = await request.json();

    const result = await db.run(
      'INSERT INTO gallery_images (title, category, image, date) VALUES (?, ?, ?, ?)',
      [title, category, image, date]
    );

    return NextResponse.json({ id: result.lastID, title, category, image, date });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  }
}

// DELETE gallery image
export async function DELETE(request) {
  try {
    const db = await openDb();
    const { id } = await request.json();

    await db.run('DELETE FROM gallery_images WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
} 