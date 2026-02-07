import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaSave, FaTimes, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { getInstagramConfig, saveInstagramConfig, defaultInstagramConfig } from '../services/instagramService';

const InstagramManagement = () => {
  const navigate = useNavigate();
  const [instagramConfig, setInstagramConfig] = useState(defaultInstagramConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newReelId, setNewReelId] = useState('');

  useEffect(() => {
    const fetchInstagramConfig = async () => {
      try {
        console.log('Admin: Fetching Instagram config...');
        const existingConfig = await getInstagramConfig();
        if (existingConfig) {
          console.log('Admin: Instagram config loaded:', existingConfig);
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
      console.log('Admin: Saving Instagram config to Firebase:', instagramConfig);
      // Save to Firebase
      await saveInstagramConfig(instagramConfig);
      console.log('Admin: Instagram config saved successfully');
      setSuccessMessage('Instagram configuration saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Admin: Error saving Instagram config:', error);
      setErrorMessage('Failed to save Instagram configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleAddReelId = () => {
    if (newReelId.trim()) {
      setInstagramConfig(prev => ({
        ...prev,
        reelIds: [...prev.reelIds, newReelId.trim()]
      }));
      setNewReelId('');
    }
  };

  const handleRemoveReelId = (index) => {
    setInstagramConfig(prev => ({
      ...prev,
      reelIds: prev.reelIds.filter((_, i) => i !== index)
    }));
  };

  const handleUsernameChange = (value) => {
    setInstagramConfig(prev => ({
      ...prev,
      username: value,
      profileUrl: `https://www.instagram.com/${value}?utm_source=qr&igsh=MXZ4bTk3M3VzbGZlNw==`
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Instagram settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaInstagram className="text-pink-600" />
              Instagram Management
            </h2>
          </div>
        </div>

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

          {/* Reel IDs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Reel IDs
            </label>
            <div className="space-y-3">
              {instagramConfig.reelIds.map((reelId, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={reelId}
                    onChange={(e) => {
                      const newReelIds = [...instagramConfig.reelIds];
                      newReelIds[index] = e.target.value;
                      setInstagramConfig(prev => ({ ...prev, reelIds: newReelIds }));
                    }}
                    placeholder="Reel ID (e.g., CxYz123Abc)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveReelId(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove reel"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add New Reel ID */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newReelId}
                onChange={(e) => setNewReelId(e.target.value)}
                placeholder="Add new reel ID (e.g., CxYz123Abc)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="button"
                onClick={handleAddReelId}
                disabled={!newReelId.trim()}
                className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Add reel"
              >
                <FaPlus />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Add Instagram reel IDs to display in the showcase page
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
              <p className="text-sm text-gray-600">
                <strong>Reels:</strong> {instagramConfig.reelIds.length} reel(s) configured
              </p>
              {instagramConfig.reelIds.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Reel IDs:</p>
                  <div className="flex flex-wrap gap-2">
                    {instagramConfig.reelIds.map((reelId, index) => (
                      <span key={index} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                        {reelId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
  );
};

export default InstagramManagement;
