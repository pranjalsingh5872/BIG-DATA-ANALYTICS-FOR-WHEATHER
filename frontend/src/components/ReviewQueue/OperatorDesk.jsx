import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ShieldAlert, Radio, Check, ChevronRight, RefreshCw, Clock } from 'lucide-react';
import { api, ensureRealTime24hWindow } from '../../services/api';
import { FALLBACK_REVIEW_QUEUE } from '../../services/fallbackData';
import { formatIST } from '../../utils/time';
import { useLanguage } from '../../context/LanguageContext';

export default function OperatorDesk({ onEventUpdated }) {
  const { lang, tr, t, translateCategory, translateSeverity, translateStatus, translateCity, translateState, translateReportTitle, translateReportDescription } = useLanguage();
  const [queue, setQueue] = useState(() => {
    try {
      const local = localStorage.getItem('sih_review_queue');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return ensureRealTime24hWindow(parsed);
      }
    } catch {}
    return ensureRealTime24hWindow([...FALLBACK_REVIEW_QUEUE]);
  });
  const [selectedEvent, setSelectedEvent] = useState(() => {
    try {
      const local = localStorage.getItem('sih_review_queue');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {}
    return FALLBACK_REVIEW_QUEUE[0] || null;
  });
  const [decision, setDecision] = useState('VERIFIED');
  const [reason, setReason] = useState('Corroborated with local meteorological radar observation.');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadQueue = async (preserveSelectedId = null) => {
    try {
      const res = await api.getReviewQueue();
      if (res && res.length >= 0) {
        setQueue(res);
        if (preserveSelectedId) {
          const match = res.find(e => e.id === preserveSelectedId);
          setSelectedEvent(match || res[0] || null);
        } else if (!selectedEvent && res.length > 0) {
          setSelectedEvent(res[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load review queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  // Keyboard Shortcuts (V = Verify, R = Reject)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (!selectedEvent || submitting) return;

      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        handleDecisionSubmit('VERIFIED');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleDecisionSubmit('REJECTED');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent, submitting, queue]);

  const handleDecisionSubmit = async (overrideDecision = null) => {
    if (!selectedEvent) return;
    const finalDecision = overrideDecision || decision;
    const currentId = selectedEvent.id;
    const currentIdx = queue.findIndex(e => e.id === currentId);

    // Compute remaining items and determine next problem
    const remaining = queue.filter(e => e.id !== currentId);
    const nextEvent = remaining[currentIdx] || remaining[currentIdx - 1] || remaining[0] || null;

    try {
      setSubmitting(true);

      // Optimistic Advance: finished problem disappears immediately, next problem appears
      setQueue(remaining);
      setSelectedEvent(nextEvent);
      setDecision('VERIFIED');
      setReason('Corroborated with local meteorological radar observation.');

      setSuccessMsg(`✓ Case ${currentId} marked as ${finalDecision}. Authority ledger updated.`);
      setTimeout(() => setSuccessMsg(''), 3500);

      // Submit audit decision to backend
      await api.submitOperatorDecision(
        currentId,
        finalDecision,
        reason || `Authoritative decision: ${finalDecision}`,
        'Logged via Authority Review Desk'
      );

      // Refresh background queue to stay synchronized
      const freshQueue = await api.getReviewQueue();
      setQueue(freshQueue || []);

      if (nextEvent) {
        const stillInFresh = freshQueue.find(e => e.id === nextEvent.id);
        setSelectedEvent(stillInFresh || freshQueue[0] || null);
      } else {
        setSelectedEvent(freshQueue[0] || null);
      }

      if (onEventUpdated) onEventUpdated();
    } catch (err) {
      console.error('Failed to submit decision', err);
      await loadQueue();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Controls - STRICTLY "AUTHORITY REVIEW" */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>{lang === 'hi' ? 'प्राधिकरण समीक्षा' : 'AUTHORITY REVIEW'}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {tr(
              'Official incident triage, report verification, and operational queue curation',
              'आधिकारिक घटना समीक्षा, रिपोर्ट सत्यापन एवं परिचालन कतार प्रबंधन'
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadQueue(selectedEvent?.id)}
            title={tr('Refresh review queue', 'समीक्षा कतार ताज़ा करें')}
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs flex items-center gap-1 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{tr('Refresh Queue', 'कतार ताज़ा करें')}</span>
          </button>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-100 border border-amber-300 text-amber-800 font-mono font-bold">
            {tr('Queue Size:', 'कतार आकार:')} {queue.length} {tr('Pending', 'लंबित')}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading && queue.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-xs">
          <Radio className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <span>{tr('Connecting to Real-Time Authority Review Queue...', 'रियल-टाइम प्राधिकरण समीक्षा कतार से जुड़ रहे हैं...')}</span>
        </div>
      ) : queue.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{tr('All Live Reports Triaged & Verified', 'सभी लाइव रिपोर्ट की समीक्षा एवं सत्यापन पूर्ण')}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {tr(
                'No unreviewed reports in queue. When citizens or field sensors submit new ground observations, they will appear here in real-time for official authority dispatch.',
                'कतार में कोई असमीक्षित रिपोर्ट नहीं है। जब नागरिक या फील्ड सेंसर नए अवलोकन प्रस्तुत करेंगे, तो वे यहां लाइव दिखाई देंगे।'
              )}
            </p>
          </div>
          <div className="pt-1">
            <button
              onClick={() => loadQueue()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{tr('Poll Incoming Observations', 'आगामी अवलोकनों की जांच करें')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Queue Items List */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs max-h-[640px] overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 px-1 mb-1">
              <span>{tr('Active Reports Pending Action', 'समीक्षा हेतु लंबित सक्रिय रिपोर्ट')} ({queue.length})</span>
              <span className="text-emerald-700">{tr('Click to Inspect', 'निरीक्षण हेतु क्लिक करें')}</span>
            </div>
            {queue.map((ev) => {
              const isSelected = selectedEvent?.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-emerald-800 font-bold">{ev.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ev.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {translateSeverity(ev.severity)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{translateReportTitle(ev.title)}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{translateCity(ev.city)}, {translateState(ev.state)}</span>
                    <span className="text-amber-700 font-bold">{tr('Trust:', 'विश्वास:')} {ev.trust_score}%</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{formatIST(ev.observed_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Inspection & Decision Desk */}
          {selectedEvent ? (
            <div key={selectedEvent.id} className="tab-enter lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {tr('Awaiting Authority Decision', 'प्राधिकरण निर्णय की प्रतीक्षा')}
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    {selectedEvent.id}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-2">{translateReportTitle(selectedEvent.title)}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{translateReportDescription(selectedEvent.description)}</p>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {tr('Timestamp:', 'समय-मुहर:')} {formatIST(selectedEvent.observed_at)}
                </div>
              </div>

              {/* Side-by-side Evidence Check */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Claim details */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-slate-800">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">{tr('Report Telemetry', 'रिपोर्ट टेलीमेट्री')}</span>
                  <div><b>{tr('Category:', 'श्रेणी:')}</b> {translateCategory(selectedEvent.category)}</div>
                  <div><b>{tr('Source:', 'स्रोत:')}</b> {selectedEvent.source} ({selectedEvent.source_author || tr('Citizen', 'नागरिक')})</div>
                  <div><b>{tr('Coordinates:', 'निर्देशांक:')}</b> {selectedEvent.latitude?.toFixed(4)}, {selectedEvent.longitude?.toFixed(4)}</div>
                  <div><b>{tr('City/State:', 'शहर / राज्य:')}</b> {translateCity(selectedEvent.city)}, {translateState(selectedEvent.state)}</div>
                  <div><b>{tr('H3 Cell:', 'H3 सेल:')}</b> <code className="text-emerald-700 text-[10px] font-bold">{selectedEvent.h3_index}</code></div>
                </div>

                {/* Physical station truth */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-slate-800">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">{tr('Sensor Cross-Check', 'सेंसर क्रॉस-चेक')}</span>
                  <div><b>{tr('Nearest Sensor:', 'निकटतम सेंसर:')}</b> {selectedEvent.radar_station_name || tr('Regional Meteorological Station', 'क्षेत्रीय मौसम विज्ञान स्टेशन')}</div>
                  <div><b>{tr('Sensor Value:', 'सेंसर मान:')}</b> {selectedEvent.radar_recorded_value || 0.0} mm/kmh</div>
                  <div>
                    <b>{tr('Corroboration:', 'पुष्टि:')}</b>{' '}
                    <span className={selectedEvent.radar_corroborated ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {selectedEvent.radar_corroborated ? tr('Station Confirmed', 'स्टेशन द्वारा संपुष्ट') : tr('Sensor Mismatch', 'सेंसर बेमेल')}
                    </span>
                  </div>
                  <div><b>{tr('Media Auth:', 'मीडिया प्रमाणिकता:')}</b> {selectedEvent.is_media_authentic ? tr('Passed', 'उत्तीर्ण') : tr('Recycled Flag', 'पुनर्चक्रित ध्वज')}</div>
                </div>
              </div>

              {/* Decision Action Form */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">{tr('Authority Verdict', 'प्राधिकरण निर्णय')}</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDecision('VERIFIED');
                      setReason('Corroborated with local meteorological radar observation.');
                    }}
                    className={`p-2.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      decision === 'VERIFIED'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{tr('Verify Event', 'घटना सत्यापित करें')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecision('REJECTED');
                      setReason('Disproven by Doppler radar velocity telemetry and satellite imagery.');
                    }}
                    className={`p-2.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      decision === 'REJECTED'
                        ? 'bg-red-50 border-red-500 text-red-800 shadow-xs ring-1 ring-red-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>{tr('Reject / Fake', 'अस्वीकार / फर्जी')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecision('QUARANTINED');
                      setReason('High viral signal detected with anomalous conflicting sensor reports.');
                    }}
                    className={`p-2.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      decision === 'QUARANTINED'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs ring-1 ring-amber-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>{tr('Quarantine', 'क्वारंटाइन')}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    {tr('Official Authority Justification', 'आधिकारिक प्राधिकरण औचित्य')}
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-emerald-500 outline-none"
                    placeholder={tr('Enter reason for verification or rejection...', 'सत्यापन अथवा अस्वीकृति का कारण दर्ज करें...')}
                  />
                </div>

                {/* Primary Action Button: Commits and Advances to Next */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecisionSubmit()}
                    disabled={submitting}
                    className={`flex-1 py-3 rounded-lg text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99] ${
                      decision === 'VERIFIED'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : decision === 'REJECTED'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    <span>
                      {submitting
                        ? tr('Committing & Advancing...', 'दर्ज कर आगे बढ़ रहे हैं...')
                        : `${decision === 'VERIFIED' ? tr('Verify Event', 'सत्यापित करें') : decision === 'REJECTED' ? tr('Reject', 'अस्वीकार करें') : tr('Quarantine', 'क्वारंटाइन करें')} & ${tr('Advance to Next Case', 'अगले मामले पर जाएं')}`}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[10.5px] text-slate-400 font-mono text-center pt-0.5">
                  {tr('⚡ Power Hotkeys: Press V to Verify · Press R to Reject', '⚡ त्वरित शॉर्टकट: सत्यापित करने हेतु V दबाएं · अस्वीकार करने हेतु R दबाएं')}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center text-slate-500">
              <span>{tr('Select an item from the left queue to inspect evidence.', 'साक्ष्य का निरीक्षण करने के लिए बाईं कतार से एक मद चुनें।')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
