import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { WorkerHome } from './components/WorkerHome';
import { CaseDetail } from './components/CaseDetail';
import { ReportConcernModal } from './components/ReportConcernModal';
import { CheckCaseModal } from './components/CheckCaseModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { Home, FileText, PlusCircle, RotateCcw, Shield } from 'lucide-react';

function AppContent() {
  const { selectedCaseId, selectCase, openReportModal, resetDemoData, cases } = useApp();

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#1F2A2B] flex flex-col selection:bg-[#0F5F5C] selection:text-white font-sans">
      {/* Top Demo Notification Banner */}
      <div className="bg-[#1F2A2B] text-[#FFFDF8] text-[11px] py-1.5 px-4 font-medium flex items-center justify-between border-b border-[#0F5F5C]/40">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2B705] animate-ping" />
            <span className="font-semibold tracking-wide">
              UN SDG 8 Hackathon MVP · Kural Worker Verification Engine
            </span>
          </div>
          <button
            onClick={resetDemoData}
            className="text-[10px] text-[#F2B705] hover:underline flex items-center gap-1 font-mono"
            title="Reset to default 5 demonstration cases"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main App Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4">
        {selectedCaseId ? <CaseDetail /> : <WorkerHome />}
      </main>

      {/* Modals */}
      <ReportConcernModal />
      <CheckCaseModal />
      <HowItWorksModal />
      <PrivacyPolicyModal />

      {/* Bottom Quick Navigation Bar (Sticky mobile & desktop accessible) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#E8E2D5] py-2 px-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Home */}
          <button
            onClick={() => selectCase(null)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              selectedCaseId === null
                ? 'text-[#0F5F5C] font-bold'
                : 'text-[#1F2A2B]/60 hover:text-[#1F2A2B]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Worker Home</span>
          </button>

          {/* Plus CTA */}
          <button
            onClick={() => openReportModal(false)}
            className="flex flex-col items-center gap-0.5 -mt-5"
            aria-label="Report Concern"
          >
            <div className="w-12 h-12 rounded-full bg-[#0F5F5C] hover:bg-[#0A4341] text-[#F2B705] flex items-center justify-center shadow-lg transition-transform hover:scale-105">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-bold text-[#0F5F5C]">Report</span>
          </button>

          {/* Case Screen 2 Shortcut (Quick jump to KUR-2026-0042) */}
          <button
            onClick={() => {
              const target = cases.find((c) => c.caseRef === 'KUR-2026-0042') || cases[0];
              if (target) selectCase(target.id);
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              selectedCaseId !== null
                ? 'text-[#0F5F5C] font-bold'
                : 'text-[#1F2A2B]/60 hover:text-[#1F2A2B]'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px]">Resolution Receipt</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
