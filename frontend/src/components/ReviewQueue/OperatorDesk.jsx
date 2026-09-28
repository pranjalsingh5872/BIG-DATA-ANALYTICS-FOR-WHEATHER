import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowUpRight, ShieldAlert, Radio, FileText, Check, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export default function OperatorDesk({ onEventUpdated }) {
  const [queue, setQueue] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [decision, setDecision] = useState('VERIFIED');
  const [reason, setReason] = useState('Corroborated with local meteorological radar observation.');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadQueue = async (preserveSelectedId = null) => {
    try {
      setLoading(true);
      const res = await api.getReviewQueue();
      setQueue(res);

      if (res.length > 0) {
        if (preserveSelectedId) {
          const match = res.find(e => e.id === preserveSelectedId);
          setSelectedEvent(match || res[0]);
        } else {
          setSelectedEvent(res[0]);
        }
      } else {
        setSelectedEvent(null);
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

      setSuccessMsg(`✓ Report ${currentId} marked as ${finalDecision} and cleared. Next case loaded.`);
      setTimeout(() => setSuccessMsg(''), 3500);

      // Submit audit decision to backend
      await api.submitOperatorDecision(
        currentId,
        finalDecision,
        reason || `Authoritative operator verdict: ${finalDecision}`,
        'Logged via Tactical Review Console'
      );

      // Refresh background queue to stay synchronized
      const freshQueue = await api.getReviewQueue();
      setQueue(freshQueue);

      if (nextEvent) {
        const stillInFresh = freshQueue.find(e => e.id === nextEvent.id);
        setSelectedEvent(stillInFresh || freshQueue[0] || null);
      } else {
        setSelectedEvent(freshQueue[0] || null);
      }

      if (onEventUpdated) onEventUpdated();
    } catch (err) {
      console.error('Failed to submit operator decision', err);
      // Rollback to actual server state on error
      await loadQueue();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedSamples = async () => {
    try {
      setSeeding(true);
      await api.seedPendingReview();
      await loadQueue();
      if (onEventUpdated) onEventUpdated();
    } catch (err) {
      console.error('Failed to seed review samples', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
            <span>Human-in-the-Loop Operator Review Console</span>
          </h2>
          <p className="text-xs text-slate-500">
            Authoritative human review pass for unverified crowd signals, anomalies, and quarantine reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadQueue(selectedEvent?.id)}
            title="Refresh review queue"
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs flex items-center gap-1 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-100 border border-amber-300 text-amber-800 font-mono font-bold">
            Queue Size: {queue.length} Pending
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
        <div className="p-12 text-center text-slate-500 bg-command-card rounded-xl border border-command-border">
          <Radio className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <span>Loading Unreviewed Reports Queue...</span>
        </div>
      ) : queue.length === 0 ? (
        <div className="p-12 text-center bg-command-card rounded-xl border border-command-border text-slate-500 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">All Clear! No Pending Reports</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Every incoming weather report has been reviewed and verified. When citizens submit new ground observations or anomalies occur, they will appear here automatically.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleSeedSamples}
              disabled={seeding}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{seeding ? 'Ingesting Sample Cases...' : 'Load Sample Unreviewed Reports to Test Verification'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Queue Items List */}
          <div className="lg:col-span-5 bg-command-card border border-command-border rounded-xl p-3.5 shadow-sm max-h-[600px] overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 px-1 mb-1">
              <span>Pending Review Queue ({queue.length})</span>
              <span className="text-blue-600">Click to Inspect</span>
            </div>
            {queue.map((ev) => {
              const isSelected = selectedEvent?.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-blue-700 font-bold">{ev.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ev.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {ev.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{ev.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{ev.city}, {ev.state}</span>
                    <span className="text-amber-700 font-bold">Trust: {ev.trust_score}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Inspection & Decision Desk */}
          {selectedEvent ? (
            <div className="lg:col-span-7 bg-command-card border border-command-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b border-command-border pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Awaiting Authoritative Operator Decision
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    {selectedEvent.id}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-2">{selectedEvent.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Side-by-side Evidence Check */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Claim details */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-slate-800">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Report Claim</span>
                  <div><b>Category:</b> {selectedEvent.category}</div>
                  <div><b>Source:</b> {selectedEvent.source} ({selectedEvent.source_author || 'Citizen'})</div>
                  <div><b>Coordinates:</b> {selectedEvent.latitude.toFixed(4)}, {selectedEvent.longitude.toFixed(4)}</div>
                  <div><b>City/State:</b> {selectedEvent.city}, {selectedEvent.state}</div>
                  <div><b>H3 Cell:</b> <code className="text-blue-700 text-[10px] font-bold">{selectedEvent.h3_index}</code></div>
                </div>

                {/* Physical station truth */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-slate-800">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Station Ground Truth</span>
                  <div><b>Nearest Sensor:</b> {selectedEvent.radar_station_name || 'IMD Regional AWS'}</div>
                  <div><b>Sensor Value:</b> {selectedEvent.radar_recorded_value || 0.0} mm/kmh</div>
                  <div>
                    <b>Corroboration:</b>{' '}
                    <span className={selectedEvent.radar_corroborated ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {selectedEvent.radar_corroborated ? 'Station Confirmed' : 'Sensor Mismatch'}
                    </span>
                  </div>
                  <div><b>Media Auth:</b> {selectedEvent.is_media_authentic ? 'Passed' : 'Recycled Flag'}</div>
                </div>
              </div>

              {/* Decision Action Form */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Select Verdict</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDecision('VERIFIED');
                      setReason('Corroborated with local meteorological radar observation.');
                    }}
                    className={`p-2.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      decision === 'VERIFIED'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verify Event</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecision('REJECTED');
                      setReason('Disproven by Doppler radar velocity telemetry and satellite imagery.');
                    }}
                    className={`p-2.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      decision === 'REJECTED'
                        ? 'bg-red-50 border-red-500 text-red-800 shadow-sm ring-1 ring-red-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Reject / Fake</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecision('QUARANTINED');
                      setReason('High viral signal detected with anomalous conflicting sensor reports.');
                    }}
                    className={`p-2.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      decision === 'QUARANTINED'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-sm ring-1 ring-amber-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Quarantine</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Authoritative Operator Justification
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 outline-none"
                    placeholder="Enter reason for verification or rejection..."
                  />
                </div>

                {/* Primary Action Button: Commits and Advances to Next */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecisionSubmit()}
                    disabled={submitting}
                    className={`flex-1 py-3 rounded-lg text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                      decision === 'VERIFIED'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : decision === 'REJECTED'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    <span>{submitting ? 'Committing & Advancing...' : `${decision === 'VERIFIED' ? 'Verify' : decision === 'REJECTED' ? 'Reject' : 'Quarantine'} & Advance to Next Case`}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 bg-command-card border border-command-border rounded-xl p-8 shadow-sm text-center text-slate-500">
              <span>Select an item from the left queue to inspect evidence.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
