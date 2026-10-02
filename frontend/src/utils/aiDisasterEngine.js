/**
 * Client-Side Autonomous AI Multi-Hazard Classifier & Specialized Strategic Action Planner Engine.
 * 
 * Provides:
 * 1. Multi-feature AI classification across disaster archetypes with SHAP-style attribution.
 * 2. Specialized operational action plans (T0-T2h, T2-T6h, T6-T24h, T24-T72h) tailored to the unique physics of each disaster.
 * 3. Dynamic What-If simulation physics calculation engine for real-time scenario modeling.
 * 4. ITU-T X.1303 CAP v1.2 XML emergency warning payload generator.
 */

export const DISASTER_CLASSES = [
  'LANDSLIDE_DEBRIS_FLOW',
  'TROPICAL_CYCLONE',
  'RIVERINE_FLOOD',
  'FOREST_WILDFIRE',
  'VOLCANIC_ANOMALY',
  'SEISMIC_EARTHQUAKE'
];

export const PRESET_DISASTERS = [
  {
    id: 'wayanad_landslide',
    title: 'Wayanad Meppadi Hillside Escarpment (2024 Event)',
    title_hi: 'वायनाड मेप्पाडी पहाड़ी ढलान भूस्खलन',
    region: 'Western Ghats, Wayanad District, Kerala',
    region_hi: 'पश्चिमी घाट, वायनाड जिला, केरल',
    category_hint: 'LANDSLIDE_DEBRIS_FLOW',
    icon: 'mountain',
    description: 'Torrential monsoon deluge (>310mm in 48 hours) saturated tea estate slopes above 32° gradient. Geotechnical sensors report pore-water pressure exceeding critical shear threshold. High risk of debris flow towards Chooralmala and Mundakkai.',
    description_hi: '48 घंटों में 310 मिमी से अधिक मूसलाधार बारिश ने 32° से अधिक ढलान पर चाय बागानों की मिट्टी को पूरी तरह संतृप्त कर दिया है। चूरलमाला और मुंडक्कई बस्तियों की ओर भीषण मलबा प्रवाह का खतरा है।',
    telemetry: {
      rainfall_48h_mm: 312.0,
      rainfall_rate_mmh: 45.0,
      soil_saturation_pct: 92.4,
      slope_angle_deg: 34.0,
      pore_pressure_kpa: 88.5,
      barometric_pressure_hpa: 985.0,
      wind_speed_kmh: 38.0,
      river_discharge_cusecs: 12000,
      thermal_power_mw: 0.0,
      seismic_pga_g: 0.02
    },
    what_if_defaults: {
      param1_name: 'Rainfall Rate (mm/hr)',
      param1_val: 45.0,
      param1_min: 10.0,
      param1_max: 120.0,
      param1_step: 1.0,
      param2_name: 'Slope Gradient (°)',
      param2_val: 34.0,
      param2_min: 15.0,
      param2_max: 55.0,
      param2_step: 1.0
    }
  },
  {
    id: 'cyclone_dana',
    title: "Severe Cyclonic Storm 'Dana' Approaching Odisha Coast",
    title_hi: "गंभीर चक्रवाती तूफान 'दाना' ओडिशा तट की ओर अग्रसर",
    region: 'Northwest Bay of Bengal (Approaching Dhamra / Puri)',
    region_hi: 'उत्तर-पश्चिम बंगाल की खाड़ी (धामरा / पुरी की ओर)',
    category_hint: 'TROPICAL_CYCLONE',
    icon: 'wind',
    description: 'Deep depression intensified into a severe cyclonic storm with central pressure 982 hPa and sustained core winds of 115 km/h. Coastal radar shows well-defined eye wall tracking northwest. Astronomical high tide overlaps landfall window.',
    description_hi: 'गहरे दबाव का क्षेत्र 982 hPa केंद्रीय वायुदाब और 115 किमी/घंटा हवाओं के साथ गंभीर चक्रवात में बदल गया है। खगोलीय उच्च ज्वार के साथ 2.4 मीटर समुद्री लहरों की चेतावनी जारी की गई है।',
    telemetry: {
      barometric_pressure_hpa: 982.0,
      wind_speed_kmh: 115.0,
      wind_gusts_kmh: 135.0,
      sea_surface_temp_c: 29.8,
      distance_to_coast_km: 85.0,
      storm_surge_projected_m: 2.4,
      rainfall_48h_mm: 180.0,
      soil_saturation_pct: 55.0,
      slope_angle_deg: 2.0,
      thermal_power_mw: 0.0,
      seismic_pga_g: 0.0
    },
    what_if_defaults: {
      param1_name: 'Central Pressure (hPa)',
      param1_val: 982.0,
      param1_min: 940.0,
      param1_max: 1005.0,
      param1_step: 1.0,
      param2_name: 'Distance to Coast (km)',
      param2_val: 85.0,
      param2_min: 0.0,
      param2_max: 250.0,
      param2_step: 5.0
    }
  },
  {
    id: 'brahmaputra_flood',
    title: 'Brahmaputra Valley Riverine Basin Surge & Dyke Overtopping',
    title_hi: 'ब्रह्मपुत्र घाटी नदी बेसिन जलभराव एवं तटबंध ओवरफ्लो',
    region: 'Upper Assam (Majuli - Kaziranga Riparian Belt)',
    region_hi: 'ऊपरी असम (माजुली - काजीरंगा तटवर्ती क्षेत्र)',
    category_hint: 'RIVERINE_FLOOD',
    icon: 'waves',
    description: 'Continuous precipitation in upper catchment has raised river stage to 1.6 meters above statutory danger level at Nematighat and Tezpur. Embankment dyke freeboard compromised. Upstream reservoir spillway gates open at 38,000 m³/s.',
    description_hi: 'नेमतीघाट और तेजपुर में नदी का जलस्तर खतरे के निशान से 1.6 मीटर ऊपर पहुंच गया है। तटबंधों पर पानी का अत्यधिक दबाव है। 28,000 हेक्टेयर से अधिक कृषि भूमि जलमग्न होने की आशंका है।',
    telemetry: {
      river_stage_above_danger_m: 1.6,
      river_discharge_cusecs: 42000,
      catchment_rain_mm: 145.0,
      embankment_freeboard_m: 0.4,
      submerged_hectares_est: 28400,
      soil_saturation_pct: 88.0,
      barometric_pressure_hpa: 998.0,
      wind_speed_kmh: 24.0,
      thermal_power_mw: 0.0,
      seismic_pga_g: 0.0
    },
    what_if_defaults: {
      param1_name: 'Dam Inflow / Discharge (cusecs)',
      param1_val: 42000.0,
      param1_min: 10000.0,
      param1_max: 90000.0,
      param1_step: 1000.0,
      param2_name: 'Embankment Freeboard Margin (m)',
      param2_val: 0.4,
      param2_min: -0.8,
      param2_max: 2.5,
      param2_step: 0.1
    }
  },
  {
    id: 'similipal_wildfire',
    title: 'Similipal Biosphere Reserve Dry Canopy Wildfire',
    title_hi: 'सिमलीपाल बायोस्फीयर रिज़र्व वनाग्नि संकट',
    region: 'Mayurbhanj District, Odisha',
    region_hi: 'मयूरभंज जिला, ओडिशा',
    category_hint: 'FOREST_WILDFIRE',
    icon: 'flame',
    description: 'Satellite MODIS/VIIRS registers 84 active thermal fire pixels with Fire Radiative Power (FRP) of 420 MW in core deciduous sal forest. High ambient temperature (41°C) and gusty winds are driving fast-moving crown fire.',
    description_hi: 'उपग्रह थर्मल सेंसर ने 420 मेगावाट विकिरण शक्ति के साथ 84 सक्रिय वनाग्नि हॉटस्पॉट दर्ज किए हैं। 41°C तापमान और 46 किमी/घंटा हवाओं के कारण आग तेजी से फैल रही है।',
    telemetry: {
      thermal_power_mw: 420.0,
      fuel_moisture_pct: 7.5,
      ambient_temp_c: 41.2,
      wind_speed_kmh: 46.0,
      relative_humidity_pct: 18.0,
      soil_saturation_pct: 12.0,
      rainfall_48h_mm: 0.0,
      barometric_pressure_hpa: 1004.0,
      seismic_pga_g: 0.0
    },
    what_if_defaults: {
      param1_name: 'Wind Velocity (km/h)',
      param1_val: 46.0,
      param1_min: 10.0,
      param1_max: 90.0,
      param1_step: 2.0,
      param2_name: 'Forest Fuel Moisture (%)',
      param2_val: 7.5,
      param2_min: 3.0,
      param2_max: 25.0,
      param2_step: 0.5
    }
  },
  {
    id: 'barren_volcano',
    title: 'Barren Island Caldera Thermal Anomaly & Ash Venting',
    title_hi: 'बैरन द्वीप ज्वालामुखी सक्रिय थर्मल वेंटिंग',
    region: 'Andaman Sea (138 km East of Port Blair)',
    region_hi: 'अंडमान सागर (पोर्ट ब्लेयर से 138 किमी पूर्व)',
    category_hint: 'VOLCANIC_ANOMALY',
    icon: 'activity',
    description: 'Sentinel-2 SWIR and TROPOMI sensors detect 142 MW thermal bloom from central caldera with SO2 aerosol plume column rising to 4.2 km. Continuous strombolian lava ejection along western fissure into sea.',
    description_hi: 'सेंटिनल-2 इन्फ्रारेड उपग्रह ने केंद्रीय काल्डेरा से 142 मेगावाट ताप उत्सर्जन और 4.2 किमी ऊंचाई तक सल्फर डाइऑक्साइड (SO2) गैस का बादल दर्ज किया है।',
    telemetry: {
      thermal_power_mw: 142.0,
      so2_column_du: 4.8,
      plume_height_km: 4.2,
      acoustic_tremor_hz: 3.4,
      barometric_pressure_hpa: 1006.0,
      wind_speed_kmh: 22.0,
      rainfall_48h_mm: 12.0,
      soil_saturation_pct: 40.0,
      seismic_pga_g: 0.05
    },
    what_if_defaults: {
      param1_name: 'Thermal Radiative Power (MW)',
      param1_val: 142.0,
      param1_min: 20.0,
      param1_max: 500.0,
      param1_step: 10.0,
      param2_name: 'Ash Plume Height (km)',
      param2_val: 4.2,
      param2_min: 1.0,
      param2_max: 15.0,
      param2_step: 0.5
    }
  },
  {
    id: 'himalayan_earthquake',
    title: 'Himalayan Main Boundary Thrust (MBT) Seismic Rupture',
    title_hi: 'हिमालयन मेन बाउंड्री थ्रस्ट भूकंपीय विखंडन',
    region: 'Uttarakhand / Garhwal Seismic Belt',
    region_hi: 'उत्तराखंड / गढ़वाल भूकंपीय क्षेत्र',
    category_hint: 'SEISMIC_EARTHQUAKE',
    icon: 'zap',
    description: 'Strong motion accelerometer network detects Mw 6.4 tectonic rupture along Main Boundary Thrust at 14 km focal depth. Peak Ground Acceleration (PGA) measured at 0.38g in Rudraprayag and Chamoli.',
    description_hi: '14 किमी गहराई पर मेन बाउंड्री थ्रस्ट में Mw 6.4 तीव्रता का भूकंप दर्ज किया गया। रुद्रप्रयाग और चमोली में अधिकतम भू-त्वरण (PGA) 0.38g मापा गया।',
    telemetry: {
      seismic_magnitude_mw: 6.4,
      focal_depth_km: 14.0,
      seismic_pga_g: 0.38,
      mmi_intensity: 7.5,
      aftershock_count_1h: 12,
      barometric_pressure_hpa: 1008.0,
      wind_speed_kmh: 14.0,
      rainfall_48h_mm: 25.0,
      soil_saturation_pct: 52.0,
      thermal_power_mw: 0.0
    },
    what_if_defaults: {
      param1_name: 'Moment Magnitude (Mw)',
      param1_val: 6.4,
      param1_min: 4.5,
      param1_max: 8.5,
      param1_step: 0.1,
      param2_name: 'Hypocentral Focal Depth (km)',
      param2_val: 14.0,
      param2_min: 5.0,
      param2_max: 60.0,
      param2_step: 1.0
    }
  }
];

export function classifyDisaster(text = '', telemetry = {}, categoryHint = null) {
  const t = telemetry || {};
  const lower = (text || '').toLowerCase();

  const scores = {
    LANDSLIDE_DEBRIS_FLOW: 0.05,
    TROPICAL_CYCLONE: 0.05,
    RIVERINE_FLOOD: 0.05,
    FOREST_WILDFIRE: 0.05,
    VOLCANIC_ANOMALY: 0.05,
    SEISMIC_EARTHQUAKE: 0.05
  };

  const attributions = [];

  // Landslide features
  const soilSat = Number(t.soil_saturation_pct || 0);
  const rain48h = Number(t.rainfall_48h_mm || 0);
  const slope = Number(t.slope_angle_deg || 0);
  const poreKpa = Number(t.pore_pressure_kpa || 0);

  if (soilSat > 70 || rain48h > 140 || slope > 25 || poreKpa > 45) {
    const w = (soilSat / 100) * 0.45 + Math.min(1.0, rain48h / 250) * 0.35 + Math.min(1.0, slope / 40) * 0.20;
    scores.LANDSLIDE_DEBRIS_FLOW += w * 2.8;
    attributions.push({
      feature: 'Soil Pore Saturation & Slope Shear',
      feature_hi: 'मृदा छिद्र संतृप्ति एवं ढलान अपरूपण',
      value: `${soilSat.toFixed(1)}% sat, ${rain48h.toFixed(0)}mm rain`,
      weight: Math.round(w * 100) / 100,
      target: 'LANDSLIDE_DEBRIS_FLOW',
      impact: 'High Geotechnical Instability'
    });
  }

  // Cyclone features
  const windKmh = Number(t.wind_speed_kmh || 0);
  const pressHpa = Number(t.barometric_pressure_hpa || 1013);

  if (windKmh > 65 || pressHpa < 995) {
    const w = Math.min(1.0, (windKmh - 50) / 100) * 0.55 + Math.max(0.0, (1013 - pressHpa) / 40) * 0.45;
    scores.TROPICAL_CYCLONE += w * 3.0;
    attributions.push({
      feature: 'Barometric Depression & Core Wind Vortex',
      feature_hi: 'वायुमंडलीय दबाव ह्रास एवं चक्रवाती हवाएं',
      value: `${pressHpa.toFixed(1)} hPa, ${windKmh.toFixed(0)} km/h`,
      weight: Math.round(w * 100) / 100,
      target: 'TROPICAL_CYCLONE',
      impact: 'Severe Cyclonic Vortex'
    });
  }

  // Flood features
  const riverStage = Number(t.river_stage_above_danger_m || 0);
  const discharge = Number(t.river_discharge_cusecs || 0);
  const freeboard = Number(t.embankment_freeboard_m || 99);

  if (riverStage > 0.4 || discharge > 20000 || freeboard < 1.0) {
    const w = Math.min(1.0, riverStage / 2.0) * 0.50 + Math.min(1.0, discharge / 50000) * 0.35 + Math.max(0.0, 1.0 - freeboard) * 0.15;
    scores.RIVERINE_FLOOD += w * 2.9;
    attributions.push({
      feature: 'River Stage Delta & Catchment Runoff',
      feature_hi: 'नदी जलस्तर वृद्धि एवं जलग्रहण अपवाह',
      value: `+${riverStage.toFixed(2)}m above mark, ${discharge.toLocaleString()} cusecs`,
      weight: Math.round(w * 100) / 100,
      target: 'RIVERINE_FLOOD',
      impact: 'Riparian Embankment Inundation'
    });
  }

  // Wildfire features
  const thermalMw = Number(t.thermal_power_mw || 0);
  const fuelMoist = Number(t.fuel_moisture_pct || 100);
  const ambientC = Number(t.ambient_temp_c || 25);

  if ((thermalMw > 150 && fuelMoist < 15) || ambientC > 38) {
    const w = Math.min(1.0, thermalMw / 400) * 0.60 + Math.max(0.0, (20 - fuelMoist) / 20) * 0.40;
    scores.FOREST_WILDFIRE += w * 3.0;
    attributions.push({
      feature: 'Fire Radiative Power & Canopy Fuel Dryness',
      feature_hi: 'वनाग्नि विकिरण शक्ति एवं ईंधन शुष्कता',
      value: `${thermalMw.toFixed(0)} MW, ${fuelMoist.toFixed(1)}% moisture`,
      weight: Math.round(w * 100) / 100,
      target: 'FOREST_WILDFIRE',
      impact: 'Rapid Canopy Front Spread'
    });
  }

  // Volcanic features
  const so2Du = Number(t.so2_column_du || 0);
  const plumeKm = Number(t.plume_height_km || 0);

  if ((thermalMw > 50 && so2Du > 2.0) || plumeKm > 2.0) {
    const w = Math.min(1.0, so2Du / 6.0) * 0.50 + Math.min(1.0, plumeKm / 8.0) * 0.50;
    scores.VOLCANIC_ANOMALY += w * 3.2;
    attributions.push({
      feature: 'SO₂ Plume Column & Caldera Thermal Bloom',
      feature_hi: 'सल्फर डाइऑक्साइड गैस एवं थर्मल विकिरण',
      value: `${so2Du.toFixed(1)} DU SO₂, ${plumeKm.toFixed(1)} km ash plume`,
      weight: Math.round(w * 100) / 100,
      target: 'VOLCANIC_ANOMALY',
      impact: 'Magmatic / Hydrothermal Vent'
    });
  }

  // Earthquake features
  const pgaG = Number(t.seismic_pga_g || 0);
  const magMw = Number(t.seismic_magnitude_mw || 0);

  if (pgaG > 0.10 || magMw > 5.0) {
    const w = Math.min(1.0, pgaG / 0.50) * 0.60 + Math.max(0.0, (magMw - 4.5) / 3.0) * 0.40;
    scores.SEISMIC_EARTHQUAKE += w * 3.5;
    attributions.push({
      feature: 'Peak Ground Acceleration (PGA) & Mw Energy',
      feature_hi: 'अधिकतम भू-त्वरण (PGA) एवं ऊर्जा',
      value: `${pgaG.toFixed(2)}g PGA, Mw ${magMw.toFixed(1)}`,
      weight: Math.round(w * 100) / 100,
      target: 'SEISMIC_EARTHQUAKE',
      impact: 'Crustal Tectonic Rupture'
    });
  }

  // Multilingual NLP Keywords
  const nlpMap = {
    LANDSLIDE_DEBRIS_FLOW: ['landslide', 'mudslip', 'debris flow', 'slope', 'भूस्खलन', 'मलबा'],
    TROPICAL_CYCLONE: ['cyclone', 'storm surge', 'eye wall', 'typhoon', 'चक्रवात', 'महातूफान'],
    RIVERINE_FLOOD: ['flood', 'inundat', 'river stage', 'overtop', 'dyke', 'बाढ़', 'जलभराव'],
    FOREST_WILDFIRE: ['wildfire', 'forest fire', 'canopy blaze', 'दावानल', 'जंगल की आग'],
    VOLCANIC_ANOMALY: ['volcano', 'caldera', 'lava', 'ash plume', 'ज्वालामुखी', 'राख'],
    SEISMIC_EARTHQUAKE: ['earthquake', 'tremor', 'seismic', 'aftershock', 'भूकंप', 'झटके']
  };

  Object.entries(nlpMap).forEach(([cls, words]) => {
    let matches = 0;
    words.forEach(w => {
      if (lower.includes(w)) matches++;
    });
    if (matches > 0) {
      scores[cls] += matches * 0.85;
      attributions.push({
        feature: 'Natural Language Semantic Token Match',
        feature_hi: 'प्राकृतिक भाषा कीवर्ड समानता',
        value: `${matches} contextual keywords`,
        weight: Math.round(Math.min(1.0, matches * 0.35) * 100) / 100,
        target: cls,
        impact: 'Field Text Correlation'
      });
    }
  });

  if (categoryHint && scores[categoryHint] !== undefined) {
    scores[categoryHint] += 1.5;
  }

  // Softmax normalization
  const maxS = Math.max(...Object.values(scores));
  const expEntries = Object.entries(scores).map(([cls, val]) => [cls, Math.exp(val - maxS)]);
  const sumExp = expEntries.reduce((acc, [, val]) => acc + val, 0);
  const probs = {};
  expEntries.forEach(([cls, val]) => {
    probs[cls] = Math.round((val / sumExp) * 1000) / 10;
  });

  const sorted = Object.entries(probs).sort((a, b) => b[1] - a[1]);
  const bestClass = sorted[0][0];
  const confidence = sorted[0][1];

  let mhsi = 50.0;
  if (bestClass === 'LANDSLIDE_DEBRIS_FLOW') {
    mhsi = Math.min(98.0, Math.max(25.0, soilSat * 0.40 + rain48h * 0.15 + slope * 0.40));
  } else if (bestClass === 'TROPICAL_CYCLONE') {
    mhsi = Math.min(99.0, Math.max(20.0, windKmh * 0.50 + Math.max(0, 1013 - pressHpa) * 1.2));
  } else if (bestClass === 'RIVERINE_FLOOD') {
    mhsi = Math.min(95.0, Math.max(25.0, riverStage * 30.0 + (discharge / 1000) * 0.8));
  } else if (bestClass === 'FOREST_WILDFIRE') {
    mhsi = Math.min(94.0, Math.max(25.0, thermalMw / 5.0 + (100 - fuelMoist) * 0.3));
  } else if (bestClass === 'VOLCANIC_ANOMALY') {
    mhsi = Math.min(88.0, Math.max(20.0, thermalMw / 4.0 + so2Du * 8.0));
  } else if (bestClass === 'SEISMIC_EARTHQUAKE') {
    mhsi = Math.min(99.0, Math.max(30.0, pgaG * 140.0 + magMw * 6.0));
  }
  mhsi = Math.round(mhsi * 10) / 10;

  let alertTier = 'LEVEL_0_GREEN_NORMAL';
  let alertLabel = 'GREEN NORMAL (De-escalated / Controlled)';
  let alertLabelHi = 'सामान्य स्थिति (नियंत्रण में)';
  let badgeColor = 'bg-emerald-600';

  if (mhsi >= 65.0) {
    alertTier = 'LEVEL_3_RED_CRISIS';
    alertLabel = 'RED ALERT (Immediate Emergency Protocols Active)';
    alertLabelHi = 'रेड अलर्ट (तत्काल आपातकालीन प्रोटोकॉल सक्रिय)';
    badgeColor = 'bg-red-600';
  } else if (mhsi >= 40.0) {
    alertTier = 'LEVEL_2_ORANGE_ADVISORY';
    alertLabel = 'ORANGE ADVISORY (Tactical Mobilization Staging)';
    alertLabelHi = 'ऑरेंज परामर्श (रणनीतिक तैनाती तैयारी)';
    badgeColor = 'bg-orange-600';
  } else if (mhsi >= 20.0) {
    alertTier = 'LEVEL_1_YELLOW_WATCH';
    alertLabel = 'YELLOW WATCH (Guarded Surveillance Active)';
    alertLabelHi = 'येलो वॉच (सतर्क निगरानी सक्रिय)';
    badgeColor = 'bg-amber-500';
  }

  const relevantAttr = attributions.filter(a => a.target === bestClass || a.weight >= 0.40);
  if (relevantAttr.length === 0) {
    relevantAttr.push({
      feature: 'Multi-Sensor Synoptic Convergence',
      feature_hi: 'मल्टी-सेंसर मौसमी अभिसरण',
      value: 'Telemetry signatures align with historical hazard baseline',
      weight: 0.85,
      impact: 'Composite Risk Match'
    });
  }

  return {
    classified_class: bestClass,
    confidence_pct: confidence,
    mhsi_score: mhsi,
    alert_tier: alertTier,
    alert_label: alertLabel,
    alert_label_hi: alertLabelHi,
    badge_color: badgeColor,
    class_probabilities: probs,
    feature_attributions: relevantAttr.slice(0, 4)
  };
}

export function synthesizeIndividualMitigationPlan(classifiedClass, mhsiScore, telemetry = {}, locationName = 'Target Operational Sector') {
  if (classifiedClass === 'LANDSLIDE_DEBRIS_FLOW') {
    return {
      disaster_name: 'Hillside Slope Instability & Debris Torrent',
      disaster_name_hi: 'पहाड़ी ढलान अस्थिरता एवं तीव्र मलबा प्रवाह',
      hazard_mechanics: 'Hydraulic pore-water pressure exceeds Mohr-Coulomb shear strength of topsoil layer, triggering planar or rotational slippage channelizing into viscous debris torrent.',
      hazard_mechanics_hi: 'मिट्टी में अत्यधिक जलभराव से ढलान का सुरक्षित कोण नष्ट हो गया है, जिससे भारी मलबा, पत्थर और पेड़ घाटियों की ओर तीव्र गति से बह रहे हैं।',
      primary_threat_vectors: [
        'Debris runout velocity reaching 25-45 km/h along valley channels',
        'Damming of natural river channels forming temporary catastrophic flash reservoirs',
        'Shear cracking across tea estates and arterial mountain bridges',
        'Secondary liquefaction triggered by sustained precipitation'
      ],
      primary_threat_vectors_hi: [
        'घाटियों में 25-45 किमी/घंटा की गति से मलबा प्रवाह',
        'नदी नालों के अवरुद्ध होने से अस्थायी बाढ़ का खतरा',
        'पर्वतीय संपर्क पुलों और चाय बागानों में दरारें',
        'लगातार बारिश से द्वितीयक ढलान भूस्खलन'
      ],
      phases: [
        {
          phase_id: 'T0_T2',
          timeframe: 'T - 0h to T + 2h',
          title: 'Immediate Life Safety & Zoned Evacuation',
          title_hi: 'जीवन सुरक्षा एवं तत्काल क्षेत्र निकासी',
          actions: [
            'Sound localized pneumatic sirens (continuous 3-minute pulse) across vulnerable downslope settlements.',
            'Enforce immediate mandatory evacuation of Chooralmala/Mundakkai valley floor within 400m of stream bed.',
            'Block all non-emergency traffic at foothill checkpoints (Vythiri / Meppadi access roads).',
            'Issue CAP v1.2 Cell Broadcast to all IMSI numbers connected to local base transceivers.'
          ],
          actions_hi: [
            'निचली बस्तियों में तुरंत 3 मिनट का निरंतर आपातकालीन सायरन बजाएं।',
            'नदी तट से 400 मीटर के भीतर सभी निवासियों की अनिवार्य निकासी सुनिश्चित करें।',
            'पहाड़ी प्रवेश मार्गों पर गैर-आपातकालीन वाहनों की आवाजाही तुरंत रोकें।',
            'स्थानीय मोबाइल टावरों से जुड़े सभी फोन पर सीएपी आपातकालीन संदेश प्रसारित करें।'
          ]
        },
        {
          phase_id: 'T2_T6',
          timeframe: 'T + 2h to T + 6h',
          title: 'Tactical Search & Heavy Hardware Deployment',
          title_hi: 'रणनीतिक खोज एवं भारी मशीनरी तैनाती',
          actions: [
            'Deploy 4 NDRF battalions equipped with high-mobility tracked hydraulic excavators and synthetic winch ropes.',
            'Mobilize Army Engineering Task Force (Madras Sappers) for immediate Bailey Bridge installation over severed river crossings.',
            'Deploy search-and-rescue K9 cadaver/live detection units and ground-penetrating radar (GPR).',
            'Establish forward medical triage point at Meppadi Community Health Centre.'
          ],
          actions_hi: [
            'हाइड्रोलिक एक्सकेवेटर और विंच रस्सियों से लैस 4 एनडीआरएफ बटालियन तैनात करें।',
            'टूटे हुए पुलों पर त्वरित बेली ब्रिज स्थापित करने हेतु सेना इंजीनियर्स को लगाएं।',
            'मलबे में दबे जीवित व्यक्तियों की खोज हेतु के9 श्वान दस्ते और रडार तैनात करें।',
            'मेप्पाडी सामुदायिक स्वास्थ्य केंद्र में अग्रिम मेडिकल ट्राइएज प्वाइंट बनाएं।'
          ]
        },
        {
          phase_id: 'T6_T24',
          timeframe: 'T + 6h to T + 24h',
          title: 'Lifeline Clearance & Humanitarian Relief',
          title_hi: 'मार्ग बहाली एवं मानवीय राहत आपूर्ति',
          actions: [
            'Clear debris choke points using simultaneous 2-point excavator operations to restore road access.',
            'Air-drop dry food packets, purification tablets, and satellite phones to stranded high-altitude pockets.',
            'Deploy Mobile Cell-on-Wheels (COW) units to re-establish emergency telecom links.',
            'De-energize 11kV high-tension power lines running through the debris zone to prevent electrocution.'
          ],
          actions_hi: [
            'दोहरे उत्खनन अभियान द्वारा मुख्य संपर्क मार्ग से मलबा हटाकर सड़क चालू करें।',
            'अलग-थलग पड़ी बस्तियों में हेलीकॉप्टर से सूखा भोजन, क्लोरीन गोलियां और सेटेलाइट फोन गिराएं।',
            'आपातकालीन संचार बहाली हेतु मोबाइल सेल-ऑन-व्हील्स (COW) वैन लगाएं।',
            'बिजली के झटके से बचाव हेतु मलबे वाले क्षेत्र की 11kV विद्युत लाइनें बंद रखें।'
          ]
        },
        {
          phase_id: 'T24_T72',
          timeframe: 'T + 24h to T + 72h',
          title: 'Cascading Risk Prevention & Geological Survey',
          title_hi: 'द्वितीयक जोखिम रोकथाम एवं भूगर्भीय सर्वेक्षण',
          actions: [
            'Conduct UAV LiDAR flights to detect upstream debris damming and prevent secondary flash flooding.',
            'Install piezometric pore-pressure boreholes to monitor residual water dissipation.',
            'Relocate all displaced families to designated permanent cyclone/monsoon concrete shelters.',
            'Initiate post-disaster geotechnical slope stabilization with hydro-seeding and wire-mesh gabions.'
          ],
          actions_hi: [
            'ऊपरी धारा में मलबे के बांध की जांच के लिए ड्रोन लिडार सर्वेक्षण करें।',
            'मिट्टी की जल निकासी पर नजर रखने हेतु पीजोमीटर सेंसर स्थापित करें।',
            'विस्थापित परिवारों को सुरक्षित पक्के राहत शिविरों में स्थानांतरित करें।',
            'ढलानों को सुरक्षित करने हेतु वायर मेश गेबियन और जियो-टेक्सटाइल का कार्य शुरू करें।'
          ]
        }
      ],
      resources: {
        ndrf_battalions: 6,
        heavy_excavators: 18,
        bailey_bridges_staged: 2,
        uav_drones_active: 8,
        potable_water_liters: 85000,
        trauma_medical_tents: 4
      },
      directives: {
        en: `DIRECTIVE TO DISTRICT DISASTER AUTHORITY (${locationName}): Enforce Section 144 around designated red-zone hillsides. Mobilize all registered earth-moving machinery under Disaster Management Act 2005. Stage Indian Army engineering units for immediate bridging operations.`,
        hi: `जिला आपदा प्रबंधन प्राधिकरण को निर्देश (${locationName}): चिन्हित रेड-ज़ोन पहाड़ियों के आसपास तत्काल धारा 144 लागू करें। आपदा प्रबंधन अधिनियम 2005 के तहत सभी उपलब्ध उत्खनन मशीनों को जुटाएं और सेना इंजीनियरिंग कोर को बेली ब्रिज निर्माण हेतु तैनात करें।`
      }
    };
  }

  if (classifiedClass === 'TROPICAL_CYCLONE') {
    return {
      disaster_name: 'Severe Tropical Cyclone & Coastal Surge',
      disaster_name_hi: 'गंभीर उष्णकटिबंधीय चक्रवात एवं समुद्री ज्वारीय लहर',
      hazard_mechanics: 'Deep atmospheric depression driven by latent heat release over warm sea surface (>28°C), generating concentric gale wind fields and dangerous astronomical storm surge inundation.',
      hazard_mechanics_hi: 'गर्म समुद्री सतह पर कम दबाव प्रणाली द्वारा ऊर्जा ग्रहण करने से प्रचंड चक्रवाती हवाएं और समुद्र की खगोलीय ज्वारीय लहरें तटीय क्षेत्रों में प्रवेश कर रही हैं।',
      primary_threat_vectors: [
        'Destructive core wind gusts exceeding 135 km/h tearing unreinforced roofs',
        'Coastal storm surge of 2.0 - 3.5m overtopping saline embankments',
        'Widespread electrical grid disruption and falling tree strikes',
        'Inland flash flooding from extreme precipitation rainbands'
      ],
      primary_threat_vectors_hi: [
        '135 किमी/घंटा से अधिक की हवाएं जो कच्चे घरों को नुकसान पहुंचा सकती हैं',
        'तटबंधों को पार करने वाली 2.0 से 3.5 मीटर ऊंची समुद्री लहरें',
        'विद्युत ट्रांसमिशन टावरों और पेड़ों का बड़े पैमाने पर गिरना',
        'मूसलाधार चक्रवाती बारिश से तटीय व आंतरिक इलाकों में जलभराव'
      ],
      phases: [
        {
          phase_id: 'T0_T2',
          timeframe: 'T - 0h to T + 2h',
          title: 'Harbor Lockdown & Maritime Evacuation',
          title_hi: 'बंदरगाह लॉकडाउन एवं समुद्री नौका वापसी',
          actions: [
            'Hoisting of Great Danger Signal #10 at Paradip, Dhamra, and Gopalpur ports.',
            'Complete recall of all motorized fishing trawlers; enforce total ban on sea entry.',
            'Broadcast CAP Emergency Alerts to all mobile subscribers in coastal panchayats within 15 km of shoreline.',
            'Initiate zero-casualty priority evacuation of elderly, pregnant women, and children to Multipurpose Cyclone Shelters.'
          ],
          actions_hi: [
            'तटीय बंदरगाहों पर महान खतरे का सिग्नल #10 फहराएं।',
            'सभी मछली पकड़ने वाली नौकाओं को तुरंत वापस बुलाएं और समुद्र में जाने पर पूर्ण प्रतिबंध लगाएं।',
            'तट से 15 किमी के भीतर सभी मोबाइल फोन पर सीएपी आपातकालीन चेतावनी भेजें।',
            'बुजुर्गों, गर्भवती महिलाओं और बच्चों को पक्के चक्रवात आश्रय स्थलों में पहुंचाएं।'
          ]
        },
        {
          phase_id: 'T2_T6',
          timeframe: 'T + 2h to T + 6h',
          title: 'Mass Evacuation & Power Grid Isolation',
          title_hi: 'सामूहिक सुरक्षित निकासी एवं ग्रिड शटडाउन',
          actions: [
            'Complete evacuation of 250,000+ residents living in thatched/asbestos houses within the 10 km surge zone.',
            'Pre-emptively de-energize 33kV and 11kV coastal sub-stations 3 hours prior to gale-force winds.',
            'Position quick-clearing road teams armed with chainsaw cutters at 5 km intervals along NH-16.',
            'Secure automated diesel generators at district hospitals and oxygen generation plants.'
          ],
          actions_hi: [
            '10 किमी ज्वार क्षेत्र में कच्चे मकानों में रहने वाले 2.5 लाख लोगों को सुरक्षित आश्रय स्थलों में पहुंचाएं।',
            'तेज हवाएं शुरू होने से 3 घंटे पहले तटीय सब-स्टेशनों की बिजली आपूर्ति बंद करें।',
            'राष्ट्रीय राजमार्ग पर हर 5 किमी पर चेनसॉ कटर से लैस मार्ग बहाली दल तैनात करें।',
            'जिला अस्पतालों और ऑक्सीजन संयंत्रों में डीजल जनरेटर ईंधन की आपूर्ति सुनिश्चित करें।'
          ]
        },
        {
          phase_id: 'T6_T24',
          timeframe: 'T + 6h to T + 24h',
          title: 'Landfall Management & Eye-Wall Passage',
          title_hi: 'लैंडफॉल प्रबंधन एवं आई-वॉल चक्रवात कमान',
          actions: [
            'Strict lockdown: Zero human or vehicle movement during eye-wall passage and deceptive eye calm.',
            'Deploy amphibious tracked rescue vehicles for trapped coastal hamlets cut off by tidal surge.',
            'Mobilize water tankers with chlorine dosing to prevent brackish water disease outbreak.',
            'Track post-landfall decay and issue inland flash flood warnings for downstream river basins.'
          ],
          actions_hi: [
            'आई-वॉल और आंख के शांत समय के दौरान नागरिकों की आवाजाही पर पूर्ण प्रतिबंध रखें।',
            'ज्वारीय पानी में फंसे तटीय गांवों हेतु उभयचर (एम्फिबियस) बचाव वाहन तैनात करें।',
            'पीने के पानी में क्लोरीन मिलाकर टैंकरों द्वारा सुरक्षित पेयजल की आपूर्ति करें।',
            'आंतरिक जिलों में नदी बेसिन के लिए भारी बारिश एवं बाढ़ की चेतावनी जारी करें।'
          ]
        },
        {
          phase_id: 'T24_T72',
          timeframe: 'T + 24h to T + 72h',
          title: 'Restoration, Power Energization & Compensation Survey',
          title_hi: 'विद्युत व सड़क बहाली एवं क्षतिपूर्ति सर्वेक्षण',
          actions: [
            'Restore primary arterial highways and remove fallen trees within 12 hours of landfall.',
            'Conduct drone surveys to calculate crop salinity damage and structural housing collapse.',
            'Inspect sub-stations for moisture and systematically re-energize residential power grids.',
            'Distribute disaster relief compensation packets via direct benefit transfer (DBT).'
          ],
          actions_hi: [
            'लैंडफॉल के 12 घंटे के भीतर मुख्य राष्ट्रीय व राज्य राजमार्गों से गिरे पेड़ हटाएं।',
            'फसल और घरों के नुकसान का आकलन करने हेतु ड्रोन सर्वेक्षण करें।',
            'सब-स्टेशनों की जांच के बाद चरणबद्ध तरीके से बिजली आपूर्ति बहाल करें।',
            'प्रभावित नागरिकों को डीबीटी के माध्यम से त्वरित राहत राशि का वितरण करें।'
          ]
        }
      ],
      resources: {
        ndrf_battalions: 14,
        cyclone_shelters_active: 450,
        inflatable_gemini_boats: 65,
        chainsaw_tree_cutters: 240,
        mobile_diesel_generators: 85,
        packaged_dry_rations: 300000
      },
      directives: {
        en: `OPERATIONAL DISASTER ORDER (${locationName}): Enforce mandatory evacuation along entire vulnerable coastline. Prohibit all maritime operations. Power utility DISCOM to initiate staggered shutdown of coastal grids prior to gale wind onset.`,
        hi: `कमान आपदा निर्देश (${locationName}): पूरी तटीय पट्टी पर अनिवार्य निकासी सुनिश्चित करें। सभी समुद्री और मछली पकड़ने की गतिविधियों पर पूर्ण प्रतिबंध लगाएं। 60 किमी/घंटा से अधिक हवा की गति होने से पूर्व विद्युत ग्रिड बंद करें।`
      }
    };
  }

  if (classifiedClass === 'RIVERINE_FLOOD') {
    return {
      disaster_name: 'Riverine Basin Inundation & Embankment Breach',
      disaster_name_hi: 'नदी घाटी जलभराव एवं तटबंध विखंडन संकट',
      hazard_mechanics: 'Catchment deluge exceeds river channel carrying capacity, causing hydraulic backwater pressure and structural failure of earthen dykes.',
      hazard_mechanics_hi: 'ऊपरी जलग्रहण क्षेत्र में अत्यधिक वर्षा से नदी की वहन क्षमता पार हो गई है, जिससे तटबंधों पर तीव्र दबाव बन रहा है।',
      primary_threat_vectors: [
        'Sudden dyke breach creating catastrophic wall of water in rural habitations',
        'Prolonged waterlogging isolating island populations (e.g. Majuli)',
        'Contamination of groundwater aquifers causing waterborne cholera/diarrhea',
        'Destruction of standing paddy crops and livestock mortality'
      ],
      primary_threat_vectors_hi: [
        'तटबंध टूटने से गांवों में अचानक तीव्र जल प्रवाह',
        'नदी द्वीपों और बस्तियों का लंबे समय तक संपर्क टूटना',
        'पेयजल स्रोतों के दूषित होने से हैजा व डायरिया का खतरा',
        'खड़ी फसलों का विनाश और पशुधन का नुकसान'
      ],
      phases: [
        {
          phase_id: 'T0_T2',
          timeframe: 'T - 0h to T + 2h',
          title: 'Embankment Patrol & Alert Warning',
          title_hi: 'तटबंध सुरक्षा गश्त एवं ग्राम स्तर चेतावनी',
          actions: [
            'Deploy 24x7 geotechnical foot-patrols along flood embankments to identify boiling and seepage points.',
            'Pre-position 50,000 geo-textile sandbags and wooden pilings at critical embankment spurs.',
            'Trigger early warning siren at all riverside revenue villages.',
            'Coordinate with Central Water Commission (CWC) for upstream dam discharge throttling.'
          ],
          actions_hi: [
            'तटबंधों पर रिसाव देखने के लिए 24x7 पैदल गश्ती दल तैनात करें।',
            'संवेदनशील स्थानों पर 50,000 जियो-टेक्सटाइल सैंडबैग पहले से रखें।',
            'तटीय गांवों में तत्काल आपातकालीन सायरन बजाकर सतर्क करें।',
            'केंद्रीय जल आयोग से समन्वय कर बांधों से पानी छोड़ने की मात्रा नियंत्रित करें।'
          ]
        },
        {
          phase_id: 'T2_T6',
          timeframe: 'T + 2h to T + 6h',
          title: 'Water Rescue & High-Ground Evacuation',
          title_hi: 'जल बचाव एवं उच्च भूमि पर सुरक्षित स्थानांतरण',
          actions: [
            'Deploy 35 inflatable OBM Gemini rescue boats for immediate evacuation of marooned river islands.',
            'Shift vulnerable population and cattle to designated highland raised platforms (Highlands/Chaporis).',
            'Set up community kitchens (Langar) supplying warm cooked meals and baby food.',
            'Stage Indian Air Force Mi-17 helicopters for emergency winching operations.'
          ],
          actions_hi: [
            'टापुओं पर फंसे ग्रामीणों को निकालने हेतु 35 जेमिनी मोटर बोट तैनात करें।',
            'ग्रामीणों व पशुओं को ऊंचे बाढ़ सुरक्षा टीलों पर स्थानांतरित करें।',
            'राहत शिविरों में गर्म भोजन और बच्चों हेतु दूध की व्यवस्था करें।',
            'आपातकालीन बचाव हेतु वायुसेना के हेलीकॉप्टरों को तैयार रखें।'
          ]
        },
        {
          phase_id: 'T6_T24',
          timeframe: 'T + 6h to T + 24h',
          title: 'Breach Plugging & Medical Disinfection',
          title_hi: 'तटबंध दरार मरम्मत एवं जल शोधन',
          actions: [
            'Execute emergency dyke plugging using gabion boulder crates and geo-synthetic mattresses.',
            'Deploy high-capacity dewatering axial pumps (1000 GPM) to drain water from hospitals and substations.',
            'Distribute chlorine halogen tablets and ORS sachets across all relief camps.',
            'Launch mobile medical boat clinics staffed with pediatric and epidemiological doctors.'
          ],
          actions_hi: [
            'गेबियन बोल्डर और भारी सैंडबैग डालकर टूटे तटबंधों की तुरंत मरम्मत करें।',
            'अस्पतालों और सब-स्टेशनों से पानी निकालने हेतु उच्च क्षमता वाले डी-वॉटरिंग पंप लगाएं।',
            'सभी राहत शिविरों में ओआरएस और क्लोरीन की गोलियां वितरित करें।',
            'नदी के रास्ते चिकित्सा सहायता पहुंचाने हेतु मेडिकल बोट क्लीनिक शुरू करें।'
          ]
        },
        {
          phase_id: 'T24_T72',
          timeframe: 'T + 24h to T + 72h',
          title: 'Receding Water Sanitation & Vector Control',
          title_hi: 'जल निकासी पश्चात स्वच्छता एवं रोग नियंत्रण',
          actions: [
            'Spray bleaching powder and malathion fogging to prevent post-flood dengue and malaria outbreaks.',
            'Conduct carcass disposal protocol with deep limestone burial to prevent bacterial contamination.',
            'Begin structural integrity audit of flooded road bridges and railway culverts.',
            'Initiate satellite Sentinel-1 SAR flood extent mapping for agricultural loss evaluation.'
          ],
          actions_hi: [
            'मच्छर जनित रोगों से बचाव हेतु ब्लीचिंग पाउडर और कीटनाशक फॉगिंग करें।',
            'मृत पशुओं का चूने के साथ सुरक्षित गहरा दफन सुनिश्चित करें।',
            'बाढ़ से प्रभावित पुलों और रेल पटरियों की सुरक्षा जांच करें।',
            'फसल नुकसान के मुआवजे हेतु उपग्रह आधारित जलभराव मानचित्रण करें।'
          ]
        }
      ],
      resources: {
        inflatable_gemini_boats: 45,
        high_capacity_dewatering_pumps: 30,
        geo_sandbags_staged: 120000,
        mobile_water_treatment_units: 8,
        halogen_chlorine_tabs: 500000,
        veterinary_fodder_camps: 12
      },
      directives: {
        en: `HYDROLOGICAL CRISIS DIRECTIVE (${locationName}): Implement immediate breach reinforcement along vulnerable river bends. Position SDRF boat flotilla for immediate island rescue. CWC gauge operators to report stage delta hourly.`,
        hi: `जल संकट कमान निर्देश (${locationName}): संवेदनशील तटबंधों पर तत्काल सैंडबैग सुदृढ़ीकरण लागू करें। नदी द्वीपों से त्वरित बचाव हेतु नाव दस्ते तैनात करें। सीडब्ल्यूसी गेज अधिकारी प्रति घंटा जलस्तर रिपोर्ट दें।`
      }
    };
  }

  if (classifiedClass === 'FOREST_WILDFIRE') {
    return {
      disaster_name: 'Forest Canopy Wildfire & Biosphere Reserve Blaze',
      disaster_name_hi: 'वनाग्नि संकट एवं बायोस्फीयर रिज़र्व सुरक्षा',
      hazard_mechanics: 'Extreme thermal combustion fueled by dry deciduous leaf litter, high ambient temperatures, and wind-driven ember spotting creating multi-directional fire fronts.',
      hazard_mechanics_hi: 'सूखे पत्तों, 40°C से अधिक तापमान और तेज हवाओं से आग पेड़ों की चोटियों पर तेजी से फैल रही है और उड़ते अंगारे नए स्थानों पर आग भड़का रहे हैं।',
      primary_threat_vectors: [
        'Rapid fire spread velocity (>8 km/h) jumping across natural gorges',
        'Ember spotting igniting spot fires up to 1.5 km ahead of main fire front',
        'Dense toxic smoke plumes causing asphyxiation in wildlife and nearby tribal villages',
        'Loss of endangered flora, fauna, and canopy carbon sink'
      ],
      primary_threat_vectors_hi: [
        '8 किमी/घंटा से अधिक की गति से आगे बढ़ती वनाग्नि की दीवार',
        '1.5 किमी दूर तक उड़कर नई आग सुलगाने वाले जलते अंगारे',
        'वन्यजीवों और आस-पास के गांवों में दमघोंटू धुएं का प्रसार',
        'दुर्लभ औषधीय वनस्पति और वन्यजीव संपदा को भारी क्षति'
      ],
      phases: [
        {
          phase_id: 'T0_T2',
          timeframe: 'T - 0h to T + 2h',
          title: 'Perimeter Containment & Firebreak Cutting',
          title_hi: 'अग्नि परिधि नियंत्रण एवं फायरलाइन निर्माण',
          actions: [
            'Deploy forest protection strike forces to cut 10m-wide counter-fire breaks using brush cutters.',
            'Evacuate tribal forest fringe hamlets located downwind of advancing fire front.',
            'Dispatch 6 specialized forest fire water tenders and high-pressure backpack blowers.',
            'Activate satellite thermal hotspot tracking via FSI SNPP-VIIRS.'
          ],
          actions_hi: [
            'ब्रश कटर मशीनों से 10 मीटर चौड़ी फायरलाइन काटकर आग का रास्ता रोकें।',
            'हवा की दिशा में पड़ने वाले वन सीमांत गांवों को तुरंत खाली कराएं।',
            'उच्च दबाव वाले वाटर टेंडर और एयर ब्लोअर के साथ वन दल तैनात करें।',
            'उपग्रह थर्मल हॉटस्पॉट प्रणाली से प्रति घंटे आग की गति पर नजर रखें।'
          ]
        },
        {
          phase_id: 'T2_T6',
          timeframe: 'T + 2h to T + 6h',
          title: 'Aerial Retardant Sorties & Counter-Firing',
          title_hi: 'हवाई जल बौछार एवं नियंत्रित काउंटर-फायरिंग',
          actions: [
            'Requisition Indian Air Force Bambi Bucket helicopter sorties to douse inaccessible ridge tops.',
            'Execute controlled back-burning (counter-firing) under expert supervision to starve fire front.',
            'Establish smoke-free animal escape corridors leading towards water reservoirs.',
            'Distribute N95/carbon smoke filter respirators to forest frontline personnel.'
          ],
          actions_hi: [
            'पहाड़ी चोटियों पर आग बुझाने हेतु वायुसेना के बांबी बकेट हेलीकॉप्टर लगाएं।',
            'नियंत्रित आग (बैक-बर्निंग) द्वारा मुख्य आग के सामने का सूखा ईंधन जलाकर समाप्त करें।',
            'वन्यजीवों के सुरक्षित निकलने हेतु जल स्रोतों की ओर धुआं-मुक्त गलियारा बनाएं।',
            'अग्निशमन कर्मियों को कार्बन स्मोक मास्क और सुरक्षात्मक किट उपलब्ध कराएं।'
          ]
        },
        {
          phase_id: 'T6_T24',
          timeframe: 'T + 6h to T + 24h',
          title: 'Mop-Up Operations & Smoldering Root Extinguishment',
          title_hi: 'भूमिगत सुलगती जड़ों को बुझाना एवं निगरानी',
          actions: [
            'Extinguish deep smoldering subterranean roots and hollow tree trunks using chemical foam.',
            'Maintain 24-hour ember watch at cleared perimeter boundaries to prevent flare-ups.',
            'Conduct thermal infrared drone sweeps to detect hidden underground heat signatures.',
            'Set up wildlife medical triage camp for burned or asphyxiated animals.'
          ],
          actions_hi: [
            'जमीन के अंदर सुलगती जड़ों और खोखले तनों को फोम और पानी से बुझाएं।',
            'दोबारा आग भड़कने से रोकने हेतु सीमा पर 24 घंटे की गश्त रखें।',
            'छुपे हुए ताप बिंदुओं को खोजने हेतु इन्फ्रारेड थर्मल ड्रोन उड़ानें संचालित करें।',
            'घायल वन्यजीवों के उपचार हेतु वन सीमा पर पशु चिकित्सा शिविर लगाएं।'
          ]
        },
        {
          phase_id: 'T24_T72',
          timeframe: 'T + 24h to T + 72h',
          title: 'Ecological Restoration & Post-Fire Audit',
          title_hi: 'पारिस्थितिक बहाली एवं वनाग्नि ऑडिट',
          actions: [
            'Audit scorched acreage using Sentinel-2 Normalized Burn Ratio (NBR).',
            'Install soil erosion barriers along bare hillsides to prevent monsoonal mudslides.',
            'Investigate origin point for potential illegal poaching or dry season clearance.',
            'Implement indigenous tree sapling replanting and soil nutrient rejuvenation plan.'
          ],
          actions_hi: [
            'उपग्रह चित्रों से जली हुई भूमि का सटीक माप एवं ऑडिट करें।',
            'बारिश में मिट्टी बहने से रोकने हेतु ढलानों पर सुरक्षा बैरियर लगाएं।',
            'आग लगने के कारणों की जांच करें।',
            'स्थानीय प्रजातियों के पौधे लगाने की दीर्घकालिक योजना शुरू करें।'
          ]
        }
      ],
      resources: {
        iaf_helicopter_bambi_sorties: 12,
        fire_fighting_strike_personnel: 220,
        backpack_air_blowers: 95,
        high_pressure_water_tenders: 14,
        thermal_uav_sweeps: 6,
        smoke_respirators: 1500
      },
      directives: {
        en: `FOREST FIRE EMERGENCY DIRECTIVE (${locationName}): Mobilize all beat officers for perimeter back-burning. Enforce complete tourist and tribal ban on reserve core. Coordinate IAF Bambi Bucket sorties for canopy suppression.`,
        hi: `वनाग्नि कमान निर्देश (${locationName}): परिधि पर नियंत्रित आग (बैक-बर्निंग) द्वारा आग को फैलने से रोकें। रिज़र्व के मुख्य क्षेत्र में नागरिकों के प्रवेश पर पूर्ण रोक लगाएं। वायुसेना हेलीकॉप्टर द्वारा पानी की बौछार कराएं।`
      }
    };
  }

  if (classifiedClass === 'VOLCANIC_ANOMALY') {
    return {
      disaster_name: 'Volcanic Eruption & Pyroclastic Gas Venting',
      disaster_name_hi: 'ज्वालामुखी विस्फोट एवं सल्फर गैस उत्सर्जन',
      hazard_mechanics: 'Sub-surface magma ascent through central conduit ejecting basaltic spatter, volcanic ash, and high-concentration SO2 aerosol columns.',
      hazard_mechanics_hi: 'जमीन के नीचे मैग्मा के ऊपर उठने से लावा, गर्म चट्टानें और सल्फर डाइऑक्साइड गैस का विशाल गुबार वायुमंडल में फैल रहा है।',
      primary_threat_vectors: [
        'Aviation hazards from high-altitude abrasive volcanic ash clouds',
        'Toxic sulfur dioxide (SO2) dispersion triggering severe respiratory distress',
        'Sub-surface lava entry into sea generating hazardous steam-acid plumes (laze)',
        'Local marine tsunami risk from slope collapse'
      ],
      primary_threat_vectors_hi: [
        'हवाई उड़ानों के लिए अत्यंत खतरनाक राख के बादल',
        'सांस लेने में गंभीर कठिनाई पैदा करने वाली जहरीली SO2 गैस',
        'समुद्र में गिरते गर्म लावे से उत्पन्न भाप और एसिड गैस',
        'ज्वालामुखी ढलान खिसकने से स्थानीय समुद्री सुनामी का खतरा'
      ],
      phases: [
        {
          phase_id: 'T0_T2',
          timeframe: 'T - 0h to T + 2h',
          title: 'Airspace Exclusion & Maritime Cordon',
          title_hi: 'वायुक्षेत्र प्रतिबंध एवं समुद्री घेराबंदी',
          actions: [
            'Issue immediate NOTAM (Notice to Airmen) establishing a 45 km Flight Level 250 exclusion zone.',
            'Indian Coast Guard enforces a 30 nautical mile maritime perimeter around the island.',
            'Task INSAT-3DR and Sentinel-5P for hourly SO2 column and aerosol optical depth tracking.',
            'Alert Port Blair Civil Aviation radar for ash plume trajectory shifts towards shipping lanes.'
          ],
          actions_hi: [
            'विमानों की सुरक्षा हेतु तुरंत 45 किमी क्षेत्र में NOTAM निषेध आदेश जारी करें।',
            'तटरक्षक बल द्वीप के चारों ओर 30 समुद्री मील का सुरक्षा घेरा बनाएं।',
            'सल्फर गैस के फैलाव पर नजर रखने हेतु इनसैट उपग्रह को सक्रिय करें।',
            'अंतरराष्ट्रीय हवाई व समुद्री मार्गों को राख के बादल से दूर मोड़ें।'
          ]
        },
        {
          phase_id: 'T2_T6',
          timeframe: 'T + 2h to T + 6h',
          title: 'Naval Patrol & Thermal Surveillance',
          title_hi: 'नौसेना गश्त एवं थर्मल वायु गुणवत्ता परीक्षण',
          actions: [
            'Deploy Indian Navy offshore patrol vessel with gas chromatography instruments to monitor air toxicity.',
            'Activate seismic accelerometer telemetry on nearby islands to detect paroxysmal eruption signs.',
            'Broadcast maritime navigational warnings (NAVTEX) in multiple languages.',
            'Ensure standby emergency evacuation plan for research personnel on adjacent outposts.'
          ],
          actions_hi: [
            'हवा में विषाक्त गैस मापने हेतु नौसेना का गश्ती जहाज रवाना करें।',
            'विस्फोट की तीव्रता जांचने हेतु निकटवर्ती द्वीपों के भूकंपीय सेंसर सक्रिय करें।',
            'सभी समुद्री जहाजों को NAVTEX आपातकालीन चेतावनी प्रसारित करें।',
            'आस-पास की वैज्ञानिक चौकियों से कर्मियों की सुरक्षित निकासी योजना तैयार रखें।'
          ]
        },
        {
          phase_id: 'T6_T24',
          timeframe: 'T + 6h to T + 24h',
          title: 'Aerosol Dispersion Modeling & Tsunami Watch',
          title_hi: 'गैस फैलाव मॉडलिंग एवं सुनामी निगरानी',
          actions: [
            'Run HYSPLIT atmospheric dispersion models to forecast SO2 plume landfall over coastal Andaman.',
            'Maintain INCOIS bottom pressure recorders on 24x7 watch for seismic slope failure tsunamis.',
            'Pre-distribute specialized SO2 respirators and eye protection in Port Blair port area.',
            'Conduct high-resolution synthetic aperture radar (SAR) passes to track caldera morphology.'
          ],
          actions_hi: [
            'हवा के रुख को देखकर गैस के तटीय आबादी तक पहुंचने का पूर्वानुमान लगाएं।',
            'सुनामी सेंसरों को 24x7 सक्रिय रखें।',
            'पोर्ट ब्लेयर तटीय क्षेत्र में विशेष गैस मास्क और चश्मे वितरित करें।',
            'काल्डेरा की स्थिति जांचने हेतु उपग्रह रडार चित्र प्राप्त करें।'
          ]
        },
        {
          phase_id: 'T24_T72',
          timeframe: 'T + 24h to T + 72h',
          title: 'Scientific Assessment & Airway De-restriction',
          title_hi: 'वैज्ञानिक समीक्षा एवं मार्ग सामान्यीकरण',
          actions: [
            'Review Geological Survey of India (GSI) thermal drone telemetry for magma subsidence.',
            'Evaluate ash particle concentration in lower atmosphere before adjusting flight corridors.',
            'Archive thermal radiative power metrics into national volcanological registry.',
            'Maintain automated real-time satellite alert trigger thresholds.'
          ],
          actions_hi: [
            'भारतीय भूवैज्ञानिक सर्वेक्षण (GSI) से लावे के स्तर की समीक्षा कराएं।',
            'राख के कण कम होने पर ही हवाई उड़ानों की अनुमति दें।',
            'ताप विकिरण के आंकड़ों को राष्ट्रीय रजिस्ट्री में सुरक्षित करें।',
            'स्वचालित उपग्रह निगरानी चालू रखें।'
          ]
        }
      ],
      resources: {
        coast_guard_patrol_vessels: 3,
        notam_airspace_sectors_closed: 2,
        so2_gas_monitoring_buoys: 4,
        satellite_tasking_passes_per_day: 8,
        specialized_so2_respirators: 5000,
        tsunami_gauge_monitoring_stations: 6
      },
      directives: {
        en: `VOLCANIC ALERT DIRECTIVE (${locationName}): Enforce strict 30 NM maritime exclusion cordon. Airports Authority of India to divert all civil flights away from ash plume envelope. Coast Guard to interdict unauthorized vessels.`,
        hi: `ज्वालामुखी कमान निर्देश (${locationName}): द्वीप के चारों ओर 30 समुद्री मील का सख्त सुरक्षा घेरा लागू करें। विमानपत्तन प्राधिकरण सभी नागरिक उड़ानों को राख के बादल से दूर मोड़ें।`
      }
    };
  }

  // SEISMIC_EARTHQUAKE default
  return {
    disaster_name: 'Tectonic Fault Rupture & Seismic Ground Motion',
    disaster_name_hi: 'टेक्टोनिक प्लेट विखंडन एवं तीव्र भूकंपीय कंपन',
    hazard_mechanics: 'Sudden release of elastic strain energy along tectonic plate boundary generating compressive P-waves and destructive shear S-waves propagating through crustal strata.',
    hazard_mechanics_hi: 'भूगर्भीय प्लेटों के टकराने से भारी मात्रा में ऊर्जा मुक्त हुई है, जिससे प्राथमिक पी-वेव्स और विनाशकारी शियर एस-वेव्स इमारतों को हिला रही हैं।',
    primary_threat_vectors: [
      'Unreinforced masonry building collapse and trapping of occupants',
      'Ground liquefaction and severed underground gas and water mains',
      'Secondary mountain landslides blocking vital relief corridors',
      'Prolonged sequence of high-magnitude aftershocks threatening rescue crews'
    ],
    primary_threat_vectors_hi: [
      'कमजोर इमारतों का ढहना और मलबे में नागरिकों का फंसना',
      'भूमि द्रवीकरण से भूमिगत गैस व पानी की पाइपलाइनों का फटना',
      'पहाड़ी मार्गों पर भूस्खलन से राहत सामग्री का मार्ग अवरुद्ध होना',
      'लगातार आने वाले भूकंप के तेज झटके (आफ्टरशॉक)'
    ],
    phases: [
      {
        phase_id: 'T0_T2',
        timeframe: 'T - 0h to T + 2h',
        title: 'Golden Hour Search & Gas Grid Isolation',
        title_hi: 'स्वर्णिम घंटा (गोल्डन ऑवर) खोज एवं गैस ग्रिड शटडाउन',
        actions: [
          'Mobilize specialized Urban Search & Rescue (USAR) teams with acoustic listening and snake cameras.',
          'Execute emergency automatic shutoff of city gas distribution networks to prevent catastrophic conflagration.',
          'Activate State Emergency Operations Center (SEOC) under National Incident Management System (NIMS).',
          'Enforce open-air congregational zones in public parks; prohibit re-entry into structurally damaged buildings.'
        ],
        actions_hi: [
          'मलबे में दबे लोगों को खोजने हेतु लाइफ-डिटेक्टर और स्नेक कैमरों से लैस यूएसएआर टीमें लगाएं।',
          'आग लगने से रोकने के लिए शहर की गैस आपूर्ति पाइपलाइन तुरंत बंद करें।',
          'राज्य आपातकालीन संचालन केंद्र (SEOC) को तुरंत सक्रिय करें।',
          'नागरिकों को खुले पार्कों व मैदानों में इकट्ठा करें; क्षतिग्रस्त इमारतों में प्रवेश रोकें।'
        ]
      },
      {
        phase_id: 'T2_T6',
        timeframe: 'T + 2h to T + 6h',
        title: 'Structural Triage & Air Corridor Mobilization',
        title_hi: 'इमारत सुरक्षा टैगिंग एवं एयरलिफ्ट गलियारा',
        actions: [
          'Civil engineers implement Rapid Damage Assessment Tagging (Red = Condemned, Yellow = Restricted, Green = Safe).',
          'Indian Air Force activates C-130J transport aircraft carrying field trauma hospitals and hydraulic spreaders.',
          'Establish open-air triage surgical theater at district stadium with backup blood bank refrigeration.',
          'Deploy seismic aftershock warning accelerometer network to sound sirens 10 seconds before aftershock S-waves arrive.'
        ],
        actions_hi: [
          'इंजीनियरों द्वारा इमारतों की सुरक्षा टैगिंग (लाल = खतरनाक, पीला = सीमित, हरा = सुरक्षित) करें।',
          'वायुसेना के सी-130जे विमानों से फील्ड अस्पताल और कटर मशीनें पहुंचाएं।',
          'जिला स्टेडियम में खुला आपातकालीन सर्जिकल थिएटर और ब्लड बैंक बनाएं।',
          'आफ्टरशॉक आने से 10 सेकंड पहले चेतावनी सायरन बजाने वाला नेटवर्क सक्रिय करें।'
        ]
      },
      {
        phase_id: 'T6_T24',
        timeframe: 'T + 6h to T + 24h',
        title: 'Extrication & Emergency Sheltering',
        title_hi: 'मलबे से सुरक्षित निकासी एवं आपातकालीन शिविर',
        actions: [
          'Conduct heavy concrete cutting and tunnel extraction for collapsed multi-story structures.',
          'Set up emergency tent cities equipped with portable chemical toilets and halogen water purification.',
          'Establish Missing Persons Registry with biometric and facial verification desks.',
          'Restore electricity to designated trauma centers via mobile substation transformer trucks.'
        ],
        actions_hi: [
          'गिरे हुए बहुमंजिला भवनों में कंक्रीट काटकर फंसे लोगों को बाहर निकालें।',
          'शौचालय व शुद्ध पेयजल से युक्त आपातकालीन टेंट सिटी स्थापित करें।',
          'लापता व्यक्तियों की खोज हेतु बायोमेट्रिक व फोटो पहचान डेस्क बनाएं।',
          'मोबाइल ट्रांसफार्मर वैन से अस्पतालों की बिजली तुरंत चालू करें।'
        ]
      },
      {
        phase_id: 'T24_T72',
        timeframe: 'T + 24h to T + 72h',
        title: 'Secondary Threat Mitigation & Temporary Housing',
        title_hi: 'द्वितीयक खतरों से बचाव एवं पुनर्वास',
        actions: [
          'Clear seismic landslide blocks along critical national highways to re-open supply conduits.',
          'Provide professional psychological trauma counseling to disaster survivors.',
          'Deploy structural laser vibrometers to monitor stability of bridges, dams, and historic monuments.',
          'Transition emergency relief into intermediate prefabricated shelter distribution.'
        ],
        actions_hi: [
          'राहत सामग्री पहुंचाने हेतु पहाड़ी राजमार्गों से भूस्खलन का मलबा हटाएं।',
          'आपदा पीड़ितों को मनोवैज्ञानिक परामर्श एवं संबल प्रदान करें।',
          'पुलों, बांधों और ऐतिहासिक धरोहरों की मजबूती जांचने हेतु लेजर सेंसर लगाएं।',
          'बेघर परिवारों को प्री-फैब्रिकेटेड शेल्टर उपलब्ध कराएं।'
        ]
      }
    ],
    resources: {
      ndrf_usar_teams: 12,
      acoustic_life_detectors: 28,
      iaf_c130j_airlift_sorties: 8,
      emergency_shelter_tents: 2500,
      mobile_field_surgical_hospitals: 3,
      dog_search_squads: 14
    },
    directives: {
      en: `SEISMIC EMERGENCY DIRECTIVE (${locationName}): Mobilize all available USAR teams under Golden Hour protocol. Shut down municipal gas mains immediately. Enforce building condemnation tagging before civilian re-entry.`,
      hi: `भूकंप कमान निर्देश (${locationName}): गोल्डन ऑवर प्रोटोकॉल के तहत सभी यूएसएआर बचाव दल तैनात करें। गैस ग्रिड तत्काल बंद करें। संरचनात्मक सुरक्षा टैगिंग के बिना क्षतिग्रस्त इमारतों में प्रवेश पूर्णतः वर्जित करें।`
    }
  };
}

export function computeHazardWhatIfSimulation(classifiedClass, param1, param2) {
  const p1 = Number(param1);
  const p2 = Number(param2);

  if (classifiedClass === 'LANDSLIDE_DEBRIS_FLOW') {
    const rainRate = p1;
    const slopeDeg = p2;
    const slopeRad = (slopeDeg * Math.PI) / 180;
    const phiRad = (28.0 * Math.PI) / 180;

    const poreRatio = Math.min(0.95, (rainRate / 80.0) * 0.70 + 0.20);
    let fos = (Math.tan(phiRad) / Math.tan(slopeRad)) * (1.0 - poreRatio);
    fos = Math.max(0.40, Math.min(2.5, Math.round(fos * 100) / 100));

    const debrisVolume = Math.round(Math.max(1000, Math.min(120000, 2500 * (slopeDeg / 25.0) * Math.pow(rainRate / 30.0, 1.5))));
    const runoutReachM = Math.round(Math.max(200, Math.min(3500, Math.pow(debrisVolume, 0.42) * (slopeDeg / 15.0) * 35)));
    const evacNeeded = Math.round(runoutReachM * 1.8);

    let status = 'CRITICAL SLOPE COLLAPSE IMMINENT (FoS < 1.0)';
    let statusHi = 'गंभीर ढलान भूस्खलन आसन्न (FoS < 1.0)';
    let severity = 'HIGH_DANGER';

    if (fos >= 1.25) {
      status = 'STABLE EQUILIBRIUM (Monitored)';
      statusHi = 'संतुलित एवं सुरक्षित स्थिति (निगरानी जारी)';
      severity = 'SAFE';
    } else if (fos >= 1.0) {
      status = 'UNSTABLE MARGIN (High Liquefaction Risk)';
      statusHi = 'अस्थिर सीमा (द्रवीकरण का उच्च जोखिम)';
      severity = 'WARNING';
    }

    return {
      simulation_type: 'GEOTECHNICAL_SLOPE_STABILITY',
      param1_label: 'Rainfall Rate',
      param1_value: `${rainRate} mm/hr`,
      param2_label: 'Slope Gradient',
      param2_value: `${slopeDeg}°`,
      metrics: [
        { label: 'Factor of Safety (FoS)', label_hi: 'सुरक्षा गुणांक (FoS)', value: `${fos.toFixed(2)}`, flag: fos < 1.0 ? 'danger' : 'safe', unit: 'Ratio (<1.0 is failure)' },
        { label: 'Predicted Debris Volume', label_hi: 'अनुमानित मलबा आयतन', value: debrisVolume.toLocaleString(), flag: 'normal', unit: 'Cubic Meters (m³)' },
        { label: 'Debris Runout Reach', label_hi: 'मलबा प्रवाह दूरी', value: `${runoutReachM} m`, flag: runoutReachM > 1200 ? 'danger' : 'normal', unit: 'Downslope Valley' },
        { label: 'Population At Direct Risk', label_hi: 'प्रत्यक्ष जोखिम में आबादी', value: evacNeeded.toLocaleString(), flag: evacNeeded > 1000 ? 'danger' : 'normal', unit: 'Residents to Evacuate' }
      ],
      status_headline: status,
      status_headline_hi: statusHi,
      severity_tag: severity,
      ai_inference: `At ${rainRate} mm/hr rain on a ${slopeDeg}° slope, hydraulic pore-water pressure reduces shear strength to FoS ${fos.toFixed(2)}. ${fos < 1.0 ? 'Immediate evacuation of valley floor is imperative.' : 'Continuous piezometric telemetry tracking active.'}`,
      ai_inference_hi: `${slopeDeg}° ढलान पर ${rainRate} मिमी/घंटा बारिश से सुरक्षा गुणांक (FoS) गिरकर ${fos.toFixed(2)} रह गया है। ${fos < 1.0 ? 'निचली बस्तियों की तत्काल सुरक्षित निकासी अनिवार्य है।' : 'स्थिति नियंत्रण में है परंतु निरंतर निगरानी आवश्यक है।'}`
    };
  }

  if (classifiedClass === 'TROPICAL_CYCLONE') {
    const pressHpa = p1;
    const distKm = p2;

    const deltaP = Math.max(5.0, 1013.0 - pressHpa);
    const sustainedWindKmh = Math.round(Math.sqrt(deltaP) * 18.5);
    const gustsKmh = Math.round(sustainedWindKmh * 1.28);

    const surgeM = Math.max(0.2, Math.round((deltaP * 0.08 * (1.0 + sustainedWindKmh / 200.0)) * 10) / 10);
    const evacCount = Math.round(Math.max(5000, Math.min(800000, (surgeM * 45000) * Math.max(0.3, (120 - Math.min(120, distKm)) / 100.0))));
    const hoursToLandfall = Math.max(0.5, Math.round((distKm / 18.0) * 10) / 10);

    let category = 'VERY SEVERE CYCLONIC STORM (VSCS)';
    let severity = 'HIGH_DANGER';

    if (sustainedWindKmh < 62) {
      category = 'DEPRESSION / LOW THREAT';
      severity = 'SAFE';
    } else if (sustainedWindKmh < 89) {
      category = 'CYCLONIC STORM (CS)';
      severity = 'WARNING';
    } else if (sustainedWindKmh < 120) {
      category = 'SEVERE CYCLONIC STORM (SCS)';
      severity = 'WARNING';
    }

    return {
      simulation_type: 'CYCLONIC_WIND_AND_SURGE_DYNAMICS',
      param1_label: 'Central Barometric Pressure',
      param1_value: `${pressHpa} hPa`,
      param2_label: 'Distance to Shoreline',
      param2_value: `${distKm} km`,
      metrics: [
        { label: 'Sustained Core Winds', label_hi: 'निरंतर चक्रवाती हवाएं', value: `${sustainedWindKmh} km/h`, flag: sustainedWindKmh > 100 ? 'danger' : 'normal', unit: `Gusts to ${gustsKmh} km/h` },
        { label: 'Peak Storm Surge Height', label_hi: 'अधिकतम समुद्री ज्वार', value: `+${surgeM} m`, flag: surgeM > 1.8 ? 'danger' : 'normal', unit: 'Above High Tide' },
        { label: 'Estimated Landfall Window', label_hi: 'तट प्रवेश अनुमानित समय', value: `${hoursToLandfall} hrs`, flag: 'normal', unit: '@ 18 km/h Forward Speed' },
        { label: 'Coastal Evacuation Count', label_hi: 'तटीय निकासी लक्ष्य', value: evacCount.toLocaleString(), flag: evacCount > 50000 ? 'danger' : 'normal', unit: 'Vulnerable Population' }
      ],
      status_headline: `${category} · ${sustainedWindKmh} km/h Core`,
      status_headline_hi: `${category} · ${sustainedWindKmh} किमी/घंटा हवाएं`,
      severity_tag: severity,
      ai_inference: `With central pressure of ${pressHpa} hPa at ${distKm} km offshore, cyclonic vortex produces a +${surgeM}m surge with ${sustainedWindKmh} km/h winds. ${sustainedWindKmh >= 90 ? 'Full coastal shelter lockdown and marine recall is mandatory.' : 'Keep fishing trawlers in harbor.'}`,
      ai_inference_hi: `तट से ${distKm} किमी दूर ${pressHpa} hPa दबाव पर चक्रवात से ${sustainedWindKmh} किमी/घंटा की हवाएं और +${surgeM} मीटर ऊंची समुद्री लहरें उठेंगी।`
    };
  }

  if (classifiedClass === 'RIVERINE_FLOOD') {
    const discharge = p1;
    const freeboard = p2;

    const stageAboveDanger = Math.max(0.1, Math.round(((discharge / 22000.0) * 1.1) * 100) / 100);
    const inundatedSqkm = Math.round((discharge / 1000.0) * 8.5);
    const boatUnits = Math.round(Math.max(4, Math.min(120, (discharge / 1000.0) * 1.8)));
    const timeToCrestH = Math.max(1.5, Math.round((36.0 / Math.max(1.0, discharge / 20000.0)) * 10) / 10);

    let status = 'CONTROLLED BANKFULL DISCHARGE';
    let statusHi = 'नियंत्रित नदी प्रवाह';
    let severity = 'SAFE';

    if (freeboard <= 0.0 || discharge > 55000) {
      status = 'CATASTROPHIC DYKE OVERTOPPING / BREACH';
      statusHi = 'तटबंध टूटने का गंभीर खतरा / ओवरफ्लो';
      severity = 'HIGH_DANGER';
    } else if (freeboard < 0.5) {
      status = 'CRITICAL HYDRAULIC PRESSURE (Imminent Seepage)';
      statusHi = 'तटबंध पर अत्यधिक जल दबाव';
      severity = 'WARNING';
    }

    return {
      simulation_type: 'HYDROLOGICAL_BASIN_ROUTING',
      param1_label: 'Dam Discharge',
      param1_value: `${discharge.toLocaleString()} cusecs`,
      param2_label: 'Embankment Freeboard Margin',
      param2_value: `${freeboard.toFixed(2)} m`,
      metrics: [
        { label: 'River Stage Delta', label_hi: 'नदी जलस्तर वृद्धि', value: `+${stageAboveDanger.toFixed(2)} m`, flag: stageAboveDanger > 1.2 ? 'danger' : 'normal', unit: 'Above Danger Mark' },
        { label: 'Estimated Inundation Area', label_hi: 'अनुमानित जलमग्न क्षेत्र', value: `${inundatedSqkm.toLocaleString()} km²`, flag: inundatedSqkm > 300 ? 'danger' : 'normal', unit: 'Floodplain Submerged' },
        { label: 'Crest Wave Arrival Time', label_hi: 'शीर्ष बाढ़ लहर का समय', value: `${timeToCrestH} hrs`, flag: 'normal', unit: 'Downstream Reaches' },
        { label: 'Gemini Rescue Boats Required', label_hi: 'आवश्यक जेमिनी बचाव नौकाएं', value: `${boatUnits} Boats`, flag: boatUnits > 40 ? 'danger' : 'normal', unit: 'Tactical Rescue Units' }
      ],
      status_headline: status,
      status_headline_hi: statusHi,
      severity_tag: severity,
      ai_inference: `Discharge of ${discharge.toLocaleString()} cusecs with ${freeboard.toFixed(2)}m freeboard stresses riparian dykes. ${freeboard <= 0.2 ? 'Breach alarm triggered. Mobilize rescue flotilla immediately.' : 'Hydrological wave progressing within designed capacity.'}`,
      ai_inference_hi: `${discharge.toLocaleString()} क्यूसेक पानी छोड़ने और ${freeboard.toFixed(2)} मीटर मार्जिन से तटबंधों पर भारी दबाव है।`
    };
  }

  if (classifiedClass === 'FOREST_WILDFIRE') {
    const windKmh = p1;
    const fuelPct = p2;

    const spreadRateKmh = Math.max(0.5, Math.round(((windKmh / 12.0) * ((25.0 - Math.min(25.0, fuelPct)) / 8.0)) * 10) / 10);
    const spottingDistKm = Math.max(0.1, Math.round(((windKmh / 25.0) * 0.9) * 10) / 10);
    const firebreakWidthM = Math.round(Math.max(6, Math.min(40, spreadRateKmh * 4.2)));
    const containmentHours = Math.round(Math.max(4, Math.min(96, (spreadRateKmh * 14) / 2.0)));

    let status = 'MODERATE SMOLDERING CONTAINMENT';
    let statusHi = 'नियंत्रित वनाग्नि सीमा';
    let severity = 'SAFE';

    if (spreadRateKmh > 4.0 || fuelPct < 6.0) {
      status = 'UNCONTROLLED CANOPY BLOWUP (Spotting Active)';
      statusHi = 'अनियंत्रित तीव्र वनाग्नि (अंगारे उड़ना जारी)';
      severity = 'HIGH_DANGER';
    } else if (spreadRateKmh > 1.5) {
      status = 'ACTIVE SURFACE FIRE SPREAD';
      statusHi = 'सतही आग का फैलाव जारी';
      severity = 'WARNING';
    }

    return {
      simulation_type: 'FIRE_PROPAGATION_DYNAMICS',
      param1_label: 'Ambient Wind Velocity',
      param1_value: `${windKmh} km/h`,
      param2_label: 'Forest Fuel Moisture',
      param2_value: `${fuelPct}%`,
      metrics: [
        { label: 'Rate of Fire Front Spread', label_hi: 'आग फैलने की गति', value: `${spreadRateKmh} km/h`, flag: spreadRateKmh > 3.0 ? 'danger' : 'normal', unit: 'Forward Advance' },
        { label: 'Max Ember Spotting Distance', label_hi: 'अंगारे उड़ने की दूरी', value: `${spottingDistKm} km`, flag: spottingDistKm > 0.8 ? 'danger' : 'normal', unit: 'Airborne Firebrands' },
        { label: 'Mandatory Firebreak Width', label_hi: 'आवश्यक फायरलाइन चौड़ाई', value: `${firebreakWidthM} m`, flag: 'normal', unit: 'Mineral Earth Line' },
        { label: 'Estimated Containment Time', label_hi: 'नियंत्रण अनुमानित समय', value: `${containmentHours} hrs`, flag: 'normal', unit: 'With Full Air Sorties' }
      ],
      status_headline: status,
      status_headline_hi: statusHi,
      severity_tag: severity,
      ai_inference: `Under ${windKmh} km/h wind and ${fuelPct}% fuel moisture, wildfire propagates at ${spreadRateKmh} km/h with embers spotting up to ${spottingDistKm} km ahead.`,
      ai_inference_hi: `${windKmh} किमी/घंटा हवा और ${fuelPct}% नमी में आग ${spreadRateKmh} किमी/घंटा की दर से आगे बढ़ रही है।`
    };
  }

  if (classifiedClass === 'VOLCANIC_ANOMALY') {
    const powerMw = p1;
    const plumeKm = p2;

    const ashDispersionKm = Math.round(plumeKm * 28);
    const maritimeExclusionNm = Math.round(Math.max(10, Math.min(50, (powerMw / 10.0) * 1.8)));
    const so2ConcPpm = Math.round(((powerMw / 25.0) * 1.4) * 10) / 10;

    return {
      simulation_type: 'VOLCANIC_PLUME_AND_THERMAL_DISPERSION',
      param1_label: 'Thermal Radiative Power',
      param1_value: `${powerMw} MW`,
      param2_label: 'Ash Plume Height',
      param2_value: `${plumeKm} km`,
      metrics: [
        { label: 'Ash Cloud Dispersion Radius', label_hi: 'राख के बादल का फैलाव', value: `${ashDispersionKm} km`, flag: ashDispersionKm > 150 ? 'danger' : 'normal', unit: 'Aviation Hazard Belt' },
        { label: 'Maritime Exclusion Cordon', label_hi: 'समुद्री निषेध क्षेत्र', value: `${maritimeExclusionNm} NM`, flag: 'normal', unit: 'Naval Exclusion Radius' },
        { label: 'Peak Caldera SO₂ Density', label_hi: 'अधिकतम SO₂ गैस घनत्व', value: `${so2ConcPpm} ppm`, flag: so2ConcPpm > 8.0 ? 'danger' : 'normal', unit: 'Toxic Gas Level' },
        { label: 'NOTAM Flight Level Restriction', label_hi: 'हवाई उड़ान निषेध स्तर', value: `FL ${Math.round(plumeKm * 33)}`, flag: 'normal', unit: 'Civil Aviation Route' }
      ],
      status_headline: 'ACTIVE MAGMATIC DEGASSING & PYROCLASTIC VENTING',
      status_headline_hi: 'सक्रिय मैग्मा वेंटिंग एवं गैस उत्सर्जन',
      severity_tag: powerMw > 100 ? 'WARNING' : 'SAFE',
      ai_inference: `Caldera thermal power of ${powerMw} MW with ${plumeKm} km plume generates a ${ashDispersionKm} km ash envelope. Aviation NOTAM active.`,
      ai_inference_hi: `${powerMw} मेगावाट ताप उत्सर्जन और ${plumeKm} किमी ऊंचे धुएं से ${ashDispersionKm} किमी तक विमानन खतरा है।`
    };
  }

  // SEISMIC_EARTHQUAKE default
  const magMw = p1;
  const depthKm = p2;

  const pgaG = Math.max(0.04, Math.min(1.2, Math.round(((Math.pow(10, 0.5 * magMw) / Math.pow(depthKm, 0.8)) * 0.05) * 100) / 100));
  const mmi = Math.min(10.0, Math.round((magMw * 1.1 + Math.max(0, 15 - depthKm) * 0.08) * 10) / 10);
  const collapseProbPct = Math.round(Math.max(2, Math.min(95, (pgaG / 0.45) * 55)));
  const usarTeamsNeeded = Math.round(Math.max(2, Math.min(45, collapseProbPct / 5.0)));

  return {
    simulation_type: 'SEISMIC_ATTENUATION_AND_STRUCTURAL_FRAGILITY',
    param1_label: 'Moment Magnitude (Mw)',
    param1_value: `Mw ${magMw.toFixed(1)}`,
    param2_label: 'Hypocentral Focal Depth',
    param2_value: `${depthKm.toFixed(1)} km`,
    metrics: [
      { label: 'Peak Ground Acceleration (PGA)', label_hi: 'अधिकतम भू-त्वरण (PGA)', value: `${pgaG}g`, flag: pgaG > 0.25 ? 'danger' : 'normal', unit: 'Spectral Ground Motion' },
      { label: 'Modified Mercalli Intensity', label_hi: 'संशोधित मरकेली तीव्रता', value: `MMI ${mmi}`, flag: mmi > 7.0 ? 'danger' : 'normal', unit: 'Shake Intensity' },
      { label: 'Masonry Building Collapse Risk', label_hi: 'इमारत ढहने का जोखिम', value: `${collapseProbPct}%`, flag: collapseProbPct > 30 ? 'danger' : 'normal', unit: 'Unreinforced Structures' },
      { label: 'NDRF USAR Squads Required', label_hi: 'आवश्यक यूएसएआर बचाव दल', value: `${usarTeamsNeeded} Squads`, flag: usarTeamsNeeded > 15 ? 'danger' : 'normal', unit: 'Heavy Extrication Teams' }
    ],
    status_headline: `Mw ${magMw.toFixed(1)} CRUSTAL RUPTURE @ ${depthKm.toFixed(1)} KM DEPTH`,
    status_headline_hi: `Mw ${magMw.toFixed(1)} भूगर्भीय विखंडन (${depthKm.toFixed(1)} किमी गहराई)`,
    severity_tag: pgaG > 0.25 ? 'HIGH_DANGER' : 'WARNING',
    ai_inference: `Rupture at ${depthKm} km depth generates ${pgaG}g peak acceleration, creating ${collapseProbPct}% collapse risk in masonry structures. Golden Hour teams mobilized.`,
    ai_inference_hi: `${depthKm} किमी गहराई पर भूकंप से ${pgaG}g भू-त्वरण उत्पन्न हुआ है। कमजोर इमारतों के क्षतिग्रस्त होने की संभावना ${collapseProbPct}% है।`
  };
}

export function generateCapXmlPayload(classification, plan, whatIf) {
  const now = new Date();
  const alertId = `IN-NDMA-AI-${Date.now()}`;
  const sentTime = now.toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alertId}</identifier>
  <sender>ai-disaster-command@ndma.gov.in</sender>
  <sent>${sentTime}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>${plan.disaster_name}</event>
    <urgency>${classification.alert_tier === 'LEVEL_3_RED_CRISIS' ? 'Immediate' : 'Expected'}</urgency>
    <severity>${classification.alert_tier === 'LEVEL_3_RED_CRISIS' ? 'Extreme' : 'Severe'}</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>MHSI_INDEX</valueName>
      <value>${classification.mhsi_score}</value>
    </eventCode>
    <headline>${classification.alert_label}: ${plan.disaster_name}</headline>
    <description>${plan.hazard_mechanics} What-If Status: ${whatIf?.status_headline || 'Calculated'}.</description>
    <instruction>${plan.directives?.en || 'Follow official NDMA evacuation instructions immediately.'}</instruction>
    <contact>National Disaster Management Authority (NDMA) Control: 1078</contact>
  </info>
</alert>`;
}
