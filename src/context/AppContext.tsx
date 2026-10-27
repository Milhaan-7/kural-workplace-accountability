import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseItem, PrivacyMode } from '../domain/types';
import { initialMockCases } from '../domain/mockData';
import { confirmCaseResolution, disputeCaseResolution, generateCaseRef } from '../domain/rules';
import { Language, translations } from '../i18n/translations';

interface NewCaseInput {
  category: string;
  categoryTa?: string;
  title: string;
  titleTa?: string;
  location: string;
  locationTa?: string;
  description: string;
  descriptionTa?: string;
  privacyMode: PrivacyMode;
  workerName?: string;
  audioNoteAttached?: boolean;
  audioTranscript?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  cases: CaseItem[];
  selectedCaseId: string | null;
  selectedCase: CaseItem | null;
  selectCase: (id: string | null) => void;
  addCase: (input: NewCaseInput) => CaseItem;
  confirmResolution: (id: string, notes?: string) => void;
  disputeResolution: (id: string, reason: string) => void;
  isReportModalOpen: boolean;
  isAudioModeModal: boolean;
  openReportModal: (audioMode?: boolean) => void;
  closeReportModal: () => void;
  isCheckModalOpen: boolean;
  openCheckModal: () => void;
  closeCheckModal: () => void;
  isHowItWorksOpen: boolean;
  openHowItWorks: () => void;
  closeHowItWorks: () => void;
  isPrivacyPolicyOpen: boolean;
  openPrivacyPolicy: () => void;
  closePrivacyPolicy: () => void;
  searchAndOpenCase: (refOrKey: string) => boolean;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kural_demo_language');
    return saved === 'ta' ? 'ta' : 'en';
  });
  const [cases, setCases] = useState<CaseItem[]>(() => {
    const saved = localStorage.getItem('kural_demo_cases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialMockCases;
      }
    }
    return initialMockCases;
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAudioModeModal, setIsAudioModeModal] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kural_demo_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('kural_demo_cases', JSON.stringify(cases));
  }, [cases]);

  const t = translations[language];

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || null;

  const selectCase = (id: string | null) => {
    setSelectedCaseId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addCase = (input: NewCaseInput): CaseItem => {
    const newRef = generateCaseRef(cases);
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    let anonKey: string | undefined;
    if (input.privacyMode === 'anonymous') {
      anonKey = `AK-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    }

    const newCase: CaseItem = {
      id: `case-${Date.now()}`,
      caseRef: newRef,
      category: input.category,
      categoryTa: input.categoryTa || input.category,
      title: input.title,
      titleTa: input.titleTa || input.title,
      location: input.location,
      locationTa: input.locationTa || input.location,
      reportedAt: formattedDate,
      updatedAt: 'Just now',
      status: 'submitted',
      privacyMode: input.privacyMode,
      workerName: input.privacyMode === 'named' ? input.workerName || 'Worker' : undefined,
      anonymousKey: anonKey,
      description: input.description,
      descriptionTa: input.descriptionTa || input.description,
      audioNoteAttached: input.audioNoteAttached || false,
      audioTranscript: input.audioTranscript,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          title: 'You reported this concern',
          titleTa: 'நீங்கள் இந்த புகாரை பதிவு செய்தீர்கள்',
          description: input.privacyMode === 'anonymous'
            ? `Anonymous concern logged with secret key ${anonKey}. Dispatched to safety queue.`
            : 'Concern logged and dispatched to site safety officer.',
          descriptionTa: 'புகார் பதிவு செய்யப்பட்டு தள பாதுகாப்பு அதிகாரிக்கு அனுப்பப்பட்டது.',
          actor: input.privacyMode === 'anonymous' ? 'Anonymous Keyholder' : (input.workerName || 'Reporting Worker'),
          actorRole: 'Submitter',
          timestamp: formattedDate,
          icon: 'report',
          attachment: input.audioNoteAttached ? {
            type: 'audio',
            title: 'Audio Voice Note Attached',
            subtitle: 'Voice recording draft attached for review',
          } : undefined,
        },
      ],
    };

    setCases((prev) => [newCase, ...prev]);
    return newCase;
  };

  const confirmResolution = (id: string, notes?: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return confirmCaseResolution(c, notes);
        }
        return c;
      })
    );
  };

  const disputeResolution = (id: string, reason: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return disputeCaseResolution(c, reason);
        }
        return c;
      })
    );
  };

  const searchAndOpenCase = (query: string): boolean => {
    const clean = query.trim().toUpperCase();
    const found = cases.find(
      (c) =>
        c.caseRef.toUpperCase() === clean ||
        (c.anonymousKey && c.anonymousKey.toUpperCase() === clean)
    );
    if (found) {
      setSelectedCaseId(found.id);
      setIsCheckModalOpen(false);
      return true;
    }
    return false;
  };

  const resetDemoData = () => {
    localStorage.removeItem('kural_demo_cases');
    setCases(initialMockCases);
    setSelectedCaseId(null);
  };

  const openReportModal = (audioMode = false) => {
    setIsAudioModeModal(audioMode);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setIsAudioModeModal(false);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        cases,
        selectedCaseId,
        selectedCase,
        selectCase,
        addCase,
        confirmResolution,
        disputeResolution,
        isReportModalOpen,
        isAudioModeModal,
        openReportModal,
        closeReportModal,
        isCheckModalOpen,
        openCheckModal: () => setIsCheckModalOpen(true),
        closeCheckModal: () => setIsCheckModalOpen(false),
        isHowItWorksOpen,
        openHowItWorks: () => setIsHowItWorksOpen(true),
        closeHowItWorks: () => setIsHowItWorksOpen(false),
        isPrivacyPolicyOpen,
        openPrivacyPolicy: () => setIsPrivacyPolicyOpen(true),
        closePrivacyPolicy: () => setIsPrivacyPolicyOpen(false),
        searchAndOpenCase,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
