import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllContactMessages, updateContactMessageStatus } from '../services/firebaseService';
import { formatDistanceToNow } from 'date-fns';

const ContactMessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin-login');
      return;
    }
    fetchMessages();
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      const msgs = await getAllContactMessages();
      setMessages(msgs);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await updateContactMessageStatus(id, 'read');
      await fetchMessages();
    } catch (error) {
      alert('Error updating message: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-100 border-b">
                <p className="text-sm text-gray-600">Total Messages: {messages.length}</p>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-gray-500">Loading messages...</div>
                ) : messages.length > 0 ? (
                  messages.map(msg => (
                    <button
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === 'unread') {
                          handleMarkAsRead(msg.id);
                        }
                      }}
                      className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${selectedMessage?.id === msg.id ? 'bg-pink-50 border-l-4 border-pink-600' : ''} ${msg.status === 'unread' ? 'bg-yellow-50' : ''}`}
                    >
                      <h4 className="font-semibold text-gray-800 truncate">{msg.fullName}</h4>
                      <p className="text-sm text-gray-600 truncate">{msg.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {msg.createdAt?.toDate?.() ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : 'Unknown'}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">No messages found</div>
                )}
              </div>
            </div>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Message Details</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-800">{selectedMessage.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                          {selectedMessage.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-800">{selectedMessage.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-800">
                        {selectedMessage.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Subject</p>
                    <p className="font-semibold text-gray-800">{selectedMessage.subject}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Message</p>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg mt-2">{selectedMessage.message}</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
                    >
                      Reply via Email
                    </a>
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-center font-semibold"
                    >
                      Message on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessagesPage;
