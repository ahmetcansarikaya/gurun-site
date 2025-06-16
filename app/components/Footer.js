'use client';

import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        {/* Üst Kısım */}
        <div className="py-4 border-b border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo ve Açıklama */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold">Gür Un</h2>
              <p className="text-gray-400 text-xs">Kaliteli un üretiminde 50 yıllık tecrübe</p>
            </div>

            {/* İletişim Bilgileri */}
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+903582324026" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <FaPhone className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs">(0358) 232 40 26</span>
              </a>
              <a href="mailto:info@gurun.com" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs">info@gurun.com</span>
              </a>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">Kapıkaya Mücavir Alan Mah İpekyolu sokak no 32/a, 05000 Kapıkaya, Merkez/Amasya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Telif Hakkı */}
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Gür Un. Tüm hakları saklıdır.
            </p>

            {/* Sosyal Medya */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/GurUnSanayiiVeTicaretLtdStiAmasya/?locale=tr_TR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/gurunamasya/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* Hızlı Linkler */}
            <div className="flex gap-4">
              <Link href="/hakkimizda" className="text-xs text-gray-400 hover:text-white transition-colors">
                Hakkımızda
              </Link>
              <Link href="/urunler" className="text-xs text-gray-400 hover:text-white transition-colors">
                Ürünler
              </Link>
              <Link href="/iletisim" className="text-xs text-gray-400 hover:text-white transition-colors">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
