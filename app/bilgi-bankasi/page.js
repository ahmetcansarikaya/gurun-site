'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function KnowledgeBasePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/knowledge?category=${selectedCategory}&page=${currentPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !Array.isArray(data.items)) {
          throw new Error('Geçersiz veri formatı');
        }

        setItems(data.items);
        setTotalPages(data.pagination?.totalPages || 1);
        setExpandedItems({});
      } catch (error) {
        console.error('Error fetching items:', error);
        setError(error.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, currentPage]);

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Kategori renkleri
  const categoryColors = {
    urunler: 'bg-blue-100 text-blue-800',
    projeler: 'bg-green-100 text-green-800',
    referanslar: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Bilgi Bankası</h1>

      {/* Kategori Filtresi */}
      <div className="mb-8 flex justify-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="text-center text-gray-600">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-600">Henüz bilgi eklenmemiş</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[item.category] || 'bg-gray-100 text-gray-800'}`}>
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </span>
                    <svg
                      className={`w-5 h-5 transform transition-transform text-gray-600 ${
                        expandedItems[item.id] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Açılır İçerik */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedItems[item.id] ? 'max-h-[1000px]' : 'max-h-0'
                }`}
              >
                <div className="p-6 pt-0 border-t">
                  <div className="prose max-w-none text-gray-700">
                    {item.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Ana Sayfaya Dön */}
      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
} 