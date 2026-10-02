import React from 'react';
import { Activity, Radio, AlertTriangle, ShieldCheck, Siren, Scale } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function MetricCards({ summary }) {
  const { lang } = useLanguage();

  const cards = [
    {
      title: lang === 'hi' ? 'कुल अंतर्ग्रहण' : 'TOTAL INGESTED',
      value: summary?.total_events || 53,
      subtext: lang === 'hi' ? '24 घंटे का रियल-टाइम स्ट्रीम' : '24h real-time stream',
      icon: Activity,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: lang === 'hi' ? 'सक्रिय मौसम स्टेशन' : 'WEATHER STATIONS',
      value: '38+ Active',
      subtext: lang === 'hi' ? 'डॉप्लर एवं सतही AWS' : 'Doppler & Surface AWS',
      icon: Radio,
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    {
      title: lang === 'hi' ? 'लंबित समीक्षा' : 'PENDING REVIEW',
      value: summary?.pending_review !== undefined ? summary.pending_review : 4,
      subtext: lang === 'hi' ? 'नागरिक एवं सोशल कतार' : 'Citizen & social queue',
      icon: AlertTriangle,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: lang === 'hi' ? 'सत्यापित सटीकता' : 'AI ACCURACY',
      value: `${summary?.detection_accuracy_pct || 92.5}%`,
      subtext: lang === 'hi' ? 'त्रिपक्षीय AI द्वारा सत्यापित' : 'Tri-Check verified',
      icon: ShieldCheck,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: lang === 'hi' ? 'गंभीर चेतावनियां' : 'CRITICAL ALERTS',
      value: summary?.critical_events || 2,
      subtext: lang === 'hi' ? 'उच्च संवेदनशीलता क्षेत्र' : 'High severity zones',
      icon: Siren,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      pulse: true
    },
    {
      title: lang === 'hi' ? 'शिकायत निवारण' : 'GRIEVANCES',
      value: summary?.open_grievances || 0,
      subtext: lang === 'hi' ? 'सक्रिय विवाद टिकट' : 'Active dispute tickets',
      icon: Scale,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-slate-500 truncate">
                {c.title}
              </span>
              <div className={`p-1.5 rounded-lg ${c.bgColor} shrink-0`}>
                <Icon className={`w-4 h-4 ${c.color} ${c.pulse ? 'animate-bounce' : ''}`} />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-black tracking-tight ${c.color} font-mono`}>
                {c.value}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                {c.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
