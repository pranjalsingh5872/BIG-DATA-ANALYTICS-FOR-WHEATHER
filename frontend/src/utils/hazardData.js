/**
 * Multi-Hazard Severity Index (MHSI) Standards & Triaging Registry
 * 
 * Standard Operational Classification (NDMA / IMD / GDACS Protocols):
 * - Level 3 (Red Alert - Critical Emergency): MHSI >= 65.0 (Immediate life-safety protocols, NDRF mobilization)
 * - Level 2 (Orange/Amber Alert - Monitored Advisory): MHSI 40.0 - 64.9 (Continuous radar/satellite tracking)
 * - Level 1 (Yellow Alert - Guarded): MHSI 20.0 - 39.9 (Monitored situational awareness)
 * - Negligible / Dissipated / Safe: MHSI < 20.0 (Standard De-listing Cutoff)
 * 
 * STANDARD DE-LISTING PROTOCOL:
 * Any event whose MHSI drops below 20.0 or whose physical circulation has collapsed
 * into an inactive remnant trough is classified as "NEGLIGIBLE / DE-ESCALATED" and is
 * automatically filtered out and de-listed from active national crisis tracking.
 */

export const MHSI_ACTIVE_THRESHOLD = 20.0;

export const DEFAULT_MULTI_HAZARDS = [
  {
    id: 'landslide',
    name: 'Wayanad Slope Instability & Debris Flow',
    hazard_type: 'Monsoon Landslide & Mudslip',
    icon_type: 'mountain',
    severity_rank: 1,
    mhsi_score: 78.6,
    status_code: 'HIGH_ALERT',
    badge_color: 'bg-red-600',
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
      plain_english: 'The AI ranked Wayanad as #1 High Alert due to dangerous hydraulic saturation exceeding critical slope shear limits across tea estate settlements.',
      plain_hindi: 'एआई ने वायनाड को सर्वोच्च चेतावनी स्तर पर रखा है क्योंकि 91% मिट्टी की नमी ढलानों की सुरक्षित सीमा पार कर चुकी है और भूस्खलन का उच्च जोखिम है।'
    }
  },
  {
    id: 'volcano',
    name: 'Barren Island Volcanic & Thermal Emission',
    hazard_type: 'Volcanic / Thermal Anomaly',
    icon_type: 'flame',
    severity_rank: 2,
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
      plain_english: 'The AI ranked Barren Island at Rank #2 (Advisory) because despite high thermal energy, human exposure is virtually zero as the island is uninhabited.',
      plain_hindi: 'एआई ने बैरन द्वीप को दूसरे स्थान पर रखा क्योंकि उच्च ज्वालामुखी ताप के बावजूद द्वीप निर्जन है और नागरिक जीवन पर कोई सीधा खतरा नहीं है।'
    }
  },
  {
    id: 'flood',
    name: 'Brahmaputra Valley Riverine Surveillance',
    hazard_type: 'Hydrological Basin Inundation',
    icon_type: 'waves',
    severity_rank: 3,
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
      plain_english: 'The AI ranked Brahmaputra Valley at Rank #3 (Guarded) as river levels remain safely below statutory danger marks with no emergency evacuation required.',
      plain_hindi: 'एआई ने ब्रह्मपुत्र घाटी को सुरक्षित निगरानी में रखा है क्योंकि नदी का जलस्तर खतरे के निशान से 0.8 मीटर नीचे है और स्थिति नियंत्रण में है।'
    }
  },
  {
    id: 'cyclone',
    name: "System 'ARNAB' (Dissipated / Low Threat)",
    hazard_type: 'Dissipated Cyclonic System',
    icon_type: 'cyclone',
    severity_rank: 4,
    mhsi_score: 18.5,
    status_code: 'INACTIVE_MONITORING',
    badge_color: 'bg-stone-500',
    region: 'Central Bay of Bengal (Open Sea)',
    center: [16.8, 88.5],
    primary_metric: '28 km/h Breeze (Normal)',
    secondary_metric: '1008 hPa (Standard Pressure)',
    satellite_label: 'Zoom Earth & INSAT-3DR Real-Time Synoptic Observation',
    satellite_src: '/assets/normal_synoptic_india.jpg',
    description: 'System ARNAB has weakened and dissipated over the open sea into a remnant low-pressure trough. No severe cyclonic or coastal landfall threat exists along Indian coastlines. Routine coastal monitoring active.',
    hotspots: [
      { name: 'Balasore Coast', lat: 21.49, lon: 86.93, risk: 'All Clear · Normal Sea Conditions' },
      { name: 'Bhadrak / Dhamra', lat: 20.79, lon: 86.84, risk: 'All Clear · Standard Tide' },
      { name: 'Kendrapara', lat: 20.50, lon: 86.42, risk: 'All Clear · Safe Maritime Belt' },
      { name: 'Purba Medinipur', lat: 21.93, lon: 87.77, risk: 'All Clear · Nominal Weather' }
    ],
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 18,
      intensity_detail: '28 km/h gentle breeze + 1008 hPa normal atmospheric pressure',
      exposure_score: 15,
      exposure_detail: 'Coastal activities normal; zero evacuation or storm surge advisories',
      urgency_score: 10,
      urgency_detail: 'No landfall trajectory; system fully dissipated over open water',
      confidence_score: 99,
      confidence_detail: '4 Independent Satellites (Zoom Earth, Meteosat-IODC, Himawari, INSAT-3DR) confirm vortex collapse and absence of convective organization',
      plain_english: 'The AI classified Cyclonic System ARNAB as Inactive / De-escalated (Low Threat) because the vortex circulation has collapsed into a weak low-pressure trough with no coastal threat to India.',
      plain_hindi: 'एआई ने चक्रवाती प्रणाली अर्नब को निष्क्रिय / शांत (कम खतरा) के रूप में वर्गीकृत किया है क्योंकि चक्रवात का भंवर पूरी तरह समाप्त हो चुका है और भारतीय तटों पर कोई खतरा नहीं है।'
    }
  }
];

/**
 * Filters out threats whose MHSI falls below the statutory threshold (< 20.0)
 * or marked as INACTIVE_MONITORING, sorting active threats descending by MHSI score.
 */
export function getActiveMultiHazards(rawList = DEFAULT_MULTI_HAZARDS) {
  const list = Array.isArray(rawList) ? rawList : DEFAULT_MULTI_HAZARDS;
  const filtered = list.filter(
    (h) => (h.mhsi_score || 0) >= MHSI_ACTIVE_THRESHOLD && h.status_code !== 'INACTIVE_MONITORING'
  );
  const activeList = filtered.length > 0 ? filtered : list;
  return [...activeList]
    .sort((a, b) => (b.mhsi_score || 0) - (a.mhsi_score || 0))
    .map((h, idx) => ({ ...h, severity_rank: idx + 1 }));
}

/**
 * Returns the highest severity active threat across the country.
 */
export function getTopHazard(rawList = DEFAULT_MULTI_HAZARDS) {
  const active = getActiveMultiHazards(rawList);
  return active.length > 0 ? active[0] : null;
}

/**
 * Returns any de-escalated / negligible hazards that have fallen below the threshold.
 */
export function getArchivedDeescalatedHazards(rawList = DEFAULT_MULTI_HAZARDS) {
  const list = Array.isArray(rawList) ? rawList : DEFAULT_MULTI_HAZARDS;
  return list.filter(
    (h) => (h.mhsi_score || 0) < MHSI_ACTIVE_THRESHOLD || h.status_code === 'INACTIVE_MONITORING'
  );
}
