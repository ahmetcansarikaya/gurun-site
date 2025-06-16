'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    company: {
      name: 'Gürün Un',
      description: 'Kaliteli un üretimi ve satışı yapan güvenilir firma.',
      address: 'Kapıkaya Mücavir Alan Mah. İpekyolu Sokak No: 32/A, Kapıkaya/Amasya Merkez/Amasya',
      phone: '(0358) 232 40 26',
      email: 'info@gurunun.com',
      website: 'www.gurunun.com',
    },
    social: {
      facebook: 'https://facebook.com/gurunun',
      twitter: 'https://twitter.com/gurunun',
      instagram: 'https://instagram.com/gurunun',
      linkedin: 'https://linkedin.com/company/gurunun',
    },
    contact: {
      formEmail: 'iletisim@gurunun.com',
      supportEmail: 'destek@gurunun.com',
      workingHours: 'Pazartesi - Cuma: 09:00 - 18:00',
    },
  });

  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Ayarları localStorage'dan yükle
  useEffect(() => {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Ayarları localStorage'a kaydet
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      setSaveMessage('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      setSaveMessage('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Ayarlar</h1>
        <div className="flex items-center space-x-4">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('başarıyla') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('company')}
            className={`${
              activeTab === 'company'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Şirket Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`${
              activeTab === 'social'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Sosyal Medya
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            İletişim Ayarları
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Şirket Adı</label>
              <input
                type="text"
                value={settings.company.name}
                onChange={(e) => setSettings({ ...settings, company: { ...settings.company, name: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Açıklama</label>
              <textarea
                rows={3}
                value={settings.company.description}
                onChange={(e) => setSettings({ ...settings, company: { ...settings.company, description: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adres</label>
              <input
                type="text"
                value={settings.company.address}
                onChange={(e) => setSettings({ ...settings, company: { ...settings.company, address: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                  type="text"
                  value={settings.company.phone}
                  onChange={(e) => setSettings({ ...settings, company: { ...settings.company, phone: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <input
                  type="email"
                  value={settings.company.email}
                  onChange={(e) => setSettings({ ...settings, company: { ...settings.company, email: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="text"
                value={settings.company.website}
                onChange={(e) => setSettings({ ...settings, company: { ...settings.company, website: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook</label>
              <input
                type="url"
                value={settings.social.facebook}
                onChange={(e) => setSettings({ ...settings, social: { ...settings.social, facebook: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter</label>
              <input
                type="url"
                value={settings.social.twitter}
                onChange={(e) => setSettings({ ...settings, social: { ...settings.social, twitter: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instagram</label>
              <input
                type="url"
                value={settings.social.instagram}
                onChange={(e) => setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
              <input
                type="url"
                value={settings.social.linkedin}
                onChange={(e) => setSettings({ ...settings, social: { ...settings.social, linkedin: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">İletişim Formu E-posta</label>
              <input
                type="email"
                value={settings.contact.formEmail}
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, formEmail: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destek E-posta</label>
              <input
                type="email"
                value={settings.contact.supportEmail}
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, supportEmail: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Çalışma Saatleri</label>
              <input
                type="text"
                value={settings.contact.workingHours}
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, workingHours: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 