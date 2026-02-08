import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  //if admin logged in then hide header
  if (localStorage.getItem('adminLoggedIn')) {
    return null;
  }
  return (
    <header className="bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            {/* <img 
              src="/MissLilyTwoIcon.jpeg" 
              alt="Miss Lily 2 Logo" 
              className="h-8 w-auto transform transition-transform group-hover:scale-105"
            /> */}
            <div className="text-2xl font-bold transform transition-transform group-hover:scale-105">Miss Lily 2</div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 gap-2">
            <Link to="/" className="hover:text-pink-100 transition transform hover:scale-105">Home</Link>
            <Link to="/products" className="hover:text-pink-100 transition transform hover:scale-105">Products</Link>
            <Link to="/where-we-are" className="hover:text-pink-100 transition transform hover:scale-105">Where We Are</Link>
            <Link to="/showcase" className="hover:text-pink-100 transition transform hover:scale-105">Social Media</Link>
            <Link to="/contact" className="hover:text-pink-100 transition transform hover:scale-105">Contact Us</Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/10 focus-modern transition-all transform hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="text-2xl transform transition-transform">{isMenuOpen ? <FaTimes /> : <FaBars />}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav id="mobile-menu" className="md:hidden pb-4 space-y-2 pt-2 animate-slide-in">
            <Link to="/" className="block hover:text-pink-100 transition transform hover:translate-x-2">Home</Link>
            <Link to="/products" className="block hover:text-pink-100 transition transform hover:translate-x-2">Products</Link>
            <Link to="/where-we-are" className="block hover:text-pink-100 transition transform hover:translate-x-2">Where We Are</Link>
            <Link to="/showcase" className="block hover:text-pink-100 transition transform hover:translate-x-2">Social Media</Link>
            <Link to="/contact" className="block hover:text-pink-100 transition transform hover:translate-x-2">Contact Us</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
