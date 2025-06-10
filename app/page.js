import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
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
    </main>
  );
}
