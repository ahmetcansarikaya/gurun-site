import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/logo.png" 
                alt="Gür Un Logo" 
                width={40} 
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-white">Gür Un</span>
            </div>
            <p className="text-sm text-gray-400">
              50 yıllık tecrübemizle kaliteli un üretiminde öncü firma olmaya devam ediyoruz.
            </p>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Kurumsal
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-600"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/hakkimizda" className="hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/misyon-vizyon" className="hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Misyon & Vizyon
                </Link>
              </li>
              <li>
                <Link href="/kalite-politikasi" className="hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Kalite Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Ürünler */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Ürünler
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-600"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/urunler/un" className="hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Un Çeşitleri
                </Link>
              </li>
              <li>
                <Link href="/urunler/kepek" className="hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Kepek
                </Link>
              </li>
              <li>
                <Link href="/urunler/ozel" className="hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Özel Ürünler
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              İletişim
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-600"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>0358 242 2640</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@gurun.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">
                  Kapıkaya Mücavir Alan Mah.<br />
                  İpekyolu Sokak No:32/A<br />
                  Merkez/Amasya
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sosyal Medya ve Telif Hakkı */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Gür Un Sanayi. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
