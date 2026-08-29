# Caption Queue — independent verification 6 handoff

## Outcome

**FAIL — release blocked.** Candidate `6c9615909cde7cf65ed0ab28a0c83ed8ed05c820` was tested locally and at <https://photo-metadata-queue.sociobot.in/> on 2026-08-29 UTC. The live deployment matches the candidate build byte-for-byte, so this is not a deployment-only failure.

Full evidence: `.factory/verification-6.md`.

## Release-blocking defects

1. **High — paid license fails open.** If first verification receives a network error or real API `429`, any pasted string activates Field edition with no valid cached verdict. The real API test returned `429`, `Retry-After: 4`; the live UI then showed **Field edition is active**.
2. **Major, claims-contract blocker.** All 13 exact claim commands pass, but the tagged offline claim tests only demo rather than demo plus real saved data; the Field edition test opens batch edit without proving it changes records; and stronger README claims are not completely represented in `.factory/claims.json`.

## Verification summary

- Clean checkout and exact candidate confirmed.
- `npm ci`: passed, 60 packages, 0 audit vulnerabilities.
- All 13 `.factory/claims.json` commands: passed individually from the clean clone.
- `npm test`: 14/14 passed.
- `npm run typecheck`: passed. No lint script exists.
- `npm run build`: passed; `dist/` produced.
- `npm run test:e2e`: 21/21 passed.
- Local and live `npm run verify:url`: passed desktop and 390 px checks.
- `npm run test:live`: all 20 artifacts match live bytes.
- Independent normal, boundary, malformed-input, recovery, direct-write, cross-browser backup, 26-record batch/undo, and 100-record import checks passed.
- Free workflow request log was same-origin only. Security headers and cache policy passed.
- Live PWA offline reload and waiting-worker update state passed.
- Product-unlock endpoint allowance observed: 30 accepted requests; request 31 returned `429` with `Retry-After: 4`.
- Lighthouse live mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.5 s, CLS 0, TBT 60 ms, transfer 136 KiB.
- JS 43,819 bytes; CSS 20,046 bytes; no fonts; hero images 72,452/32,228 bytes.

## Reproduce the primary defect

1. Open the live root page in a clean context.
2. Choose **View pricing** and paste any text as a license.
3. Make the verify request fail (offline, network abort, or after the endpoint returns 429).
4. Choose **Verify license**.
5. Observe **Field edition** and **Field edition is active**, despite no valid verdict.

Repair `src/license.ts` so only a cached valid verdict can be used optimistically. A first-time verification failure must stay locked and offer retry. Add invalid/network/429 tests, complete the claim coverage, then rebuild, deploy, and request verification again.
