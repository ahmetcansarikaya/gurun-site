import db from '@/lib/db';

export async function GET() {
  try {
    const messages = db.prepare('SELECT * FROM messages').all();
    return Response.json(messages);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const result = db.prepare(`
      INSERT INTO messages (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(data.name, data.email, data.phone, data.subject, data.message);
    
    return Response.json({ id: result.lastInsertRowid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const result = db.prepare(`
      UPDATE messages 
      SET status = ?
      WHERE id = ?
    `).run(data.status, data.id);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 