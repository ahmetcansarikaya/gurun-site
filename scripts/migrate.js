const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../database.sqlite'));

// Tabloları oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    description TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Ürünleri taşı
const migrateProducts = () => {
  try {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const stmt = db.prepare(`
      INSERT INTO products (name, category, price, stock, description, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    products.forEach(product => {
      stmt.run(
        product.name,
        product.category,
        product.price,
        product.stock,
        product.description,
        product.image
      );
    });

    console.log(`${products.length} ürün başarıyla taşındı.`);
  } catch (error) {
    console.error('Ürün taşıma hatası:', error);
  }
};

// Mesajları taşı
const migrateMessages = () => {
  try {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const stmt = db.prepare(`
      INSERT INTO messages (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    messages.forEach(message => {
      stmt.run(
        message.name,
        message.email,
        message.phone,
        message.subject,
        message.message,
        message.status || 'new'
      );
    });

    console.log(`${messages.length} mesaj başarıyla taşındı.`);
  } catch (error) {
    console.error('Mesaj taşıma hatası:', error);
  }
};

// Tüm verileri taşı
const migrateAll = () => {
  console.log('Veri taşıma işlemi başlıyor...');
  migrateProducts();
  migrateMessages();
  console.log('Veri taşıma işlemi tamamlandı.');
};

migrateAll(); 