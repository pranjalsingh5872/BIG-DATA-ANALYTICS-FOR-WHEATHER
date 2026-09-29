import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const CATEGORIES_MAP = {
  Rainfall: { en: 'Rainfall', hi: 'वर्षा' },
  Flooding: { en: 'Flooding', hi: 'बाढ़' },
  Thunderstorm: { en: 'Thunderstorm', hi: 'गर्जन / तड़ित' },
  Heatwave: { en: 'Heatwave', hi: 'लू / ग्रीष्म लहर' },
  Fog: { en: 'Fog', hi: 'कोहरा' },
  'Dust Storm': { en: 'Dust Storm', hi: 'धूल भरी आंधी' },
  'Strong Winds': { en: 'Strong Winds', hi: 'तीव्र हवाएं' },
  Cyclone: { en: 'Cyclone', hi: 'चक्रवाती तूफान' },
  Other: { en: 'Other', hi: 'अन्य' }
};

export const SEVERITIES_MAP = {
  Critical: { en: 'Critical', hi: 'अति गंभीर (Critical)' },
  High: { en: 'High', hi: 'उच्च (High)' },
  Moderate: { en: 'Moderate', hi: 'मध्यम (Moderate)' },
  Low: { en: 'Low', hi: 'सामान्य (Low)' },
  All: { en: 'All', hi: 'सभी (All)' }
};

export const STATUSES_MAP = {
  VERIFIED: { en: 'VERIFIED', hi: 'सत्यापित' },
  PENDING_REVIEW: { en: 'PENDING_REVIEW', hi: 'समीक्षाधीन' },
  REJECTED: { en: 'REJECTED', hi: 'अस्वीकृत' },
  QUARANTINED: { en: 'QUARANTINED', hi: 'पृथक्कृत (Quarantined)' },
  All: { en: 'All', hi: 'सभी (All)' }
};

export const SOURCES_MAP = {
  'IMD Doppler Radar': { en: 'IMD Doppler Radar', hi: 'आईएमडी डॉपलर रडार' },
  'INSAT-3DR Satellite': { en: 'INSAT-3DR Satellite', hi: 'इनसैट-3डीआर उपग्रह' },
  'Open-Meteo AWS': { en: 'Open-Meteo AWS', hi: 'सतही एडब्ल्यूएस (AWS)' },
  'Twitter / X Stream': { en: 'Twitter / X Stream', hi: 'एक्स / सोशल मीडिया' },
  'Citizen PWA Reports': { en: 'Citizen PWA Reports', hi: 'नागरिक जमीनी रिपोर्ट' },
  All: { en: 'All', hi: 'सभी स्रोत' }
};

export const translations = {
  en: {
    brandName: 'WEATHERNEXUS',
    brandSub: 'National Weather Big Data Analytics Platform',
    overview: 'Overview',
    cycloneTab: 'Cyclone & Wind',
    eventsTab: 'Event Ingestion',
    analyticsTab: 'Analytics',
    reviewTab: 'Authority Review',
    citizenTab: 'Citizen Report',
    grievanceTab: 'Dispute / Grievance',
    alertsTab: 'CAP Emergency Alert',
    systemTab: 'Node Health',
    authoritySignIn: 'Authority Sign In',
    officialAuthority: 'OFFICIAL AUTHORITY',
    signOut: 'Sign Out',
    activeEvents: 'Active Incidents',
    detectionAccuracy: 'Verified Accuracy',
    operationalPriorityQueue: 'Operational Priority Queue',
    viewAll: 'View All',
    noActiveAlerts: 'No active critical alerts in queue',
    inspectAiTruth: 'Inspect AI Truth & Evidence',
    eventTypes: 'Event Types',
    showAll: 'Show All',
    indianStandardTime: 'IST',
    autoSyncActive: 'Auto-Sync Active (15m)',
    activeCycloneAlert: 'ACTIVE CYCLONE DETECTED',
    threatScore: 'Threat Index',
    verificationMatrix: 'AI Verification Matrix',
    downloadPdf: 'Download Official Incident Brief PDF',
    fileGrievance: 'File Grievance / Dispute Report',
    languageToggle: 'हिन्दी',
    publicOperations: 'Public Operations',
    authorityControls: 'Authority Controls',
    loading: 'Loading telemetry...',
    coordinates: 'Coordinates',
    peakGusts: 'Peak Gusts',
    track: 'Track',
    source: 'Source',
    trustScore: 'TrustScore',
    auditLedger: 'Audit Ledger',
    filterDesk: 'Multi-Source Meteorological Event Query Desk',
    searchPlaceholder: 'Search by keyword, city, or state...',
    exportCsv: 'Export CSV Ledger',
    eventTitleCol: 'Event & Observation',
    typeSeverityCol: 'Type / Severity',
    locationH3Col: 'Location & H3',
    sourceCol: 'Source Provenance',
    trustCol: 'AI TrustScore™',
    statusCol: 'Status',
    actionsCol: 'Actions',
    noEventsFound: 'No weather events match current filter conditions.',
    restrictedAreaTitle: 'Restricted Authority Area · Operator Review Desk',
    restrictedAreaDesc: 'Meteorological incident triage, report verification, and operational queue curation are strictly restricted to verified disaster authorities and IMD duty officers.',
    activeCycloneBanner: 'ACTIVE CYCLONE DETECTED: SEVERE CYCLONIC STORM \'DANA\' (VSCS-02B)',
    cycloneBannerDesc: 'Vortex Eye locked at 16.8°N, 88.5°E (Bay of Bengal). Threat cone & wind radii plotted live on National Tactical Map below.',
    inspectCycloneBtn: 'Inspect Cyclone & Wind Trajectory →',
    nationalCrisisCommand: 'National Crisis Command',
    routineSurveillance: 'Routine Normal Conditions',
    atmosphericScanBtn: 'Check Atmospheric Systems (Live Scan)',
    scanningAtmospheric: 'Scanning Atmospheric Systems...',
    slideTrayLabel: 'Multi-Hazard Priority Slide Tray (Slide & Touch to Switch Active Face)',
    observationPassesLabel: 'Real-Time Zoom Earth & Satellite Observation Passes (Live & Historic Passes)',
    forecastTimelineLabel: '72-Hour Cyclone Landfall & Wind Velocity Timeline Simulation (Touch to Advance Track)',
    landfallRiskCone: 'IMD Multi-Ensemble Cone of Uncertainty & 50-kt Destructive Wind Radii'
  },
  hi: {
    brandName: 'वेदरनेक्सस (WEATHERNEXUS)',
    brandSub: 'राष्ट्रीय मौसम बिग डेटा एनालिटिक्स प्लेटफॉर्म',
    overview: 'मुख्य स्थिति (Overview)',
    cycloneTab: 'चक्रवात एवं वायु (Cyclone)',
    eventsTab: 'घटना अंतर्ग्रहण (Events)',
    analyticsTab: 'डेटा विश्लेषण (Analytics)',
    reviewTab: 'प्राधिकरण समीक्षा (Authority Review)',
    citizenTab: 'नागरिक रिपोर्ट (Citizen)',
    grievanceTab: 'शिकायत निवारण (Grievance)',
    alertsTab: 'आपातकालीन चेतावनी (CAP Alert)',
    systemTab: 'नोड स्वास्थ्य (Node Health)',
    authoritySignIn: 'अधिकारी लॉगिन',
    officialAuthority: 'अधिकृत अधिकारी',
    signOut: 'लॉगआउट',
    activeEvents: 'सक्रिय घटनाएं',
    detectionAccuracy: 'सत्यापित सटीकता',
    operationalPriorityQueue: 'परिचालन प्राथमिकता कार्य सूची',
    viewAll: 'सभी देखें',
    noActiveAlerts: 'कोई गंभीर चेतावनी लंबित नहीं',
    inspectAiTruth: 'AI प्रमाण एवं सत्यता जांचें',
    eventTypes: 'घटना के प्रकार',
    showAll: 'सभी दिखाएं',
    indianStandardTime: 'भारतीय मानक समय (IST)',
    autoSyncActive: 'स्वतः सिंक सक्रिय (15 मिनट)',
    activeCycloneAlert: 'सक्रिय चक्रवात चेतावनी',
    threatScore: 'खतरा सूचकांक',
    verificationMatrix: 'AI सत्यापन मैट्रिक्स',
    downloadPdf: 'आधिकारिक घटना सारांश PDF डाउनलोड करें',
    fileGrievance: 'आपत्ति / शिकायत दर्ज करें',
    languageToggle: 'English',
    publicOperations: 'नागरिक एवं सार्वजनिक संचालन',
    authorityControls: 'प्राधिकरण नियंत्रण',
    loading: 'टेलीमेट्री लोड हो रही है...',
    coordinates: 'भौगोलिक निर्देशांक',
    peakGusts: 'अधिकतम वायु झोंके',
    track: 'प्रक्षेपित मार्ग',
    source: 'आगमन स्रोत',
    trustScore: 'विश्वास सूचकांक',
    auditLedger: 'ऑडिट लेज़र रिकॉर्ड',
    filterDesk: 'बहु-स्रोत मौसम संबंधी घटना अन्वेषण डेस्क',
    searchPlaceholder: 'कीवर्ड, शहर या राज्य से खोजें...',
    exportCsv: 'CSV लेज़र डाउनलोड करें',
    eventTitleCol: 'घटना एवं अवलोकन विवरण',
    typeSeverityCol: 'प्रकार / गंभीरता',
    locationH3Col: 'स्थान एवं H3 इंडेक्स',
    sourceCol: 'आगमन स्रोत',
    trustCol: 'AI ट्रस्ट-स्कोर™',
    statusCol: 'सत्यापन स्थिति',
    actionsCol: 'कार्रवाई',
    noEventsFound: 'वर्तमान फ़िल्टर शर्तों से कोई मौसम घटना मेल नहीं खाती।',
    restrictedAreaTitle: 'प्रतिबंधित प्राधिकरण क्षेत्र · ऑपरेटर समीक्षा डेस्क',
    restrictedAreaDesc: 'मौसम संबंधी घटनाओं की समीक्षा, रिपोर्ट सत्यापन एवं कतार प्रबंधन केवल अधिकृत आपदा प्रबंधन अधिकारियों एवं आईएमडी ड्यूटी अफसरों के लिए सीमित है।',
    activeCycloneBanner: 'सक्रिय चक्रवात चेतावनी: गंभीर चक्रवाती तूफान \'दाना\' (VSCS-02B)',
    cycloneBannerDesc: 'चक्रवात केंद्र 16.8°N, 88.5°E (बंगाल की खाड़ी) पर स्थित। राष्ट्रीय सामरिक मानचित्र पर खतरा क्षेत्र लाइव प्रदर्शित है।',
    inspectCycloneBtn: 'चक्रवात एवं वायु प्रक्षेपवक्र जांचें →',
    nationalCrisisCommand: 'राष्ट्रीय संकट कमान केंद्र',
    routineSurveillance: 'सामान्य निगरानी स्थिति',
    atmosphericScanBtn: 'वायुमंडलीय प्रणालियों की जांच (लाइव स्कैन)',
    scanningAtmospheric: 'वायुमंडलीय प्रणालियों का विश्लेषण जारी...',
    slideTrayLabel: 'बहु-आपदा प्राथमिकता स्लाइड ट्रे (सक्रिय दृश्य बदलने हेतु स्लाइड करें):',
    observationPassesLabel: 'ज़ूम अर्थ एवं उपग्रह अवलोकन पास (लाइव एवं पूर्ववर्ती पास):',
    forecastTimelineLabel: '72-घंटे का चक्रवात लैंडफॉल एवं वायु गति प्रक्षेपवक्र (मार्ग अग्रसारित करने हेतु स्पर्श करें):',
    landfallRiskCone: 'आईएमडी अनिश्चितता शंकु एवं 50-नॉट विनाशकारी वायु त्रिज्या'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('weathernexus_lang') || 'en';
  });

  const toggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem('weathernexus_lang', next);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  const tr = (enText, hiText) => {
    return lang === 'hi' ? (hiText || enText) : enText;
  };

  const translateCategory = (cat) => {
    if (!cat) return '';
    return lang === 'hi' ? (CATEGORIES_MAP[cat]?.hi || cat) : (CATEGORIES_MAP[cat]?.en || cat);
  };

  const translateSeverity = (sev) => {
    if (!sev) return '';
    return lang === 'hi' ? (SEVERITIES_MAP[sev]?.hi || sev) : (SEVERITIES_MAP[sev]?.en || sev);
  };

  const translateStatus = (stat) => {
    if (!stat) return '';
    return lang === 'hi' ? (STATUSES_MAP[stat]?.hi || stat) : (STATUSES_MAP[stat]?.en || stat);
  };

  const translateSource = (src) => {
    if (!src) return '';
    return lang === 'hi' ? (SOURCES_MAP[src]?.hi || src) : (SOURCES_MAP[src]?.en || src);
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      toggleLang,
      t,
      tr,
      translateCategory,
      translateSeverity,
      translateStatus,
      translateSource
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: 'en',
      toggleLang: () => {},
      t: (k) => translations.en[k] || k,
      tr: (enText) => enText,
      translateCategory: (c) => c,
      translateSeverity: (s) => s,
      translateStatus: (st) => st,
      translateSource: (src) => src
    };
  }
  return ctx;
}
