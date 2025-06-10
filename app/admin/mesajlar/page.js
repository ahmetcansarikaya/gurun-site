'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/messages?page=${pageNum}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setMessages(data.messages);
      } else {
        setMessages(prev => [...prev, ...data.messages]);
      }
      
      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Mesajlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setMessages(messages.filter(msg => msg._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Mesaj silinirken bir hata oluştu');
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMessages(nextPage);
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">İletişim Mesajları</h1>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Yükleme Göstergesi */}
      {loading && messages.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mesaj Listesi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?._id === message._id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {message.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {message.email}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {message.message}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Daha Fazla Yükle Butonu */}
              {hasMore && !loading && (
                <div className="p-4 text-center border-t">
                  <button
                    onClick={loadMore}
                    className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-lg transition-colors"
                  >
                    Daha Fazla Yükle
                  </button>
                </div>
              )}

              {/* Yükleme Göstergesi */}
              {loading && messages.length > 0 && (
                <div className="p-4 text-center border-t">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}
            </div>
          </div>

          {/* Mesaj Detayı */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedMessage.name}
                    </h2>
                    <p className="text-gray-500">{selectedMessage.email}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {formatDate(selectedMessage.createdAt)}
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
                Mesaj seçilmedi
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 