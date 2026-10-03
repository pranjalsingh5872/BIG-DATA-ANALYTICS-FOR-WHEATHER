import React, { useState, useEffect } from 'react';
import {
  X,
  Mountain,
  Flame,
  Waves,
  Wind,
  MapPin,
  Clock,
  AlertTriangle,
  History,
  Activity,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { DEFAULT_MULTI_HAZARDS } from '../../utils/hazardData';

export default function DisasterReportModal({ isOpen, onClose, activeHazard }) {
  const { lang, toggleLang, tr } = useLanguage();
  const [reportLang, setReportLang] = useState(lang || 'en');

  useEffect(() => {
    setReportLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const targetId = activeHazard?.id || 'landslide';
  const defaultData = DEFAULT_MULTI_HAZARDS.find(d => d.id === targetId) || DEFAULT_MULTI_HAZARDS[0];
  const reportHazard = {
    ...defaultData,
    ...(activeHazard || {}),
    plain_report: {
      ...(defaultData.plain_report || {}),
      ...(activeHazard?.plain_report || {})
    },
    hotspots: activeHazard?.hotspots?.length > 0 ? activeHazard.hotspots : defaultData.hotspots
  };
  const pr = reportHazard.plain_report || defaultData.plain_report || {};
  const isHi = (reportLang || lang) === 'hi';

  const getHazardDisplayName = (h) => {
    if (!h) return '';
    if (h.id === 'cyclone') return isHi ? "प्रणाली 'अर्नब' (शांत / कम खतरा - सामान्य स्थिति)" : "System 'ARNAB' (Dissipated / Low Threat - All Clear)";
    if (h.id === 'landslide') return isHi ? 'वायनाड मेप्पाडी भूस्खलन एवं मलबा प्रवाह' : 'Wayanad Meppadi Debris Flow & Landslide';
    if (h.id === 'volcano') return isHi ? 'बैरन द्वीप ज्वालामुखी सक्रिय थर्मल विस्फोट' : 'Barren Island Volcano Active Thermal Eruption';
    if (h.id === 'flood') return isHi ? 'असम ब्रह्मपुत्र नदी घाटी जल विज्ञान निगरानी' : 'Assam Brahmaputra River Basin Monitored Hydrology';
    return isHi ? (h.name_hi || h.name) : h.name;
  };

  const getHazardRegionName = (h) => {
    if (!h) return '';
    if (h.id === 'cyclone') return isHi ? 'मध्य बंगाल की खाड़ी (खुला समुद्री क्षेत्र)' : 'Central Bay of Bengal (Open Maritime Sea)';
    if (h.id === 'landslide') return isHi ? 'पश्चिमी घाट ढलान, केरल (चूरलमाला - मेप्पाडी)' : 'Western Ghats Escarpment, Kerala (Chooralmala - Meppadi)';
    if (h.id === 'volcano') return isHi ? 'अंडमान सागर (पोर्ट ब्लेयर से 138 किमी पूर्व)' : 'Andaman Sea Maritime Corridor (Indian EEZ)';
    if (h.id === 'flood') return isHi ? 'ऊपरी असम (काजीरंगा - माजुली सेक्टर)' : 'Kaziranga / Majuli Island Riparian Corridor';
    return isHi ? (h.region_hi || h.region) : h.region;
  };

  const getHazardMetricLabel = (h) => {
    if (!h) return '';
    if (h.id === 'cyclone') return isHi ? '28 किमी/घंटा सामान्य हवा' : '28 km/h Normal Breeze';
    if (h.id === 'landslide') return isHi ? '91.4% मृदा जल-संतृप्ति' : '91.4% Soil Saturation';
    if (h.id === 'volcano') return isHi ? '142 मेगावाट विकिरण ऊर्जा' : '142 MW Radiative Power';
    if (h.id === 'flood') return isHi ? '18,200 घन मी/सेकंड निर्वहन' : '18,200 m³/s Discharge';
    return isHi ? (h.primary_metric_hi || h.primary_metric) : h.primary_metric;
  };

  const getHazardSecondaryMetricLabel = (h) => {
    if (!h) return '';
    if (h.id === 'cyclone') return isHi ? '1008 hPa सामान्य वायुदाब' : '1008 hPa Standard Pressure';
    if (h.id === 'landslide') return isHi ? '312 मिमी / 48 घंटे वर्षा' : '312 mm / 48h Rain';
    if (h.id === 'volcano') return isHi ? '3.8 DU SO₂ गैस फैलाव' : '3.8 DU SO₂ Plume';
    if (h.id === 'flood') return isHi ? 'खतरे के निशान से 0.8 मी. नीचे' : '0.8m Below Danger Level';
    return isHi ? (h.secondary_metric_hi || h.secondary_metric) : h.secondary_metric;
  };

  const getHazardConfidenceLabel = (h) => {
    if (!h) return '';
    if (h.id === 'cyclone') return isHi ? '99% इनसैट-3डीआर रडार' : '99% INSAT-3DR Radar';
    if (h.id === 'landslide') return isHi ? '98% सेंटिनल उपग्रह रडार' : '98% Sentinel-1 SAR Multi-Sat';
    if (h.id === 'volcano') return isHi ? '99% सेंटिनल-2 SWIR' : '99% Sentinel-2 SWIR';
    if (h.id === 'flood') return isHi ? '96% CWC टेलीमेट्री ग्रिड' : '96% CWC Telemetry Grid';
    return isHi ? '96% उपग्रह सत्यापित' : '96% Multi-Sat Verified';
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-stone-950/75 backdrop-blur-md flex items-start justify-center p-3 sm:p-5 pt-[180px] sm:pt-[220px] lg:pt-[240px] cursor-pointer macos-backdrop"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#fcfaf5] border border-[#ded3bf] rounded-2xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl text-stone-800 cursor-default macos-window flex flex-col space-y-3 max-h-[76vh] overflow-y-auto"
      >
        {/* Row 1: Header */}
        <div className="flex items-center justify-between border-b border-[#ded3bf] pb-3 shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="macos-traffic-dots">
              <span onClick={onClose} className="macos-dot macos-dot-close" title="Close"></span>
              <span className="macos-dot macos-dot-minimize" title="Minimize"></span>
              <span className="macos-dot macos-dot-maximize" title="Zoom"></span>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs ${
              reportHazard?.badge_color || 'bg-red-600'
            }`}>
              {reportHazard?.id === 'landslide' && <Mountain className="w-4 h-4" />}
              {reportHazard?.id === 'volcano' && <Flame className="w-4 h-4" />}
              {reportHazard?.id === 'flood' && <Waves className="w-4 h-4" />}
              {reportHazard?.id === 'cyclone' && <Wind className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-stone-900">
                  {isHi ? 'आधिकारिक आपदा स्थिति रिपोर्ट:' : 'Disaster Situation Report:'}{' '}
                  <span className="text-stone-950 underline decoration-amber-600">
                    {getHazardDisplayName(reportHazard)}
                  </span>
                </h3>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full text-white font-bold ${
                  reportHazard?.status_code === 'HIGH_ALERT'
                    ? 'bg-red-600'
                    : reportHazard?.status_code === 'MONITORED_ADVISORY'
                    ? 'bg-orange-600'
                    : 'bg-emerald-600'
                }`}>
                  {reportHazard?.status_code === 'HIGH_ALERT'
                    ? (isHi ? 'लाल चेतावनी • अति गंभीर' : 'RED ALERT • CRITICAL')
                    : reportHazard?.status_code === 'MONITORED_ADVISORY'
                    ? (isHi ? 'निगरानी परामर्श • मध्यम' : 'ADVISORY • MONITORED')
                    : (isHi ? 'सुरक्षित • सामान्य' : 'SAFE • NORMAL')}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 font-medium mt-0.5 flex-wrap">
                <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                <span>{getHazardRegionName(reportHazard)}</span>
                <span>•</span>
                <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                <span>{isHi ? 'उपग्रह रडार एवं ग्राउंड सेंसर द्वारा लाइव सत्यापित' : 'Satellite Verified Ground Truth'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Toggle with Global Sync */}
            <div className="flex items-center rounded-lg border border-stone-300 bg-white overflow-hidden text-[11px] font-bold shadow-2xs">
              <button
                onClick={() => {
                  setReportLang('en');
                  if (lang === 'hi' && toggleLang) toggleLang();
                }}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${!isHi ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setReportLang('hi');
                  if (lang === 'en' && toggleLang) toggleLang();
                }}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${isHi ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                सरल हिंदी
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors macos-tap cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Headline Quick Take with Intelligent AI Badge */}
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl px-3.5 py-2 text-xs flex items-start sm:items-center gap-2.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-[11px] sm:text-xs text-stone-800 leading-snug">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 font-bold border border-amber-300 mr-1.5">
              {isHi ? 'स्वायत्त AI मूल्यांकन' : 'Autonomous AI Analysis'}
            </span>
            <span className="font-black text-amber-950 mr-1.5">
              {isHi ? pr.headline_hi : pr.headline_en}:
            </span>
            <span>{isHi ? pr.quick_take_hi : pr.quick_take_en}</span>
          </div>
        </div>

        {/* Row 3: 🌟 3 Critical Chronological Pillars (Kab Shuru Hua • Kaise Badh Raha Hai • Abhi Kya Stithi Hai) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Pillar 1: Kab Start Hua */}
          <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] uppercase font-black text-amber-900 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isHi ? '1. कब शुरू हुआ?' : '1. When Did It Start?'}</span>
                </span>
                <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                  {isHi ? 'प्रारंभ काल' : 'Origin'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed font-medium">
                {isHi ? pr.when_started_hi : pr.when_started_en}
              </p>
            </div>
          </div>

          {/* Pillar 2: Kaise Badh Raha Hai */}
          <div className="bg-white p-3 rounded-xl border border-red-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] uppercase font-black text-red-900 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-red-700" />
                  <span>{isHi ? '2. कैसे बढ़ रहा है?' : '2. How Is It Escalating?'}</span>
                </span>
                <span className="text-[9px] font-bold bg-red-100 text-red-900 px-1.5 py-0.5 rounded">
                  {isHi ? 'प्रगति व तीव्रता' : 'Trajectory'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed font-medium">
                {isHi ? pr.how_escalating_hi : pr.how_escalating_en}
              </p>
            </div>
          </div>

          {/* Pillar 3: What Is Current Situation */}
          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] uppercase font-black text-emerald-900 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isHi ? '3. अभी क्या स्थिति है?' : '3. What Is The Situation?'}</span>
                </span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                  {isHi ? 'वर्तमान ज़मीनी स्थिति' : 'Current State'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed font-medium">
                {isHi ? pr.current_situation_hi : pr.current_situation_en}
              </p>
            </div>
          </div>
        </div>

        {/* Row 4: 4 Metric Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white border border-[#ded3bf] rounded-xl px-3 py-2 shadow-2xs">
            <span className="text-[9px] uppercase font-bold text-stone-500 block leading-tight">
              {isHi ? 'आपदा सूचकांक (MHSI)' : 'Threat Index (MHSI)'}
            </span>
            <span className="text-sm sm:text-base font-black text-red-700 font-mono">
              MHSI {reportHazard?.mhsi_score} <span className="text-[9px] text-stone-400 font-normal">/100</span>
            </span>
          </div>
          <div className="bg-white border border-[#ded3bf] rounded-xl px-3 py-2 shadow-2xs">
            <span className="text-[9px] uppercase font-bold text-stone-500 block leading-tight">
              {isHi ? 'प्राथमिक पैमाना' : 'Primary Metric'}
            </span>
            <span className="text-xs sm:text-sm font-black text-stone-900 truncate block">
              {getHazardMetricLabel(reportHazard)}
            </span>
          </div>
          <div className="bg-white border border-[#ded3bf] rounded-xl px-3 py-2 shadow-2xs">
            <span className="text-[9px] uppercase font-bold text-stone-500 block leading-tight">
              {isHi ? 'द्वितीयक पैमाना' : 'Secondary Metric'}
            </span>
            <span className="text-xs sm:text-sm font-black text-stone-900 truncate block">
              {getHazardSecondaryMetricLabel(reportHazard)}
            </span>
          </div>
          <div className="bg-white border border-[#ded3bf] rounded-xl px-3 py-2 shadow-2xs">
            <span className="text-[9px] uppercase font-bold text-stone-500 block leading-tight">
              {isHi ? 'डेटा विश्वसनीयता' : 'Data Confidence'}
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
              {getHazardConfidenceLabel(reportHazard)}
            </span>
          </div>
        </div>

        {/* Row 5: 2-Column Physics & Public Action Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {/* Left: Physics & Population */}
          <div className="bg-[#ede4d4]/60 border border-[#ded3bf] rounded-xl p-3 space-y-1.5">
            <span className="text-[11px] font-bold text-stone-900 block flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-red-600" />
              <span>{isHi ? 'खतरे का वैज्ञानिक कारण एवं आबादी जोखिम:' : 'Scientific Cause & Population Exposure:'}</span>
            </span>
            <p className="text-[11px] sm:text-xs text-stone-700 leading-snug">
              {isHi ? pr.why_dangerous_hi : pr.why_dangerous_en}
            </p>
            <p className="text-[10px] sm:text-[11px] text-stone-600 pt-1 border-t border-stone-200">
              <strong className="text-stone-800">{isHi ? 'प्रभावित आबादी:' : 'Populations:'}</strong> {isHi ? pr.who_affected_hi : pr.who_affected_en}
            </p>
          </div>

          {/* Right: Emergency Relief & Do's/Don'ts */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-950 block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isHi ? 'राहत अभियान एवं नागरिकों के लिए निर्देश:' : 'Relief & Public Safety Protocol:'}</span>
            </span>
            <p className="text-[11px] sm:text-xs text-emerald-900 leading-snug font-medium">
              {isHi ? pr.current_action_hi : pr.current_action_en}
            </p>
            <div className="flex items-center gap-2.5 pt-1 border-t border-emerald-200/60 text-[10px] sm:text-[11px] text-emerald-950 flex-wrap">
              {(isHi ? pr.dos_and_donts_hi : pr.dos_and_donts_en)?.slice(0, 2).map((d, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{d}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 6: Compact Footer Strip */}
        <div className="border-t border-[#ded3bf] pt-2.5 shrink-0 flex items-center justify-between text-[11px] text-stone-600 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-stone-700">
            <Compass className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span><strong>{isHi ? 'पूर्वानुमान (12-24 घंटे):' : 'Outlook (12-24h):'}</strong> {isHi ? pr.future_outlook_hi : pr.future_outlook_en}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all macos-tap cursor-pointer ml-auto"
          >
            {isHi ? 'रिपोर्ट बंद करें' : 'Close Report'}
          </button>
        </div>

      </div>
    </div>
  );
}
