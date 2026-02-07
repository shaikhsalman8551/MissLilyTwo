import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InquiryModal from './InquiryModal';

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [mainImage, setMainImage] = useState(product.images?.[0] || '');
  const navigate = useNavigate();

  const originalPrice = parseFloat(product.price) || 0;
  const discountPercent = parseFloat(product.discount) || 0;
  const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-modern group">
        {/* Image Section */}
        <div className="relative bg-gray-200 h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden cursor-pointer"
             onClick={() => navigate(`/product/${product.id}`)}>
          <img
            src={mainImage || 'https://via.placeholder.com/300x400?text=Product+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse-slow">
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* Thumbnail images */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 p-3 bg-gray-50 overflow-x-auto">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumbnail-${idx}`}
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover cursor-pointer rounded-lg hover:opacity-75 transition border-2 border-transparent hover:border-pink-500"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        )}

        {/* Product Details */}
        <div className="p-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 truncate group-hover:text-pink-600 transition-colors">{product.name}</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

          {/* Price Section */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-pink-600">₹{discountedPrice.toFixed(2)}</span>
            {discountPercent > 0 && (
              <span className="text-lg text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Category Badge */}
          {product.category && (
            <p className="text-sm bg-pink-100 text-pink-700 px-3 py-1 rounded-full inline-block mb-4 font-medium">
              {product.category}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all font-semibold transform hover:scale-105 btn-modern"
            >
              Ask Details
            </button>
            <button 
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-all font-semibold transform hover:scale-105"
            >
              View Details
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
