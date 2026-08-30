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

## Deploy and prove the release

```sh
npm ci
npm test
npm run typecheck
npm run build
git push origin main
# Deploy dist/ to the production static app.
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
```

`test:live` is the identity proof. It fails unless the live static artifact, source checkout, and public `main` reference identify the same commit.

## Known gaps and next steps

The original SHA `98b01d0d50cb144d87e008865bd13a967205814f` cannot be repaired because it was never available from the remote. This repair creates and publishes a new, independently verifiable candidate. The remaining final step is deployment and the live identity check recorded above.
