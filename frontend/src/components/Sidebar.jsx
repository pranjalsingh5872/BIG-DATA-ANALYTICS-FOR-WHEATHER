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
    { id: 'forecast', label: 'Cyclone & Wind Predictor', icon: Wind, badge: 'AI MODEL', badgeColor: 'bg-teal-600' },
    { id: 'events', label: 'Weather Events', icon: FileSpreadsheet, badge: null },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3, badge: null },
    { id: 'submit', label: 'Citizen Field Report', icon: Send, badge: 'PWA', badgeColor: 'bg-emerald-600' },
    { id: 'grievance', label: 'Grievance Desk', icon: Scale, badge: openGrievances > 0 ? openGrievances : null, badgeColor: 'bg-rose-500' }
  ];

  // Operator Review Desk, CAP Alert Dispatch, and System & Engine are ONLY accessible to authenticated authorities
  const authorityMenuItems = [
    { id: 'review', label: 'Operator Review Desk', icon: CheckCircle2, badge: pendingCount > 0 ? pendingCount : null, badgeColor: 'bg-amber-600' },
    { id: 'alerts', label: 'CAP Alert Dispatch', icon: Megaphone, badge: 'EMERGENCY', badgeColor: 'bg-rose-600' },
    { id: 'system', label: 'System & Engine', icon: Server, badge: 'OFFICER', badgeColor: 'bg-emerald-700' }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] shadow-xs">
      {/* Navigation Links */}
      <div className="p-3.5 space-y-1.5">
        <div className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Public Operations
        </div>

        {publicMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <span className={`tracking-tight ${isActive ? 'font-bold text-emerald-950' : ''}`}>
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor
                      ? `${item.badgeColor} text-white shadow-xs`
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Authority Section: ONLY rendered when signed in */}
        {authorityUser ? (
          <div className="pt-2.5 space-y-1.5 border-t border-slate-200 mt-2">
            <div className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Authority Controls</span>
            </div>

            {authorityMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-50 text-amber-950 border-l-4 border-amber-600 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-amber-50/50 hover:text-amber-900 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <span className="tracking-tight">
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-amber-600'} text-white shadow-xs`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="pt-2.5 border-t border-slate-200 mt-2">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Restricted Authority Tools</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-snug">
                Review Desk, CAP Broadcast, and System Engine are restricted to verified disaster officers.
              </p>
              <button
                onClick={onOpenAuthModal}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In as Authority</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Operator Session Footer Card */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/60">
        {authorityUser ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{authorityUser.name || 'Officer'}</div>
              <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Official Authority Active
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Public Access Mode</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">Read-Only</span>
          </div>
        )}
      </div>
    </aside>
  );
}
