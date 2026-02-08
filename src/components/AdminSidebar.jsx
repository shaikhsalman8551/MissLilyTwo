import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTshirt, 
  FaBox, 
  FaTags, 
  FaInstagram, 
  FaClock, 
  FaEnvelope, 
  FaListAlt, 
  FaCog, 
  FaFolder, 
  FaComments,
  FaChartBar,
  FaTimes,
  FaBars,
  FaHome
} from 'react-icons/fa';

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FaHome,
      path: '/admin/dashboard',
      color: 'text-gray-600'
    },
    {
      title: 'Products',
      icon: FaBox,
      path: '/admin/products',
      color: 'text-pink-600'
    },
    {
      title: 'Categories',
      icon: FaTags,
      path: '/admin/categories',
      color: 'text-blue-600'
    },
    {
      title: 'Inquiries',
      icon: FaListAlt,
      path: '/admin/inquiries',
      color: 'text-yellow-600'
    },
    {
      title: 'Messages',
      icon: FaEnvelope,
      path: '/admin/contact-messages',
      color: 'text-green-600'
    },
    {
      title: 'Instagram',
      icon: FaInstagram,
      path: '/admin/instagram',
      color: 'text-purple-600'
    },
    {
      title: 'Business Hours',
      icon: FaClock,
      path: '/admin/business-hours',
      color: 'text-indigo-600'
    },
    {
      title: 'Settings',
      icon: FaCog,
      path: '/admin/contact-settings',
      color: 'text-gray-600'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
        w-64 flex flex-col
      `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 lg:p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg lg:text-xl font-bold">Admin Dashboard</h1>
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-gray-300 transition p-1"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <Icon className={`text-lg ${active ? 'text-pink-600' : item.color}`} />
                <span className={`font-medium text-sm lg:text-base ${active ? 'text-pink-700' : 'text-gray-700'}`}>
                  {item.title}
                </span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-pink-600 rounded-full"></div>
                )}
              </button>
            );
          })}
            <button
              onClick={handleLogout}
               className={`
                  w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200
 bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-sm
                
                
                `}
            >
              Logout
            </button>
        </nav>

        {/* Footer */}
        <div className="p-3 lg:p-4 border-t border-gray-200 flex-shrink-0">
          <div className="text-center text-xs text-gray-500">
            <p>© 2026 Miss Lily 2</p>
            <p className="mt-1">Admin Panel v1.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
