import React from 'react';
import { FaTshirt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 justify-center md:justify-start">
              <FaTshirt /> Miss Lily 2
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Premium ladies wear collection for modern women who value style, comfort, and elegance.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="/products" className="hover:text-white transition-colors duration-200">Products</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6">Categories</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="/products" className="hover:text-white transition-colors duration-200">Dresses</a></li>
              <li><a href="/products" className="hover:text-white transition-colors duration-200">Tops</a></li>
              <li><a href="/products" className="hover:text-white transition-colors duration-200">Bottoms</a></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
            <ul className="flex justify-center md:justify-start items-center gap-6 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Facebook</a></li>
    
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Miss Lily 2. All rights reserved. | Premium Ladies Wear</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
