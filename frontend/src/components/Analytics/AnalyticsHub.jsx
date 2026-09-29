import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  PieChart,
  ShieldCheck,
  Activity,
  Layers,
  Radio,
  Satellite,
  Zap,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

export default function AnalyticsHub() {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadCharts = async () => {
    try {
      setLoading(true);
      const res = await api.getCharts();
      setCharts(res);
    } catch (err) {
      console.error('Failed to load chart analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharts();
  }, []);

  const handleSyncMultiSource = async () => {
    try {
      setSyncing(true);
      await api.syncLiveTelemetry(true);
      await loadCharts();
    } catch (err) {
      console.error('Ingestion sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading && !charts) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Activity className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
        <span>Loading Platform Big Data Ingestion Telemetry & Multi-Source Analytics...</span>
      </div>
    );
  }

  // Calculate percentages for donut / status
  const totalVerif = charts?.verification?.reduce((acc, v) => acc + v.count, 0) || 1;
  const verifiedCount = charts?.verification?.find((v) => v.status === 'VERIFIED')?.count || 0;
  const pendingCount = charts?.verification?.find((v) => v.status === 'PENDING_REVIEW')?.count || 0;
  const rejectedCount = charts?.verification?.find((v) => v.status === 'REJECTED')?.count || 0;

  return (
    <div className="space-y-5">
      {/* Page Title & Ingestion Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-command-card border border-command-border p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Multi-Source Big Data Ingestion Layer & Real-Time Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Distributed sensor pipelines: IMD Doppler Radars, INSAT-3DR Satellites, National AWS, Twitter/X stream, and Citizen PWA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncMultiSource}
            disabled={syncing}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 text-yellow-300 ${syncing ? 'animate-bounce' : ''}`} />
            <span>{syncing ? 'Ingesting Real Streams...' : 'Execute Ingestion Sync'}</span>
          </button>
          <button
            onClick={loadCharts}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
            title="Refresh Ingestion Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 🌟 DEDICATED INGESTION LAYER MONITOR: Protocol Streams & Live Metrics 🌟 */}
      <div className="bg-command-card border border-command-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-command-border pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Active Ingestion Layer Stream Buses & Protocol Health
            </h3>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold">
            5 / 5 Ingestion Buses Active · 34.6 rec/s · Latency 28ms
          </span>
        </div>

        {/* 5 Ingestion Channels Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {charts?.pipeline_streams?.map((stream, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                    {stream.protocol}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{stream.name}</h4>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 grid grid-cols-2 text-[10px] font-mono">
                <div>
                  <span className="text-slate-500 block">Rate:</span>
                  <span className="font-bold text-blue-700">{stream.throughput}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Latency:</span>
                  <span className="font-bold text-emerald-700">{stream.latency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Ingested Packet Feed */}
        <div className="mt-3">
          <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Ingestion Packet Flow (Live Event Buffer)</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">FastAPI Ingestion Engine → H3 Hex Spatial Engine</span>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 shadow-inner">
            <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-1 font-bold uppercase">
              <span className="col-span-2">Time (IST)</span>
              <span className="col-span-3">Source Channel</span>
              <span className="col-span-2">Station</span>
              <span className="col-span-2">Hazard</span>
              <span className="col-span-2">Severity</span>
              <span className="col-span-1 text-right">Trust</span>
            </div>
            <div className="space-y-1.5">
              {charts?.packet_stream?.map((pkt, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center hover:bg-slate-800/60 px-1 py-0.5 rounded transition-colors text-[10px]">
                  <span className="col-span-2 text-cyan-400">{pkt.time}</span>
                  <span className="col-span-3 truncate text-slate-300 font-semibold">{pkt.source}</span>
                  <span className="col-span-2 text-white">{pkt.city}</span>
                  <span className="col-span-2 text-amber-300">{pkt.category}</span>
                  <span className="col-span-2">
                    <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                      pkt.severity === 'Critical' ? 'bg-red-900 text-red-300' :
                      pkt.severity === 'High' ? 'bg-orange-900 text-orange-300' :
                      'bg-emerald-900 text-emerald-300'
                    }`}>
                      {pkt.severity}
                    </span>
                  </span>
                  <span className="col-span-1 text-right text-emerald-400 font-bold">{pkt.trust}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Pipeline Funnel + Verification Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pipeline Processing Funnel */}
        <div className="bg-command-card border border-command-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Big Data Pipeline Processing Funnel
              </h3>
            </div>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">100% Stream Integrity</span>
          </div>

          <div className="space-y-3">
            {charts?.funnel?.map((step, idx) => {
              const maxCount = charts.funnel[0]?.count || 100;
              const pct = Math.max(20, Math.round((step.count / maxCount) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">{step.stage}</span>
                    <span className="font-mono text-blue-700 font-bold">{step.count} records</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-command-border text-[10px] text-slate-500 font-mono">
            Multi-Source Ingestion Bus → SimHash Deduplicator → Tri-Check AI Verification → PostGIS H3 Ledger
          </div>
        </div>

        {/* Verification Status Breakdown */}
        <div className="bg-command-card border border-command-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                AI Truth & Verification Status Spectrum
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Total: {totalVerif} records</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <span className="block text-[10px] font-bold uppercase text-emerald-700">Verified High Trust</span>
              <span className="text-xl font-black text-slate-900 font-mono">{verifiedCount}</span>
              <span className="block text-[10px] text-emerald-600 font-bold">{Math.round((verifiedCount/totalVerif)*100)}%</span>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <span className="block text-[10px] font-bold uppercase text-amber-700">Pending Review</span>
              <span className="text-xl font-black text-slate-900 font-mono">{pendingCount}</span>
              <span className="block text-[10px] text-amber-600 font-bold">{Math.round((pendingCount/totalVerif)*100)}%</span>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-center">
              <span className="block text-[10px] font-bold uppercase text-red-700">Rejected / Spam</span>
              <span className="text-xl font-black text-slate-900 font-mono">{rejectedCount}</span>
              <span className="block text-[10px] text-red-600 font-bold">{Math.round((rejectedCount/totalVerif)*100)}%</span>
            </div>
          </div>

          {/* Stacked Progress Visual */}
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div
              style={{ width: `${(verifiedCount / totalVerif) * 100}%` }}
              className="bg-emerald-500 h-full transition-all"
              title="Verified"
            ></div>
            <div
              style={{ width: `${(pendingCount / totalVerif) * 100}%` }}
              className="bg-amber-500 h-full transition-all"
              title="Pending Review"
            ></div>
            <div
              style={{ width: `${(rejectedCount / totalVerif) * 100}%` }}
              className="bg-rose-500 h-full transition-all"
              title="Rejected"
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-600 mt-2 font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Sensor Corroborated</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Human Review Queue</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> AI Disproven Anomaly</span>
          </div>
        </div>
      </div>

      {/* Row 3: Multi-Source Distribution + Severity Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Source Distribution Breakdown */}
        <div className="bg-command-card border border-command-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Multi-Source Ingestion Distribution
            </h3>
            <span className="text-[10px] text-blue-700 font-mono font-bold">5 Distinct Modalities</span>
          </div>
          <div className="space-y-3">
            {charts?.sources?.map((s, idx) => {
              const totalSrc = charts.sources.reduce((a, b) => a + b.count, 0) || 1;
              const pct = Math.round((s.count / totalSrc) * 100);
              const colors = [
                'from-blue-600 to-indigo-600',
                'from-sky-500 to-cyan-500',
                'from-emerald-500 to-teal-500',
                'from-purple-500 to-indigo-500',
                'from-amber-500 to-orange-500'
              ];
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{s.source}</span>
                    <span className="font-mono text-slate-600 font-bold">{s.count} events ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-full`}
                      style={{ width: `${Math.max(8, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Spectrum Distribution */}
        <div className="bg-command-card border border-command-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Hazard Severity Level Spectrum
            </h3>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Physical Criteria</span>
          </div>
          <div className="space-y-3">
            {charts?.severity?.map((sev, idx) => {
              const colorsMap = {
                Critical: 'from-red-600 to-rose-600',
                High: 'from-orange-500 to-amber-500',
                Moderate: 'from-blue-500 to-cyan-500',
                Low: 'from-emerald-500 to-teal-500'
              };
              const totalSev = charts.severity.reduce((a, b) => a + b.count, 0) || 1;
              const pct = Math.round((sev.count / totalSev) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sev.severity} Severity</span>
                    <span className="font-mono text-slate-600 font-bold">{sev.count} incidents ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full bg-gradient-to-r ${colorsMap[sev.severity] || 'from-blue-500 to-cyan-400'} rounded-full`}
                      style={{ width: `${Math.max(8, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
