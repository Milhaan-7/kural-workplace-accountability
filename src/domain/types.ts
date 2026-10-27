export type CaseStatus =
  | 'submitted'
  | 'in_progress'
  | 'resolution_proposed'
  | 'confirmed_by_worker'
  | 'disputed'
  | 'closed_unconfirmed';

export type PrivacyMode = 'named' | 'supervisor_hidden' | 'anonymous';

export interface TimelineEvent {
  id: string;
  title: string;
  titleTa?: string;
  description: string;
  descriptionTa?: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  icon: 'report' | 'review' | 'action' | 'resolution' | 'confirmed' | 'dispute';
  attachment?: {
    type: 'photo' | 'audio' | 'document';
    title: string;
    subtitle: string;
    imageUrl?: string;
  };
}

export interface ProposedResolution {
  summary: string;
  summaryTa?: string;
  proposedBy: string;
  proposedAt: string;
  photoProofTitle?: string;
  photoProofSubtitle?: string;
}

export interface VerificationReceipt {
  confirmedAt: string;
  confirmedBy: string;
  verificationCode: string;
  notes?: string;
}

export interface CaseItem {
  id: string;
  caseRef: string;
  category: string;
  categoryTa?: string;
  title: string;
  titleTa?: string;
  location: string;
  locationTa?: string;
  reportedAt: string;
  updatedAt: string;
  status: CaseStatus;
  privacyMode: PrivacyMode;
  workerName?: string;
  anonymousKey?: string;
  description: string;
  descriptionTa?: string;
  audioNoteAttached?: boolean;
  audioTranscript?: string;
  proposedResolution?: ProposedResolution;
  verificationReceipt?: VerificationReceipt;
  timeline: TimelineEvent[];
}
