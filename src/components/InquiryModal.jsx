import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { saveContactInquiry } from '../services/contactService';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  city: Yup.string().required('City is required'),
  size: Yup.string().required('Size is required'),
  color: Yup.string().required('Color preference is required'),
  message: Yup.string().min(5, 'Message must be at least 5 characters')
});

const InquiryModal = ({ product, onClose }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitToWhatsApp = (values) => {
    const message = `Hi, I'm interested in ${product.name}. My details: Name: ${values.fullName}, Email: ${values.email}, Phone: ${values.phone}, City: ${values.city}, Size: ${values.size}, Color: ${values.color}. Message: ${values.message}`;
    const whatsappUrl = `https://wa.me/918320953686?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitToDatabase = async (values, { resetForm }) => {
    setSubmitLoading(true);
    try {
      // Save to Firebase contacts collection
      await saveContactInquiry({
        productId: product.id,
        productName: product.name,
        ...values,
        inquiryType: 'product_inquiry'
      });
      
      // Also send WhatsApp message
      handleSubmitToWhatsApp(values);
      
      setSubmitSuccess(true);
      resetForm();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      alert('Error submitting inquiry: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-rose-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Ask Product Details</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:opacity-75">×</button>
        </div>

        <div className="p-6">
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center">
              <p className="font-semibold mb-2">✓ Thank You!</p>
              <p>Your inquiry has been submitted successfully.</p>
              <p className="text-sm mt-2">We've sent your details to our team and opened WhatsApp for immediate contact.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-4">
                Product: <span className="font-semibold">{product.name}</span>
              </p>

              <Formik
                initialValues={{
                  fullName: '',
                  email: '',
                  phone: '',
                  city: '',
                  size: '',
                  color: '',
                  message: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmitToDatabase}
              >
                {({ isSubmitting, values }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <Field
                        name="fullName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Your full name"
                      />
                      <ErrorMessage name="fullName" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Field
                        name="email"
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="your.email@example.com"
                      />
                      <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <Field
                        name="phone"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="10-digit number"
                      />
                      <ErrorMessage name="phone" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <Field
                        name="city"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Your city"
                      />
                      <ErrorMessage name="city" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <Field
                          as="select"
                          name="size"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">Select size</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </Field>
                        <ErrorMessage name="size" component="p" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <Field
                          name="color"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Preferred color"
                        />
                        <ErrorMessage name="color" component="p" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                      <Field
                        as="textarea"
                        name="message"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Any additional details..."
                      />
                      <ErrorMessage name="message" component="p" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => handleSubmitToWhatsApp(values)}
                        disabled={Object.keys(validationSchema.fields).some(field => !values[field])}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50"
                      >
                        💬 WhatsApp
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || submitLoading}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2 rounded-lg hover:from-pink-700 hover:to-rose-700 transition font-semibold disabled:opacity-50"
                      >
                        {submitLoading ? 'Submitting...' : '📧 Submit & WhatsApp'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
