# Caption Queue — repair 11 handoff

## Outcome

**Repaired the verification-13 release-provenance blocker.** The report found no product defect. Its only blocker was that the requested SHA did not exist on `origin`, even though a different build matched the live PWA.

Every production build now emits `dist/release.json`. It contains the full Git commit SHA of the source that produced the artifact. Live verification requires three equal values: that marker, the checked-out source, and `origin/main`. A release cannot pass artifact parity while identifying a missing or different candidate.

## Repair details

- Added deterministic build provenance with schema version `1` and a full 40-character Git SHA.
- Added `npm run verify:release` for local marker/source validation.
- Strengthened `npm run test:live` to require a published `main` SHA and the live `/release.json` marker before comparing every deployed artifact.
- Added regression coverage that writes, validates, and rejects mismatched release markers.
- Documented the post-deploy identity check in the README.

## Verification

- Clean install: `npm ci` — 60 packages installed; `npm audit --audit-level=high` reported 0 vulnerabilities.
- Unit/integration: `npm test` — 18/18 passed across 5 files, including two provenance regression tests.
- Type/lint: `npm run typecheck` passed; `npm run lint --if-present` completed (no lint script is configured).
- Production build: `npm run build` passed and produced `dist/` with `release.json`.
- Local provenance: `npm run verify:release` passed.
- Browser/PWA: `npm run test:e2e -- --reporter=list` — 38/38 passed, covering desktop/mobile, keyboard, Axe, offline reload, and worker update.
- Mandatory claims: all 20 exact commands from `.factory/claims.json` passed separately after the clean install.
- Local and live accessibility: `npm run verify:url` passed at desktop and 390 px. It checks route titles, language, landmarks, one h1, image alt text, horizontal overflow, console errors, and serious/critical Axe results.
- Live workflow: `npm run test:polish-live -- https://photo-metadata-queue.sociobot.in` passed. It covers the first-read/demo flow, keyboard history, free exports, dark/reduced-motion accessibility, service-worker offline reload, and no unexpected console errors.
- Live identity: `npm run test:live -- https://photo-metadata-queue.sociobot.in/` passed. The production artifact has 21 files; every one byte-matches `dist/`, and the release marker, source, and public `main` agree.
- Lighthouse 12.8.2 on the live site: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,359 ms and CLS 0.

## Deploy and prove the release

```sh
npm ci
npm test
npm run typecheck
npm run build
git push origin main
# Deploy `dist/` to the `sf-photo-metadata-queue` production static app.
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
```

`test:live` is the identity proof. It fails unless the live static artifact, source checkout, and public `main` reference identify the same commit.

## Deployment

The repair was pushed to `main` and deployed to the `sf-photo-metadata-queue` production static app at <https://photo-metadata-queue.sociobot.in/>. The deployed `/release.json` is the auditable release identity; the live verifier requires it to match both the tested Git source and `origin/main`.

## Known gaps

The original SHA `98b01d0d50cb144d87e008865bd13a967205814f` cannot be made available retroactively. This repair publishes a new, independently verifiable candidate and leaves no known product or release-provenance gap.
