import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Calendar, IndianRupee, Users, ChevronLeft, Bus, Brain as Train, Plane, Car, CarTaxiFront, LocateFixed } from 'lucide-react';

const POPULAR_SUGGESTIONS = ['Munnar', 'Wayanad', 'Kochi', 'Varkala', 'Goa', 'Ooty', 'Jaipur', 'Manali'];
const BUDGET_PRESETS = [5000, 10000, 20000, 50000];
const TRANSPORT_OPTIONS = [
  { label: 'Bus', icon: <Bus className="h-5 w-5" />, desc: 'Economical' },
  { label: 'Train', icon: <Train className="h-5 w-5" />, desc: 'Scenic' },
  { label: 'Flight', icon: <Plane className="h-5 w-5" />, desc: 'Fastest' },
  { label: 'Car', icon: <Car className="h-5 w-5" />, desc: 'Flexible' },
  { label: 'Taxi', icon: <CarTaxiFront className="h-5 w-5" />, desc: 'Door-to-door' },
];
const CATEGORY_OPTIONS = [
  { label: 'Solo Travel' },
  { label: 'Friends Trip' },
  { label: 'Family Trip' },
  { label: 'Honeymoon' },
  { label: 'Adventure Trip' },
];

export default function TripForm({ onSubmit, onNavigate, prefilledDestination }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: prefilledDestination || '',
    budget: '',
    days: 3,
    travelers: 1,
    style: 'Standard',
    interests: [],
    transport: 'Train',
    category: 'Solo Travel'
  });
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const loadingPhases = [
    "Scanning top-rated hotels within your budget...",
    "Finding affordable local restaurants & street food...",
    "Comparing transport options with prices & times...",
    "Calculating ₹ cost breakdown for your stay...",
    "Adding local travel tips from Indian experts..."
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

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Reverse geocode would happen here; for now we just note the coordinates
        setFormData(prev => ({ ...prev, origin: 'Current Location' }));
        setLocating(false);
      },
      (err) => {
        console.error(err);
        alert('Unable to retrieve your location. Please enter manually.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-10">
      <div className="absolute top-4 left-4">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors cursor-pointer text-sm font-medium">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>

      {loading ? (
        <div className="w-full max-w-md card p-10 flex flex-col items-center text-center mt-8">
          <div className="relative mb-5">
            <Compass className="h-14 w-14 text-brand-primary animate-spin" style={{ animationDuration: '3s' }} />
            <Sparkles className="h-5 w-5 text-brand-accent absolute -top-1 -right-1" />
          </div>
          <h2 className="text-xl font-bold mb-1">Generating Your India Trip</h2>
          <p className="text-xs text-brand-accent font-medium mb-4">{formData.destination} · ₹{formData.budget?.toLocaleString('en-IN')}</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5 overflow-hidden">
            <div className="bg-brand-accent h-full rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
          <p className="text-slate-500 text-sm italic min-h-[40px] px-2">{loadingPhases[loadingPhase]}</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl card p-8 md:p-10 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-brand-primaryLight rounded-xl">
              <Sparkles className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Plan Your India Trip</h2>
              <p className="text-xs text-slate-500">Fill in details to generate your personalised ₹ itinerary.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Origin with location button */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Starting From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai, Delhi..."
                  value={formData.origin}
                  onChange={e => setFormData({ ...formData, origin: e.target.value })}
                  className="input-field pl-9"
                />
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-primaryDark transition-colors cursor-pointer"
              >
                <LocateFixed className="h-3.5 w-3.5" />
                {locating ? 'Detecting location...' : 'Use My Current Location'}
              </button>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Where are you going?</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Munnar, Wayanad, Kochi..."
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="input-field pl-9"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {POPULAR_SUGGESTIONS.map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => setFormData({ ...formData, destination: s })}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      formData.destination === s
                        ? 'bg-brand-primaryLight border-brand-primary text-brand-primary'
                        : 'bg-white border-brand-border text-slate-500 hover:border-brand-primary/30'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Budget with Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Budget (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="number" min="500"
                  placeholder="Enter budget in Rupees"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) || '' })}
                  className="input-field pl-9"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {BUDGET_PRESETS.map(p => (
                  <button
                    key={p} type="button"
                    onClick={() => setFormData({ ...formData, budget: p })}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      formData.budget === p
                        ? 'bg-brand-primaryLight border-brand-primary text-brand-primary'
                        : 'bg-white border-brand-border text-slate-500 hover:border-brand-primary/30'
                    }`}
                  >₹{p.toLocaleString('en-IN')}</button>
                ))}
              </div>
            </div>

            {/* Days & Travelers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Duration (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="number" min="1" max="14"
                    value={formData.days}
                    onChange={e => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
                    className="input-field pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">No. of Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="number" min="1"
                    value={formData.travelers}
                    onChange={e => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                    className="input-field pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Travel Style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Travel Style</label>
              <div className="grid grid-cols-3 gap-3">
                {['Budget', 'Standard', 'Luxury'].map(style => (
                  <button key={style} type="button"
                    onClick={() => setFormData({ ...formData, style })}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      formData.style === style
                        ? 'bg-brand-primaryLight border-brand-primary text-brand-primary'
                        : 'bg-white border-brand-border text-slate-600 hover:border-brand-primary/30'
                    }`}
                  >
                    <span className="text-sm font-semibold block">{style}</span>
                    <span className="text-[10px] text-slate-400">{style === 'Budget' ? '₹ Saver' : style === 'Standard' ? 'Balanced' : 'Premium'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transportation */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Transportation Mode</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {TRANSPORT_OPTIONS.map(t => (
                  <button key={t.label} type="button"
                    onClick={() => setFormData({ ...formData, transport: t.label })}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      formData.transport === t.label
                        ? 'bg-brand-accentLight border-brand-accent text-brand-accentDark'
                        : 'bg-white border-brand-border text-slate-600 hover:border-brand-primary/30'
                    }`}
                  >
                    {t.icon}
                    <span className="text-xs font-semibold">{t.label}</span>
                    <span className="text-[10px] text-slate-400 text-center">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Trip Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map(cat => {
                  const active = formData.category === cat.label;
                  return (
                    <button key={cat.label} type="button"
                      onClick={() => setFormData({ ...formData, category: cat.label })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white border-brand-border text-slate-600 hover:border-brand-primary/30'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Your Interests</label>
              <div className="flex flex-wrap gap-2">
                {['Nature', 'Food', 'Adventure', 'Culture', 'Beaches', 'Shopping'].map(interest => {
                  const active = formData.interests.includes(interest);
                  return (
                    <button key={interest} type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'bg-brand-accentLight text-brand-accentDark border-brand-accent'
                          : 'bg-white border-brand-border text-slate-600 hover:border-brand-primary/30'
                      }`}
                    >{interest}</button>
                  );
                })}
              </div>
            </div>

            <button type="submit"
              className="w-full py-3 bg-brand-primary hover:bg-brand-primaryDark text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-base"
            >
              <Sparkles className="h-4 w-4" />
              Generate AI Itinerary
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
