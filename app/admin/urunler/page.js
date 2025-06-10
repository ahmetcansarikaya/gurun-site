'use client';

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Un',
    image: null,
    preview: null
  });
  const [isUploading, setIsUploading] = useState(false);

  const categories = ['Tümü', 'Un', 'Makarna', 'Bulgur', 'Diğer'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Dosya boyutu 10MB\'dan küçük olmalıdır.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir görsel dosyası seçin.');
        return;
      }

      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.image) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(formData.image);
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            image: base64Image
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Ürün eklenemedi');
        }

        await fetchProducts();
        setFormData({
          name: '',
          description: '',
          category: 'Un',
          image: null,
          preview: null
        });
        setIsModalOpen(false);
      };
    } catch (error) {
      console.error('Ürün ekleme hatası:', error);
      alert(error.message || 'Ürün eklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: productId }),
        });

        if (response.ok) {
          fetchProducts();
        } else {
          throw new Error('Ürün silinemedi');
        }
      } catch (error) {
        console.error('Ürün silme hatası:', error);
        alert('Ürün silinirken bir hata oluştu.');
      }
    }
  };

  const filteredProducts = selectedCategory === 'Tümü' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Ürünler</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Ürün Ekle
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="w-full h-48">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-sm text-gray-600 mt-2">{product.description}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(product._id)}
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {categories.filter(cat => cat !== 'Tümü').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ürün Görseli</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full"
                  required
                />
                {formData.preview && (
                  <img
                    src={formData.preview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                  {isUploading ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 