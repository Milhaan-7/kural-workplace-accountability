import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyPolicyModal: React.FC = () => {
  const { isPrivacyPolicyOpen, closePrivacyPolicy, language } = useApp();

  if (!isPrivacyPolicyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#FFFDF8] rounded-2xl border border-[#E8E2D5] shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E2D5] flex items-center justify-between bg-[#FBF7EF]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0F5F5C]" />
            <h2 className="text-base font-bold text-[#1F2A2B]">
              {language === 'ta' ? 'தொழிலாளர் உரிமை மற்றும் ரகசியத்தன்மை' : 'Worker Rights & Privacy Policy'}
            </h2>
          </div>
          <button
            onClick={closePrivacyPolicy}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1F2A2B]/60 hover:text-[#1F2A2B] hover:bg-[#E8E2D5]/50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-[#1F2A2B]/80 leading-relaxed">
          <div className="p-3 bg-[#FEF8E6] border border-[#F2B705]/40 rounded-xl text-[#1F2A2B]">
            <strong>Honest Privacy Commitment:</strong> This demonstration app stores data in browser memory. In production, Kural enforces strict server-side minimum-group suppression so that no supervisor can deanonymize workers by cross-referencing timestamps.
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <EyeOff className="w-4 h-4 text-[#0F5F5C] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#1F2A2B]">Supervisor-Hidden Reporting</h4>
                <p>When reporting under Supervisor-Hidden mode, case details go directly to the central Health, Safety & Environment (HSE) department. Your immediate site foreman or contractor supervisor does not receive your worker profile or payroll ID.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="w-4 h-4 text-[#0F5F5C] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#1F2A2B]">Cryptographic Anonymous Keys</h4>
                <p>In Fully Anonymous mode, zero telemetry or device identifiers are recorded. You receive a client-side secret key (e.g. AK-8921-X9). Keep this safe; it is the only way to inspect the resolution and execute your verification sign-off.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText className="w-4 h-4 text-[#0F5F5C] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#1F2A2B]">Anti-Retaliation Protection (SDG 8.8)</h4>
                <p>Under ILO conventions and SDG Target 8.8, workplace safety reporting is a fundamental human right. Unilateral closure or retaliatory actions violate the enterprise compliance charter.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end border-t border-[#E8E2D5]">
            <button
              onClick={closePrivacyPolicy}
              className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] text-white text-xs font-bold hover:bg-[#0A4341] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
