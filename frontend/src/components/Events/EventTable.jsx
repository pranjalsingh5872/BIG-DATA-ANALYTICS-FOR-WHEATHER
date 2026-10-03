import React, { useState } from 'react';
import { Search, Filter, FileDown, Eye, ShieldAlert, Sparkles, MapPin, Calendar, RotateCcw, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { formatIST } from '../../utils/time';
import { useLanguage } from '../../context/LanguageContext';
import { DEFAULT_MULTI_HAZARDS } from '../../utils/hazardData';
import DisasterReportModal from '../Forecast/DisasterReportModal';

export default function EventTable({ events, onSelectEvent, onFilterChange }) {
  const { lang, tr, t, translateCategory, translateSeverity, translateStatus, translateSource, translateCity, translateState, translateReportTitle, translateReportDescription } = useLanguage();
  const [disasterModalOpen, setDisasterModalOpen] = useState(false);
  const [activeDisasterHazard, setActiveDisasterHazard] = useState(DEFAULT_MULTI_HAZARDS[0]);
  const [filters, setFilters] = useState({
    date: '',
    category: 'All',
    severity: 'All',
    state: 'All',
    verification_status: 'All',
    source: 'All',
    search: ''
  });

  const categories = ['All', 'Rainfall', 'Flooding', 'Thunderstorm', 'Heatwave', 'Fog', 'Dust Storm', 'Strong Winds', 'Cyclone', 'Other'];
  const severities = ['All', 'Critical', 'High', 'Moderate', 'Low'];
  const statuses = ['All', 'VERIFIED', 'PENDING_REVIEW', 'REJECTED', 'QUARANTINED'];
  const sources = [
    'All',
    'IMD Doppler Radar',
    'INSAT-3DR Satellite',
    'Open-Meteo AWS',
    'Twitter / X Stream',
    'Citizen PWA Reports'
  ];

  const uniqueStates = ['All', ...Array.from(new Set(events?.map(e => e.state).filter(Boolean))).sort()];

  const handleFilterChange = (key, val) => {
    const updated = { ...filters, [key]: val };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleResetFilters = () => {
    const reset = {
      date: '',
      category: 'All',
      severity: 'All',
      state: 'All',
      verification_status: 'All',
      source: 'All',
      search: ''
    };
    setFilters(reset);
    if (onFilterChange) onFilterChange(reset);
  };

  // Filter local events with complete 6-dimensional operational criteria
  const filteredEvents = events?.filter((ev) => {
    if (filters.date && !ev.observed_at?.startsWith(filters.date)) return false;
    if (filters.category !== 'All' && ev.category !== filters.category) return false;
    if (filters.severity !== 'All' && ev.severity !== filters.severity) return false;
    if (filters.state !== 'All' && ev.state !== filters.state) return false;
    if (filters.verification_status !== 'All' && ev.verification_status !== filters.verification_status) return false;
    if (filters.source !== 'All' && ev.source !== filters.source) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match = ev.title?.toLowerCase().includes(q) ||
                    ev.description?.toLowerCase().includes(q) ||
                    ev.city?.toLowerCase().includes(q) ||
                    ev.state?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }) || [];

  return (
    <div className="space-y-4">
      {/* Active National Disaster Briefing Banner (Visible from Weather Events Registry) */}
      <div className="bg-[#fcfaf5] border border-[#ded3bf] rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                {tr('Active Crisis Surveillance', 'सक्रिय राष्ट्रीय आपदा निगरानी')}
              </span>
              <h4 className="text-xs sm:text-sm font-black text-stone-900">
                {lang === 'hi' ? 'वायनाड मेप्पाडी भूस्खलन एवं मलबा प्रवाह' : 'Wayanad Meppadi Debris Flow & Landslide'}
              </h4>
              <span className="text-[10px] font-mono font-bold text-red-700 bg-white px-2 py-0.5 rounded border border-stone-300">
                MHSI 78.6 / 100
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5">
              {lang === 'hi'
                ? 'लगातार 312 मिमी मूसलाधार मानसूनी वर्षा से 91.4% पोर-वाटर संतृप्ति। आधिकारिक स्थिति रिपोर्ट देखने हेतु क्लिक करें।'
                : 'Intense antecedent deluge (312 mm) with 91.4% pore pressure saturation across Western Ghats ridge. Click to inspect full report.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveDisasterHazard(DEFAULT_MULTI_HAZARDS[0]);
            setDisasterModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-sm transition-all macos-tap cursor-pointer ml-auto"
          title={tr('Read Disaster Situation Report', 'आपदा स्थिति रिपोर्ट पढ़ें')}
        >
          <FileText className="w-3.5 h-3.5 text-white" />
          <span>{tr('Read Disaster Report', 'आपदा स्थिति रिपोर्ट पढ़ें')}</span>
        </button>
      </div>

      <DisasterReportModal
        isOpen={disasterModalOpen}
        onClose={() => setDisasterModalOpen(false)}
        activeHazard={activeDisasterHazard}
      />

      {/* 7-Parameter Filter Toolbar */}
      <div className="bg-command-card border border-command-border rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('filterDesk')}
            </h3>
            {(filters.date || filters.category !== 'All' || filters.severity !== 'All' || filters.state !== 'All' || filters.verification_status !== 'All' || filters.source !== 'All' || filters.search) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 transition-colors ml-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{tr('Reset Filters', 'फ़िल्टर हटाएं')}</span>
              </button>
            )}
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {tr('Showing', 'प्रदर्शित')} <b className="text-blue-700">{filteredEvents.length}</b> {tr('of', 'कुल')} {events?.length || 0} {tr('events', 'घटनाएं')}
          </span>
        </div>

        {/* Filter Selectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Date-wise filtering */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-600" />
              <span>{tr('Date-wise Filter', 'तारीख फ़िल्टर')}</span>
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            />
          </div>

          {/* 2. Event-wise filtering (Category) */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{tr('Event-wise Filter', 'घटना प्रकार')}</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            >
              {categories.map((c) => <option key={c} value={c}>{c === 'All' ? tr('All Events', 'सभी घटनाएं') : translateCategory(c)}</option>)}
            </select>
          </div>

          {/* 3. Location-wise filtering (State / Region) */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>{tr('Location / State', 'स्थान / राज्य')}</span>
            </label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            >
              <option value="All">{tr('All Locations', 'सभी राज्य / स्थान')}</option>
              {uniqueStates.filter(s => s !== 'All').map((st) => <option key={st} value={st}>{translateState(st)}</option>)}
            </select>
          </div>

          {/* 4. Verification Status Tracking */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-blue-600" />
              <span>{tr('Verification Status', 'सत्यापन स्थिति')}</span>
            </label>
            <select
              value={filters.verification_status}
              onChange={(e) => handleFilterChange('verification_status', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            >
              {statuses.map((st) => <option key={st} value={st}>{st === 'All' ? tr('All Statuses', 'सभी स्थितियां') : translateStatus(st)}</option>)}
            </select>
          </div>

          {/* 5. Severity */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{tr('Severity', 'गंभीरता')}</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            >
              {severities.map((s) => <option key={s} value={s}>{s === 'All' ? tr('All Severities', 'सभी गंभीरता') : translateSeverity(s)}</option>)}
            </select>
          </div>

          {/* 6. Keyword / City Search */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{tr('Search Keywords / City', 'खोज कीवर्ड / शहर')}</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Active Filter Chips Bar */}
        {(filters.date || filters.category !== 'All' || filters.severity !== 'All' || filters.state !== 'All' || filters.verification_status !== 'All' || filters.source !== 'All' || filters.search) && (
          <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-slate-500 mr-1">{tr('Active Filters:', 'सक्रिय फ़िल्टर:')}</span>
            {filters.date && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-medium border border-blue-200 shadow-2xs">
                <span>📅 {filters.date}</span>
                <button onClick={() => handleFilterChange('date', '')} className="hover:text-blue-950 font-bold ml-0.5 cursor-pointer">✕</button>
              </span>
            )}
            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-medium border border-indigo-200 shadow-2xs">
                <span>⚡ {translateCategory(filters.category)}</span>
                <button onClick={() => handleFilterChange('category', 'All')} className="hover:text-indigo-950 font-bold ml-0.5 cursor-pointer">✕</button>
              </span>
            )}
            {filters.state !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-medium border border-emerald-200 shadow-2xs">
                <span>📍 {translateState(filters.state)}</span>
                <button onClick={() => handleFilterChange('state', 'All')} className="hover:text-emerald-950 font-bold ml-0.5 cursor-pointer">✕</button>
              </span>
            )}
            {filters.verification_status !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-medium border border-amber-200 shadow-2xs">
                <span>🛡️ {translateStatus(filters.verification_status)}</span>
                <button onClick={() => handleFilterChange('verification_status', 'All')} className="hover:text-amber-950 font-bold ml-0.5 cursor-pointer">✕</button>
              </span>
            )}
            {filters.severity !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-medium border border-red-200 shadow-2xs">
                <span>⚠️ {translateSeverity(filters.severity)}</span>
                <button onClick={() => handleFilterChange('severity', 'All')} className="hover:text-red-950 font-bold ml-0.5 cursor-pointer">✕</button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-300 shadow-2xs">
                <span>🔍 "{filters.search}"</span>
                <button onClick={() => handleFilterChange('search', '')} className="hover:text-slate-950 font-bold ml-0.5 cursor-pointer">✕</button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline ml-2 cursor-pointer"
            >
              {tr('Clear All', 'सभी हटाएं')}
            </button>
          </div>
        )}
      </div>

      {/* Events Registry Table with Smooth Vertical Scroll */}
      <div className="bg-command-card border border-command-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-270px)] min-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-wider sticky top-0 z-10 shadow-xs">
              <tr>
                <th className="px-4 py-3">{t('eventTitleCol')}</th>
                <th className="px-4 py-3">{t('typeSeverityCol')}</th>
                <th className="px-4 py-3">{t('locationH3Col')}</th>
                <th className="px-4 py-3">{t('sourceCol')}</th>
                <th className="px-4 py-3 text-center">{t('trustCol')}</th>
                <th className="px-4 py-3 text-center">{t('statusCol')}</th>
                <th className="px-4 py-3 text-right">{t('actionsCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    {t('noEventsFound')}
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr 
                    key={ev.id} 
                    onClick={() => onSelectEvent(ev.id)}
                    className="hover:bg-blue-50/60 transition-all duration-150 cursor-pointer group"
                  >
                    {/* Event Title */}
                    <td className="px-4 py-3 max-w-sm">
                      <div className="font-bold text-slate-900 mb-0.5 line-clamp-1 group-hover:text-blue-700 transition-colors">{translateReportTitle(ev.title)}</div>
                      <div className="text-[11px] text-slate-600 line-clamp-1">{translateReportDescription(ev.description)}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {tr('Observed:', 'अवलोकन समय:')} {formatIST(ev.observed_at)}
                      </div>
                    </td>

                    {/* Category & Severity */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-blue-700">{translateCategory(ev.category)}</div>
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        ev.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                        ev.severity === 'High' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        ev.severity === 'Moderate' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {translateSeverity(ev.severity)}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{translateCity(ev.city)}, {translateState(ev.state)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        H3: <code className="text-blue-600">{ev.h3_index.slice(0, 8)}...</code>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{translateSource(ev.source)}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {ev.source_author || tr('Direct Feed', 'प्रत्यक्ष सेंसर फ़ीड')}
                      </div>
                    </td>

                    {/* TrustScore */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center justify-center font-mono font-black text-sm px-2 py-1 rounded bg-slate-50 border border-slate-200">
                        <span className={
                          ev.trust_score >= 75 ? 'text-emerald-700' :
                          ev.trust_score >= 40 ? 'text-amber-700' : 'text-red-700'
                        }>
                          {ev.trust_score}%
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ev.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        ev.verification_status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' :
                        ev.verification_status === 'QUARANTINED' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {translateStatus(ev.verification_status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(ev.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200/90 shadow-2xs transition-all macos-tap hover:scale-105 active:scale-95 cursor-pointer text-[11px]"
                        title={tr("Inspect AI Evidence & Audit Ledger", "AI साक्ष्य एवं ऑडिट लेज़र देखें")}
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>{tr("Inspect", "अन्वेषण")}</span>
                      </button>
                      <a
                        href={api.getPdfDownloadUrl(ev.id)}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-all macos-tap hover:scale-105 active:scale-95 cursor-pointer"
                        title={tr("Download Official Incident Brief PDF", "आधिकारिक घटना सारांश PDF डाउनलोड करें")}
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
