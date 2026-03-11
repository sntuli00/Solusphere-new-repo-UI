import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon, EnvelopeIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from "../services/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await api.post("/auth/register", { username, email, password });
      setSuccess(true);

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error.response?.data || error);
      setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
          <p className="text-white/80">Create your account and get started today.</p>
        </div>

        {/* Register Form */}
        <div className="w-full max-w-md px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-lg">
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-lg flex items-start gap-3">
              <CheckCircleIcon className="h-5 w-5 text-white mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Registration successful!</p>
                <p className="text-sm text-white/80">Redirecting to login...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  required
                />
              </div>
            </div>

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
                  minLength={6}
                  required
                />
              </div>
              <p className="mt-1 text-xs text-white/70">Must be at least 6 characters</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full px-6 py-3 border-2 border-white bg-white/90 backdrop-blur-sm rounded-lg text-primary font-medium hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-white/80">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-white hover:text-white/80 underline">
              Sign in
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