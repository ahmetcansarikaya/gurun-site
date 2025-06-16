'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [stats, setStats] = useState({
    products: 0,
    messages: 0,
    gallery: 0,
    knowledge: 0,
    hero: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('adminAuth');
      if (auth !== 'true') {
        window.location.href = '/admin/login';
        return;
      }
      fetchStats();
    };

    checkAuth();
  }, []);

  const fetchStats = async () => {
    try {
      // Ürün sayısı
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      
      // Mesaj sayısı
      const messagesResponse = await fetch('/api/messages');
      const messagesData = await messagesResponse.json();
      
      // Galeri sayısı
      const galleryResponse = await fetch('/api/gallery');
      const galleryData = await galleryResponse.json();
      
      // Bilgi bankası sayısı
      const knowledgeResponse = await fetch('/api/knowledge');
      const knowledgeData = await knowledgeResponse.json();

      // Hero görselleri sayısı
      const heroResponse = await fetch('/api/hero');
      const heroData = await heroResponse.json();

      setStats({
        products: productsData.products?.length || 0,
        messages: messagesData.messages?.length || 0,
        gallery: galleryData.images?.length || 0,
        knowledge: knowledgeData.length || 0,
        hero: heroData?.length || 0
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const quickLinks = [
    {
      title: 'Ürünler',
      description: 'Ürün yönetimi ve stok takibi',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      path: '/admin/urunler',
      color: 'bg-blue-500',
      count: stats.products
    },
    {
      title: 'Galeri',
      description: 'Görsel yönetimi ve kategoriler',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      path: '/admin/galeri',
      color: 'bg-green-500',
      count: stats.gallery
    },
    {
      title: 'Hero Görselleri',
      description: 'Ana sayfa hero görsel yönetimi',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      path: '/admin/hero',
      color: 'bg-indigo-500',
      count: stats.hero
    },
    {
      title: 'Mesajlar',
      description: 'İletişim formu mesajları',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      path: '/admin/mesajlar',
      color: 'bg-purple-500',
      count: stats.messages
    },
    {
      title: 'Bilgi Bankası',
      description: 'Bilgi bankası yönetimi',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      path: '/admin/bilgi-bankasi',
      color: 'bg-yellow-500',
      count: stats.knowledge
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Yönetim Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quickLinks.map((link, index) => (
          <Link
            key={index}
            href={link.path}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{link.description}</p>
              </div>
              <div className={`${link.color} p-3 rounded-full`}>
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={link.icon}
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500">
                Toplam: {link.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 