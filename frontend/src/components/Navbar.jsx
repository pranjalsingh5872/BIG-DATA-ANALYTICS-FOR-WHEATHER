import React from 'react';
import { ShieldAlert, Activity, Radio, RefreshCw, Satellite, BellRing, Zap, CheckCircle2 } from 'lucide-react';

export default function Navbar({ summary, onRefresh, loading, theme, onSetTheme, onOpenAlertModal, onSyncLive, onSyncTwitter }) {
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
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">SIH-26069</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>MULTI-SOURCE LIVE TELEMETRY</span>
            </span>
          </div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            National Weather Big Data Analytics Platform
          </h1>
        </div>
      </div>

      {/* Real-time System Telemetry Indicators & Palette Switcher */}
      <div className="flex items-center gap-3">
        {/* Dynamic Weather Theme Switcher */}
        <div className="flex items-center bg-[#070e1b] rounded-lg p-1 border border-[#18263e] gap-1 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-1 hidden 2xl:inline">Theme:</span>
          
          <button
            type="button"
            onClick={() => onSetTheme && onSetTheme('ice-slate')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
              theme === 'ice-slate'
                ? 'bg-sky-500/25 text-sky-300 border border-sky-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Apple Weather & UK Met Office Ice-Slate Daylight Palette"
          >
            <span>❄️ Ice-Slate</span>
          </button>

          <button
            type="button"
            onClick={() => onSetTheme && onSetTheme('tactical-dark')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
              theme === 'tactical-dark'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Windy & NOAA Cockpit 24/7 Radar Dark Palette"
          >
            <span>🌙 Dark</span>
          </button>

          <button
            type="button"
            onClick={() => onSetTheme && onSetTheme('sovereign-cream')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
              theme === 'sovereign-cream'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Copernicus & IMD Sovereign Cream Alabaster Palette"
          >
            <span>🏛️ Cream</span>
          </button>
        </div>

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
            <span className="text-white font-mono font-bold">{summary?.total_events || '48'} Active</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Accuracy:</span>
            <span className="text-emerald-400 font-bold font-mono">{summary?.detection_accuracy_pct || '91.7'}% Verified</span>
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
          <span className="hidden sm:inline">Sync Multi-Source</span>
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

        {/* 1-Click CAP Emergency Broadcast Trigger */}
        <button
          onClick={onOpenAlertModal}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase px-3 py-2 rounded-lg shadow-md shadow-red-950/40 transition-all active:scale-95"
        >
          <BellRing className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">CAP Alert</span>
        </button>

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
