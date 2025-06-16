'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Ana sayfa bileşeni
export default function Home() {
  const [heroImages, setHeroImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Varsayılan hero görseli
  const defaultHero = {
    image_url: '/hero-bg.jpg',
    title: 'Kaliteli Un Üretimi',
    description: 'Yüksek kaliteli un üretimi ile Türkiye\'nin önde gelen un fabrikalarından biriyiz.',
    button_text: 'Ürünlerimizi Keşfedin',
    button_link: '/urunler'
  };

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero');
        if (!response.ok) {
          throw new Error('Hero görselleri alınamadı');
        }
        const data = await response.json();
        console.log('API Response:', data); // Debug için

        // API'den gelen verileri kontrol et ve düzenle
        const formattedData = data.map(item => ({
          ...item,
          image_url: item.image_url || defaultHero.image_url,
          title: item.title || defaultHero.title,
          description: item.description || defaultHero.description,
          button_text: item.button_text || defaultHero.button_text,
          button_link: item.button_link || defaultHero.button_link
        }));

        // Tüm görselleri birleştir (is_active kontrolü olmadan)
        const allImages = [defaultHero, ...formattedData];
        console.log('All Images:', allImages); // Debug için
        setHeroImages(allImages);
      } catch (error) {
        console.error('Error fetching hero images:', error);
        setHeroImages([defaultHero]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // 5 saniyede bir görseli değiştir
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1;
          return nextIndex;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [heroImages]);

  const currentHero = heroImages[currentIndex] || defaultHero;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={currentHero.image_url}
              alt={currentHero.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {currentHero.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8">
                    {currentHero.description}
                  </p>
                  {currentHero.button_text && (
                    <Link
                      href={currentHero.button_link}
                      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {currentHero.button_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Yükleme Göstergesi */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </section>
    </div>
  );
}
