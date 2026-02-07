import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUserInquiries } from '../services/firebaseService';
import { formatDistanceToNow } from 'date-fns';

const UserInquiriesPage = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin-login');
      return;
    }
    fetchInquiries();
  }, [navigate]);

  const fetchInquiries = async () => {
    try {
      const inqs = await getAllUserInquiries();
      setInquiries(inqs);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      alert('Error loading inquiries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">💬 Product Inquiries</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-100 border-b">
                <p className="text-sm text-gray-600">Total Inquiries: {inquiries.length}</p>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-gray-500">Loading inquiries...</div>
                ) : inquiries.length > 0 ? (
                  inquiries.map(inq => (
                    <button
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${selectedInquiry?.id === inq.id ? 'bg-pink-50 border-l-4 border-pink-600' : ''}`}
                    >
                      <h4 className="font-semibold text-gray-800 truncate">{inq.fullName}</h4>
                      <p className="text-sm text-gray-600 truncate">{inq.productName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {inq.createdAt?.toDate?.() ? formatDistanceToNow(inq.createdAt.toDate(), { addSuffix: true }) : 'Unknown'}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">No inquiries found</div>
                )}
              </div>
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="lg:col-span-2">
            {selectedInquiry ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Inquiry Details</h2>
                
                <div className="space-y-4">
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                    <p className="text-sm text-gray-600">Product Inquired</p>
                    <p className="font-semibold text-lg text-gray-800">{selectedInquiry.productName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-800">{selectedInquiry.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">
                        <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                          {selectedInquiry.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-800">{selectedInquiry.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">City</p>
                      <p className="font-semibold text-gray-800">{selectedInquiry.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Preferred Size</p>
                      <p className="font-semibold text-gray-800">{selectedInquiry.size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Preferred Color</p>
                      <p className="font-semibold text-gray-800">{selectedInquiry.color}</p>
                    </div>
                  </div>

                  {selectedInquiry.message && (
                    <div>
                      <p className="text-sm text-gray-600">Additional Message</p>
                      <p className="text-gray-800 bg-gray-50 p-4 rounded-lg mt-2">{selectedInquiry.message}</p>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 pt-4">
                    Inquiry Date: {selectedInquiry.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
                    >
                      Reply via Email
                    </a>
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-center font-semibold"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Select an inquiry to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInquiriesPage;
