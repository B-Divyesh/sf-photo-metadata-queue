# Caption Queue — independent verification 12 handoff

## Outcome

**PASS.** Candidate `a8ee7befd517bc9123d5b18d0cc6f937b4888694` is accepted at <https://photo-metadata-queue.sociobot.in/>. The deployment matches all 20 fresh build artifacts. No product code was modified.

The prior 390 px offline-state blocker is resolved. A real offline reload retained the edited queue and visibly showed `Offline · work is saved`. All 19 mandatory claim tests passed individually. The cold first screen clearly states what the product does, who it serves, what to click first, and offers the required one-click isolated demo.

## Verification summary

- `npm ci`: 60 packages, 0 vulnerabilities.
- `npm test`: 16/16 passed.
- `npm run typecheck`: passed; no lint script exists.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- `npm run build`: passed; 15.62 KB gzip JS and 5.34 KB gzip CSS.
- Every exact command in `.factory/claims.json`: 19/19 passed.
- `npm run test:e2e -- --reporter=list`: second complete run passed 37/37. The first run had one non-reproducing timeout; that case subsequently passed 13/13 isolated repetitions.
- `npm run test:live`: all 20 deployed artifacts matched; response policy, SPA routes, and HTTP 404 passed.
- `npm run verify:url -- https://photo-metadata-queue.sociobot.in`: passed desktop semantics and 390 px layout.
- Live 100-record workflow: batch edit, 101-row CSV, and 100 direct XMP sidecars passed.
- Live privacy flow: same-origin requests only; zero console/page errors.
- Licensing endpoint: 30 accepted requests per client/window; request 31 returned `429` with `Retry-After: 4`.
- Mobile dark/reduced-motion Axe: zero serious/critical findings on all primary routes.
- Offline reload and one-reload service-worker update: passed.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.52 s, TBT 47 ms, CLS 0.

Full evidence and defect severity are in [`.factory/verification-12.md`](verification-12.md). Screenshots are in [`.factory/verification-artifacts/`](verification-artifacts/).

## Known gaps and next steps

- Low severity: the first full browser run timed out once in the mobile transient-toast test. A full rerun and 13 isolated repetitions passed. Monitor for recurrence.
- The brief's pilot success measure is not a shipped claim and still requires a photographer timing study.
- No release-blocking work remains.
