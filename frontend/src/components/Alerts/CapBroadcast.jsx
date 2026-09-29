import React, { useState, useEffect } from 'react';
import { Megaphone, BellRing, Radio, CheckCircle, ShieldAlert, Send } from 'lucide-react';
import { api } from '../../services/api';
import { formatIST } from '../../utils/time';
import { useLanguage } from '../../context/LanguageContext';

export default function CapBroadcast({ events, onAlertDispatched }) {
  const { tr, translateSeverity } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [form, setForm] = useState({
    headline: 'IMD RED ALERT: Flash Flood and Torrential Downpour Threat',
    urgency: 'Immediate',
    severity: 'Extreme',
    certainty: 'Observed',
    areas: ['Mumbai Suburban', 'Thane District'],
    instructions: 'Evacuate low-lying areas. Avoid highway underpasses. Keep emergency battery lights ready.',
    target_channels: ['SMS_CELL_BROADCAST', 'CAP_RSS', 'WHATSAPP_EMERGENCY']
  });

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
      await api.broadcastCapAlert({
        event_id: selectedEventId,
        headline: form.headline,
        urgency: form.urgency,
        severity: form.severity,
        certainty: form.certainty,
        areas: form.areas,
        instructions: form.instructions,
        target_channels: form.target_channels
      });
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
      <div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-red-600" />
          <span>{tr('CAP v1.2 Emergency Alert Dispatch Console', 'CAP v1.2 आपातकालीन चेतावनी प्रेषण कंसोल')}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {tr('ITU/WMO-standard emergency broadcast dispatch to citizen mobile phones, civil defense sirens, and state portals', 'नागरिक मोबाइल फोन, नागरिक सुरक्षा सायरन और राज्य पोर्टलों पर ITU/WMO-मानक आपातकालीन प्रसारण प्रेषण')}
        </p>
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
                  {ev.id} - {ev.title} ({ev.city}, {ev.state})
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
    </div>
  );
}
