import React from 'react';
import { X, CheckCircle2, ShieldAlert, Award, FileSpreadsheet, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorksModal: React.FC = () => {
  const { isHowItWorksOpen, closeHowItWorks, language } = useApp();

  if (!isHowItWorksOpen) return null;

  const steps = [
    {
      num: '1',
      title: language === 'ta' ? 'பாதுகாப்பாக புகாரளிக்கவும்' : '1. Report Safely',
      desc:
        language === 'ta'
          ? 'உங்கள் விருப்பத்திற்கேற்ப ரகசியத்தன்மை முறையைத் தேர்ந்தெடுக்கவும் (மேற்பார்வையாளர் மறைக்கப்பட்ட முறை, அநாமதேயம் அல்லது நேரடி பெயர்).'
          : 'Choose your protection level: Supervisor-hidden, Anonymous with secret key, or Direct Named.',
      icon: Lock,
      color: 'bg-teal-100 text-[#0F5F5C]',
    },
    {
      num: '2',
      title: language === 'ta' ? 'கள பராமரிப்பு நடவடிக்கை' : '2. Action & Accountability Trail',
      desc:
        language === 'ta'
          ? 'பாதுகாப்பு அதிகாரி மற்றும் பராமரிப்பு குழு களத்தில் ஆய்வு செய்து வேலை ஆணையை உருவாக்குகிறார்கள். ஒவ்வொரு நடவடிக்கையும் காலவரிசையில் பதிவு செய்யப்படுகிறது.'
          : 'Safety leads log inspection and issue repair work orders. Every step is transparently logged in the Accountability Trail.',
      icon: FileSpreadsheet,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      num: '3',
      title: language === 'ta' ? 'தீர்வு முன்மொழிவு (வழக்கு மூடப்படாது!)' : '3. Proposed Resolution',
      desc:
        language === 'ta'
          ? 'பராமரிப்புக் குழு வேலை முடிந்ததாகப் புகைப்படத்துடன் அறிக்கை அளிக்கிறது. ஆனால் உங்கள் ஒப்புதல் இல்லாமல் இந்த டிக்கெட் மூடப்படாது.'
          : 'Employer or contractor marks repair completed with photo proof. Under SDG 8 rules, this ticket CANNOT close yet.',
      icon: ShieldAlert,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      num: '4',
      title: language === 'ta' ? 'பணியாளர் சரிபார்ப்பு ரசீது' : '4. Worker Verification Receipt',
      desc:
        language === 'ta'
          ? 'நீங்கள் நேரடியாகப் பார்வையிட்டு பிரச்சனை சரிசெய்யப்பட்டதை உறுதிசெய்த பிறகே அதிகாரப்பூர்வ சரிபார்ப்பு ரசீது உருவாக்கப்பட்டு வழக்கு நிறைவடையும்.'
          : 'You inspect the physical site with your own eyes. Only your verification generates the tamper-proof Verification Receipt.',
      icon: Award,
      color: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#FFFDF8] rounded-2xl border border-[#E8E2D5] shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E2D5] flex items-center justify-between bg-[#FBF7EF]">
          <div>
            <h2 className="text-base font-bold text-[#1F2A2B]">
              {language === 'ta' ? 'குரல் எவ்வாறு செயல்படுகிறது' : 'How Kural Verification Works'}
            </h2>
            <p className="text-xs text-[#1F2A2B]/70">
              {language === 'ta' ? 'ஐநா நீடித்த வளர்ச்சி இலக்கு 8 (SDG 8) தரநிலை' : 'Aligned with UN SDG 8 Decent Work & Accountability'}
            </p>
          </div>
          <button
            onClick={closeHowItWorks}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1F2A2B]/60 hover:text-[#1F2A2B] hover:bg-[#E8E2D5]/50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="p-3 bg-[#E7F3F2] rounded-xl border border-[#0F5F5C]/20 text-xs text-[#0F5F5C] font-medium leading-relaxed">
            <strong>The Core Differentiator:</strong> In typical factory and construction systems, management closes worker tickets unilaterally. In Kural, <em>a proposed resolution is never a confirmed resolution</em>. Only the affected worker holds the verification key.
          </div>

          <div className="space-y-3">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.num} className="p-3.5 rounded-xl border border-[#E8E2D5] bg-white flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${st.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1F2A2B]">{st.title}</h3>
                    <p className="text-xs text-[#1F2A2B]/75 mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={closeHowItWorks}
              className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] text-white text-xs font-bold hover:bg-[#0A4341] transition-colors"
            >
              {language === 'ta' ? 'புரிந்தது' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
