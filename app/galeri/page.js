'use client';

import { useState, useEffect } from 'react';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['Tümü', 'Fabrika', 'Üretim', 'Ürünler', 'Etkinlikler'];

  // Görselleri veritabanından yükle
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Görseller yüklenirken hata:', error);
      }
    };

    fetchImages();
  }, []);

  const filteredImages = selectedCategory === 'Tümü' 
    ? images 
    : images.filter(image => image.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Galeri</h1>
        <p className="mt-2 text-gray-600">Üretim tesislerimiz, ürünlerimiz ve etkinliklerimizden kareler</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div 
            key={image.id} 
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedImage(image)}
          >
            <div className="w-full h-64">
              <img
                src={image.image}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{image.title}</h3>
              <p className="text-sm text-gray-500">{image.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full bg-white rounded-xl overflow-hidden">
            <div className="relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium text-gray-900">{selectedImage.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedImage.category}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedImage.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 