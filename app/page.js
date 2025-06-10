'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('fabrika');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/gallery?category=${selectedCategory}&limit=6`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Görseller yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section bg-[url('/hero-bg.jpg')]">
        <div className="container-custom">
          <div className="hero-content text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Kaliteli Un Üretimi
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Yüksek kaliteli un üretimi ile Türkiye'nin önde gelen un fabrikalarından biriyiz.
            </p>
            <Link href="/urunler" className="button-primary">
              Ürünlerimizi Keşfedin
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Neden Biz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold mb-4">Kaliteli Üretim</h3>
              <p className="text-gray-600">
                En son teknoloji ile üretilen yüksek kaliteli unlar
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold mb-4">Geniş Ürün Yelpazesi</h3>
              <p className="text-gray-600">
                Her ihtiyaca uygun çeşitli un seçenekleri
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold mb-4">Hızlı Teslimat</h3>
              <p className="text-gray-600">
                Türkiye'nin her yerine hızlı ve güvenli teslimat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="section-title">Ürünlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="relative h-48">
                <Image
                  src="/product1.jpg"
                  alt="Ekmeklik Un"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Ekmeklik Un</h3>
                <p className="text-gray-600 mb-4">
                  Yüksek protein içeriği ile ekmek yapımı için ideal
                </p>
                <Link href="/urunler" className="button-secondary w-full block text-center">
                  Detaylı Bilgi
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="relative h-48">
                <Image
                  src="/product2.jpg"
                  alt="Pastalık Un"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Pastalık Un</h3>
                <p className="text-gray-600 mb-4">
                  Pastacılık ve fırıncılık için özel üretim
                </p>
                <Link href="/urunler" className="button-secondary w-full block text-center">
                  Detaylı Bilgi
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="relative h-48">
                <Image
                  src="/product3.jpg"
                  alt="Tam Buğday Unu"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Tam Buğday Unu</h3>
                <p className="text-gray-600 mb-4">
                  Sağlıklı beslenme için tam buğday unu
                </p>
                <Link href="/urunler" className="button-secondary w-full block text-center">
                  Detaylı Bilgi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Hakkımızda</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Yılların deneyimi ve modern teknoloji ile un üretiminde kalite ve güvenin adresi olmaya devam ediyoruz.
              </p>
              <Link href="/kurumsal" className="button-primary">
                Daha Fazla Bilgi
              </Link>
            </div>
            <div className="relative h-96">
              <Image
                src="/about-image.jpg"
                alt="Un Fabrikası"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">İletişime Geçin</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Ürünlerimiz hakkında bilgi almak veya iş birliği fırsatları için bizimle iletişime geçebilirsiniz.
          </p>
          <Link href="/iletisim" className="button-primary">
            İletişim Sayfası
          </Link>
        </div>
      </section>

      {/* Galeri Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Galeri</h2>
          
          {/* Kategori Filtreleri */}
          <div className="flex justify-center gap-4 mb-8">
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
            <div className="text-center text-red-600 mb-8">
              {error}
            </div>
          )}

          {/* Yükleme Göstergesi */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Görsel Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group overflow-hidden rounded-lg shadow-lg"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <Image
                        src={image.image}
                        alt="Gallery image"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Daha Fazla Butonu */}
              <div className="text-center mt-8">
                <Link
                  href="/galeri"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tüm Görselleri Gör
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
