import React, { useState } from 'react';
import { X, Search, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckCaseModal: React.FC = () => {
  const { isCheckModalOpen, closeCheckModal, searchAndOpenCase, language } = useApp();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  if (!isCheckModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a Case Reference or Anonymous Key');
      return;
    }
    const success = searchAndOpenCase(query);
    if (!success) {
      setError('No matching case found in current demo records. Try KUR-2026-0042.');
    } else {
      setError('');
    }
  };

  const demoRefs = ['KUR-2026-0042', 'KUR-2026-0041', 'AK-8921-X9'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-2xl border border-[#E8E2D5] shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E2D5] flex items-center justify-between bg-[#FBF7EF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0F5F5C]/10 flex items-center justify-center text-[#0F5F5C]">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2A2B]">
                {language === 'ta' ? 'வழக்கை சரிபார்க்க' : 'Check a Case Progress'}
              </h2>
              <p className="text-xs text-[#1F2A2B]/70">
                {language === 'ta' ? 'குறிப்பு எண் அல்லது ரகசிய சாவி' : 'Track case & review resolution receipt'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCheckModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1F2A2B]/60 hover:text-[#1F2A2B] hover:bg-[#E8E2D5]/50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A2B]/80 mb-1.5">
              {language === 'ta' ? 'வழக்கு குறிப்பு எண் / அநாமதேய சாவி' : 'Case Reference ID or Anonymous Secret Key'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#1F2A2B]/40 absolute left-3.5 top-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError('');
                }}
                placeholder="e.g. KUR-2026-0042 or AK-8921-X9"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#FFFDF8] text-sm font-mono text-[#1F2A2B] uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Pre-fills */}
          <div>
            <span className="text-[11px] font-bold text-[#1F2A2B]/60 uppercase">Quick Demo Cases:</span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {demoRefs.map((ref) => (
                <button
                  type="button"
                  key={ref}
                  onClick={() => {
                    setQuery(ref);
                    searchAndOpenCase(ref);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#E7F3F2] border border-[#0F5F5C]/20 text-[11px] font-mono font-bold text-[#0F5F5C] hover:bg-[#0F5F5C] hover:text-white transition-colors"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#E8E2D5]">
            <button
              type="button"
              onClick={closeCheckModal}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#1F2A2B]/80 hover:bg-[#FBF7EF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0F5F5C] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#0A4341] transition-colors"
            >
              <span>{language === 'ta' ? 'திறக்க' : 'Find Case'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
