import React from 'react';
import { AlertCircle, Flame, Droplets, Wind, CloudLightning, ShieldCheck, ChevronRight } from 'lucide-react';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Rainfall':
    case 'Flooding':
      return Droplets;
    case 'Heatwave':
      return Flame;
    case 'Thunderstorm':
    case 'Cyclone':
      return CloudLightning;
    case 'Dust Storm':
    case 'Strong Winds':
      return Wind;
    default:
      return AlertCircle;
  }
};

export default function PriorityQueue({ events, onSelectEvent, onSwitchTab }) {
  // Filter critical or high severity events
  const priorityList = events
    ?.filter((ev) => ev.severity === 'Critical' || ev.severity === 'High')
    .slice(0, 10) || [];

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-4 flex flex-col h-[620px] lg:h-[calc(100vh-230px)] min-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Operational Priority Queue
          </h3>
        </div>
        <button
          onClick={() => onSwitchTab('events')}
          className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Events Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {priorityList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <ShieldCheck className="w-8 h-8 mb-2 text-emerald-600 opacity-60" />
            <span>No active critical alerts in queue</span>
          </div>
        ) : (
          priorityList.map((ev) => {
            const Icon = getCategoryIcon(ev.category);
            const isCrit = ev.severity === 'Critical';
            return (
              <div
                key={ev.id}
                onClick={() => onSelectEvent(ev.id)}
                className="p-3 rounded-lg bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className={`p-1 rounded ${
                        isCrit ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {ev.title}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      isCrit
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ev.severity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{ev.city}, {ev.state}</span>
                  <span className="font-mono text-[10px] text-blue-700 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {ev.source}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
