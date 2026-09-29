import React, { useState } from 'react';
import { Search, Filter, FileDown, Eye, ShieldAlert, Sparkles, MapPin, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { formatIST } from '../../utils/time';
import { useLanguage } from '../../context/LanguageContext';

export default function EventTable({ events, onSelectEvent, onFilterChange }) {
  const { lang, tr, t, translateCategory, translateSeverity, translateStatus, translateSource, translateCity, translateState, translateReportTitle, translateReportDescription } = useLanguage();
  const [filters, setFilters] = useState({
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

  const handleFilterChange = (key, val) => {
    const updated = { ...filters, [key]: val };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  // Filter local events
  const filteredEvents = events?.filter((ev) => {
    if (filters.category !== 'All' && ev.category !== filters.category) return false;
    if (filters.severity !== 'All' && ev.severity !== filters.severity) return false;
    if (filters.verification_status !== 'All' && ev.verification_status !== filters.verification_status) return false;
    if (filters.source !== 'All' && ev.source !== filters.source) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match = ev.title.toLowerCase().includes(q) ||
                    ev.description.toLowerCase().includes(q) ||
                    ev.city.toLowerCase().includes(q) ||
                    ev.state.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }) || [];

  return (
    <div className="space-y-4">
      {/* 7-Parameter Filter Toolbar */}
      <div className="bg-command-card border border-command-border rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('filterDesk')}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {tr('Showing', 'प्रदर्शित')} <b className="text-blue-700">{filteredEvents.length}</b> {tr('of', 'कुल')} {events?.length || 0} {tr('events', 'घटनाएं')}
          </span>
        </div>

        {/* Filter Selectors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Category */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{tr('Event Type', 'घटना प्रकार')}</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            >
              {categories.map((c) => <option key={c} value={c}>{c === 'All' ? tr('All', 'सभी') : translateCategory(c)}</option>)}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{tr('Severity', 'गंभीरता')}</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            >
              {severities.map((s) => <option key={s} value={s}>{s === 'All' ? tr('All', 'सभी') : translateSeverity(s)}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{tr('Verification Status', 'सत्यापन स्थिति')}</label>
            <select
              value={filters.verification_status}
              onChange={(e) => handleFilterChange('verification_status', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            >
              {statuses.map((st) => <option key={st} value={st}>{st === 'All' ? tr('All', 'सभी') : translateStatus(st)}</option>)}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{tr('Data Source', 'आगमन स्रोत')}</label>
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            >
              {sources.map((src) => <option key={src} value={src}>{src === 'All' ? tr('All', 'सभी') : translateSource(src)}</option>)}
            </select>
          </div>

          {/* Keyword Search */}
          <div className="col-span-2">
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
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Event Title */}
                    <td className="px-4 py-3 max-w-sm">
                      <div className="font-bold text-slate-900 mb-0.5 line-clamp-1">{translateReportTitle(ev.title)}</div>
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
                        onClick={() => onSelectEvent(ev.id)}
                        className="p-1.5 rounded bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 shadow-sm transition-colors"
                        title={tr("Inspect AI Evidence & Audit Ledger", "AI साक्ष्य एवं ऑडिट लेज़र देखें")}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={api.getPdfDownloadUrl(ev.id)}
                        download
                        className="inline-block p-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors"
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
