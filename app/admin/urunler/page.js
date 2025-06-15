const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.name || !formData.price || !formData.category || !formData.image) {
    setError('Lütfen tüm alanları doldurun');
    return;
  }

  try {
    setUploading(true);
    setError('');

    // Önce görseli yükle
    const imageFormData = new FormData();
    imageFormData.append('file', formData.image);

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: imageFormData
    });

    if (!uploadResponse.ok) {
      throw new Error('Görsel yüklenirken bir hata oluştu');
    }

    const uploadData = await uploadResponse.json();

    // Sonra ürünü ekle
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image: uploadData.url
      }),
    });

    if (!response.ok) {
      throw new Error('Ürün eklenirken bir hata oluştu');
    }

    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'un',
      image: null
    });
    fetchProducts();
  } catch (err) {
    console.error('Error adding product:', err);
    setError(err.message);
  } finally {
    setUploading(false);
  }
}; 