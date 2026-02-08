import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTshirt, FaBox, FaTags, FaInstagram, FaClock, FaEnvelope, FaArrowLeft, FaListAlt, FaCog, FaFolder, FaComments, FaChartBar, FaChartLine, FaBars } from 'react-icons/fa';
import { getAllProducts, getAllCategories, getAllUserInquiries, getAllContactMessages, subscribeToDashboardStats } from '../services/firebaseService';
import { SimpleBarChart, SimplePieChart, StatsCard } from '../components/Charts';
import { ShimmerStatsCard, ShimmerChart, ShimmerList, ShimmerGrid } from '../components/ShimmerEffects';
import AdminSidebar from '../components/AdminSidebar';
import ReportsPage from './ReportsPage';
import AdminLayout from '../components/AdminLayout';

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
  const [initialLoad, setInitialLoad] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin-login');
      return;
    }
    
    // Set up real-time subscription
    const unsubscribe = subscribeToDashboardStats((dashboardData) => {
      setStats({
        totalProducts: dashboardData.totalProducts,
        totalCategories: dashboardData.totalCategories,
        totalInquiries: dashboardData.totalInquiries,
        totalContacts: dashboardData.totalContacts
      });
      
      setReports({
        recentProducts: dashboardData.recentProducts,
        recentInquiries: dashboardData.recentInquiries,
        recentMessages: dashboardData.recentMessages,
        topCategories: dashboardData.topCategories,
        monthlyStats: [] // Can be enhanced later
      });
      
      setLoading(false);
      setInitialLoad(false);
    });
    
    // Initial fetch for immediate display
    fetchStats();
    
    return () => unsubscribe();
  }, [])

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

  

  return (
   
      // <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} >
      <AdminLayout title={"Dashboard"}>
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
       

   
         

        <div className=" pt-8 pb-12 max-w-full">
          {/* Removed redirect cards - now using sidebar */}

   

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {initialLoad ? (
                <ShimmerGrid cols={4} items={4} />
              ) : (
                <>
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                       onClick={() => navigate('/admin/products')}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <FaBox className="text-3xl opacity-80" />
                        <span className="text-2xl font-bold">{stats.totalProducts}</span>
                      </div>
                      <h3 className="text-lg font-semibold">Total Products</h3>
                      <p className="text-sm opacity-90">Click to manage →</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                       onClick={() => navigate('/admin/categories')}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <FaFolder className="text-3xl opacity-80" />
                        <span className="text-2xl font-bold">{stats.totalCategories}</span>
                      </div>
                      <h3 className="text-lg font-semibold">Categories</h3>
                      <p className="text-sm opacity-90">Click to manage →</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                       onClick={() => navigate('/admin/inquiries')}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <FaComments className="text-3xl opacity-80" />
                        <span className="text-2xl font-bold">{stats.totalInquiries}</span>
                      </div>
                      <h3 className="text-lg font-semibold">Pending Inquiries</h3>
                      <p className="text-sm opacity-90">Click to review →</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                       onClick={() => navigate('/admin/contact-messages')}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <FaEnvelope className="text-3xl opacity-80" />
                        <span className="text-2xl font-bold">{stats.totalContacts}</span>
                      </div>
                      <h3 className="text-lg font-semibold">Unread Messages</h3>
                      <p className="text-sm opacity-90">Click to view →</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Latest Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
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
                  {initialLoad ? (
                    <ShimmerList items={3} lines={2} />
                  ) : (
                    <>
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
                    </>
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
                  {initialLoad ? (
                    <ShimmerList items={3} lines={2} />
                  ) : (
                    <>
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
                    </>
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
                  {initialLoad ? (
                    <ShimmerList items={3} lines={3} />
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>

       <ReportsPage />
          </div>
        )}
        </div>
      </div>
      

      </AdminLayout>
  
  );
};

export default AdminDashboard;
