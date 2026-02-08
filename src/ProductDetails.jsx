import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "./services/firebaseService";
import UserInfoModal from "./UserInfoModal";
import {
  FaArrowLeft,
  FaWhatsapp,
  FaEnvelope,
  FaCheckCircle,
  FaTag,
} from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [magnifier, setMagnifier] = useState({ x: 0, y: 0, rect: null });
  const [showMagnifier, setShowMagnifier] = useState(false);

  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-pink-600 rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Product not found 😢
      </div>
    );
  }

  const mainImage =
    product.images?.[selectedImageIndex] ||
    "https://via.placeholder.com/600x800?text=Product+Image";

  // 🔍 Magnifier logic
  const updateMagnifier = (clientX, clientY) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setMagnifier({ x, y, rect });
  };

  const handleMouseMove = (e) => updateMagnifier(e.clientX, e.clientY);
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    setShowMagnifier(true);
    updateMagnifier(t.clientX, t.clientY);
  };
  const handleTouchMove = (e) => {
    const t = e.touches[0];
    updateMagnifier(t.clientX, t.clientY);
  };

  const getMagnifierStyle = () => {
    if (!magnifier.rect) return {};
    const size = 160;
    const zoom = 2.5;

    return {
      width: size,
      height: size,
      left: magnifier.x - size / 2,
      top: magnifier.y - size / 2,
      backgroundImage: `url(${mainImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${magnifier.rect.width * zoom}px ${
        magnifier.rect.height * zoom
      }px`,
      backgroundPosition: `-${magnifier.x * zoom - size / 2}px -${
        magnifier.y * zoom - size / 2
      }px`,
      borderRadius: "50%",
      border: "2px solid #ec4899",
      boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
      pointerEvents: "none",
      zIndex: 20,
    };
  };

  const handleWhatsAppShare = () => {
    const url = `${window.location.origin}/product/${product.id}`;
    const msg = ` ${product.name}\n${product.description}\n Price: ₹${product.price}\n\nView: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50 py-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-gray-600 hover:text-pink-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* 🖼️ IMAGE SECTION */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 relative">

            <div className="relative w-full flex justify-center">
              <img
                ref={imageRef}
                src={mainImage}
                alt={product.name}
                className="w-full max-h-[520px] object-contain rounded-xl select-none"

                // ❌ Disable save
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}

                // 🔍 Magnifier
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setShowMagnifier(false)}
              />

              {showMagnifier && magnifier.rect && (
                <div className="absolute" style={getMagnifierStyle()} />
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`h-20 w-full object-cover rounded-lg cursor-pointer border-2 transition-all ${
                      selectedImageIndex === i
                        ? "border-pink-500 scale-105"
                        : "border-gray-300 hover:border-pink-400"
                    }`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 📦 PRODUCT INFO SECTION */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-6 lg:sticky lg:top-6">

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Category & Code */}
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold flex items-center gap-1">
                  <FaTag /> {product.category}
                </span>
              )}
              {product.code && (
                <span className="px-4 py-1 bg-gray-900 text-white rounded-full text-sm font-bold">
                  #{product.code}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Price Card */}
         <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg flex flex-col gap-3">
  <div className="flex items-center gap-3 flex-wrap">

    {/* Final Price (after discount) */}
    <span className="text-4xl font-bold">
      ₹
      {(
        product.discount > 0
          ? product.price - (product.price * product.discount) / 100
          : product.price
      ).toFixed(2)}
    </span>

    {/* Original Price (strike) */}
    {product.discount > 0 && (
      <span className="text-lg line-through opacity-70">
        ₹{parseFloat(product.price || 0).toFixed(2)}
      </span>
    )}

    {/* Discount Badge */}
    {product.discount > 0 && (
      <span className="bg-black/30 px-3 py-1 rounded-full text-sm font-semibold">
        -{product.discount}%
      </span>
    )}
  </div>
</div>


            {/* Stock */}
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <FaCheckCircle />
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleWhatsAppShare}
                className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-105"
              >
                <FaWhatsapp className="inline mr-2" />
                Share 
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-105"
              >
                <FaEnvelope className="inline mr-2" />
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      <UserInfoModal />
    </div>
  );
};

export default ProductDetails;
