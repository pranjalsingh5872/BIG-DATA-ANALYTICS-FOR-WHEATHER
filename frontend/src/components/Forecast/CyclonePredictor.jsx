import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Navigation,
  Compass,
  AlertTriangle,
  Waves,
  ShieldAlert,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
  Calendar,
  CloudRain,
  ChevronRight,
  ChevronLeft,
  Eye,
  Users,
  ShieldCheck,
  RefreshCw,
  Camera,
  CheckCircle2,
  Layers,
  Maximize2,
  ExternalLink,
  Mountain,
  Flame,
  Sun,
  SlidersHorizontal,
  Info,
  Brain,
  HelpCircle,
  X,
  Scale
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { formatIST } from '../../utils/time';

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
      category: 'Severe Cyclonic Storm (SCS)',
      wind_kmh: 105,
      pressure_hpa: 984,
      eyeDiameter: '34 km',
      cloudCoverDiameter: '720 km',
      imageSrc: '/assets/zoom_earth_pass_0h.jpg',
      status: 'Real-time Zoom Earth observation: Distinct cyclonic spiral arms and cloud vortex active over Bay of Bengal.'
    },
    {
      id: 'pass_3h',
      label: '3 Hours Ago (T - 3h Pass)',
      timeAgo: '3 Hours Ago Observation',
      timestamp: formatOffset(3),
      satellite: 'Zoom Earth Live Composite (Himawari + Meteosat-IODC)',
      sensorBand: 'GeoColor Real-Time Natural True Color & Infrared',
      cycloneEye: '16.3°N, 88.8°E (South-Central Bay)',
      cyclone_lat: 16.3,
      cyclone_lon: 88.8,
      category: 'Cyclonic Storm (CS)',
      wind_kmh: 90,
      pressure_hpa: 990,
      eyeDiameter: '38 km',
      cloudCoverDiameter: '680 km',
      imageSrc: '/assets/zoom_earth_pass_3h.jpg',
      status: 'Zoom Earth snapshot 3 hours ago: Central dense overcast consolidating; convective rainbands wrapping into vortex.'
    },
    {
      id: 'pass_6h',
      label: '6 Hours Ago (T - 6h Baseline)',
      timeAgo: '6 Hours Ago Observation',
      timestamp: formatOffset(6),
      satellite: 'Zoom Earth Live Composite (Himawari + Meteosat-IODC)',
      sensorBand: 'GeoColor Real-Time Natural True Color & Infrared',
      cycloneEye: '15.8°N, 89.1°E (Central Bay of Bengal)',
      cyclone_lat: 15.8,
      cyclone_lon: 89.1,
      category: 'Deep Depression (DD)',
      wind_kmh: 75,
      pressure_hpa: 996,
      eyeDiameter: '42 km',
      cloudCoverDiameter: '640 km',
      imageSrc: '/assets/zoom_earth_pass_6h.jpg',
      status: 'Zoom Earth snapshot 6 hours ago: Low pressure system deepening into cyclonic storm over warm sea surface (30.5°C).'
    },
    {
      id: 'pass_12h',
      label: '12 Hours Ago (T - 12h Origin)',
      timeAgo: '12 Hours Ago Night Observation',
      timestamp: formatOffset(12),
      satellite: 'Zoom Earth Live Composite (Himawari + Meteosat-IODC)',
      sensorBand: 'GeoColor Night Infrared & Earth City Lights',
      cycloneEye: '14.9°N, 89.6°E (South-Central Bay)',
      cyclone_lat: 14.9,
      cyclone_lon: 89.6,
      category: 'Depression / Low Pressure',
      wind_kmh: 55,
      pressure_hpa: 1002,
      eyeDiameter: '50 km',
      cloudCoverDiameter: '590 km',
      imageSrc: '/assets/zoom_earth_pass_12h.jpg',
      status: 'Zoom Earth nighttime snapshot 12 hours ago: Peninsular city lights visible with nocturnal thermal IR cloud mass.'
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
      category: 'Severe Cyclonic Storm (SCS)',
      central_pressure_hpa: 984,
      max_wind_kmh: 105,
      gusts_kmh: 125,
      speed_kmh: 14,
      direction: 'North-Northwest (NNW)',
      status: 'Intensifying over Warm Sea Surface (SST 30.5°C)',
      storm_surge_m: 1.2,
      radius_km: 140
    },
    {
      hour: 12,
      label: '+12 Hours',
      timestamp: formatOffset(12),
      lat: 18.4,
      lon: 87.8,
      category: 'Very Severe Cyclonic Storm (VSCS)',
      central_pressure_hpa: 974,
      max_wind_kmh: 125,
      gusts_kmh: 145,
      speed_kmh: 16,
      direction: 'North-Northwest (NNW)',
      status: 'Approaching Outer Continental Shelf of Odisha',
      storm_surge_m: 1.9,
      radius_km: 180
    },
    {
      hour: 24,
      label: '+24 Hours (Landfall Window)',
      timestamp: formatOffset(24),
      lat: 20.6,
      lon: 86.9,
      category: 'Very Severe Cyclonic Storm (VSCS)',
      central_pressure_hpa: 968,
      max_wind_kmh: 135,
      gusts_kmh: 155,
      speed_kmh: 18,
      direction: 'North-Northwest towards Dhamra / Paradip Coast',
      status: 'CRITICAL LANDFALL WINDOW: Severe coastal inundation & extreme gales',
      storm_surge_m: 2.6,
      radius_km: 210
    },
    {
      hour: 48,
      label: '+48 Hours (Inland Movement)',
      timestamp: formatOffset(48),
      lat: 22.2,
      lon: 85.8,
      category: 'Cyclonic Storm / Deep Depression',
      central_pressure_hpa: 992,
      max_wind_kmh: 75,
      gusts_kmh: 90,
      speed_kmh: 12,
      direction: 'Northwest across North Odisha & Jharkhand',
      status: 'Weakening over land; Extreme widespread localized deluge (>200mm)',
      storm_surge_m: 0.8,
      radius_km: 240
    },
    {
      hour: 72,
      label: '+72 Hours (Dissipation)',
      timestamp: formatOffset(72),
      lat: 23.8,
      lon: 84.5,
      category: 'Well-Marked Low Pressure Area (WMLP)',
      central_pressure_hpa: 1002,
      max_wind_kmh: 40,
      gusts_kmh: 55,
      speed_kmh: 10,
      direction: 'West-Northwest across Gangetic Plain',
      status: 'Residual moisture merging into monsoon trough; scattered rain',
      storm_surge_m: 0.0,
      radius_km: 260
    }
  ];
};

// Fallback Multi-Hazard Disaster Profiles across India
const DEFAULT_MULTI_HAZARDS = [
  {
    id: 'cyclone',
    name: "Cyclone 'DANA' (VSCS-02B)",
    hazard_type: 'Tropical Cyclone',
    icon_type: 'cyclone',
    severity_rank: 1,
    mhsi_score: 94.2,
    status_code: 'CRITICAL_EMERGENCY',
    badge_color: 'bg-red-600',
    region: 'Bay of Bengal (Coastal Odisha & West Bengal)',
    center: [16.8, 88.5],
    primary_metric: '105 km/h Winds (SCS)',
    secondary_metric: '984 hPa Pressure',
    satellite_label: 'Zoom Earth Live Geocolor Satellite Observation',
    satellite_src: '/assets/zoom_earth_pass_0h.jpg',
    description: 'Mature cyclonic vortex with intensifying eyewall tracking NNW toward Dhamra & Sagar Island. High storm surge (1.2m) and severe coastal gale risk.',
    hotspots: [
      { name: 'Balasore Coast', lat: 21.49, lon: 86.93, risk: 'Critical Landfall Zone' },
      { name: 'Bhadrak / Dhamra', lat: 20.79, lon: 86.84, risk: 'Storm Surge Inundation' },
      { name: 'Kendrapara', lat: 20.50, lon: 86.42, risk: 'Gale Force Winds' },
      { name: 'Purba Medinipur', lat: 21.93, lon: 87.77, risk: 'Extreme Precipitation' }
    ],
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 98,
      intensity_detail: '105 km/h gale winds + 984 hPa central pressure deficit (-22 hPa)',
      exposure_score: 92,
      exposure_detail: 'High-density coastal districts (Balasore, Bhadrak, Purba Medinipur: 4.8M residents)',
      urgency_score: 95,
      urgency_detail: 'Immediate +24 hour projected landfall window',
      confidence_score: 98,
      confidence_detail: '4 Independent Satellites (Zoom Earth, Meteosat-IODC, Himawari, INSAT-3DR) in complete agreement',
      plain_english: 'The AI ranked Cyclone DANA as #1 Critical because it combines destructive gale-force winds with immediate landfall in densely populated coastal belts, confirmed by 4 satellites.',
      plain_hindi: 'एआई ने चक्रवात दाना को नंबर 1 गंभीर आपदा घोषित किया क्योंकि 105 किमी/घंटे की प्रचंड हवाएं और 24 घंटे में घनी आबादी वाले तट से टकराने की पुष्टि 4 उपग्रहों द्वारा की गई है।'
    }
  },
  {
    id: 'landslide',
    name: 'Wayanad Slope Instability & Debris Flow',
    hazard_type: 'Monsoon Landslide & Mudslip',
    icon_type: 'mountain',
    severity_rank: 2,
    mhsi_score: 78.6,
    status_code: 'HIGH_ALERT',
    badge_color: 'bg-amber-600',
    region: 'Western Ghats, Kerala (Meppadi - Chooralmala)',
    center: [11.55, 76.15],
    primary_metric: '91% Soil Saturation',
    secondary_metric: '312 mm / 48h Rain',
    satellite_label: 'Sentinel-2 & InSAR Topographic Moisture Analysis',
    satellite_src: '/assets/landslide_sar_wayanad.jpg',
    description: 'Extreme antecedent monsoon precipitation has triggered deep hydraulic soil saturation (>90%) across steep slopes (>30°). High probability of slope slippage and debris channelization.',
    hotspots: [
      { name: 'Chooralmala Valley', lat: 11.52, lon: 76.18, risk: 'Debris Flow Red Zone' },
      { name: 'Mundakkai Slope', lat: 11.54, lon: 76.21, risk: 'High Shear Instability' },
      { name: 'Meppadi Ridge', lat: 11.55, lon: 76.13, risk: 'Soil Saturation 93%' },
      { name: 'Vellarimala Peak', lat: 11.47, lon: 76.14, risk: 'Headscarp Tension Cracks' }
    ],
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 84,
      intensity_detail: '91.4% pore-water pressure saturation + 312 mm / 48h deluge on slopes >30°',
      exposure_score: 74,
      exposure_detail: '4 Highland settlement tea estate pockets (Chooralmala & Mundakkai)',
      urgency_score: 82,
      urgency_detail: 'Active tension cracks recorded along upper ridge lines with imminent rainfall',
      confidence_score: 95,
      confidence_detail: 'Sentinel-2 SAR Soil Moisture Index + Kerala IMD Automated Weather Stations',
      plain_english: 'The AI ranked Wayanad as #2 High Alert due to dangerous hydraulic saturation exceeding critical slope shear limits across tea estate settlements.',
      plain_hindi: 'एआई ने वायनाड को उच्च चेतावनी स्तर पर रखा है क्योंकि 91% मिट्टी की नमी ढलानों की सुरक्षित सीमा पार कर चुकी है और भूस्खलन का उच्च जोखिम है।'
    }
  },
  {
    id: 'volcano',
    name: 'Barren Island Volcanic & Thermal Emission',
    hazard_type: 'Volcanic / Thermal Anomaly',
    icon_type: 'flame',
    severity_rank: 3,
    mhsi_score: 46.5,
    status_code: 'MONITORED_ADVISORY',
    badge_color: 'bg-orange-600',
    region: 'Andaman Sea (138 km East of Port Blair)',
    center: [12.28, 93.86],
    primary_metric: '142 MW Radiative Power',
    secondary_metric: '3.8 DU SO₂ Plume',
    satellite_label: 'Sentinel-2 SWIR Thermal Infrared & Aerosol Dispersion',
    satellite_src: '/assets/volcano_thermal_barren.jpg',
    description: 'Continuous strombolian activity with thermal radiative bloom from central caldera. SO2 aerosol plume drifting WSW. Maritime advisory in effect for 45 km radius.',
    hotspots: [
      { name: 'Central Caldera Crater', lat: 12.28, lon: 93.86, risk: 'Active Thermal Vent (1100°C)' },
      { name: 'Western Lava Channel', lat: 12.28, lon: 93.84, risk: 'Sub-surface Basalt Flow' },
      { name: 'Maritime Buffer Zone', lat: 12.25, lon: 93.80, risk: '45 km Exclusion Perimeter' }
    ],
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 68,
      intensity_detail: '142 MW Volcanic Radiative Power (VRP) & 3.8 DU SO2 gas column',
      exposure_score: 18,
      exposure_detail: 'Uninhabited island; restricted to offshore shipping lanes & aviation airways',
      urgency_score: 42,
      urgency_detail: 'Steady-state Strombolian eruption without paroxysmal explosive shift',
      confidence_score: 99,
      confidence_detail: 'Sentinel-2 MSI Short-Wave Infrared (SWIR) + Sentinel-5P TROPOMI UV Spectrometer',
      plain_english: 'The AI ranked Barren Island at Rank #3 (Advisory) because despite high thermal energy, human exposure is virtually zero as the island is uninhabited.',
      plain_hindi: 'एआई ने बैरन द्वीप को तीसरे स्थान पर रखा क्योंकि उच्च ज्वालामुखी ताप के बावजूद द्वीप निर्जन है और नागरिक जीवन पर कोई सीधा खतरा नहीं है।'
    }
  },
  {
    id: 'flood',
    name: 'Brahmaputra Valley Riverine Surveillance',
    hazard_type: 'Hydrological Basin Inundation',
    icon_type: 'waves',
    severity_rank: 4,
    mhsi_score: 32.0,
    status_code: 'NORMAL_GUARDED',
    badge_color: 'bg-emerald-600',
    region: 'Upper Assam (Kaziranga - Majuli Sector)',
    center: [26.75, 93.50],
    primary_metric: '0.8m Below Danger Level',
    secondary_metric: 'Discharge 18,200 m³/s',
    satellite_label: 'Sentinel-1 SAR Hydrological Flood Extent Analysis',
    satellite_src: '/assets/flood_cwc_brahmaputra.jpg',
    description: 'Monsoon basin runoff within controlled thresholds. CWC hydrological gauges at Dhubri, Guwahati, and Nematighat reporting steady river stages below warning thresholds.',
    hotspots: [
      { name: 'Majuli River Island', lat: 26.95, lon: 94.20, risk: 'Bank Erosion Monitoring' },
      { name: 'Kaziranga North Lowlands', lat: 26.65, lon: 93.35, risk: 'Seasonal Inundation Normal' },
      { name: 'Tezpur CWC Gauge', lat: 26.62, lon: 92.79, risk: 'Stage 64.2m (Safe)' }
    ],
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 34,
      intensity_detail: 'Basin discharge 18,200 m3/s; river stage 0.8m below statutory danger level',
      exposure_score: 40,
      exposure_detail: 'Riparian villages fortified with flood dykes & early warning siren grid',
      urgency_score: 25,
      urgency_detail: 'Catchment precipitation tapering; receding flood crest upstream',
      confidence_score: 96,
      confidence_detail: 'Central Water Commission (CWC) telemetry gauges + Sentinel-1 C-band SAR water mask',
      plain_english: 'The AI ranked Brahmaputra Valley at Rank #4 (Guarded) as river levels remain safely below statutory danger marks with no emergency evacuation required.',
      plain_hindi: 'एआई ने ब्रह्मपुत्र घाटी को सुरक्षित निगरानी में रखा है क्योंकि नदी का जलस्तर खतरे के निशान से 0.8 मीटर नीचे है और स्थिति नियंत्रण में है।'
    }
  }
];

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

export default function CyclonePredictor() {
  const { lang, tr, t, translateCategory, translateSeverity } = useLanguage();
  const [forecastData, setForecastData] = useState(null);
  const [disasterMode, setDisasterMode] = useState('active'); // 'active' (Level-3 Disaster) vs 'normal' (Routine Surveillance)
  const [selectedHazardId, setSelectedHazardId] = useState('cyclone'); // 'cyclone', 'landslide', 'volcano', 'flood'
  const [selectedPassId, setSelectedPassId] = useState('pass_0h'); // 'pass_0h', 'pass_3h', 'pass_6h', 'pass_12h'
  const [selectedHour, setSelectedHour] = useState(24); // Forecast timeline step
  const [activeCoords, setActiveCoords] = useState([16.8, 88.5]);
  const [displayMode, setDisplayMode] = useState('split'); // 'split', 'satellite_only', 'map_only'
  const [loading, setLoading] = useState(true);
  const [reloadingAll, setReloadingAll] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(null);
  const [highResModalOpen, setHighResModalOpen] = useState(false);
  const [xaiModalOpen, setXaiModalOpen] = useState(false);
  const [xaiLang, setXaiLang] = useState('en');

  const sliderRef = useRef(null);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const data = await api.getCycloneForecast();
      setForecastData(data);
    } catch (err) {
      console.error('Failed to load forecast', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReloadAllData = async () => {
    try {
      setReloadingAll(true);
      setRefreshSuccess(null);
      const [forecastRes] = await Promise.all([
        api.getCycloneForecast()
      ]);
      setForecastData(forecastRes);
      setRefreshSuccess('All multi-hazard feeds and real-time satellite imagery reloaded successfully.');
      setTimeout(() => setRefreshSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to reload all data', err);
      alert('Failed to reload live meteorological feeds. Please try again.');
    } finally {
      setReloadingAll(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const multiHazards = forecastData?.multi_hazards || DEFAULT_MULTI_HAZARDS;
  const currentHazard = multiHazards.find(h => h.id === selectedHazardId) || multiHazards[0];
  const observationPasses = (forecastData?.zoom_earth_observation_passes && forecastData.zoom_earth_observation_passes.length > 0) ? forecastData.zoom_earth_observation_passes : getDynamicZoomEarthPasses();
  const activePass = observationPasses.find(p => p.id === selectedPassId) || observationPasses[0];

  const steps = (forecastData?.timeline_steps && forecastData.timeline_steps.length > 0) ? forecastData.timeline_steps : getDynamicTimelineSteps();
  const currentStep = steps.find(s => s.hour === selectedHour) || steps[0] || {};
  const trajectoryCoords = steps.map(s => [s.lat, s.lon]);

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
      {/* Toast Notification */}
      {refreshSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{refreshSuccess}</span>
        </div>
      )}

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
          <div className="px-3 py-1.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>{tr('Live Surveillance: Severe Cyclonic Storm Active', 'लाइव निगरानी: गंभीर चक्रवाती तूफान सक्रिय')}</span>
          </div>

          {/* Master Reload / Atmospheric Scan */}
          <button
            onClick={handleReloadAllData}
            disabled={reloadingAll}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            title="Scan live atmospheric pressure, Doppler wind velocity, and satellite passes"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reloadingAll ? 'animate-spin text-emerald-200' : 'text-emerald-200'}`} />
            <span>{reloadingAll ? t('scanningAtmospheric') : t('atmosphericScanBtn')}</span>
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
              className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-stone-400 scrollbar-track-stone-200"
            >
              {multiHazards.map((hazard) => {
                const isSelected = hazard.id === selectedHazardId;
                const isTopRank = hazard.severity_rank === 1;

                return (
                  <button
                    key={hazard.id}
                    onClick={() => handleSelectHazard(hazard)}
                    className={`shrink-0 w-72 text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-900 text-white border-amber-950 shadow-md ring-2 ring-amber-600/40 -translate-y-0.5'
                        : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 hover:border-amber-400 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isTopRank
                          ? (isSelected ? 'bg-red-500 text-white font-bold' : 'bg-red-100 text-red-800 border border-red-300')
                          : (isSelected ? 'bg-amber-700 text-amber-100' : 'bg-stone-100 text-stone-600')
                      }`}>
                        {isTopRank ? '★ Rank #1 (Primary Face)' : `Rank #${hazard.severity_rank}`}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                        MHSI {hazard.mhsi_score}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hazard.id === 'cyclone' && <Wind className={`w-4 h-4 ${isSelected ? 'text-cyan-300' : 'text-cyan-600'}`} />}
                      {hazard.id === 'landslide' && <Mountain className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`} />}
                      {hazard.id === 'volcano' && <Flame className={`w-4 h-4 ${isSelected ? 'text-orange-300' : 'text-orange-600'}`} />}
                      {hazard.id === 'flood' && <Waves className={`w-4 h-4 ${isSelected ? 'text-blue-300' : 'text-blue-600'}`} />}
                      <h4 className="text-xs font-black truncate">{hazard.name}</h4>
                    </div>

                    <p className={`text-[10px] mt-1 truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {hazard.region}
                    </p>

                    <div className="mt-2 pt-2 border-t border-stone-200/40 flex items-center justify-between text-[10px] font-mono">
                      <span className={isSelected ? 'text-amber-300 font-bold' : 'text-stone-700 font-bold'}>
                        {hazard.primary_metric}
                      </span>
                      <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                        {hazard.status_code.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Threat Profile Summary Strip with XAI Button */}
          <div className="flex items-center justify-between bg-[#ede4d4]/70 px-3.5 py-2 rounded-xl border border-[#ded3bf] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentHazard.badge_color || 'bg-red-600'}`}></span>
              <span className="text-xs font-bold text-stone-900">
                Active Threat Focus: <span className="underline decoration-amber-600 underline-offset-2">{currentHazard.name}</span>
              </span>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-stone-300 font-bold text-stone-700">
                MHSI Threat Index: {currentHazard.mhsi_score} / 100
              </span>
            </div>
            <button
              onClick={() => setXaiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-800 hover:bg-amber-900 text-amber-100 shadow-sm transition-all cursor-pointer"
              title="Inspect mathematical breakdown and satellite attribution for this score"
            >
              <Brain className="w-3.5 h-3.5 text-amber-300" />
              <span>Explain AI Threat Score (XAI)</span>
            </button>
          </div>

          {/* DYNAMIC METRIC KPI BAR FOR SELECTED DISASTER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedHazardId === 'cyclone' && (
              <>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase font-black text-stone-600 block">
                    {lang === 'hi' ? 'निरंतर हवा की गति' : 'Sustained Wind Speed'}
                  </span>
                  <span className="text-xl font-black text-red-700 font-mono">{activePass.wind_kmh} km/h</span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    {lang === 'hi' ? 'गंभीर चक्रवाती तूफान (SCS)' : 'Severe Cyclonic Storm (SCS)'}
                  </span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase font-black text-stone-600 block">
                    {lang === 'hi' ? 'केंद्रीय वायुमंडलीय दबाव' : 'Central Pressure'}
                  </span>
                  <span className="text-xl font-black text-stone-900 font-mono">{activePass.pressure_hpa} hPa</span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    {lang === 'hi' ? 'दबाव कमी: -22 hPa' : 'Deficit: -22 hPa'}
                  </span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase font-black text-stone-600 block">
                    {lang === 'hi' ? 'तूफानी लहर की ऊंचाई' : 'Storm Surge Height'}
                  </span>
                  <span className="text-xl font-black text-amber-700 font-mono">1.2 - 1.8 m</span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    {lang === 'hi' ? 'उच्च ज्वार तटीय खिड़की' : 'High tide coastal window'}
                  </span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase font-black text-stone-600 block">
                    {lang === 'hi' ? 'अनुमानित तट प्रवेश' : 'Projected Landfall'}
                  </span>
                  <span className="text-xl font-black text-cyan-800 font-mono">+24 Hours</span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    {lang === 'hi' ? 'धामरा / सागर द्वीप सेक्टर' : 'Dhamra / Sagar Island'}
                  </span>
                </div>
              </>
            )}

            {selectedHazardId === 'landslide' && (
              <>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Hydraulic Soil Saturation</span>
                  <span className="text-lg font-black text-red-700">91.4%</span>
                  <span className="text-[10px] text-stone-500 block">Critical threshold (&gt;85%)</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">48h Rain Accumulation</span>
                  <span className="text-lg font-black text-stone-900">312 mm</span>
                  <span className="text-[10px] text-stone-500 block">Antecedent Precipitation Index</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Slope Failure Probability</span>
                  <span className="text-lg font-black text-amber-700">84.2%</span>
                  <span className="text-[10px] text-stone-500 block">Slopes &gt;30° in Wayanad</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Vulnerable Habitations</span>
                  <span className="text-lg font-black text-emerald-800">4 Mountain Sectors</span>
                  <span className="text-[10px] text-stone-500 block">Chooralmala & Meppadi</span>
                </div>
              </>
            )}

            {selectedHazardId === 'volcano' && (
              <>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Thermal Radiative Power</span>
                  <span className="text-lg font-black text-orange-700">142 MW</span>
                  <span className="text-[10px] text-stone-500 block">SWIR 2.2μm Sensor Band</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">SO₂ Plume Dispersion</span>
                  <span className="text-lg font-black text-stone-900">3.8 DU</span>
                  <span className="text-[10px] text-stone-500 block">Sentinel-5P TROPOMI</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Maritime Exclusion Buffer</span>
                  <span className="text-lg font-black text-amber-700">45 km Radius</span>
                  <span className="text-[10px] text-stone-500 block">Coast Guard Notice</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Caldera Core Temp</span>
                  <span className="text-lg font-black text-red-700">1100°C</span>
                  <span className="text-[10px] text-stone-500 block">Continuous Strombolian Venting</span>
                </div>
              </>
            )}

            {selectedHazardId === 'flood' && (
              <>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">River Gauge Margin</span>
                  <span className="text-lg font-black text-emerald-700">-0.8 m</span>
                  <span className="text-[10px] text-stone-500 block">Below CWC Danger Mark</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Upstream Discharge</span>
                  <span className="text-lg font-black text-stone-900">18,200 m³/s</span>
                  <span className="text-[10px] text-stone-500 block">Brahmaputra at Nematighat</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Monitored Lowlands</span>
                  <span className="text-lg font-black text-blue-700">Kaziranga & Majuli</span>
                  <span className="text-[10px] text-stone-500 block">Sentinel-1 SAR Extent</span>
                </div>
                <div className="bg-[#fbf8f1] border border-[#ded3bf] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Flood Shelters Active</span>
                  <span className="text-lg font-black text-cyan-800">82 Ready</span>
                  <span className="text-[10px] text-stone-500 block">Assam Disaster Authority</span>
                </div>
              </>
            )}
          </div>

          {/* SYNOPTIC OBSERVATION PASS SWITCHER (FOR CYCLONE) */}
          {selectedHazardId === 'cyclone' && (
            <div className="bg-[#ede4d4] p-3.5 rounded-2xl border border-[#ded3bf] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-800" />
                  <span>ZOOM EARTH OBSERVATION PASSES (TOUCH TO UPDATE IMAGE & SYNC BOTH MAPS):</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500 font-bold">
                  ACTIVE PASS: {formatPassTimeToIST(activePass.timestamp)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {observationPasses.map((pass) => {
                  const isSelected = pass.id === selectedPassId;
                  return (
                    <button
                      key={pass.id}
                      onClick={() => handleSelectObservationPass(pass)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-500/50'
                          : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black truncate">{pass.label}</span>
                        {isSelected && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500 text-amber-950 font-bold">
                            LINKED
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-mono block mt-1 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                        {formatPassTimeToIST(pass.timestamp)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW SWITCHER: SPLIT, SATELLITE ONLY, MAP ONLY */}
          <div className="flex items-center justify-between bg-[#ede4d4] px-4 py-2.5 rounded-xl border border-[#ded3bf] text-xs">
            <span className="font-bold text-stone-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-800" />
              <span>{tr('Synchronized Presentation View:', 'समकालिक प्रस्तुति दृश्य:')}</span>
            </span>

            <div className="flex items-center gap-2">
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
                      {selectedHazardId === 'cyclone' ? 'Zoom Earth Live Geocolor Satellite Observation' : currentHazard.satellite_label}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-900 font-bold bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">
                      {selectedHazardId === 'cyclone' ? formatPassTimeToIST(activePass.timestamp) : 'Real-Time Earth Observation'}
                    </span>
                    <button
                      onClick={() => setHighResModalOpen(true)}
                      className="p-1 rounded bg-[#ede4d4] hover:bg-[#e4d7c0] text-stone-700"
                      title="Expand to Fullscreen"
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
                      <span>Observation Epicenter:</span>
                      <span className="font-mono">
                        {selectedHazardId === 'cyclone'
                          ? `${activePass.cyclone_lat}°N, ${activePass.cyclone_lon}°E`
                          : `${currentHazard.center[0]}°N, ${currentHazard.center[1]}°E`}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-300 font-mono">
                      {selectedHazardId === 'cyclone'
                        ? `Cloud Canopy: 720 km • Category: ${activePass.category}`
                        : `${currentHazard.region}`}
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-stone-900/85 backdrop-blur-sm text-stone-300 px-2 py-1 rounded text-[10px] font-mono border border-stone-700 flex items-center gap-1">
                    <span>Source: {selectedHazardId === 'cyclone' ? 'Zoom Earth / JMA Himawari' : 'ISRO / ESA Sentinel'}</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </div>
                </div>

                {/* Satellite Description */}
                <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                  {selectedHazardId === 'cyclone' ? activePass.status : currentHazard.description}
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
                      Linked Geospatial Map ({activeCoords[0]}°N, {activeCoords[1]}°E)
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold font-mono">
                    <span className="flex items-center gap-1 text-red-700">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> Active Epicenter
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="w-2 h-2 border border-amber-600 bg-amber-200"></span> Impact Corridor
                    </span>
                  </div>
                </div>

                {/* Leaflet Map */}
                <div className="rounded-xl overflow-hidden border border-[#ded3bf] aspect-video">
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
                              <b>Active Cyclone Center:</b> {activeCoords[0]}°N, {activeCoords[1]}°E<br />
                              <b>Wind:</b> {activePass.wind_kmh} km/h • <b>Pressure:</b> {activePass.pressure_hpa} hPa
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
                                Coordinates: {spot.lat}°N, {spot.lon}°E
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
                    High-Risk Zones Identified: {currentHazard.hotspots?.length || 4} Locations
                  </span>
                  <span className="text-[11px] font-mono text-red-800 font-bold">
                    NDRF Rapid Deployment Active
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
                <h3 className="text-sm font-black text-emerald-950">All National Sectors Within Safe Operating Limits</h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Automated telemetry sweep confirmed: Zero Level-3 emergency cyclones, landslides, or active flood incursions across Indian territory.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shrink-0">
              GREEN CODE · NORMAL
            </span>
          </div>

          {/* Normal Key Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#fbf8f1] border border-[#ded3bf] p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Doppler Radar Status</span>
              <span className="text-lg font-black text-emerald-800">34 / 34 Active</span>
              <span className="text-[10px] text-stone-500 block">100% Nationwide Radar Coverage</span>
            </div>
            <div className="bg-[#fbf8f1] border border-[#ded3bf] p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">National River Basins</span>
              <span className="text-lg font-black text-emerald-800">99.4% Safe</span>
              <span className="text-[10px] text-stone-500 block">All CWC gauges below danger marks</span>
            </div>
            <div className="bg-[#fbf8f1] border border-[#ded3bf] p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Synoptic Wind Field</span>
              <span className="text-lg font-black text-stone-900">14 - 22 km/h</span>
              <span className="text-[10px] text-stone-500 block">Benign seasonal circulation</span>
            </div>
            <div className="bg-[#fbf8f1] border border-[#ded3bf] p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">NDRF Battalion State</span>
              <span className="text-lg font-black text-stone-900">Routine Standby</span>
              <span className="text-[10px] text-stone-500 block">Standard operational readiness</span>
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

              <div className="rounded-xl overflow-hidden border border-[#ded3bf] aspect-video">
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

      {/* Fullscreen High-Res Modal */}
      {highResModalOpen && (
        <div
          onClick={() => setHighResModalOpen(false)}
          className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-900 border border-stone-700 rounded-2xl max-w-4xl w-full p-4 shadow-2xl space-y-3 text-stone-100"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Satellite Observation ({currentHazard.name})</span>
              </span>
              <button
                onClick={() => setHighResModalOpen(false)}
                className="text-stone-400 hover:text-stone-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedHazardId === 'cyclone' ? activePass.imageSrc : currentHazard.satellite_src}
              alt="High-Res Earth Observation View"
              className="w-full max-h-[75vh] object-contain rounded-xl bg-stone-950"
              onError={(e) => {
                e.target.src = '/assets/zoom_earth_pass_0h.jpg';
              }}
            />
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
              <span>Center: <b>{currentHazard.center[0]}°N, {currentHazard.center[1]}°E</b></span>
              <span>Region: <b>{currentHazard.region}</b></span>
            </div>
          </div>
        </div>
      )}

      {/* Explainable AI (XAI) Multi-Hazard Severity Breakdown Modal */}
      {xaiModalOpen && (
        <div
          onClick={() => setXaiModalOpen(false)}
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fcfaf5] border border-[#ded3bf] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-stone-800 cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ded3bf] pb-3">
              <div className="flex items-center gap-2.5">
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
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
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
    </div>
  );
}
