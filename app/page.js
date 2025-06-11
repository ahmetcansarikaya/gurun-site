import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import KnowledgeBase from './components/KnowledgeBase';

// Ana sayfa bileşeni
export default async function Home() {
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

      {/* Hakkımızda Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Hakkımızda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 mb-4">
                Gürün Ün olarak, müşterilerimize en kaliteli hizmeti sunmak için çalışıyoruz.
                Deneyimli ekibimiz ve modern altyapımız ile sektörde öncü çözümler sunuyoruz.
              </p>
              <Link
                href="/hakkimizda"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                Daha Fazla Bilgi
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="relative h-64 md:h-96">
              <Image
                src="/images/about.jpg"
                alt="Hakkımızda"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ürünler Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Ürünlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ürün kartları buraya gelecek */}
          </div>
        </div>
      </section>

      {/* Bilgi Bankası Section */}
      <KnowledgeBase />

      {/* İletişim Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">İletişime Geçin</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Adınız
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
