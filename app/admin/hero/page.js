'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminHero() {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    button_text: '',
    button_link: '',
    is_active: false
  });

  // Hero görsellerini getir
  const fetchHeroImages = async () => {
    try {
      const response = await fetch('/api/hero');
      if (!response.ok) throw new Error('Görseller yüklenirken bir hata oluştu');
      const data = await response.json();
      setHeroImages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  // Form değişikliklerini takip et
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Yeni hero görseli ekle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Görsel eklenirken bir hata oluştu');
      }

      // Formu sıfırla ve modalı kapat
      setFormData({
        title: '',
        description: '',
        image_url: '',
        button_text: '',
        button_link: '',
        is_active: false
      });
      setShowModal(false);

      // Görselleri yeniden yükle
      await fetchHeroImages();
    } catch (error) {
      setError(error.message);
    }
  };

  // Hero görseli sil
  const handleDelete = async (id) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/hero?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Görsel silinirken bir hata oluştu');

      // Görselleri yeniden yükle
      await fetchHeroImages();
    } catch (error) {
      setError(error.message);
    }
  };

  // Hero görseli aktif/pasif yap
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/hero?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...heroImages.find(img => img.id === id),
          is_active: !currentStatus
        }),
      });

      if (!response.ok) throw new Error('Görsel güncellenirken bir hata oluştu');

      // Görselleri yeniden yükle
      await fetchHeroImages();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="p-4">Yükleniyor...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hero Görselleri Yönetimi</h1>
        <div className="flex space-x-4">
          <Link 
            href="/admin" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Admin Paneline Dön
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yeni Görsel Ekle
          </button>
        </div>
      </div>

      {/* Hero Görselleri Listesi */}
      <div className="grid grid-cols-1 gap-6">
        {heroImages.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-[400px]">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-gray-900 text-center p-4">
                  <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                  <p className="mb-4">{image.description}</p>
                  {image.button_text && (
                    <a
                      href={image.button_link}
                      className="inline-block bg-gray-900 text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {image.button_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  image.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {image.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(image.id, image.is_active)}
                  className={`p-2 rounded-lg ${
                    image.is_active
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {image.is_active ? <FaTimes /> : <FaCheck />}
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Hero Görseli Ekleme Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-100 rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Yeni Hero Görseli Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görsel URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Önerilen boyutlar:
                  <br />- İdeal: 1920x800 piksel (16:9 oranı)
                  <br />- Minimum: 1200x600 piksel
                  <br />- Format: JPG veya WebP
                  <br />- Maksimum dosya boyutu: 500KB
                  <br />- Önemli: Görsellerin yatay olarak ortalanmış olması gerekiyor
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buton Metni
                </label>
                <input
                  type="text"
                  name="button_text"
                  value={formData.button_text}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buton Linki
                </label>
                <input
                  type="url"
                  name="button_link"
                  value={formData.button_link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Aktif olarak ayarla
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-200 text-gray-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-gray-900 rounded-lg hover:bg-blue-600"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 