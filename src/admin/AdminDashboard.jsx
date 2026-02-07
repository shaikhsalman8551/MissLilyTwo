import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTshirt, FaBox, FaTags, FaInstagram, FaClock, FaEnvelope, FaArrowLeft, FaListAlt, FaCog, FaFolder, FaComments } from 'react-icons/fa';
import { getAllProducts, getAllCategories, getAllUserInquiries, getAllContactMessages } from '../services/firebaseService';
import { SimpleBarChart, SimplePieChart, StatsCard } from '../components/Charts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalInquiries: 0,
    totalContacts: 0
  });
  const [reports, setReports] = useState({
    recentProducts: [],
    recentInquiries: [],
    topCategories: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin-login');
      return;
    }
    fetchStats();
  },[])

    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const [products, categories, inquiries, contacts] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllUserInquiries(),
          getAllContactMessages()
        ]);

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalInquiries: inquiries.filter(inquiry => inquiry.status === 'pending').length,
          totalContacts: contacts.filter(contact => contact.status === 'unread').length
        });

        // Process reports data
        const recentProducts = products.slice(0, 5);
        const recentInquiries = inquiries.slice(0, 5);
        const recentMessages = contacts ? contacts.slice(0, 5) : []; // Use actual contact messages with fallback
        
        // Calculate top categories
        const categoryCount = {};
        products.forEach(product => {
          const categoryId = product.categoryId;
          categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
        });
        
        const topCategories = categories
          .map(cat => ({
            ...cat,
            productCount: categoryCount[cat.id] || 0
          }))
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 5);

        setReports({
          recentProducts,
          recentInquiries,
          recentMessages, // Use actual contact messages
          topCategories,
          monthlyStats: [] // Can be enhanced later
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

  

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
           
            <h1 className="text-2xl font-bold">Miss Lily 2 Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Sidebar Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 group"
          >
            <FaBox className="text-3xl text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-800">Products</h3>
            <p className="text-sm text-gray-600">Manage product catalog</p>
          </button>

          <button
            onClick={() => navigate('/admin/categories')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 group"
          >
            <FaTags className="text-3xl text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
            <p className="text-sm text-gray-600">Organize product categories</p>
          </button>

          <button
            onClick={() => navigate('/admin/inquiries')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 group"
          >
            <FaListAlt className="text-3xl text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-800">Inquiries</h3>
            <p className="text-sm text-gray-600">View customer inquiries</p>
          </button>

          <button
            onClick={() => navigate('/admin/contact-messages')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 group"
          >
            <FaEnvelope className="text-3xl text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
            <p className="text-sm text-gray-600">Contact form submissions</p>
          </button>

          <button
            onClick={() => navigate('/admin/instagram')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 group"
          >
            <FaInstagram className="text-3xl text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-800">Instagram</h3>
            <p className="text-sm text-gray-600">Manage Instagram settings</p>
         
         </button>

          <button
            onClick={() => navigate('/admin/business-hours')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
          >
            <FaClock className="text-3xl text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
        
            <h3 className="font-semibold text-gray-800">Business Hours</h3>
            <p className="text-sm text-gray-500">Manage hours</p>
          </button>

          <button
            onClick={() => navigate('/admin/contact-settings')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
          >
             <FaCog className="text-3xl text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
         
            <h3 className="font-semibold text-gray-800">Settings</h3>
            <p className="text-sm text-gray-500">Contact settings</p>
          </button>
        </div>

   

        {/* Reports Section */}
        {activeTab === 'reports' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaChartBar /> Reports & Analytics
            </h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Products"
                value={stats.totalProducts}
                change={12}
                icon={FaBox}
                color="pink"
              />
              <StatsCard
                title="Categories"
                value={stats.totalCategories}
                change={5}
                icon={FaFolder}
                color="blue"
              />
              <StatsCard
                title="Pending Inquiries"
                value={stats.totalInquiries}
                change={-8}
                icon={FaComments}
                color="green"
              />
              <StatsCard
                title="Unread Messages"
                value={stats.totalContacts}
                change={15}
                icon={FaEnvelope}
                color="purple"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Categories Chart */}
              <SimpleBarChart
                title="Top Categories by Product Count"
                data={reports.topCategories.map(cat => ({
                  label: cat.name,
                  value: cat.productCount
                }))}
                color="pink"
              />
              
              {/* Category Distribution Pie Chart */}
              <SimplePieChart
                title="Category Distribution"
                data={reports.topCategories.map(cat => ({
                  label: cat.name,
                  value: cat.productCount
                }))}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Products */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBox /> Recent Products
                </h3>
                <div className="space-y-3">
                  {reports.recentProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">₹{product.price}</p>
                      </div>
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaComments /> Recent Inquiries
                </h3>
                <div className="space-y-3">
                  {reports.recentInquiries.map((inquiry, index) => (
                    <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 truncate">{inquiry.fullName}</p>
                        <p className="text-sm text-gray-500">{inquiry.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        inquiry.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaChartLine /> Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Total Products</span>
                    <span className="text-2xl font-bold">{stats.totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Active Categories</span>
                    <span className="text-2xl font-bold">{stats.totalCategories}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Pending Inquiries</span>
                    <span className="text-2xl font-bold">{stats.totalInquiries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Unread Messages</span>
                    <span className="text-2xl font-bold">{stats.totalContacts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Section (default) */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer"
                   onClick={() => navigate('/admin/products')}>
                <div className="flex items-center justify-between mb-4">
                  <FaBox className="text-3xl opacity-80" />
                  <span className="text-2xl font-bold">{stats.totalProducts}</span>
                </div>
                <h3 className="text-lg font-semibold">Total Products</h3>
                <p className="text-sm opacity-90">Click to manage →</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer"
                   onClick={() => navigate('/admin/categories')}>
                <div className="flex items-center justify-between mb-4">
                  <FaFolder className="text-3xl opacity-80" />
                  <span className="text-2xl font-bold">{stats.totalCategories}</span>
                </div>
                <h3 className="text-lg font-semibold">Categories</h3>
                <p className="text-sm opacity-90">Click to manage →</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer"
                   onClick={() => navigate('/admin/inquiries')}>
                <div className="flex items-center justify-between mb-4">
                  <FaComments className="text-3xl opacity-80" />
                  <span className="text-2xl font-bold">{stats.totalInquiries}</span>
                </div>
                <h3 className="text-lg font-semibold">Pending Inquiries</h3>
                <p className="text-sm opacity-90">Click to review →</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer"
                   onClick={() => navigate('/admin/contact-messages')}>
                <div className="flex items-center justify-between mb-4">
                  <FaEnvelope className="text-3xl opacity-80" />
                  <span className="text-2xl font-bold">{stats.totalContacts}</span>
                </div>
                <h3 className="text-lg font-semibold">Unread Messages</h3>
                <p className="text-sm opacity-90">Click to view →</p>
              </div>
            </div>

            {/* Latest Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Products */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaBox className="text-pink-600" />
                    Latest Products
                  </h3>
                  <button
                    onClick={() => navigate('/admin/products')}
                    className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {reports.recentProducts.slice(0, 3).map((product, index) => (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer hover:shadow-md"
                      onClick={() => navigate(`/admin/products?edit=${product.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">₹{product.price}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                  {reports.recentProducts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No products yet</p>
                  )}
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaComments className="text-pink-600" />
                    Recent Inquiries
                  </h3>
                  <button
                    onClick={() => navigate('/admin/inquiries')}
                    className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {reports.recentInquiries.slice(0, 3).map((inquiry, index) => (
                    <div 
                      key={inquiry.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer hover:shadow-md"
                      onClick={() => navigate(`/admin/inquiries?view=${inquiry.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 truncate">{inquiry.fullName}</p>
                        <p className="text-sm text-gray-500">{inquiry.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        inquiry.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                  ))}
                  {reports.recentInquiries.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No inquiries yet</p>
                  )}
                </div>
              </div>

              {/* Recent Contact Messages */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaEnvelope className="text-pink-600" />
                    Recent Messages
                  </h3>
                  <button
                    onClick={() => navigate('/admin/contact-messages')}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {reports.recentMessages && reports.recentMessages.slice(0, 3).map((message, index) => (
                    <div 
                      key={message.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer hover:shadow-md"
                      onClick={() => navigate(`/admin/contact-messages?view=${message.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 truncate">{message.name || message.fullName || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{message.email}</p>
                        <p className="text-xs text-gray-400 mt-1 truncate">{message.message || message.subject || 'No subject'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        message.status === 'unread' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message.status || 'new'}
                      </span>
                    </div>
                  ))}
                  {(!reports.recentMessages || reports.recentMessages.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No messages yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions - Removed redundant section since stats cards are now clickable */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
