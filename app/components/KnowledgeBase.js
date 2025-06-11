import Link from 'next/link';
import { openDb } from '@/lib/db';

export default async function KnowledgeBase() {
  try {
    const db = await openDb();
    
    // Bilgileri getir
    const items = await db.all(
      'SELECT * FROM knowledge_base ORDER BY created_at DESC LIMIT 3'
    );

    // Kategori renkleri
    const categoryColors = {
      urunler: 'bg-blue-100 text-blue-800',
      projeler: 'bg-green-100 text-green-800',
      referanslar: 'bg-purple-100 text-purple-800'
    };

    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Bilgi Bankası</h2>
          {items.length === 0 ? (
            <div className="text-center text-gray-600">Henüz bilgi eklenmemiş</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                    <p className="text-gray-700 mb-4">
                      {item.content.length > 150
                        ? `${item.content.substring(0, 150)}...`
                        : item.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString('tr-TR')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[item.category] || 'bg-gray-100 text-gray-800'}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/bilgi-bankasi"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tüm Bilgileri Görüntüle
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Bilgi bankası yüklenirken hata:', error);
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Bilgi Bankası</h2>
          <div className="text-center text-red-600">
            Bilgiler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </div>
        </div>
      </section>
    );
  }
} 