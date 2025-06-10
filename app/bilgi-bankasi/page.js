export default function BilgiBankasi() {
  const makaleler = [
    {
      id: 1,
      baslik: 'Un Çeşitleri ve Kullanım Alanları',
      ozet: 'Farklı un çeşitleri ve bunların kullanım alanları hakkında detaylı bilgi.',
      tarih: '15 Mart 2024'
    },
    {
      id: 2,
      baslik: 'Unun Besin Değerleri',
      ozet: 'Unun içerdiği besin değerleri ve sağlığa faydaları.',
      tarih: '10 Mart 2024'
    },
    {
      id: 3,
      baslik: 'Un Üretim Süreci',
      ozet: 'Modern un üretim süreci ve kalite kontrol aşamaları.',
      tarih: '5 Mart 2024'
    }
  ];

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Bilgi Bankası</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {makaleler.map((makale) => (
          <div key={makale.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">{makale.baslik}</h2>
            <p className="text-gray-600 mb-4">{makale.ozet}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{makale.tarih}</span>
              <button className="text-blue-600 hover:text-blue-800">
                Devamını Oku
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 