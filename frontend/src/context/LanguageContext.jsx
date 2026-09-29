import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

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
    languageToggle: 'हिन्दी'
  },
  hi: {
    brandName: 'वेदरनेक्सस (WEATHERNEXUS)',
    brandSub: 'राष्ट्रीय मौसम बिग डेटा एनालिटिक्स प्लेटफॉर्म',
    overview: 'मुख्य दृश्य (Overview)',
    cycloneTab: 'चक्रवात एवं वायु (Cyclone)',
    eventsTab: 'घटना अंतर्ग्रहण (Events)',
    analyticsTab: 'डेटा विश्लेषण (Analytics)',
    reviewTab: 'प्राधिकरण समीक्षा (Authority Review)',
    citizenTab: 'नागरिक रिपोर्ट (Citizen)',
    grievanceTab: 'शिकायत निवारण (Grievance)',
    alertsTab: 'आपातकालीन चेतावनी (CAP Alert)',
    systemTab: 'नोड स्वास्थ्य (Node Health)',
    authoritySignIn: 'अधिकारी लॉगिन (Sign In)',
    officialAuthority: 'अधिकृत अधिकारी',
    signOut: 'लॉगआउट',
    activeEvents: 'सक्रिय घटनाएं',
    detectionAccuracy: 'सत्यापित सटीकता',
    operationalPriorityQueue: 'प्राथमिकता कार्य सूची',
    viewAll: 'सभी देखें',
    noActiveAlerts: 'कोई गंभीर चेतावनी लंबित नहीं',
    inspectAiTruth: 'AI प्रमाण एवं सत्यापन जांचें',
    eventTypes: 'घटना प्रकार',
    showAll: 'सभी दिखाएं',
    indianStandardTime: 'भारतीय मानक समय (IST)',
    autoSyncActive: 'स्वतः सिंक सक्रिय (15 मिनट)',
    activeCycloneAlert: 'सक्रिय चक्रवात चेतावनी',
    threatScore: 'खतरा सूचकांक',
    verificationMatrix: 'AI सत्यापन मैट्रिक्स',
    downloadPdf: 'आधिकारिक घटना सारांश PDF डाउनलोड करें',
    fileGrievance: 'आपत्ति / शिकायत दर्ज करें',
    languageToggle: 'EN'
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

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
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
      t: (k) => translations.en[k] || k
    };
  }
  return ctx;
}
