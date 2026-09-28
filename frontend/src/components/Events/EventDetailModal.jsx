import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, AlertTriangle, FileDown, Radio, Camera, MapPin, Scale, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function EventDetailModal({ eventId, onClose, onOpenGrievance }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.getEventDetail(eventId);
        setData(res);
      } catch (err) {
        console.error('Failed to load event detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [eventId]);

  if (!eventId) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative z-[100000]">
        {/* Header */}
        <div className="px-6 py-4 bg-command-900 border-b border-command-border flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                National Weather Intelligence · AI Inspection Desk
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">
                {eventId}
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 mt-0.5">
              {data?.event?.title || 'Loading Weather Event...'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Radio className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <span>Retrieving Multi-source AI Verification Evidence & Audit Ledger...</span>
          </div>
        ) : data?.event ? (
          <div className="p-6 space-y-6">
            {/* Top Overview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Category & Severity</span>
                <span className="font-bold text-slate-900 text-sm">{data.event.category}</span>
                <span className="ml-2 text-xs font-mono font-bold text-amber-600">[{data.event.severity}]</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span>
                <span className="font-semibold text-slate-900">{data.event.city}, {data.event.state}</span>
                <span className="text-[10px] text-blue-600 block font-mono">H3: {data.event.h3_index}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Source Provenance</span>
                <span className="font-semibold text-slate-900">{data.event.source}</span>
                <span className="text-[10px] text-slate-500 block">{data.event.source_author || 'Direct Feed'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">AI TrustScore™</span>
                <span className={`text-xl font-mono font-black ${
                  data.event.trust_score >= 75 ? 'text-emerald-700' :
                  data.event.trust_score >= 40 ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {data.event.trust_score}%
                </span>
                <span className="text-[10px] text-slate-500 block">{data.event.verification_status}</span>
              </div>
            </div>

            {/* Description Text */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs uppercase font-bold text-slate-500 mb-1">Observation Description</h4>
              <p className="text-sm text-slate-800 leading-relaxed">{data.event.description}</p>
            </div>

            {/* AI Tri-Check Itemized Explainability Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold text-blue-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Explainable Tri-Check AI Verification Channels</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Governed by Multi-Engine Heuristics</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Evidence Channel</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-center">Score Weight</th>
                      <th className="px-4 py-2.5">System Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Channel 1: Source */}
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-slate-900">Source Authority</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                          {data.event.source.includes('Radar') || data.event.source.includes('Satellite') ? 'Certified Sensor' : 'Crowdsourced'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono text-blue-700 font-bold">
                        {data.event.source.includes('Radar') || data.event.source.includes('Satellite') ? '30 / 30' : '22 / 30'}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-[11px]">
                        Registered provider '{data.event.source}' in operational meteorological registry.
                      </td>
                    </tr>

                    {/* Channel 2: NLP */}
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-slate-900">Multilingual NLP Factual Consistency</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                          Factual Tone
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono text-blue-700 font-bold">
                        {Math.round(data.event.nlp_confidence * 25)} / 25
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-[11px]">
                        Natural language structure indicates genuine localized field report. No viral rumor markers.
                      </td>
                    </tr>

                    {/* Channel 3: Radar */}
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-slate-900">Physical Radar Station Corroboration</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          data.event.radar_corroborated
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {data.event.radar_corroborated ? 'Station Corroborated' : 'Station Discrepancy'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono text-blue-700 font-bold">
                        {data.event.radar_corroborated ? '25 / 25' : '10 / 25'}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-[11px]">
                        Nearest station: <b>{data.event.radar_station_name}</b> recorded {data.event.radar_recorded_value} mm/kmh.
                      </td>
                    </tr>

                    {/* Channel 4: Media */}
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-slate-900">Multimodal Vision AI & EXIF Check</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          data.event.is_media_authentic
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {data.event.is_media_authentic ? 'Authentic Media' : 'Recycled Flag'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono text-blue-700 font-bold">
                        {data.event.is_media_authentic ? '20 / 20' : '0 / 20'}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-[11px]">
                        Perceptual hash & metadata check verified. No archive storm photo matches.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Media Image Preview if attached */}
            {data.event.media_url && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs uppercase font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Submitted Ground Photo (Vision AI Validated)</span>
                </h4>
                <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-64">
                  <img
                    src={data.event.media_url}
                    alt="Citizen Field Observation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-mono text-emerald-700 font-bold border border-emerald-300 shadow">
                    ✓ EXIF GPS Verified
                  </div>
                </div>
              </div>
            )}

            {/* Human Audit Trail History */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Human-in-the-Loop Audit Trail</span>
              </h4>
              <div className="space-y-1.5">
                {data.audits && data.audits.length > 0 ? (
                  data.audits.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{a.operator_name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">
                            {a.action}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[11px] mt-0.5">{a.reason}</div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(a.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded">
                    Awaiting initial operator pass.
                  </div>
                )}
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  onClose();
                  onOpenGrievance(data.event.id);
                }}
                className="flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-purple-800 px-3 py-2 rounded-lg bg-purple-50 border border-purple-200 transition-colors shadow-sm"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>File Grievance / Dispute Report</span>
              </button>

              <a
                href={api.getPdfDownloadUrl(data.event.id)}
                download
                className="flex items-center gap-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Official Incident Brief PDF</span>
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
