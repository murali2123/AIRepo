# Production build prompt: Little Lantern

Use this prompt with a software engineering agent to turn the prototype into a production application. Do not relax its privacy gates to accelerate launch.

---

Build **Little Lantern**, a premium, parent-directed AI storytelling studio. It has two creation modes:

1. **Personal Story Studio** — an authenticated adult supplies a child’s nickname, age band, interests, lesson, language and optionally one authorized photo. The system produces a safe script, editable storyboard, narrated animated video and captions.
2. **Tamil Wisdom Studio** — an adult or educator selects a Thirukkural number, Tamil word, moral or cultural theme. The system produces a short child-friendly story in English, Tamil or bilingual form, with accurate source text, transliteration, meaning, narration and captions. A reviewer must verify Tamil text before publishing.

The audience is parents and educators; do not design direct child accounts. The experience should feel warm, cinematic and handcrafted—not like a generic AI dashboard. Preserve the visual direction in the prototype: warm paper tones, forest green, coral, marigold, editorial serif headings, rounded illustrated worlds and generous whitespace. Meet WCAG 2.2 AA, include keyboard and screen-reader support, respect reduced motion and design responsive layouts.

## Core journeys

- Marketing home with the two studios, sample stories using fictional illustrations only, pricing, FAQ and Parent Privacy Promise.
- Adult signup/sign-in with email verification and optional passkey/MFA.
- Guardian consent flow that clearly states data collected, purpose, processors, retention and deletion. Capture consent version, method, timestamp and evidence. Re-consent when purposes materially change.
- Creation wizard: mode → safe inputs → optional photo → privacy choice → AI outline → editable script → scene storyboard → final approval → queued generation → private result.
- Photo-free path must be equally prominent and use a generated, non-identifying character.
- Parent dashboard with project status, output download, expiring share links, retention countdown, deletion and consent history.
- Admin tools with least-privilege roles, moderation queue, vendor health, abuse cases and audit events. Media access requires a reason and produces an audit event.

## Privacy architecture

- Data minimization: nickname and age band only. Actively block/warn on legal names, school, address, exact birthday, phone, social account and precise location in free text.
- Do not collect data directly from children. Require authenticated adult action and implement a legally reviewed verifiable-parental-consent mechanism where applicable.
- Treat child images and voices as sensitive. Never sell them, use them for advertising, public galleries, model training, face recognition, biometric profiling or emotion inference.
- Before persistence: verify MIME by magic bytes, limit to JPG/PNG/WebP, enforce 10 MB and safe dimension bounds, quarantine, malware scan, strip all metadata, fully decode and re-encode. Reject animated and malformed files.
- Store quarantined, sanitized and generated assets in separate private buckets. Encrypt with KMS; use per-tenant/object access boundaries and short-lived signed URLs. The application server must authorize every asset request.
- Default source-photo retention: delete immediately after successful generation. Optional revision window: 24 hours, selected explicitly. Outputs default to 30 days unless purchased for longer storage. Run deletion workers continuously.
- Deletion must cover primary storage, derivatives, queues, CDN, caches and processors. Backups use short bounded retention and crypto-erasure. Keep only non-identifying deletion receipts.
- Each AI/media vendor must support a no-training/no-human-review mode, bounded retention and deletion API or contractual deletion SLA. Maintain a subprocessor page and region information.
- No third-party ad pixels. Use privacy-preserving first-party analytics with IP truncation and no prompt/media capture. Disable session replay on all authenticated and upload pages.
- Generated share links are off by default, 128+ bits of entropy, expire in 24 hours by default, can be revoked and return `X-Robots-Tag: noindex, nofollow, noarchive`.

## Security engineering

- Recommended stack: Next.js + TypeScript web app, PostgreSQL with tenant-scoped queries/RLS, private S3-compatible object storage, Redis-backed job queue, isolated workers and FFmpeg/Remotion composition. Put each model/provider behind an adapter.
- Use an OIDC provider with adult account verification. Secure, HttpOnly, SameSite cookies; CSRF protection; rotating sessions; MFA for admins.
- Validate inputs server-side with schemas. Parameterized queries only. Apply per-account/IP/job rate limits, abuse throttles and spend limits.
- CSP without `unsafe-eval`, HSTS, frame denial, restrictive Permissions Policy, Referrer Policy and MIME sniffing protection.
- Secrets come from a managed secret store, never client bundles, logs or Git. Separate dev/stage/prod accounts and keys.
- Job workers receive scoped, expiring capability tokens for one job and one object. Prevent cross-tenant object references and prompt/context leakage.
- Moderate input text and output frames/audio. Block sexualization or nudity involving minors, grooming, self-harm encouragement, dangerous acts, hateful content and realistic violence. Unsafe jobs fail closed and preserve the minimum evidence needed for an access-controlled safety review.
- Immutable audit events for consent, media access, share creation, vendor dispatch, generation, download and deletion. Never log media, prompts, names, signed URLs or authentication tokens.
- Automated SAST, dependency and secret scanning; signed builds/SBOM; protected branches; reviewed migrations; backups and restore drills; incident runbooks.

## AI pipeline

1. Normalize inputs and remove prohibited identifiers.
2. Generate an age-appropriate outline using structured JSON.
3. Run child-safety and cultural-accuracy checks.
4. Let the adult edit and explicitly approve the script/storyboard.
5. Generate visual shots using a consistent fictional style. If a photo is supplied, use only an approved provider mode and avoid photorealistic identity replication; prefer a stylized transformation.
6. Generate narration and captions. Child voice cloning is forbidden. Use licensed synthetic adult/character voices.
7. Moderate frames, transcript and audio before composition.
8. Compose a 9:16 short and optional 16:9 version; include Kural number and exact Tamil text for Wisdom stories.
9. Deliver privately, start deletion timers and show the parent a clear retention countdown.

## Minimum data model

`users`, `adult_verifications`, `consents`, `children_profiles` (nickname/age band only), `projects`, `story_inputs`, `storyboards`, `assets`, `generation_jobs`, `vendor_dispatches`, `moderation_decisions`, `share_links`, `deletion_requests`, `deletion_receipts`, `audit_events`.

Every child-linked row must include tenant ownership, purpose, retention deadline and deletion state. Do not use child names in object keys or analytics identifiers.

## API boundaries

- `POST /api/projects` create a draft.
- `POST /api/consents` capture versioned adult consent.
- `POST /api/uploads/authorize` validate eligibility and return a one-use quarantine URL.
- `POST /api/projects/:id/storyboard` generate outline after consent checks.
- `POST /api/projects/:id/approve` freeze an approved storyboard.
- `POST /api/projects/:id/render` enqueue a bounded job.
- `GET /api/projects/:id/status` return safe progress only.
- `POST /api/projects/:id/shares` create an expiring adult-authorized link.
- `DELETE /api/projects/:id` initiate cascading deletion and return a tracking ID.
- `GET /api/privacy/export` and `DELETE /api/privacy/account` support parent rights.

All endpoints require authorization, tenant checks, idempotency where relevant and structured audit events.

## Launch gates

- No real child media until the DPIA, threat model, COPPA/applicable privacy review, vendor contracts, retention tests and incident exercises are complete.
- Unit/integration/E2E tests for consent denial, cross-tenant isolation, malformed uploads, expired links, provider failure and end-to-end deletion.
- Security review and independent penetration test have no unresolved critical/high findings.
- A child-development/cultural reviewer approves safety patterns; a qualified Tamil reviewer approves Kural source content.
- Privacy policy and direct parent notice precisely match actual behavior and subprocessors.

Deliver the application in small auditable milestones. Start with photo-free stories, then bilingual Wisdom stories, and enable optional child photos only after every launch gate passes.

---

## Authoritative starting points

- FTC COPPA overview and operator duties: https://www.ftc.gov/legal-library/browse/statutes/childrens-online-privacy-protection-act
- FTC COPPA FAQ (including photos, voices, consent and retention): https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- UK ICO Children’s Code: https://ico.org.uk/for-the-public/the-children-s-code-and-children-s-online-privacy/
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

Obtain qualified legal advice for every market served; these sources and this prompt do not constitute legal advice.

