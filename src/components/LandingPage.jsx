import React from 'react';
import { Compass, Sparkles, Map, DollarSign, ArrowRight, TreePine, Waves, Mountain, Clock, Users } from 'lucide-react';

const KERALA_DESTINATIONS = [
  { name: 'Munnar', emoji: '🌿', desc: 'Misty tea gardens & rolling hills', tag: 'Hill Station' },
  { name: 'Wayanad', emoji: '🌳', desc: 'Caves, dams & tribal forests', tag: 'Forest Retreat' },
  { name: 'Alleppey', emoji: '🚢', desc: 'Iconic backwaters & houseboats', tag: 'Backwaters' },
  { name: 'Kochi', emoji: '⚓', desc: 'Heritage port, art & seafood', tag: 'Cultural City' },
  { name: 'Varkala', emoji: '🏖️', desc: 'Red cliffs & golden beaches', tag: 'Cliff Beach' },
  { name: 'Thekkady', emoji: '🐘', desc: 'Wildlife safari & spice farms', tag: 'Wildlife' },
];

export default function LandingPage({ onNavigate, user, onLogout, onKeralaDestination }) {
  return (
    <div className="relative min-h-screen bg-brand-dark overflow-hidden flex flex-col justify-between">
      {/* Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div>
        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <Compass className="h-8 w-8 text-brand-accent animate-spin-slow" />
            <div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-accent bg-clip-text text-transparent font-sans">
                GoTripPilot
              </span>
              <p className="text-[10px] text-emerald-400 font-semibold leading-none tracking-wide hidden md:block">India's Budget Travel Co-Pilot</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#kerala" className="hover:text-white transition-colors">Kerala</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">Dashboard</button>
                <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">Log Out</button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('auth')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">Sign In</button>
                <button onClick={() => onNavigate('planner')} className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-accent text-white shadow-lg shadow-brand-accent/20 hover:bg-brand-accent/80 transition-all cursor-pointer">Plan Trip</button>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-16 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 animate-float">
            <Sparkles className="h-3 w-3" />
            <span>AI-Powered Budget Travel Planning for India</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-5xl leading-tight md:leading-none mb-6">
            Your AI Co-Pilot for{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-brand-accent bg-clip-text text-transparent">
              Budget Travel in India
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Plan your perfect Indian getaway — from Kerala's misty hills to Goa's sun-kissed beaches. Enter your budget in ₹ and get a full custom itinerary in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              onClick={() => onNavigate('planner')}
              className="px-8 py-4 bg-brand-accent hover:bg-brand-accent/80 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/25 hover:shadow-brand-accent/40 transform hover:-translate-y-0.5 transition-all cursor-pointer text-base"
            >
              Plan My Trip
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => { if (user) onNavigate('dashboard'); else onNavigate('auth'); }}
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer text-base"
            >
              View My Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-4xl">
            {[
              { val: '₹500+', lbl: 'Budget Starts From' },
              { val: '20%', lbl: 'Average Savings' },
              { val: '10+', lbl: 'Kerala Destinations' },
              { val: '4.8★', lbl: 'Traveler Rating' }
            ].map((stat, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-white bg-clip-text text-transparent mb-1">{stat.val}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">{stat.lbl}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Kerala Destinations Showcase */}
        <section id="kerala" className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <TreePine className="h-3 w-3" />
              <span>God's Own Country</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Popular Kerala Destinations</h2>
            <p className="text-slate-400">Tap any destination to instantly pre-fill your trip planner. Kerala awaits!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {KERALA_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                onClick={() => onKeralaDestination(dest.name)}
                className="glass-card glass-card-hover rounded-2xl p-6 text-left flex flex-col gap-3 border border-white/5 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl">{dest.emoji}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                    {dest.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-1 group-hover:text-emerald-300 transition-colors">{dest.name}</h3>
                  <p className="text-slate-400 text-sm">{dest.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-brand-accent text-xs font-semibold mt-1">
                  <span>Plan this trip</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan Smarter Across India</h2>
            <p className="text-slate-400">Everything a budget traveler needs, tailored to Indian travel realities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                icon: <Sparkles className="h-6 w-6 text-brand-accent" />,
                title: "Smart AI Itinerary",
                desc: "Tell us your budget in ₹, preferred travel style, transport mode (Train/Bus/Flight/Car), and travel category to get a deeply personalized day-plan."
              },
              {
                icon: <DollarSign className="h-6 w-6 text-emerald-400" />,
                title: "₹ Budget Breakdown",
                desc: "See a clear estimate for Stay, Food, Transport, and Activities — all in Indian Rupees, split by each day."
              },
              {
                icon: <Map className="h-6 w-6 text-sky-400" />,
                title: "Kerala-First Coverage",
                desc: "Deep local data for Munnar, Wayanad, Alleppey, Kochi, Varkala, and Thekkady — with tips from real travelers."
              }
            ].map((feat, idx) => (
              <div key={idx} className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col gap-4">
                <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10">{feat.icon}</div>
                <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400">Your full India trip plan in under 30 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Set Your Preferences", desc: "Pick your destination, budget in ₹, transport mode (Train/Bus/Flight/Car), and travel category (Family/Solo/Honeymoon…)." },
              { step: "02", title: "AI Generates Your Plan", desc: "The Co-Pilot engine compiles hotels, restaurants, attractions, and a day-wise schedule matching your exact needs." },
              { step: "03", title: "Save & Travel", desc: "Save the plan to your dashboard. Print it or open it offline. No hidden costs — all in ₹." }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <span className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400/50 to-emerald-400/10 bg-clip-text text-transparent">{step.step}</span>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Indian Travelers Say</h2>
            <p className="text-slate-400">Budget travelers who discovered God's Own Country with GoTripPilot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
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
              <div key={idx} className="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between gap-6">
                <p className="text-slate-300 italic text-base leading-relaxed">"{t.quote}"</p>
                <div>
                  <h4 className="font-bold text-white text-sm">{t.author}</h4>
                  <span className="text-xs text-emerald-400 font-semibold uppercase">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-brand-dark/80 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-brand-accent" />
            <span className="font-bold text-white">GoTripPilot</span>
          </div>
          <p>© {new Date().getFullYear()} GoTripPilot · Your AI Co-Pilot for Budget Travel in India</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
