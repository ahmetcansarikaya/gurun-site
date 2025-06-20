'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Bayiler() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('all');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchDealers();
  }, [selectedCity]);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dealers?city=${selectedCity}`);
      if (!response.ok) {
        throw new Error('Bayiler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setDealers(Array.isArray(data) ? data : data.dealers || []);
      
      // Şehirleri ayarla
      if (Array.isArray(data)) {
        const uniqueCities = [...new Set(data.map(dealer => dealer.city))];
        setCities(uniqueCities);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      setDealers([]);
    } finally {
      setLoading(false);
    }
  };

  const lokasyonlar = [
    {
      id: 1,
      sehir: 'Amasya',
      adres: 'Kapıkaya Mücavir Alan Mah. İpekyolu Sokak No:32/A, Merkez/Amasya',
      telefon: '+90 358 232 40 26',
      tip: 'Bayi'
    },
    {
      id: 2,
      sehir: 'Amasya',
      adres: 'HACILAR MEYDANI MAHALLESİ YAVUZ ACAR CADDESİ NO 30 / MERKEZ AMASYA',
      telefon: '+90 358 221 00 21',
      tip: 'Şube'
    },
    {
      id: 3,
      sehir: 'Amasya',
      adres: 'BAĞLICA KÖYÜ MÜCAVİR MEVKİİ, KIZILIRMAK SOKAK NO:64-66 MERKEZ AMASYA',
      telefon: '90 358 223 02 32',
      tip: 'Şube'
    },
    {
      id: 4,
      sehir: 'Amasya',
      adres: 'EZİNEPAZAR KÖYÜ, MERKEZ MEVKİİ KÜMEEVLER NO:501 / MERKEZ AMASYA',
      telefon: '+90 358 235 93 28',
      tip: 'Şube'
    }
  ];

  return (
    <div className="container-custom py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-black pt-16">Bayiler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lokasyonlar.map((lokasyon) => (
          <div key={lokasyon.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold">{lokasyon.sehir}</h2>
              <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {lokasyon.tip}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{lokasyon.adres}</p>
            <p className="text-gray-600">{lokasyon.telefon}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 