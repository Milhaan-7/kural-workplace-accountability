import { CaseItem, CaseStatus, TimelineEvent } from './types';

/**
 * Single source of truth for worker confirmation.
 * Never treats employer proposed resolutions or administrative closures as worker-confirmed.
 */
export function isWorkerConfirmed(status: CaseStatus): boolean {
  return status === 'confirmed_by_worker';
}

export function canWorkerVerify(status: CaseStatus): boolean {
  return status === 'resolution_proposed';
}

export function generateVerificationCode(caseRef: string): string {
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const cleanRef = caseRef.replace(/^KUR-/, '');
  return `VR-${cleanRef}-${randomHex}`;
}

export function generateCaseRef(existingCases: { caseRef: string }[]): string {
  const year = new Date().getFullYear();
  const prefix = `KUR-${year}-`;
  let maxSeq = 42;

  for (const c of existingCases) {
    if (c.caseRef.startsWith(prefix)) {
      const num = parseInt(c.caseRef.slice(prefix.length), 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `${prefix}${nextSeq}`;
}

export function confirmCaseResolution(
  caseItem: CaseItem,
  notes?: string
): CaseItem {
  const now = new Date();
  const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const code = generateVerificationCode(caseItem.caseRef);

  const confirmationEvent: TimelineEvent = {
    id: `event-${Date.now()}`,
    title: 'Worker confirmed resolution',
    titleTa: 'பணியாளர் தீர்வை உறுதிசெய்தார்',
    description: notes
      ? `Worker inspected the site and confirmed issue resolved. Note: "${notes}"`
      : 'Worker inspected the site and confirmed with own eyes that the hazard has been eliminated.',
    descriptionTa: 'பணியாளர் ஆய்வு செய்து பிரச்சனை சரிசெய்யப்பட்டதை உறுதிசெய்தார்.',
    actor: caseItem.privacyMode === 'anonymous' ? 'Anonymous Worker' : 'Reporting Worker',
    actorRole: 'Verification Sign-off',
    timestamp: formattedDate,
    icon: 'confirmed',
  };

  return {
    ...caseItem,
    status: 'confirmed_by_worker',
    updatedAt: 'Just now',
    verificationReceipt: {
      confirmedAt: formattedDate,
      confirmedBy: caseItem.privacyMode === 'anonymous' ? 'Anonymous Key Holder' : 'Reporting Worker',
      verificationCode: code,
      notes: notes || undefined,
    },
    timeline: [...caseItem.timeline, confirmationEvent],
  };
}

export function disputeCaseResolution(
  caseItem: CaseItem,
  reason: string
): CaseItem {
  const now = new Date();
  const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const disputeEvent: TimelineEvent = {
    id: `event-${Date.now()}`,
    title: 'Resolution disputed by worker',
    titleTa: 'பணியாளரால் தீர்வு மறுக்கப்பட்டது',
    description: `Worker reported that the issue is still not fixed on site: "${reason}". Ticket returned to active site handling.`,
    descriptionTa: `சிக்கல் இன்னும் தீர்க்கப்படவில்லை என்று பணியாளர் தெரிவித்தார்: "${reason}". செயலில் உள்ள பராமரிப்புக்கு அனுப்பப்பட்டது.`,
    actor: caseItem.privacyMode === 'anonymous' ? 'Anonymous Worker' : 'Reporting Worker',
    actorRole: 'On-site Re-inspection',
    timestamp: formattedDate,
    icon: 'dispute',
  };

  return {
    ...caseItem,
    status: 'disputed',
    updatedAt: 'Just now',
    timeline: [...caseItem.timeline, disputeEvent],
  };
}
