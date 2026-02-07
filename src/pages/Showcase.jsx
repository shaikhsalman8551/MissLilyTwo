import React, { useState, useEffect } from 'react';
import { FaInstagram, FaPlay } from 'react-icons/fa';
import { getInstagramConfig, initializeInstagramConfig, defaultInstagramConfig } from '../services/instagramService';

const Showcase = () => {
  const [loading, setLoading] = useState(true);
  const [instagramConfig, setInstagramConfig] = useState(defaultInstagramConfig);

  useEffect(() => {
    const fetchInstagramConfig = async () => {
      try {
        console.log('Showcase: Fetching Instagram config...');
        const config = await getInstagramConfig();
        if (config) {
          console.log('Showcase: Instagram config loaded:', config);
          setInstagramConfig(config);
        } else {
          console.log('Showcase: No Instagram config found, initializing default...');
          const defaultConfig = await initializeInstagramConfig();
          console.log('Showcase: Default Instagram config initialized:', defaultConfig);
          setInstagramConfig(defaultConfig);
        }
      } catch (error) {
        console.error('Showcase: Error loading Instagram config:', error);
      }
      
      // Simulate loading for the Instagram embed
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchInstagramConfig();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Instagram reels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <FaInstagram className="text-pink-600" />
            Instagram Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Follow our journey and stay updated with the latest fashion trends
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={instagramConfig.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              <FaInstagram className="mr-2" />
              Follow @{instagramConfig.username} →
            </a>
            <a
              href={`${instagramConfig.profileUrl.replace('?', '/reels/?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition"
            >
              <FaPlay className="mr-2" />
              Watch Our Reels →
            </a>
          </div>
        </div>

        {/* Instagram Profile Embed */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4">
              <iframe
                src={`https://www.instagram.com/${instagramConfig.username}/embed`}
                className="w-full"
                height="400"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                title={`${instagramConfig.username} Instagram Profile`}
              />
            </div>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> This shows our latest Instagram content including reels and posts. 
              For the best reel experience, click the "Watch Our Reels" button above.
            </p>
            {instagramConfig.reelIds && instagramConfig.reelIds.length > 0 && (
              <p className="text-sm mt-2">
                <strong>Configured Reels:</strong> {instagramConfig.reelIds.length} reel(s) available
              </p>
            )}
          </div>
        </div>

        {/* Configured Reels Section */}
        {instagramConfig.reelIds && instagramConfig.reelIds.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Instagram Reels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instagramConfig.reelIds.map((reelId, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <iframe
                      src={`https://www.instagram.com/reel/${reelId}/embed`}
                      className="w-full h-64"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      title={`Instagram Reel ${index + 1}`}
                    />
                    <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Reel {index + 1}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Instagram Reel</h3>
                    <p className="text-sm text-gray-600 mb-3">Check out our latest fashion content on Instagram</p>
                    <a
                      href={`https://www.instagram.com/reel/${reelId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition"
                    >
                      <FaInstagram className="mr-2" />
                      View on Instagram
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

 
      </div>
    </div>
  );
};

export default Showcase;
