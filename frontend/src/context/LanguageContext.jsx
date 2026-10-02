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

export const INDIAN_CITIES_MAP = {
  'Agartala': 'अगरतला',
  'Agra': 'आगरा',
  'Ahmedabad': 'अहमदाबाद',
  'Amritsar': 'अमृतसर',
  'Bengaluru': 'बेंगलुरु',
  'Bangalore': 'बेंगलुरु',
  'Bhopal': 'भोपाल',
  'Bhubaneswar': 'भुवनेश्वर',
  'Chandigarh': 'चंडीगढ़',
  'Chennai': 'चेन्नई',
  'Coimbatore': 'कोयंबटूर',
  'Cuttack': 'कटक',
  'Dehradun': 'देहरादून',
  'Gangtok': 'गंगटोक',
  'Guwahati': 'गुवाहाटी',
  'Hyderabad': 'हैदराबाद',
  'Imphal': 'इम्फाल',
  'Indore': 'इंदौर',
  'Jaipur': 'जयपुर',
  'Jodhpur': 'जोधपुर',
  'Kochi': 'कोच्चि',
  'Kolkata': 'कोलकाता',
  'Lucknow': 'लखनऊ',
  'Madurai': 'मदुरै',
  'Mumbai': 'मुंबई',
  'Nagpur': 'नागपुर',
  'New Delhi': 'नई दिल्ली',
  'Delhi': 'दिल्ली',
  'Patna': 'पटना',
  'Pune': 'पुणे',
  'Puri': 'पुरी',
  'Raipur': 'रायपुर',
  'Ranchi': 'रांची',
  'Shillong': 'शिलांग',
  'Shimla': 'शिमला',
  'Srinagar': 'श्रीनगर',
  'Surat': 'सूरत',
  'Thiruvananthapuram': 'तिरुवनंतपुरम',
  'Varanasi': 'वाराणसी',
  'Vijayawada': 'विजयवाड़ा',
  'Visakhapatnam': 'विशाखापट्टनम',
  'Dadar': 'दादर',
  'Thane': 'ठाणे',
  'Kurla': 'कुर्ला',
  'Silk Board': 'सिल्क बोर्ड',
  'Ganjam': 'गंजम',
  'Solan': 'सोलन',
  'Taradevi': 'तारादेवी',
  'Kankarbagh': 'कंकड़बाग',
  'Velachery': 'वेलाचेरी',
  'Sundarbans': 'सुंदरबन'
};

export const INDIAN_STATES_MAP = {
  'Andhra Pradesh': 'आंध्र प्रदेश',
  'Assam': 'असम',
  'Bihar': 'बिहार',
  'Chhattisgarh': 'छत्तीसगढ़',
  'Delhi': 'दिल्ली',
  'Gujarat': 'गुजरात',
  'Himachal Pradesh': 'हिमाचल प्रदेश',
  'Jammu & Kashmir': 'जम्मू एवं कश्मीर',
  'Jammu and Kashmir': 'जम्मू एवं कश्मीर',
  'Jharkhand': 'झारखंड',
  'Karnataka': 'कर्नाटक',
  'Kerala': 'केरल',
  'Madhya Pradesh': 'मध्य प्रदेश',
  'Maharashtra': 'महाराष्ट्र',
  'Manipur': 'मणिपुर',
  'Meghalaya': 'मेघालय',
  'Odisha': 'ओडिशा',
  'Punjab': 'पंजाब',
  'Rajasthan': 'राजस्थान',
  'Sikkim': 'सिक्किम',
  'Tamil Nadu': 'तमिलनाडु',
  'Telangana': 'तेलंगाना',
  'Tripura': 'त्रिपुरा',
  'Uttar Pradesh': 'उत्तर प्रदेश',
  'Uttarakhand': 'उत्तराखंड',
  'West Bengal': 'पश्चिम बंगाल'
};

export const REPORT_TITLES_MAP = {
  // Review Queue Items
  'Severe Flash Flooding & Submerged Tracks near Dadar': 'दादर के निकट भीषण जलभराव एवं रेल पटरियां जलमग्न',
  'Gale-Force Thunderstorm Gusts & Uprooted Trees near Cuttack Ring Road': 'कटक रिंग रोड के निकट तीव्र आंधी-तूफान के झोंके एवं उखड़े हुए पेड़',
  'Dense Winter Smog & Visibility Dropped Below 50m along Ring Road': 'रिंग रोड पर घना शीतकालीन स्मॉग, दृश्यता 50 मीटर से कम',
  'Heavy Rain Waterlogging & Vehicle Stalling near Silk Board': 'सिल्क बोर्ड के पास भारी बारिश से जलभराव और वाहन फंसे',

  // Specific Fallback and Live Ingested Events
  'High swell waves along Puri and Ganjam coastal belt. CWC issues advisory for fishermen not to v...': 'पुरी और गंजम तटीय पट्टी में ऊंची लहरें। सीडब्ल्यूसी की मछुआरों को समुद्र में न जाने की सलाह...',
  'IMD Nowcast: Kolkata and South 24 Parganas to experience moderate spells of rainfall accompanie...': 'आईएमडी नाउकास्ट: कोलकाता एवं दक्षिण 24 परगना में मध्यम बारिश और वज्रपात का अनुमान...',
  'Severe localized thunderstorm and high wind squall reported across coastal Mumbai and Thane sub...': 'तटीय मुंबई और ठाणे उपनगरों में तेज आंधी और भारी बारिश की सूचना...',
  'Severe Waterlogging at Kurla and Gandhi Market: Twitter Storm Report': 'कुर्ला और गांधी मार्केट में भीषण जलभराव: ट्विटर स्टॉर्म रिपोर्ट',
  'Citizen Field Verification: High Tide Tidal Surge at Fort Kochi Coast': 'नागरिक जमीनी सत्यापन: फोर्ट कोच्चि तट पर हाई टाइड समुद्री उफान',
  'Brahmaputra Water Level Warning: Inundation in Rukminigaon': 'ब्रह्मपुत्र जल स्तर चेतावनी: रुक्मिणीगांव में बाढ़ की स्थिति',
  'Dense Valley Fog & Reduced Visibility on Kalka-Shimla Highway': 'कालका-शिमला हाईवे पर घनी घाटी का कोहरा एवं घटी दृश्यता',
  'Sudden Squall and Dust Surge in Delhi NCR: Crowdsourced Report': 'दिल्ली-एनसीआर में अचानक आंधी और धूल का गुबार: क्राउडसोर्स्ड रिपोर्ट',
  "Kalbaishakhi Nor'wester Activity Detected in North 24 Parganas": 'उत्तर 24 परगना में कालबैशाखी (नॉर्वेस्टर) तूफान गतिविधि दर्ज',
  'Bellandur Outer Ring Road Flash Drainage Overflow': 'बेलंदूर आउटर रिंग रोड पर जल निकासी नाला ओवरफ्लो',
  'Coastal Moisture Surge & Steady Downpour in Velachery': 'वेलाचेरी में तटीय नमी वृद्धि एवं निरंतर मूसलाधार बारिश',
  'Severe Heat Index & Loo Winds Reported Across Walled City': 'चारदीवारी शहर में भीषण हीट इंडेक्स एवं लू की लपटें',
  'Spam/Unverified Claim: False Cloudburst Alert Flagged by AI Tri-Check': 'स्पैम/असत्यापित दावा: AI त्रि-जांच द्वारा गलत क्लाउडबर्स्ट अलर्ट चिह्नित'
};

export const REPORT_DESCRIPTIONS_MAP = {
  // Review Queue Items Descriptions
  'Heavy downpour exceeding 80mm in 2 hours. Rail tracks waterlogged up to 1.5 ft near Dadar central junction.':
    '2 घंटे में 80 मिमी से अधिक भीषण मूसलाधार बारिश। दादर सेंट्रल जंक्शन के पास रेल पटरियां 1.5 फीट तक जलमग्न।',
  'Severe squall with wind speeds crossing 75 km/h. Multiple fallen trees blocking traffic towards Link Road.':
    '75 किमी/घंटा से अधिक की रफ्तार से भीषण तूफान। लिंक रोड की ओर यातायात अवरुद्ध करने वाले कई गिरे हुए पेड़।',
  'Severe particulate inversion layer reducing roadway visibility below safe braking limits at 35 km/h.':
    'सड़क दृश्यता को 35 किमी/घंटे की सुरक्षित ब्रेकिंग सीमा से नीचे लाने वाली गंभीर कण उलटाव परत।',
  'Sudden cloudburst cell dumping 62mm in 45 minutes. Water depth 1.2ft at underpass, vehicular traffic crawling.':
    '45 मिनट में 62 मिमी बारिश का अचानक क्लाउडबर्स्ट सेल। अंडरपास में पानी की गहराई 1.2 फीट, वाहनों की आवाजाही अत्यंत धीमी।',

  // Specific Fallback and Live Ingested Events Descriptions
  'Crowdsourced alert via #MumbaiRains: Rapid inundation reported on LBS Marg and railway underpass. Vehicles stalled, civic pumps active.':
    '#MumbaiRains के माध्यम से प्राप्त अलर्ट: एलबीएस मार्ग और रेलवे अंडरपास पर तीव्र जलभराव। वाहन फंसे, नगर निगम पंप सक्रिय।',
  'Citizen PWA submission: Seawater breach on beach walkway. Inundation depth 0.45 meters. High tidal swell corroborated with INCOIS buoy data.':
    'नागरिक PWA रिपोर्ट: बीच वॉकवे पर समुद्र का पानी पहुंचा। जलभराव की गहराई 0.45 मीटर। इनकोइस (INCOIS) बॉय डेटा से पुष्टि।',
  'Verified citizen stream #AssamFloods: Flash runoff from Meghalaya hills inundating GS Road and low-lying residential sectors.':
    'सत्यापित नागरिक रिपोर्ट #AssamFloods: मेघालय की पहाड़ियों से आए पानी से जीएस रोड और निचले आवासीय इलाके जलमग्न।',
  'Citizen PWA telemetry: Ground visibility dropping under 40 meters between Solan and Taradevi. Heavy rime fog deposition.':
    'नागरिक PWA टेलीमेट्री: सोलन और तारादेवी के बीच दृश्यता 40 मीटर से नीचे गिरी। अत्यधिक घना कोहरा जमाव।',
  'Citizen reports on #DelhiWeather: High velocity dust winds followed by localized drizzle in Central and South Delhi. Trees uprooted near ITO.':
    '#DelhiWeather नागरिक रिपोर्ट: मध्य एवं दक्षिण दिल्ली में तेज धूल भरी हवाओं के बाद बूंदाबांदी। आईटीओ के पास पेड़ उखड़े।',
  'Real-time Twitter stream #KolkataRains: Intense thunderstorm band moving inland from Sundarbans. Gusty winds reaching 65 km/h.':
    'ट्विटर लाइव स्ट्रीम #KolkataRains: सुंदरबन से मुख्य भूमि की ओर बढ़ता तीव्र आंधी का दायरा। हवा की गति 65 किमी/घंटा तक।',
  'PWA Ground Truth: Heavy storm runoff overflowing stormwater drains on Ecospace junction. Two lanes waterlogged.':
    'PWA ग्राउंड ट्रुथ: इकोस्पेस जंक्शन पर तूफानी बारिश का पानी नालों से बाहर। दो लेन जलमग्न।',
  'Verified tweet #ChennaiRains: Continuous sea-breeze convection causing steady moderate rainfall across South Chennai corridors.':
    'सत्यापित ट्वीट #ChennaiRains: निरंतर समुद्री समीर संवहन के कारण दक्षिण चेन्नई गलियारों में लगातार मध्यम वर्षा।',
  'Citizen telemetry #JaipurHeat: Ambient mercury surpassing 43°C with dry westerly convection. Public advised to avoid midday sun.':
    'नागरिक टेलीमेट्री #JaipurHeat: शुष्क पश्चिमी हवाओं से तापमान 43°C के पार। दोपहर में तेज धूप से बचने की सलाह।',
  'Flagged Citizen report claiming severe cloudburst in Kankarbagh. Doppler radar shows zero convective echoes (0.0 mm/hr). AI marked disproven.':
    'कंकड़बाग में भीषण बादल फटने का दावा करने वाली नागरिक रिपोर्ट चिह्नित। डॉपलर रडार में शून्य संवहनी प्रतिध्वनि (0.0 मिमी/घंटा)। AI द्वारा खारिज।'
};

export const translateReportTitle = (title, lang = 'hi') => {
  if (!title) return '';
  if (lang !== 'hi') return title;
  if (/[\u0900-\u097F]/.test(title)) return title; // Already in Devanagari script

  if (REPORT_TITLES_MAP[title]) {
    return REPORT_TITLES_MAP[title];
  }

  const tc = (c) => INDIAN_CITIES_MAP[c] || c;
  const ts = (s) => INDIAN_STATES_MAP[s] || s;

  // Regex dynamic patterns
  let m = title.match(/^Live Surface Observation:\s*(.+?),\s*(.+?)\s*\((.+?)\)$/i);
  if (m) return `${tc(m[1].trim())}, ${ts(m[2].trim())} में प्रत्यक्ष सतही अवलोकन (${m[3]})`;

  m = title.match(/^Live Surface Observation:\s*(.+?)\s*\((.+?)\)$/i);
  if (m) return `${tc(m[1].trim())} में प्रत्यक्ष सतही अवलोकन (${m[2]})`;

  m = title.match(/^Coastal Convective Showers & Marine Breeze in\s+(.+)$/i);
  if (m) return `${tc(m[1].trim())} में तटीय संवहनी बौछारें एवं समुद्री समीर`;

  m = title.match(/^Low Visibility Fog Corridor in\s+(.+?),\s*(.+)$/i);
  if (m) return `${tc(m[1].trim())}, ${ts(m[2].trim())} में कम दृश्यता वाला कोहरा गलियारा`;

  m = title.match(/^Low Visibility Fog Corridor in\s+(.+)$/i);
  if (m) return `${tc(m[1].trim())} में कम दृश्यता वाला कोहरा गलियारा`;

  m = title.match(/^Localized Thunderstorm & Cloud Cover in\s+(.+)$/i);
  if (m) return `${tc(m[1].trim())} में स्थानीय गरज-चमक एवं मेघाच्छादन`;

  m = title.match(/^Intense Downpour & Urban Waterlogging in\s+(.+)$/i);
  if (m) return `${tc(m[1].trim())} में मूसलाधार बारिश एवं शहरी जलभराव`;

  m = title.match(/^Heatwave Conditions & High Insolation in\s+(.+)$/i);
  if (m) return `${tc(m[1].trim())} में भीषण लू एवं अत्यधिक सौर विकिरण`;

  m = title.match(/^Dust Storm & Reduced Visibility in\s+(.+)$/i);
  if (m) return `${tc(m[1].trim())} में धूल भरी आंधी एवं दृश्यता में कमी`;

  m = title.match(/^Squall Line & Gale-Force Winds in\s+(.+)$/i);
  if (m) return `${tc(m[1].trim())} में तेज आंधी एवं चक्रवाती हवाएं`;

  return title;
};

export const translateReportDescription = (desc, lang = 'hi') => {
  if (!desc) return '';
  if (lang !== 'hi') return desc;
  if (/[\u0900-\u097F]/.test(desc)) return desc; // Already in Devanagari script

  if (REPORT_DESCRIPTIONS_MAP[desc]) {
    return REPORT_DESCRIPTIONS_MAP[desc];
  }

  // Substring dynamic matchers for social / advisory feeds
  if (desc.includes('High swell waves along Puri and Ganjam coastal belt')) {
    return 'पुरी और गंजम के तटीय इलाकों में ऊंची लहरें। केंद्रीय जल आयोग (CWC) ने मछुआरों को गहरे समुद्र में न जाने की सलाह दी। #OdishaWeather #CycloneAlert';
  }
  if (desc.includes('Kolkata and South 24 Parganas to experience moderate spells of rainfall accompanied with lightning strikes')) {
    return 'आईएमडी नाउकास्ट: कोलकाता और दक्षिण 24 परगना में अगले 2 घंटों में आकाशीय बिजली चमकने के साथ मध्यम वर्षा की संभावना। #KolkataRains';
  }
  if (desc.includes('Severe localized thunderstorm and high wind squall reported across coastal Mumbai and Thane subways')) {
    return 'तटीय मुंबई और ठाणे सबवे में तीव्र स्थानीय गरज-चमक एवं तेज हवाओं के झोंके। निचले इलाकों में जलभराव। #MumbaiRains #WeatherAlert';
  }

  // Regex patterns for continuous telemetry
  let m = desc.match(/^Normal atmospheric baseline:\s*Temperature\s*([^,]+),\s*humidity\s*([^,]+),\s*wind speed\s*([^.]+)\.?/i);
  if (m) return `सामान्य वायुमंडलीय स्थिति: तापमान ${m[1]}, आर्द्रता ${m[2]}, हवा की गति ${m[3]}।`;

  m = desc.match(/^Coastal atmospheric reading:\s*Temperature\s*([^,]+),\s*humidity\s*([^,]+),\s*ocean breeze\s*([^.]+)\.?/i);
  if (m) return `तटीय वायुमंडलीय रीडिंग: तापमान ${m[1]}, आर्द्रता ${m[2]}, समुद्री समीर ${m[3]}।`;

  m = desc.match(/^Ground humidity at\s*([^%]+%?)\s*creating dense moisture inversion\. Visibility restricted\. Road transport caution advised\.?/i);
  if (m) return `जमीनी आर्द्रता ${m[1]} होने से घना नमी व्युत्क्रमण। दृश्यता बाधित। सड़क परिवहन में सावधानी बरतने की सलाह।`;

  m = desc.match(/^Convective orographic cloud cluster:\s*([^,]+),\s*relative humidity\s*([^,]+),\s*winds\s*([^.]+)\.?/i);
  if (m) return `संवहनी पर्वतीय मेघ समूह: तापमान ${m[1]}, सापेक्ष आर्द्रता ${m[2]}, हवाएं ${m[3]}।`;

  return desc;
};

export const translations = {
  en: {
    brandName: 'WEATHERNEXUS',
    brandSub: 'National Weather Big Data Analytics Platform',
    overview: 'Overview',
    cycloneTab: 'Disasters & Hazard Tracking',
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
    activeCycloneBanner: 'SYSTEM \'ARNAB\': DISSIPATED / LOW THREAT (ALL CLEAR · NO ACTIVE CYCLONE THREAT)',
    cycloneBannerDesc: 'System \'ARNAB\' has weakened into a non-active low-pressure trough over open water. Normal coastal weather and safe maritime conditions prevail.',
    inspectCycloneBtn: 'Inspect Disasters & Hazard Tracking →',
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
    cycloneTab: 'आपदा एवं जोखिम ट्रैकिंग (Disasters)',
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
    activeCycloneBanner: 'प्रणाली \'अर्नब\': शांत / कम खतरा (सामान्य स्थिति · कोई सक्रिय चक्रवात खतरा नहीं)',
    cycloneBannerDesc: 'चक्रवाती प्रणाली \'अर्नब\' समुद्र में कमजोर निम्न-दबाव गर्त में विलीन होकर शांत हो चुकी है। भारतीय तटों पर मौसम सामान्य एवं सुरक्षित है।',
    inspectCycloneBtn: 'आपदा एवं जोखिम ट्रैकिंग जांचें →',
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
    try {
      return localStorage.getItem('weathernexus_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    try {
      localStorage.setItem('weathernexus_lang', next);
    } catch {}
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

  const translateCityName = (city) => {
    if (!city) return '';
    return lang === 'hi' ? (INDIAN_CITIES_MAP[city] || city) : city;
  };

  const translateStateName = (st) => {
    if (!st) return '';
    return lang === 'hi' ? (INDIAN_STATES_MAP[st] || st) : st;
  };

  const translateTitle = (title) => {
    return translateReportTitle(title, lang);
  };

  const translateDesc = (desc) => {
    return translateReportDescription(desc, lang);
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
      translateSource,
      translateCity: translateCityName,
      translateState: translateStateName,
      translateReportTitle: translateTitle,
      translateReportDescription: translateDesc
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
      translateSource: (src) => src,
      translateCity: (c) => c,
      translateState: (s) => s,
      translateReportTitle: (t) => t,
      translateReportDescription: (d) => d
    };
  }
  return ctx;
}
