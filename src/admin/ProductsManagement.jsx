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

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').positive(),
  categoryId: Yup.string().required('Category is required'),
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
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
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

  const fetchData = async () => {
    try {
      const prods = await getAllProducts();
      setProducts(prods);
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
      discount: product.discount || 0,
      stock: product.stock || '',
      isActive: product.isActive !== false,
      images: product.images || []
    });
    setImageFiles([]);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setInitialValues({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      discount: 0,
      stock: '',
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
      
      if (editingId) {
        // Get existing product to preserve images
        const existingProduct = products.find(p => p.id === editingId);
        const updatedProduct = await updateProduct(editingId, values, imageFiles, existingProduct?.images || []);
        
        // Update state immediately for real-time effect
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === editingId ? { ...p, ...updatedProduct } : p)
        );
        
        showSuccess('Success!', 'Product updated successfully');
      } else {
        const newProduct = await addProduct(values, imageFiles);
        
        // Add to state immediately for real-time effect
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        
        showSuccess('Success!', 'Product added successfully');
      }
      
      resetForm();
      setImageFiles([]);
      setEditingId(null);
      setShowForm(false);
      setInitialValues({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        discount: 0,
        stock: '',
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">👕 Products Management</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Product Button */}
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
                isActive: true
              });
              setImageFiles([]);
            }
          }}
          className="mb-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition"
        >
          {showForm ? '✕ Cancel' : '+ Add New Product'}
        </button>

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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="1999"
                      />
                      <ErrorMessage name="price" component="p" className="text-red-500 text-sm mt-1" />
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
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
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
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              ×
                            </button>
                            <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing Images for Edit */}
                    {editingId && initialValues.images && initialValues.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {initialValues.images.map((img, index) => (
                            <div key={index} className="relative">
                              <img
                                src={img}
                                alt={`Current ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map(product => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">₹{product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.discount || 0}%</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.images || [])}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;
