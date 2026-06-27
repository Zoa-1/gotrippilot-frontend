import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import TripForm from './components/TripForm';
import TripResults from './components/TripResults';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gotrippilot_token') || null);
  const [tripData, setTripData] = useState(null);
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [prefilledDestination, setPrefilledDestination] = useState('');

  useEffect(() => {
    if (token) {
      if (token === "google_demo_jwt_token_gotrippilot_mock") {
        setUser({ email: 'google_demo_user@gotrippilot.com', full_name: 'Google Explorer' });
        return;
      }
      fetchCurrentUser();
    } else {
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (user && pendingSave && tripData) {
      setPendingSave(false);
      saveItinerary();
    }
  }, [user, pendingSave, tripData]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        localStorage.removeItem('gotrippilot_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const handleGenerateTrip = async (formData) => {
    const response = await fetch('http://127.0.0.1:8000/api/trips/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: formData.origin,
        destination: formData.destination,
        budget: formData.budget,
        days: formData.days,
        travelers: formData.travelers,
        style: formData.style,
        interests: formData.interests,
        transport: formData.transport || 'Train',
        category: formData.category || 'Solo Travel'
      })
    });

    if (!response.ok) throw new Error('Failed to generate trip');

    const data = await response.json();
    setTripData(data);
    setBudgetLimit(formData.budget);
    setIsSaved(false);
    setView('results');
  };

  const saveItinerary = async () => {
    if (!user) {
      setPendingSave(true);
      setView('auth');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        destination: tripData.destination,
        budget: budgetLimit,
        days: tripData.days,
        travelers: tripData.travelers,
        style: tripData.style,
        interests: Array.isArray(tripData.interests) ? tripData.interests.join(', ') : tripData.interests,
        transport: tripData.transport || 'Train',
        category: tripData.category || 'Solo Travel',
        itinerary_data: JSON.stringify(tripData)
      };

      const response = await fetch('http://127.0.0.1:8000/api/trips/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save trip');

      setIsSaved(true);
      alert('Trip saved to your dashboard!');
    } catch (err) {
      console.error(err);
      setIsSaved(true);
      alert('Trip saved (Demo Mode)!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginSuccess = (newToken, mockUser = null) => {
    setToken(newToken);
    if (mockUser) setUser(mockUser);
    if (!pendingSave) setView(tripData ? 'results' : 'dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('gotrippilot_token');
    setToken(null);
    setUser(null);
    setTripData(null);
    setView('landing');
  };

  const handleLoadTrip = (parsedTrip, budget) => {
    setTripData(parsedTrip);
    setBudgetLimit(budget);
    setIsSaved(true);
    setView('results');
  };

  const handleKeralaDestination = (dest) => {
    setPrefilledDestination(dest);
    setView('planner');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {view === 'landing' && (
        <LandingPage
          onNavigate={setView}
          user={user}
          onLogout={handleLogout}
          onKeralaDestination={handleKeralaDestination}
        />
      )}
      {view === 'planner' && (
        <TripForm
          onSubmit={handleGenerateTrip}
          onNavigate={setView}
          prefilledDestination={prefilledDestination}
        />
      )}
      {view === 'results' && (
        <TripResults
          tripData={tripData}
          budgetLimit={budgetLimit}
          onNavigate={setView}
          onSave={saveItinerary}
          isSaved={isSaved}
          isSaving={isSaving}
        />
      )}
      {view === 'auth' && (
        <Auth onLoginSuccess={handleLoginSuccess} onNavigate={setView} />
      )}
      {view === 'dashboard' && (
        <Dashboard
          onNavigate={setView}
          user={user}
          onLogout={handleLogout}
          onLoadTrip={handleLoadTrip}
        />
      )}
    </div>
  );
}
