import React, { useState, useEffect } from 'react';
import { Compass, Calendar, Users, IndianRupee, Bookmark, Trash2, User, Globe, LogOut, ChevronRight } from 'lucide-react';

export default function Dashboard({ onNavigate, user, onLogout, onLoadTrip }) {
  const [activeTab, setActiveTab] = useState('trips');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [profileName, setProfileName] = useState(user?.full_name || 'Travel Enthusiast');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'traveler@gotrippilot.com');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('gotrippilot_token');
      const isMockUser = token === "google_demo_jwt_token_gotrippilot_mock";

      const response = await fetch('http://127.0.0.1:8000/api/trips/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (isMockUser) {
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
      destination: "Munnar",
      budget: 15000,
      days: 3,
      travelers: 2,
      style: "Budget",
      interests: "Nature, Food",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      itinerary_data: JSON.stringify({
        destination: "Munnar",
        origin: "Bangalore",
        days: 3,
        travelers: 2,
        style: "Budget",
        interests: ["Nature", "Food"],
        transport: "Bus",
        category: "Friends Trip",
        cost_breakdown: { accommodation: 6000, food: 3000, activities: 1500, transport: 2500, total: 13000 },
        transport_options: [
          { mode: "Bus", price: 2500, time: "10h" },
          { mode: "Train", price: 3500, time: "12h" },
          { mode: "Flight", price: 8000, time: "1.5h" },
        ],
        hotels: [{ name: "Green Valley Homestay", price: 1200, rating: "4.3", features: "Tea garden view, home-cooked meals" }],
        restaurants: [{ name: "Saravana Bhavan", cuisine: "South Indian", cost: "₹150-250", description: "Authentic dosas and meals" }],
        attractions: [{ name: "Tea Museum", type: "Culture", desc: "Learn about Munnar's tea history" }],
        tips: ["Book bus tickets in advance", "Carry warm clothes for evenings"],
        itinerary: [
          { day_number: 1, title: "Day 1: Arrival & Tea Gardens", morning: "Arrive by bus, check-in.", afternoon: "Visit Tea Museum.", evening: "Sunset at Mattupetty Dam." }
        ]
      })
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <Compass className="h-7 w-7 text-brand-primary" />
          <span className="text-xl font-bold text-slate-900">GoTripPilot</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('planner')}
            className="btn-primary text-sm py-2 px-4"
          >
            Plan New Trip
          </button>
          <button
            onClick={onLogout}
            className="btn-outline p-2"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex-grow w-full grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('trips')}
            className={`w-full p-3 rounded-lg flex items-center gap-3 font-semibold text-sm transition-all cursor-pointer border ${
              activeTab === 'trips'
                ? 'bg-brand-primaryLight border-brand-primary text-brand-primary'
                : 'bg-white border-brand-border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            Saved Itineraries
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full p-3 rounded-lg flex items-center gap-3 font-semibold text-sm transition-all cursor-pointer border ${
              activeTab === 'settings'
                ? 'bg-brand-primaryLight border-brand-primary text-brand-primary'
                : 'bg-white border-brand-border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="h-4 w-4" />
            Profile & Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-5">
          {activeTab === 'trips' && (
            <div>
              <h2 className="text-lg font-bold mb-4 text-slate-900">Your Saved Trips</h2>

              {loading ? (
                <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-primary border-t-transparent" />
                  <span className="text-sm text-slate-500 font-medium">Loading itineraries...</span>
                </div>
              ) : trips.length === 0 ? (
                <div className="card p-10 text-center flex flex-col items-center max-w-lg mx-auto">
                  <Bookmark className="h-10 w-10 text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-900 mb-1">No Saved Trips Yet</h3>
                  <p className="text-slate-500 text-sm mb-5">
                    You haven't generated or saved any trip plans. Co-pilot is ready to help you plan your next budget adventure!
                  </p>
                  <button
                    onClick={() => onNavigate('planner')}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Plan Your First Trip
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="card card-hover p-4 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="font-bold text-base text-slate-900">{trip.destination}</h3>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Saved {new Date(trip.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="badge-primary text-[10px]">
                            {trip.style}
                          </span>
                        </div>

                        <div className="flex gap-3 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                            {trip.days} Days
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-brand-primary" />
                            {trip.travelers} Pax
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3.5 w-3.5 text-brand-primary" />
                            {trip.budget}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-brand-border gap-3">
                        <button
                          onClick={() => handleOpenItinerary(trip)}
                          className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:text-brand-primaryDark transition-colors cursor-pointer"
                        >
                          Open Itinerary
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(trip.id)}
                          disabled={deletingId === trip.id}
                          className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer border border-red-100"
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
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-1 text-slate-900">Profile & Co-Pilot Settings</h2>
                <p className="text-xs text-slate-500">Manage your profile details and set planning defaults.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <h3 className="text-sm font-bold border-b border-brand-border pb-2 text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-primary" />
                  Personal Information
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    disabled
                    className="input-field opacity-60 cursor-not-allowed"
                  />
                </div>

                <button
                  onClick={() => alert('Profile updated successfully! (Mocked)')}
                  className="btn-primary text-xs py-2 px-3"
                >
                  Save Profile
                </button>
              </div>

              <div className="space-y-4 max-w-md pt-2">
                <h3 className="text-sm font-bold border-b border-brand-border pb-2 text-slate-700 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-primary" />
                  Trip Planning Defaults
                </h3>

                <div className="flex gap-4">
                  <div className="space-y-1 flex-grow">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Currency</label>
                    <select className="input-field">
                      <option>INR (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex-grow">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Default Style</label>
                    <select className="input-field">
                      <option>Budget</option>
                      <option>Standard</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-brand-border bg-slate-50 py-5 mt-auto">
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
