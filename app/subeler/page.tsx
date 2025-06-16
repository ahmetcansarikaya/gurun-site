export default function Subeler() {
  return (
    <div className="container-custom section-padding">
      <h1 className="text-4xl font-bold mb-8">Şubelerimiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Merkez Fabrika</h2>
          <p className="text-gray-600 mb-2">Adres: Kapıkaya Mücavir Alan Mah. İpekyolu Sokak No: 32/A, Kapıkaya/Amasya Merkez/Amasya</p>
          <p className="text-gray-600 mb-2">Telefon: (0358) 232 40 26</p>
          <p className="text-gray-600">E-posta: info@gurun.com</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Anadolu Şubesi</h2>
          <p className="text-gray-600 mb-2">Adres: Sanayi Mahallesi, Üretim Caddesi No: 45</p>
          <p className="text-gray-600 mb-2">Telefon: (0312) 987 65 43</p>
          <p className="text-gray-600">E-posta: anadolu@gurun.com</p>
        </div>
      </div>
    </div>
  )
} 