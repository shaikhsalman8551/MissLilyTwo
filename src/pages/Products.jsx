import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts, getAllCategories } from '../services/firebaseService';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaTag, FaTshirt } from 'react-icons/fa';
import useDebounce from '../hooks/useDebounce';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceSort, setPriceSort] = useState('none'); // none, low-to-high, high-to-low
  const [discountFilter, setDiscountFilter] = useState('all'); // all, discounted
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prods = await getAllProducts();
        setProducts(prods);
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = products.filter(p => p.isActive !== false);

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Discount filter
    if (discountFilter === 'discounted') {
      filtered = filtered.filter(p => parseFloat(p.discount || 0) > 0);
    }

    // Price sort
    if (priceSort === 'low-to-high') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price || 0);
        const priceB = parseFloat(b.price || 0);
        return priceA - priceB;
      });
    } else if (priceSort === 'high-to-low') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price || 0);
        const priceB = parseFloat(b.price || 0);
        return priceB - priceA;
      });
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceSort, discountFilter, debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="py-8 sm:py-12 lg:py-16 text-center animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 text-shadow-modern">Our Products</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-12 lg:pb-16">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-6 lg:space-y-8 sticky top-20 lg:top-24 card-modern animate-slide-in">
              {/* Search */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                  <FaSearch /> Search
                </h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Category</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Sort */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Sort by Price</h3>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                >
                  <option value="none">Default</option>
                  <option value="low-to-high">Low to High</option>
                  <option value="high-to-low">High to Low</option>
                </select>
              </div>

              {/* Discount Filter */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                  <FaTag /> Discount
                </h3>
                <select
                  value={discountFilter}
                  onChange={(e) => setDiscountFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                >
                  <option value="all">All Products</option>
                  <option value="discounted">Only Discounted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-12 sm:py-16">
                <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="animate-fade-in h-full" style={{animationDelay: `${index * 0.1}s`}}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-lg">
                <div className="text-4xl sm:text-6xl mb-4">🛍️</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 text-sm sm:text-base">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
