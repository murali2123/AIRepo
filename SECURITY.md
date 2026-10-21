# Security and child-privacy baseline

This product handles photographs and potentially voices of children. Treat those assets as highly sensitive personal data. This document is a product-security baseline, not legal advice.

## Non-negotiable controls before production

- Adult-only account creation. Do not invite children to register or submit data.
- Obtain verifiable parental consent before collecting a child’s photo, video, voice or other covered personal information.
- Collect a nickname and age band, not a legal name, date of birth, school, address, precise location or social handle.
- Make photos optional. Offer non-identifying illustrated avatars as the default.
- Strip EXIF/IPTC/XMP metadata before persistence, including GPS and device identifiers.
- Decode and re-encode uploads; validate actual content, not only extensions. Set strict type, dimension and size limits; scan in quarantine.
- Use isolated object storage, per-object encryption keys and short-lived signed URLs. Never make source media public.
- Keep source media separate from generated outputs. Default to deletion immediately after the approved output is generated; allow at most a short, explicit revision window.
- Contractually prohibit processors from training on, retaining or independently using customer media. Maintain an approved subprocessor register.
- Send providers only the minimum asset and prompt required for the current job. Use unique opaque job IDs.
- Confirm provider deletion and record an auditable deletion receipt/tombstone without retaining the deleted media.
- Do not create face embeddings, recognition profiles, emotion inference or identity matching.
- No public gallery, social discovery, behavioral advertising or cross-site tracking.
- Sharing must be an explicit adult action. Links expire, are unguessable, are revocable and use `noindex` headers.
- Parent privacy center: see data, download outputs, revoke links, delete a project/account and withdraw consent.
- Moderate prompts and outputs for sexual, violent, hateful, exploitative or identifying content; fail safely to human review without exposing child media broadly.
- Rate limits, CSRF protection, strict CSP, secure cookies, MFA for administrators, least-privilege RBAC, secret rotation and tamper-evident audit logs.
- Logs and analytics must exclude names, prompt text, signed URLs, media, tokens and raw identifiers.
- Tested incident-response and breach-notification plan, disaster recovery, dependency scanning and annual penetration testing.

## Threats to model

- An unauthorized adult uploads a child’s image.
- A share link leaks or is indexed.
- A provider retains media or uses it for training.
- Malicious polyglot/image payloads reach a decoder.
- Prompt injection causes disclosure across tenants.
- An administrator or support agent accesses media without a valid support reason.
- Deleted media remains in queues, caches, backups or provider systems.
- Generated content depicts a child in an unsafe or misleading context.

## Required reviews

Complete a data-protection impact assessment, threat model, vendor security/privacy review, child-safety review and jurisdiction-specific legal review before accepting real media.

