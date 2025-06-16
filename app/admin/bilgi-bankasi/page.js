'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminKnowledgeBase() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'urunler'
  });

  // Bilgileri getir
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/knowledge?category=${selectedCategory}&page=${currentPage}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bilgiler getirilirken bir hata oluştu');
      }

      setItems(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, currentPage]);

  // Yeni bilgi ekle
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bilgi eklenirken bir hata oluştu');
      }

      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'urunler'
      });
      fetchItems(); // Listeyi yenile
    } catch (error) {
      console.error('Error adding item:', error);
      setError(error.message);
    }
  };

  // Bilgi sil
  const handleDelete = async (id) => {
    if (!confirm('Bu bilgiyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/knowledge?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bilgi silinirken bir hata oluştu');
      }

      // Başarılı silme işlemi sonrası listeyi güncelle
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error.message || 'Bilgi silinirken bir hata oluştu');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Bilgi Bankası Yönetimi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Yeni Bilgi Ekle
        </button>
      </div>

      {/* Kategori Filtresi */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Tüm Kategoriler</option>
          <option value="urunler">Ürünler</option>
          <option value="projeler">Projeler</option>
          <option value="referanslar">Referanslar</option>
        </select>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Bilgi Listesi */}
      {loading ? (
        <div className="text-center py-8 text-black">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500">Henüz bilgi eklenmemiş</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-black">{item.title}</h3>
                <p className="text-black mb-2">{item.content}</p>
                <p className="text-sm text-black mb-4">
                  Kategori: {item.category}
                </p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Yeni Bilgi Ekleme Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">Yeni Bilgi Ekle</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-black mb-2">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">İçerik</label>
                <textarea
                  value={formData.content}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, content: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                >
                  <option value="urunler">Ürünler</option>
                  <option value="projeler">Projeler</option>
                  <option value="referanslar">Referanslar</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-black hover:text-gray-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 