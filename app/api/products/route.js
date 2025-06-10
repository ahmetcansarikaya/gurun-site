import db from '@/lib/db';

export async function GET() {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    return Response.json(products);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const result = db.prepare(`
      INSERT INTO products (name, category, price, stock, description, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(data.name, data.category, data.price, data.stock, data.description, data.image);
    
    return Response.json({ id: result.lastInsertRowid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const result = db.prepare(`
      UPDATE products 
      SET name = ?, category = ?, price = ?, stock = ?, description = ?, image = ?
      WHERE id = ?
    `).run(data.name, data.category, data.price, data.stock, data.description, data.image, data.id);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 