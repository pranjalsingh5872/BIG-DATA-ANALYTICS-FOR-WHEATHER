import React, { useState, useEffect } from 'react';
import {
  Brain,
  Zap,
  Activity,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Printer,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Mountain,
  Wind,
  Waves,
  Flame,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Info,
  Compass,
  Radio,
  Clock,
  Users,
  HardHat,
  Truck,
  Check,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  PRESET_DISASTERS,
  classifyDisaster,
  synthesizeIndividualMitigationPlan,
  computeHazardWhatIfSimulation,
  generateCapXmlPayload
} from '../../utils/aiDisasterEngine';

export default function DisasterPlanAI({ onNavigate }) {
  const { lang, tr } = useLanguage();

  // State
  const [presets, setPresets] = useState(PRESET_DISASTERS);
  const [selectedPresetId, setSelectedPresetId] = useState('wayanad_landslide');
  const [intakeMode, setIntakeMode] = useState('preset'); // 'preset' or 'custom'
  
  // Custom input state
  const [customText, setCustomText] = useState('');
  const [customLocation, setCustomLocation] = useState('High-Risk Sector');
  const [customTelemetry, setCustomTelemetry] = useState({
    rainfall_48h_mm: 220,
    soil_saturation_pct: 85,
    slope_angle_deg: 30,
    pore_pressure_kpa: 70,
    wind_speed_kmh: 45,
    barometric_pressure_hpa: 995,
    river_stage_above_danger_m: 0.8,
    river_discharge_cusecs: 25000,
    thermal_power_mw: 0,
    fuel_moisture_pct: 50,
    seismic_pga_g: 0.05,
    seismic_magnitude_mw: 4.5
  });

  // What-If Simulation Controls
  const [whatIfParam1, setWhatIfParam1] = useState(45);
  const [whatIfParam2, setWhatIfParam2] = useState(34);

  // Active Classification, Plan, and Simulation
  const [classification, setClassification] = useState(null);
  const [plan, setPlan] = useState(null);
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [whatIfControls, setWhatIfControls] = useState({
    param1_name: 'Primary Factor',
    param1_min: 0,
    param1_max: 100,
    param1_step: 1,
    param2_name: 'Secondary Factor',
    param2_min: 0,
    param2_max: 100,
    param2_step: 1
  });

  const [loading, setLoading] = useState(false);
  const [analyzingPulse, setAnalyzingPulse] = useState(false);
  const [activeTab, setActiveTab] = useState('plan'); // 'plan', 'whatif', 'matrix', 'cap'
  const [copiedDirective, setCopiedDirective] = useState(false);
  const [capModalOpen, setCapModalOpen] = useState(false);
  const [capXmlText, setCapXmlText] = useState('');

  // Initial load
  useEffect(() => {
    loadPreset(selectedPresetId);
  }, []);

  const loadPreset = (presetId) => {
    const p = presets.find((item) => item.id === presetId) || presets[0];
    setSelectedPresetId(p.id);
    setIntakeMode('preset');
    setCustomLocation(p.region);
    setCustomText(p.description);
    setCustomTelemetry(p.telemetry);

    const defaults = p.what_if_defaults || {};
    setWhatIfParam1(defaults.param1_val);
    setWhatIfParam2(defaults.param2_val);
    setWhatIfControls({
      param1_name: defaults.param1_name || 'Primary Factor',
      param1_min: defaults.param1_min || 0,
      param1_max: defaults.param1_max || 100,
      param1_step: defaults.param1_step || 1,
      param2_name: defaults.param2_name || 'Secondary Factor',
      param2_min: defaults.param2_min || 0,
      param2_max: defaults.param2_max || 100,
      param2_step: defaults.param2_step || 1
    });

    runClassification(p.description, p.telemetry, p.region, p.category_hint, defaults.param1_val, defaults.param2_val);
  };

  const runClassification = async (text, telemetry, location, categoryHint, p1, p2) => {
    try {
      setLoading(true);
      setAnalyzingPulse(true);

      const payload = {
        text: text,
        telemetry: telemetry,
        location: location,
        category_hint: categoryHint,
        what_if_param1: p1 !== undefined ? p1 : whatIfParam1,
        what_if_param2: p2 !== undefined ? p2 : whatIfParam2
      };

      const result = await api.classifyAndPlanDisaster(payload);

      setClassification(result.classification);
      setPlan(result.individual_plan);
      setWhatIfResult(result.what_if_simulation);

      if (result.what_if_controls) {
        setWhatIfControls((prev) => ({ ...prev, ...result.what_if_controls }));
      }

      // Generate CAP XML
      const xml = generateCapXmlPayload(result.classification, result.individual_plan, result.what_if_simulation);
      setCapXmlText(xml);
    } catch (e) {
      console.error('Classification failed', e);
    } finally {
      setTimeout(() => setAnalyzingPulse(false), 400);
      setLoading(false);
    }
  };

  const handleCustomSubmit = () => {
    runClassification(customText, customTelemetry, customLocation, null, whatIfParam1, whatIfParam2);
  };

  const handleWhatIfSliderChange = (newP1, newP2) => {
    setWhatIfParam1(newP1);
    setWhatIfParam2(newP2);

    if (classification?.classified_class) {
      const res = computeHazardWhatIfSimulation(classification.classified_class, newP1, newP2);
      setWhatIfResult(res);
      const xml = generateCapXmlPayload(classification, plan, res);
      setCapXmlText(xml);
    }
  };

  const getDisasterIcon = (cls) => {
    if (cls === 'LANDSLIDE_DEBRIS_FLOW') return Mountain;
    if (cls === 'TROPICAL_CYCLONE') return Wind;
    if (cls === 'RIVERINE_FLOOD') return Waves;
    if (cls === 'FOREST_WILDFIRE') return Flame;
    if (cls === 'VOLCANIC_ANOMALY') return Activity;
    return Zap;
  };

  const getDisasterFriendlyName = (cls) => {
    if (cls === 'LANDSLIDE_DEBRIS_FLOW') return tr('Hillside Landslide & Debris Torrent', 'पहाड़ी भूस्खलन एवं मलबा प्रवाह');
    if (cls === 'TROPICAL_CYCLONE') return tr('Tropical Cyclone & Coastal Surge', 'उष्णकटिबंधीय चक्रवात एवं समुद्री ज्वार');
    if (cls === 'RIVERINE_FLOOD') return tr('Riverine Basin Inundation & Flood', 'नदी घाटी जलभराव एवं बाढ़');
    if (cls === 'FOREST_WILDFIRE') return tr('Forest Canopy Wildfire & Blaze', 'वनाग्नि संकट एवं बायोस्फीयर आग');
    if (cls === 'VOLCANIC_ANOMALY') return tr('Volcanic Thermal Eruption & Gas Plume', 'ज्वालामुखी विस्फोट एवं गैस उत्सर्जन');
    if (cls === 'SEISMIC_EARTHQUAKE') return tr('Tectonic Fault Rupture & Earthquake', 'भूकंपीय विखंडन एवं कंपन');
    return cls;
  };

  const handleCopyDirective = () => {
    const textToCopy = lang === 'hi' ? plan?.directives?.hi : plan?.directives?.en;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedDirective(true);
      setTimeout(() => setCopiedDirective(false), 2500);
    }
  };

  const handleDownloadXml = () => {
    const blob = new Blob([capXmlText], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAP-Warning-${classification?.classified_class || 'Disaster'}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const DisasterIcon = classification ? getDisasterIcon(classification.classified_class) : Brain;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP COMMAND HEADER                                                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{tr('Autonomous Multi-Hazard AI', 'स्वायत्त बहु-आपदा एआई')}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{tr('Individual Disaster Planner Engine Active', 'व्यक्तिगत आपदा योजना इंजन सक्रिय')}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400 shrink-0" />
              <span>{tr('AI Disaster Classifier & Strategic Action Planner', 'एआई आपदा वर्गीकरण एवं व्यक्तिगत कार्य योजना')}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {tr(
                'Classifies each incoming disaster individually via multi-sensor telemetry & NLP heuristics, builds a specialized tactical mitigation matrix, and computes hazard-specific real-time What-If physics simulations.',
                'मल्टी-सेंसर टेलीमेट्री एवं भाषा विश्लेषण द्वारा प्रत्येक आपदा को व्यक्तिगत रूप से वर्गीकृत करता है, विशेष परिचालन कार्य योजना तैयार करता है, और वास्तविक समय के भौतिकी सिमुलेशन की गणना करता है।'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setCapModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 border border-indigo-400/40 transition-all shadow-sm"
              title="Inspect ITU-T X.1303 Common Alerting Protocol XML"
            >
              <FileCode className="w-4 h-4 text-indigo-300" />
              <span>{tr('View CAP v1.2 XML', 'सीएपी एक्सएमएल देखें')}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>{tr('Print Tactical Brief', 'संक्षिप्त विवरण प्रिंट')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTAKE & FORMULATION DECK                                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {tr('Disaster Intake & Sensor Telemetry Feed', 'आपदा अंतर्ग्रहण एवं सेंसर टेलीमेट्री फीड')}
            </h2>
          </div>

          {/* Toggle Mode: Presets vs Custom */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setIntakeMode('preset')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                intakeMode === 'preset' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tr('High-Stakes Presets (1-Click)', 'प्रमुख आपदा परिदृश्य (1-क्लिक)')}
            </button>
            <button
              onClick={() => setIntakeMode('custom')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                intakeMode === 'custom' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tr('Custom Sensor & Text Studio', 'कस्टम सेंसर एवं विवरण स्टूडियो')}
            </button>
          </div>
        </div>

        {/* CASE A: High Stakes Presets */}
        {intakeMode === 'preset' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {presets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const IconComp = getDisasterIcon(preset.category_hint);
              return (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 line-clamp-1">
                          {lang === 'hi' && preset.title_hi ? preset.title_hi : preset.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                          {lang === 'hi' && preset.region_hi ? preset.region_hi : preset.region}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'hi' && preset.description_hi ? preset.description_hi : preset.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono font-semibold pt-1 border-t border-slate-100 text-slate-500">
                    <span>{preset.category_hint.replace(/_/g, ' ')}</span>
                    <span className="text-indigo-600 font-bold">{tr('Load & Classify →', 'लोड एवं विश्लेषण →')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* CASE B: Custom Sensor & Text Studio */}
        {intakeMode === 'custom' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {tr('Incident Location / Target Region', 'घटना स्थल / लक्षित क्षेत्र')}
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Coastal Puri, Odisha or Nilgiri Hills, Tamil Nadu"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {tr('Disaster Narrative / Ground Observation Text', 'आपदा विवरण / प्रत्यक्षदर्शी रिपोर्ट')}
                </label>
                <textarea
                  rows={2}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type field report or keywords in English or Hindi (e.g. flash flood dyke breach, torrential rain landslide, 120kmh cyclone)..."
                />
              </div>
            </div>

            {/* Custom Telemetry Grid */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
                <span>{tr('Live Sensor Telemetry Array', 'सेंसर टेलीमेट्री एरे')}</span>
                <span className="text-[10px] text-slate-400 font-normal">{tr('Adjust inputs to observe AI re-classification', 'एआई पुनः वर्गीकरण हेतु मान बदलें')}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">{tr('Rainfall 48h (mm)', '48 घंटे वर्षा (मिमी)')}</div>
                  <input
                    type="number"
                    value={customTelemetry.rainfall_48h_mm}
                    onChange={(e) => setCustomTelemetry({ ...customTelemetry, rainfall_48h_mm: Number(e.target.value) })}
                    className="w-full font-bold text-slate-900 border-none p-0 focus:outline-none text-sm"
                  />
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">{tr('Soil Saturation (%)', 'मृदा संतृप्ति (%)')}</div>
                  <input
                    type="number"
                    value={customTelemetry.soil_saturation_pct}
                    onChange={(e) => setCustomTelemetry({ ...customTelemetry, soil_saturation_pct: Number(e.target.value) })}
                    className="w-full font-bold text-slate-900 border-none p-0 focus:outline-none text-sm"
                  />
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">{tr('Wind Speed (km/h)', 'हवा की गति (किमी/घंटा)')}</div>
                  <input
                    type="number"
                    value={customTelemetry.wind_speed_kmh}
                    onChange={(e) => setCustomTelemetry({ ...customTelemetry, wind_speed_kmh: Number(e.target.value) })}
                    className="w-full font-bold text-slate-900 border-none p-0 focus:outline-none text-sm"
                  />
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">{tr('Pressure (hPa)', 'वायुदाब (hPa)')}</div>
                  <input
                    type="number"
                    value={customTelemetry.barometric_pressure_hpa}
                    onChange={(e) => setCustomTelemetry({ ...customTelemetry, barometric_pressure_hpa: Number(e.target.value) })}
                    className="w-full font-bold text-slate-900 border-none p-0 focus:outline-none text-sm"
                  />
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">{tr('River Discharge (cfs)', 'नदी डिस्चार्ज (क्यूसेक)')}</div>
                  <input
                    type="number"
                    value={customTelemetry.river_discharge_cusecs}
                    onChange={(e) => setCustomTelemetry({ ...customTelemetry, river_discharge_cusecs: Number(e.target.value) })}
                    className="w-full font-bold text-slate-900 border-none p-0 focus:outline-none text-sm"
                  />
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">{tr('Seismic PGA (g)', 'भूकंपीय त्वरण (g)')}</div>
                  <input
                    type="number"
                    step="0.05"
                    value={customTelemetry.seismic_pga_g}
                    onChange={(e) => setCustomTelemetry({ ...customTelemetry, seismic_pga_g: Number(e.target.value) })}
                    className="w-full font-bold text-slate-900 border-none p-0 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCustomSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{tr('Run AI Classification & Synthesize Plan for Custom Input', 'कस्टम इनपुट हेतु एआई वर्गीकरण एवं योजना निर्माण चलाएं')}</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. AI CLASSIFICATION & EXPLAINABILITY (XAI) SUMMARY                        */}
      {/* ========================================================================= */}
      {classification && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                <DisasterIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${classification.badge_color}`}>
                    {lang === 'hi' ? classification.alert_label_hi : classification.alert_label}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    MHSI {classification.mhsi_score} / 100
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  {tr('Classified Hazard Archetype:', 'पहचाना गया आपदा प्रकार:')}{' '}
                  <span className="text-indigo-700">{getDisasterFriendlyName(classification.classified_class)}</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 self-start lg:self-auto">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {tr('AI Calibrated Confidence', 'एआई विश्वास स्कोर')}
                </div>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {classification.confidence_pct}%
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border-4 border-indigo-600 flex items-center justify-center text-xs font-bold text-indigo-700 font-mono">
                AI
              </div>
            </div>
          </div>

          {/* Probabilities distribution across all classes */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
              <span>{tr('Multi-Class Neural Probability Vector', 'बहु-वर्ग संभाव्यता वितरण')}</span>
              <span className="text-[10px] text-slate-400">{tr('Softmax normalized across disaster archetypes', 'आपदा प्रकारों में प्रसामान्यीकृत')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.entries(classification.class_probabilities || {}).map(([cls, pct]) => {
                const isWinner = cls === classification.classified_class;
                const Icon = getDisasterIcon(cls);
                return (
                  <div
                    key={cls}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      isWinner
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className={`w-3.5 h-3.5 ${isWinner ? 'text-indigo-600 font-bold' : 'text-slate-400'}`} />
                      <span className={`font-mono font-bold ${isWinner ? 'text-indigo-700' : 'text-slate-600'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-700 truncate" title={cls}>
                      {cls.split('_')[0]}
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-indigo-600' : 'bg-slate-400'}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explainable AI (XAI) Feature Attributions */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>{tr('Explainable AI (XAI) Feature Attributions · What Triggered This Classification', 'व्याख्यात्मक एआई (XAI) घटक भार · इस वर्गीकरण का कारण')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {classification.feature_attributions?.map((attr, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 truncate">
                    {lang === 'hi' && attr.feature_hi ? attr.feature_hi : attr.feature}
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-xs">
                    {attr.value}
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500">{tr('Weight Impact', 'भार प्रभाव')}</span>
                    <span className="font-mono font-bold text-indigo-600">{attr.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. WORKSPACE TABS: STRATEGIC PLAN vs DYNAMIC WHAT-IF SIMULATION            */}
      {/* ========================================================================= */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'plan'
              ? 'border-indigo-600 text-indigo-900 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>{tr('Individual Strategic Action Plan', 'व्यक्तिगत रणनीतिक कार्य योजना')}</span>
        </button>

        <button
          onClick={() => setActiveTab('whatif')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'whatif'
              ? 'border-indigo-600 text-indigo-900 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>{tr('Disaster-Specific "What-If" Simulation Sandbox', 'आपदा-विशिष्ट "व्हाट-इफ" सिमुलेशन सैंडबॉक्स')}</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'border-indigo-600 text-indigo-900 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{tr('Resource Requisitions & Assets', 'संसाधन आवश्यकता एवं उपकरण')}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB A: INDIVIDUAL STRATEGIC ACTION PLAN                                   */}
      {/* ========================================================================= */}
      {activeTab === 'plan' && plan && (
        <div className="space-y-6">
          {/* Disaster Physics Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {tr('Disaster Mechanics & Propagation Physics', 'आपदा यांत्रिकी एवं फैलाव भौतिकी')}
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {lang === 'hi' && plan.hazard_mechanics_hi ? plan.hazard_mechanics_hi : plan.hazard_mechanics}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {(lang === 'hi' && plan.primary_threat_vectors_hi ? plan.primary_threat_vectors_hi : plan.primary_threat_vectors)?.map((threat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-red-50/40 border border-red-200/60 p-2.5 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>{threat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phased Operational Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {tr('Chronological Tactical Response Timeline (0h to 72h)', 'कालानुक्रमिक रणनीतिक प्रतिक्रिया समयरेखा (0 से 72 घंटे)')}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                NDMA SOP Standard 2026
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.phases?.map((phase, idx) => {
                const actions = lang === 'hi' && phase.actions_hi ? phase.actions_hi : phase.actions;
                return (
                  <div
                    key={phase.phase_id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-200">
                          {phase.timeframe}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Phase {idx + 1}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-slate-900">
                        {lang === 'hi' && phase.title_hi ? phase.title_hi : phase.title}
                      </h4>

                      <ul className="space-y-2 mt-2.5">
                        {actions.map((act, actIdx) => (
                          <li key={actIdx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                            <span className="leading-relaxed">{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tr('Standard Operational Protocol Ready', 'मानक संचालन प्रोटोकॉल तैयार')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Bilingual Command Directive */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">
                  {tr('Official Authority Incident Commander Directive', 'आधिकारिक आपदा कमान निर्देश')}
                </h4>
              </div>

              <button
                onClick={handleCopyDirective}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20"
              >
                {copiedDirective ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tr('Copied to Clipboard!', 'कॉपी किया गया!')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>{tr('Copy Directive', 'निर्देश कॉपी करें')}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-mono bg-black/30 p-3 rounded-xl border border-white/10">
              {lang === 'hi' ? plan.directives?.hi : plan.directives?.en}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB B: DISASTER-SPECIFIC "WHAT-IF" SIMULATION SANDBOX                      */}
      {/* ========================================================================= */}
      {activeTab === 'whatif' && whatIfResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                {tr('Dynamic "What-If" Physics Simulation Engine', 'गतिशील "व्हाट-इफ" भौतिकी सिमुलेशन इंजन')}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {tr(
                'Adjust parameters tailored to this disaster to watch the AI re-compute safety factors, danger zones, and evacuation targets.',
                'इस आपदा हेतु विशेष मापदंडों को समायोजित करें और देखें कि एआई कैसे सुरक्षा गुणांक, खतरे के क्षेत्र और निकासी लक्ष्यों की पुनः गणना करता है।'
              )}
            </p>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{whatIfControls.param1_name}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                  {whatIfParam1}
                </span>
              </div>
              <input
                type="range"
                min={whatIfControls.param1_min}
                max={whatIfControls.param1_max}
                step={whatIfControls.param1_step}
                value={whatIfParam1}
                onChange={(e) => handleWhatIfSliderChange(Number(e.target.value), whatIfParam2)}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{whatIfControls.param1_min}</span>
                <span>{whatIfControls.param1_max}</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{whatIfControls.param2_name}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                  {whatIfParam2}
                </span>
              </div>
              <input
                type="range"
                min={whatIfControls.param2_min}
                max={whatIfControls.param2_max}
                step={whatIfControls.param2_step}
                value={whatIfParam2}
                onChange={(e) => handleWhatIfSliderChange(whatIfParam1, Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{whatIfControls.param2_min}</span>
                <span>{whatIfControls.param2_max}</span>
              </div>
            </div>
          </div>

          {/* Headline Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
            whatIfResult.severity_tag === 'HIGH_DANGER'
              ? 'bg-red-50 border-red-300 text-red-900'
              : whatIfResult.severity_tag === 'WARNING'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                whatIfResult.severity_tag === 'HIGH_DANGER' ? 'bg-red-600' : whatIfResult.severity_tag === 'WARNING' ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {tr('Calculated Threat Condition Under Simulated What-If Scenario', 'सिमुलेटेड परिदृश्य के तहत गणना की गई स्थिति')}
                </div>
                <div className="text-sm font-black">
                  {lang === 'hi' && whatIfResult.status_headline_hi ? whatIfResult.status_headline_hi : whatIfResult.status_headline}
                </div>
              </div>
            </div>

            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-white/70 shadow-xs">
              {whatIfResult.simulation_type}
            </span>
          </div>

          {/* 4 Computed What-If Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {whatIfResult.metrics?.map((m, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  m.flag === 'danger'
                    ? 'border-red-300 bg-red-50/50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'hi' && m.label_hi ? m.label_hi : m.label}
                </div>
                <div className={`text-xl font-black font-mono ${m.flag === 'danger' ? 'text-red-700' : 'text-slate-900'}`}>
                  {m.value}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {m.unit}
                </div>
              </div>
            ))}
          </div>

          {/* AI Inference Explanation */}
          <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-xl text-xs text-purple-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-purple-900">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{tr('AI Synthesis & Predictive Physics Assessment', 'एआई विश्लेषण एवं भौतिकी मूल्यांकन')}</span>
            </div>
            <p className="leading-relaxed">
              {lang === 'hi' && whatIfResult.ai_inference_hi ? whatIfResult.ai_inference_hi : whatIfResult.ai_inference}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB C: RESOURCE REQUISITIONS & ASSETS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && plan && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                {tr('Disaster-Specific Resource Mobilization Matrix', 'आपदा-विशिष्ट संसाधन एवं राहत उपकरण तालिका')}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {tr(
                'Itemized deployment required based on classified hazard physics and exposure limits.',
                'आपदा की गंभीरता और प्रभावित आबादी के आधार पर आवश्यक उपकरणों की सूची।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(plan.resources || {}).map(([key, val]) => (
              <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {typeof val === 'number' ? val.toLocaleString() : val}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{tr('Requisition Cleared via DM Act', 'आवश्यकता स्वीकृत')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CAP v1.2 XML VIEWER                                               */}
      {/* ========================================================================= */}
      {capModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-black text-white">
                  ITU-T X.1303 Common Alerting Protocol (CAP v1.2) XML
                </h3>
              </div>
              <button
                onClick={() => setCapModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] text-emerald-400 bg-black/40 leading-relaxed">
              <pre className="whitespace-pre-wrap">{capXmlText}</pre>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-900/80">
              <span className="text-[11px] text-slate-400 font-mono">
                Standard NDMA CAP XML Format
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(capXmlText);
                    alert('CAP XML copied to clipboard');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{tr('Copy XML', 'एक्सएमएल कॉपी करें')}</span>
                </button>
                <button
                  onClick={handleDownloadXml}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{tr('Download .xml', '.xml डाउनलोड करें')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
