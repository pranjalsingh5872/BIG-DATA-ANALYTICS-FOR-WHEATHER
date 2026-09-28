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

  // Authority State (Role-based access for IMD / Disaster Authorities)
  const [authorityUser, setAuthorityUser] = useState(() => {
    try {
      const saved = localStorage.getItem('imd_authority_officer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLoginSuccess = (officer) => {
    setAuthorityUser(officer);
    try {
      localStorage.setItem('imd_authority_officer', JSON.stringify(officer));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setAuthorityUser(null);
    try {
      localStorage.removeItem('imd_authority_officer');
    } catch (e) {
      console.error(e);
    }
    if (['system', 'review', 'alerts'].includes(activeTab)) {
      setActiveTab('overview');
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
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
            authorityUser ? (
              <OperatorDesk onEventUpdated={fetchData} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm my-12">
                <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Restricted Authority Area · Operator Review Desk</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Meteorological incident triage, report verification, and operational queue curation are strictly restricted to verified disaster authorities and IMD duty officers to prevent unauthorized status changes.
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Sign In with Official Officer Credentials
                </button>
              </div>
            )
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
            authorityUser ? (
              <CapBroadcast events={events} onAlertDispatched={fetchData} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm my-12">
                <div className="w-14 h-14 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-red-700 mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Restricted Authority Area · CAP Alert Dispatch</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Broadcasting Common Alerting Protocol (CAP v1.2) emergency warnings to public sirens, cell broadcasts, and NDMA feeds requires verified authority credentials.
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Sign In with Official Officer Credentials
                </button>
              </div>
            )
          )}

          {activeTab === 'system' && (
            authorityUser ? (
              <SystemStatus summary={summary} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm my-12">
                <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Restricted Authority Area</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    System runtime engine, telemetry microservices, and big data pipeline nodes are restricted to verified disaster authorities and IMD command officers.
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Sign In with Official Officer Credentials
                </button>
              </div>
            )
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
