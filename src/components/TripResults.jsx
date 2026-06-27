import React, { useState } from 'react';
import { Compass, Calendar, Users, ArrowLeft, Bookmark, Check, MapPin, Utensils, Bed, Landmark, Lightbulb, IndianRupee, Info, Bus, Brain as Train, Plane, Car, CarTaxiFront, Clock, TrendingDown, Zap } from 'lucide-react';

const TRANSPORT_ICONS = {
  Bus: <Bus className="h-4 w-4" />,
  Train: <Train className="h-4 w-4" />,
  Flight: <Plane className="h-4 w-4" />,
  Car: <Car className="h-4 w-4" />,
  Taxi: <CarTaxiFront className="h-4 w-4" />,
};

const CATEGORY_LABELS = {
  'Solo Travel': 'Solo',
  'Friends Trip': 'Friends',
  'Family Trip': 'Family',
  'Honeymoon': 'Honeymoon',
  'Adventure Trip': 'Adventure',
};

function formatINR(val) {
  return `₹${Number(val).toLocaleString('en-IN')}`;
}

export default function TripResults({ tripData, budgetLimit, onNavigate, onSave, isSaved, isSaving }) {
  const [activeTab, setActiveTab] = useState('itinerary');

  const {
    destination, days, travelers, style, interests,
    transport, category, origin,
    itinerary, hotels, restaurants, attractions,
    cost_breakdown, tips, transport_options
  } = tripData;

  const budgetUnder = cost_breakdown.total <= budgetLimit;
  const budgetDiff = Math.abs(budgetLimit - cost_breakdown.total);
  const remaining = budgetLimit - cost_breakdown.total;

  // Budget allocation percentages
  const hotelAlloc = budgetLimit * 0.40;
  const transportAlloc = budgetLimit * 0.25;
  const foodAlloc = budgetLimit * 0.20;
  const activitiesAlloc = budgetLimit * 0.15;

  const transportOpts = transport_options || [];
  const cheapest = transportOpts.length > 0
    ? transportOpts.reduce((a, b) => a.price < b.price ? a : b)
    : null;
  const fastest = transportOpts.length > 0
    ? transportOpts.reduce((a, b) => {
        const getMins = (t) => {
          const m = t.time.match(/(\d+)\s*h/i);
          return m ? parseInt(m[1]) * 60 : 0;
        };
        return getMins(a) < getMins(b) ? a : b;
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 w-full flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <button onClick={() => onNavigate('planner')}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors cursor-pointer text-sm font-medium w-fit">
            <ArrowLeft className="h-4 w-4" /> Adjust Parameters
          </button>

          <button onClick={onSave} disabled={isSaved || isSaving}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              isSaved
                ? 'bg-brand-accentLight border-brand-accent text-brand-accentDark cursor-default'
                : 'bg-brand-primary hover:bg-brand-primaryDark text-white border-brand-primary'
            }`}
          >
            {isSaved ? <><Check className="h-4 w-4" />Trip Saved</> :
             isSaving ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />Saving...</> :
             <><Bookmark className="h-4 w-4" />Save Itinerary</>}
          </button>
        </div>

        {/* Hero Banner */}
        <div className="card p-5 md:p-6 mb-6 flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{destination}</h1>
            {origin && (
              <p className="text-sm text-slate-500 mb-2 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> From {origin}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="badge-gray flex items-center gap-1">
                <Calendar className="h-3 w-3" />{days} Days
              </span>
              <span className="badge-gray flex items-center gap-1">
                <Users className="h-3 w-3" />{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
              </span>
              <span className="badge-gray">{style} Style</span>
              {transport && (
                <span className="badge-gray flex items-center gap-1">
                  {TRANSPORT_ICONS[transport] || <Bus className="h-3 w-3" />}{transport}
                </span>
              )}
              {category && (
                <span className="badge-accent">{CATEGORY_LABELS[category] || category}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(Array.isArray(interests) ? interests : interests?.split(',') || []).map(i => (
                <span key={i} className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 bg-brand-primaryLight text-brand-primary rounded">
                  {i.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Budget Widget */}
          <div className="card bg-brand-light p-5 min-w-[240px]">
            <div className="flex justify-between items-start gap-4 mb-1">
              <span className="text-xs font-medium text-slate-500 uppercase">Estimated Cost</span>
              <span className="text-xs font-medium text-slate-500 uppercase">Your Budget</span>
            </div>
            <div className="flex justify-between items-baseline gap-4 mb-3">
              <span className="text-2xl font-bold text-slate-900">{formatINR(cost_breakdown.total)}</span>
              <span className="text-base font-semibold text-slate-500">{formatINR(budgetLimit)}</span>
            </div>
            {budgetUnder ? (
              <div className="px-3 py-1.5 rounded-md bg-brand-accentLight border border-brand-accent text-brand-accentDark text-xs font-medium flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />Under budget by {formatINR(budgetDiff)}
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />Over budget by {formatINR(budgetDiff)}
              </div>
            )}
          </div>
        </div>

        {/* Trip Cost Summary */}
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-brand-primary" />Trip Cost Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <span className="text-[10px] font-semibold text-blue-600 uppercase block mb-1">Transport</span>
              <span className="text-lg font-bold text-slate-900">{formatINR(cost_breakdown.transport)}</span>
              <span className="text-[10px] text-slate-400 block">Allocated {formatINR(transportAlloc)}</span>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
              <span className="text-[10px] font-semibold text-indigo-600 uppercase block mb-1">Hotel</span>
              <span className="text-lg font-bold text-slate-900">{formatINR(cost_breakdown.accommodation)}</span>
              <span className="text-[10px] text-slate-400 block">Allocated {formatINR(hotelAlloc)}</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] font-semibold text-emerald-600 uppercase block mb-1">Food</span>
              <span className="text-lg font-bold text-slate-900">{formatINR(cost_breakdown.food)}</span>
              <span className="text-[10px] text-slate-400 block">Allocated {formatINR(foodAlloc)}</span>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
              <span className="text-[10px] font-semibold text-amber-600 uppercase block mb-1">Activities</span>
              <span className="text-lg font-bold text-slate-900">{formatINR(cost_breakdown.activities)}</span>
              <span className="text-[10px] text-slate-400 block">Allocated {formatINR(activitiesAlloc)}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-600 uppercase block mb-1">Remaining</span>
              <span className={`text-lg font-bold ${remaining >= 0 ? 'text-brand-accent' : 'text-red-500'}`}>{formatINR(remaining)}</span>
              <span className="text-[10px] text-slate-400 block">of {formatINR(budgetLimit)}</span>
            </div>
          </div>
        </div>

        {/* Transport Options */}
        {transportOpts.length > 0 && (
          <div className="card p-5 mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bus className="h-4 w-4 text-brand-primary" />Transport Options: {origin || 'Your City'} to {destination}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {transportOpts.map((opt, i) => {
                const isCheapest = cheapest && opt.mode === cheapest.mode;
                const isFastest = fastest && opt.mode === fastest.mode;
                return (
                  <div key={i} className={`p-4 rounded-lg border transition-all ${
                    opt.mode === transport
                      ? 'bg-brand-primaryLight border-brand-primary'
                      : 'bg-white border-brand-border'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {TRANSPORT_ICONS[opt.mode] || <Bus className="h-4 w-4" />}
                        <span className="font-semibold text-sm text-slate-900">{opt.mode}</span>
                      </div>
                      <div className="flex gap-1">
                        {isCheapest && (
                          <span className="badge-accent flex items-center gap-0.5 text-[10px]">
                            <TrendingDown className="h-2.5 w-2.5" />Cheapest
                          </span>
                        )}
                        {isFastest && (
                          <span className="badge-primary flex items-center gap-0.5 text-[10px]">
                            <Zap className="h-2.5 w-2.5" />Fastest
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-brand-primary">{formatINR(opt.price)}</span>
                      <span className="flex items-center gap-1 text-slate-500 text-xs">
                        <Clock className="h-3 w-3" />{opt.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main 2-col Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="flex border-b border-brand-border gap-6">
              {['itinerary', 'recommendations'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 text-sm font-semibold transition-all relative cursor-pointer capitalize ${
                    activeTab === tab ? 'text-brand-primary' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'itinerary' ? 'Day-by-Day Itinerary' : 'Hotels & Dining'}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />}
                </button>
              ))}
            </div>

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <div className="space-y-8 py-2">
                {itinerary.map((day) => (
                  <div key={day.day_number}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-brand-primary text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                        {day.day_number}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{day.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-8">
                      {[
                        { label: 'Morning', color: 'text-amber-600', bg: 'bg-amber-50', content: day.morning },
                        { label: 'Afternoon', color: 'text-sky-600', bg: 'bg-sky-50', content: day.afternoon },
                        { label: 'Evening', color: 'text-indigo-600', bg: 'bg-indigo-50', content: day.evening }
                      ].map(slot => (
                        <div key={slot.label} className={`${slot.bg} rounded-lg p-4 border border-slate-100 space-y-1.5`}>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${slot.color}`}>{slot.label}</span>
                          <p className="text-slate-700 text-sm leading-relaxed">{slot.content}</p>
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
                  <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-slate-900">
                    <Bed className="h-4 w-4 text-brand-primary" />Recommended Stay
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hotels.map((h, i) => (
                      <div key={i} className="card p-4 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex justify-between items-start gap-3 mb-1">
                            <h4 className="font-bold text-sm text-slate-900">{h.name}</h4>
                            <span className="badge-primary text-[10px]">{h.rating}</span>
                          </div>
                          <p className="text-slate-500 text-xs">{h.features}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-brand-border">
                          <span className="text-slate-400 text-[10px] uppercase font-medium">Per Night</span>
                          <span className="text-base font-bold text-brand-accent">{formatINR(h.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restaurants */}
                <div>
                  <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-slate-900">
                    <Utensils className="h-4 w-4 text-brand-primary" />Recommended Dining
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {restaurants.map((r, i) => (
                      <div key={i} className="card p-4 space-y-1.5">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="font-bold text-sm text-slate-900">{r.name}</h4>
                          <span className="text-brand-accent font-bold text-xs">{r.cost}</span>
                        </div>
                        <span className="text-[10px] text-brand-primary font-semibold uppercase">{r.cuisine}</span>
                        <p className="text-slate-500 text-xs leading-relaxed pt-0.5">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Cost Breakdown with bars */}
            <div className="card p-5 space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <IndianRupee className="h-4 w-4 text-brand-primary" />Budget Allocation
              </h3>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "Hotel (40%)", amount: cost_breakdown.accommodation, alloc: hotelAlloc, color: "bg-indigo-500" },
                  { label: "Transport (25%)", amount: cost_breakdown.transport, alloc: transportAlloc, color: "bg-blue-500" },
                  { label: "Food (20%)", amount: cost_breakdown.food, alloc: foodAlloc, color: "bg-emerald-500" },
                  { label: "Activities (15%)", amount: cost_breakdown.activities, alloc: activitiesAlloc, color: "bg-amber-500" },
                ].map((item) => {
                  const pct = Math.round((item.amount / (cost_breakdown.total || 1)) * 100);
                  const underAlloc = item.amount <= item.alloc;
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">{item.label}</span>
                        <span className={`font-semibold ${underAlloc ? 'text-slate-700' : 'text-red-500'}`}>{formatINR(item.amount)}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-brand-border flex justify-between font-bold">
                  <span className="text-slate-900">Total</span>
                  <span className="text-brand-accent">{formatINR(cost_breakdown.total)}</span>
                </div>
              </div>
            </div>

            {/* Attractions */}
            <div className="card p-5 space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <Landmark className="h-4 w-4 text-brand-primary" />Must-See Sights
              </h3>
              <div className="space-y-3">
                {attractions.map((a, i) => (
                  <div key={i} className="space-y-0.5 border-b border-brand-border pb-2 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{a.name}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{a.type}</span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card p-5 space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <Lightbulb className="h-4 w-4 text-brand-primary" />Local Travel Tips
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                    <span className="mt-0.5 h-4 w-4 rounded-full bg-brand-accentLight text-brand-accentDark font-bold text-[10px] flex items-center justify-center shrink-0">{i + 1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-brand-border bg-slate-50 py-5 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>GoTripPilot · Budget Travel in India</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
