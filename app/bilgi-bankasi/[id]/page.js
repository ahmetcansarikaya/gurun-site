'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function MakaleDetay() {
  const params = useParams();
  const makaleId = parseInt(params.id);

  const makaleler = [
    {
      id: 1,
      baslik: 'Un Çeşitleri ve Kullanım Alanları',
      ozet: 'Farklı un çeşitleri ve bunların kullanım alanları hakkında detaylı bilgi.',
      icerik: `Un çeşitleri, buğdayın öğütülme yöntemine ve kullanım amacına göre farklılık gösterir. En yaygın un çeşitleri şunlardır:

1. Ekmeklik Un:
- Protein oranı: %11-13
- Kullanım alanları: Ekmek, simit, poğaça
- Özellikler: Yüksek gluten içeriği, güçlü hamur yapısı

2. Pastalık Un:
- Protein oranı: %8-10
- Kullanım alanları: Kek, pasta, börek
- Özellikler: Düşük gluten içeriği, yumuşak dokulu ürünler

3. Tam Buğday Unu:
- Protein oranı: %13-14
- Kullanım alanları: Sağlıklı ekmek, diyet ürünleri
- Özellikler: Kepek ve ruşeym içerir, yüksek besin değeri

4. Özel Amaçlı Unlar:
- Pizza unu
- Makarna unu
- Bisküvi unu
- Self-raising un

Her un çeşidinin kendine özgü özellikleri ve kullanım alanları bulunmaktadır. Doğru un seçimi, ürünün kalitesini ve lezzetini doğrudan etkiler.`,
      tarih: '15 Mart 2024'
    },
    {
      id: 2,
      baslik: 'Unun Besin Değerleri',
      ozet: 'Unun içerdiği besin değerleri ve sağlığa faydaları.',
      icerik: `Un, temel besin maddelerinden biri olarak zengin bir besin profiline sahiptir. İşte unun besin değerleri ve sağlığa faydaları:

Besin Değerleri (100g):
- Enerji: 340 kcal
- Protein: 10-13g
- Karbonhidrat: 72-75g
- Yağ: 1-2g
- Lif: 2-3g
- Vitaminler: B1, B2, B3, B6, E
- Mineraller: Demir, Magnezyum, Çinko, Selenyum

Sağlığa Faydaları:
1. Enerji Kaynağı:
- Kompleks karbonhidratlar içerir
- Uzun süreli enerji sağlar
- Kan şekerini dengeler

2. Protein İçeriği:
- Kas gelişimine katkıda bulunur
- Hücre yenilenmesini destekler
- Bağışıklık sistemini güçlendirir

3. Vitamin ve Mineraller:
- B grubu vitaminleri sinir sistemi için önemli
- Demir içeriği kansızlığı önler
- Magnezyum kemik sağlığını destekler

4. Lif İçeriği:
- Sindirim sistemini düzenler
- Tokluk hissi sağlar
- Kolesterol seviyesini dengeler

Tam buğday unu, beyaz una göre daha yüksek besin değerine sahiptir ve sağlık açısından daha faydalıdır.`,
      tarih: '10 Mart 2024'
    },
    {
      id: 3,
      baslik: 'Un Üretim Süreci',
      ozet: 'Modern un üretim süreci ve kalite kontrol aşamaları.',
      icerik: `Modern un üretim süreci, buğdayın tarladan sofraya uzanan yolculuğunda birçok aşamadan geçer. İşte detaylı üretim süreci:

1. Buğday Alımı ve Depolama:
- Kalite kontrol testleri
- Nem ve sıcaklık kontrolü
- Zararlı böcek kontrolü
- Depolama koşullarının optimizasyonu

2. Temizleme ve Hazırlama:
- Yabancı madde ayırma
- Taş ve metal ayırma
- Buğday yıkama
- Nemlendirme ve dinlendirme

3. Öğütme Süreci:
- Kırma valsleri
- İnce öğütme
- Eleme ve sınıflandırma
- Kepek ayırma

4. Kalite Kontrol:
- Protein analizi
- Nem tayini
- Sedimantasyon testi
- Gluten kalitesi kontrolü
- Renk analizi

5. Paketleme ve Depolama:
- Otomatik paketleme
- Ağırlık kontrolü
- Raf ömrü belirleme
- Depolama koşulları

Modern un fabrikalarında:
- Tam otomatik üretim hatları
- Sürekli kalite kontrol sistemleri
- HACCP standartları
- ISO 9001 kalite yönetim sistemi
- Çevre dostu üretim teknolojileri

Bu süreçler, yüksek kaliteli ve güvenli un üretimini sağlar.`,
      tarih: '5 Mart 2024'
    }
  ];

  const makale = makaleler.find(m => m.id === makaleId);

  if (!makale) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Makale Bulunamadı</h1>
          <p className="text-gray-600 mb-8">Aradığınız makale bulunamadı.</p>
          <Link 
            href="/bilgi-bankasi"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Bilgi Bankasına Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/bilgi-bankasi"
          className="text-blue-600 hover:text-blue-800 font-medium mb-8 inline-block"
        >
          ← Bilgi Bankasına Dön
        </Link>
        
        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">{makale.baslik}</h1>
          <div className="text-gray-500 mb-8">{makale.tarih}</div>
          
          <div className="text-gray-800 space-y-6">
            {makale.icerik.split('\n\n').map((paragraf, index) => {
              // Check if the paragraph starts with a number (like "1.", "2.", etc.)
              if (/^\d+\./.test(paragraf.trim())) {
                return (
                  <div key={index} className="mb-6">
                    {paragraf.split('\n').map((line, lineIndex) => {
                      if (lineIndex === 0) {
                        // This is the heading line
                        return (
                          <h2 key={lineIndex} className="text-xl font-semibold mb-3 text-gray-900">
                            {line}
                          </h2>
                        );
                      } else if (line.trim().startsWith('-')) {
                        // This is a bullet point
                        return (
                          <p key={lineIndex} className="ml-4 mb-2 text-gray-700">
                            {line}
                          </p>
                        );
                      } else {
                        // Regular line
                        return (
                          <p key={lineIndex} className="mb-2 text-gray-700">
                            {line}
                          </p>
                        );
                      }
                    })}
                  </div>
                );
              } else {
                // Regular paragraph
                return (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraf}
                  </p>
                );
              }
            })}
          </div>
        </article>
      </div>
    </div>
  );
} 