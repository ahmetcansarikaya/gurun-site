import Image from 'next/image';
import Link from 'next/link';

export default function Kurumsal() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <Image
          src="/kurumsal-hero.jpg"
          alt="Kurumsal"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">
                Kurumsal
              </h1>
              <p className="text-lg md:text-xl mb-8 text-black">
                Gür Un Fabrikası'nın kurumsal bilgileri ve değerleri
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hakkımızda Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-black">Hakkımızda</h2>
              <p className="text-gray-600 mb-4">
                Gür Un Fabrikası, 1970 yılından bu yana Amasya'da faaliyet göstermektedir. 50 yılı aşkın tecrübemiz ile
                yüksek kaliteli un üretimi yaparak, müşterilerimize en iyi hizmeti sunmaktayız.
              </p>
              <p className="text-gray-600 mb-6">
                Modern teknoloji ve uzman kadromuz ile üretim süreçlerimizi sürekli iyileştirerek, sektörde öncü
                konumumuzu korumaktayız.
              </p>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/fabrika.jpg"
                alt="Gür Un Fabrikası"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Misyon */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-black">Misyonumuz</h3>
              <p className="text-gray-600">
                Yüksek kaliteli un üretimi ile müşterilerimize en iyi hizmeti sunmak, sektörde öncü konumumuzu
                korumak ve sürdürülebilir büyüme sağlamak.
              </p>
            </div>

            {/* Vizyon */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-black">Vizyonumuz</h3>
              <p className="text-gray-600">
                Türkiye'nin ve dünyanın önde gelen un üreticilerinden biri olmak, teknolojik yenilikleri takip ederek
                kalitemizi sürekli artırmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Değerlerimiz Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kalite */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Kalite</h3>
              <p className="text-gray-600">
                En yüksek kalite standartlarında üretim yaparak müşterilerimize en iyi hizmeti sunuyoruz.
              </p>
            </div>

            {/* Güvenilirlik */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Güvenilirlik</h3>
              <p className="text-gray-600">
                Müşterilerimize karşı dürüst ve şeffaf bir yaklaşım sergiliyoruz.
              </p>
            </div>

            {/* Yenilikçilik */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Yenilikçilik</h3>
              <p className="text-gray-600">
                Teknolojik gelişmeleri takip ederek sürekli kendimizi yeniliyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 