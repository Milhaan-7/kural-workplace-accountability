import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isWorkerConfirmed,
  canWorkerVerify,
  confirmCaseResolution,
  disputeCaseResolution,
  generateCaseRef,
  generateVerificationCode,
} from './rules';
import { CaseItem } from './types';

const baseMockCase: CaseItem = {
  id: 'case-1',
  caseRef: 'KUR-2026-0042',
  category: 'Electrical Hazard',
  title: 'Water leaking near electrical panel',
  location: 'Block B, Site 1',
  reportedAt: '12 Oct, 10:24 AM',
  updatedAt: '1 day ago',
  status: 'resolution_proposed',
  privacyMode: 'supervisor_hidden',
  description: 'Water leaking near electrical panel conduits.',
  timeline: [
    {
      id: 'e1',
      title: 'You reported this concern',
      description: 'Submitted',
      actor: 'Worker',
      actorRole: 'Submitter',
      timestamp: '12 Oct, 10:24 AM',
      icon: 'report',
    },
  ],
};

test('isWorkerConfirmed strictly verifies worker confirmation', () => {
  assert.equal(isWorkerConfirmed('confirmed_by_worker'), true);
  assert.equal(isWorkerConfirmed('resolution_proposed'), false, 'Proposed resolution is NOT worker-confirmed');
  assert.equal(isWorkerConfirmed('submitted'), false);
  assert.equal(isWorkerConfirmed('in_progress'), false);
  assert.equal(isWorkerConfirmed('closed_unconfirmed'), false);
  assert.equal(isWorkerConfirmed('disputed'), false);
});

test('canWorkerVerify checks if resolution is proposed', () => {
  assert.equal(canWorkerVerify('resolution_proposed'), true);
  assert.equal(canWorkerVerify('confirmed_by_worker'), false);
  assert.equal(canWorkerVerify('submitted'), false);
});

test('confirmCaseResolution generates receipt and updates timeline', () => {
  const resolved = confirmCaseResolution(baseMockCase, 'Inspected and verified dry');
  assert.equal(resolved.status, 'confirmed_by_worker');
  assert.ok(resolved.verificationReceipt);
  assert.ok(resolved.verificationReceipt.verificationCode.startsWith('VR-2026-0042-'));
  assert.equal(resolved.verificationReceipt.notes, 'Inspected and verified dry');
  assert.equal(resolved.timeline.length, 2);
  assert.equal(resolved.timeline[1].icon, 'confirmed');
});

test('disputeCaseResolution sets status to disputed and appends event', () => {
  const disputed = disputeCaseResolution(baseMockCase, 'Floor is still wet from roof leak');
  assert.equal(disputed.status, 'disputed');
  assert.equal(disputed.timeline.length, 2);
  assert.equal(disputed.timeline[1].icon, 'dispute');
  assert.ok(disputed.timeline[1].description.includes('Floor is still wet'));
});

test('generateCaseRef increments sequence correctly', () => {
  const existing = [{ caseRef: 'KUR-2026-0042' }, { caseRef: 'KUR-2026-0043' }];
  const newRef = generateCaseRef(existing);
  assert.equal(newRef, 'KUR-2026-0044');
});
