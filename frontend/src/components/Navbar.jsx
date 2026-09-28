import React from 'react';
import { ShieldAlert, Activity, Radio, RefreshCw, Satellite, BellRing, Zap, Lock, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({
  summary,
  onRefresh,
  loading,
  authorityUser,
  onOpenAuthModal,
  onLogout,
  onOpenAlertModal,
  onSyncLive,
  onSyncTwitter
}) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand & Mission Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold">
          <Satellite className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-extrabold">Government of India · IMD</span>
          </div>
          <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            National Weather Big Data Analytics Platform
          </h1>
        </div>
      </div>

      {/* Real-time System Telemetry Indicators & Authority Access */}
      <div className="flex items-center gap-2.5">
        {/* Stream Health Indicators */}
        <div className="hidden xl:flex items-center gap-3.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500 font-medium">Stream:</span>
            <span className="text-emerald-700 font-mono font-bold">5/5 Multi-Source</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-300"></div>
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-teal-600 animate-spin" />
            <span className="text-slate-500 font-medium">Ingested:</span>
            <span className="text-slate-900 font-mono font-bold">{summary?.total_events || '53'} Active</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-300"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Accuracy:</span>
            <span className="text-emerald-700 font-bold font-mono">{summary?.detection_accuracy_pct || '98.1'}% Verified</span>
          </div>
        </div>

        {/* Sync Multi-Source Live Telemetry Button */}
        <button
          onClick={onSyncLive}
          disabled={loading}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
          title="Fetch real-time meteorological sensor data across 38+ Indian stations (Doppler, INSAT, AWS)"
        >
          <Zap className={`w-3.5 h-3.5 text-amber-200 ${loading ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">Sync Live Feed</span>
        </button>

        {/* Twitter / X Ingestion Sync Button */}
        <button
          onClick={onSyncTwitter}
          disabled={loading}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-xs"
          title="Ingest real-time Twitter/X posts tagged with #IMD, #WeatherUpdate"
        >
          <span className="font-bold text-sm leading-none">𝕏</span>
          <span className="hidden sm:inline">Sync #IMD Tweets</span>
        </button>

        {/* 1-Click CAP Emergency Broadcast Trigger - Authorities Only */}
        {authorityUser && (
          <button
            onClick={onOpenAlertModal}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs uppercase px-3 py-2 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <BellRing className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">CAP Alert</span>
          </button>
        )}

        {/* Authority Access Section */}
        {authorityUser ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 pl-3 pr-1.5 py-1 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <div className="text-left hidden lg:block">
                <span className="block text-[10px] font-extrabold text-emerald-800 font-mono leading-none">OFFICIAL AUTHORITY</span>
                <span className="block text-[10px] text-slate-700 font-medium leading-none mt-0.5">{authorityUser.name || 'IMD Officer'}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              title="Sign Out of Authority Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95"
            title="Restricted Sign-In for IMD Officers & Disaster Authorities"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Authority Sign In</span>
          </button>
        )}

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-xs disabled:opacity-50"
          title="Refresh All Stream Telemetry"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>
    </header>
  );
}
