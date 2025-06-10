import Image from 'next/image';

export default function Kurumsal() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Kurumsal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Hakkımızda</h2>
          <p className="text-gray-600 mb-6">
            30 yılı aşkın tecrübemizle un sektöründe kaliteli üretim ve müşteri memnuniyetini ön planda tutuyoruz. 
            Modern tesislerimiz ve uzman kadromuzla Türkiye'nin önde gelen un üreticilerinden biriyiz.
          </p>
          <p className="text-gray-600">
            Misyonumuz, en kaliteli unu en uygun fiyatlarla müşterilerimize sunmak, 
            vizyonumuz ise sektörde lider konuma ulaşmaktır.
          </p>
        </div>
        
        <div className="relative h-[400px]">
          <Image
            src="/kurumsal.jpg"
            alt="Kurumsal"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-8">Değerlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Kalite</h3>
            <p className="text-gray-600">
              En yüksek kalite standartlarında üretim yapıyoruz.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Güvenilirlik</h3>
            <p className="text-gray-600">
              Müşterilerimize karşı her zaman dürüst ve şeffaf davranıyoruz.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Yenilikçilik</h3>
            <p className="text-gray-600">
              Sürekli kendimizi geliştiriyor ve yenilikleri takip ediyoruz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 