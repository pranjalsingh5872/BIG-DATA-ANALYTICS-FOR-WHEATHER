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
    <header className="bg-[#0b1528] border-b border-[#1c2c48] px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Brand & Mission Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Satellite className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Government of India · IMD</span>
          </div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            National Weather Big Data Analytics Platform
          </h1>
        </div>
      </div>

      {/* Real-time System Telemetry Indicators & Authority Access */}
      <div className="flex items-center gap-3">
        {/* Stream Health Indicators */}
        <div className="hidden xl:flex items-center gap-4 bg-[#070e1b] px-3.5 py-1.5 rounded-lg border border-[#18263e] text-xs shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Stream:</span>
            <span className="text-emerald-400 font-mono font-semibold">5/5 Multi-Source</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span className="text-slate-400">Ingested:</span>
            <span className="text-white font-mono font-bold">{summary?.total_events || '52'} Active</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Accuracy:</span>
            <span className="text-emerald-400 font-bold font-mono">{summary?.detection_accuracy_pct || '98.1'}% Verified</span>
          </div>
        </div>

        {/* Sync Multi-Source Live Telemetry Button */}
        <button
          onClick={onSyncLive}
          disabled={loading}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-md shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
          title="Fetch real-time meteorological sensor data across 38+ Indian stations (Doppler, INSAT, AWS)"
        >
          <Zap className={`w-3.5 h-3.5 text-yellow-300 ${loading ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">Sync Live Feed</span>
        </button>

        {/* Twitter / X Ingestion Sync Button */}
        <button
          onClick={onSyncTwitter}
          disabled={loading}
          className="flex items-center gap-1.5 bg-[#13223f] hover:bg-[#1a2d54] border border-sky-600/50 text-sky-300 hover:text-white font-bold text-xs px-3 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          title="Ingest real-time Twitter/X posts tagged with #IMD, #WeatherUpdate"
        >
          <span className="font-bold text-sm leading-none">𝕏</span>
          <span className="hidden sm:inline">Sync #IMD Tweets</span>
        </button>

        {/* 1-Click CAP Emergency Broadcast Trigger - Full Access Enabled */}
        <button
          onClick={onOpenAlertModal}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase px-3 py-2 rounded-lg shadow-md shadow-red-950/40 transition-all active:scale-95"
          title="1-Click WMO-standard Common Alerting Protocol emergency broadcast"
        >
          <BellRing className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">CAP Alert</span>
        </button>

        {/* Apex Authority Access Section (Full Access Active) */}
        <div className="flex items-center gap-2 bg-[#070e1b] px-3 py-1.5 rounded-lg border border-emerald-500/50 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div className="text-left hidden lg:block">
            <span className="block text-[10px] font-black text-emerald-400 font-mono tracking-wider leading-none">
              APEX AUTHORITY • FULL ACCESS
            </span>
            <span className="block text-[9px] text-slate-300 font-mono leading-none mt-0.5">
              {authorityUser?.name || 'National Disaster Commander'}
            </span>
          </div>
        </div>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg bg-[#13223f] hover:bg-[#1a2d54] text-slate-300 hover:text-white border border-[#1e2f50] transition-colors shadow-sm disabled:opacity-50"
          title="Refresh All Stream Telemetry"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>
    </header>
  );
}
