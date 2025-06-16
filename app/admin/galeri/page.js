'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminGallery() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'fabrika',
    image: null
  });

  // Görselleri getir
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/gallery?category=${selectedCategory}&page=${currentPage}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Görseller getirilirken bir hata oluştu');
      }

      setImages(data.images);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [selectedCategory, currentPage]);

  // Görsel yükle
  const handleImageUpload = async (file) => {
    try {
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

      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Yeni görsel ekle
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setError('Lütfen bir görsel seçin');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Önce görseli yükle
      const imageUrl = await handleImageUpload(formData.image);

      // Sonra galeriye ekle
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          url: imageUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Görsel eklenirken bir hata oluştu');
      }

      setShowModal(false);
      setFormData({
        title: '',
        category: 'fabrika',
        image: null
      });
      fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Görsel sil
  const handleDelete = async (id) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Görsel silinirken bir hata oluştu');
      }

      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(error.message);
    }
  };

  // Görsel düzenle
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    try {
      setUploading(true);
      setError(null);

      const response = await fetch(`/api/gallery?id=${selectedImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Görsel düzenlenirken bir hata oluştu');
      }

      setShowEditModal(false);
      setSelectedImage(null);
      setFormData({
        title: '',
        category: 'fabrika',
        image: null
      });
      fetchImages();
    } catch (error) {
      console.error('Error editing image:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Düzenleme modalını aç
  const openEditModal = (image) => {
    setSelectedImage(image);
    setFormData({
      title: image.title,
      category: image.category,
      image: null
    });
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Galeri Yönetimi</h1>
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

      {/* Kategori Filtresi */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Tüm Kategoriler</option>
          <option value="fabrika">Fabrika</option>
          <option value="ekip">Ekip</option>
        </select>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Görsel Listesi */}
      {loading ? (
        <div className="text-center py-8 text-black">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-48">
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-black">{image.title}</h3>
                <p className="text-sm text-black mb-4">
                  Kategori: {image.category}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(image)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                  >
                    Sil
                  </button>
                </div>
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

      {/* Yeni Görsel Ekleme Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">Yeni Görsel Ekle</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-black mb-2">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                >
                  <option value="fabrika">Fabrika</option>
                  <option value="ekip">Ekip</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
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

      {/* Düzenleme Modalı */}
      {showEditModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">Görsel Düzenle</h2>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fabrika">Fabrika</option>
                  <option value="ekip">Ekip</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedImage(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 