import React, { useState } from 'react';
import { Compass, Sparkles, Mail, Lock, User, ChevronLeft, Chrome } from 'lucide-react';

export default function Auth({ onLoginSuccess, onNavigate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Connect to FastAPI backend
      const endpoint = isLogin ? '/api/auth/login-json' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, full_name: formData.fullName };
      
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed. Please verify inputs.');
      }

      if (isLogin) {
        // Save token & call parent login handler
        localStorage.setItem('gotrippilot_token', data.access_token);
        onLoginSuccess(data.access_token);
      } else {
        // Successful registration, switch to login view and show message
        alert('Registration successful! Please sign in with your credentials.');
        setIsLogin(true);
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock Google Sign-In for MVP
  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      // Mock local storage token
      const mockToken = "google_demo_jwt_token_gotrippilot_mock";
      localStorage.setItem('gotrippilot_token', mockToken);
      onLoginSuccess(mockToken, {
        email: "google_demo_user@gotrippilot.com",
        full_name: "Google Explorer"
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => onNavigate('landing')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl border border-white/5 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="h-7 w-7 text-brand-accent animate-spin-slow" />
            <span className="text-xl font-bold tracking-tight text-white font-sans">GoTripPilot</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isLogin ? 'Welcome Back Traveler' : 'Join the Flight Crew'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Enter your details to access your saved itineraries' : 'Sign up to create and save custom itineraries'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-accent hover:bg-brand-accent/80 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/15 hover:shadow-brand-accent/30 transform hover:-translate-y-0.5 transition-all cursor-pointer text-xs"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {isLogin ? 'Sign In to Co-Pilot' : 'Register Account'}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Social Buttons */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer text-xs"
        >
          <Chrome className="h-4 w-4 text-sky-400" />
          Google Sign In
        </button>

        {/* Toggle link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-semibold underline underline-offset-4"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
