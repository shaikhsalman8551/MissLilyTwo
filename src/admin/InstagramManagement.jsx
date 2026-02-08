import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaSave, FaTimes, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { getInstagramConfig, saveInstagramConfig, defaultInstagramConfig } from '../services/instagramService';
import AdminLayout from '../components/AdminLayout';

const InstagramManagement = () => {
  const navigate = useNavigate();
  const [instagramConfig, setInstagramConfig] = useState(defaultInstagramConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 

  useEffect(() => {
    const fetchInstagramConfig = async () => {
      try {
        const existingConfig = await getInstagramConfig();
        if (existingConfig) {
          setInstagramConfig(existingConfig);
        } else {
          console.log('Admin: No Instagram config found, using default');
        }
      } catch (error) {
        console.error('Admin: Error fetching Instagram config:', error);
        setErrorMessage('Failed to load Instagram configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramConfig();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Save to Firebase
      await saveInstagramConfig(instagramConfig);
      setSuccessMessage('Instagram configuration saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Admin: Error saving Instagram config:', error);
      setErrorMessage('Failed to save Instagram configuration');
    } finally {
      setSaving(false);
    }
  };



  const handleUsernameChange = (value) => {
    setInstagramConfig(prev => ({
      ...prev,
      username: value,
      profileUrl: `https://www.instagram.com/${value}?utm_source=qr&igsh=MXZ4bTk3M3VzbGZlNw==`
    }));
  };



  return (
    <>
    <AdminLayout title={"Instgram Management"} >
        <div className="min-h-screen bg-gray-100">
      {
        loading ? (
            <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading instagram configurations...</p>
        </div>
        ):(
          <>
          
          
      <div className='max-w-7xl px-4 py-2'>
      <div className="bg-white rounded-xl shadow-lg p-6">
      

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSaveConfig(); }} className="space-y-6">
          {/* Instagram Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              value={instagramConfig.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="e.g., misslily_0.2_"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              This username will be used in the showcase page to load Instagram reels
            </p>
          </div>

          {/* Profile URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile URL
            </label>
            <input
              type="url"
              value={instagramConfig.profileUrl}
              onChange={(e) => setInstagramConfig(prev => ({ ...prev, profileUrl: e.target.value }))}
              placeholder="https://www.instagram.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              The complete URL to your Instagram profile
            </p>
          </div>

        

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Preview</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Username:</strong> @{instagramConfig.username}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Profile URL:</strong> {instagramConfig.profileUrl}
              </p>
            
           
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
          </>
        )
      }
   
      </div>
 
   </AdminLayout>
    </>
  );
};

export default InstagramManagement;
