import React, { useState, useEffect } from 'react';
import { FaInstagram, FaHeart, FaComment, FaBookmark, FaPlay } from 'react-icons/fa';

const InstagramReel = () => {
    const [reelUrl, setReelUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Instagram profile URL from the user
        const instagramUrl = 'https://www.instagram.com/misslily_0.2_?utm_source=qr&igsh=MXZ4bTk3M3VzbGZlNw==';
        
        // Extract username from URL
        const username = instagramUrl.split('instagram.com/')[1]?.split('?')[0] || 'misslily_0.2_';
        
        // Create embed URL for Instagram reels (using the profile's reels)
        // Instagram doesn't provide a direct reel embed URL, so we'll use the profile embed
        // and add a note that it shows the latest content including reels
        const embedUrl = `https://www.instagram.com/${username}/embed/`;
        
        setReelUrl(embedUrl);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        <FaInstagram className="inline mr-2 text-pink-600" />
                        Our Latest Instagram Reels
                    </h2>
                    <p className="text-gray-600">Check out our latest fashion updates and styles in video format</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4">
                        {/* Instagram Profile Embed (shows reels and posts) */}
                        <div className="relative">
                            <iframe
                                src={reelUrl}
                                className="w-full"
                                height="500"
                                frameBorder="0"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                title="MissLily Instagram Reels"
                                onLoad={() => setError(false)}
                                onError={() => setError(true)}
                            />
                            
                            {error && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <div className="text-center p-8">
                                        <FaInstagram className="text-6xl text-pink-600 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Unable to load Instagram content</p>
                                        <p className="text-sm text-gray-500">Please visit our Instagram page directly</p>
                                        <a 
                                            href="https://www.instagram.com/misslily_0.2_?utm_source=qr&igsh=MXZ4bTk3M3VzbGZlNw=="
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center bg-pink-600 text-white px-4 py-2 rounded-lg text-sm mt-4"
                                        >
                                            <FaInstagram className="mr-2" />
                                            Visit Instagram
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Note about Instagram embed limitations */}
                <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
                    <p className="text-sm">
                        <strong>Note:</strong> Instagram's embed shows your latest content including reels and posts. 
                        For the best reel experience, please visit our Instagram profile directly.
                    </p>
                </div>

                {/* Instagram Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-lg shadow p-4">
                        <FaPlay className="text-2xl text-pink-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Reels</p>
                        <p className="text-xl font-bold text-gray-800">50+</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <FaHeart className="text-2xl text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Likes</p>
                        <p className="text-xl font-bold text-gray-800">2.5K+</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <FaComment className="text-2xl text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Comments</p>
                        <p className="text-xl font-bold text-gray-800">500+</p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <a 
                        href="https://www.instagram.com/misslily_0.2_?utm_source=qr&igsh=MXZ4bTk3M3VzbGZlNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105"
                    >
                        <FaInstagram className="mr-2" />
                        View All Reels on Instagram
                    </a>
                </div>

                {/* Instagram Reel Preview Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center relative">
                            <FaPlay className="text-4xl text-white opacity-80" />
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">NEW</div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Latest Fashion Drop</h3>
                            <p className="text-sm text-gray-600">Check out our newest collection</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center relative">
                            <FaPlay className="text-4xl text-white opacity-80" />
                            <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">TRENDING</div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Style Tips</h3>
                            <p className="text-sm text-gray-600">How to style our pieces</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative">
                            <FaPlay className="text-4xl text-white opacity-80" />
                            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">POPULAR</div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Behind the Scenes</h3>
                            <p className="text-sm text-gray-600">See how we create our designs</p>
                        </div>
                    </div>
                </div>

                {/* Alternative: Direct Reel Links */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links to Our Reels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a 
                            href="https://www.instagram.com/misslily_0.2_?utm_source=qr&igsh=MXZ4bTk3M3VzbGZlNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                        >
                            <FaPlay className="text-pink-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-800">Latest Reels</p>
                                <p className="text-sm text-gray-600">View our most recent videos</p>
                            </div>
                        </a>
                        <a 
                            href="https://www.instagram.com/misslily_0.2_/reels/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                        >
                            <FaInstagram className="text-pink-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-800">All Reels</p>
                                <p className="text-sm text-gray-600">Browse our complete reel collection</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstagramReel;
