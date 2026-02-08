import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaGift, FaTshirt, FaArrowRight } from 'react-icons/fa';
import { getAllCategories, getAllProducts } from '../services/firebaseService';
import ProductCard from '../components/ProductCard';
import Shimmer from '../components/Shimmer';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getAllProducts();
        setFeaturedProducts(products.slice(0, 6));
        const cats = await getAllCategories();
        setCategories(cats.filter(cat => cat.isActive !== false));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full opacity-10 -ml-40 -mb-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-pulse delay-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* TEXT CONTENT */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight">
                  Discover Fashion with <br />
                  <span className="text-yellow-200 drop-shadow-lg">Miss Lily 2</span>
                </h1>
                
                <div className="space-y-3">
                  <p className="text-lg sm:text-xl text-pink-100 max-w-xl leading-relaxed">
                    Explore stylish and elegant ladies wear.  
                    From casual dresses to premium outfits — all in one place.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 text-sm sm:text-base text-pink-100">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                      ✨ Premium Quality
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                      💎 Affordable Price
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                      🌟 Trendy Design
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-pink-50 hover:scale-105 transition-all duration-300 hover:shadow-3xl"
                >
                  <FaShoppingBag className="text-xl" /> 
                  Shop Now
                  <span className="animate-bounce">→</span>
                </Link>
              </div>
            </div>

            {/* IMAGE SECTION */}
            <div className="flex justify-center md:justify-end animate-fade-in delay-300">
              <div className="relative">
                {/* <img
                  src="/MissLilyTwoIcon.png"
                  alt="Fashion"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-lg rounded-3xl shadow-3xl object-cover transform hover:scale-105 transition-all duration-300"
                /> */}

                {/* Decorative Elements */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-yellow-300/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-300/40 rounded-full blur-3xl animate-pulse delay-500"></div>
                <div className="absolute top-1/2 -left-12 w-24 h-24 bg-white/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* CATEGORIES SECTION */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Explore collections by style and occasion
            </p>
          </div>

          {loading ? (
            <Shimmer type="category" count={8} className="py-20" />
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat, index) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Category Image/Icon */}
                  <div className="relative h-40 bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden">
                    {cat.icon ? (
                      cat.icon.startsWith('http') || cat.icon.startsWith('data:') ? (
                        <img 
                          src={cat.icon} 
                          alt={cat.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <span className="text-5xl text-pink-600 group-hover:scale-110 transition-transform duration-500 block w-full h-full flex items-center justify-center">
                          {cat.icon}
                        </span>
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaTshirt className="text-5xl text-pink-600 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Product Count Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
                      {featuredProducts.filter(p => p.categoryId === cat.id).length} products
                    </div>
                  </div>
                  
                  {/* Category Details */}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-300 text-lg mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-3 right-3 bg-pink-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <FaArrowRight className="text-xs" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 bg-white rounded-xl shadow-md">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="text-lg font-semibold text-gray-800">No Categories Available</h3>
              <p className="text-gray-500 text-sm">Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Featured Products
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Our latest and popular items
            </p>
          </div>

          {loading ? (
            <Shimmer type="product" count={6} className="py-8" />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No products available yet.
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-pink-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-pink-700 transition hover:scale-105"
            >
              View All Products <FaArrowRight />
            </Link>
          </div>

        </div>
      </section>

      {/* PROMO SECTION */}
      <section className="py-14 md:py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex justify-center items-center gap-2">
            <FaGift className="text-yellow-300" /> Seasonal Discount
          </h2>
          <p className="text-lg mb-6">Get up to offers on items!</p>

          <Link
            to="/products?filter=discount"
            className="btn  text-white hover:text-gray-900 transition hover:scale-105 d-flex"
          >
            View  Items 
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
