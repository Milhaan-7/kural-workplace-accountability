import React from 'react';
import { Megaphone, Bell, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t, selectedCase, selectCase } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8E2D5] px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => selectCase(null)} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          role="button"
          tabIndex={0}
          aria-label="Kural Home"
          onKeyDown={(e) => { if (e.key === 'Enter') selectCase(null); }}
        >
          <div className="w-9 h-9 rounded-full bg-[#0F5F5C] flex items-center justify-center text-white shadow-sm group-hover:bg-[#0A4341] transition-colors">
            <Megaphone className="w-5 h-5 text-[#F2B705] transform -rotate-12" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#1F2A2B]">Kural</span>
            <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded bg-[#0F5F5C]/10 text-[#0F5F5C]">SDG 8</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          {/* Language Toggle */}
          <div className="inline-flex items-center bg-[#E8E2D5]/60 p-0.5 rounded-full text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'en'
                  ? 'bg-[#0F5F5C] text-white shadow-sm'
                  : 'text-[#1F2A2B] hover:text-[#0F5F5C]'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'ta'
                  ? 'bg-[#0F5F5C] text-white shadow-sm'
                  : 'text-[#1F2A2B] hover:text-[#0F5F5C]'
              }`}
              aria-label="Switch to Tamil"
            >
              தமிழ்
            </button>
          </div>

          {/* Notifications button */}
          <button
            onClick={() => alert('Demo Notification: 1 resolution proposal waiting for your verification (KUR-2026-0042).')}
            className="w-9 h-9 rounded-full bg-[#FBF7EF] border border-[#E8E2D5] flex items-center justify-center text-[#1F2A2B] hover:bg-[#E8E2D5]/40 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#1F2A2B]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F2B705] ring-2 ring-[#FFFDF8]" />
          </button>

          {/* Profile / Demo user badge */}
          <button
            onClick={() => alert('Signed in as Site Worker · Site #TN-CHN-64 (Demo Session)')}
            className="w-9 h-9 rounded-full bg-[#0F5F5C]/10 border border-[#0F5F5C]/20 flex items-center justify-center text-[#0F5F5C] hover:bg-[#0F5F5C]/20 transition-colors"
            aria-label="User Profile"
          >
            <User className="w-4 h-4 text-[#0F5F5C]" />
          </button>
        </div>
      </div>
    </header>
  );
};
