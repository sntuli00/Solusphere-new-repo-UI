import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToFaceLogin = () => {
    navigate('/face-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent-blue to-accent-purple flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <img 
            src="/SoluSphereLogo.png" 
            alt="SoluSphere" 
            className="h-24 mx-auto mb-4"
          />
          <p className="text-white/80">Welcome back! Please login to your account.</p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-lg">
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 border-2 border-white bg-white/90 backdrop-blur-sm rounded-lg text-primary font-medium hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-primary via-accent-blue to-accent-purple text-white/70">Or continue with</span>
            </div>
          </div>

          {/* Face Login Button */}
          <button
            onClick={goToFaceLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 bg-white/90 backdrop-blur-sm"
          >
            <FaceSmileIcon className="h-5 w-5" />
            <span className="font-medium">Face Recognition Login</span>
          </button>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-white/80">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-white hover:text-white/80 underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/70">
          © 2025 SoluSphere. All rights reserved.
        </p>
      </div>
    </div>
  );
}