import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaShoppingCart, FaEye } from 'react-icons/fa';
import InquiryModal from './InquiryModal';

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [mainImage, setMainImage] = useState(product.images?.[0] || '');
  const navigate = useNavigate();

  const originalPrice = parseFloat(product.price) || 0;
  const discountPercent = parseFloat(product.discount) || 0;
  const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);

  const handleWhatsAppShare = () => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const message = `Check out this product: ${product.name}\n\n${product.description}\n\nPrice: ₹${discountedPrice.toFixed(2)}${discountPercent > 0 ? ` (Discount: ${discountPercent}%)` : ''}\n\nView here: ${productUrl}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col transform hover:-translate-y-1 border border-gray-100">
        {/* WhatsApp Button - Always Visible */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleWhatsAppShare();
          }}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
          title="Share on WhatsApp"
        >
          <FaWhatsapp className="text-base text-green-600" />
        </button>

        {/* Image Section - Enhanced */}
        <div 
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden cursor-pointer flex-shrink-0"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={mainImage || 'https://via.placeholder.com/300x400?text=Product+Image'}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse-slow">
              -{discountPercent}%
            </div>
          )}
          
          {/* Stock Status Badge */}
          {product.stock !== undefined && (
            <div className="absolute bottom-4 left-4">
              {product.stock < 0 ? (
                <div className="bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  Out of Stock
                </div>
              ) : product.stock > 0 && product.stock < 10 ? (
                <div className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse-slow">
                  Only {product.stock} left
                </div>
              ) : product.stock >= 10 ? (
                <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  In Stock
                </div>
              ) : null}
            </div>
          )}

          {/* Product Code Badge */}
          {product?.code && (
            <div className="absolute top-16 right-4 bg-white/90 backdrop-blur-sm text-pink-600 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              {product.code}
            </div>
          )}
        </div>

        {/* Thumbnail images - Enhanced */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 p-4 bg-gray-50/50 border-t border-gray-100 overflow-x-auto">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                  mainImage === img 
                    ? 'border-pink-500 shadow-md scale-110' 
                    : 'border-transparent hover:border-gray-300 hover:scale-105'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMainImage(img);
                }}
              >
                <img
                  src={img}
                  alt={`thumbnail-${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Product Details - Enhanced */}
        <div className="p-5 sm:p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30">
          {/* Category Badge */}
          <div className="mb-3">
            {product.category && (
              <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                {product.category}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Product Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
            {product.description}
          </p>

          {/* Price Section - Enhanced */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                ₹{discountedPrice.toFixed(2)}
              </span>
              {discountPercent > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                Save ₹{(originalPrice - discountedPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Action Buttons - Enhanced */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <FaShoppingCart className="text-xs" />
              Ask Details
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className="flex-1 bg-white border-2 border-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <FaEye className="text-xs" />
              View
            </button>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showModal && (
        <InquiryModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
