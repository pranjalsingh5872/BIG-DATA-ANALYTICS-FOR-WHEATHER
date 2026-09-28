import React from 'react';
import { Activity, Clock, AlertTriangle, ShieldCheck, Siren, Scale } from 'lucide-react';

export default function MetricCards({ summary }) {
  const cards = [
    {
      title: 'TOTAL INGESTED',
      value: summary?.total_events || 0,
      subtext: 'Multi-source store',
      icon: Activity,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'LIVE STREAMS',
      value: summary?.sources_online || '5/5',
      subtext: 'Doppler / INSAT / AWS',
      icon: Clock,
      color: 'text-sky-700',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200'
    },
    {
      title: 'PENDING REVIEW',
      value: summary?.pending_review || 0,
      subtext: 'Citizen & social queue',
      icon: AlertTriangle,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: 'AI ACCURACY',
      value: `${summary?.detection_accuracy_pct || 0}%`,
      subtext: 'Tri-Check verified',
      icon: ShieldCheck,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'CRITICAL ALERTS',
      value: summary?.critical_events || 0,
      subtext: 'High severity zones',
      icon: Siren,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      pulse: summary?.critical_events > 0
    },
    {
      title: 'GRIEVANCES',
      value: summary?.open_grievances || 0,
      subtext: 'Active dispute tickets',
      icon: Scale,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs transition-all hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-500 truncate">
                {c.title}
              </span>
              <div className={`p-1 rounded-md ${c.bgColor} shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${c.color} ${c.pulse ? 'animate-bounce' : ''}`} />
              </div>
            </div>
            <div>
              <div className={`text-xl font-black tracking-tight ${c.color} font-mono`}>
                {c.value}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {c.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
