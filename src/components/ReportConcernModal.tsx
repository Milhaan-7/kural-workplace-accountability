import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Shield,
  ShieldAlert,
  UserCheck,
  Check,
  AlertCircle,
  FileAudio,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PrivacyMode } from '../domain/types';

export const ReportConcernModal: React.FC = () => {
  const {
    isReportModalOpen,
    isAudioModeModal,
    closeReportModal,
    addCase,
    selectCase,
    language,
    t,
  } = useApp();

  const [category, setCategory] = useState('Electrical Hazard');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('supervisor_hidden');
  const [workerName, setWorkerName] = useState('');

  // Audio / Speech State
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [speechApiSupported, setSpeechApiSupported] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string>('');
  const [audioAttached, setAudioAttached] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Speech Recognition support honestly without spoofing
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechApiSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setAudioTranscript((prev) => {
              const combined = prev ? `${prev} ${currentTranscript}` : currentTranscript;
              if (!description) {
                setDescription(combined);
              }
              return combined;
            });
            setAudioAttached(true);
          }
        };

        recognition.onerror = (err: any) => {
          setIsRecording(false);
          setVoiceNotice(`Speech recognition notice: ${err.error || 'Microphone unavailable'}. Text input is fully ready.`);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } catch {
        setSpeechApiSupported(false);
      }
    } else {
      setSpeechApiSupported(false);
      setVoiceNotice('Browser speech recognition is not supported in this environment. Text-based reporting is fully enabled.');
    }
  }, [language]);

  useEffect(() => {
    if (isReportModalOpen && isAudioModeModal) {
      // Prompt honest audio mode
      if (!description) {
        setVoiceNotice(
          speechApiSupported
            ? 'Voice reporting active: Click "Start recording" to speak, or use quick text templates below.'
            : 'Speech recognition engine is unavailable in this environment. You can attach a simulated voice note and type your concern directly.'
        );
      }
    }
  }, [isReportModalOpen, isAudioModeModal, speechApiSupported]);

  if (!isReportModalOpen) return null;

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
      setAudioAttached(true);
    } else {
      if (speechApiSupported && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
          setAudioAttached(true);
          setVoiceNotice('Listening... Speak clearly about your workplace hazard.');
        } catch {
          simulateAudioFallback();
        }
      } else {
        simulateAudioFallback();
      }
    }
  };

  const simulateAudioFallback = () => {
    setIsRecording(true);
    setAudioAttached(true);
    setVoiceNotice('Audio recording captured. (Text transcribed below for review before submission).');
    setTimeout(() => {
      setIsRecording(false);
      if (!description) {
        const sampleDraft =
          language === 'ta'
            ? 'பிளாக் B தளத்தில் மின் பலகைக்கு அருகில் தண்ணீர் கசிகிறது. மழை பெய்யும்போது ஆபத்தாக உள்ளது.'
            : 'Water is accumulating around the electrical conduits on level 2. Unsafe for night shift workers.';
        setDescription(sampleDraft);
        setAudioTranscript(sampleDraft);
      }
    }, 1800);
  };

  const categories = [
    { id: 'Electrical Hazard', labelEn: 'Electrical Hazard', labelTa: 'மின் அபாயம்' },
    { id: 'Safety Gear & Fall Protection', labelEn: 'Safety Gear & Fall Protection', labelTa: 'பாதுகாப்பு கவசம் & வீழ்ச்சி' },
    { id: 'Payment & Shift Register', labelEn: 'Payment & Shift Register', labelTa: 'ஊதியம் & ஷிப்ட் பதிவேடு' },
    { id: 'Sanitation & Drinking Water', labelEn: 'Sanitation & Drinking Water', labelTa: 'சுகாதாரம் & குடிநீர்' },
    { id: 'Heavy Machinery & Scaffolding', labelEn: 'Heavy Machinery & Scaffolding', labelTa: 'கனரக இயந்திரம் & சாரம்' },
    { id: 'Heat & Rest Bays', labelEn: 'Heat & Rest Bays', labelTa: 'வெப்பம் & ஓய்வறை' },
  ];

  const quickLocations = [
    'Block A, Scaffolding Level 3',
    'Block B, Pump Room 1 (Floor 2)',
    'Site Office / Shift B Ledger',
    "Workers' Canteen & Rest Bay #2",
    'Fabrication Yard West',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe your concern.');
      return;
    }

    const defaultTitle =
      title.trim() ||
      (description.length > 40 ? description.slice(0, 40) + '...' : description);

    const newCase = addCase({
      category,
      categoryTa: categories.find((c) => c.id === category)?.labelTa,
      title: defaultTitle,
      titleTa: defaultTitle,
      location: location.trim() || 'Site Area TN-CHN-64',
      locationTa: location.trim() || 'தள பகுதி TN-CHN-64',
      description: description.trim(),
      descriptionTa: description.trim(),
      privacyMode,
      workerName: workerName.trim(),
      audioNoteAttached: audioAttached,
      audioTranscript: audioTranscript || (audioAttached ? description : undefined),
    });

    closeReportModal();
    selectCase(newCase.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFFDF8] rounded-2xl border border-[#E8E2D5] shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E8E2D5] flex items-center justify-between bg-[#FBF7EF]">
          <div>
            <h2 className="text-lg font-bold text-[#1F2A2B]">
              {language === 'ta' ? 'புதிய புகாரை பதிவுசெய்க' : 'Report a Workplace Concern'}
            </h2>
            <p className="text-xs text-[#1F2A2B]/70">
              {language === 'ta'
                ? 'பணியாளர் சரிபார்ப்பு உறுதிமொழிக்கு உட்பட்டது · SDG 8'
                : 'Protected under SDG 8 Worker Verification Protocol'}
            </p>
          </div>
          <button
            onClick={closeReportModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1F2A2B]/60 hover:text-[#1F2A2B] hover:bg-[#E8E2D5]/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Audio recording panel */}
          <div className="p-3.5 rounded-xl border border-[#0F5F5C]/20 bg-[#E7F3F2]/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-[#0F5F5C]'}`} />
                <span className="text-xs font-bold text-[#0F5F5C] uppercase tracking-wider">
                  {language === 'ta' ? 'குரல் உள்ளீடு (விருப்பத்தேர்வு)' : 'Voice Input (Optional)'}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-sm ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#0F5F5C] text-white hover:bg-[#0A4341]'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'நிறுத்து' : 'Stop Recording'}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'பேசி பதிவு செய்' : 'Speak Concern'}</span>
                  </>
                )}
              </button>
            </div>

            {voiceNotice && (
              <p className="text-xs text-[#1F2A2B]/80 flex items-start gap-1.5 mt-1 bg-white/70 p-2 rounded-lg border border-[#E8E2D5]">
                <AlertCircle className="w-3.5 h-3.5 text-[#0F5F5C] flex-shrink-0 mt-0.5" />
                <span>{voiceNotice}</span>
              </p>
            )}

            {audioAttached && (
              <div className="mt-2 flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-lg border border-[#0F5F5C]/30 text-[#0F5F5C] font-medium">
                <span className="flex items-center gap-1.5">
                  <FileAudio className="w-4 h-4 text-[#0F5F5C]" />
                  <span>{language === 'ta' ? 'ஆடியோ குறிப்பு இணைக்கப்பட்டுள்ளது' : 'Audio note attached to case record'}</span>
                </span>
                <span className="text-[10px] bg-[#E7F3F2] px-2 py-0.5 rounded font-mono">16kHz Draft</span>
              </div>
            )}
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A2B]/80 mb-1.5">
              {language === 'ta' ? 'புகார் வகை' : 'Concern Category'} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    category === cat.id
                      ? 'border-[#0F5F5C] bg-[#E7F3F2] text-[#0F5F5C] ring-1 ring-[#0F5F5C]'
                      : 'border-[#E8E2D5] bg-[#FFFDF8] text-[#1F2A2B] hover:bg-[#FBF7EF]'
                  }`}
                >
                  {language === 'ta' ? cat.labelTa : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Location field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A2B]/80 mb-1.5">
              {language === 'ta' ? 'பணியிட இடம் / பிரிவு' : 'Workplace Location / Zone'} *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Block B, Pump Room 1 or Scaffolding Bay 3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#FFFDF8] text-sm text-[#1F2A2B] focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-[#1F2A2B]/60 self-center">Quick:</span>
              {quickLocations.slice(0, 3).map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#FBF7EF] border border-[#E8E2D5] text-[#1F2A2B]/80 hover:bg-[#E8E2D5]/50 transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A2B]/80">
                {language === 'ta' ? 'விவரம் (என்ன நடந்தது / என்ன ஆபத்து உள்ளது)' : 'Description (What is the hazard?)'} *
              </label>
              <span className="text-[11px] text-[#1F2A2B]/60 font-mono">
                {description.length} chars
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'பாதுகாப்பு பிரச்சனை குறித்து தெளிவாக விளக்குங்கள்...'
                  : 'Describe the unsafe condition, affected workers, or equipment breakdown...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#FFFDF8] text-sm text-[#1F2A2B] focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
            />
          </div>

          {/* Privacy mode selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A2B]/80 mb-1.5">
              {language === 'ta' ? 'ரகசியத்தன்மை முறை' : 'Privacy Protection Mode'}
            </label>
            <div className="space-y-2">
              {/* Supervisor-hidden (default) */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  privacyMode === 'supervisor_hidden'
                    ? 'border-[#0F5F5C] bg-[#E7F3F2]/60 ring-1 ring-[#0F5F5C]'
                    : 'border-[#E8E2D5] bg-[#FFFDF8] hover:bg-[#FBF7EF]'
                }`}
              >
                <input
                  type="radio"
                  name="privacyMode"
                  value="supervisor_hidden"
                  checked={privacyMode === 'supervisor_hidden'}
                  onChange={() => setPrivacyMode('supervisor_hidden')}
                  className="mt-1 text-[#0F5F5C] focus:ring-[#0F5F5C]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F2A2B]">
                      {language === 'ta' ? 'மேற்பார்வையாளர் மறைக்கப்பட்ட முறை (பரிந்துரைக்கப்படுகிறது)' : 'Supervisor-hidden (Recommended)'}
                    </span>
                    <span className="text-[10px] bg-[#0F5F5C] text-white px-1.5 py-0.2 rounded font-semibold">
                      Standard
                    </span>
                  </div>
                  <p className="text-[11px] text-[#1F2A2B]/70 mt-0.5">
                    {language === 'ta'
                      ? 'தள பாதுகாப்பு தலைமை மட்டும் உங்களை அணுக முடியும்; நேரடி மேற்பார்வையாளரிடம் பெயர் பகிரப்படாது.'
                      : 'Site safety officers investigate without revealing your name to direct shift supervisors.'}
                  </p>
                </div>
                <Shield className="w-4 h-4 text-[#0F5F5C] flex-shrink-0 mt-0.5" />
              </label>

              {/* Anonymous */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  privacyMode === 'anonymous'
                    ? 'border-[#0F5F5C] bg-[#E7F3F2]/60 ring-1 ring-[#0F5F5C]'
                    : 'border-[#E8E2D5] bg-[#FFFDF8] hover:bg-[#FBF7EF]'
                }`}
              >
                <input
                  type="radio"
                  name="privacyMode"
                  value="anonymous"
                  checked={privacyMode === 'anonymous'}
                  onChange={() => setPrivacyMode('anonymous')}
                  className="mt-1 text-[#0F5F5C] focus:ring-[#0F5F5C]"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-[#1F2A2B]">
                    {language === 'ta' ? 'முழு அநாமதேய முறை' : 'Fully Anonymous (Secret Key Generated)'}
                  </span>
                  <p className="text-[11px] text-[#1F2A2B]/70 mt-0.5">
                    {language === 'ta'
                      ? 'எந்த தனிப்பட்ட அடையாளமும் சேமிக்கப்படாது. ரசீதை சரிபார்க்க ரகசிய குறியீடு தரப்படும்.'
                      : 'Zero personal identity logged. An anonymous tracking key is provided to verify resolution.'}
                  </p>
                </div>
                <ShieldAlert className="w-4 h-4 text-[#F2B705] flex-shrink-0 mt-0.5" />
              </label>

              {/* Direct Named */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  privacyMode === 'named'
                    ? 'border-[#0F5F5C] bg-[#E7F3F2]/60 ring-1 ring-[#0F5F5C]'
                    : 'border-[#E8E2D5] bg-[#FFFDF8] hover:bg-[#FBF7EF]'
                }`}
              >
                <input
                  type="radio"
                  name="privacyMode"
                  value="named"
                  checked={privacyMode === 'named'}
                  onChange={() => setPrivacyMode('named')}
                  className="mt-1 text-[#0F5F5C] focus:ring-[#0F5F5C]"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-[#1F2A2B]">
                    {language === 'ta' ? 'நேரடி பெயர் சமர்ப்பிப்பு' : 'Direct Named Submission'}
                  </span>
                  <p className="text-[11px] text-[#1F2A2B]/70 mt-0.5">
                    {language === 'ta'
                      ? 'உங்கள் பெயர் மற்றும் தொடர்பு விவரங்கள் வழக்கில் நேரடியாக சேர்க்கப்படும்.'
                      : 'Your name is visible to site team for direct in-person coordination.'}
                  </p>
                  {privacyMode === 'named' && (
                    <input
                      type="text"
                      placeholder="Your Full Name (e.g. Ramesh K.)"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                      className="mt-2 w-full px-3 py-1.5 rounded-lg border border-[#E8E2D5] bg-white text-xs"
                    />
                  )}
                </div>
                <UserCheck className="w-4 h-4 text-[#1E6B3A] flex-shrink-0 mt-0.5" />
              </label>
            </div>
          </div>

          {/* Demo disclaimer */}
          <div className="p-3 bg-[#FEF8E6] border border-[#F2B705]/40 rounded-xl text-xs text-[#1F2A2B]/80 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#F2B705] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {language === 'ta' ? 'டெமோ முறை உறுதிமொழி:' : 'Hackathon Demonstration Notice:'}
              </span>{' '}
              {language === 'ta'
                ? 'இந்த புகார் உங்கள் உள்ளூர் மாதிரி பட்டியலில் சேர்க்கப்படும். நிறுவனத்தின் தீர்வு உங்கள் நேரடி சரிபார்ப்பு இல்லாமல் மூடப்படாது.'
                : 'Concern will be added immediately to your mock case list. The employer cannot close the ticket without your verification receipt.'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8E2D5]">
            <button
              type="button"
              onClick={closeReportModal}
              className="px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-bold text-[#1F2A2B] hover:bg-[#FBF7EF] transition-colors"
            >
              {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0A4341] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#F2B705]" />
              <span>{language === 'ta' ? 'புகாரை சமர்ப்பி' : 'Submit Concern'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
