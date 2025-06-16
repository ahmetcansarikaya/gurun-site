'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    messages: 0,
    gallery: 0,
    knowledge: 0,
    hero: 0
  });
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchStats();
    }
    setIsLoading(false);
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
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      fetchStats();
    } else {
      setError('Kullanıcı adı veya şifre hatalı');
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Girişi
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Kullanıcı Adı
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Kullanıcı Adı"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Giriş Yap
              </button>
            </div>
          </form>
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
      path: '/admin/knowledge',
      color: 'bg-yellow-500',
      count: stats.knowledge
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Yönetim Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quickLinks.map((link, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${link.color} p-3 rounded-lg`}>
                <svg
                  className="w-6 h-6 text-white"
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
              <span className="text-2xl font-bold text-gray-900">{link.count}</span>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900">{link.title}</h2>
            <p className="text-gray-600 mb-4">{link.description}</p>
            <a
              href={link.path}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Yönet →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 