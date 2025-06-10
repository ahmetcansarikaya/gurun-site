'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('fabrika');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Galeri</h1>

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
                  className="relative aspect-square overflow-hidden rounded-lg shadow-lg"
                >
                  <Image
                    src={image.url}
                    alt={image.title || 'Galeri görseli'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
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
    </div>
  );
} 