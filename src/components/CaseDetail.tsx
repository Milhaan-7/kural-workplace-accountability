import React, { useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  MoreHorizontal,
  Zap,
  MapPin,
  Calendar,
  Shield,
  Volume2,
  FileAudio,
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertOctagon,
  Image as ImageIcon,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isWorkerConfirmed, canWorkerVerify } from '../domain/rules';

export const CaseDetail: React.FC = () => {
  const {
    selectedCase,
    selectCase,
    confirmResolution,
    disputeResolution,
    language,
    t,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmNotes, setConfirmNotes] = useState('');

  if (!selectedCase) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-[#1F2A2B]/70">No case selected.</p>
        <button
          onClick={() => selectCase(null)}
          className="px-4 py-2 rounded-xl bg-[#0F5F5C] text-white text-xs font-bold"
        >
          Return to home
        </button>
      </div>
    );
  }

  const handleCopyRef = () => {
    navigator.clipboard.writeText(selectedCase.caseRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmResolution(selectedCase.id, confirmNotes.trim() || undefined);
    setConfirmDialogOpen(false);
    setConfirmNotes('');
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    disputeResolution(selectedCase.id, disputeReason.trim());
    setDisputeDialogOpen(false);
    setDisputeReason('');
  };

  const isConfirmed = isWorkerConfirmed(selectedCase.status);
  const isAwaitingVerification = canWorkerVerify(selectedCase.status);
  const isDisputed = selectedCase.status === 'disputed';

  return (
    <div className="space-y-4 pb-24">
      {/* Top Bar / Breadcrumb */}
      <div className="flex items-center justify-between text-xs py-1">
        <button
          onClick={() => selectCase(null)}
          className="inline-flex items-center gap-1.5 font-bold text-[#0F5F5C] hover:text-[#0A4341] transition-colors"
          aria-label="Back to all cases"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.allCases}</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8E2D5]/70 text-[#1F2A2B]/70 text-[11px] font-semibold">
            {t.demoView}
          </span>
          <button
            onClick={() => alert(`Case Reference: ${selectedCase.caseRef}\nStatus: ${selectedCase.status}`)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#1F2A2B]/60 hover:bg-[#E8E2D5]/50"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case Reference Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] bg-[#FFFDF8] kural-card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E8E2D5]/70 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#1F2A2B]/60 uppercase">
              {t.caseReference}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-[#1F2A2B] tracking-tight font-mono">
                {selectedCase.caseRef}
              </span>
              <button
                onClick={handleCopyRef}
                className="p-1 rounded-md text-[#1F2A2B]/60 hover:text-[#0F5F5C] hover:bg-[#E7F3F2] transition-colors"
                title="Copy reference code"
                aria-label="Copy reference ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8E2D5]/60 text-[#1F2A2B]/70">
                (Demo)
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isConfirmed ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5EC] border border-[#1E6B3A]/30 text-[#1E6B3A] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#1E6B3A]" />
                <span>{t.status.confirmed_by_worker}</span>
              </div>
            ) : isAwaitingVerification ? (
              <div className="inline-flex flex-col items-start sm:items-end">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF8E6] border border-[#F2B705]/50 text-[#B87A00] text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#F2B705] animate-pulse" />
                  <span>{t.status.resolution_proposed}</span>
                </div>
                <span className="text-[10px] text-[#B87A00] font-semibold mt-1">
                  {t.status.awaiting_worker}
                </span>
              </div>
            ) : isDisputed ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FCE8E6] border border-[#B3261E]/30 text-[#B3261E] text-xs font-bold">
                <XCircle className="w-4 h-4 text-[#B3261E]" />
                <span>{t.status.disputed}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E7F3F2] border border-[#0F5F5C]/30 text-[#0F5F5C] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0F5F5C]" />
                <span>{t.status[selectedCase.status] || selectedCase.status}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4-Item Metadata Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Category */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#FBF7EF] border border-[#E8E2D5]/70 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0F5F5C]/10 flex items-center justify-center text-[#0F5F5C] flex-shrink-0 mt-0.5">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#1F2A2B]/60 uppercase tracking-wider block">
                {t.category}
              </span>
              <span className="text-xs font-bold text-[#1F2A2B] truncate block">
                {language === 'ta' && selectedCase.categoryTa ? selectedCase.categoryTa : selectedCase.category}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#FBF7EF] border border-[#E8E2D5]/70 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0F5F5C]/10 flex items-center justify-center text-[#0F5F5C] flex-shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#1F2A2B]/60 uppercase tracking-wider block">
                {t.location}
              </span>
              <span className="text-xs font-bold text-[#1F2A2B] truncate block">
                {language === 'ta' && selectedCase.locationTa ? selectedCase.locationTa : selectedCase.location}
              </span>
            </div>
          </div>

          {/* Reported Date */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#FBF7EF] border border-[#E8E2D5]/70 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0F5F5C]/10 flex items-center justify-center text-[#0F5F5C] flex-shrink-0 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#1F2A2B]/60 uppercase tracking-wider block">
                {t.reported}
              </span>
              <span className="text-xs font-bold text-[#1F2A2B] truncate block">
                {selectedCase.reportedAt}
              </span>
            </div>
          </div>

          {/* Privacy Mode */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#FBF7EF] border border-[#E8E2D5]/70 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0F5F5C]/10 flex items-center justify-center text-[#0F5F5C] flex-shrink-0 mt-0.5">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#1F2A2B]/60 uppercase tracking-wider block">
                {t.privacyMode}
              </span>
              <span className="text-xs font-bold text-[#1F2A2B] truncate block">
                {t.privacy[selectedCase.privacyMode] || selectedCase.privacyMode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Your Reported Concern Section */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] bg-[#FFFDF8] kural-card-shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0F5F5C]/10 flex items-center justify-center text-[#0F5F5C]">
              <Volume2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2A2B]">{t.yourReportedConcern}</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8E2D5]/60 text-[#1F2A2B]/80">
            {t.workerSubmission}
          </span>
        </div>

        {/* Concern text quote */}
        <blockquote className="text-xs sm:text-sm text-[#1F2A2B]/90 italic bg-[#FBF7EF] p-3.5 rounded-xl border-l-4 border-[#0F5F5C] leading-relaxed">
          &ldquo;{language === 'ta' && selectedCase.descriptionTa ? selectedCase.descriptionTa : selectedCase.description}&rdquo;
        </blockquote>

        {/* Audio note attachment if present */}
        {(selectedCase.audioNoteAttached || selectedCase.audioTranscript) && (
          <div className="p-3 rounded-xl border border-[#E8E2D5] bg-white flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#1F2A2B] flex items-center justify-center text-white flex-shrink-0 overflow-hidden relative">
              <svg className="w-full h-full opacity-60 p-1" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#F2B705" strokeWidth="4" fill="none" />
                <path d="M40 35 L70 50 L40 65 Z" fill="#FFFDF8" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileAudio className="w-3.5 h-3.5 text-[#0F5F5C]" />
                  <span className="text-xs font-bold text-[#1F2A2B]">{t.audioNoteAttached}</span>
                </div>
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E7F3F2] text-[#0F5F5C] hover:bg-[#0F5F5C] hover:text-white transition-colors"
                >
                  {isPlayingAudio ? 'Pause' : 'Play draft'}
                </button>
              </div>
              <p className="text-[11px] text-[#1F2A2B]/70 mt-0.5">
                {t.audioDraftTranscript}
              </p>
              {isPlayingAudio && (
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-1 h-3 bg-[#0F5F5C] animate-pulse" />
                  <div className="w-1 h-5 bg-[#F2B705] animate-pulse delay-75" />
                  <div className="w-1 h-2 bg-[#0F5F5C] animate-pulse delay-100" />
                  <div className="w-1 h-4 bg-[#0F5F5C] animate-pulse delay-150" />
                  <div className="w-1 h-3 bg-[#F2B705] animate-pulse" />
                  <span className="text-[10px] text-[#1F2A2B]/60 ml-2 font-mono">0:14 / 0:14 (Simulated Audio)</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accountability Trail Section */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] bg-[#FFFDF8] kural-card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">📈</span>
            <h3 className="text-sm font-bold text-[#1F2A2B]">{t.accountabilityTrail}</h3>
          </div>
          <span className="text-xs font-semibold text-[#1F2A2B]/60">
            {selectedCase.timeline.length} {t.milestones}
          </span>
        </div>

        {/* Chronological Timeline */}
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E2D5]">
          {selectedCase.timeline.map((event, index) => {
            const isLast = index === selectedCase.timeline.length - 1;
            const isResolutionEvent = event.icon === 'resolution';
            const isConfirmedEvent = event.icon === 'confirmed';
            const isDisputedEvent = event.icon === 'dispute';

            let dotColor = 'bg-[#0F5F5C] text-white';
            if (isConfirmedEvent) dotColor = 'bg-[#1E6B3A] text-white';
            if (isResolutionEvent) dotColor = 'bg-[#F2B705] text-[#1F2A2B] ring-2 ring-[#FFFDF8] shadow-sm';
            if (isDisputedEvent) dotColor = 'bg-[#B3261E] text-white';

            return (
              <div key={event.id} className="relative">
                {/* Dot */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${dotColor}`}
                >
                  {isConfirmedEvent ? '✓' : isDisputedEvent ? '✕' : isResolutionEvent ? '★' : index + 1}
                </div>

                <div
                  className={`rounded-xl p-3 border transition-all ${
                    isResolutionEvent
                      ? 'bg-[#FEF8E6]/60 border-[#F2B705]/50'
                      : isConfirmedEvent
                      ? 'bg-[#E8F5EC]/70 border-[#1E6B3A]/30'
                      : isDisputedEvent
                      ? 'bg-[#FCE8E6]/70 border-[#B3261E]/30'
                      : 'bg-white border-[#E8E2D5]/70'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#1F2A2B]">
                      {language === 'ta' && event.titleTa ? event.titleTa : event.title}
                    </h4>
                    <span className="text-[10px] text-[#1F2A2B]/60 whitespace-nowrap font-medium">
                      {event.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#1F2A2B]/80 mt-1 leading-relaxed">
                    {language === 'ta' && event.descriptionTa ? event.descriptionTa : event.description}
                  </p>

                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#1F2A2B]/60 font-medium">
                    <span>By: {event.actor}</span>
                    <span>·</span>
                    <span className="italic">{event.actorRole}</span>
                  </div>

                  {/* Photo Proof Attachment if present */}
                  {event.attachment && (
                    <div className="mt-2.5 p-2 rounded-lg bg-white border border-[#E8E2D5] flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded bg-[#FBF7EF] border border-[#E8E2D5] flex items-center justify-center text-[#0F5F5C] flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-[#0F5F5C]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#1F2A2B] truncate block">
                          {event.attachment.title}
                        </span>
                        <span className="text-[10px] text-[#1F2A2B]/60 truncate block">
                          {event.attachment.subtitle}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VERIFICATION RECEIPT / WORKER CONFIRMATION SECTION */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#0F5F5C] bg-[#FFFDF8] kural-card-shadow space-y-4 relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-[-10px] top-[-10px] opacity-5 pointer-events-none">
          <FileCheck className="w-36 h-36 text-[#0F5F5C]" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0F5F5C] flex items-center justify-center text-white shadow-sm">
              <FileCheck className="w-4 h-4 text-[#F2B705]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#0F5F5C] tracking-widest uppercase block">
                {t.verificationReceipt}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-[#1F2A2B]">
                {t.workerConfirmation}
              </h3>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#0F5F5C]/10 text-[#0F5F5C] font-bold">
            SDG 8.8
          </span>
        </div>

        {/* STATE 1: WORKER HAS ALREADY CONFIRMED -> OFFICIAL TAMPER-PROOF RECEIPT */}
        {isConfirmed && selectedCase.verificationReceipt && (
          <div className="space-y-3 relative z-10">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#E8F5EC] to-[#E7F3F2] border-2 border-[#1E6B3A]/40 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#1E6B3A]/20 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#1E6B3A]" />
                  <span className="text-xs sm:text-sm font-extrabold text-[#1E6B3A] uppercase tracking-wide">
                    {t.receiptVerifiedTitle}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-[#1E6B3A] text-white px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#1F2A2B]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#1F2A2B]/70">{t.receiptCode}:</span>
                  <span className="font-mono font-black text-sm text-[#1E6B3A] tracking-wider">
                    {selectedCase.verificationReceipt.verificationCode}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#1F2A2B]/70">Signed off at:</span>
                  <span className="font-semibold">{selectedCase.verificationReceipt.confirmedAt}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#1F2A2B]/70">Worker signatory:</span>
                  <span className="font-semibold">{selectedCase.verificationReceipt.confirmedBy}</span>
                </div>
                {selectedCase.verificationReceipt.notes && (
                  <div className="pt-1 text-[#1F2A2B]/85 italic bg-white/70 p-2 rounded border border-[#1E6B3A]/20">
                    &ldquo;{selectedCase.verificationReceipt.notes}&rdquo;
                  </div>
                )}
              </div>

              <p className="text-[11px] text-[#1E6B3A]/90 font-medium pt-1 border-t border-[#1E6B3A]/20">
                {t.receiptNotice}
              </p>
            </div>

            {/* Option to re-open if issue re-occurs */}
            <div className="text-right">
              <button
                onClick={() => setDisputeDialogOpen(true)}
                className="text-xs font-semibold text-[#B3261E] hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Issue returned or recurred? Reopen case</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE 2: CASE IS DISPUTED */}
        {isDisputed && (
          <div className="p-4 rounded-xl bg-[#FCE8E6] border border-[#B3261E]/40 space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-[#B3261E] font-bold text-xs sm:text-sm">
              <AlertOctagon className="w-4 h-4 flex-shrink-0" />
              <span>{t.disputeNoticeTitle}</span>
            </div>
            <p className="text-xs text-[#1F2A2B]/80 leading-relaxed">
              {t.disputeNoticeBody}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setConfirmDialogOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#0F5F5C] text-white text-xs font-bold hover:bg-[#0A4341]"
              >
                Inspect again & Confirm
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: RESOLUTION PROPOSED -> WORKER CAN CONFIRM OR DISPUTE */}
        {isAwaitingVerification && (
          <div className="space-y-4 relative z-10">
            {/* Protocol notice box */}
            <div className="p-3.5 rounded-xl bg-[#FBF7EF] border border-[#E8E2D5] text-xs text-[#1F2A2B]/85 leading-relaxed">
              {t.verificationProtocolNotice}
            </div>

            {/* Action Buttons: Confirm Resolved & This is not resolved */}
            <div className="space-y-2.5">
              {/* Confirm Resolved Primary Button */}
              <button
                onClick={() => setConfirmDialogOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1E6B3A] hover:bg-[#16502B] text-white font-bold text-left shadow-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#FFFDF8]" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-extrabold block">
                      {t.confirmResolved}
                    </span>
                    <span className="text-[11px] text-white/80 block font-normal">
                      {t.confirmResolvedSub}
                    </span>
                  </div>
                </div>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* This is not resolved Dispute Button */}
              <button
                onClick={() => setDisputeDialogOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#B3261E] hover:bg-[#8F1E17] text-white font-bold text-left shadow-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 text-[#FFFDF8]" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-extrabold block">
                      {t.thisIsNotResolved}
                    </span>
                    <span className="text-[11px] text-white/80 block font-normal">
                      {t.thisIsNotResolvedSub}
                    </span>
                  </div>
                </div>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Worker Sign-off Terms */}
            <div className="p-3 rounded-xl bg-[#FBF7EF] border border-[#E8E2D5] space-y-1.5 text-[11px] text-[#1F2A2B]/75 leading-relaxed">
              <span className="font-bold text-[#1F2A2B] block">
                {t.workerSignOffTerms}
              </span>
              <p>• {t.signOffTermConfirm}</p>
              <p>• {t.signOffTermDispute}</p>
            </div>
          </div>
        )}

        {/* STATE 4: IN PROGRESS / SUBMITTED -> WAITING FOR CONTRACTOR/SAFETY TEAM */}
        {!isConfirmed && !isAwaitingVerification && !isDisputed && (
          <div className="p-3.5 rounded-xl bg-[#E7F3F2]/60 border border-[#0F5F5C]/30 text-xs text-[#0F5F5C] leading-relaxed relative z-10">
            <strong>Active Site Investigation:</strong> The safety team is actively investigating this ticket. Once maintenance proposes a fix and uploads proof, you will receive a notification here to verify and sign off.
          </div>
        )}
      </div>

      {/* CONFIRM RESOLUTION MODAL */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-2xl border border-[#E8E2D5] shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 text-[#1E6B3A]">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#1F2A2B]">
                {language === 'ta' ? 'தீர்வை உறுதிசெய்க' : 'Confirm Workplace Resolution'}
              </h3>
            </div>
            <p className="text-xs text-[#1F2A2B]/80 leading-relaxed">
              {language === 'ta'
                ? 'நீங்கள் தளத்தை நேரடியாக ஆய்வு செய்து பிரச்சனை முழுமையாக தீர்க்கப்பட்டதை உறுதி செய்கிறீர்களா?'
                : 'Have you inspected the site location with your own eyes and verified that the hazard has been fully removed?'}
            </p>
            <div>
              <label className="block text-xs font-bold text-[#1F2A2B]/70 mb-1">
                Optional Inspection Note:
              </label>
              <input
                type="text"
                value={confirmNotes}
                onChange={(e) => setConfirmNotes(e.target.value)}
                placeholder="e.g. Inspected pump room, floor is dry and safe"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E2D5] focus:outline-none focus:ring-2 focus:ring-[#1E6B3A]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D5]">
              <button
                type="button"
                onClick={() => setConfirmDialogOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#1F2A2B]/70 hover:bg-[#FBF7EF]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-2 rounded-xl bg-[#1E6B3A] hover:bg-[#16502B] text-white text-xs font-bold shadow-sm"
              >
                Sign Verification Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPUTE RESOLUTION MODAL */}
      {disputeDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-2xl border border-[#E8E2D5] shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 text-[#B3261E]">
              <XCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#1F2A2B]">
                {language === 'ta' ? 'தீர்வை மறுக்கவும் (சிக்கல் நீடிக்கிறது)' : 'Dispute Proposed Resolution'}
              </h3>
            </div>
            <p className="text-xs text-[#1F2A2B]/80 leading-relaxed">
              {language === 'ta'
                ? 'பிரச்சனை ஏன் இன்னும் சரியாகவில்லை என்று விளக்குங்கள். இந்த வழக்கு உடனடியாக பராமரிப்புப் பிரிவுக்கு திருப்பி அனுப்பப்படும்.'
                : 'Explain what is still unsafe or incomplete. This case will be reopened immediately and escalated to site supervisors.'}
            </p>
            <div>
              <label className="block text-xs font-bold text-[#1F2A2B]/70 mb-1">
                Dispute Reason *
              </label>
              <textarea
                required
                rows={3}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="e.g. Water is still leaking from the ceiling joint during pump cycle..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E2D5] focus:outline-none focus:ring-2 focus:ring-[#B3261E]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D5]">
              <button
                type="button"
                onClick={() => setDisputeDialogOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#1F2A2B]/70 hover:bg-[#FBF7EF]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisputeSubmit}
                className="px-4 py-2 rounded-xl bg-[#B3261E] hover:bg-[#8F1E17] text-white text-xs font-bold shadow-sm"
              >
                Reopen & Escalate Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
