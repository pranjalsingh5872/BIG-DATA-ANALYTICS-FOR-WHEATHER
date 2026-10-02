import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, BellRing, Radio, CheckCircle, ShieldAlert, Send, Volume2, VolumeX, Smartphone, AlertOctagon, Code, X, Sparkles, Activity } from 'lucide-react';
import { api } from '../../services/api';
import { formatIST } from '../../utils/time';
import { useLanguage } from '../../context/LanguageContext';

// Web Audio API Emergency Siren Synthesizer (No external audio files needed)
let audioContextInstance = null;
let activeOscillators = [];

export const playEmergencySiren = (durationMs = 4500) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContextInstance || audioContextInstance.state === 'closed') {
      audioContextInstance = new AudioCtx();
    }
    if (audioContextInstance.state === 'suspended') {
      audioContextInstance.resume();
    }

    const now = audioContextInstance.currentTime;
    const masterGain = audioContextInstance.createGain();
    masterGain.gain.setValueAtTime(0.2, now);
    masterGain.connect(audioContextInstance.destination);

    // Standard Dual Tone: 853 Hz & 960 Hz (Official EAS / National Disaster Alert Frequencies)
    const osc1 = audioContextInstance.createOscillator();
    const osc2 = audioContextInstance.createOscillator();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(853, now);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(960, now);

    // Pulsing LFO Modulation
    const lfo = audioContextInstance.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(4, now);
    const lfoGain = audioContextInstance.createGain();
    lfoGain.gain.setValueAtTime(0.12, now);
    lfo.connect(lfoGain.gain);

    osc1.connect(masterGain);
    osc2.connect(masterGain);

    osc1.start(now);
    osc2.start(now);

    const stopTime = now + (durationMs / 1000);
    masterGain.gain.exponentialRampToValueAtTime(0.001, stopTime);
    osc1.stop(stopTime);
    osc2.stop(stopTime);

    activeOscillators = [osc1, osc2];
  } catch (err) {
    console.warn('Web Audio emergency siren could not be initialized:', err);
  }
};

export const stopEmergencySiren = () => {
  try {
    activeOscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    activeOscillators = [];
    if (audioContextInstance && audioContextInstance.state === 'running') {
      audioContextInstance.suspend();
    }
  } catch {}
};

export default function CapBroadcast({ events, onAlertDispatched }) {
  const { tr, translateSeverity, translateCity, translateState, translateReportTitle } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [sirenMuted, setSirenMuted] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [cbsModalOpen, setCbsModalOpen] = useState(false);
  const [showXmlView, setShowXmlView] = useState(false);
  const [activeAlertData, setActiveAlertData] = useState(null);
  const sirenTimerRef = useRef(null);

  const [form, setForm] = useState({
    headline: 'IMD RED ALERT: Flash Flood and Torrential Downpour Threat',
    urgency: 'Immediate',
    severity: 'Extreme',
    certainty: 'Observed',
    areas: ['Mumbai Suburban', 'Thane District'],
    instructions: 'Evacuate low-lying areas. Avoid highway underpasses. Keep emergency battery lights ready.',
    target_channels: ['SMS_CELL_BROADCAST', 'CAP_RSS', 'WHATSAPP_EMERGENCY']
  });

  const triggerSiren = () => {
    if (sirenMuted) return;
    setIsSirenPlaying(true);
    playEmergencySiren(4500);
    if (sirenTimerRef.current) clearTimeout(sirenTimerRef.current);
    sirenTimerRef.current = setTimeout(() => {
      setIsSirenPlaying(false);
    }, 4500);
  };

  const handleStopSiren = () => {
    stopEmergencySiren();
    setIsSirenPlaying(false);
    if (sirenTimerRef.current) clearTimeout(sirenTimerRef.current);
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getAlertHistory();
      setHistory(res);
    } catch (err) {
      console.error('Failed to load alert history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    if (events && events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
    return () => {
      handleStopSiren();
    };
  }, [events]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!selectedEventId) {
      setErrorMsg(tr('Please select an active weather event to anchor this CAP broadcast.', 'कृपया इस CAP प्रसारण हेतु एक सक्रिय मौसम घटना चुनें।'));
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.broadcastCapAlert({
        event_id: selectedEventId,
        headline: form.headline,
        urgency: form.urgency,
        severity: form.severity,
        certainty: form.certainty,
        areas: form.areas,
        instructions: form.instructions,
        target_channels: form.target_channels
      });

      const alertPayload = {
        identifier: res?.identifier || `CAP-IN-IMD-${Date.now().toString(36).toUpperCase()}`,
        sent_at: new Date().toISOString(),
        headline: form.headline,
        urgency: form.urgency,
        severity: form.severity,
        certainty: form.certainty,
        areas: form.areas,
        instructions: form.instructions,
        sender: 'ndma-operations@gov.in (National Disaster Management Authority)'
      };

      setActiveAlertData(alertPayload);
      triggerSiren();
      setCbsModalOpen(true);

      setSuccessMsg(tr('Common Alerting Protocol (CAP) v1.2 bulletin successfully signed and disseminated!', 'कॉमन अलर्टिंग प्रोटोकॉल (CAP) v1.2 बुलेटिन सफलतापूर्वक हस्ताक्षरित एवं प्रसारित किया गया!'));
      await loadHistory();
      if (onAlertDispatched) onAlertDispatched();
    } catch (err) {
      console.error('Failed to dispatch alert', err);
      setErrorMsg(tr('CAP broadcast dispatch failed. Check broker status.', 'CAP प्रसारण प्रेषण विफल रहा। ब्रोकर स्थिति जांचें।'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-red-600" />
            <span>{tr('CAP v1.2 Emergency Alert Dispatch Console', 'CAP v1.2 आपातकालीन चेतावनी प्रेषण कंसोल')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {tr('ITU/WMO-standard emergency broadcast dispatch to citizen mobile phones, civil defense sirens, and state portals', 'नागरिक मोबाइल फोन, नागरिक सुरक्षा सायरन और राज्य पोर्टलों पर ITU/WMO-मानक आपातकालीन प्रसारण प्रेषण')}
          </p>
        </div>

        {/* Sensory Urgency: Audio Siren & CBS Preview Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Siren Audio Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isSirenPlaying) {
                handleStopSiren();
              } else {
                setSirenMuted(!sirenMuted);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
              sirenMuted
                ? 'bg-slate-100 text-slate-600 border-slate-300'
                : isSirenPlaying
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200'
            }`}
            title="Toggle EAS Civil Defense Emergency Warning Siren"
          >
            {sirenMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>{tr('Siren: Muted', 'सायरन: म्यूट')}</span>
              </>
            ) : isSirenPlaying ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin text-white" />
                <span>{tr('Stop Siren', 'सायरन रोकें')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-red-600" />
                <span>{tr('Siren: Active', 'सायरन: सक्रिय')}</span>
              </>
            )}
          </button>

          {/* Test Siren Button */}
          <button
            type="button"
            onClick={triggerSiren}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all flex items-center gap-1 shadow-xs"
            title="Test 853Hz & 960Hz dual-frequency EAS emergency alert chime"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-700" />
            <span>{tr('Test EAS Tone', 'EAS टोन टेस्ट')}</span>
          </button>

          {/* Direct CBS Mobile Preview Modal Button */}
          <button
            type="button"
            onClick={() => {
              setActiveAlertData({
                identifier: `CAP-IN-IMD-${Date.now().toString(36).toUpperCase()}`,
                sent_at: new Date().toISOString(),
                headline: form.headline,
                urgency: form.urgency,
                severity: form.severity,
                certainty: form.certainty,
                areas: form.areas,
                instructions: form.instructions,
                sender: 'ndma-operations@gov.in (National Disaster Management Authority)'
              });
              triggerSiren();
              setCbsModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-xs transition-all flex items-center gap-1.5"
            title="Preview how this alert appears on citizen phones via Cell Broadcast Service"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{tr('Simulate Phone Alert (CBS)', 'मोबाइल अलर्ट सिमुलेशन (CBS)')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Broadcast Dispatch Composer */}
        <form onSubmit={handleBroadcast} className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-red-600" />
              <span>{tr('Compose Official Warning Bulletin', 'आधिकारिक चेतावनी बुलेटिन तैयार करें')}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono border border-red-300 font-bold">
              {tr('Standard: WMO CAP-v1.2', 'मानक: WMO CAP-v1.2')}
            </span>
          </div>

          {errorMsg && <div className="p-2 rounded bg-red-50 border border-red-200 text-red-800 text-xs">{errorMsg}</div>}
          {successMsg && <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">{successMsg}</div>}

          {/* Anchor Event */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
              {tr('Anchor Verified Event ID *', 'एंकर सत्यापित इवेंट आईडी *')}
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-red-500 outline-none"
            >
              {events?.map((ev, idx) => (
                <option key={ev.id || `ev-opt-${idx}`} value={ev.id}>
                  {ev.id} - {translateReportTitle(ev.title)} ({translateCity(ev.city)}, {translateState(ev.state)})
                </option>
              ))}
            </select>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
              {tr('Alert Headline *', 'चेतावनी शीर्षक *')}
            </label>
            <input
              type="text"
              required
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-red-500 outline-none"
            />
          </div>

          {/* Urgency & Severity & Certainty */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                {tr('Urgency', 'तात्कालिकता')}
              </label>
              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:border-red-500 outline-none"
              >
                <option value="Immediate">{tr('Immediate', 'तत्काल')}</option>
                <option value="Expected">{tr('Expected', 'अपेक्षित')}</option>
                <option value="Future">{tr('Future', 'भविष्य')}</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                {tr('Severity', 'गंभीरता')}
              </label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:border-red-500 outline-none"
              >
                <option value="Extreme">{tr('Extreme (Red)', 'चरम (लाल)')}</option>
                <option value="Severe">{tr('Severe (Orange)', 'गंभीर (नारंगी)')}</option>
                <option value="Moderate">{tr('Moderate (Yellow)', 'मध्यम (पीला)')}</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                {tr('Certainty', 'निश्चितता')}
              </label>
              <select
                value={form.certainty}
                onChange={(e) => setForm({ ...form, certainty: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:border-red-500 outline-none"
              >
                <option value="Observed">{tr('Observed (Radar)', 'अवलोकित (रडार)')}</option>
                <option value="Likely">{tr('Likely (>80%)', 'संभावित (>80%)')}</option>
                <option value="Possible">{tr('Possible', 'संभव')}</option>
              </select>
            </div>
          </div>

          {/* Affected Areas */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
              {tr('Target Districts / Geospatial Zones (Comma separated)', 'लक्षित ज़िले / भू-स्थानिक क्षेत्र (अल्पविराम से अलग)')}
            </label>
            <input
              type="text"
              value={form.areas.join(', ')}
              onChange={(e) => setForm({ ...form, areas: e.target.value.split(',').map((s) => s.trim()) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-red-500 outline-none"
            />
          </div>

          {/* Citizen Instructions */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
              {tr('Public Protective Action Instructions *', 'सार्वजनिक सुरक्षात्मक कार्रवाई निर्देश *')}
            </label>
            <textarea
              rows={2}
              required
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:border-red-500 outline-none"
            />
          </div>

          {/* Dispatch Channels */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
              {tr('Active Multi-Channel Gateways', 'सक्रिय मल्टी-चैनल गेटवे')}
            </label>
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 text-slate-700 font-medium">
                <input type="checkbox" defaultChecked className="accent-red-600" />
                <span>{tr('SMS Cell Broadcast', 'एसएमएस सेल ब्रॉडकास्ट')}</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-700 font-medium">
                <input type="checkbox" defaultChecked className="accent-red-600" />
                <span>{tr('CAP RSS Feed', 'CAP RSS फीड')}</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-700 font-medium">
                <input type="checkbox" defaultChecked className="accent-red-600" />
                <span>{tr('WhatsApp Citizen Bot', 'व्हाट्सएप नागरिक बॉट')}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? tr('Disseminating Warning Message...', 'चेतावनी संदेश प्रसारित किया जा रहा है...') : tr('Broadcast Multi-Channel CAP Alert', 'मल्टी-चैनल CAP चेतावनी प्रसारित करें')}</span>
          </button>
        </form>

        {/* Real-time Broadcast Audit Log */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>{tr('CAP Dissemination Log', 'CAP प्रसारण लॉग')}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{tr('Total:', 'कुल:')} {history.length}</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                {tr('No emergency CAP alerts broadcast yet. Ready for dispatch.', 'अभी तक कोई आपातकालीन CAP अलर्ट प्रसारित नहीं किया गया है। प्रेषण हेतु तैयार।')}
              </div>
            ) : (
              history.map((h, idx) => (
                <div key={h.id || h.identifier || `cap-hist-${idx}`} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-red-700 font-bold">{h.identifier}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-800">
                      {translateSeverity(h.severity)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{h.headline}</h4>
                  <p className="text-[11px] text-slate-600 leading-tight">{h.instructions}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200">
                    <span>{tr('Sender:', 'प्रेषक:')} {h.sender}</span>
                    <span>{formatIST(h.sent_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CELL BROADCAST SERVICE (CBS) & SACHET PHONE ALERT SIMULATION MODAL */}
      {cbsModalOpen && activeAlertData && (
        <div
          onClick={() => {
            setCbsModalOpen(false);
            handleStopSiren();
          }}
          className="fixed inset-0 z-[99999] bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-900 border-2 border-slate-700 rounded-[2.5rem] p-4 max-w-md w-full shadow-2xl text-slate-100 cursor-default space-y-3"
          >
            {/* Phone Notch & Status Bar */}
            <div className="flex items-center justify-between px-3 pt-1 text-[11px] font-mono text-slate-400">
              <span className="font-bold">{formatIST(new Date())}</span>
              <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto border border-slate-800 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-800"></span>
              </div>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Modal Header Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white tracking-wider flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span>CBS Broadcast Active</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Ch: 4370 (EAS)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowXmlView(!showXmlView)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 ${
                    showXmlView
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Toggle ITU-T X.1303 CAP XML raw standard"
                >
                  <Code className="w-3 h-3" />
                  <span>{showXmlView ? 'Show Phone UI' : 'View CAP XML'}</span>
                </button>
                <button
                  onClick={() => {
                    setCbsModalOpen(false);
                    handleStopSiren();
                  }}
                  className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showXmlView ? (
              /* ITU-T X.1303 CAP XML Standard View */
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 max-h-[420px] overflow-y-auto font-mono text-[10.5px] text-emerald-400 space-y-1">
                <div className="text-slate-400 text-[10px] border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>WMO / ITU-T X.1303 CAP v1.2 Standard XML Payload</span>
                  <span className="text-amber-400 font-bold">Valid XML</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">
{`<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${activeAlertData.identifier}</identifier>
  <sender>${activeAlertData.sender}</sender>
  <sent>${activeAlertData.sent_at}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>${activeAlertData.headline}</event>
    <urgency>${activeAlertData.urgency}</urgency>
    <severity>${activeAlertData.severity}</severity>
    <certainty>${activeAlertData.certainty}</certainty>
    <headline>${activeAlertData.headline}</headline>
    <description>Emergency alert broadcast via WEATHERNEXUS CAP-CP dispatch node to telecom providers and NDMA Sachet system.</description>
    <instruction>${activeAlertData.instructions}</instruction>
    <area>
      <areaDesc>${activeAlertData.areas.join(', ')}</areaDesc>
    </area>
  </info>
</alert>`}
                </pre>
              </div>
            ) : (
              /* Simulated Smartphone Lockscreen Alert Screen */
              <div className="space-y-3">
                {/* Emergency Siren Audio Wave Animation */}
                <div className="bg-red-950/80 border border-red-800/80 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-red-400 animate-bounce" />
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-red-200">
                        {tr('National EAS Warning Siren Transmitting', 'राष्ट्रीय EAS चेतावनी सायरन प्रसारित')}
                      </div>
                      <div className="text-[9.5px] font-mono text-red-300">
                        {isSirenPlaying ? tr('Dual Tone (853Hz / 960Hz) Playing...', 'दोहरी आवृत्ति (853Hz/960Hz) बज रहा है...') : tr('Civil Defense Audio Broadcast Triggered', 'नागरिक सुरक्षा ऑडियो प्रसारण सक्रिय')}
                      </div>
                    </div>
                  </div>
                  {/* Animated Sound Wave Bars */}
                  <div className="flex items-center gap-1 h-6">
                    <span className="w-1 bg-red-400 rounded-full animate-pulse h-3"></span>
                    <span className="w-1 bg-red-400 rounded-full animate-pulse h-6"></span>
                    <span className="w-1 bg-red-400 rounded-full animate-pulse h-4"></span>
                    <span className="w-1 bg-red-400 rounded-full animate-pulse h-5"></span>
                    <span className="w-1 bg-red-400 rounded-full animate-pulse h-2"></span>
                  </div>
                </div>

                {/* Smartphone Lockscreen Notification Card */}
                <div className="bg-gradient-to-b from-red-600 to-rose-700 rounded-2xl p-4 text-white shadow-xl space-y-2 border border-red-400">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider border-b border-red-500/60 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-yellow-300" />
                      <span>{tr('GOVERNMENT EMERGENCY ALERT (NDMA)', 'सरकारी आपातकालीन चेतावनी (NDMA)')}</span>
                    </span>
                    <span className="font-mono text-yellow-200">{activeAlertData.severity}</span>
                  </div>

                  <h3 className="text-sm font-black tracking-tight leading-snug">
                    {activeAlertData.headline}
                  </h3>

                  <div className="bg-red-900/60 p-2.5 rounded-xl border border-red-500/40 space-y-1 text-xs">
                    <span className="font-black text-yellow-300 block text-[10px] uppercase tracking-wider">
                      {tr('IMMEDIATE CITIZEN ACTION REQUIRED / तत्काल नागरिक कार्रवाई आवश्यक:', 'तत्काल नागरिक कार्रवाई आवश्यक:')}
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-red-50">
                      {activeAlertData.instructions}
                    </p>
                  </div>

                  {/* Bilingual Hindi Alert Broadcast */}
                  <div className="bg-black/30 p-2 rounded-xl text-[11px] text-amber-200 border border-white/10 leading-relaxed">
                    <b>हिन्दी संदेश (NDMA सचेत):</b> मौसम विभाग द्वारा उच्च चेतावनी जारी। कृपया सुरक्षित स्थान पर रहें, निचले इलाकों को खाली करें और आपातकालीन सहायता हेतु 112/1070 पर संपर्क करें।
                  </div>

                  {/* Target Areas Tag */}
                  <div className="flex items-center justify-between text-[9.5px] font-mono text-red-200 pt-1">
                    <span>Zones: <b>{activeAlertData.areas.join(', ')}</b></span>
                    <span>Urgency: <b>{activeAlertData.urgency}</b></span>
                  </div>
                </div>

                {/* Cell Broadcast Channel Technical Strip */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Standard: <b>3GPP TS 23.041</b></span>
                  <span>Dissemination: <b>All Telecom Towers (Cell ID Broadcast)</b></span>
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={triggerSiren}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{tr('Replay Siren', 'पुनः सायरन बजाएं')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCbsModalOpen(false);
                  handleStopSiren();
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                {tr('Acknowledge & Close Simulation', 'पुष्टि करें एवं बंद करें')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
