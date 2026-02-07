import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from './services/firebaseService';
import UserInfoModal from './UserInfoModal';
import { saveContactInquiry } from './services/contactService';
import { FaArrowLeft, FaInfoCircle, FaTimes, FaChevronLeft, FaChevronRight, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Product not found</h2>
                    <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const mainImage = product.images && product.images.length > 0 ? product.images[selectedImageIndex] : 'https://via.placeholder.com/600x800?text=Product+Image';

    const openLightbox = (index) => {
        setSelectedImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const navigateImage = (direction) => {
        if (!product.images || product.images.length === 0) return;
        
        if (direction === 'next') {
            setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
        } else {
            setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handleRequestInfo = () => {
        // Open inquiry modal directly
        setModalOpen(true);
    };

    const handleContactUs = () => {
        // Navigate to Contact Us page
        navigate('/contact');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/products')}
                    className="mb-6 flex items-center text-gray-600 hover:text-pink-600 transition"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Products
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-md p-6">
                    {/* Product Image */}
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-auto max-h-[600px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                                onClick={() => openLightbox(selectedImageIndex)}
                            />
                            {product.images && product.images.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                    {selectedImageIndex + 1} / {product.images.length}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <p className="text-gray-700 mb-4">{product.description}</p>
                        
                        {/* Price */}
                        <div className="mb-4">
                            <span className="text-2xl font-bold text-pink-600">
                                ₹{(parseFloat(product.price) || 0).toFixed(2)}
                            </span>
                            {parseFloat(product.discount || 0) > 0 && (
                                <span className="text-sm text-gray-400 line-through ml-3">
                                    ₹{(parseFloat(product.price) || 0).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Category */}
                        {product.categoryId && (
                            <div className="mb-4">
                                <span className="text-sm text-gray-500">Category:</span>
                                <span className="ml-2 text-sm font-medium">{product.categoryId}</span>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="mb-4">
                            <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                                product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {product.isActive ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* <button
                                onClick={handleRequestInfo}
                                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition"
                            >
                                <FaInfoCircle className="inline mr-2" />
                                Request Info
                            </button> */}
                            <button
                                onClick={handleContactUs}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition"
                            >
                                <FaEnvelope className="inline mr-2" />
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>

                {/* Thumbnail Images */}
                    {product.images && product.images.length > 1 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">More Images</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className={`w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition border-2 ${
                                            selectedImageIndex === index 
                                                ? 'border-pink-500' 
                                                : 'border-transparent hover:border-gray-300'
                                        }`}
                                        onClick={() => handleThumbnailClick(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            {/* Lightbox */}
            {isLightboxOpen && product.images && product.images.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition z-10"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                            {selectedImageIndex + 1} / {product.images.length}
                        </div>

                        {/* Main Image */}
                        <img
                            src={product.images[selectedImageIndex]}
                            alt={`${product.name} ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />

                        {/* Navigation Buttons */}
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={() => navigateImage('prev')}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition"
                                >
                                    <FaChevronLeft className="text-xl" />
                                </button>
                                <button
                                    onClick={() => navigateImage('next')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition"
                                >
                                    <FaChevronRight className="text-xl" />
                                </button>
                            </>
                        )}

                        {/* Thumbnail Strip */}
                        {product.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                                            selectedImageIndex === index 
                                                ? 'border-pink-500' 
                                                : 'border-transparent hover:border-gray-300'
                                        }`}
                                        onClick={() => setSelectedImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

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
