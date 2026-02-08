import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../services/firebaseService';
import {  FaTimes, FaPlus, FaTshirt, FaUpload } from 'react-icons/fa';
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../utils/notifications';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  description: Yup.string().required('Description is required'),
});

const CategoriesManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin-login');
      return;
    }
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error(error);
      showError("Error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError("Invalid File", "Please select an image file");
      return;
    }

    setIconFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setIconPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      showLoading("Saving Category", "Please wait...");

      const data = {
        ...values,
        isActive: values.isActive === "true" || values.isActive === true,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, data, iconFile);
        showSuccess("Success", "Category updated successfully");
      } else {
        await addCategory(data, iconFile);
        showSuccess("Success", "Category added successfully");
      }

      resetForm();
      setShowForm(false);
      setEditingCategory(null);
      setIconFile(null);
      setIconPreview('');
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      showError("Error", error.message);
    } finally {
      closeLoading();
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
    setIconPreview(category.icon || '');
    setIconFile(null);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm(
      "Delete Category?",
      "This action cannot be undone!",
      "Delete",
      "Cancel"
    );

    if (result.isConfirmed) {
      try {
        showLoading("Deleting...", "Please wait...");
        await deleteCategory(id);
        fetchCategories();
        showSuccess("Deleted", "Category deleted successfully");
      } catch (error) {
        showError("Error", error.message);
      } finally {
        closeLoading();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
             Categories Management
          </h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
             Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCategory(null);
            setIconPreview('');
            setIconFile(null);
          }}
          className="mb-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add New Category</>}
        </button>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>

            <Formik
              enableReinitialize
              initialValues={{
                name: editingCategory?.name || "",
                description: editingCategory?.description || "",
                isActive: editingCategory?.isActive ?? true,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">

                  <div>
                    <label className="block mb-2">Category Name</label>
                    <Field name="name" className="w-full border px-4 py-2 rounded-lg" />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="block mb-2">Status</label>
                    <Field as="select" name="isActive" className="w-full border px-4 py-2 rounded-lg">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Field>
                  </div>

                  <div>
                    <label className="block mb-2">Category Icon</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 border rounded-lg flex items-center justify-center">
                        {iconPreview ? (
                          <img src={iconPreview} alt="icon" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <FaUpload className="text-gray-400 text-2xl" />
                        )}
                      </div>

                      <input type="file" hidden id="icon-upload" onChange={handleIconChange} />
                      <label htmlFor="icon-upload" className="bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                        Upload Icon
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Description</label>
                    <Field as="textarea" name="description" rows="3" className="w-full border px-4 py-2 rounded-lg" />
                    <ErrorMessage name="description" component="p" className="text-red-500 text-sm" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-pink-600 text-white py-2 rounded-lg"
                  >
                    {isSubmitting ? "Saving..." : "Save Category"}
                  </button>

                </Form>
              )}
            </Formik>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : categories.length > 0 ? (
            categories.map(cat => {
             
              return (
              <div key={cat.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-3">
                  {cat.icon ? (
                    <img src={cat.icon} alt={cat.name} className="w-16 h-16 rounded-lg" onError={(e) => {
                    
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }} />
                  ) : (
                    <FaTshirt className="text-4xl" />
                  )}
                  {!cat.icon && <FaTshirt className="text-4xl" style={{display: 'none'}} />}
                </div>

                <h3 className="text-xl font-semibold">{cat.name}</h3>
                <p className="text-gray-600 text-sm">{cat.description}</p>

                <span className={`px-3 py-1 text-xs rounded-full ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(cat)} className="flex-1 bg-blue-100 text-blue-700 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="flex-1 bg-red-100 text-red-700 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
              );
            })
          ) : (
            <p>No categories found</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoriesManagement;
