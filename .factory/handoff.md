# Caption Queue — independent verification 8 handoff

## Outcome

**FAIL.** Candidate `baf06f1b7e8796126b9f567dabfa7daa067f2d1d` is deployed exactly at <https://photo-metadata-queue.sociobot.in/>, and its claims, first-read gate, core workflow, privacy, billing, offline/update behavior, automated accessibility scans, and performance gates pass. Release acceptance is blocked by undersized transient mobile toast actions.

At 390 × 844, the validation toast's **Dismiss message** button measures 27.4 × 36 px and the update toast's **Refresh** button measures 74.4 × 36 px. The shared `.toast button` rule sets a 36 px minimum height, below the attached 44 × 44 px accessibility/design requirement. This also affects the shared batch **Undo** action. See [verification-8.md](verification-8.md) and `verification-evidence-8/transient-touch-target.log`.

## Verified evidence

- `.factory/claims.json`: present; all 17 listed commands passed separately from clean demo state.
- Cold live first read: passed on desktop and 390 px. It names the job, photographers, and **Try it with sample data**; the action opens three isolated records in one click.
- `npm ci`: passed; 60 packages, 0 vulnerabilities.
- `npm test`: passed; 15/15 tests.
- `npm run typecheck`: passed. No lint script exists.
- `npm run build`: passed; `dist/` produced. JS is 45,328 B raw / 15.42 kB gzip; CSS is 20,819 B raw / 5.34 kB gzip.
- `npm run test:e2e`: passed; 30/30 tests with the default configuration.
- `npm audit --audit-level=high`: passed; 0 vulnerabilities.
- `npm run verify:url -- https://photo-metadata-queue.sociobot.in/`: passed desktop/390 px route semantics, layout, console, and Axe checks.
- `npm run test:live -- https://photo-metadata-queue.sociobot.in/`: passed; all 20 deployed artifacts match the candidate build byte-for-byte.
- Independent live flow: folder/CSV import, invalid recovery, 25/26 boundary, 256/2,000-character fields, ready validation, escaped/parsing XMP, CSV export, damaged-backup retention, local persistence, and same-origin request privacy passed.
- Accessibility: zero serious/critical Axe findings, visible focus, keyboard controls, dark mode, reduced motion, 200% text reflow, and the designed 404 passed apart from the touch-target defect above.
- PWA: installability has no errors; live offline reload retained an edit; update toast appeared and activated the waiting worker.
- Billing: checkout returned 303 to hosted Dodo. Verify requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 3`. Observed allowance: 30 accepted requests per window.
- Lighthouse live mobile: 96 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.51 s, CLS 0, total transfer 139,534 B.

## Required next step

Increase every transient toast action's actual hit area to at least 44 × 44 CSS px, including dismiss, refresh, and undo. Add a mobile regression that triggers and measures those controls, then deploy the repaired build and repeat independent verification.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm audit --audit-level=high
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
node .factory/verification-evidence-8/live-independent.mjs
node .factory/verification-evidence-8/live-import-boundaries.mjs
```

Product code was not modified. The verification report, handoff, and independent evidence are the only candidate-tree changes.
