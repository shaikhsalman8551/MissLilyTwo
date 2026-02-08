import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FaEnvelope, FaPhone, FaTrash, FaEye, FaCheck, FaTimes, FaCalendar } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';

const InquiryManagement = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const inquiriesRef = collection(db, 'userInquiries');
      const q = query(inquiriesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const inquiriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      
      setInquiries(inquiriesList);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await deleteDoc(doc(db, 'userInquiries', inquiryId));
        setInquiries(inquiries.filter(inq => inq.id !== inquiryId));
      } catch (error) {
        console.error('Error deleting inquiry:', error);
        alert('Error deleting inquiry');
      }
    }
  };

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      await updateDoc(doc(db, 'userInquiries', inquiryId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setInquiries(inquiries.map(inq => 
        inq.id === inquiryId ? { ...inq, status: newStatus } : inq
      ));
      
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Error updating inquiry status');
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    switch (filter) {
      case 'pending':
        return inquiry.status === 'pending';
      case 'contacted':
        return inquiry.status === 'contacted';
      case 'completed':
        return inquiry.status === 'completed';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'contacted':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
    <AdminLayout title="Customer Inquiries">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 pt-2 mt-2">
        <div className="flex flex-wrap gap-2 mb-4">
          {['all', 'pending', 'contacted', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredInquiries.length} {filter === 'all' ? 'total' : filter} inquiries
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      ) : (
        /* Inquiries List */
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaEnvelope className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No inquiries found</p>
              <p className="text-sm text-gray-500">Customer inquiries will appear here</p>
            </div>
          ) : (
            filteredInquiries.map(inquiry => (
              <div key={inquiry.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {inquiry.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Inquiry ID: {inquiry.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      <FaCalendar className="inline mr-1" />
                      {inquiry.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Customer Information</p>
                    <p><strong>Name:</strong> {inquiry.fullName}</p>
                    <p><strong>Email:</strong> {inquiry.email}</p>
                    <p><strong>Phone:</strong> {inquiry.phone}</p>
                    <p><strong>City:</strong> {inquiry.city}</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700 mb-1">Product Details</p>
                    <p><strong>Product:</strong> {inquiry.productName || 'N/A'}</p>
                    <p><strong>Size:</strong> {inquiry.size || 'N/A'}</p>
                    <p><strong>Color:</strong> {inquiry.color || 'N/A'}</p>
                    {inquiry.message && (
                      <p><strong>Message:</strong> {inquiry.message}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </button>
                  
                  {inquiry.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry.id, 'completed')}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      <FaCheck className="mr-2" />
                      Mark Complete
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteInquiry(inquiry.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-pink-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-2xl font-bold hover:opacity-75"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedInquiry.fullName}</p>
                    <p><strong>Email:</strong> {selectedInquiry.email}</p>
                    <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
                    <p><strong>City:</strong> {selectedInquiry.city}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Product Inquiry</h3>
                  <div className="space-y-2">
                    <p><strong>Product:</strong> {selectedInquiry.productName || 'N/A'}</p>
                    <p><strong>Product ID:</strong> {selectedInquiry.productId || 'N/A'}</p>
                    <p><strong>Size:</strong> {selectedInquiry.size || 'N/A'}</p>
                    <p><strong>Color:</strong> {selectedInquiry.color || 'N/A'}</p>
                    {selectedInquiry.message && (
                      <p><strong>Message:</strong> {selectedInquiry.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
              <>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedInquiry.email);
                    alert('Email copied to clipboard!');
                  }}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <FaEnvelope className="mr-2" />
                  Copy Email
                </button>
                
                <button
                  onClick={() => window.open(`https://wa.me/918320953686?text=${encodeURIComponent(`Hi! I'm following up on your inquiry about ${selectedInquiry.productName}. My name is ${selectedInquiry.fullName}.`)}`, '_blank')}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  <FaPhone className="mr-2" />
                  WhatsApp
                </button>
                
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </>
              </div>
            </div>
          </div>
          </div>
        )}
     </AdminLayout>
    </>
 
  );
};

export default InquiryManagement;
