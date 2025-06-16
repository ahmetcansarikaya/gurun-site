'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Urunler() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Ürünler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      // API'den gelen veriyi kontrol et ve dizi olarak ayarla
      setProducts(Array.isArray(data) ? data : data.products || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducts([]); // Hata durumunda boş dizi
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <Image
          src="/urunler-hero.jpg"
          alt="Ürünlerimiz"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">
                Ürünlerimiz
              </h1>
              <p className="text-lg md:text-xl mb-8 text-black">
                Yüksek kaliteli un ve un ürünleri
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ürünler Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ürünlerimiz</h2>

          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Yükleme Göstergesi */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-semibold">
                          {product.price} TL
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Henüz ürün eklenmemiş.
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 