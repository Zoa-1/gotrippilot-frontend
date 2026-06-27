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
        localStorage.setItem('gotrippilot_token', data.access_token);
        onLoginSuccess(data.access_token);
      } else {
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

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="absolute top-4 left-4">
        <button 
          onClick={() => onNavigate('landing')} 
          className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors cursor-pointer text-sm font-medium"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>

      <div className="w-full max-w-md card p-8 space-y-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="h-7 w-7 text-brand-primary" />
            <span className="text-xl font-bold text-slate-900">GoTripPilot</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {isLogin ? 'Welcome Back Traveler' : 'Join the Flight Crew'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isLogin ? 'Enter your details to access your saved itineraries' : 'Sign up to create and save custom itineraries'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="input-field pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="input-field pl-9"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 btn-primary flex items-center justify-center gap-2 text-sm"
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

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-brand-border"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">or</span>
          <div className="flex-grow border-t border-brand-border"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 bg-white border border-brand-border hover:bg-slate-50 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
        >
          <Chrome className="h-4 w-4 text-sky-500" />
          Google Sign In
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-500 hover:text-brand-primary transition-colors cursor-pointer font-semibold underline underline-offset-4"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
