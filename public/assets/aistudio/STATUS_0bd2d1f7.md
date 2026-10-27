# Kural — Implementation Status

Last updated: Stage 1 (foundation scaffold). See "Verification" for what has and has not been checked.

Kural is a multilingual worker-concern and workplace-accountability platform aligned with UN SDG 8 (Decent Work and Economic Growth). Initial industries: construction and hospitals/healthcare, in one configurable app.

**Core differentiator: the Resolution Receipt.** A proposed resolution is never the same as a worker-confirmed resolution. Cases closed without worker confirmation stay explicitly unconfirmed (`closed_unconfirmed`) and are never counted as confirmed (`isWorkerConfirmed()` in `src/domain/status.ts` is the single source of truth).

## Stages

| Stage | Scope | State |
|---|---|---|
| 0 | Inspect existing project | Done. No project existed; starting from zero was approved. |
| 1 | Foundation: tokens, shared components, routes, i18n scaffold, domain types, typed API, mock API, demo indicator, this document | **Files created. Install, build and full type-check NOT yet run** (no network in the authoring sandbox). |
| 2 | W3 Worker Home and W11 Case Details and Timeline, from approved Stitch output | Blocked: waiting for Stitch designs. Current `WorkerHomePage` and `CaseDetailPage` are labelled placeholders. |
| 3 | Verify: build, type-check, navigation, responsive layouts, long EN/TA text, flow works without voice | Pending |

## What exists (Stage 1)

- Vite + React 18 + TypeScript (strict) + Tailwind CSS 3 + React Router 6 + react-i18next + TanStack Query + Lucide.
- Approved colour tokens in `tailwind.config.ts`. System font stack (no web fonts downloaded, for low-end devices); Tamil fallbacks listed.
- Shared components in `src/components/ui`: Typography (Heading, Text), Button, StatusBadge, Field (TextField, TextArea, Select, ChoiceCard), CaseRef, TimelineItem, PrivacyNotice, States (Loading, Error, Empty).
- Shell in `src/components/layout`: DemoBanner, Wordmark ("Kural"), LanguageSelector (native names; English default), BottomNav.
- Domain model in `src/domain`: concern, categories, case status, timeline event (with `worker_visible` / `internal` visibility), proposed resolution, worker response (confirm/dispute), reporting mode (named / name_hidden / anonymous), industry configuration (construction, healthcare).
- Typed API contract `KuralApi` in `src/api/types.ts`; mock implementation in `src/api/mockApi.ts`; seed data in `src/api/mockData.ts`; query hooks in `src/api/queries.ts`.
- Anonymous access credential (`AnonymousAccessCredential`) is a separate type and value from `caseRef`.
- Demo mode is visible on every screen (banner). Mock data is in-memory and resets on reload.

## Known limitations / honest notes

- Tamil strings in `src/i18n/locales/ta.json` are an **unreviewed draft** and must be reviewed by a fluent speaker before use (P1: complete reviewed English/Tamil content).
- The mock API is not authentication, authorization, persistence, or anonymity. Do not present it as such.
- Dependency versions in `package.json` were chosen without registry access and have not been resolved or installed.
- Voice recognition, dictation, audio recording and AI transcription are NOT implemented and must not be implied in the UI.
- Placeholder pages exist only to prove routing, i18n and the API boundary; they are not the approved W3/W11 designs.

## Roadmap (preserved in full)

### P0 — Core workflow
- [ ] Worker concern submission
- [ ] Employer inbox and case handling
- [ ] Assignment and action recording
- [ ] Case timeline (domain + placeholder timeline item exist)
- [ ] Resolution Receipt
- [ ] Worker confirmation and dispute (domain + mock API methods exist; no UI yet)
- [ ] Dashboard based on relevant records, once backend persistence exists
- [ ] Construction and hospital configurations (config + categories exist; UI not built)
- [ ] Anonymous reporting (mode, credential type and honest privacy copy exist; flow not built)
- [ ] English/Tamil localization foundation (scaffold exists; Tamil unreviewed)
- [ ] Privacy-conscious aggregate design

### P1 — Extended features
- [ ] Complete reviewed English/Tamil content
- [ ] Shift ledger
- [ ] Configurable example pay/overtime calculations
- [ ] Pay discrepancy workflow
- [ ] Workplace-pattern analytics with server-side minimum-group-size suppression
- [ ] Optional photo attachments
- [ ] Optional audio attachments and browser dictation
- [ ] Minimal People and Access screen

### P2 — Advanced features
- [ ] AI-assisted transcription
- [ ] Translation
- [ ] AI-assisted category/severity suggestions (always labelled as suggestions)
- [ ] Offline submission queue, if reliably feasible
- [ ] Skills and training records
- [ ] Additional languages
- [ ] Push/SMS notifications, where feasible

### Later backend phase (not started, needs explicit approval)
Node/Express API, Supabase PostgreSQL, Google Cloud Run. Must include server-side authentication and authorization, organization-level isolation, role-specific access, anonymous credentials separate from case references, secure credential storage and rate limiting, separation of worker-visible events from internal notes, and server-side aggregate suppression. No service-role keys or server secrets in browser code. Privacy limits must be communicated honestly; complete anonymity is never promised.

## Verification log

See the Stage 1 report. Update this section with actual command output each time checks run.
