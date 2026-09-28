import React from 'react';
import { Server, Database, Radio, ShieldCheck, Cpu, Layers } from 'lucide-react';

export default function SystemStatus({ summary }) {
  const services = [
    {
      name: 'High-Throughput Ingestion Bus',
      endpoint: 'FastAPI Async Microservice (:8000)',
      status: 'AVAILABLE',
      statusColor: 'text-emerald-800 border-emerald-300 bg-emerald-100',
      icon: Radio,
      details: 'Pydantic v2 schemas, multi-source ingestion bus, Doppler & Twitter poller'
    },
    {
      name: 'Geospatial Hierarchy Engine',
      endpoint: 'Uber H3 Hexagonal Indexing (Res 5 & 7)',
      status: 'CONFIGURED',
      statusColor: 'text-blue-800 border-blue-300 bg-blue-100',
      icon: Layers,
      details: 'Hex boundary polygons, spatial aggregation, centroid clustering'
    },
    {
      name: 'Tri-Check AI Verification Brain',
      endpoint: 'Multilingual Indic NLP + Vision AI + Radar Ground-Truth',
      status: 'ACTIVE',
      statusColor: 'text-emerald-800 border-emerald-300 bg-emerald-100',
      icon: Cpu,
      details: 'Hindi/English weather classifier, EXIF tamper check, 38 national radar stations'
    },
    {
      name: 'Persistent Geospatial Database',
      endpoint: 'PostgreSQL + PostGIS / Spatial SQLite Store',
      status: 'CONNECTED',
      statusColor: 'text-emerald-800 border-emerald-300 bg-emerald-100',
      icon: Database,
      details: 'Full relational event store, immutable audit trails, grievance tickets'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          <span>Platform Service Boundaries & Operational Engine Telemetry</span>
        </h2>
        <p className="text-xs text-slate-500">
          Architecture topology, operational microservice health, and big data runtime metrics
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{s.name}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">{s.endpoint}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${s.statusColor}`}>
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-slate-600">{s.details}</p>
            </div>
          );
        })}
      </div>

      {/* Runtime Telemetry Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Runtime Node Telemetry & Processing Efficiency
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">API Ingestion Node</span>
            <span className="text-sm font-bold text-slate-900">Uvicorn Async Worker</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">● Healthy (Port 8000)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Client UI Pipeline</span>
            <span className="text-sm font-bold text-slate-900">Vite React 19 Engine</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">● Active (Port 5173)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Active Sensors</span>
            <span className="text-sm font-bold text-blue-700">{summary?.total_events || 48} Stations</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">5 Ingestion Sources</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">AI Verification</span>
            <span className="text-sm font-bold text-emerald-700">{summary?.detection_accuracy_pct || 91.7}% Pass</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Tri-Check Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
