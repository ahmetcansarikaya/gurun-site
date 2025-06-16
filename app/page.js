'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';

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
    button_text: '',
    button_link: ''
  };

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero');
        if (!response.ok) {
          throw new Error('Hero görselleri alınamadı');
        }
        const data = await response.json();
        // Varsayılan hero görselini listenin başına ekle
        setHeroImages([defaultHero, ...data]);
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Hata durumunda sadece varsayılan görseli göster
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
        setCurrentIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [heroImages]);

  const currentHero = heroImages[currentIndex] || defaultHero;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-120px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={currentHero.image_url}
              alt={currentHero.title || 'Hero görseli'}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={100}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="container-custom relative h-full flex items-center z-10 pt-32">
          <div className="hero-content text-center text-white max-w-4xl mx-auto">
            {currentHero.title && (
              <motion.h1
                key={`title-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-6xl md:text-7xl font-bold mb-8"
              >
                {currentHero.title}
              </motion.h1>
            )}
            {currentHero.description && (
              <motion.p
                key={`description-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl md:text-3xl mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                {currentHero.description}
              </motion.p>
            )}
            {currentHero.button_text && currentHero.button_link && (
              <motion.div
                key={`button-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href={currentHero.button_link}
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {currentHero.button_text}
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Slider Navigation Dots */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
