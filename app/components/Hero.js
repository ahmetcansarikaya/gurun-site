'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [heroImages, setHeroImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero');
        if (!response.ok) throw new Error('Görseller yüklenirken bir hata oluştu');
        const data = await response.json();
        const activeImages = data.filter(img => img.is_active);
        setHeroImages(activeImages);
      } catch (error) {
        console.error('Hero görselleri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [heroImages]);

  if (loading || heroImages.length === 0) {
    return (
      <div className="relative h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.image_url}
              alt={image.title || 'Hero Image'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {image.title || 'Kaliteli Un Üretiminde 50 Yıllık Tecrübe'}
                  </h1>
                  <p className="text-lg md:text-xl mb-8">
                    {image.description || 'Modern teknoloji ve geleneksel üretim yöntemlerini bir araya getirerek, en kaliteli unu sizlere sunuyoruz.'}
                  </p>
                  {image.button_text && (
                    <Link
                      href={image.button_link || '/urunler'}
                      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      {image.button_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentImage === index
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 