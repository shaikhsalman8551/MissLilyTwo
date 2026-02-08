import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import AdminLoader from './AdminLoader';

const AdminLayout = ({ children, title, loading = false, loadingMessage = 'Loading...' }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };
  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gray-900 text-white shadow-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-white hover:text-gray-300 transition"
              >
                <FaBars className="text-xl" />
              </button>
              <h1 className="text-lg font-bold">{title}</h1>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition text-sm"
            >
              Back
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-gray-900 text-white shadow-lg">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
                      <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Page Content */}
         <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <AdminLoader message={loadingMessage} />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
