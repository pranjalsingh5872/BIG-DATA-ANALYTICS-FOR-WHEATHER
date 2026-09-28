import React from 'react';
import {
  Compass,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
  Send,
  Scale,
  Megaphone,
  Server,
  Wind,
  Lock,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, pendingCount, openGrievances, authorityUser, onOpenAuthModal }) {
  const publicMenuItems = [
    { id: 'overview', label: 'National Situation', icon: Compass, badge: null },
    { id: 'forecast', label: 'Cyclone & Wind Predictor', icon: Wind, badge: 'AI MODEL', badgeColor: 'bg-cyan-600' },
    { id: 'events', label: 'Weather Events', icon: FileSpreadsheet, badge: null },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3, badge: null },
    { id: 'submit', label: 'Citizen Field Report', icon: Send, badge: 'PWA' },
    { id: 'grievance', label: 'Grievance Desk', icon: Scale, badge: openGrievances > 0 ? openGrievances : null, badgeColor: 'bg-rose-500' }
  ];

  // Operator Review Desk, CAP Alert Dispatch, and System & Engine are ONLY accessible to authenticated authorities
  const authorityMenuItems = [
    { id: 'review', label: 'Operator Review Desk', icon: CheckCircle2, badge: pendingCount > 0 ? pendingCount : null, badgeColor: 'bg-amber-500' },
    { id: 'alerts', label: 'CAP Alert Dispatch', icon: Megaphone, badge: 'EMERGENCY', badgeColor: 'bg-red-600' },
    { id: 'system', label: 'System & Engine', icon: Server, badge: 'OFFICER', badgeColor: 'bg-emerald-600' }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-[#0a1324] border-r border-[#1a2840] flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      {/* Navigation Links */}
      <div className="p-4 space-y-2">
        <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Public Operations
        </div>

        {publicMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 transform ${
                isActive
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-2 border-cyan-400/60 shadow-lg shadow-blue-950/60 -translate-y-1'
                  : 'text-slate-300 hover:bg-[#13223f] hover:text-white hover:-translate-y-0.5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ease-out transform ${
                    isActive
                      ? '-translate-y-1.5 scale-110 bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-400/40 ring-2 ring-cyan-300'
                      : 'translate-y-0 scale-100 bg-[#070e1b] border border-[#1c2c48] text-slate-400 group-hover:text-cyan-300 group-hover:-translate-y-0.5 group-hover:border-cyan-700'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isActive ? 'scale-110 drop-shadow-sm' : ''
                    }`}
                  />
                </div>

                <span className={`tracking-wide transition-colors duration-200 ${isActive ? 'font-bold text-white' : ''}`}>
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-transform duration-300 ${
                    isActive ? 'scale-105' : ''
                  } ${
                    item.badgeColor
                      ? `${item.badgeColor} text-white shadow-sm`
                      : 'bg-[#13223f] text-slate-300 border border-[#1e2f50]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Authority Operations Section: Full Access Always Unlocked */}
        <div className="pt-3 space-y-2 border-t border-[#1a2840] mt-3">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authority Operations</span>
            </span>
            <span className="text-[9px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/50 px-1.5 py-0.5 rounded font-bold">
              FULL ACCESS
            </span>
          </div>

          {authorityMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 transform ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white border-2 border-amber-400/60 shadow-lg shadow-amber-950/60 -translate-y-1'
                    : 'text-amber-200 hover:bg-[#1a273b] hover:text-white hover:-translate-y-0.5 border border-amber-900/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ease-out transform ${
                      isActive
                        ? '-translate-y-1.5 scale-110 bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40 ring-2 ring-amber-300'
                        : 'translate-y-0 scale-100 bg-[#070e1b] border border-amber-800/50 text-amber-400 group-hover:text-amber-200 group-hover:-translate-y-0.5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="tracking-wide">
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-amber-600'} text-white shadow-sm`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator Session Footer Card */}
      <div className="p-4 border-t border-[#18263e] bg-[#070e1b]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-300 font-bold text-xs shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white truncate max-w-[130px]">
              {authorityUser?.name || 'Apex Commander'}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Full Unrestricted Access
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
