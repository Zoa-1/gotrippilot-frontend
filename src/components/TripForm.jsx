import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Calendar, DollarSign, Users, ChevronLeft, Train, Bus, Plane, Car } from 'lucide-react';

const POPULAR_SUGGESTIONS = ['Munnar', 'Wayanad', 'Kochi', 'Varkala', 'Goa', 'Ooty'];
const BUDGET_PRESETS = [5000, 10000, 20000, 50000];
const TRANSPORT_OPTIONS = [
  { label: 'Train', icon: '🚆', desc: 'Economical & scenic' },
  { label: 'Bus', icon: '🚌', desc: 'Most budget-friendly' },
  { label: 'Flight', icon: '✈️', desc: 'Fastest option' },
  { label: 'Car', icon: '🚗', desc: 'Maximum flexibility' },
];
const CATEGORY_OPTIONS = [
  { label: 'Solo Travel', emoji: '🧳' },
  { label: 'Friends Trip', emoji: '🎉' },
  { label: 'Family Trip', emoji: '👨‍👩‍👧' },
  { label: 'Honeymoon', emoji: '💑' },
  { label: 'Adventure Trip', emoji: '🧗' },
];

export default function TripForm({ onSubmit, onNavigate, prefilledDestination }) {
  const [formData, setFormData] = useState({
    destination: prefilledDestination || '',
    budget: '',
    days: 3,
    travelers: 1,
    style: 'Standard',
    interests: [],
    transport: 'Train',
    category: 'Solo Travel'
  });

  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const loadingPhases = [
    "Scanning top-rated hotels in your budget range...",
    "Finding authentic local restaurants nearby...",
    "Mapping the best sightseeing routes...",
    "Calculating ₹ cost breakdown for your stay...",
    "Adding local travel tips from Kerala experts..."
  ];

  useEffect(() => {
    if (prefilledDestination) {
      setFormData(prev => ({ ...prev, destination: prefilledDestination }));
    }
  }, [prefilledDestination]);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % loadingPhases.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination) return alert('Please enter a destination.');
    if (!formData.budget || formData.budget <= 0) return alert('Please enter a valid budget in ₹.');
    if (formData.days <= 0 || formData.days > 14) return alert('Please select between 1 and 14 days.');
    if (formData.travelers <= 0) return alert('Please specify at least 1 traveler.');
    if (formData.interests.length === 0) return alert('Please select at least one interest.');

    setLoading(true);
    setLoadingPhase(0);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
      alert('Failed to generate trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const idx = prev.interests.indexOf(interest);
      if (idx > -1) return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  return (
    <div className="relative min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="absolute top-6 left-6 z-10">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>

      {loading ? (
        <div className="relative z-10 w-full max-w-md glass-card rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl border border-white/10">
          <div className="relative mb-6">
            <Compass className="h-16 w-16 text-brand-accent animate-spin-slow" />
            <Sparkles className="h-6 w-6 text-emerald-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Generating Your India Trip</h2>
          <p className="text-xs text-emerald-400 font-semibold mb-4">Destination: {formData.destination} · ₹{formData.budget?.toLocaleString('en-IN')}</p>
          <div className="w-full bg-white/5 rounded-full h-1.5 mb-6 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full animate-pulse" style={{ width: '80%' }}></div>
          </div>
          <p className="text-slate-400 text-sm italic min-h-[48px] px-2">{loadingPhases[loadingPhase]}</p>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-2xl glass-card rounded-3xl p-8 md:p-10 shadow-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-3 bg-emerald-400/15 rounded-2xl border border-emerald-400/25">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Plan Your India Trip</h2>
              <p className="text-xs text-slate-400">Fill in details to generate your personalised ₹ itinerary.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Where are you going?</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Munnar, Wayanad, Kochi..."
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full glass-input pl-12 pr-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {POPULAR_SUGGESTIONS.map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => setFormData({ ...formData, destination: s })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      formData.destination === s
                        ? 'bg-emerald-400/20 border-emerald-400 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Budget with Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Budget (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number" min="500"
                  placeholder="Enter budget in Rupees"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) || '' })}
                  className="w-full glass-input pl-9 pr-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>
              {/* Budget Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {BUDGET_PRESETS.map(p => (
                  <button
                    key={p} type="button"
                    onClick={() => setFormData({ ...formData, budget: p })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      formData.budget === p
                        ? 'bg-brand-accent/20 border-brand-accent text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                    }`}
                  >₹{p.toLocaleString('en-IN')}</button>
                ))}
              </div>
            </div>

            {/* Days & Travelers */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Duration (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number" min="1" max="14"
                    value={formData.days}
                    onChange={e => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
                    className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">No. of Travelers</label>
                <div className="relative">
                  <Users className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number" min="1"
                    value={formData.travelers}
                    onChange={e => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                    className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Travel Style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Travel Style</label>
              <div className="grid grid-cols-3 gap-3">
                {['Budget', 'Standard', 'Luxury'].map(style => (
                  <button key={style} type="button"
                    onClick={() => setFormData({ ...formData, style })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.style === style
                        ? 'bg-brand-accent/20 border-brand-accent shadow-md shadow-brand-accent/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <span className="text-sm font-bold text-white block">{style}</span>
                    <span className="text-[10px] text-slate-400">{style === 'Budget' ? '₹ Saver' : style === 'Standard' ? 'Balanced' : 'Premium'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transportation */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Transportation Mode</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TRANSPORT_OPTIONS.map(t => (
                  <button key={t.label} type="button"
                    onClick={() => setFormData({ ...formData, transport: t.label })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      formData.transport === t.label
                        ? 'bg-emerald-400/15 border-emerald-400 shadow-md shadow-emerald-400/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-xs font-bold text-white">{t.label}</span>
                    <span className="text-[9px] text-slate-400 text-center leading-tight">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Trip Category</label>
              <div className="flex flex-wrap gap-2.5">
                {CATEGORY_OPTIONS.map(cat => {
                  const active = formData.category === cat.label;
                  return (
                    <button key={cat.label} type="button"
                      onClick={() => setFormData({ ...formData, category: cat.label })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        active
                          ? 'bg-brand-accent text-white border-brand-accent shadow-lg shadow-brand-accent/15'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <span>{cat.emoji}</span>{cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Your Interests</label>
              <div className="flex flex-wrap gap-2.5">
                {['Nature', 'Food', 'Adventure', 'Culture', 'Beaches'].map(interest => {
                  const active = formData.interests.includes(interest);
                  return (
                    <button key={interest} type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        active
                          ? 'bg-emerald-400/20 text-white border-emerald-400 shadow-lg shadow-emerald-400/10'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >{interest}</button>
                  );
                })}
              </div>
            </div>

            <button type="submit"
              className="w-full py-4 bg-brand-accent hover:bg-brand-accent/80 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/35 transform hover:-translate-y-0.5 transition-all cursor-pointer text-base"
            >
              <Sparkles className="h-5 w-5" />
              Generate AI Itinerary in ₹
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
