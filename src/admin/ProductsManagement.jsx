import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  getAllProducts,
  getAllCategories,
  addProduct,
  updateProduct,
  deleteProduct
} from '../services/firebaseService';
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../utils/notifications';
import { debounce } from '../utils/debounce';
import AdminLayout from '../components/AdminLayout';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').positive().test('decimal', 'Please enter a valid price', value => {
        return !isNaN(value) && parseFloat(value) >= 0;
      }),
  categoryId: Yup.string().required('Category is required'),
  code: Yup.string().required('Cpde is required'),
  discount: Yup.number().min(0).max(100),
  stock: Yup.number().required('Stock is required'),
  isActive: Yup.boolean()
});

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    code:"",
    discount: 0,
    stock: '',
    isActive: true
  });

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin-login');
      return;
    }
    fetchData();
  }, [navigate]);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        const productName = product.name || '';
        const productCode = product.code || '';
        const categoryName = product.category || '';
        
        return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
               categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Debounced search handler
  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const fetchData = async () => {
    try {
      const prods = await getAllProducts();
      setProducts(prods);
      setFilteredProducts(prods); // Initialize filtered products
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Error!', 'Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setInitialValues({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      categoryId: product.categoryId || '',
      discount: Number(product.discount) || 0,
      code: product.code || '',
      stock: Number(product.stock) || 0,
      isActive: product.isActive !== false,
      images: product.images || []
    });
    setImageFiles([]);
    setImagesToDelete([]);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setImagesToDelete([]);
    setInitialValues({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      discount: 0,
      stock: '',
      code:"",
      isActive: true
    });
    setImageFiles([]);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      showLoading('Saving product...');
      
      if (!values.categoryId) {
        throw new Error('Please select a category for product');
      }
      
      // Ensure proper type conversion
      const processedValues = {
        ...values,
        discount: Number(values.discount) || 0,
        price: Number(values.price),
        stock: Number(values.stock),
        isActive: values.isActive === 'true' || values.isActive === true
      };
      
      if (editingId) {
        // Get existing product to preserve images
        const existingProduct = products.find(p => p.id === editingId);
        // Filter out images marked for deletion from existing product images
        const remainingImages = existingProduct?.images?.filter((_, index) => !imagesToDelete.includes(index)) || [];
        const updatedProduct = await updateProduct(editingId, processedValues, imageFiles, remainingImages);
        
        // Update state immediately for real-time effect
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === editingId ? { ...p, ...updatedProduct } : p)
        );
        
        showSuccess('Success!', 'Product updated successfully');
      } else {
        const newProduct = await addProduct(processedValues, imageFiles);
        
        // Add to state immediately for real-time effect
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        
        showSuccess('Success!', 'Product added successfully');
      }
      
      resetForm();
      setImageFiles([]);
      setEditingId(null);
      setImagesToDelete([]);
      setShowForm(false);
      setInitialValues({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        discount: 0,
        stock: '',
        code:"",
        isActive: true,
        images: []
      });
      
      // Optional: Refresh data to ensure consistency
      // await fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      showError('Error!', 'Failed to save product: ' + error.message);
    } finally {
      closeLoading();
    }
  };

  const handleDelete = async (id, images) => {
    const result = await showConfirm(
      'Delete Product?',
      'Are you sure you want to delete this product? This action cannot be undone.',
      'Delete',
      'Cancel'
    );
    
    if (result.isConfirmed) {
      try {
        showLoading('Deleting Product', 'Please wait...');
        await deleteProduct(id, images);
        
        // Update state immediately for real-time effect
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
        
        showSuccess('Deleted!', 'Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        showError('Error!', 'Failed to delete product: ' + error.message);
      } finally {
        closeLoading();
      }
    }
  };

  const deleteCurrentImage = (imageIndex) => {
    setImagesToDelete(prev => [...prev, imageIndex]);
    setInitialValues(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }));
  };

  const toggleProductStatus = async (product) => {
    try {
      showLoading('Updating Status', 'Please wait...');
      
      const updatedProduct = await updateProduct(product.id, {
        ...product,
        isActive: !product.isActive
      }, [], product.images || []);
      
      // Update state immediately for real-time effect
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === product.id ? { ...p, ...updatedProduct } : p)
      );
      
      showSuccess('Success!', `Product ${!product.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling product status:', error);
      showError('Error!', 'Failed to update product status: ' + error.message);
    } finally {
      closeLoading();
    }
  };

  return (
    <AdminLayout title="Product Management">

    <div className=" bg-gray-100">
      {/* Admin Navbar */}
     

      <div className="  ">
        {/* Search and Add Product Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products by name, code, or category..."
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              if (!showForm) {
                setInitialValues({
                  name: '',
                  description: '',
                  price: '',
                  categoryId: '',
                  discount: 0,
                  stock: '',
                  code:"",
                  isActive: true
                });
                setImageFiles([]);
              }
            }}
            className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition"
          >
            {showForm ? '✕ Cancel' : '+ Add New Product'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="e.g., Summer Dress"
                      />
                      <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Field
                        as="select"
                        name="categoryId"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="categoryId" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <Field
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="1999"
                      />
                      <ErrorMessage name="price" component="p" className="text-red-500 text-sm mt-1" />
                    </div>
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code
                      </label>
                      <Field
                        name="code"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="like FTK, etc"
                      />
                      <ErrorMessage name="code" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <Field
                        name="discount"
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="10"
                      />
                      <ErrorMessage name="discount" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <Field
                        name="stock"
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="50"
                      />
                      <ErrorMessage name="stock" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <Field
                        as="select"
                        name="isActive"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Field>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Product description..."
                    />
                    <ErrorMessage name="description" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImageFiles(Array.from(e.target.files))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-1">{imageFiles.length} image(s) selected</p>
                    
                    {/* Image Preview */}
                    {imageFiles.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imageFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = imageFiles.filter((_, i) => i !== index);
                                setImageFiles(newFiles);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center  transition"
                            >
                              ×
                            </button>
                            <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing Images for Edit */}
                    {editingId && values.images && values.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {values.images.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img}
                                alt={`Current ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => deleteCurrentImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center  transition"
                              >
                                ×
                              </button>
                              <p className="text-xs text-gray-500 mt-1">Image {index + 1}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Product'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Products Table */}
   <div className="bg-white rounded-lg shadow-md overflow-hidden">
  <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
   
      <table className="w-full text-sm min-w-[900px]">


              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map(product => {
                    const category = categories.find(cat => cat.id === product.categoryId);
                    const categoryName = category ? category.name : '';
                    return (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{categoryName || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">₹{product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.discount || 0}%</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.code || "-"}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => toggleProductStatus(product)}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            product.isActive !== false 
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {product.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 px-3 py-1 rounded text-white hover:text-blue-200 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.images || [])}
                                                    className="bg-red-600 px-3 py-1 rounded text-white hover:text-red-200 font-semibold"
  >
                          Delete
                        </button>
                      </td>
                    </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default ProductsManagement;
