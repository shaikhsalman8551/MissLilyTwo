import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTshirt, FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded admin credentials (stored in code)
  const ADMIN_EMAIL = 'admin.misslilytwo@gmail.com';
  const ADMIN_PASSWORD = 'AdminMissLily2';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simple email and password check
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log('Admin login successful');
        
        // Save admin session
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('adminTimestamp', new Date().toISOString());
        
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md glass animate-slide-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            <FaTshirt className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 text-shadow-modern">Miss Lily 2</h1>
          <h2 className="text-2xl font-semibold text-white/90 mb-2">Admin Portal</h2>
          <p className="text-white/80">Sign in to manage your store</p>
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur border border-red-400/30 text-red-100 p-4 rounded-lg mb-6 animate-fade-in">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
              <FaEnvelope className="text-white/70" /> Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50 transition-all group-hover:bg-white/20"
                placeholder="enter email address"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
              <FaLock className="text-white/70" /> Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50 transition-all group-hover:bg-white/20"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-pink-600 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all transform hover:scale-105 btn-modern flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </button>
        </form>


        <div className="mt-6 text-center">
          <a href="/" className="text-white/80 hover:text-white transition-colors text-sm">
            ← Back to Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
