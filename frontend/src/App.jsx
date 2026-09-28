import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MetricCards from './components/Dashboard/MetricCards';
import NationalMap from './components/Dashboard/NationalMap';
import PriorityQueue from './components/Dashboard/PriorityQueue';
import EventTable from './components/Events/EventTable';
import EventDetailModal from './components/Events/EventDetailModal';
import AnalyticsHub from './components/Analytics/AnalyticsHub';
import OperatorDesk from './components/ReviewQueue/OperatorDesk';
import CitizenReportPWA from './components/CitizenSubmit/CitizenReportPWA';
import GrievancePortal from './components/Grievance/GrievancePortal';
import CapBroadcast from './components/Alerts/CapBroadcast';
import SystemStatus from './components/System/SystemStatus';
import CyclonePredictor from './components/Forecast/CyclonePredictor';
import AuthorityLoginModal from './components/Auth/AuthorityLoginModal';
import { Lock } from 'lucide-react';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [h3Clusters, setH3Clusters] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [grievanceEventId, setGrievanceEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apex Authority Profile (Full Unrestricted System Access)
  const FULL_ACCESS_AUTHORITY = {
    id: 'commander.imd@gov.in',
    name: 'National Disaster Commander (Full Access)',
    role: 'Apex Authority (Full System Access)',
    badge: 'GOV-APEX-MAX-CLEARANCE'
  };

  // Authority State (Role-based access for IMD / Disaster Authorities - Default: Full Access)
  const [authorityUser, setAuthorityUser] = useState(() => {
    try {
      const saved = localStorage.getItem('imd_authority_officer');
      if (saved) return JSON.parse(saved);
    } catch {}
    try {
      localStorage.setItem('imd_authority_officer', JSON.stringify(FULL_ACCESS_AUTHORITY));
    } catch {}
    return FULL_ACCESS_AUTHORITY;
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLoginSuccess = (officer) => {
    const active = officer || FULL_ACCESS_AUTHORITY;
    setAuthorityUser(active);
    try {
      localStorage.setItem('imd_authority_officer', JSON.stringify(active));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    // When reset, immediately provide full access
    setAuthorityUser(FULL_ACCESS_AUTHORITY);
    try {
      localStorage.setItem('imd_authority_officer', JSON.stringify(FULL_ACCESS_AUTHORITY));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumRes, evRes, h3Res] = await Promise.all([
        api.getSummary().catch(() => null),
        api.getEvents({ limit: 100 }).catch(() => []),
        api.getH3Clusters().catch(() => ({ clusters: [] }))
      ]);

      if (sumRes) setSummary(sumRes);
      if (evRes) setEvents(evRes);
      if (h3Res?.clusters) setH3Clusters(h3Res.clusters);
    } catch (err) {
      console.error('Data sync failed', err);
      setError('Failed to connect to the National Command Server. Check backend status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh telemetry every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenGrievance = (eventId) => {
    setGrievanceEventId(eventId);
    setActiveTab('grievance');
  };

  const handleSyncLiveWeather = async () => {
    try {
      setLoading(true);
      await api.syncLiveTelemetry(true);
      await fetchData();
    } catch (err) {
      console.error('Failed to sync live telemetry', err);
      setError('Live meteorological stream sync failed. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTwitter = async () => {
    try {
      setLoading(true);
      await api.syncTwitterFeed();
      await fetchData();
    } catch (err) {
      console.error('Failed to sync Twitter stream', err);
      setError('Twitter stream sync failed. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-sovereign-cream bg-command-950 text-slate-800 flex flex-col font-sans transition-colors duration-200">
      {/* Top Operations Navbar */}
      <Navbar
        summary={summary}
        onRefresh={fetchData}
        loading={loading}
        authorityUser={authorityUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAlertModal={() => setActiveTab('alerts')}
        onSyncLive={handleSyncLiveWeather}
        onSyncTwitter={handleSyncTwitter}
      />

      {/* Main Command Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
        >
          <span className="text-lg">☰</span>
        </button>

        {/* Left Control Sidebar */}
        <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex`}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingCount={summary?.pending_review || 0}
            openGrievances={summary?.open_grievances || 0}
            authorityUser={authorityUser}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        </div>

        {/* Dynamic Center Stage */}
        <main className="flex-1 p-5 overflow-y-auto max-h-[calc(100vh-65px)]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <span className="text-red-600 font-bold">⚠ CONNECTION ERROR:</span>
              <span>{error}</span>
              <button onClick={fetchData} className="ml-auto text-red-600 hover:text-red-900 font-bold underline">Retry</button>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Top KPI Cards */}
              <MetricCards summary={summary} />

              {/* National Map & Priority Operational Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-8">
                  <NationalMap
                    events={events}
                    h3Clusters={h3Clusters}
                    onSelectEvent={(id) => setSelectedEventId(id)}
                  />
                </div>
                <div className="lg:col-span-4">
                  <PriorityQueue
                    events={events}
                    onSelectEvent={(id) => setSelectedEventId(id)}
                    onSwitchTab={(tab) => setActiveTab(tab)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <CyclonePredictor />
          )}

          {activeTab === 'events' && (
            <EventTable
              events={events}
              onSelectEvent={(id) => setSelectedEventId(id)}
              onFilterChange={() => {}}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsHub />}

          {activeTab === 'review' && (
            <OperatorDesk onEventUpdated={fetchData} />
          )}

          {activeTab === 'submit' && (
            <CitizenReportPWA onReportSubmitted={fetchData} />
          )}

          {activeTab === 'grievance' && (
            <GrievancePortal
              preselectedEventId={grievanceEventId}
              onGrievanceSubmitted={fetchData}
            />
          )}

          {activeTab === 'alerts' && (
            <CapBroadcast events={events} onAlertDispatched={fetchData} />
          )}

          {activeTab === 'system' && (
            <SystemStatus summary={summary} />
          )}
        </main>
      </div>

      {/* Deep Inspection & Evidence Modal */}
      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
          onOpenGrievance={handleOpenGrievance}
        />
      )}

      {/* Official Authority Sign-In Modal */}
      <AuthorityLoginModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
