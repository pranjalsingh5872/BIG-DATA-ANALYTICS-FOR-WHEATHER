import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, Satellite, BellRing, Lock, LogOut, ShieldCheck, Globe, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatISTTimeOnly } from '../utils/time';

export default function Navbar({
  summary,
  onRefresh,
  loading,
  authorityUser,
  onOpenAuthModal,
  onLogout,
  onOpenAlertModal
}) {
  const { lang, setLang, toggleLang, t, tr } = useLanguage();
  const [istTime, setIstTime] = useState(() => formatISTTimeOnly(new Date()));

  // Live ticking IST Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setIstTime(formatISTTimeOnly(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs w-full">
      {/* Brand & Mission Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold shrink-0">
          <Satellite className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            WEATHERNEXUS
          </h1>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block -mt-0.5">
            {t('brandSub')}
          </p>
        </div>
      </div>

      {/* Real-time System Telemetry Indicators, IST Clock, Language Switch & Authority Access */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live IST Clock & Ingestion Telemetry Capsule */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-slate-800 font-bold" title="Indian Standard Time (IST)">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{istTime}</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-1.5" title="Live Big Data Ingestion Throughput">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600 font-medium">{tr('Stream:', 'स्ट्रीम:')}</span>
            <span className="text-emerald-700 font-mono font-bold">{summary?.ingestion_rate_recs_sec || '34.6'} rec/s</span>
            <span className="text-slate-400 font-mono text-[10px]">· 28ms</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span className="text-slate-600 font-medium">{t('activeEvents')}:</span>
            <span className="text-slate-900 font-mono font-bold">{summary?.total_events || '53'}</span>
          </div>
        </div>

        {/* Global Hindi / English Explicit Segmented Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-300 text-xs font-bold shadow-xs">
          <button
            onClick={() => {
              setLang('en');
              localStorage.setItem('weathernexus_lang', 'en');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all macos-tap cursor-pointer ${
              lang === 'en'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => {
              setLang('hi');
              localStorage.setItem('weathernexus_lang', 'hi');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 macos-tap cursor-pointer ${
              lang === 'hi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="हिन्दी में बदलें"
          >
            <span>हिन्दी</span>
          </button>
        </div>

        {/* 1-Click CAP Emergency Broadcast Trigger - Authorities Only */}
        {authorityUser && (
          <button
            onClick={onOpenAlertModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
            title="Dispatch Public Common Alerting Protocol (CAP) Warning"
          >
            <BellRing className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">CAP Alert</span>
          </button>
        )}

        {/* Authority Access Section */}
        {authorityUser ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 pl-3 pr-1.5 py-1 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <div className="text-left hidden lg:block">
                <span className="block text-[10px] font-extrabold text-emerald-800 font-mono leading-none">{t('officialAuthority')}</span>
                <span className="block text-[10px] text-slate-700 font-medium leading-none mt-0.5">{authorityUser.name || 'Disaster Officer'}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              title={t('signOut')}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs macos-tap cursor-pointer"
            title="Restricted Sign-In for Command & Disaster Authorities"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">{t('authoritySignIn')}</span>
            <span className="sm:hidden">Sign In</span>
          </button>
        )}

        {/* Manual Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all shadow-xs disabled:opacity-50 macos-tap cursor-pointer"
          title="Refresh All Stream Telemetry"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>
    </header>
  );
}
