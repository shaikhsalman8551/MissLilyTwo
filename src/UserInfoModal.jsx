import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const UserInfoModal = ({ isOpen, onClose, product }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-rose-600 text-white p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Request Product Information</h2>
                        <button 
                            onClick={onClose} 
                            className="text-2xl font-bold hover:opacity-75 transition"
                        >
                            ×
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-gray-600 text-sm mb-4">
                            Product: <span className="font-semibold">{product?.name || 'N/A'}</span>
                        </p>

                        <Formik
                            initialValues={{
                                email: '',
                                phone: '',
                                fullName: '',
                                message: `I'm interested in ${product?.name || 'this product'}`
                            }}
                            validate={values => {
                                const errors = {};
                                if (!values.email) {
                                    errors.email = 'Required';
                                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                    errors.email = 'Invalid email address';
                                }
                                if (!values.phone) {
                                    errors.phone = 'Required';
                                }
                                if (!values.fullName) {
                                    errors.fullName = 'Required';
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                // Handle form submission logic here
                                console.log('User Info:', values);
                                setSubmitting(false);
                                onClose();
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <Field 
                                            type="email"
                                            name="email" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <Field 
                                            type="text"
                                            name="phone" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                        <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <Field 
                                            type="text"
                                            name="fullName" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                        <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <Field 
                                            as="textarea"
                                            name="message" 
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                                        />
                                        <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        )
    );
};

export default UserInfoModal;
