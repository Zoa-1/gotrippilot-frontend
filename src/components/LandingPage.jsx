import React from 'react';
import { Compass, Sparkles, Map, IndianRupee, ArrowRight, TreePine, Bus, Brain as Train, Plane, Car, CarTaxiFront } from 'lucide-react';

const KERALA_DESTINATIONS = [
  { name: 'Munnar', desc: 'Misty tea gardens & rolling hills', tag: 'Hill Station' },
  { name: 'Wayanad', desc: 'Caves, dams & tribal forests', tag: 'Forest Retreat' },
  { name: 'Alleppey', desc: 'Iconic backwaters & houseboats', tag: 'Backwaters' },
  { name: 'Kochi', desc: 'Heritage port, art & seafood', tag: 'Cultural City' },
  { name: 'Varkala', desc: 'Red cliffs & golden beaches', tag: 'Cliff Beach' },
  { name: 'Thekkady', desc: 'Wildlife safari & spice farms', tag: 'Wildlife' },
];

const TRANSPORT_MODES = [
  { icon: <Bus className="h-5 w-5" />, label: 'Bus', desc: 'Budget-friendly' },
  { icon: <Train className="h-5 w-5" />, label: 'Train', desc: 'Scenic routes' },
  { icon: <Plane className="h-5 w-5" />, label: 'Flight', desc: 'Fastest option' },
  { icon: <Car className="h-5 w-5" />, label: 'Car', desc: 'Road trips' },
  { icon: <CarTaxiFront className="h-5 w-5" />, label: 'Taxi', desc: 'Door-to-door' },
];

export default function LandingPage({ onNavigate, user, onLogout, onKeralaDestination }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <Compass className="h-7 w-7 text-brand-primary" />
          <span className="text-xl font-bold text-slate-900">GoTripPilot</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#kerala" className="hover:text-brand-primary transition-colors">Kerala</a>
          <a href="#features" className="hover:text-brand-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-brand-primary transition-colors">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors cursor-pointer">Dashboard</button>
              <button onClick={onLogout} className="btn-outline text-sm py-2 px-3">Log Out</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('auth')} className="text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors cursor-pointer">Sign In</button>
              <button onClick={() => onNavigate('planner')} className="btn-primary text-sm py-2 px-4">Plan Trip</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accentLight text-brand-accentDark text-xs font-semibold mb-5">
          <Sparkles className="h-3 w-3" />
          <span>AI-Powered Budget Travel Planning for India</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight mb-4">
          Your AI Co-Pilot for{' '}
          <span className="text-brand-primary">Budget Travel in India</span>
        </h1>

        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
          Plan your perfect Indian getaway. Enter your budget in ₹ and get a full custom itinerary with transport options, hotel stays, and local food recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <button
            onClick={() => onNavigate('planner')}
            className="btn-primary text-base py-3 px-6 flex items-center justify-center gap-2"
          >
            Plan My Trip
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => { if (user) onNavigate('dashboard'); else onNavigate('auth'); }}
            className="btn-outline text-base py-3 px-6"
          >
            View My Dashboard
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { val: '₹500+', lbl: 'Budget Starts From' },
            { val: '20%', lbl: 'Average Savings' },
            { val: '10+', lbl: 'Kerala Destinations' },
            { val: '4.8★', lbl: 'Traveler Rating' }
          ].map((stat, idx) => (
            <div key={idx} className="card p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-brand-primary mb-1">{stat.val}</span>
              <span className="text-xs font-medium text-slate-500 text-center">{stat.lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Transport Modes */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-brand-border w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">All Transport Options Covered</h2>
          <p className="text-slate-500 text-sm">Compare prices and travel times across every mode of transport in India.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {TRANSPORT_MODES.map((mode) => (
            <div key={mode.label} className="card card-hover p-4 flex flex-col items-center gap-2 text-center">
              <div className="text-brand-primary">{mode.icon}</div>
              <span className="font-semibold text-sm text-slate-800">{mode.label}</span>
              <span className="text-xs text-slate-500">{mode.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Kerala Destinations */}
      <section id="kerala" className="max-w-6xl mx-auto px-6 py-12 border-t border-brand-border w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accentLight text-brand-accentDark text-xs font-semibold mb-3">
            <TreePine className="h-3 w-3" />
            <span>God's Own Country</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Popular Kerala Destinations</h2>
          <p className="text-slate-500 text-sm">Tap any destination to instantly pre-fill your trip planner.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KERALA_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              onClick={() => onKeralaDestination(dest.name)}
              className="card card-hover p-5 text-left cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{dest.name}</h3>
                <span className="badge-accent">{dest.tag}</span>
              </div>
              <p className="text-slate-500 text-sm mb-3">{dest.desc}</p>
              <div className="flex items-center gap-1 text-brand-primary text-xs font-semibold">
                <span>Plan this trip</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-12 border-t border-brand-border w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-2">Plan Smarter Across India</h2>
          <p className="text-slate-500 text-sm">Everything a budget traveler needs, tailored to Indian travel realities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Sparkles className="h-5 w-5 text-brand-primary" />,
              title: "Smart AI Itinerary",
              desc: "Tell us your budget in ₹, preferred travel style, transport mode, and trip category to get a deeply personalized day-plan."
            },
            {
              icon: <IndianRupee className="h-5 w-5 text-brand-accent" />,
              title: "₹ Budget Breakdown",
              desc: "See a clear estimate for Stay (40%), Transport (25%), Food (20%), and Activities (15%) — all in Indian Rupees."
            },
            {
              icon: <Map className="h-5 w-5 text-brand-primary" />,
              title: "Transport Comparison",
              desc: "Compare Bus, Train, Flight, Car, and Taxi options with estimated prices and travel times. Find the cheapest or fastest route."
            }
          ].map((feat, idx) => (
            <div key={idx} className="card card-hover p-6 flex flex-col gap-3">
              <div className="p-2 bg-brand-primaryLight w-fit rounded-lg">{feat.icon}</div>
              <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-12 border-t border-brand-border w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-2">How It Works</h2>
          <p className="text-slate-500 text-sm">Your full India trip plan in under 30 seconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Set Your Preferences", desc: "Pick origin, destination, budget in ₹, transport mode, and trip category." },
            { step: "02", title: "AI Generates Your Plan", desc: "The Co-Pilot engine compiles hotels within budget, transport options, restaurants, and a day-wise schedule." },
            { step: "03", title: "Save & Travel", desc: "Save the plan to your dashboard. See cost summary with remaining budget. No hidden costs — all in ₹." }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <span className="text-4xl font-extrabold text-brand-primary/20">{step.step}</span>
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-brand-border w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-2">What Indian Travelers Say</h2>
          <p className="text-slate-500 text-sm">Budget travelers who discovered God's Own Country with GoTripPilot.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              quote: "I planned my 5-day Munnar and Alleppey honeymoon trip in just ₹18,000 using GoTripPilot. The houseboat suggestion was spot-on and saved us hours of research!",
              author: "Priya & Rahul",
              role: "Honeymooners, Bangalore"
            },
            {
              quote: "Best app for solo travelers on a tight budget. I did Wayanad and Thekkady in ₹6,500 including train tickets. The day-by-day schedule was very practical.",
              author: "Aditya Nair",
              role: "Solo Traveler, Pune"
            }
          ].map((t, idx) => (
            <div key={idx} className="card p-6 flex flex-col justify-between gap-4">
              <p className="text-slate-600 italic text-sm leading-relaxed">"{t.quote}"</p>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{t.author}</h4>
                <span className="text-xs text-brand-accent font-medium">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-slate-50 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-brand-primary" />
            <span className="font-bold text-slate-900">GoTripPilot</span>
          </div>
          <p>Your AI Co-Pilot for Budget Travel in India</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
