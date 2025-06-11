'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    'un',
    'makarna',
    'yemeklik',
    'sos',
    'baharat',
    'kuruyemis',
    'cay',
    'kahvaltilik'
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/products?category=${selectedCategory}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ürünler getirilirken bir hata oluştu');
      }

      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Görsel yüklenirken bir hata oluştu');
      }

      setFormData(prev => ({
        ...prev,
        image: data.url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ürün eklenirken bir hata oluştu');
      }

      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ürün silinirken bir hata oluştu');
      }

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Ürün Yönetimi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Yeni Ürün Ekle
        </button>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded ${
              selectedCategory === ''
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Tümü
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-black">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-black">{product.name}</h3>
                <p className="text-black mb-2">{product.description}</p>
                <p className="text-blue-600 font-semibold mb-2">
                  {product.price} TL
                </p>
                <p className="text-sm text-black mb-4">
                  Kategori: {product.category}
                </p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">Yeni Ürün Ekle</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-black mb-2">Ürün Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Fiyat</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded text-black"
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
                  <option value="">Kategori Seçin</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
                {uploading && (
                  <p className="text-blue-500 mt-2">Görsel yükleniyor...</p>
                )}
                {formData.image && (
                  <div className="mt-2">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  </div>
                )}
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
                  disabled={uploading}
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