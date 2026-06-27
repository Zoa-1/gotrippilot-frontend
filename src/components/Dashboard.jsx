import React, { useState, useEffect } from 'react';
import { Compass, Calendar, Users, DollarSign, Bookmark, Trash2, User, Key, Globe, LogOut, ChevronRight, HelpCircle } from 'lucide-react';

export default function Dashboard({ onNavigate, user, onLogout, onLoadTrip }) {
  const [activeTab, setActiveTab] = useState('trips'); // 'trips' or 'settings'
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Settings State Mock
  const [profileName, setProfileName] = useState(user?.full_name || 'Travel Enthusiast');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'traveler@gotrippilot.com');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('gotrippilot_token');
      // If it's the mock google user, load dummy trip data if fetch fails
      const isMockUser = token === "google_demo_jwt_token_gotrippilot_mock";
      
      const response = await fetch('http://127.0.0.1:8000/api/trips/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (isMockUser) {
          // Provide mock trip history for Google Demo user if backend is not running/empty
          setTrips(getMockHistory());
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.error(err);
      // Fallback for safety in frontend-only testing
      setTrips(getMockHistory());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    setDeletingId(tripId);

    try {
      const token = localStorage.getItem('gotrippilot_token');
      // If it's a mock frontend trip, delete locally
      if (typeof tripId === 'string' && tripId.startsWith('mock-')) {
        setTrips(prev => prev.filter(t => t.id !== tripId));
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete');
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (err) {
      console.error(err);
      // Fallback local deletion
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenItinerary = (trip) => {
    const parsedData = typeof trip.itinerary_data === 'string' 
      ? JSON.parse(trip.itinerary_data) 
      : trip.itinerary_data;
    onLoadTrip(parsedData, trip.budget);
  };

  const getMockHistory = () => [
    {
      id: "mock-1",
      destination: "Paris",
      budget: 2000,
      days: 5,
      travelers: 2,
      style: "Standard",
      interests: "Culture, Food",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      itinerary_data: JSON.stringify({
        destination: "Paris",
        days: 5,
        travelers: 2,
        style: "Standard",
        interests: ["Culture", "Food"],
        cost_breakdown: { accommodation: 1050, food: 250, activities: 150, transport: 100, total: 1550 },
        hotels: [{ name: "Hotel Relais Bosquet", price: 210, rating: "4.6★", features: "Eiffel views" }],
        restaurants: [{ name: "Bouillon Chartier", cuisine: "French", cost: "$$", description: "Historic brasserie" }],
        attractions: [{ name: "Louvre Museum", type: "Culture", desc: "World largest museum" }],
        tips: ["Buy the Paris Museum Pass"],
        itinerary: [
          { day_number: 1, title: "Day 1: Arrival & Culture", morning: "Explore Jardin des Tuileries.", afternoon: "Louvre Museum guide.", evening: "Dinner at Bouillon Chartier." }
        ]
      })
    }
  ];

  return (
    <div className="relative min-h-screen bg-brand-dark flex flex-col justify-between">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      {/* Navigation Header */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <Compass className="h-7 w-7 text-brand-accent animate-spin-slow" />
          <span className="text-xl font-bold tracking-tight text-white font-sans">GoTripPilot</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('planner')} 
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-accent text-white shadow hover:bg-brand-accent/80 transition-all cursor-pointer"
          >
            Plan New Trip
          </button>
          <button 
            onClick={onLogout}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex-grow w-full grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-3">
          <button
            onClick={() => setActiveTab('trips')}
            className={`w-full p-4 rounded-2xl flex items-center gap-3 font-semibold text-sm transition-all cursor-pointer border ${
              activeTab === 'trips' 
                ? 'bg-brand-accent/15 border-brand-accent/35 text-white shadow'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-white'
            }`}
          >
            <Bookmark className="h-4.5 w-4.5 text-brand-accent" />
            Saved Itineraries
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full p-4 rounded-2xl flex items-center gap-3 font-semibold text-sm transition-all cursor-pointer border ${
              activeTab === 'settings' 
                ? 'bg-brand-accent/15 border-brand-accent/35 text-white shadow'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-white'
            }`}
          >
            <User className="h-4.5 w-4.5 text-brand-accent" />
            Profile & Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'trips' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Your Saved Trips</h2>

              {loading ? (
                <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-accent border-t-transparent" />
                  <span className="text-sm text-slate-400 font-semibold">Loading itineraries...</span>
                </div>
              ) : trips.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center border border-white/5 flex flex-col items-center max-w-lg mx-auto">
                  <Bookmark className="h-12 w-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">No Saved Trips Yet</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    You haven't generated or saved any trip plans. Co-pilot is ready to help you plan your next budget adventure!
                  </p>
                  <button
                    onClick={() => onNavigate('planner')}
                    className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/80 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Plan Your First Trip
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trips.map((trip) => (
                    <div 
                      key={trip.id} 
                      className="glass-card glass-card-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between gap-6"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-extrabold text-lg text-white leading-tight">{trip.destination}</h3>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              Saved {new Date(trip.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-brand-accent/15 border border-brand-accent/25 rounded text-[10px] font-bold text-brand-accent uppercase">
                            {trip.style}
                          </span>
                        </div>

                        <div className="flex gap-4 text-xs font-semibold text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-brand-accent" />
                            {trip.days} Days
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-brand-accent" />
                            {trip.travelers} Pax
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-brand-accent" />
                            ${trip.budget} Max
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5 gap-4">
                        <button
                          onClick={() => handleOpenItinerary(trip)}
                          className="flex items-center gap-1 text-xs font-semibold text-brand-accent hover:text-white transition-colors cursor-pointer"
                        >
                          Open Itinerary
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(trip.id)}
                          disabled={deletingId === trip.id}
                          className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer border border-red-500/10"
                          title="Delete trip"
                        >
                          {deletingId === trip.id ? (
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-red-400 border-t-transparent" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-2">Profile & Co-Pilot Settings</h2>
                <p className="text-xs text-slate-400">Manage your profile details and set planning defaults.</p>
              </div>

              {/* Personal Info Form */}
              <div className="space-y-4 max-w-md">
                <h3 className="text-sm font-bold border-b border-white/5 pb-2 text-slate-300 flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-accent" />
                  Personal Information
                </h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    disabled
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs opacity-60 cursor-not-allowed"
                  />
                </div>
                
                <button
                  onClick={() => alert('Profile updated successfully! (Mocked)')}
                  className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/80 text-white font-semibold rounded-lg transition-all cursor-pointer text-xs"
                >
                  Save Profile
                </button>
              </div>

              {/* Co-Pilot Defaults (Mocked) */}
              <div className="space-y-4 max-w-md pt-4">
                <h3 className="text-sm font-bold border-b border-white/5 pb-2 text-slate-300 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-accent" />
                  Trip Planning Defaults
                </h3>
                
                <div className="flex gap-4">
                  <div className="space-y-1 flex-grow">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Currency</label>
                    <select className="w-full glass-input px-3 py-2 rounded-xl text-xs">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex-grow">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Default Style</label>
                    <select className="w-full glass-input px-3 py-2 rounded-xl text-xs">
                      <option>Standard</option>
                      <option>Budget</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-brand-dark/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GoTripPilot. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
