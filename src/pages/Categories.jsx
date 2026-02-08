import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, getAllProducts } from '../services/firebaseService';
import { FaTag, FaList } from 'react-icons/fa';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, prods] = await Promise.all([
                    getAllCategories(),
                    getAllProducts()
                ]);
                setCategories(cats || []);
                setProducts(prods || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getCategoryProductCount = (categoryId) => {
        return products.filter(p => p.categoryId === categoryId && p.isActive !== false).length;
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-rose-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
                        Browse Categories
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Explore product collections by category
                    </p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                ) : (
                    <>
                        {/* View Mode Toggle */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-white rounded-xl shadow p-2 flex gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-2 rounded-lg transition ${
                                        viewMode === 'grid'
                                            ? 'bg-pink-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                                        viewMode === 'list'
                                            ? 'bg-pink-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    <FaList /> List
                                </button>
                            </div>
                        </div>

                        {/* Selected Category Info */}
                        {selectedCategory && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FaTag className="text-blue-600 text-2xl" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-800">
                                            {categories.find(c => c.id === selectedCategory)?.name || 'Selected Category'}
                                        </h3>
                                        <p className="text-blue-600 text-sm">
                                            {getCategoryProductCount(selectedCategory)} products
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}

                        {/* Categories */}
                        {categories.length > 0 ? (
                            viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {categories.map(category => (
                                        <div
                                            key={category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            className={`cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 p-5 ${
                                                selectedCategory === category.id ? 'ring-2 ring-pink-500' : ''
                                            }`}
                                        >
                                            <div className="h-40 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                                                {category.icon ? (
                                                    <img
                                                        src={category.icon}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaTag className="text-4xl text-indigo-600" />
                                                )}
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                {category.name}
                                            </h3>

                                            <p className="text-sm text-gray-500 mb-3">
                                                {getCategoryProductCount(category.id)} products
                                            </p>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/products?category=${category.id}`);
                                                }}
                                                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                                            >
                                                View Products
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {categories.map(category => (
                                        <div
                                            key={category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            className={`cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition p-4 flex items-center gap-4 ${
                                                selectedCategory === category.id ? 'ring-2 ring-pink-500' : ''
                                            }`}
                                        >
                                            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                {category.icon ? (
                                                    <img
                                                        src={category.icon}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaTag className="text-2xl text-indigo-600" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {getCategoryProductCount(category.id)} products
                                                </p>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/products?category=${category.id}`);
                                                }}
                                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                                    No Categories Found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Categories haven't been added yet.
                                </p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
                                >
                                    Browse Products
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Categories;
