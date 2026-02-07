import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
    getContactSettings, 
    addPhone, 
    updatePhone, 
    deletePhone,
    addWhatsApp,
    updateWhatsApp,
    deleteWhatsApp,
    addEmail,
    updateEmail,
    deleteEmail,
    addAddress,
    updateAddress,
    deleteAddress
} from '../services/settingsService';
import { 
    FaPhone, 
    FaWhatsapp, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaPlus, 
    FaEdit, 
    FaTrash,
    FaSave,
    FaTimes,
    FaToggleOn,
    FaToggleOff,
    FaUser,
    FaBuilding
} from 'react-icons/fa';

const ContactSettings = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        phones: [],
        whatsapp: [],
        emails: [],
        addresses: []
    });
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [activeSection, setActiveSection] = useState('phones');

    useEffect(() => {
        if (!localStorage.getItem('adminLoggedIn')) {
            navigate('/admin-login');
            return;
        }
        fetchSettings();
    }, [navigate]);

    const fetchSettings = async () => {
        try {
            const data = await getContactSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (type, id) => {
        try {
            const item = settings[type].find(item => item.id === id);
            if (item) {
                item.isActive = !item.isActive;
                setSettings({ ...settings });
                
                // Update in database
                switch (type) {
                    case 'phones':
                        await updatePhone(id, { isActive: item.isActive });
                        break;
                    case 'whatsapp':
                        await updateWhatsApp(id, { isActive: item.isActive });
                        break;
                    case 'emails':
                        await updateEmail(id, { isActive: item.isActive });
                        break;
                    case 'addresses':
                        await updateAddress(id, { isActive: item.isActive });
                        break;
                }
            }
        } catch (error) {
            console.error('Error toggling active status:', error);
        }
    };

    const handleDelete = async (type, id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                switch (type) {
                    case 'phones':
                        await deletePhone(id);
                        break;
                    case 'whatsapp':
                        await deleteWhatsApp(id);
                        break;
                    case 'emails':
                        await deleteEmail(id);
                        break;
                    case 'addresses':
                        await deleteAddress(id);
                        break;
                }
                await fetchSettings();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            switch (activeSection) {
                case 'phones':
                    if (editingItem) {
                        await updatePhone(editingItem.id, values);
                    } else {
                        await addPhone(values);
                    }
                    break;
                case 'whatsapp':
                    if (editingItem) {
                        await updateWhatsApp(editingItem.id, values);
                    } else {
                        await addWhatsApp(values);
                    }
                    break;
                case 'emails':
                    if (editingItem) {
                        await updateEmail(editingItem.id, values);
                    } else {
                        await addEmail(values);
                    }
                    break;
                case 'addresses':
                    if (editingItem) {
                        await updateAddress(editingItem.id, values);
                    } else {
                        await addAddress(values);
                    }
                    break;
            }
            
            resetForm();
            setShowForm(false);
            setEditingItem(null);
            await fetchSettings();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error saving item: ' + error.message);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const renderForm = () => {
        let initialValues = {};
        let validationSchema = Yup.object();

        switch (activeSection) {
            case 'phones':
                initialValues = {
                    number: editingItem?.number || '',
                    type: editingItem?.type || 'primary'
                };
                validationSchema = Yup.object({
                    number: Yup.string().required('Phone number is required'),
                    type: Yup.string().required('Type is required')
                });
                break;
            case 'whatsapp':
                initialValues = {
                    number: editingItem?.number || ''
                };
                validationSchema = Yup.object({
                    number: Yup.string().required('WhatsApp number is required')
                });
                break;
            case 'emails':
                initialValues = {
                    email: editingItem?.email || '',
                    type: editingItem?.type || 'info'
                };
                validationSchema = Yup.object({
                    email: Yup.string().email('Invalid email').required('Email is required'),
                    type: Yup.string().required('Type is required')
                });
                break;
            case 'addresses':
                initialValues = {
                    street: editingItem?.street || '',
                    city: editingItem?.city || '',
                    state: editingItem?.state || '',
                    zipCode: editingItem?.zipCode || '',
                    country: editingItem?.country || '',
                    type: editingItem?.type || 'main'
                };
                validationSchema = Yup.object({
                    street: Yup.string().required('Street is required'),
                    city: Yup.string().required('City is required'),
                    state: Yup.string().required('State is required'),
                    zipCode: Yup.string().required('Zip code is required'),
                    country: Yup.string().required('Country is required'),
                    type: Yup.string().required('Type is required')
                });
                break;
        }

        return (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                        {editingItem ? `Edit ${activeSection.slice(0, -1)}` : `Add ${activeSection.slice(0, -1)}`}
                    </h3>
                    <button
                        onClick={() => { setShowForm(false); setEditingItem(null); }}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {activeSection === 'phones' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <Field name="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="+91 XXXXXXXXXX" />
                                        <ErrorMessage name="number" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                        <Field as="select" name="type" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                                            <option value="primary">Primary</option>
                                            <option value="secondary">Secondary</option>
                                            <option value="tollfree">Toll-Free</option>
                                        </Field>
                                    </div>
                                </div>
                            )}
                            
                            {activeSection === 'whatsapp' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                                    <Field name="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="+91 XXXXXXXXXX" />
                                    <ErrorMessage name="number" component="p" className="text-red-500 text-sm mt-1" />
                                </div>
                            )}
                            
                            {activeSection === 'emails' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <Field name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="email@example.com" />
                                        <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                        <Field as="select" name="type" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                                            <option value="info">Info</option>
                                            <option value="support">Support</option>
                                            <option value="sales">Sales</option>
                                            <option value="hr">HR</option>
                                        </Field>
                                    </div>
                                </div>
                            )}
                            
                            {activeSection === 'addresses' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                                            <Field name="street" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="123 Fashion Street" />
                                            <ErrorMessage name="street" component="p" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <Field name="city" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Style City" />
                                            <ErrorMessage name="city" component="p" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <Field name="state" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="State" />
                                            <ErrorMessage name="state" component="p" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                            <Field name="zipCode" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="12345" />
                                            <ErrorMessage name="zipCode" component="p" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                            <Field name="country" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="India" />
                                            <ErrorMessage name="country" component="p" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                            <Field as="select" name="type" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                                                <option value="main">Main Office</option>
                                                <option value="branch">Branch Office</option>
                                                <option value="warehouse">Warehouse</option>
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition disabled:opacity-50">
                                    <FaSave className="inline mr-2" />
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
                                    <FaTimes className="inline mr-2" />
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    };

    const renderList = () => {
        const items = settings[activeSection] || [];
        
        return (
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className={`bg-white rounded-xl shadow-md p-6 border ${!item.isActive ? 'opacity-50 border-gray-200' : 'border-gray-300'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                {activeSection === 'phones' && (
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{item.number}</p>
                                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-600 capitalize">{item.type}</span>
                                    </div>
                                )}
                                
                                {activeSection === 'whatsapp' && (
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{item.number}</p>
                                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">WhatsApp</span>
                                    </div>
                                )}
                                
                                {activeSection === 'emails' && (
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{item.email}</p>
                                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-600 capitalize">{item.type}</span>
                                    </div>
                                )}
                                
                                {activeSection === 'addresses' && (
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{item.street}</p>
                                        <p className="text-gray-600 mt-1">
                                            {item.city}, {item.state} {item.zipCode}
                                        </p>
                                        <p className="text-gray-600">{item.country}</p>
                                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-600 capitalize mt-2">{item.type}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3 ml-4">
                                <button
                                    onClick={() => handleToggleActive(activeSection, item.id)}
                                    className="text-2xl transition-colors"
                                >
                                    {item.isActive ? <FaToggleOn className="text-green-600" /> : <FaToggleOff className="text-gray-400" />}
                                </button>
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-blue-600 hover:text-blue-800 transition"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(activeSection, item.id)}
                                    className="text-red-600 hover:text-red-800 transition"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FaBuilding className="text-2xl" />
                        <h1 className="text-2xl font-bold">Contact Settings</h1>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition backdrop-blur-sm"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Section Tabs */}
                <div className="bg-white rounded-xl shadow-lg p-2 mb-6 inline-flex border border-pink-100">
                    {[
                        { id: 'phones', label: 'Phone Numbers', icon: FaPhone },
                        { id: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp },
                        { id: 'emails', label: 'Email Addresses', icon: FaEnvelope },
                        { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt }
                    ].map((section) => (
                        <button
                            key={section.id}
                            onClick={() => { setActiveSection(section.id); setShowForm(false); setEditingItem(null); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                activeSection === section.id
                                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md transform scale-105'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                            }`}
                        >
                            <section.icon className={`text-lg ${activeSection === section.id ? 'text-white' : 'text-pink-500'}`} />
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Add Button */}
                <div className="mb-6">
                    <button
                        onClick={() => { setShowForm(true); setEditingItem(null); }}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition shadow-md"
                    >
                        <FaPlus className="inline mr-2" />
                        Add {activeSection === 'phones' ? 'Phone Number' : activeSection === 'whatsapp' ? 'WhatsApp Number' : activeSection === 'emails' ? 'Email Address' : 'Address'}
                    </button>
                </div>

                {/* Form */}
                {showForm && renderForm()}

                {/* List */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        {activeSection === 'phones' && <FaPhone className="text-pink-600" />}
                        {activeSection === 'whatsapp' && <FaWhatsapp className="text-green-600" />}
                        {activeSection === 'emails' && <FaEnvelope className="text-pink-600" />}
                        {activeSection === 'addresses' && <FaMapMarkerAlt className="text-pink-600" />}
                        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                    </h2>
                    
                    {renderList()}
                    
                    {settings[activeSection]?.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">
                                {activeSection === 'phones' && <FaPhone />}
                                {activeSection === 'whatsapp' && <FaWhatsapp />}
                                {activeSection === 'emails' && <FaEnvelope />}
                                {activeSection === 'addresses' && <FaMapMarkerAlt />}
                            </div>
                            <p className="text-gray-500 text-lg">No {activeSection} added yet</p>
                            <p className="text-gray-400 text-sm mt-2">Click the "Add" button to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactSettings;
