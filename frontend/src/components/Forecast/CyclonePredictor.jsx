import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Navigation,
  Compass,
  AlertTriangle,
  Waves,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Eye,
  ShieldCheck,
  RefreshCw,
  Camera,
  CheckCircle2,
  Maximize2,
  ExternalLink,
  Mountain,
  Flame,
  SlidersHorizontal,
  Brain,
  HelpCircle,
  X,
  Scale,
  Zap,
  Target,
  Users,
  Home,
  Activity,
  Clock,
  FileText,
  ShieldAlert,
  History
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { api, generateDynamicCycloneForecast } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { formatIST } from '../../utils/time';
import { DEFAULT_MULTI_HAZARDS, getActiveMultiHazards, MHSI_ACTIVE_THRESHOLD, getArchivedDeescalatedHazards } from '../../utils/hazardData';

// Helper to guarantee Indian Standard Time (IST) formatting for all observation passes
export const formatPassTimeToIST = (ts) => {
  if (!ts) return 'Live IST';
  if (ts.includes('UTC')) {
    const parts = ts.replace(' UTC', '').split(', ');
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      const [h, m] = timePart.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        let totalMinutes = h * 60 + m + 330; // +5:30 for Indian Standard Time
        let newH = Math.floor(totalMinutes / 60) % 24;
        let newM = totalMinutes % 60;
        const ampm = newH >= 12 ? 'PM' : 'AM';
        const displayH = newH % 12 || 12;
        const displayM = String(newM).padStart(2, '0');
        return `${datePart}, ${String(displayH).padStart(2, '0')}:${displayM} ${ampm} IST`;
      }
    }
    return ts.replace('UTC', 'IST');
  }
  return ts;
};

// Dynamic Real-Time Zoom Earth Observation Passes (Relative to Current Clock in IST)
export const getDynamicZoomEarthPasses = () => {
  const now = new Date();
  const formatOffset = (hoursAgo) => {
    const d = new Date(now.getTime() - hoursAgo * 3600 * 1000);
    return formatIST(d);
  };

  return [
    {
      id: 'pass_0h',
      label: 'Latest (Current Observation)',
      timeAgo: 'Latest (Updated in Real-Time)',
      timestamp: formatOffset(0),
      satellite: 'Zoom Earth Live Composite (Himawari + Meteosat-IODC)',
      sensorBand: 'GeoColor Real-Time Natural True Color & Infrared',
      cycloneEye: '16.8°N, 88.5°E (Bay of Bengal)',
      cyclone_lat: 16.8,
      cyclone_lon: 88.5,
      category: 'Dissipated Remnant Trough (Non-Active)',
      wind_kmh: 28,
      pressure_hpa: 1008,
      eyeDiameter: 'Disorganized / No Eye',
      cloudCoverDiameter: '180 km (Scattered Clouds)',
      imageSrc: '/assets/normal_synoptic_india.jpg',
      status: 'Real-time Zoom Earth observation: System ARNAB has completely dissipated into a non-active remnant trough. No cyclonic vortex or coastal threat active.'
    },
    {
      id: 'pass_3h',
      label: '3 Hours Ago (T - 3h Pass)',
      timeAgo: '3 Hours Ago Observation',
      timestamp: formatOffset(3),
      satellite: 'Zoom Earth Live Composite (Himawari + Meteosat-IODC)',
      sensorBand: 'GeoColor Real-Time Natural True Color & Infrared',
      cycloneEye: '16.5°N, 88.7°E (Central Bay)',
      cyclone_lat: 16.5,
      cyclone_lon: 88.7,
      category: 'Weakening Remnant Low',
      wind_kmh: 34,
      pressure_hpa: 1006,
      eyeDiameter: 'Disorganized',
      cloudCoverDiameter: '240 km',
      imageSrc: '/assets/normal_synoptic_india.jpg',
      status: 'Zoom Earth snapshot 3 hours ago: Convective rainbands collapsed; central circulation open and decaying.'
    },
    {
      id: 'pass_6h',
      label: '6 Hours Ago (T - 6h Baseline)',
      timeAgo: '6 Hours Ago Observation',
      timestamp: formatOffset(6),
      satellite: 'Zoom Earth Live Composite (Himawari + Meteosat-IODC)',
      sensorBand: 'GeoColor Real-Time Natural True Color & Infrared',
      cycloneEye: '16.0°N, 89.0°E (Central Bay of Bengal)',
      cyclone_lat: 16.0,
      cyclone_lon: 89.0,
      category: 'Well-Marked Low Pressure (WMLP)',
      wind_kmh: 42,
      pressure_hpa: 1004,
      eyeDiameter: 'Diffused',
      cloudCoverDiameter: '320 km',
      imageSrc: '/assets/normal_synoptic_india.jpg',
      status: 'Zoom Earth snapshot 6 hours ago: System ARNAB weakening rapidly over open waters; vertical wind shear disrupting core.'
    },
    {
      id: 'pass_12h',
      label: '12 Hours Ago (T - 12h Origin)',
      timeAgo: '12 Hours Ago Night Observation',
      timestamp: formatOffset(12),
      satellite: 'Zoom Earth Live Composite (Himawari + Meteosat-IODC)',
      sensorBand: 'GeoColor Night Infrared & Earth City Lights',
      cycloneEye: '15.2°N, 89.4°E (South-Central Bay)',
      cyclone_lat: 15.2,
      cyclone_lon: 89.4,
      category: 'Depression Remnant',
      wind_kmh: 48,
      pressure_hpa: 1002,
      eyeDiameter: '50 km',
      cloudCoverDiameter: '420 km',
      imageSrc: '/assets/normal_synoptic_india.jpg',
      status: 'Zoom Earth nighttime snapshot 12 hours ago: Residual shallow convection decaying over open sea.'
    }
  ];
};

export const getDynamicTimelineSteps = () => {
  const now = new Date();
  const formatOffset = (hoursOffset) => {
    const d = new Date(now.getTime() + hoursOffset * 3600 * 1000);
    return formatIST(d);
  };

  return [
    {
      hour: 0,
      label: 'Now (Current Observation)',
      timestamp: formatOffset(0),
      lat: 16.8,
      lon: 88.5,
      category: 'Dissipated Remnant Trough (Non-Active)',
      central_pressure_hpa: 1008,
      max_wind_kmh: 28,
      gusts_kmh: 36,
      speed_kmh: 8,
      direction: 'Dissipated / Stationary over Central Bay',
      status: 'System ARNAB fully dissipated; calm coastal sea conditions (No threat)',
      storm_surge_m: 0.0,
      radius_km: 60
    },
    {
      hour: 12,
      label: '+12 Hours',
      timestamp: formatOffset(12),
      lat: 17.2,
      lon: 88.2,
      category: 'Residual Low Pressure Area',
      central_pressure_hpa: 1008,
      max_wind_kmh: 25,
      gusts_kmh: 32,
      speed_kmh: 6,
      direction: 'Drifting harmlessly over open water',
      status: 'Residual moisture dispersing; gentle maritime breezes',
      storm_surge_m: 0.0,
      radius_km: 50
    },
    {
      hour: 24,
      label: '+24 Hours',
      timestamp: formatOffset(24),
      lat: 17.6,
      lon: 88.0,
      category: 'Completely Disorganized Remnants',
      central_pressure_hpa: 1009,
      max_wind_kmh: 22,
      gusts_kmh: 30,
      speed_kmh: 5,
      direction: 'Diffusing across Bay of Bengal',
      status: 'All clear across coastal belts; normal shipping and fishing operations',
      storm_surge_m: 0.0,
      radius_km: 40
    },
    {
      hour: 48,
      label: '+48 Hours',
      timestamp: formatOffset(48),
      lat: 18.0,
      lon: 87.8,
      category: 'Clear Maritime Atmosphere',
      central_pressure_hpa: 1010,
      max_wind_kmh: 20,
      gusts_kmh: 26,
      speed_kmh: 4,
      direction: 'Dissipated',
      status: 'Zero cyclonic presence; standard fair-weather coastal conditions',
      storm_surge_m: 0.0,
      radius_km: 0
    },
    {
      hour: 72,
      label: '+72 Hours',
      timestamp: formatOffset(72),
      lat: 18.5,
      lon: 87.5,
      category: 'Fair Weather Conditions',
      central_pressure_hpa: 1010,
      max_wind_kmh: 18,
      gusts_kmh: 24,
      speed_kmh: 0,
      direction: 'Nil',
      status: 'Seasonal normal weather prevailing across national maritime territory',
      storm_surge_m: 0.0,
      radius_km: 0
    }
  ];
};

// Note: DEFAULT_MULTI_HAZARDS, getActiveMultiHazards, and MHSI_ACTIVE_THRESHOLD are imported from ../../utils/hazardData

// Clean Static Map Pin Helper
const createCustomPin = (color, label = '') => {
  const html = `
    <div style="
      width: 26px;
      height: 26px;
      background: ${color};
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
    </div>
  `;
  return L.divIcon({
    className: 'custom-static-pin',
    html,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

// Map Linker: Smoothly moves Leaflet map center when disaster or time slot changes
function MapFocusCenter({ center, zoom = 6 }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 0.7 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function CyclonePredictor({ refreshTrigger }) {
  const { lang, toggleLang, tr, t, translateCategory, translateSeverity } = useLanguage();
  const [forecastData, setForecastData] = useState(() => generateDynamicCycloneForecast());
  const [disasterMode, setDisasterMode] = useState('active'); // 'active' (Level-3 Disaster) vs 'normal' (Routine Surveillance)
  const [selectedHazardId, setSelectedHazardId] = useState('landslide'); // Defaults to first threat (Rank #1) so it opens immediately on load
  const [selectedPassId, setSelectedPassId] = useState('pass_0h'); // 'pass_0h', 'pass_3h', 'pass_6h', 'pass_12h'
  const [selectedHour, setSelectedHour] = useState(24); // Forecast timeline step
  const [timelineSubMode, setTimelineSubMode] = useState('forecast_track'); // 'forecast_track' vs 'satellite_passes'
  const [activeCoords, setActiveCoords] = useState([11.55, 76.15]); // Wayanad coords for top hazard
  const [displayMode, setDisplayMode] = useState('split'); // 'split', 'satellite_only', 'map_only'

  const [loading, setLoading] = useState(false);
  const [highResModalOpen, setHighResModalOpen] = useState(false);
  const [xaiModalOpen, setXaiModalOpen] = useState(false);
  const [xaiLang, setXaiLang] = useState('en');
  const [disasterReportModalOpen, setDisasterReportModalOpen] = useState(false);
  const [activeReportHazard, setActiveReportHazard] = useState(null);
  const [reportLang, setReportLang] = useState(lang);

  useEffect(() => {
    setReportLang(lang);
  }, [lang]);

  const sliderRef = useRef(null);

  const fetchForecast = async () => {
    try {
      const data = await api.getCycloneForecast();
      if (data) setForecastData(data);
    } catch (err) {
      console.error('Failed to load forecast', err);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [refreshTrigger]);

  const rawHazards = (forecastData?.multi_hazards || DEFAULT_MULTI_HAZARDS).map(h => {
    const defaultData = DEFAULT_MULTI_HAZARDS.find(d => d.id === h.id) || {};
    return {
      ...defaultData,
      ...h,
      plain_report: {
        ...(defaultData.plain_report || {}),
        ...(h.plain_report || {})
      },
      hotspots: (h.hotspots && h.hotspots.length > 0) ? h.hotspots : (defaultData.hotspots || [])
    };
  });
  // Apply statutory NDMA/IMD standard: threats with MHSI < 20.0 or INACTIVE are de-listed from active surveillance
  const multiHazards = getActiveMultiHazards(rawHazards);
  const archivedHazards = getArchivedDeescalatedHazards(rawHazards);
  const currentHazard = (selectedHazardId && multiHazards.find(h => h.id === selectedHazardId)) || multiHazards[0];
  const observationPasses = (forecastData?.zoom_earth_observation_passes && forecastData.zoom_earth_observation_passes.length > 0) ? forecastData.zoom_earth_observation_passes : getDynamicZoomEarthPasses();
  const activePass = observationPasses.find(p => p.id === selectedPassId) || observationPasses[0];

  const steps = (forecastData?.timeline_steps && forecastData.timeline_steps.length > 0) ? forecastData.timeline_steps : getDynamicTimelineSteps();
  const currentStep = steps.find(s => s.hour === selectedHour) || steps[0] || {};
  const trajectoryCoords = steps.map(s => [s.lat, s.lon]);

  const getHazardDisplayName = (h, forceHi = null) => {
    if (!h) return '';
    const isHindi = forceHi !== null ? forceHi : (lang === 'hi');
    if (h.id === 'cyclone') return isHindi ? "प्रणाली 'अर्नब' (शांत / कम खतरा - सामान्य स्थिति)" : "System 'ARNAB' (Dissipated / Low Threat - All Clear)";
    if (h.id === 'landslide') return isHindi ? 'वायनाड मेप्पाडी भूस्खलन एवं मलबा प्रवाह' : 'Wayanad Meppadi Debris Flow & Landslide';
    if (h.id === 'volcano') return isHindi ? 'बैरन द्वीप ज्वालामुखी सक्रिय थर्मल विस्फोट' : 'Barren Island Volcano Active Thermal Eruption';
    if (h.id === 'flood') return isHindi ? 'असम ब्रह्मपुत्र नदी घाटी जल विज्ञान निगरानी' : 'Assam Brahmaputra River Basin Monitored Hydrology';
    return isHindi ? (h.name_hi || h.name) : h.name;
  };

  const getHazardRegionName = (h, forceHi = null) => {
    if (!h) return '';
    const isHindi = forceHi !== null ? forceHi : (lang === 'hi');
    if (h.id === 'cyclone') return isHindi ? 'मध्य बंगाल की खाड़ी (खुला समुद्री क्षेत्र)' : 'Central Bay of Bengal (Open Maritime Sea)';
    if (h.id === 'landslide') return isHindi ? 'पश्चिमी घाट ढलान, केरल (चूरलमाला - मेप्पाडी)' : 'Western Ghats Escarpment, Kerala (Chooralmala - Meppadi)';
    if (h.id === 'volcano') return isHindi ? 'अंडमान सागर (पोर्ट ब्लेयर से 138 किमी पूर्व)' : 'Andaman Sea Maritime Corridor (Indian EEZ)';
    if (h.id === 'flood') return isHindi ? 'ऊपरी असम (काजीरंगा - माजुली सेक्टर)' : 'Kaziranga / Majuli Island Riparian Corridor';
    return isHindi ? (h.region_hi || h.region) : h.region;
  };

  const getHazardMetricLabel = (h, forceHi = null) => {
    if (!h) return '';
    const isHindi = forceHi !== null ? forceHi : (lang === 'hi');
    if (h.id === 'cyclone') return isHindi ? '28 किमी/घंटा सामान्य हवा' : '28 km/h Normal Breeze';
    if (h.id === 'landslide') return isHindi ? '91.4% मृदा जल-संतृप्ति' : '91.4% Soil Saturation';
    if (h.id === 'volcano') return isHindi ? '142 मेगावाट विकिरण ऊर्जा' : '142 MW Radiative Power';
    if (h.id === 'flood') return isHindi ? '18,200 घन मी/सेकंड निर्वहन' : '18,200 m³/s Discharge';
    return isHindi ? (h.primary_metric_hi || h.primary_metric) : h.primary_metric;
  };

  const getHazardSecondaryMetricLabel = (h, forceHi = null) => {
    if (!h) return '';
    const isHindi = forceHi !== null ? forceHi : (lang === 'hi');
    if (h.id === 'cyclone') return isHindi ? '1008 hPa सामान्य वायुदाब' : '1008 hPa Standard Pressure';
    if (h.id === 'landslide') return isHindi ? '312 मिमी / 48 घंटे वर्षा' : '312 mm / 48h Rain';
    if (h.id === 'volcano') return isHindi ? '3.8 DU SO₂ गैस फैलाव' : '3.8 DU SO₂ Plume';
    if (h.id === 'flood') return isHindi ? 'खतरे के निशान से 0.8 मी. नीचे' : '0.8m Below Danger Level';
    return isHindi ? (h.secondary_metric_hi || h.secondary_metric) : h.secondary_metric;
  };

  const getHazardConfidenceLabel = (h, forceHi = null) => {
    if (!h) return '';
    const isHindi = forceHi !== null ? forceHi : (lang === 'hi');
    if (h.id === 'cyclone') return isHindi ? '99% इनसैट-3डीआर रडार' : '99% INSAT-3DR Radar';
    if (h.id === 'landslide') return isHindi ? '98% सेंटिनल उपग्रह रडार' : '98% Sentinel-1 SAR Multi-Sat';
    if (h.id === 'volcano') return isHindi ? '99% सेंटिनल-2 SWIR' : '99% Sentinel-2 SWIR';
    if (h.id === 'flood') return isHindi ? '96% CWC टेलीमेट्री ग्रिड' : '96% CWC Telemetry Grid';
    return isHindi ? '96% उपग्रह सत्यापित' : '96% Multi-Sat Verified';
  };

  const getHazardStatusLabel = (h) => {
    if (!h) return '';
    if (h.id === 'cyclone') return tr('INACTIVE MONITORING', 'निष्क्रिय निगरानी');
    if (h.status_code === 'LANDFALL_IMMINENT') return tr('LANDFALL IMMINENT', 'तट प्रवेश आसन्न');
    if (h.status_code === 'HIGH_SATURATION') return tr('HIGH SATURATION', 'अत्यधिक संतृप्ति');
    if (h.status_code === 'CONTINUOUS_VENTING') return tr('CONTINUOUS VENTING', 'निरंतर गैस उत्सर्जन');
    if (h.status_code === 'BELOW_DANGER_MARK') return tr('BELOW DANGER MARK', 'खतरे के निशान से नीचे');
    return h.status_code?.replace('_', ' ');
  };

  // Stepped color gradient: Rank 1 is darkest/boldest, Rank 2 is slightly lighter, Rank 3 is even lighter
  const getCardStyle = (hazard, isSelected) => {
    const rank = hazard.severity_rank || 1;
    if (isSelected) {
      if (rank === 1) return 'bg-[#78350f] text-white border-[#451a03] shadow-md ring-2 ring-red-500/50 -translate-y-0.5';
      if (rank === 2) return 'bg-[#9a3412] text-white border-[#7c2d12] shadow-md ring-2 ring-amber-500/50 -translate-y-0.5';
      if (rank === 3) return 'bg-[#b45309] text-white border-[#78350f] shadow-md ring-2 ring-yellow-500/50 -translate-y-0.5';
      return 'bg-[#d97706] text-white border-[#b45309] shadow-md ring-2 ring-yellow-400/50 -translate-y-0.5';
    }
    // Unselected cards with clear stepped lighter shades
    if (rank === 1) return 'bg-rose-50/90 hover:bg-rose-100 text-stone-900 border-red-300 shadow-xs hover:border-red-400';
    if (rank === 2) return 'bg-amber-50/80 hover:bg-amber-100 text-stone-900 border-amber-300 shadow-xs hover:border-amber-400';
    if (rank === 3) return 'bg-yellow-50/50 hover:bg-yellow-100/70 text-stone-900 border-yellow-200 shadow-xs hover:border-yellow-300';
    return 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 shadow-xs';
  };

  const getRankBadgeStyle = (hazard, isSelected) => {
    const rank = hazard.severity_rank || 1;
    if (isSelected) {
      if (rank === 1) return 'bg-red-600 text-white font-black';
      if (rank === 2) return 'bg-orange-500 text-white font-black';
      if (rank === 3) return 'bg-amber-500 text-white font-black';
      return 'bg-yellow-500 text-white font-black';
    }
    if (rank === 1) return 'bg-red-100 text-red-900 border border-red-300 font-bold';
    if (rank === 2) return 'bg-orange-100 text-orange-900 border border-orange-300 font-bold';
    if (rank === 3) return 'bg-amber-100 text-amber-900 border border-amber-200 font-bold';
    return 'bg-stone-100 text-stone-600 border border-stone-200';
  };

  const getMhsiScoreStyle = (hazard, isSelected) => {
    const rank = hazard.severity_rank || 1;
    if (isSelected) return 'text-white bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]';
    if (rank === 1) return 'text-red-700 bg-white px-1.5 py-0.5 rounded border border-red-200 font-mono font-bold text-[10px]';
    if (rank === 2) return 'text-orange-700 bg-white px-1.5 py-0.5 rounded border border-orange-200 font-mono font-bold text-[10px]';
    if (rank === 3) return 'text-amber-700 bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono font-bold text-[10px]';
    return 'text-stone-600 bg-white px-1.5 py-0.5 rounded border border-stone-200 font-mono font-bold text-[10px]';
  };

  const getMetricLabelStyle = (hazard, isSelected) => {
    const rank = hazard.severity_rank || 1;
    if (isSelected) return 'text-amber-200 font-bold';
    if (rank === 1) return 'text-red-800 font-bold';
    if (rank === 2) return 'text-orange-800 font-bold';
    if (rank === 3) return 'text-amber-800 font-bold';
    return 'text-stone-700 font-bold';
  };

  const getPassLabel = (p) => {
    if (!p) return '';
    if (p.id === 'pass_0h') return tr('Latest (Current Observation)', 'नवीनतम (वर्तमान अवलोकन)');
    if (p.id === 'pass_3h') return tr('3 Hours Ago (T - 3h Pass)', '3 घंटे पूर्व (T - 3h पास)');
    if (p.id === 'pass_6h') return tr('6 Hours Ago (T - 6h Baseline)', '6 घंटे पूर्व (T - 6h बेसलाइन)');
    if (p.id === 'pass_12h') return tr('12 Hours Ago (T - 12h Origin)', '12 घंटे पूर्व (T - 12h उद्गम)');
    return p.label;
  };

  const getPassStatusDesc = (p) => {
    if (!p) return '';
    if (p.id === 'pass_0h') return tr("Real-time Zoom Earth observation: System 'ARNAB' completely dissipated into remnant low-pressure trough. Calm conditions across Bay of Bengal with scattered fair-weather clouds.", "रियल-टाइम ज़ूम अर्थ अवलोकन: प्रणाली 'अर्नब' निम्न-दबाव गर्त में विलीन होकर शांत हो चुकी है। बंगाल की खाड़ी में सामान्य स्थिति एवं छिटपुट बादल।");
    if (p.id === 'pass_3h') return tr("Zoom Earth snapshot 3 hours ago: Cloud canopy disorganized; no cyclonic vortex or gale circulation over Indian waters.", "3 घंटे पूर्व ज़ूम अर्थ स्नैपशॉट: बादलों का आवरण बिखरा हुआ; भारतीय जलक्षेत्र में कोई चक्रवाती भंवर नहीं।");
    if (p.id === 'pass_6h') return tr("Zoom Earth snapshot 6 hours ago: Remnant low pressure area decaying into general seasonal maritime airflow.", "6 घंटे पूर्व ज़ूम अर्थ स्नैपशॉट: अवशेष निम्न दबाव क्षेत्र सामान्य मौसमी हवाओं में विलीन हो रहा है।");
    if (p.id === 'pass_12h') return tr("Zoom Earth nighttime snapshot 12 hours ago: Peninsular city lights visible with nocturnal thermal IR cloud mass.", "12 घंटे पूर्व ज़ूम अर्थ रात्रि स्नैपशॉट: प्रायद्वीपीय शहर की बत्तियां रात्रि थर्मल आईआर मेघ पुंज के साथ दिखाई दे रही हैं।");
    return p.status;
  };

  // Handle slide selection
  const handleSelectHazard = (hazard) => {
    setSelectedHazardId(hazard.id);
    setActiveCoords(hazard.center);
    if (hazard.id === 'cyclone') {
      setSelectedPassId('pass_0h');
    }
  };

  // Scroll Slide Tray Left / Right
  const scrollSlideTray = (direction) => {
    if (sliderRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Interactively link time pass selection for cyclone
  const handleSelectObservationPass = (pass) => {
    setSelectedPassId(pass.id);
    setActiveCoords([pass.cyclone_lat, pass.cyclone_lon]);
  };

  // Interactively link forecast timeline
  const handleSelectForecastTimeline = (step) => {
    setSelectedHour(step.hour);
    setActiveCoords([step.lat, step.lon]);
    if (step.hour <= 0) {
      setSelectedPassId('pass_0h');
    }
  };

  // Cyclone Projected Cone
  const conePolygon = [
    [16.8, 88.5],
    [18.0, 89.6],
    [21.2, 88.8],
    [22.8, 86.8],
    [23.8, 84.5],
    [22.0, 84.8],
    [20.0, 85.6],
    [18.0, 86.6],
    [16.8, 88.5]
  ];

  // Normal routine major city radar stations
  const normalStations = [
    { name: 'New Delhi Radar Hub', lat: 28.61, lon: 77.20, status: 'Clear Sky • Temp 29°C' },
    { name: 'Mumbai Colaba Radar', lat: 18.90, lon: 72.81, status: 'Benign Coastal Flow • 31°C' },
    { name: 'Kolkata Doppler Radar', lat: 22.57, lon: 88.36, status: 'Normal Synoptic • 30°C' },
    { name: 'Chennai Meenambakkam', lat: 13.08, lon: 80.27, status: 'Calm Sea State • 32°C' },
    { name: 'Bengaluru Met Station', lat: 12.97, lon: 77.59, status: 'Clear Conditions • 24°C' },
    { name: 'Guwahati Radar', lat: 26.14, lon: 91.73, status: 'Basin Runoff Normal • 27°C' }
  ];

  if (loading && !forecastData) {
    return (
      <div className="p-16 text-center text-stone-600 bg-[#fbf8f1] rounded-2xl border border-[#ded3bf] space-y-3">
        <Wind className="w-10 h-10 text-cyan-700 animate-spin mx-auto" />
        <h3 className="text-sm font-bold text-stone-900">Retrieving Real-Time Earth Observation Data...</h3>
        <p className="text-xs text-stone-500">Auto-evaluating Multi-Hazard Severity Index (MHSI) and syncing satellite feeds.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12 font-sans text-stone-800">


      {/* TOP COMMAND HEADER WITH SIMULATION TOGGLE & REFRESH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#fbf8f1] p-4 rounded-2xl border border-[#ded3bf] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {disasterMode === 'active' ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>{tr('Active National Disaster Detected • Auto-Triaged', 'सक्रिय राष्ट्रीय आपदा पहचानी गई • AI द्वारा प्राथमिकता तय')}</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>{tr('All Sectors Clear • Routine Synoptic Surveillance', 'सभी क्षेत्र सामान्य • नियमित निगरानी जारी')}</span>
              </span>
            )}
            <span className="text-[10px] text-stone-600 font-mono bg-[#ede4d4] px-2 py-0.5 rounded border border-[#ded3bf]">
              MHSI Multi-Hazard Engine
            </span>
            {disasterMode === 'active' && (
              <button
                onClick={() => setXaiModalOpen(true)}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-400 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                title="Inspect mathematical breakdown & formula weights behind this AI threat score"
              >
                <Brain className="w-3 h-3 text-amber-900" />
                <span>{tr('Explain Threat Score (XAI)', 'खतरा सूचकांक विश्लेषण (XAI)')}</span>
              </button>
            )}
          </div>

          <h2 className="text-lg font-black text-stone-900 tracking-tight">
            {disasterMode === 'active' ? (
              <span>{tr('National Crisis Command:', 'राष्ट्रीय संकट कमान केंद्र:')} <span className="text-red-700">{currentHazard.name}</span></span>
            ) : (
              <span>{tr('National Synoptic Surveillance:', 'राष्ट्रीय नियमित निगरानी:')} <span className="text-emerald-800">{tr('Routine Normal Conditions', 'सामान्य मौसमी स्थितियां')}</span></span>
            )}
          </h2>
          <p className="text-xs text-stone-600">
            {disasterMode === 'active' ? (
              <span>{tr('Autonomous AI triaging has surfaced the highest priority threat on the face. Slide below to inspect other concurrent crisis vectors.', 'स्वायत्त AI विश्लेषण ने सर्वोच्च प्राथमिकता वाले खतरे को प्रदर्शित किया है। अन्य समवर्ती आपदाओं की जांच के लिए नीचे स्लाइड करें।')}</span>
            ) : (
              <span>{tr('Continuous multi-source surveillance active across all 36 States & UTs. Zero Level-3 emergency thresholds breached across India.', 'सभी 36 राज्यों एवं केंद्रशासित प्रदेशों में निरंतर बहु-स्रोत निगरानी सक्रिय है। भारत भर में शून्य स्तर-3 आपात स्थिति।')}</span>
            )}
          </p>
        </div>

        {/* Action Controls: Live Status & Atmospheric Scan */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0 flex-wrap">
          {/* Real-time Status Badge */}
          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs ${
            currentHazard?.status === 'HIGH_ALERT'
              ? 'bg-red-100 border border-red-300 text-red-900'
              : currentHazard?.status === 'MONITORED_ADVISORY'
              ? 'bg-amber-100 border border-amber-300 text-amber-900'
              : 'bg-emerald-100 border border-emerald-300 text-emerald-900'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              currentHazard?.status === 'HIGH_ALERT' ? 'bg-red-600 animate-ping' : currentHazard?.status === 'MONITORED_ADVISORY' ? 'bg-amber-600' : 'bg-emerald-600'
            }`}></span>
            <span>{tr(`Live Surveillance: ${getHazardDisplayName(currentHazard)} (${getHazardStatusLabel(currentHazard?.status)})`, `लाइव निगरानी: ${getHazardDisplayName(currentHazard)}`)}</span>
          </div>

          {/* Quick Disaster Briefing Button */}
          <button
            onClick={() => {
              setActiveReportHazard(currentHazard);
              setDisasterReportModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-stone-800 border border-stone-300 flex items-center gap-1.5 shadow-xs macos-tap cursor-pointer"
            title="Read Complete Clean Disaster Report"
          >
            <FileText className="w-3.5 h-3.5 text-red-600" />
            <span>{tr('Disaster Briefing', 'आपदा ब्रीफिंग')}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE A: ACTIVE DISASTER MODE ("Show on Face + Slide for Other Disasters") */}
      {/* ========================================================================= */}
      {disasterMode === 'active' && (
        <>
          {/* MULTI-HAZARD SLIDE TRAY ("there exist a slide in it other main critical disaster") */}
          <div className="bg-[#ede4d4] p-3.5 rounded-2xl border border-[#ded3bf] space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
                <span>{t('slideTrayLabel')}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollSlideTray('left')}
                  className="p-1 rounded-lg bg-white/80 hover:bg-white text-stone-700 shadow-xs border border-stone-300"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => scrollSlideTray('right')}
                  className="p-1 rounded-lg bg-white/80 hover:bg-white text-stone-700 shadow-xs border border-stone-300"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Slider */}
            <div
              ref={sliderRef}
              className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-stone-400 scrollbar-track-stone-200"
            >
              {multiHazards.map((hazard) => {
                const isSelected = hazard.id === selectedHazardId;
                const isTopRank = hazard.severity_rank === 1;

                return (
                  <button
                    key={hazard.id}
                    onClick={() => {
                      if (hazard.id === selectedHazardId) {
                        setActiveReportHazard(hazard);
                        setDisasterReportModalOpen(true);
                      } else {
                        handleSelectHazard(hazard);
                      }
                    }}
                    className={`shrink-0 w-76 text-left p-3.5 rounded-xl border transition-all snap-start hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${getCardStyle(hazard, isSelected)}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full ${getRankBadgeStyle(hazard, isSelected)}`}>
                        {isTopRank ? tr('★ Rank #1 (Primary Face)', '★ रैंक #1 (प्राथमिक आपदा)') : `${tr('Rank', 'रैंक')} #${hazard.severity_rank}`}
                      </span>
                      <span className={getMhsiScoreStyle(hazard, isSelected)}>
                        MHSI {hazard.mhsi_score}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hazard.id === 'cyclone' && <Wind className={`w-4 h-4 ${isSelected ? 'text-cyan-300' : 'text-cyan-600'}`} />}
                      {hazard.id === 'landslide' && <Mountain className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`} />}
                      {hazard.id === 'volcano' && <Flame className={`w-4 h-4 ${isSelected ? 'text-orange-300' : 'text-orange-600'}`} />}
                      {hazard.id === 'flood' && <Waves className={`w-4 h-4 ${isSelected ? 'text-blue-300' : 'text-blue-600'}`} />}
                      <h4 className="text-xs font-black truncate">{getHazardDisplayName(hazard)}</h4>
                    </div>

                    <p className={`text-[10px] mt-1 truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {getHazardRegionName(hazard)}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/40 flex items-center justify-between text-[10px]">
                      <span className={getMetricLabelStyle(hazard, isSelected)}>
                        {getHazardMetricLabel(hazard)}
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReportHazard(hazard);
                          setDisasterReportModalOpen(true);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all macos-tap cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-stone-900 hover:bg-amber-300 shadow-xs'
                            : 'bg-stone-200/90 text-stone-700 hover:bg-stone-300'
                        }`}
                        title={tr('View Clear Plain Language Report', 'आपदा की आसान स्पष्ट रिपोर्ट देखें')}
                      >
                        <FileText className="w-3 h-3" />
                        <span>{tr('Read Report', 'रिपोर्ट पढ़ें')}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {archivedHazards.length > 0 && (
              <div className="flex items-center justify-between text-[11px] text-stone-600 bg-white/70 px-3 py-1.5 rounded-xl border border-[#ded3bf] flex-wrap gap-2">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>{tr('Standard De-listing Protocol Active (MHSI < 20.0 Threshold):', 'मानक डी-लिस्टिंग प्रोटोकॉल सक्रिय (MHSI < 20.0 सीमा):')}</span>
                </span>
                <span className="text-stone-600 text-[10px]">
                  {archivedHazards.map(h => `${h.name} [MHSI ${h.mhsi_score}]`).join(', ')} — {tr('De-escalated & de-listed from active surveillance deck.', 'शांत होकर सक्रिय निगरानी से स्वतः हटाया गया।')}
                </span>
              </div>
            )}
          </div>

          {/* Active Threat Profile Summary Strip with Report & XAI Buttons */}
          <div className="flex items-center justify-between bg-[#ede4d4]/80 px-3.5 py-2.5 rounded-xl border border-[#ded3bf] flex-wrap gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`w-2.5 h-2.5 rounded-full ${currentHazard.badge_color || 'bg-red-600'}`}></span>
              <span className="text-xs font-bold text-stone-900">
                {tr('Active Threat Focus:', 'सक्रिय आपदा केंद्र:')} <span className="underline decoration-amber-600 underline-offset-2">{getHazardDisplayName(currentHazard)}</span>
              </span>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-stone-300 font-bold text-stone-700">
                {tr('MHSI Threat Index:', 'MHSI आपदा सूचकांक:')} {currentHazard.mhsi_score} / 100
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* CLEAR DISASTER REPORT BUTTON (The money button!) */}
              <button
                onClick={() => {
                  setActiveReportHazard(currentHazard);
                  setDisasterReportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-sm transition-all macos-tap cursor-pointer"
                title={tr('View a crystal-clear, plain language disaster report anyone can understand', 'सरल शब्दों में आपदा की संपूर्ण स्पष्ट रिपोर्ट देखें')}
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>{tr('Read Clean Disaster Report', 'आपदा की आसान रिपोर्ट पढ़ें')}</span>
              </button>

              {/* XAI Threat Attribution Button */}
              <button
                onClick={() => setXaiModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-amber-100 shadow-sm transition-all macos-tap cursor-pointer"
                title={tr('Inspect mathematical breakdown and satellite attribution for this score', 'इस स्कोर के गणितीय विभाजन और उपग्रह साक्ष्य का निरीक्षण करें')}
              >
                <Brain className="w-3.5 h-3.5 text-amber-300" />
                <span>{tr('Explain AI Score (XAI)', 'AI स्कोर विश्लेषण (XAI)')}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC METRIC KPI BAR FOR SELECTED DISASTER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedHazardId === 'cyclone' && (
              <>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase font-black text-stone-600 block">
                    {lang === 'hi' ? 'निरंतर हवा की गति' : 'Sustained Wind Speed'}
                  </span>
                  <span className="text-xl font-black text-emerald-700 font-mono">{activePass.wind_kmh} km/h</span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    {lang === 'hi' ? 'शांत तटीय हवा (सामान्य)' : 'Gentle Coastal Breeze (Normal)'}
                  </span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase font-black text-stone-600 block">
                    {lang === 'hi' ? 'केंद्रीय वायुमंडलीय दबाव' : 'Central Pressure'}
                  </span>
                  <span className="text-xl font-black text-stone-900 font-mono">{activePass.pressure_hpa} hPa</span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    {lang === 'hi' ? 'मानक बैरोमीटर आधार (सामान्य)' : 'Standard Barometric Baseline'}
                  </span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase font-black text-stone-600 block">
                    {lang === 'hi' ? 'तूफानी लहर की ऊंचाई' : 'Storm Surge Height'}
                  </span>
                  <span className="text-xl font-black text-stone-800 font-mono">0.0 m</span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    {lang === 'hi' ? 'सामान्य ज्वार सीमा (सुरक्षित)' : 'Normal Tidal Range (Safe)'}
                  </span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase font-black text-stone-600 block">
                    {lang === 'hi' ? 'अनुमानित तट प्रवेश' : 'Projected Landfall'}
                  </span>
                  <span className="text-xl font-black text-emerald-800 font-mono">{lang === 'hi' ? 'कोई खतरा नहीं' : 'No Threat'}</span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    {lang === 'hi' ? 'खुले समुद्र में विलीन' : 'Dissipated over Open Sea'}
                  </span>
                </div>
              </>
            )}

            {selectedHazardId === 'landslide' && (
              <>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Hydraulic Soil Saturation', 'हाइड्रोलिक मृदा संतृप्ति')}</span>
                  <span className="text-lg font-black text-red-700">91.4%</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Critical threshold (>85%)', 'गंभीर सीमा (>85%)')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('48h Rain Accumulation', '48 घंटे वर्षा संचय')}</span>
                  <span className="text-lg font-black text-stone-900">312 mm</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Antecedent Precipitation Index', 'पूर्ववर्ती वर्षा सूचकांक')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Slope Failure Probability', 'ढलान विफलता संभावना')}</span>
                  <span className="text-lg font-black text-amber-700">84.2%</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Slopes >30° in Wayanad', 'वायनाड में >30° ढलान')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Vulnerable Habitations', 'संवेदनशील बस्तियां')}</span>
                  <span className="text-lg font-black text-emerald-800">4 {tr('Mountain Sectors', 'पर्वतीय क्षेत्र')}</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Chooralmala & Meppadi', 'चूरलमाला एवं मेप्पाडी')}</span>
                </div>
              </>
            )}

            {selectedHazardId === 'volcano' && (
              <>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Thermal Radiative Power', 'थर्मल विकिरण शक्ति')}</span>
                  <span className="text-lg font-black text-orange-700">142 MW</span>
                  <span className="text-[10px] text-stone-500 block">{tr('SWIR 2.2μm Sensor Band', 'SWIR 2.2μm सेंसर बैंड')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('SO₂ Plume Dispersion', 'SO₂ गैस फैलाव')}</span>
                  <span className="text-lg font-black text-stone-900">3.8 DU</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Sentinel-5P TROPOMI', 'सेंटिनल-5P ट्रोपोमी')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Maritime Exclusion Buffer', 'समुद्री निषेध क्षेत्र')}</span>
                  <span className="text-lg font-black text-amber-700">45 km {tr('Radius', 'त्रिज्या')}</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Coast Guard Notice', 'तटरक्षक सूचना')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Caldera Core Temp', 'काल्डेरा कोर तापमान')}</span>
                  <span className="text-lg font-black text-red-700">1100°C</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Continuous Strombolian Venting', 'निरंतर स्ट्रोमबोलियन उत्सर्जन')}</span>
                </div>
              </>
            )}

            {selectedHazardId === 'flood' && (
              <>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('River Gauge Margin', 'नदी गेज मार्जिन')}</span>
                  <span className="text-lg font-black text-emerald-700">-0.8 m</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Below CWC Danger Mark', 'सीडब्ल्यूसी खतरे के निशान से नीचे')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Upstream Discharge', 'अपस्ट्रीम जल निर्वहन')}</span>
                  <span className="text-lg font-black text-stone-900">18,200 m³/s</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Brahmaputra at Nematighat', 'नेमातीघाट पर ब्रह्मपुत्र')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Monitored Lowlands', 'निगरानी तराई क्षेत्र')}</span>
                  <span className="text-lg font-black text-blue-700">{tr('Kaziranga & Majuli', 'काजीरंगा एवं माजुली')}</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Sentinel-1 SAR Extent', 'सेंटिनल-1 सार सीमा')}</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Flood Shelters Active', 'सक्रिय बाढ़ आश्रय')}</span>
                  <span className="text-lg font-black text-cyan-800">82 {tr('Ready', 'तैयार')}</span>
                  <span className="text-[10px] text-stone-500 block">{tr('Assam Disaster Authority', 'असम आपदा प्राधिकरण')}</span>
                </div>
              </>
            )}
          </div>

          {/* CYCLONE TEMPORAL ANALYSIS DECK: 72H NWP SCRUBBER & SATELLITE PASSES */}
          {selectedHazardId === 'cyclone' && (
            <div className="bg-[#ede4d4] p-3.5 rounded-2xl border border-[#ded3bf] space-y-3 shadow-xs">
              {/* Header: Mode Switcher & IST Clock Capsule */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ded3bf] pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-800" />
                    <span>{tr('CYCLONE TEMPORAL ANALYSIS DECK:', 'चक्रवात कालिक विश्लेषण डेक:')}</span>
                  </span>
                  <div className="inline-flex rounded-lg p-0.5 bg-stone-200/80 border border-stone-300">
                    <button
                      onClick={() => setTimelineSubMode('forecast_track')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        timelineSubMode === 'forecast_track'
                          ? 'bg-amber-800 text-white shadow-xs'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      {tr('⏱️ 72h Forecast Track', '⏱️ 72घं पूर्वानुमान ट्रैक')}
                    </button>
                    <button
                      onClick={() => setTimelineSubMode('satellite_passes')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        timelineSubMode === 'satellite_passes'
                          ? 'bg-amber-800 text-white shadow-xs'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      {tr('🛰️ Zoom Earth Passes', '🛰️ ज़ूम अर्थ पास')}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-stone-700 font-bold bg-white/80 px-2.5 py-0.5 rounded-lg border border-stone-300">
                    {timelineSubMode === 'forecast_track' 
                      ? `${tr('ACTIVE STEP:', 'सक्रिय चरण:')} +${selectedHour}h (${currentStep?.timestamp || 'Live IST'})` 
                      : `${tr('ACTIVE PASS:', 'सक्रिय पास:')} ${formatPassTimeToIST(activePass.timestamp)}`}
                  </span>
                </div>
              </div>

              {/* SUB-VIEW A: 72-HOUR NWP PREDICTIVE TIMELINE TRACK */}
              {timelineSubMode === 'forecast_track' && (
                <div className="space-y-3 pt-1">
                  {/* Connecting Progress Track Container */}
                  <div className="relative px-1">
                    {/* Background Connector Line */}
                    <div className="absolute top-1/2 left-8 right-8 h-1 bg-stone-300/80 -translate-y-1/2 rounded-full hidden md:block z-0" />
                    {/* Animated Filled Progress Bar */}
                    <div
                      className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-amber-600 via-red-600 to-red-700 -translate-y-1/2 rounded-full hidden md:block transition-all duration-300 z-0"
                      style={{
                        width: `calc(${Math.min(100, Math.max(0, (steps.findIndex(s => s.hour === selectedHour) / Math.max(1, steps.length - 1)) * 100))}% * 0.88)`
                      }}
                    />

                    {/* Step Nodes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 relative z-10">
                      {steps.map((step) => {
                        const isSelected = step.hour === selectedHour;
                        return (
                          <button
                            key={step.hour}
                            onClick={() => handleSelectForecastTimeline(step)}
                            className={`p-2.5 rounded-xl text-left border transition-all transform active:scale-95 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-500 scale-[1.02]'
                                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 hover:border-amber-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-black">{step.label}</span>
                              {isSelected && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] font-mono truncate ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                              {step.timestamp}
                            </div>
                            <div className={`text-[9px] font-mono font-bold mt-1.5 flex items-center justify-between border-t pt-1 ${
                              isSelected ? 'border-amber-700/60 text-amber-100' : 'border-stone-100 text-stone-600'
                            }`}>
                              <span>{step.max_wind_kmh} km/h</span>
                              <span>{step.central_pressure_hpa} hPa</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Forecast Step Telemetry Capsule */}
                  <div className="bg-white/90 p-2.5 rounded-xl border border-[#ded3bf] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-900 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-amber-700" />
                        <span>{tr('Projected Position:', 'अनुमानित स्थिति:')}</span>
                        <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-bold border border-amber-300">
                          {currentStep.lat}°N, {currentStep.lon}°E
                        </span>
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-700 font-mono text-[11px]">
                        {tr('Category:', 'श्रेणी:')} <b>{translateCategory(currentStep.category) || currentStep.category}</b>
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-600 text-[11px] font-mono">
                        {tr('Surge:', 'तूफानी लहर:')} <b>{currentStep.storm_surge_m}m</b>
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-600 italic">
                      {currentStep.status}
                    </span>
                  </div>
                </div>
              )}

              {/* SUB-VIEW B: REAL-TIME SATELLITE PASSES TRACK */}
              {timelineSubMode === 'satellite_passes' && (
                <div className="space-y-3 pt-1">
                  <div className="relative px-1">
                    {/* Background Connector Line */}
                    <div className="absolute top-1/2 left-8 right-8 h-1 bg-stone-300/80 -translate-y-1/2 rounded-full hidden md:block z-0" />
                    {/* Animated Filled Progress Bar */}
                    <div
                      className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-amber-600 to-amber-800 -translate-y-1/2 rounded-full hidden md:block transition-all duration-300 z-0"
                      style={{
                        width: `calc(${Math.min(100, Math.max(0, (observationPasses.findIndex(p => p.id === selectedPassId) / Math.max(1, observationPasses.length - 1)) * 100))}% * 0.85)`
                      }}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative z-10">
                      {observationPasses.map((pass) => {
                        const isSelected = pass.id === selectedPassId;
                        return (
                          <button
                            key={pass.id}
                            onClick={() => handleSelectObservationPass(pass)}
                            className={`p-2.5 rounded-xl text-left border transition-all transform active:scale-95 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-500 scale-[1.02]'
                                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 hover:border-amber-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-black truncate">{getPassLabel(pass)}</span>
                              {isSelected && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] font-mono block ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                              {formatPassTimeToIST(pass.timestamp)}
                            </span>
                            <div className={`text-[9px] font-mono font-bold mt-1.5 flex items-center justify-between border-t pt-1 ${
                              isSelected ? 'border-amber-700/60 text-amber-100' : 'border-stone-100 text-stone-600'
                            }`}>
                              <span>{pass.wind_kmh} km/h</span>
                              <span>{pass.pressure_hpa} hPa</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-[#ded3bf] flex items-center justify-between text-xs text-stone-700">
                    <span className="font-medium">
                      <b>{tr('Satellite Platform:', 'उपग्रह प्लेटफॉर्म:')}</b> {activePass.satellite}
                    </span>
                    <span className="text-[11px] font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {activePass.sensorBand}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW SWITCHER: SPLIT, SATELLITE ONLY, MAP ONLY */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#ede4d4] px-4 py-2.5 rounded-xl border border-[#ded3bf] text-xs gap-2">
            <span className="font-bold text-stone-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-800" />
              <span>{tr('Synchronized Presentation View:', 'समकालिक प्रस्तुति दृश्य:')}</span>
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setDisplayMode('split')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  displayMode === 'split'
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                {tr('Satellite & Linked Map (Side-by-Side)', 'उपग्रह एवं मानचित्र (साथ-साथ)')}
              </button>
              <button
                onClick={() => setDisplayMode('satellite_only')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  displayMode === 'satellite_only'
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                {tr('Satellite Picture Only', 'केवल उपग्रह चित्र')}
              </button>
              <button
                onClick={() => setDisplayMode('map_only')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  displayMode === 'map_only'
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                {tr('Track Map Only', 'केवल सामरिक मानचित्र')}
              </button>

            </div>
          </div>

          {/* MAIN DUAL PANEL: SATELLITE PICTURE & LINKED MAP */}
          <div className={`grid gap-5 ${displayMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* PANEL 1: SATELLITE OBSERVATION */}
            {(displayMode === 'split' || displayMode === 'satellite_only') && (
              <div className="bg-[#fbf8f1] border border-[#ded3bf] rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#ded3bf] pb-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-700" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-stone-900">
                      {selectedHazardId === 'cyclone' ? tr('Zoom Earth Live Geocolor Satellite Observation', 'ज़ूम अर्थ लाइव जियोकलर उपग्रह अवलोकन') : currentHazard.satellite_label}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-900 font-bold bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">
                      {selectedHazardId === 'cyclone' ? formatPassTimeToIST(activePass.timestamp) : tr('Real-Time Earth Observation', 'रियल-टाइम पृथ्वी अवलोकन')}
                    </span>
                    <button
                      onClick={() => setHighResModalOpen(true)}
                      className="p-1 rounded bg-[#ede4d4] hover:bg-[#e4d7c0] text-stone-700"
                      title={tr('Expand to Fullscreen', 'पूर्णस्क्रीन में देखें')}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Satellite Photo Container */}
                <div className="relative rounded-xl overflow-hidden border border-[#ded3bf] bg-stone-950 aspect-video group">
                  <img
                    key={selectedHazardId === 'cyclone' ? activePass.imageSrc : currentHazard.satellite_src}
                    src={selectedHazardId === 'cyclone' ? activePass.imageSrc : currentHazard.satellite_src}
                    alt={currentHazard.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                      e.target.src = '/assets/zoom_earth_pass_0h.jpg';
                    }}
                  />

                  {/* Eye Location & Hazard Hotspot Annotation */}
                  <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg border border-stone-700 text-xs space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>{tr('Observation Epicenter:', 'अवलोकन केंद्र:')}</span>
                      <span className="font-mono">
                        {selectedHazardId === 'cyclone'
                          ? `${activePass.cyclone_lat}°N, ${activePass.cyclone_lon}°E`
                          : `${currentHazard.center[0]}°N, ${currentHazard.center[1]}°E`}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-300 font-mono">
                      {selectedHazardId === 'cyclone'
                        ? `${tr('Cloud Canopy:', 'बादल आवरण:')} 720 km • ${tr('Category:', 'श्रेणी:')} ${translateCategory(activePass.category) || activePass.category}`
                        : getHazardRegionName(currentHazard)}
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-stone-900/85 backdrop-blur-sm text-stone-300 px-2 py-1 rounded text-[10px] font-mono border border-stone-700 flex items-center gap-1">
                    <span>{tr('Source:', 'स्रोत:')} {selectedHazardId === 'cyclone' ? 'Zoom Earth / JMA Himawari' : 'ISRO / ESA Sentinel'}</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </div>
                </div>

                {/* Satellite Description */}
                <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                  {selectedHazardId === 'cyclone' ? getPassStatusDesc(activePass) : currentHazard.description}
                </p>
              </div>
            )}

            {/* PANEL 2: LINKED GEOGRAPHIC VECTOR MAP */}
            {(displayMode === 'split' || displayMode === 'map_only') && (
              <div className="bg-[#fbf8f1] border border-[#ded3bf] rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#ded3bf] pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-stone-900">
                      {tr('Linked Geospatial Map', 'संबद्ध भू-स्थानिक मानचित्र')} ({activeCoords[0]}°N, {activeCoords[1]}°E)
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold font-mono">
                    <span className="flex items-center gap-1 text-red-700">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> {tr('Active Epicenter', 'सक्रिय केंद्र')}
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="w-2 h-2 border border-amber-600 bg-amber-200"></span> {tr('Impact Corridor', 'प्रभाव गलियारा')}
                    </span>
                  </div>
                </div>

                {/* Leaflet Map */}
                <div className="rounded-xl overflow-hidden border border-[#ded3bf] aspect-video relative z-0 isolate">
                  <MapContainer
                    center={activeCoords}
                    zoom={selectedHazardId === 'cyclone' ? 5 : (selectedHazardId === 'volcano' ? 8 : 10)}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Smooth Panning on Time / Hazard Switch */}
                    <MapFocusCenter
                      center={activeCoords}
                      zoom={selectedHazardId === 'cyclone' ? 5 : (selectedHazardId === 'volcano' ? 8 : 10)}
                    />

                    {/* CYCLONE SPECIFIC LAYERS */}
                    {selectedHazardId === 'cyclone' && (
                      <>
                        <Polygon
                          positions={conePolygon}
                          pathOptions={{ color: '#d97706', fillColor: '#fef3c7', fillOpacity: 0.35, weight: 1.5, dashArray: '4, 4' }}
                        />
                        <Polyline
                          positions={trajectoryCoords}
                          pathOptions={{ color: '#b91c1c', weight: 3 }}
                        />
                        <Circle
                          center={activeCoords}
                          radius={140000}
                          pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.15, weight: 1.5 }}
                        />
                        <Marker position={activeCoords} icon={createCustomPin('#dc2626')}>
                          <Popup>
                            <div className="text-xs">
                              <b>{tr('Active Cyclone Center:', 'सक्रिय चक्रवात केंद्र:')}</b> {activeCoords[0]}°N, {activeCoords[1]}°E<br />
                              <b>{tr('Wind:', 'हवा:')}</b> {timelineSubMode === 'forecast_track' ? currentStep.max_wind_kmh : activePass.wind_kmh} km/h • <b>{tr('Pressure:', 'दबाव:')}</b> {timelineSubMode === 'forecast_track' ? currentStep.central_pressure_hpa : activePass.pressure_hpa} hPa
                            </div>
                          </Popup>
                        </Marker>
                      </>
                    )}

                    {/* LANDSLIDE / VOLCANO / FLOOD HOTSPOT PINS */}
                    {selectedHazardId !== 'cyclone' && currentHazard.hotspots && (
                      <>
                        <Circle
                          center={currentHazard.center}
                          radius={selectedHazardId === 'volcano' ? 45000 : 25000}
                          pathOptions={{ color: '#ea580c', fillColor: '#f97316', fillOpacity: 0.2, weight: 1.5, dashArray: '3, 3' }}
                        />
                        {currentHazard.hotspots.map((spot, idx) => (
                          <Marker key={idx} position={[spot.lat, spot.lon]} icon={createCustomPin('#b91c1c')}>
                            <Popup>
                              <div className="text-xs">
                                <b>{spot.name}</b><br />
                                <span className="text-red-700 font-bold">{spot.risk}</span><br />
                                {tr('Coordinates:', 'निर्देशांक:')} {spot.lat}°N, {spot.lon}°E
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </>
                    )}
                  </MapContainer>
                </div>

                {/* Hotspot Vulnerability Summary */}
                <div className="bg-[#ede4d4] p-2.5 rounded-xl border border-[#ded3bf] flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    {tr('High-Risk Zones Identified:', 'पहचाने गए उच्च जोखिम वाले क्षेत्र:')} {currentHazard.hotspots?.length || 4} {tr('Locations', 'स्थान')}
                  </span>
                  <span className="text-[11px] font-mono text-red-800 font-bold">
                    {tr('NDRF Rapid Deployment Active', 'एनडीआरएफ त्वरित तैनाती सक्रिय')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* CASE B: NORMAL ROUTINE SURVEILLANCE ("Show Normally Not in Emergency")   */}
      {/* ========================================================================= */}
      {disasterMode === 'normal' && (
        <div className="space-y-5">
          {/* Calming Normal Status Banner */}
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-emerald-950">
                  {tr('All National Sectors Within Safe Operating Limits', 'सभी राष्ट्रीय क्षेत्र सुरक्षित परिचालन सीमा के भीतर')}
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {tr('Automated telemetry sweep confirmed: Zero Level-3 emergency cyclones, landslides, or active flood incursions across Indian territory.', 'स्वचालित टेलीमेट्री समीक्षा से पुष्टि: भारतीय क्षेत्र में शून्य स्तर-3 आपातकालीन चक्रवात, भूस्खलन, अथवा सक्रिय बाढ़ का प्रकोप।')}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shrink-0">
              {tr('GREEN CODE · NORMAL', 'हरा कोड · सामान्य स्थिति')}
            </span>
          </div>

          {/* Normal Key Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#fbf8f1] border border-[#ded3bf] p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Doppler Radar Status', 'डॉप्लर रडार स्थिति')}</span>
              <span className="text-lg font-black text-emerald-800">{tr('34 / 34 Active', '34 / 34 सक्रिय')}</span>
              <span className="text-[10px] text-stone-500 block">{tr('100% Nationwide Radar Coverage', '100% देशव्यापी रडार कवरेज')}</span>
            </div>
            <div className="bg-[#fbf8f1] border border-[#ded3bf] p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('National River Basins', 'राष्ट्रीय नदी घाटियां')}</span>
              <span className="text-lg font-black text-emerald-800">{tr('99.4% Safe', '99.4% सुरक्षित')}</span>
              <span className="text-[10px] text-stone-500 block">{tr('All CWC gauges below danger marks', 'सभी सीडब्ल्यूसी गेज खतरे के निशान से नीचे')}</span>
            </div>
            <div className="bg-[#fbf8f1] border border-[#ded3bf] p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('Synoptic Wind Field', 'सिनॉप्टिक वायु क्षेत्र')}</span>
              <span className="text-lg font-black text-stone-900">14 - 22 km/h</span>
              <span className="text-[10px] text-stone-500 block">{tr('Benign seasonal circulation', 'अनुकूल मौसमी परिसंचरण')}</span>
            </div>
            <div className="bg-[#fbf8f1] border border-[#ded3bf] p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">{tr('NDRF Battalion State', 'एनडीआरएफ बटालियन स्थिति')}</span>
              <span className="text-lg font-black text-stone-900">{tr('Routine Standby', 'नियमित स्टैंडबाय')}</span>
              <span className="text-[10px] text-stone-500 block">{tr('Standard operational readiness', 'मानक परिचालन तत्परता')}</span>
            </div>
          </div>

          {/* Normal Dual Panel: Clear Satellite Subcontinent & National Surveillance Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Clear Subcontinent Satellite Image */}
            <div className="bg-[#fbf8f1] border border-[#ded3bf] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#ded3bf] pb-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-stone-900">
                    National Geostationary Overview (Benign Clear Weather)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  CLEAR SKY PASS
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-[#ded3bf] bg-stone-950 aspect-video">
                <img
                  src="/assets/normal_synoptic_india.jpg"
                  alt="Normal Synoptic Satellite View of India"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-stone-900/85 backdrop-blur-sm text-stone-300 px-2 py-1 rounded text-[10px] font-mono border border-stone-700">
                  National Synoptic Satellite Baseline
                </div>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                Atmospheric conditions across Peninsular and Northern India remain calm. Monsoon trough is aligned with normal seasonal averages.
              </p>
            </div>

            {/* Right: Peaceful National Radar Map */}
            <div className="bg-[#fbf8f1] border border-[#ded3bf] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#ded3bf] pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-stone-900">
                    National Surveillance Grid (34 Radar Stations Operational)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 font-mono">
                  ALL CHANNELS NORMAL
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-[#ded3bf] aspect-video relative z-0 isolate">
                <MapContainer center={[21.5, 82.0]} zoom={4} scrollWheelZoom={false} className="w-full h-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {normalStations.map((station, idx) => (
                    <Marker key={idx} position={[station.lat, station.lon]} icon={createCustomPin('#16a34a')}>
                      <Popup>
                        <div className="text-xs">
                          <b>{station.name}</b><br />
                          <span className="text-emerald-700 font-bold">{station.status}</span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div className="bg-[#ede4d4] p-2.5 rounded-xl border border-[#ded3bf] text-xs text-stone-700">
                <b>Public Advisory:</b> Routine seasonal travel, maritime fishing, and aviation corridors operating without weather restrictions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen High-Res Modal (macOS Preview / Quick Look Window) */}
      {highResModalOpen && (
        <div
          onClick={() => setHighResModalOpen(false)}
          className="fixed inset-0 z-[99999] bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer macos-backdrop"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-900/95 backdrop-blur-2xl border border-stone-700/80 rounded-3xl max-w-4xl w-full p-4 shadow-2xl space-y-3 text-stone-100 macos-window overflow-hidden cursor-default"
          >
            {/* macOS Titlebar Chrome */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="macos-traffic-dots">
                  <span onClick={() => setHighResModalOpen(false)} className="macos-dot macos-dot-close" title="Close"></span>
                  <span className="macos-dot macos-dot-minimize" title="Minimize"></span>
                  <span className="macos-dot macos-dot-maximize" title="Zoom"></span>
                </div>
                <span className="text-xs font-bold text-stone-200 flex items-center gap-2 font-mono">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Satellite Observation · {currentHazard.name}</span>
                </span>
              </div>
              <button
                onClick={() => setHighResModalOpen(false)}
                className="text-stone-400 hover:text-stone-100 p-1 rounded-lg hover:bg-stone-800 transition-colors macos-tap cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={selectedHazardId === 'cyclone' ? activePass.imageSrc : currentHazard.satellite_src}
              alt="High-Res Earth Observation View"
              className="w-full max-h-[75vh] object-contain rounded-2xl bg-stone-950 border border-stone-800"
              onError={(e) => {
                e.target.src = '/assets/zoom_earth_pass_0h.jpg';
              }}
            />
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono px-1">
              <span>Center: <b>{currentHazard.center[0]}°N, {currentHazard.center[1]}°E</b></span>
              <span>Region: <b>{currentHazard.region}</b></span>
            </div>
          </div>
        </div>
      )}

      {/* Explainable AI (XAI) Multi-Hazard Severity Breakdown Modal (macOS Inspector) */}
      {xaiModalOpen && (
        <div
          onClick={() => setXaiModalOpen(false)}
          className="fixed inset-0 z-[99999] bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer macos-backdrop"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fcfaf5]/95 backdrop-blur-2xl border border-[#ded3bf] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-stone-800 cursor-default macos-window overflow-hidden"
          >
            {/* macOS Inspector Header */}
            <div className="flex items-center justify-between border-b border-[#ded3bf] pb-3">
              <div className="flex items-center gap-3">
                <div className="macos-traffic-dots">
                  <span onClick={() => setXaiModalOpen(false)} className="macos-dot macos-dot-close" title="Close"></span>
                  <span className="macos-dot macos-dot-minimize" title="Minimize"></span>
                  <span className="macos-dot macos-dot-maximize" title="Zoom"></span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-xs">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <span>XAI: Multi-Hazard Threat Explainability</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                      MHSI {currentHazard.mhsi_score} / 100
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Transparent mathematical decomposition for {currentHazard.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setXaiModalOpen(false)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors macos-tap cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formula Card */}
            <div className="bg-[#ede4d4] p-3.5 rounded-xl border border-[#ded3bf] space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block">
                Triaging Mathematical Formulation:
              </span>
              <div className="bg-white/80 p-2.5 rounded-lg border border-[#ded3bf] font-mono text-xs text-amber-950 font-bold">
                {currentHazard.interpretability_breakdown?.formula || 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence'}
              </div>
              <p className="text-[10px] text-stone-600">
                Linear weighted combination of physical kinetic forces, population exposure risk, and immediate arrival time, scaled by multi-satellite consensus confidence.
              </p>
            </div>

            {/* 4 Attribution Factor Progress Bars */}
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase font-black tracking-wider text-stone-700 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-800" />
                <span>Factor Attribution Breakdown:</span>
              </h4>

              {/* 1. Hazard Intensity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">1. Physical Hazard Intensity (Weight: 35%)</span>
                  <span className="font-mono font-black text-red-700">
                    {currentHazard.interpretability_breakdown?.intensity_score || 95}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${currentHazard.interpretability_breakdown?.intensity_score || 95}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-stone-600">
                  {currentHazard.interpretability_breakdown?.intensity_detail || 'Kinetic wind speed and central pressure anomaly'}
                </p>
              </div>

              {/* 2. Demographic & Asset Exposure */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">2. Population & Asset Exposure (Weight: 35%)</span>
                  <span className="font-mono font-black text-amber-800">
                    {currentHazard.interpretability_breakdown?.exposure_score || 88}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${currentHazard.interpretability_breakdown?.exposure_score || 88}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-stone-600">
                  {currentHazard.interpretability_breakdown?.exposure_detail || 'Census-derived habitation density in impact cone'}
                </p>
              </div>

              {/* 3. Temporal Urgency */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">3. Temporal Urgency / Landfall Window (Weight: 20%)</span>
                  <span className="font-mono font-black text-orange-700">
                    {currentHazard.interpretability_breakdown?.urgency_score || 90}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${currentHazard.interpretability_breakdown?.urgency_score || 90}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-stone-600">
                  {currentHazard.interpretability_breakdown?.urgency_detail || 'Imminent landfall countdown'}
                </p>
              </div>

              {/* 4. Multi-Sensor Telemetry Confidence */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">4. Multi-Satellite Sensor Agreement (Confidence Multiplier)</span>
                  <span className="font-mono font-black text-emerald-800">
                    {currentHazard.interpretability_breakdown?.confidence_score || 98}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${currentHazard.interpretability_breakdown?.confidence_score || 98}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-stone-600">
                  {currentHazard.interpretability_breakdown?.confidence_detail || 'Cross-verified across INSAT, Meteosat, Himawari and Doppler radars'}
                </p>
              </div>
            </div>

            {/* Bilingual Plain Language Citizen Rationale */}
            <div className="bg-[#ede4d4]/70 p-3.5 rounded-xl border border-[#ded3bf] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
                  <span>Citizen Interpretability Note (Plain Language):</span>
                </span>
                <div className="flex items-center rounded-lg border border-stone-300 bg-white overflow-hidden text-[10px] font-bold">
                  <button
                    onClick={() => setXaiLang('en')}
                    className={`px-2 py-0.5 transition-colors ${xaiLang === 'en' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setXaiLang('hi')}
                    className={`px-2 py-0.5 transition-colors ${xaiLang === 'hi' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                  >
                    सरल हिंदी
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {xaiLang === 'en'
                  ? (currentHazard.interpretability_breakdown?.plain_english || 'The AI ranked this hazard based on severe kinetic forces, immediate exposure to population, and multi-satellite agreement.')
                  : (currentHazard.interpretability_breakdown?.plain_hindi || 'एआई ने इस आपदा को प्रचंड तीव्रता, घनी आबादी और उपग्रह सत्यापन के आधार पर उच्च प्राथमिकता दी है।')}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between text-[10px] text-stone-500 pt-2 border-t border-[#ded3bf]">
              <span>Compliant with NDMA, IMD, & ISRO Copernicus Decision Protocols</span>
              <button
                onClick={() => setXaiModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold transition-all"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📄 COMPACT DISASTER SITUATION REPORT (Zero-Scroll Executive Briefing)     */}
      {/* ========================================================================= */}
      {disasterReportModalOpen && (() => {
        const targetId = activeReportHazard?.id || currentHazard?.id || 'landslide';
        const defaultData = DEFAULT_MULTI_HAZARDS.find(d => d.id === targetId) || DEFAULT_MULTI_HAZARDS[0];
        const reportHazard = {
          ...defaultData,
          ...(activeReportHazard || currentHazard || {}),
          plain_report: {
            ...(defaultData.plain_report || {}),
            ...((activeReportHazard || currentHazard)?.plain_report || {})
          },
          hotspots: (activeReportHazard || currentHazard)?.hotspots?.length > 0
            ? (activeReportHazard || currentHazard).hotspots
            : defaultData.hotspots
        };
        const pr = reportHazard.plain_report || defaultData.plain_report || {};
        const isHi = (reportLang || lang) === 'hi';

        return (
          <div
            onClick={() => setDisasterReportModalOpen(false)}
            className="fixed inset-0 z-[99999] bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 cursor-pointer macos-backdrop"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fcfaf5] border border-[#ded3bf] rounded-2xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl text-stone-800 cursor-default macos-window flex flex-col space-y-3 -translate-y-8 sm:-translate-y-12 max-h-[94vh] overflow-y-auto"
            >
              {/* Row 1: Header */}
              <div className="flex items-center justify-between border-b border-[#ded3bf] pb-3 shrink-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="macos-traffic-dots">
                    <span onClick={() => setDisasterReportModalOpen(false)} className="macos-dot macos-dot-close" title="Close"></span>
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
                          {getHazardDisplayName(reportHazard, isHi)}
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
                      <span>{getHazardRegionName(reportHazard, isHi)}</span>
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
                    onClick={() => setDisasterReportModalOpen(false)}
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
                    {getHazardMetricLabel(reportHazard, isHi)}
                  </span>
                </div>
                <div className="bg-white border border-[#ded3bf] rounded-xl px-3 py-2 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-stone-500 block leading-tight">
                    {isHi ? 'द्वितीयक पैमाना' : 'Secondary Metric'}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-stone-900 truncate block">
                    {getHazardSecondaryMetricLabel(reportHazard, isHi)}
                  </span>
                </div>
                <div className="bg-white border border-[#ded3bf] rounded-xl px-3 py-2 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-stone-500 block leading-tight">
                    {isHi ? 'डेटा विश्वसनीयता' : 'Data Confidence'}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
                    {getHazardConfidenceLabel(reportHazard, isHi)}
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
                  onClick={() => setDisasterReportModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all macos-tap cursor-pointer ml-auto"
                >
                  {isHi ? 'रिपोर्ट बंद करें' : 'Close Report'}
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
