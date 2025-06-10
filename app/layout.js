import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Gür Un Fabrikası - Kaliteli Un Üretimi',
  description: 'Gür Un Fabrikası, yüksek kaliteli un üretimi ile Türkiye\'nin önde gelen un fabrikalarından biridir.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <div className="container-custom">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="Un Fabrikası Logo"
                    width={150}
                    height={50}
                    className="object-contain"
                  />
                </Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Anasayfa
                </Link>
                <Link href="/kurumsal" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Kurumsal
                </Link>
                <Link href="/urunler" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Ürünler
                </Link>
                <Link href="/galeri" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Galeri
                </Link>
                <Link href="/bayiler" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Bayiler
                </Link>
                <Link href="/bilgi-bankasi" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Bilgi Bankası
                </Link>
                <Link href="/iletisim" className="text-gray-700 hover:text-blue-600 transition-colors">
                  İletişim
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
