import React, { useState, useEffect } from 'react';
import { 
  Scale, CheckCircle2, AlertCircle, Radio, Clock, ShieldAlert, 
  Camera, UploadCloud, Satellite, Eye, FileText, CheckCircle, 
  XCircle, Lock, Unlock, HelpCircle, MapPin, AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';
import { formatIST } from '../../utils/time';

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
    description: '',
    evidence_photo_url: '',
    complainant_lat: null,
    complainant_lng: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(false);
  const [locating, setLocating] = useState(false);
  const [gpsNote, setGpsNote] = useState('');

  // Appeal & Resolution States
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [appealingId, setAppealingId] = useState(null);
  const [appealNote, setAppealNote] = useState('');
  const [submittingAppeal, setSubmittingAppeal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

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

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setPhotoPreview(dataUrl);
      setForm((prev) => ({ ...prev, evidence_photo_url: dataUrl }));
      setPhotoError(false);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // Detect GPS Location for proximity score
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsNote('Geolocation not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          complainant_lat: pos.coords.latitude,
          complainant_lng: pos.coords.longitude
        }));
        setGpsNote(`GPS Tagged: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        setGpsNote('Unable to capture GPS. Proximity will be evaluated via network IP.');
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Mandatory Photo Guard
    if (!form.evidence_photo_url || !form.evidence_photo_url.trim()) {
      setPhotoError(true);
      setErrorMsg('Mandatory Ground Photo Evidence is required to submit a grievance or dispute.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitGrievance(form);
      
      if (res.status === 'FLAGGED_FAKE') {
        setSuccessMsg(
          `Grievance ticket created (${res.id}), but automatically FLAGGED AS FAKE (${res.authenticity_score}% < 40%). Physical satellite telemetry disproves the dispute. Locked from verification until appeal.`
        );
      } else {
        setSuccessMsg(`Grievance ticket verified (${res.authenticity_score}%) and queued for operator redressal.`);
      }

      setForm({
        event_id: '',
        complainant_name: '',
        contact_email: '',
        grievance_type: 'Severity Mismatch',
        description: '',
        evidence_photo_url: '',
        complainant_lat: null,
        complainant_lng: null
      });
      setPhotoPreview(null);
      setGpsNote('');
      setView('list');
      await loadGrievances();
      if (onGrievanceSubmitted) onGrievanceSubmitted();
    } catch (err) {
      console.error('Failed to file grievance', err);
      const detail = err.response?.data?.detail || 'Failed to submit grievance. Please verify Event ID and required photo.';
      setErrorMsg(detail);
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
      const detail = err.response?.data?.detail || 'Failed to resolve grievance.';
      alert(detail);
    }
  };

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!appealNote.trim()) return;
    try {
      setSubmittingAppeal(true);
      await api.appealGrievance(appealingId, appealNote);
      setAppealingId(null);
      setAppealNote('');
      await loadGrievances();
      setSuccessMsg('Formal appeal registered. Ticket is now pending re-investigation review.');
    } catch (err) {
      console.error('Failed to appeal grievance', err);
      alert(err.response?.data?.detail || 'Failed to submit appeal.');
    } finally {
      setSubmittingAppeal(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 border border-stone-200/80 p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-700" />
            <span>Public Dispute & Grievance Redressal Desk</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/80">
              55% Citizen Ground • 45% Satellite Truth
            </span>
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            AI-supervised dispute resolution with mandatory ground photo verification and INSAT-3DR physical reality cross-check. Disputes scoring &lt; 40% are locked as fake until formally appealed.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              view === 'list'
                ? 'bg-amber-700 text-white shadow-amber-700/20'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300/80'
            }`}
          >
            Dispute Queue ({grievances.length})
          </button>
          <button
            onClick={() => setView('file')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              view === 'file'
                ? 'bg-amber-700 text-white shadow-amber-700/20'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300/80'
            }`}
          >
            + File New Grievance
          </button>
        </div>
      </div>

      {view === 'file' ? (
        <form onSubmit={handleFileSubmit} className="max-w-2xl mx-auto bg-stone-50/90 border border-stone-300/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Submit Operational Grievance / Dispute Report</span>
            </h3>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Ground photo evidence is mandatory. Submissions are algorithmically cross-verified with INSAT-3DR Geostationary satellite telemetry.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
              Referenced Event ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. EVT-CITIZEN-3D33EC12 or EVT-IN-AWS-0001"
              value={form.event_id}
              onChange={(e) => setForm({ ...form, event_id: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 font-mono focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                Complainant Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name / Field Officer"
                value={form.complainant_name}
                onChange={(e) => setForm({ ...form, complainant_name: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                Contact Email * <span className="text-[10px] text-stone-500 font-normal">(Authenticity verified)</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@domain.gov.in"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
              Dispute Category *
            </label>
            <select
              value={form.grievance_type}
              onChange={(e) => setForm({ ...form, grievance_type: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
            >
              <option value="False Alarm">False Alarm / Disputed Event (Claiming Dry/Clear Skies)</option>
              <option value="Severity Mismatch">Severity Mismatch (Claiming Underestimated Hazard)</option>
              <option value="Missed Disaster">Unreported Critical Disaster In Vicinity</option>
              <option value="Fake Media">Fake / Staged Imagery Dispute</option>
              <option value="General Dispute">Other Operational Dispute</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
              Detailed Grounds for Grievance *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Specify landmark street, standing water depth, visible conditions, or why this status must be altered..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
            />
          </div>

          {/* Mandatory Photo Evidence Box */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${
            photoError 
              ? 'border-rose-400 bg-rose-50/50' 
              : form.evidence_photo_url 
                ? 'border-emerald-400 bg-emerald-50/40' 
                : 'border-dashed border-amber-300 bg-amber-50/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase font-extrabold text-stone-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-700" />
                <span>Mandatory Ground Photo Evidence *</span>
                <span className="text-[10px] text-amber-900 font-bold px-1.5 py-0.5 rounded bg-amber-200/80">
                  Required (35% Weight)
                </span>
              </label>

              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setForm((prev) => ({ ...prev, evidence_photo_url: '' }));
                  }}
                  className="text-[10px] text-rose-700 font-bold hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>

            <p className="text-[11px] text-stone-600 mb-3">
              Citizen disputes require a verifiable on-site photo. AI Vision inspects this against INSAT-3DR satellite reality before verification approval.
            </p>

            {photoPreview ? (
              <div className="flex items-center gap-4">
                <img 
                  src={photoPreview} 
                  alt="Evidence Preview" 
                  className="w-24 h-24 object-cover rounded-xl border border-stone-300 shadow-sm"
                />
                <div className="text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Evidence Photo Attached</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Ready for automated 55-45 cross-verification against satellite grid.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-stone-300 hover:border-amber-600 text-stone-800 text-xs font-bold cursor-pointer transition-all shadow-sm">
                    <UploadCloud className="w-4 h-4 text-amber-700" />
                    <span>Upload Local File / Camera Snapshot</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-500 uppercase font-bold shrink-0">Or Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://example.org/photo-evidence.jpg"
                    value={form.evidence_photo_url.startsWith('data:') ? '' : form.evidence_photo_url}
                    onChange={(e) => {
                      const url = e.target.value;
                      setForm({ ...form, evidence_photo_url: url });
                      setPhotoPreview(url || null);
                      setPhotoError(false);
                    }}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:border-amber-600 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* GPS Proximity Helper */}
          <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={locating}
              className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-900 underline"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>{locating ? 'Detecting GPS...' : 'Tag My Current GPS Location (For 10% Proximity Score)'}</span>
            </button>
            {gpsNote && <span className="text-[10px] font-mono text-stone-600">{gpsNote}</span>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-amber-900/10 transition-all disabled:opacity-50"
          >
            {submitting ? 'Running 55-45 AI Fraud Engine & Submitting...' : 'File Grievance With Mandatory Photo'}
          </button>
        </form>
      ) : (
        /* List View */
        <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden">
          {successMsg && (
            <div className="m-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>{successMsg}</div>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-stone-600">
              <Radio className="w-8 h-8 text-amber-700 animate-spin mx-auto mb-2" />
              <span className="text-xs font-bold">Scanning Grievance Registry & Authenticity Metrics...</span>
            </div>
          ) : grievances.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs">
              No active citizen grievances filed. System operating with zero open disputes.
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {grievances.map((g) => {
                const isFake = g.status === 'FLAGGED_FAKE' || (g.authenticity_score !== undefined && g.authenticity_score < 40.0 && !g.is_appealed);
                const isAppealed = g.is_appealed || g.status === 'APPEALED_PENDING_REVIEW';
                const isOpen = g.status === 'OPEN' || isAppealed;
                const score = g.authenticity_score ?? 0;

                let breakdownData = null;
                if (g.verification_breakdown) {
                  try {
                    breakdownData = typeof g.verification_breakdown === 'string' ? JSON.parse(g.verification_breakdown) : g.verification_breakdown;
                  } catch (e) {
                    breakdownData = null;
                  }
                }

                return (
                  <div key={g.id} className="p-5 space-y-3 hover:bg-stone-100/50 transition-colors">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-300">
                          {g.id}
                        </span>
                        <span className="text-xs text-stone-600">
                          Target Event: <b className="text-stone-900 font-mono">{g.event_id}</b>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-800">
                          {g.grievance_type}
                        </span>
                      </div>

                      {/* Authenticity Score Badge */}
                      <div className="flex items-center gap-2">
                        {isFake ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-700" />
                            <span>🚨 FLAGGED FAKE ({score}%) - LOCKED</span>
                          </span>
                        ) : isAppealed ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Unlock className="w-3 h-3 text-amber-700" />
                            <span>APPEALED / RE-INVESTIGATING ({score}%)</span>
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                            score >= 70 
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>AUTHENTIC ({score}%)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dispute Body */}
                    <p className="text-xs text-stone-800 font-medium leading-relaxed">
                      {g.description}
                    </p>

                    {/* 55-45 Dual Gauge Bar */}
                    <div className="bg-stone-100 border border-stone-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-stone-700 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-blue-700" />
                          <span>55% Citizen Ground Evidence:</span>
                          <span className="text-stone-900 font-mono">
                            {breakdownData ? `${breakdownData.citizen_evidence_score}/55` : `${g.vision_concurrence || 0}%`}
                          </span>
                        </span>
                        <span className="text-stone-700 flex items-center gap-1">
                          <Satellite className="w-3.5 h-3.5 text-purple-700" />
                          <span>45% INSAT-3DR Satellite Reality:</span>
                          <span className="text-stone-900 font-mono">
                            {breakdownData ? `${breakdownData.satellite_truth_score}/45` : `${g.satellite_concurrence || 0}%`}
                          </span>
                        </span>
                      </div>

                      {/* Dual Progress Bar */}
                      <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-blue-600 h-full transition-all" 
                          style={{ width: `${Math.min(55, breakdownData?.citizen_evidence_score ?? 30)}%` }}
                          title="Citizen Ground Evidence (35% Photo + 10% Claim + 10% Proximity)"
                        />
                        <div 
                          className="bg-purple-600 h-full transition-all ml-0.5" 
                          style={{ width: `${Math.min(45, breakdownData?.satellite_truth_score ?? 20)}%` }}
                          title="Satellite Physical Reality (45% INSAT-3DR Convective Cross-Check)"
                        />
                      </div>

                      {/* Channels Detail */}
                      {breakdownData?.channels && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[10px]">
                          {breakdownData.channels.map((ch, idx) => (
                            <div key={idx} className="bg-white/80 border border-stone-200/80 rounded-lg p-1.5 flex items-start gap-1.5">
                              {ch.score >= ch.max * 0.5 ? (
                                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-3 h-3 text-rose-600 shrink-0 mt-0.5" />
                              )}
                              <div className="leading-tight">
                                <span className="font-bold text-stone-800">{ch.channel}</span> ({ch.score}/{ch.max}):
                                <p className="text-stone-600">{ch.explanation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ground Photo Thumbnail & Complainant Info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-stone-600">
                      <div className="flex items-center gap-3">
                        {g.evidence_photo_url ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPhotoModal(g.evidence_photo_url)}
                            className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100/50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-300 transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5 text-amber-700" />
                            <span>View Mandatory Ground Photo</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-stone-500 italic">No photo attached</span>
                        )}
                        <span>Filer: <b className="text-stone-900">{g.complainant_name}</b> ({g.contact_email})</span>
                      </div>
                      <span className="font-mono text-[10px]">Filed: {formatIST(g.created_at)}</span>
                    </div>

                    {/* Flagged Fake Warning Banner & Appeal Trigger */}
                    {isFake && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs space-y-2">
                        <div className="flex items-start gap-2 text-rose-900">
                          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-extrabold uppercase tracking-wide">
                              ⚠️ LOCKED FROM OPERATOR VERIFICATION:
                            </span>
                            <p className="text-rose-800 text-[11px] mt-0.5">
                              {g.flagged_reason || `Dispute scored ${score}% (below 40% threshold). Physical satellite telemetry disproved the claim.`}
                            </p>
                          </div>
                        </div>

                        {/* Appeal Action */}
                        <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                          <span className="text-[10px] text-stone-600">
                            Dispute this lock? A formal appeal must be registered by complainant.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAppealingId(g.id);
                              setAppealNote('');
                            }}
                            className="px-3 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            File Appeal & Request Re-investigation
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Appeal Banner if Appealed */}
                    {isAppealed && g.appeal_note && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-1">
                        <span className="text-[10px] font-extrabold text-amber-900 uppercase flex items-center gap-1">
                          <Unlock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Formal Complainant Appeal Registered:</span>
                        </span>
                        <p className="text-stone-800 text-[11px] font-medium italic">"{g.appeal_note}"</p>
                        <p className="text-[10px] text-stone-500 pt-0.5">Unlocked for authorized operator review and manual resolution.</p>
                      </div>
                    )}

                    {/* Official Resolution Note if Resolved */}
                    {g.resolution_note && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs space-y-1">
                        <span className="text-[10px] font-extrabold text-emerald-900 uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Official Redressal Resolution:</span>
                        </span>
                        <p className="text-stone-800 text-[11px] font-medium">{g.resolution_note}</p>
                      </div>
                    )}

                    {/* Operator Resolution Desk (Only available if NOT fake, or if appealed) */}
                    {isOpen && !isFake && (
                      <div className="pt-2 border-t border-stone-200">
                        {resolvingId === g.id ? (
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter official resolution notes for audit ledger..."
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                              className="flex-1 w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-amber-600"
                            />
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              <button
                                onClick={() => handleResolve(g.id)}
                                className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                Confirm Resolution
                              </button>
                              <button
                                onClick={() => setResolvingId(null)}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-200 text-stone-700 text-xs font-bold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResolvingId(g.id)}
                            className="text-xs text-amber-800 hover:text-amber-900 font-bold underline"
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

      {/* Appeal Submission Modal */}
      {appealingId && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-50 border border-stone-300 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-amber-700" />
                <span>Submit Formal Appeal for Flagged Dispute</span>
              </h3>
              <button
                onClick={() => setAppealingId(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              This ticket was flagged as fake because it scored below 40% and contradicted satellite reality. If localized micro-climate or sensor obstruction caused this discrepancy, submit a formal explanation to unlock operator review.
            </p>

            <form onSubmit={handleAppealSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Appeal Justification Statement *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain why satellite telemetry or automated vision did not capture the localized street condition..."
                  value={appealNote}
                  onChange={(e) => setAppealNote(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAppealingId(null)}
                  className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAppeal}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                >
                  {submittingAppeal ? 'Submitting Appeal...' : 'Submit Appeal & Unlock Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Fullscreen / High-Res Preview Modal */}
      {selectedPhotoModal && (
        <div 
          onClick={() => setSelectedPhotoModal(null)}
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-stone-900 border border-stone-700 rounded-2xl max-w-2xl w-full p-4 shadow-2xl space-y-3 text-stone-100"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" />
                <span>Mandatory Ground Photo Evidence (Vision AI Capture)</span>
              </span>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="text-stone-400 hover:text-stone-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <img 
              src={selectedPhotoModal} 
              alt="Dispute Ground Evidence" 
              className="w-full max-h-[70vh] object-contain rounded-xl bg-stone-950" 
            />
            <div className="text-[11px] text-stone-400 text-right">
              Click anywhere outside or ✕ to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
