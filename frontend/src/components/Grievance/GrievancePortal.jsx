import React, { useState, useEffect } from 'react';
import { Scale, CheckCircle2, AlertCircle, Radio, Clock, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';

export default function GrievancePortal({ preselectedEventId, onGrievanceSubmitted }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'file'

  // New Grievance Form State
  const [form, setForm] = useState({
    event_id: preselectedEventId || '',
    complainant_name: '',
    contact_email: '',
    grievance_type: 'Severity Mismatch',
    description: ''
  });

  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadGrievances = async () => {
    try {
      setLoading(true);
      const res = await api.getGrievances();
      setGrievances(res);
    } catch (err) {
      console.error('Failed to load grievances', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
    if (preselectedEventId) {
      setForm((prev) => ({ ...prev, event_id: preselectedEventId }));
      setView('file');
    }
  }, [preselectedEventId]);

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      setSubmitting(true);
      await api.submitGrievance(form);
      setSuccessMsg('Grievance ticket successfully submitted and logged into the review queue.');
      setForm({
        event_id: '',
        complainant_name: '',
        contact_email: '',
        grievance_type: 'Severity Mismatch',
        description: ''
      });
      setView('list');
      await loadGrievances();
      if (onGrievanceSubmitted) onGrievanceSubmitted();
    } catch (err) {
      console.error('Failed to file grievance', err);
      setErrorMsg('Failed to submit grievance. Please verify Event ID.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id) => {
    if (!resolutionNote.trim()) return;
    try {
      await api.resolveGrievance(id, resolutionNote, 'RESOLVED');
      setResolvingId(null);
      setResolutionNote('');
      await loadGrievances();
      if (onGrievanceSubmitted) onGrievanceSubmitted();
    } catch (err) {
      console.error('Failed to resolve grievance', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-700" />
            <span>Public Dispute & Grievance Redressal Desk</span>
          </h2>
          <p className="text-xs text-slate-500">
            Accountable dispute filing for false alarms, underestimated hazards, or disputed verification outcomes
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm ${
              view === 'list'
                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Review Tickets ({grievances.length})
          </button>
          <button
            onClick={() => setView('file')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm ${
              view === 'file'
                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            + File New Grievance
          </button>
        </div>
      </div>

      {view === 'file' ? (
        <form onSubmit={handleFileSubmit} className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
            Submit Operational Grievance / Dispute Report
          </h3>
          {errorMsg && <div className="p-2 rounded bg-red-50 border border-red-200 text-red-800 text-xs">{errorMsg}</div>}
          {successMsg && <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">{successMsg}</div>}

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
              Referenced Event ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. EVT-IN-AWS-0001"
              value={form.event_id}
              onChange={(e) => setForm({ ...form, event_id: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-purple-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                Complainant Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name / Authority"
                value={form.complainant_name}
                onChange={(e) => setForm({ ...form, complainant_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                required
                placeholder="official@domain.org"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-purple-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
              Dispute Category
            </label>
            <select
              value={form.grievance_type}
              onChange={(e) => setForm({ ...form, grievance_type: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-purple-600 outline-none"
            >
              <option value="False Alarm">False Alarm / Inaccurate Alert</option>
              <option value="Severity Underestimated">Severity Underestimated (Needs Upgrade)</option>
              <option value="Missed Disaster">Unreported Critical Disaster</option>
              <option value="Fake Media">Fake / Recycled Imagery Used</option>
              <option value="General Dispute">Other Operational Dispute</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
              Detailed Grounds for Grievance *
            </label>
            <textarea
              required
              rows={3}
              placeholder="State the observed discrepancies, localized evidence, or why this status must be modified..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
          >
            {submitting ? 'Lodging Dispute Ticket...' : 'File Grievance Ticket'}
          </button>
        </form>
      ) : (
        /* List View */
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {successMsg && <div className="m-4 p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">{successMsg}</div>}
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <Radio className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
              <span>Retrieving Grievance Registry...</span>
            </div>
          ) : grievances.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No active citizen grievances filed. System operating with zero open disputes.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {grievances.map((g) => {
                const isOpen = g.status === 'OPEN';
                return (
                  <div key={g.id} className="p-4 space-y-2 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-700">{g.id}</span>
                        <span className="text-xs text-slate-500">on Event: <b className="text-slate-900 font-mono">{g.event_id}</b></span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                          {g.grievance_type}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isOpen ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {g.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800">{g.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                      <span>Filer: <b className="text-slate-900">{g.complainant_name}</b> ({g.contact_email})</span>
                      <span>Filed: {new Date(g.created_at).toLocaleString()}</span>
                    </div>

                    {/* Resolution box if already resolved */}
                    {g.resolution_note && (
                      <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Official Resolution:</span>
                        <p className="text-slate-800 text-[11px] font-medium">{g.resolution_note}</p>
                      </div>
                    )}

                    {/* Operator Action if OPEN */}
                    {isOpen && (
                      <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                        {resolvingId === g.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter official resolution notes for audit ledger..."
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-purple-600"
                            />
                            <button
                              onClick={() => handleResolve(g.id)}
                              className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setResolvingId(null)}
                              className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResolvingId(g.id)}
                            className="text-xs text-purple-700 hover:text-purple-900 font-bold underline"
                          >
                            Resolve This Grievance Ticket →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
