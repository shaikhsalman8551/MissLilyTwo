import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addContactMessage } from '../services/firebaseService';
import { getWebsiteContacts } from '../services/contactService';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheck, FaWhatsapp } from 'react-icons/fa';
import Shimmer from '../components/Shimmer';

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
  subject: Yup.string().required('Subject is required'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
});

const ContactUs = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contacts, setContacts] = useState({
    phones: [],
    whatsapp: [],
    emails: [],
    addresses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactData = await getWebsiteContacts();
        setContacts(contactData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addContactMessage({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        subject: values.subject,
        message: values.message
      });
      setSubmitSuccess(true);
      resetForm();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      alert('Error submitting form: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 sm:py-12 lg:py-16 text-center animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 text-shadow-modern">Contact Us</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-center card-modern animate-slide-in flex-1 max-w-sm">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 flex justify-center text-pink-600">
              {loading ? (
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <FaMapMarkerAlt />
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Address</h3>
            <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              ) : (
                contacts.addresses.length > 0 && contacts.addresses.map((addr, index) => (
                  <div key={addr.id}>
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.zipCode}<br />
                    {addr.country}
                    {index < contacts.addresses.length - 1 && <><br /><br /></>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-center card-modern animate-slide-in flex-1 max-w-sm" style={{animationDelay: '0.1s'}}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 flex justify-center text-pink-600">
              {loading ? (
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <FaPhone />
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Phone</h3>
            <p className="text-gray-600 space-y-1 sm:space-y-2 text-sm sm:text-base">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                contacts.phones.length > 0 && contacts.phones.map((phone) => (
                  <a key={phone.id} href={`tel:${phone.number}`} className="block hover:text-pink-600 transition-colors">
                    {phone.number}
                  </a>
                ))
              )}
            </p>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-center card-modern animate-slide-in flex-1 max-w-sm" style={{animationDelay: '0.15s'}}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 flex justify-center text-green-600">
              {loading ? (
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <FaWhatsapp />
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">WhatsApp</h3>
            <p className="text-gray-600 space-y-1 sm:space-y-2 text-sm sm:text-base">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                contacts.whatsapp.length > 0 && contacts.whatsapp.map((wa) => (
                  <div key={wa.id}>
                    <a 
                      href={`https://wa.me/${wa.number.replace(/[^\d]/g, '')}?text=Hi%20MissLily!%20I%20have%20a%20question.`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block hover:text-green-600 transition-colors font-medium"
                    >
                      {wa.number}
                    </a>
                  </div>
                ))
              )}
              {!loading && contacts.whatsapp.length > 0 && (
                <span className="text-xs text-gray-500 block">Click to chat on WhatsApp</span>
              )}
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-center card-modern animate-slide-in flex-1 max-w-sm" style={{animationDelay: '0.2s'}}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 flex justify-center text-pink-600">
              {loading ? (
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <FaEnvelope />
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Email</h3>
            <p className="text-gray-600 space-y-1 sm:space-y-2 text-sm sm:text-base">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                contacts.emails.length > 0 && contacts.emails.map((email) => (
                  <a key={email.id} href={`mailto:${email.email}`} className="block hover:text-pink-600 transition-colors">
                    {email.email}
                  </a>
                ))
              )}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-10 animate-fade-in mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Send us a Message</h2>

          {submitSuccess && (
            <div className="mb-6 sm:mb-8 bg-green-50 border border-green-200 text-green-700 p-4 sm:p-6 rounded-lg animate-fade-in">
              <p className="font-semibold flex items-center gap-2 mb-2">
                <FaCheck className="text-green-600" /> Thank You!
              </p>
              <p className="text-sm sm:text-base">Your message has been sent successfully. Our team will contact you soon.</p>
            </div>
          )}

          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phone: '',
              subject: '',
              message: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="fullName"
                      type="text"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm sm:text-base"
                      placeholder="Your full name"
                    />
                    <ErrorMessage name="fullName" component="p" className="text-red-500 text-sm mt-1 sm:mt-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm sm:text-base"
                      placeholder="your.email@example.com"
                    />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1 sm:mt-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="phone"
                      type="text"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm sm:text-base"
                      placeholder="10-digit number"
                    />
                    <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1 sm:mt-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="subject"
                      type="text"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm sm:text-base"
                      placeholder="Subject of your message"
                    />
                    <ErrorMessage name="subject" component="p" className="text-red-500 text-sm mt-1 sm:mt-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="message"
                    rows="6"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all resize-none text-sm sm:text-base"
                    placeholder="Your message..."
                  />
                  <ErrorMessage name="message" component="p" className="text-red-500 text-sm mt-1 sm:mt-2" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all transform hover:scale-105 btn-modern disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Map Section */}
        {contacts.addresses.length > 0 && (
          <div className="pb-8 sm:pb-12 lg:pb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Visit Us</h2>
            <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.548934048306!2d77.49387631534595!3d12.97159899087945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3bc7c5c42a9d%3A0x7e3c9b0a0a0a0a0a!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-64 sm:h-80 lg:h-96"
                title="MissLily Store Location"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                <FaMapMarkerAlt className="text-pink-600 mr-2" />
                {contacts.addresses.map((addr, index) => (
                  <span key={addr.id}>
                    {addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                    {index < contacts.addresses.length - 1 && <span className="block mt-2" />}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
