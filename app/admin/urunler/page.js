'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

export default function UrunlerYonetimi() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'un',
    image: null
  });

  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu');
      const data = await response.json();
      
      // API'den gelen products array'ini kontrol et
      if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error('API yanıtı beklenen formatta değil:', data);
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Ürünler yüklenirken bir hata oluştu');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Önce görseli yükle
      const imageFormData = new FormData();
      imageFormData.append('file', formData.image);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: imageFormData
      });

      if (!uploadResponse.ok) {
        throw new Error('Görsel yüklenirken bir hata oluştu');
      }

      const uploadData = await uploadResponse.json();

      // Sonra ürünü ekle
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          image: uploadData.url
        }),
      });

      if (!response.ok) {
        throw new Error('Ürün eklenirken bir hata oluştu');
      }

      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'un',
        image: null
      });
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ürün silinirken bir hata oluştu');
      }

      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Ürün silinirken bir hata oluştu');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Admin Paneline Dön</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Ürün Yönetimi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Yeni Ürün Ekle
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-black px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-black">Henüz ürün bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-black">{product.name}</h3>
              <p className="text-black mb-2">{product.description}</p>
              <p className="text-lg font-bold text-black mb-2">{product.price} TL</p>
              <p className="text-sm text-black mb-4">Kategori: {product.category}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => router.push(`/admin/urunler/${product.id}`)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-black mb-4">Yeni Ürün Ekle</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-black mb-2">Ürün Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-black"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Fiyat</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-black"
                  required
                >
                  <option value="un">Un</option>
                  <option value="makarna">Makarna</option>
                  <option value="bisküvi">Bisküvi</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Ürün Görseli</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full border rounded px-3 py-2 text-black"
                  accept="image/*"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {uploading ? 'Yükleniyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 