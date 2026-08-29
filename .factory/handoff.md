# Caption Queue — polish round 1 handoff

## Outcome

**PASS — repaired, pushed, deployed, and cold-verified.** All 24 findings from `.factory/review-1.md` are closed. No earlier review or polish report existed. The product remains a static offline-first PWA with its botanical field-guide visual system intact.

Implementation commit `469df1d37ae35ff2f487745f0663a1312272ef53` and evidence commit `59881542ea8e52339c061a297d83520f15d98501` are pushed to `origin/main`. Azure Static Web Apps deployment `ac9bb780-b427-49ee-993f-b985b7d7fc85` succeeded at <https://photo-metadata-queue.sociobot.in/>.

## What changed

- Fixed mobile Back/Forward restoration with manual, per-entry scroll coordinates and focus that does not move the viewport.
- Added `original-files-unchanged` and `no-generated-captions` claims with real browser tests.
- Rebuilt the 404 document with the standard shell, metadata, legal links, mobile reflow, focus, and product styling.
- Rewrote all 20 recorded interface/README terminology and grammar findings in plain photographer language.
- Preserved direct `/demo` and `?demo=1` entry, separate `demo:caption-queue` storage, reset, discard, and offline behavior.
- Updated the service-worker cache to `caption-queue-v4`, the copy audit, claims catalog, README, and catalog description.
- Added regression coverage for history state, 404 structure/accessibility, singular/plural status, reviewed labels, README terminology, and the two safety claims.

The finding-by-finding evidence map is in `.factory/polish-1.md`. Screenshots are in `.factory/evidence-polish-1/`.

## Verification evidence

Final clean-clone checks ran from `/tmp/caption-queue-final-6u3yvN` at evidence commit `5988154`:

| Check | Result |
| --- | --- |
| Install and dependency audit | `npm ci` passed with 60 packages and 0 vulnerabilities. `npm audit --audit-level=high` also passed. |
| Unit/integration | `npm test` passed 16/16 tests in four files. |
| Type/build | `npm run typecheck` passed. `npm run build` produced `dist/index.html`. |
| Full browser/PWA suite | `npm run test:e2e -- --reporter=line` passed 37/37 tests. |
| Exact claim commands | Every command in `.factory/claims.json` ran separately and passed 19/19; each selected exactly one tagged test. |
| Accessibility/mobile | Local and live `verify:url` passed two viewports on every app route. Axe found zero serious/critical findings, including on the 390 px 404. Touch targets and 200% text reflow passed. |
| Privacy/safety | Free demo traffic stayed on the product origin. Original fixture hashes and filenames survived import plus every export path. Empty captions stayed empty with no model request. |
| Demo/offline | One-click and `?demo=1` entry, three records, separate database, reset, discard, local persistence, offline demo/real reload, and service-worker update passed. |
| Routing/metadata | Route titles, canonical/OG descriptions, History API focus/scroll, deep links, legal links, and the HTTP 404 shell passed. |
| Live artifact | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` matched all 20 artifacts and verified headers, caching, manifest MIME, rewrites, and HTTP 404. |
| Live Lighthouse 12.8.2 | Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0. |

Build sizes: JavaScript 46,170 B raw / 15.65 kB gzip; CSS 20,602 B raw / 5.29 kB gzip; mobile hero 32,228 B.

Deployed hashes:

- `dist/index.html`: `6c0c061c2a1ee391dc7d27a658fd2671af4fac998736208c2be54ca4041d7321`
- `dist/assets/index-BtbOnIRR.js`: `9c3a8410bdf74b30b0d5bfa94255daa98230c3a96c6c1b6c142f706ac90f6bad`
- `dist/assets/index-CP7PjjS0.css`: `4b659223205c212d56a2d76dde21f9ca29a3fb47bfe5fea0bbb800500f7bba50`
- `dist/sw.js`: `23cc6343186915bd2d19c399be93011f35754981481c7aefc53a4f85a175ad6b`

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm audit --audit-level=high
npm run build
npm run test:e2e -- --reporter=line
npm run preview
npm run verify:url -- http://127.0.0.1:4173/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
```

For claim-by-claim verification, run each exact `test` command in `.factory/claims.json` from a fresh clone.

## Known gaps and next steps

No known product, copy, claim, accessibility, privacy, offline, mobile, routing, metadata, 404, performance, or deployment finding remains. Independent factory re-review is the only next step.
