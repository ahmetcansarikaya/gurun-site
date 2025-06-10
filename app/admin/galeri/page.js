'use client';

import { useState, useEffect } from 'react';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Fabrika',
    image: null,
    preview: null
  });
  const [isUploading, setIsUploading] = useState(false);

  const categories = ['Tümü', 'Fabrika', 'Üretim', 'Ürünler', 'Etkinlikler'];

  // Görselleri veritabanından yükle
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Görseller yüklenirken hata:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Dosya boyutu 10MB\'dan küçük olmalıdır.');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir görsel dosyası seçin.');
        return;
      }

      setUploadForm({
        ...uploadForm,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.category || !uploadForm.image) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsUploading(true);

    try {
      // Görseli base64'e çevir
      const reader = new FileReader();
      reader.readAsDataURL(uploadForm.image);
      reader.onloadend = async () => {
        const base64Image = reader.result;

        // Veritabanına kaydet
        const response = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: uploadForm.title,
            category: uploadForm.category,
            image: base64Image,
            date: new Date().toISOString().split('T')[0]
          }),
        });

        if (response.ok) {
          // Görselleri yeniden yükle
          fetchImages();

          // Formu sıfırla ve modalı kapat
          setUploadForm({
            title: '',
            category: 'Fabrika',
            image: null,
            preview: null
          });
          setIsUploadModalOpen(false);
        } else {
          throw new Error('Görsel yüklenemedi');
        }
      };
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      alert('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Bu görseli silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch('/api/gallery', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: imageId }),
        });

        if (response.ok) {
          fetchImages();
        } else {
          throw new Error('Görsel silinemedi');
        }
      } catch (error) {
        console.error('Görsel silme hatası:', error);
        alert('Görsel silinirken bir hata oluştu.');
      }
    }
  };

  const filteredImages = selectedCategory === 'Tümü' 
    ? images 
    : images.filter(image => image.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Galeri</h1>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Görsel Yükle
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div key={image.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="w-full h-48">
              <img
                src={image.image}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{image.title}</h3>
              <p className="text-sm text-gray-500">{image.category}</p>
              <p className="text-sm text-gray-500 mt-1">{image.date}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Görsel Yükle</h3>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Görsel Başlığı</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kategori</label>
                  <select 
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Fabrika</option>
                    <option>Üretim</option>
                    <option>Ürünler</option>
                    <option>Etkinlikler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Görsel</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {uploadForm.preview ? (
                        <div className="w-full h-48">
                          <img
                            src={uploadForm.preview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setUploadForm({ ...uploadForm, image: null, preview: null })}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Görseli Kaldır
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Dosya Yükle</span>
                              <input 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                className="sr-only" 
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">veya sürükleyip bırakın</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF max 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn-primary"
              >
                {isUploading ? 'Yükleniyor...' : 'Görsel Yükle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 