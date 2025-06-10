'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['Tümü', 'Un', 'Kepek', 'İrmik', 'Mamüller'];

  // Ürünleri veritabanından yükle
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'Tümü' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Ürünlerimiz</h1>
        <p className="mt-2 text-gray-600">Yüksek kaliteli un ve unlu mamüller</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
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
          <div 
            key={product.id} 
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="w-full h-64">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-600">{product.price} TL</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'Stokta' : 'Tükendi'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="max-w-4xl w-full bg-white rounded-xl overflow-hidden">
            <div className="relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium text-gray-900">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedProduct.category}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedProduct.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-600">{selectedProduct.price} TL</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedProduct.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedProduct.stock > 0 ? 'Stokta' : 'Tükendi'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 