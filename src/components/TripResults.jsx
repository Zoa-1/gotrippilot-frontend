import React, { useState } from 'react';
import {
  Compass, Calendar, Users, ArrowLeft, Bookmark, Check,
  MapPin, Utensils, Bed, Landmark, Lightbulb, PieChart, Info, Train, Bus, Plane, Car
} from 'lucide-react';

const TRANSPORT_ICONS = { Train: '🚆', Bus: '🚌', Flight: '✈️', Car: '🚗' };
const CATEGORY_EMOJI = {
  'Solo Travel': '🧳',
  'Friends Trip': '🎉',
  'Family Trip': '👨‍👩‍👧',
  'Honeymoon': '💑',
  'Adventure Trip': '🧗'
};

export default function TripResults({ tripData, budgetLimit, onNavigate, onSave, isSaved, isSaving }) {
  const [activeTab, setActiveTab] = useState('itinerary');

  const {
    destination, days, travelers, style, interests,
    transport, category,
    itinerary, hotels, restaurants, attractions,
    cost_breakdown, tips
  } = tripData;

  const budgetUnder = cost_breakdown.total <= budgetLimit;
  const budgetDiff = Math.abs(budgetLimit - cost_breakdown.total);

  const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="relative min-h-screen bg-brand-dark flex flex-col justify-between">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full flex-grow">
        {/* Header navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button onClick={() => onNavigate('planner')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold w-fit">
            <ArrowLeft className="h-4 w-4" /> Adjust Parameters
          </button>

          <button onClick={onSave} disabled={isSaved || isSaving}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default'
                : 'bg-brand-accent hover:bg-brand-accent/80 text-white border-brand-accent shadow-lg shadow-brand-accent/15'
            }`}
          >
            {isSaved ? <><Check className="h-4 w-4" />Trip Saved</> :
             isSaving ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />Saving...</> :
             <><Bookmark className="h-4 w-4" />Save Itinerary</>}
          </button>
        </div>

        {/* Hero Banner */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 border border-white/5 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-3">{destination}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                <Calendar className="h-3.5 w-3.5 text-brand-accent" />{days} Days
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                <Users className="h-3.5 w-3.5 text-brand-accent" />{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                <Compass className="h-3.5 w-3.5 text-brand-accent" />{style} Style
              </span>
              {transport && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                  <span>{TRANSPORT_ICONS[transport] || '🚆'}</span>{transport}
                </span>
              )}
              {category && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 rounded-full">
                  <span>{CATEGORY_EMOJI[category] || '🧳'}</span>{category}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {(Array.isArray(interests) ? interests : interests?.split(',') || []).map(i => (
                <span key={i} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-md">
                  {i.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Budget Widget */}
          <div className="glass-card-light rounded-2xl p-6 border border-white/5 min-w-[260px]">
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Cost</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Budget</span>
            </div>
            <div className="flex justify-between items-baseline gap-4 mb-4">
              <span className="text-3xl font-black text-white">{formatINR(cost_breakdown.total)}</span>
              <span className="text-lg font-bold text-slate-400">{formatINR(budgetLimit)}</span>
            </div>
            {budgetUnder ? (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />Under budget by {formatINR(budgetDiff)}!
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />Over budget by {formatINR(budgetDiff)}
              </div>
            )}
          </div>
        </div>

        {/* Main 2-col Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-white/10 gap-6">
              {['itinerary', 'recommendations'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold transition-all relative cursor-pointer capitalize ${
                    activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'itinerary' ? 'Day-by-Day Itinerary' : 'Hotels & Dining'}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full" />}
                </button>
              ))}
            </div>

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <div className="relative border-l border-white/10 pl-6 md:pl-8 ml-3 space-y-12 py-2">
                {itinerary.map((day) => (
                  <div key={day.day_number} className="relative">
                    <div className="absolute -left-[43px] md:-left-[51px] top-1.5 bg-brand-dark p-1.5 rounded-full border-2 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                      <Compass className="h-4 w-4 animate-spin-slow" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4">{day.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Morning', color: 'text-amber-400', content: day.morning },
                        { label: 'Afternoon', color: 'text-sky-400', content: day.afternoon },
                        { label: 'Evening', color: 'text-indigo-400', content: day.evening }
                      ].map(slot => (
                        <div key={slot.label} className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${slot.color}`}>{slot.label}</span>
                          <p className="text-slate-300 text-sm leading-relaxed">{slot.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-8">
                {/* Hotels */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bed className="h-5 w-5 text-brand-accent" />Recommended Stay
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotels.map((h, i) => (
                      <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <h4 className="font-bold text-white text-base leading-tight">{h.name}</h4>
                            <span className="px-2 py-0.5 bg-brand-accent/15 border border-brand-accent/25 rounded text-[10px] font-bold text-brand-accent">{h.rating}</span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{h.features}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <span className="text-slate-400 text-xs uppercase font-semibold">Per Night</span>
                          <span className="text-lg font-black text-emerald-400">{formatINR(h.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restaurants */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-brand-accent" />Recommended Dining
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restaurants.map((r, i) => (
                      <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 space-y-2">
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <h4 className="font-bold text-white text-base leading-tight">{r.name}</h4>
                          <span className="text-emerald-400 font-extrabold text-sm">{r.cost}</span>
                        </div>
                        <span className="text-[10px] text-brand-accent font-semibold uppercase">{r.cuisine}</span>
                        <p className="text-slate-400 text-xs leading-relaxed pt-1">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PieChart className="h-5 w-5 text-brand-accent" />Trip Cost Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Stay", amount: cost_breakdown.accommodation, color: "bg-brand-accent" },
                  { label: "Food", amount: cost_breakdown.food, color: "bg-emerald-400" },
                  { label: "Transport", amount: cost_breakdown.transport, color: "bg-amber-400" },
                  { label: "Activities", amount: cost_breakdown.activities, color: "bg-indigo-400" }
                ].map((item) => {
                  const pct = Math.round((item.amount / (cost_breakdown.total || 1)) * 100);
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white">{formatINR(item.amount)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-white/10 flex justify-between font-black">
                  <span className="text-white">Total</span>
                  <span className="text-emerald-400">{formatINR(cost_breakdown.total)}</span>
                </div>
              </div>
            </div>

            {/* Attractions */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Landmark className="h-5 w-5 text-brand-accent" />Must-See Sights
              </h3>
              <div className="space-y-4">
                {attractions.map((a, i) => (
                  <div key={i} className="space-y-1 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-white text-sm">{a.name}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{a.type}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-brand-accent" />Local Travel Tips
              </h3>
              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                    <span className="p-1 bg-emerald-400/20 rounded text-emerald-400 font-black text-[10px] mt-0.5 h-4 w-4 flex items-center justify-center shrink-0">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/5 bg-brand-dark/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GoTripPilot · Budget Travel in India</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
