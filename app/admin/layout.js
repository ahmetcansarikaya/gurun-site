'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    window.location.href = '/admin';
  };

  if (!isAuthenticated && pathname !== '/admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/admin" className="text-xl font-bold text-gray-800">
                    Admin Panel
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/admin/urunler"
                    className={`${
                      pathname === '/admin/urunler'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Ürünler
                  </Link>
                  <Link
                    href="/admin/galeri"
                    className={`${
                      pathname === '/admin/galeri'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Galeri
                  </Link>
                  <Link
                    href="/admin/mesajlar"
                    className={`${
                      pathname === '/admin/mesajlar'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Mesajlar
                  </Link>
                  <Link
                    href="/admin/ayarlar"
                    className={`${
                      pathname === '/admin/ayarlar'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Ayarlar
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 