'use client';

import { useState, useEffect } from 'react';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, new, read, archived

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch('/api/messages', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });

        if (response.ok) {
          fetchMessages();
          if (selectedMessage?.id === id) {
            setSelectedMessage(null);
          }
        }
      } catch (error) {
        console.error('Mesaj silinirken hata:', error);
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mesajlar</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded ${
              filter === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Yeni
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded ${
              filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Okundu
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-2 rounded ${
              filter === 'archived' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Arşiv
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mesaj Listesi */}
        <div className="md:col-span-1 space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 rounded-lg cursor-pointer ${
                selectedMessage?.id === message.id
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white hover:bg-gray-50'
              } border ${
                message.status === 'new'
                  ? 'border-blue-500'
                  : message.status === 'read'
                  ? 'border-gray-300'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{message.subject}</h3>
                  <p className="text-sm text-gray-600">{message.name}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    message.status === 'new'
                      ? 'bg-blue-100 text-blue-800'
                      : message.status === 'read'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {message.status === 'new'
                    ? 'Yeni'
                    : message.status === 'read'
                    ? 'Okundu'
                    : 'Arşiv'}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {message.message}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {formatDate(message.created_at)}
              </p>
            </div>
          ))}
        </div>

        {/* Mesaj Detayı */}
        <div className="md:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                  <p className="text-gray-600">{selectedMessage.name}</p>
                  <p className="text-gray-600">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-gray-600">{selectedMessage.phone}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="new">Yeni</option>
                    <option value="read">Okundu</option>
                    <option value="archived">Arşiv</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Sil
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                {formatDate(selectedMessage.created_at)}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500">
              Mesaj seçilmedi
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 