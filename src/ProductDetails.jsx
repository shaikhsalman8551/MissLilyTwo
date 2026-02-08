import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from './services/firebaseService';
import UserInfoModal from './UserInfoModal';
import { saveContactInquiry } from './services/contactService';
import { FaArrowLeft, FaWhatsapp, FaEnvelope, FaSearchPlus, FaCheckCircle } from 'react-icons/fa';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        // Detect mobile device
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (id) {
            fetchProduct();
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 border-t-transparent"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8 text-center">
                    <div className="text-4xl sm:text-6xl font-bold text-gray-800 mb-4">🛍️</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Product not found</h2>
                    <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
                    >
                        Browse All Products
                    </button>
                </div>
            </div>
        );
    }

    const mainImage = product.images && product.images.length > 0 ? product.images[selectedImageIndex] : 'https://via.placeholder.com/600x800?text=Product+Image';

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handleRequestInfo = () => {
        setModalOpen(true);
    };

    const handleContactUs = () => {
        navigate('/contact');
    };

    const handleMouseMove = (e) => {
        const img = e.target;
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setMagnifierPosition({ x, y, rect });
    };

    const handleMouseEnter = () => {
        setShowMagnifier(true);
    };

    const handleMouseLeave = () => {
        setShowMagnifier(false);
    };

    // Mobile touch handlers
    const handleTouchStart = (e) => {
        if (isMobile && e.touches.length === 1) {
            const touch = e.touches[0];
            setZoomPosition({ x: touch.clientX, y: touch.clientY });
        }
    };

    const handleTouchMove = (e) => {
        if (isMobile && e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            setZoomPosition({ x: touch.clientX, y: touch.clientY });
        }
    };

    const toggleMobileZoom = () => {
        if (isMobile) {
            setIsZoomed(!isZoomed);
        }
    };

    // Enhanced magnifier functions for better performance
    const getMagnifierStyle = () => {
        if (!magnifierPosition.rect || !showMagnifier) return {};
        
        const magnifierSize = isMobile ? 120 : 150; // Smaller on mobile for better performance
        const zoomLevel = isMobile ? 3 : 2.5; // Higher zoom on mobile
        
        return {
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            left: `${Math.min(Math.max(magnifierPosition.x - magnifierSize/2, 0), magnifierPosition.rect.width - magnifierSize)}px`,
            top: `${Math.min(Math.max(magnifierPosition.y - magnifierSize/2, 0), magnifierPosition.rect.height - magnifierSize)}px`,
            backgroundImage: `url(${mainImage})`,
            backgroundPosition: `-${magnifierPosition.x * zoomLevel - magnifierSize/2}px -${magnifierPosition.y * zoomLevel - magnifierSize/2}px`,
            backgroundSize: `${magnifierPosition.rect.width * zoomLevel}px ${magnifierPosition.rect.height * zoomLevel}px`,
            backgroundRepeat: 'no-repeat',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1000,
            transition: 'all 0.1s ease-out',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(236, 72, 153, 0.8)',
        };
    };

    const handleWhatsAppShare = () => {
        const productUrl = `${window.location.origin}/product/${product.id}`;
        const originalPrice = parseFloat(product.price) || 0;
        const discountPercent = parseFloat(product.discount) || 0;
        const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);
        
        const message = `Check out this product: ${product.name}\n\n${product.description}\n\nPrice: ₹${discountedPrice.toFixed(2)}${discountPercent > 0 ? ` (Discount: ${discountPercent}%)` : ''}\n\nView here: ${productUrl}`;
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-rose-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/products')}
                    className="mb-8 group flex items-center text-gray-600 hover:text-pink-600 transition-all duration-300 transform hover:-translate-x-2"
                >
                    <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:bg-pink-600 transition-all duration-300">
                        <FaArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="ml-3 font-medium">Back to Products</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Product Image Section */}
                    <div className="relative lg:col-span-1 bg-gradient-to-br from-gray-100 to-gray-200 p-8">
                        {/* Mobile Zoom Controls */}
                        {isMobile && (
                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                <button
                                    onClick={toggleMobileZoom}
                                    className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                                        isZoomed 
                                            ? 'bg-pink-600 text-white' 
                                            : 'bg-gray-800 text-white'
                                    }`}
                                    title={isZoomed ? "Exit Zoom" : "Zoom Image"}
                                >
                                    <FaSearchPlus className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % product.images.length)}
                                    className="p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 hover:bg-gray-700"
                                    title="Next Image"
                                >
                                    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">→</span>
                                </button>
                            </div>
                        )}
                        
                        {/* Main Image */}
                        <div className="relative group cursor-pointer" onClick={() => !isMobile && navigate(`/product/${product.id}`)}>
                            <img
                                ref={imageRef}
                                src={mainImage}
                                alt={product.name}
                                className={`w-full h-auto max-h-[500px] lg:max-h-[600px] object-contain transition-all duration-500 group-hover:scale-105 ${
                                    isZoomed && isMobile ? 'scale-150' : 'scale-105'
                                }`}
                                style={{
                                    transformOrigin: isZoomed && isMobile ? `${zoomPosition.x}px ${zoomPosition.y}px` : 'center',
                                    maxHeight: isZoomed && isMobile ? '70vh' : '600px'
                                }}
                                onMouseMove={!isMobile ? handleMouseMove : undefined}
                                onMouseEnter={!isMobile ? handleMouseEnter : undefined}
                                onMouseLeave={!isMobile ? handleMouseLeave : undefined}
                                onTouchStart={isMobile ? handleTouchStart : undefined}
                                onTouchMove={isMobile ? handleTouchMove : undefined}
                            />
                            
                            {/* Desktop Magnifying Glass */}
                            {!isMobile && showMagnifier && magnifierPosition.rect && (
                                <div
                                    className="absolute pointer-events-none border-2 border-pink-500 rounded-full shadow-2xl overflow-hidden"
                                    style={getMagnifierStyle()}
                                />
                            )}
                            
                            {/* Image Navigation */}
                            {product.images && product.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    <button
                                        onClick={() => setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all duration-300"
                                    >
                                        <FaArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImageIndex((prev) => (prev + 1) % product.images.length)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all duration-300"
                                    >
                                        <FaArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                </div>
                            )}
                            
                            {/* Image Counter */}
                            {product.images && product.images.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
                                    {selectedImageIndex + 1} / {product.images.length}
                                </div>
                            )}
                        </div>

                        {/* Mobile Image Navigation */}
                        {isMobile && product.images && product.images.length > 1 && (
                            <div className="flex justify-center gap-4 mt-4 px-4">
                                <button
                                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                                    className="flex-1 p-3 bg-gray-800 text-white rounded-lg transition-all duration-300 hover:bg-gray-700"
                                >
                                    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">←</span>
                                </button>
                                <button
                                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % product.images.length)}
                                    className="flex-1 p-3 bg-gray-800 text-white rounded-lg transition-all duration-300 hover:bg-gray-700"
                                >
                                    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">→</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="lg:col-span-1 p-8 space-y-6">
                        {/* Product Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                            <div className="flex items-center justify-center gap-3 mb-6">
                                {product.category && (
                                    <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                                        {product.category}
                                    </span>
                                )}
                                {product?.code && (
                                    <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-lg font-bold">
                                        {product.code}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
                        </div>

                        {/* Price and Action Section */}
                        <div className="space-y-6">
                            {/* Price Display */}
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-200 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text">
                                            ₹{(parseFloat(product.price) || 0).toFixed(2)}
                                        </span>
                                        {parseFloat(product.discount || 0) > 0 && (
                                            <span className="text-2xl text-gray-400 line-through ml-3">
                                                ₹{(parseFloat(product.price) || 0).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {parseFloat(product.discount || 0) > 0 && (
                                        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold animate-pulse-slow shadow-lg">
                                            -{parseFloat(product.discount || 0)}%
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleWhatsAppShare}
                                    className="group relative bg-green-500 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center justify-center">
                                        <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                        <span className="ml-3 font-semibold">Share on WhatsApp</span>
                                    </span>
                                </button>
                                <button
                                    onClick={handleContactUs}
                                    className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center justify-center">
                                        <FaEnvelope className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                        <span className="ml-3 font-semibold">Contact Us</span>
                                    </span>
                                </button>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Availability:</span>
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                                    product.stock < 0 
                                        ? 'bg-red-100 text-red-700' 
                                        : product.stock > 0 && product.stock < 10 
                                            ? 'bg-orange-100 text-orange-700 animate-pulse-slow'
                                            : product.stock >= 10 
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {product.stock < 0 
                                        ? (
                                            <>
                                                <FaTimes className="w-4 h-4 mr-2" />
                                                Out of Stock
                                            </>
                                        ) 
                                        : product.stock > 0 && product.stock < 10 
                                            ? (
                                                <>
                                                    <FaBox className="w-4 h-4 mr-2" />
                                                    Only {product.stock} left
                                                </>
                                            ) 
                                            : product.stock >= 10 
                                                ? (
                                                    <>
                                                        <FaCheckCircle className="w-4 h-4 mr-2" />
                                                        In Stock ({product.stock})
                                                    </>
                                                ) 
                                                : (
                                                    <>
                                                        <FaQuestionCircle className="w-4 h-4 mr-2" />
                                                        Stock Status Unknown
                                                    </>
                                                )
                                    }
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Gallery</h3>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                    {product.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                                                selectedImageIndex === index 
                                                    ? 'border-pink-500 shadow-lg scale-105' 
                                                    : 'border-gray-200 hover:border-pink-300 hover:shadow-lg scale-105'
                                            }`}
                                            onClick={() => handleThumbnailClick(index)}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedImageIndex === index && (
                                                <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">VIEWING</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Info Modal */}
            <UserInfoModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                product={product}
            />
        </div>
    );
};

export default ProductDetails;
