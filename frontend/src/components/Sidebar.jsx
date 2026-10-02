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
  Brain,
  Lock,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ activeTab, setActiveTab, pendingCount, openGrievances, authorityUser, onOpenAuthModal }) {
  const { t, lang } = useLanguage();

  const publicMenuItems = [
    { id: 'overview', label: lang === 'hi' ? 'मुख्य स्थिति (Overview)' : 'National Situation', icon: Compass, badge: null },
    { id: 'forecast', label: lang === 'hi' ? 'आपदा एवं जोखिम ट्रैकिंग (Disasters)' : 'Disasters & Hazard Tracking', icon: Wind, badge: lang === 'hi' ? 'लाइव' : 'LIVE TRACK', badgeColor: 'bg-teal-600' },
    { id: 'ai-planner', label: lang === 'hi' ? 'एआई आपदा वर्गीकरण एवं योजना' : 'AI Classifier & Plan', icon: Brain, badge: 'AI PLAN', badgeColor: 'bg-purple-600' },
    { id: 'events', label: lang === 'hi' ? 'घटना अंतर्ग्रहण (Events)' : 'Weather Events Registry', icon: FileSpreadsheet, badge: null },
    { id: 'analytics', label: lang === 'hi' ? 'डेटा विश्लेषण (Analytics)' : 'Platform Analytics Hub', icon: BarChart3, badge: null },
    { id: 'submit', label: lang === 'hi' ? 'नागरिक रिपोर्ट (Citizen)' : 'Citizen Field Report', icon: Send, badge: 'PWA', badgeColor: 'bg-emerald-600' },
    { id: 'grievance', label: lang === 'hi' ? 'शिकायत निवारण (Dispute)' : 'Grievance & Dispute Desk', icon: Scale, badge: openGrievances > 0 ? openGrievances : null, badgeColor: 'bg-rose-500' }
  ];

  // Operator Review Desk, CAP Alert Dispatch, and System & Engine are ONLY accessible to authenticated authorities
  const authorityMenuItems = [
    { id: 'review', label: lang === 'hi' ? 'प्राधिकरण समीक्षा' : 'AUTHORITY REVIEW', icon: CheckCircle2, badge: pendingCount > 0 ? pendingCount : null, badgeColor: 'bg-amber-600' },
    { id: 'alerts', label: lang === 'hi' ? 'आपातकालीन चेतावनी (CAP)' : 'CAP Alert Dispatch', icon: Megaphone, badge: lang === 'hi' ? 'आपातकाल' : 'EMERGENCY', badgeColor: 'bg-rose-600' },
    { id: 'system', label: lang === 'hi' ? 'राष्ट्रीय नोड स्वास्थ्य' : 'Node Health & Telemetry', icon: Server, badge: lang === 'hi' ? 'अधिकारी' : 'OFFICER', badgeColor: 'bg-emerald-700' }
  ];

  return (
    <aside className="hidden md:flex w-72 lg:w-80 bg-white border-r border-slate-200 flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] shadow-xs">
      {/* Navigation Links */}
      <div className="p-4 space-y-2">
        <div className="px-3 pb-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
          {lang === 'hi' ? 'नागरिक एवं सार्वजनिक संचालन' : 'Public Operations'}
        </div>

        {publicMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-950 border-l-4 border-emerald-600 font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className={`tracking-tight text-xs sm:text-[13px] ${isActive ? 'font-black text-emerald-950' : 'font-semibold'}`}>
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
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
          <div className="pt-3 space-y-2 border-t border-slate-200 mt-2">
            <div className="px-3 pb-1 text-[11px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{lang === 'hi' ? 'प्राधिकरण नियंत्रण' : 'Authority Controls'}</span>
            </div>

            {authorityMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-amber-50 text-amber-950 border-l-4 border-amber-600 font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-amber-50/50 hover:text-amber-950 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className={`tracking-tight text-xs sm:text-[13px] ${isActive ? 'font-black text-amber-950' : 'font-semibold'}`}>
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${item.badgeColor || 'bg-amber-600'} text-white shadow-xs`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-200 mt-2">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>{lang === 'hi' ? 'प्रतिबंधित प्राधिकरण क्षेत्र' : 'Restricted Authority Area'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {lang === 'hi' 
                  ? 'समीक्षा, आपातकालीन चेतावनी (CAP), और नोड हेल्थ केवल अधिकृत आपदा अधिकारियों के लिए सुरक्षित हैं।'
                  : 'Authority Review, CAP Alert Dispatch, and Node Health are restricted to verified disaster officers.'}
              </p>
              <button
                onClick={onOpenAuthModal}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t('authoritySignIn')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Operator Session Footer Card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/60">
        {authorityUser ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">{authorityUser.name || 'Command Duty Officer'}</div>
              <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono font-bold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{lang === 'hi' ? 'सक्रिय अधिकारी सत्र' : 'Officer Session Active'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>{lang === 'hi' ? 'सार्वजनिक मोड' : 'Public Access'}</span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{lang === 'hi' ? 'केवल पढ़ने योग्य' : 'Read-Only'}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
