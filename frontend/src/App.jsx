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
import { Lock, ArrowRight } from 'lucide-react';
import { api } from './services/api';
import { useLanguage } from './context/LanguageContext';
import { getTopHazard } from './utils/hazardData';

export default function App() {
  const { lang, tr, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const topHazard = getTopHazard();
  const [h3Clusters, setH3Clusters] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [grievanceEventId, setGrievanceEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authority State (Role-based access for IMD / Disaster Authorities - starts logged out)
  const [authorityUser, setAuthorityUser] = useState(null);
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

  const fetchData = async (syncLive = false) => {
    try {
      setLoading(true);
      setError(null);
      if (syncLive) {
        await api.syncLiveTelemetry(true).catch(() => null);
      }
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
    // Clear any previous cached authority session on site load
    try {
      localStorage.removeItem('imd_authority_officer');
    } catch {}

    fetchData(true);
    // Auto-refresh telemetry every 5 minutes in background
    const interval = setInterval(() => fetchData(true), 5 * 60 * 1000);
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
        onRefresh={() => fetchData(true)}
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

        {/* Dynamic Center Stage - Full Screen Command Deck */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto max-h-[calc(100vh-62px)] w-full">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <span className="text-red-600 font-bold">⚠ CONNECTION ERROR:</span>
              <span>{error}</span>
              <button onClick={() => fetchData(true)} className="ml-auto text-red-600 hover:text-red-900 font-bold underline">Retry</button>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* National Multi-Hazard Highest MHSI Threat Status Banner */}
              {topHazard && topHazard.mhsi_score >= 65 ? (
                <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-3.5 px-4 shadow-sm flex items-center justify-between flex-wrap gap-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
                      🚨
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <span>{tr('ACTIVE CRITICAL THREAT DETECTED:', 'सक्रिय गंभीर आपदा संकेत:')} {topHazard.name}</span>
                        <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded font-mono font-bold">
                          MHSI {topHazard.mhsi_score} / 100 · {topHazard.primary_metric}
                        </span>
                      </div>
                      <div className="text-[11px] text-red-100 mt-0.5">
                        {topHazard.description}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('forecast')}
                    className="bg-white hover:bg-red-50 text-red-700 font-bold text-xs px-4 py-2 rounded-full shadow-xs transition-all active:scale-95 ml-auto flex items-center shrink-0"
                  >
                    {tr('Inspect Active Disaster Trajectory →', 'सक्रिय आपदा प्रक्षेपवक्र देखें →')}
                  </button>
                </div>
              ) : topHazard && topHazard.mhsi_score >= 40 ? (
                <div
                  style={{ backgroundColor: '#c2410c' }}
                  className="bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-2xl p-3.5 px-4 shadow-sm flex items-center justify-between flex-wrap gap-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
                      ⚠️
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 text-white">
                        <span>{tr('MONITORED ADVISORY:', 'निगरानी परामर्श:')} {topHazard.name}</span>
                        <span className="bg-white/25 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                          MHSI {topHazard.mhsi_score} / 100
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-100 mt-0.5">
                        {topHazard.description}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('forecast')}
                    className="bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 ml-auto"
                  >
                    {tr('Inspect Threat', 'खतरे की जांच करें')}
                  </button>
                </div>
              ) : (
                <div
                  style={{ backgroundColor: '#059669' }}
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-3.5 px-4 shadow-sm flex items-center justify-between flex-wrap gap-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
                      🍃
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 text-white">
                        <span>{tr('NATIONAL SYNOPTIC SURVEILLANCE: ROUTINE NORMAL CONDITIONS', 'राष्ट्रीय मौसमी निगरानी: सामान्य स्थितियां')}</span>
                        <span className="bg-white/25 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                          MHSI &lt; 20 · {tr('Zero Active Emergencies', 'शून्य सक्रिय आपात स्थिति')}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-100 mt-0.5">
                        {tr('All multi-hazard vectors across India below trigger thresholds (MHSI < 20). Negligible threats automatically de-listed.', 'भारत भर में सभी आपदाएं नियंत्रण सीमा से नीचे हैं (MHSI < 20)। नगण्य खतरे स्वतः डी-लिस्ट किए गए हैं।')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('forecast')}
                    className="bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 ml-auto"
                  >
                    {tr('Open Hazard Center', 'आपदा केंद्र खोलें')}
                  </button>
                </div>
              )}

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
                  <h3 className="text-base font-black text-slate-900">{t('restrictedAreaTitle')}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {t('restrictedAreaDesc')}
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {tr('Sign In with Official Officer Credentials', 'अधिकृत अधिकारी क्रेडेंशियल से लॉगिन करें')}
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
                  <h3 className="text-base font-black text-slate-900">{tr('Restricted Authority Area · CAP Alert Dispatch', 'प्रतिबंधित प्राधिकरण क्षेत्र · आपातकालीन चेतावनी (CAP)')}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {tr('Broadcasting Common Alerting Protocol (CAP v1.2) emergency warnings to public sirens, cell broadcasts, and NDMA feeds requires verified authority credentials.', 'सार्वजनिक सायरन, सेल ब्रॉडकास्ट एवं एनडीएमए फीड पर आपातकालीन चेतावनी जारी करने हेतु अधिकृत पहचान आवश्यक है।')}
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {tr('Sign In with Official Officer Credentials', 'अधिकृत अधिकारी क्रेडेंशियल से लॉगिन करें')}
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
                  <h3 className="text-base font-black text-slate-900">{tr('Restricted Authority Area · Node Health', 'प्रतिबंधित प्राधिकरण क्षेत्र · नोड स्वास्थ्य')}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {tr('System runtime engine, telemetry microservices, and big data pipeline nodes are restricted to verified disaster authorities and IMD command officers.', 'सिस्टम रनटाइम इंजन, टेलीमेट्री माइक्रोसर्विसेज एवं बिग डेटा नोड्स केवल अधिकृत आपदा प्रबंधन एवं आईएमडी कमान अधिकारियों के लिए सीमित हैं।')}
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {tr('Sign In with Official Officer Credentials', 'अधिकृत अधिकारी क्रेडेंशियल से लॉगिन करें')}
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
          initialEvent={events.find((e) => e.id === selectedEventId)}
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
