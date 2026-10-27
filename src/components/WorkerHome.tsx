import React, { useState } from 'react';
import {
  Megaphone,
  Mic,
  Search,
  BookOpen,
  ArrowRight,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  AlertTriangle,
  HardHat,
  Droplets,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CaseItem, CaseStatus } from '../domain/types';

export const WorkerHome: React.FC = () => {
  const {
    t,
    language,
    cases,
    selectCase,
    openReportModal,
    openCheckModal,
    openHowItWorks,
    openPrivacyPolicy,
    confirmResolution,
    disputeResolution,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'needs_action' | 'in_progress' | 'confirmed'>('all');

  const filteredCases = cases.filter((c) => {
    if (activeFilter === 'needs_action') return c.status === 'resolution_proposed';
    if (activeFilter === 'in_progress') return c.status === 'in_progress' || c.status === 'submitted' || c.status === 'disputed';
    if (activeFilter === 'confirmed') return c.status === 'confirmed_by_worker';
    return true;
  });

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'resolution_proposed':
        return {
          bg: 'bg-[#FEF8E6] text-[#B87A00] border-[#F2B705]/40',
          dot: 'bg-[#F2B705]',
          label: language === 'ta' ? 'தீர்வு முன்மொழியப்பட்டது' : 'Resolution proposed',
          subLabel: language === 'ta' ? 'சரிபார்ப்பிற்கு காத்திருக்கிறது' : 'Action needed',
        };
      case 'in_progress':
        return {
          bg: 'bg-[#E7F3F2] text-[#0F5F5C] border-[#0F5F5C]/30',
          dot: 'bg-[#0F5F5C]',
          label: language === 'ta' ? 'செயல்பாட்டில் உள்ளது' : 'In progress',
        };
      case 'submitted':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-500',
          label: language === 'ta' ? 'சமர்ப்பிக்கப்பட்டது' : 'Submitted',
        };
      case 'confirmed_by_worker':
        return {
          bg: 'bg-[#E8F5EC] text-[#1E6B3A] border-[#1E6B3A]/30',
          dot: 'bg-[#1E6B3A]',
          label: language === 'ta' ? 'உங்களால் உறுதிசெய்யப்பட்டது' : 'Confirmed by you',
        };
      case 'disputed':
        return {
          bg: 'bg-[#FCE8E6] text-[#B3261E] border-[#B3261E]/30',
          dot: 'bg-[#B3261E]',
          label: language === 'ta' ? 'மறுக்கப்பட்டது - தீவிர கவனிப்பு' : 'Disputed by worker',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-300',
          dot: 'bg-gray-400',
          label: status,
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('electric')) return AlertTriangle;
    if (category.toLowerCase().includes('gear') || category.toLowerCase().includes('fall')) return HardHat;
    if (category.toLowerCase().includes('water') || category.toLowerCase().includes('sanitation')) return Droplets;
    if (category.toLowerCase().includes('pay') || category.toLowerCase().includes('hour')) return DollarSign;
    return Wrench;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Site badge */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2A2B]/80 pt-1">
        <span className="w-2 h-2 rounded-full bg-[#F2B705] inline-block" />
        <span>{t.siteBadge}</span>
      </div>

      {/* Hero Headline & Intro */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F2A2B] leading-tight">
          {t.tagline}
        </h1>
        <p className="text-xs sm:text-sm text-[#1F2A2B]/75 leading-relaxed font-normal">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Hero Banner Visual */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] bg-gradient-to-br from-[#1F2A2B] via-[#0F5F5C] to-[#0A4341] text-white shadow-sm min-h-[160px] sm:min-h-[180px] flex flex-col justify-end p-4">
        {/* Background construction site graphic simulation */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" fill="none" stroke="currentColor">
            <path d="M0,180 L80,60 L160,180 M160,180 L240,40 L320,180 M240,40 L380,20 L400,180" strokeWidth="2" />
            <line x1="80" y1="60" x2="240" y2="40" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="400" y2="120" strokeWidth="1" />
            <rect x="140" y="70" width="30" height="50" fill="currentColor" fillOpacity="0.2" />
            <rect x="200" y="80" width="40" height="60" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>

        {/* Worker Graphic & Realistic Silhouette Overlay */}
        <div className="absolute right-4 bottom-0 w-36 sm:w-44 h-full flex items-end justify-center pointer-events-none opacity-90">
          <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-lg">
            {/* Hard hat */}
            <path d="M42 35 C42 22, 78 22, 78 35 L88 38 C90 40, 84 42, 60 42 C36 42, 30 40, 32 38 Z" fill="#F2B705" />
            <path d="M50 22 C55 18, 65 18, 70 22" stroke="#FFFDF8" strokeWidth="2" strokeLinecap="round" />
            {/* Head */}
            <circle cx="60" cy="46" r="12" fill="#D9A874" />
            {/* Safety glasses */}
            <rect x="52" y="44" width="16" height="4" rx="2" fill="#1F2A2B" opacity="0.8" />
            {/* High-vis Vest and body */}
            <path d="M38 60 L82 60 L92 140 L28 140 Z" fill="#FF8C00" />
            {/* Reflective silver stripes */}
            <path d="M48 60 L44 140 M72 60 L76 140" stroke="#FFFDF8" strokeWidth="5" />
            <path d="M34 100 L86 100" stroke="#FFFDF8" strokeWidth="5" />
            {/* Dark inner collar */}
            <polygon points="54,60 66,60 60,74" fill="#1F2A2B" />
          </svg>
        </div>

        {/* Front overlay badge */}
        <div className="relative z-10 max-w-[70%]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
            <Shield className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>{t.confidentialBadge}</span>
          </div>
        </div>
      </div>

      {/* Primary CTA: Report a concern */}
      <button
        onClick={() => openReportModal(false)}
        className="w-full py-4 px-5 rounded-2xl bg-[#0F5F5C] hover:bg-[#0A4341] text-white font-bold text-base flex items-center justify-between shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-[#F2B705]" />
          </div>
          <span>{t.reportConcern}</span>
        </div>
        <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Voice entry point banner */}
      <div className="rounded-2xl border border-[#E8E2D5] bg-[#FFFDF8] p-3.5 kural-card-shadow">
        <button
          onClick={() => openReportModal(true)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E7F3F2] flex items-center justify-center text-[#0F5F5C] group-hover:bg-[#0F5F5C] group-hover:text-white transition-colors">
              <Mic className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#1F2A2B]">
              {t.speakConcern}
            </span>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#E8E2D5]/70 text-[#1F2A2B]/80 group-hover:bg-[#0F5F5C] group-hover:text-white transition-colors">
            {t.audioMode}
          </span>
        </button>
        <p className="text-[11px] text-[#1F2A2B]/70 mt-2 pl-1 border-t border-[#E8E2D5]/60 pt-2 leading-relaxed">
          {t.voiceNoteSub}
        </p>
      </div>

      {/* Quick Action Tiles: Check a case & How it works */}
      <div className="grid grid-cols-2 gap-3">
        {/* Tile 1: Check a case */}
        <button
          onClick={openCheckModal}
          className="p-3.5 rounded-2xl border border-[#E8E2D5] bg-[#FFFDF8] hover:bg-[#FBF7EF] text-left transition-all kural-card-shadow group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#E7F3F2] flex items-center justify-center text-[#0F5F5C] mb-2 group-hover:scale-105 transition-transform">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#1F2A2B]">{t.checkCase}</h3>
          <p className="text-[11px] text-[#1F2A2B]/70 mt-0.5">{t.checkCaseSub}</p>
        </button>

        {/* Tile 2: How it works */}
        <button
          onClick={openHowItWorks}
          className="p-3.5 rounded-2xl border border-[#E8E2D5] bg-[#FFFDF8] hover:bg-[#FBF7EF] text-left transition-all kural-card-shadow group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FEF8E6] flex items-center justify-center text-[#B87A00] mb-2 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 text-[#F2B705]" />
          </div>
          <h3 className="text-xs font-bold text-[#1F2A2B]">{t.howItWorks}</h3>
          <p className="text-[11px] text-[#1F2A2B]/70 mt-0.5">{t.howItWorksSub}</p>
        </button>
      </div>

      {/* Section: Your reported concerns */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-bold text-[#1F2A2B]">
              {t.yourReportedConcerns}
            </h2>
            <span className="text-xs text-[#1F2A2B]/60 font-medium">
              ({cases.length} {language === 'ta' ? 'மாதிரி வழக்குகள்' : 'demo cases'})
            </span>
          </div>
          <button
            onClick={() => setActiveFilter('all')}
            className="text-xs font-bold text-[#0F5F5C] hover:underline flex items-center gap-1"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#1F2A2B] text-white'
                : 'bg-[#FFFDF8] text-[#1F2A2B]/70 border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
            }`}
          >
            All ({cases.length})
          </button>
          <button
            onClick={() => setActiveFilter('needs_action')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'needs_action'
                ? 'bg-[#B87A00] text-white'
                : 'bg-[#FFFDF8] text-[#B87A00] border border-[#F2B705]/40 hover:bg-[#FEF8E6]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2B705]" />
            <span>Needs Verification ({cases.filter((c) => c.status === 'resolution_proposed').length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
              activeFilter === 'in_progress'
                ? 'bg-[#0F5F5C] text-white'
                : 'bg-[#FFFDF8] text-[#0F5F5C] border border-[#0F5F5C]/30 hover:bg-[#E7F3F2]'
            }`}
          >
            Active ({cases.filter((c) => c.status === 'in_progress' || c.status === 'submitted' || c.status === 'disputed').length})
          </button>
          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
              activeFilter === 'confirmed'
                ? 'bg-[#1E6B3A] text-white'
                : 'bg-[#FFFDF8] text-[#1E6B3A] border border-[#1E6B3A]/30 hover:bg-[#E8F5EC]'
            }`}
          >
            Verified ({cases.filter((c) => c.status === 'confirmed_by_worker').length})
          </button>
        </div>

        {/* Concern cards list */}
        <div className="space-y-3">
          {filteredCases.map((caseItem) => {
            const badge = getStatusBadge(caseItem.status);
            const Icon = getCategoryIcon(caseItem.category);
            const isResolutionProposed = caseItem.status === 'resolution_proposed';

            return (
              <div
                key={caseItem.id}
                className="rounded-2xl border border-[#E8E2D5] bg-[#FFFDF8] p-4 kural-card-shadow transition-all hover:border-[#0F5F5C]/40"
              >
                {/* Header row: Status pill + updated time */}
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold border ${badge.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[#1F2A2B]/60 text-[11px] font-medium">
                    Updated {caseItem.updatedAt}
                  </span>
                </div>

                {/* Main clickable area to open Screen 2 */}
                <div
                  onClick={() => selectCase(caseItem.id)}
                  className="cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') selectCase(caseItem.id);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FBF7EF] border border-[#E8E2D5] flex items-center justify-center text-[#1F2A2B]/80 flex-shrink-0 mt-0.5 group-hover:border-[#0F5F5C] transition-colors">
                      <Icon className="w-4 h-4 text-[#0F5F5C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold text-[#1F2A2B] truncate group-hover:text-[#0F5F5C] transition-colors">
                          {language === 'ta' && caseItem.titleTa ? caseItem.titleTa : caseItem.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-[#1F2A2B]/40 group-hover:text-[#0F5F5C] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                      </div>
                      <p className="text-[11px] text-[#1F2A2B]/70 mt-0.5 flex items-center gap-1 truncate">
                        <span>📍</span>
                        <span>{language === 'ta' && caseItem.locationTa ? caseItem.locationTa : caseItem.location}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inline Action box if Resolution Proposed (Matches Stitch Screen 1!) */}
                {isResolutionProposed && caseItem.proposedResolution && (
                  <div className="mt-3 p-3 rounded-xl bg-[#FEF8E6] border border-[#F2B705]/50 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#B87A00]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.actionNeeded}</span>
                    </div>
                    <p className="text-xs text-[#1F2A2B]/85 leading-relaxed">
                      {caseItem.proposedResolution.summary}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          confirmResolution(caseItem.id, 'Confirmed resolved on site.');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#0F5F5C] hover:bg-[#0A4341] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F2B705]" />
                        <span>{t.yesResolved}</span>
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Please explain why the hazard is not resolved:', 'Issue is still present on site');
                          if (reason) {
                            disputeResolution(caseItem.id, reason);
                          }
                        }}
                        className="flex-1 py-2 px-3 rounded-xl border border-[#B3261E]/40 bg-white hover:bg-red-50 text-[#B3261E] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5 text-[#B3261E]" />
                        <span>{t.stillAnIssue}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reporting Privacy Modes Card */}
      <div className="p-4 rounded-2xl border border-[#E8E2D5] bg-[#FFFDF8] kural-card-shadow space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0F5F5C] flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4 text-[#F2B705]" />
          </div>
          <h3 className="text-sm font-bold text-[#1F2A2B]">{t.privacyModesTitle}</h3>
        </div>
        <p className="text-xs text-[#1F2A2B]/75 leading-relaxed">
          {t.privacyModesDesc}
        </p>
        <button
          onClick={openPrivacyPolicy}
          className="text-xs font-bold text-[#0F5F5C] hover:underline inline-flex items-center gap-1 pt-1"
        >
          <span>{t.workerRightsPolicy}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
