'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('fabrika');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    category: 'fabrika'
  });
  const [uploading, setUploading] = useState(false);

  const fetchImages = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/gallery?category=${selectedCategory}&page=${pageNum}&limit=12`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setImages(data.images);
      } else {
        setImages(prev => [...prev, ...data.images]);
      }
      
      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Görseller yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchImages(1);
  }, [selectedCategory]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Base64'e çevir
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;
        setNewImage(prev => ({ ...prev, url: base64Image }));
      };
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Görsel yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newImage.url || !newImage.category) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newImage),
      });

      if (!response.ok) {
        throw new Error('Failed to add image');
      }

      setShowModal(false);
      setNewImage({ url: '', title: '', category: 'fabrika' });
      fetchImages(1);
    } catch (err) {
      console.error('Error adding image:', err);
      setError('Görsel eklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setImages(images.filter(img => img._id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Görsel silinirken bir hata oluştu');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Galeri Yönetimi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Yeni Görsel Ekle
        </button>
      </div>

      {/* Kategori Filtreleme */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setSelectedCategory('fabrika')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            selectedCategory === 'fabrika'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Fabrika
        </button>
        <button
          onClick={() => setSelectedCategory('ekip')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            selectedCategory === 'ekip'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Ekip
        </button>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Yükleme Göstergesi */}
      {loading && images.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Görsel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {images.map((image) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square overflow-hidden rounded-lg shadow-lg group"
                >
                  <Image
                    src={image.url}
                    alt={image.title || 'Galeri görseli'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Daha Fazla Yükle Butonu */}
          {hasMore && !loading && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Daha Fazla Yükle
              </button>
            </div>
          )}

          {/* Yükleme Göstergesi */}
          {loading && images.length > 0 && (
            <div className="mt-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}
        </>
      )}

      {/* Yeni Görsel Ekleme Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Yeni Görsel Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görsel
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Görsel başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="fabrika">Fabrika</option>
                  <option value="ekip">Ekip</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? 'Yükleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 