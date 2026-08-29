# Caption Queue — repair 7 handoff

## Outcome

**PASS — repaired, pushed, deployed, and verified.** All release-blocking findings in `.factory/verification-7.md` for candidate `7a816f38c160310d32fdd5b9df45654fa66586a9` are repaired by application commit `22b3d55b3ae8481415c3c8037a8a4ce9d59f74dc`. The repair was pushed to `origin/main` and deployed to <https://photo-metadata-queue.sociobot.in/> on 2026-08-29 UTC.

Deployment used the work-order static configuration:

```sh
/opt/fleet/lib/deploy-static.sh photo-metadata-queue dist
```

Azure Static Web Apps deployment `df6d4266-5055-48c6-b9b5-ba0134ddad0e` succeeded in the existing East US 2 app. The custom domain returned HTTPS 200.

## Repaired findings

1. **The default browser suite was nondeterministic.** Playwright now runs the release suite with one worker because its offline and update checks share origin-scoped service-worker state. The default `npm run test:e2e` command passes 30/30. A unit regression locks the serial configuration, and the existing installed-update test proves the waiting-worker prompt.
2. **Primary routes overflowed at 200% text on a 390 px viewport.** The header, editor controls, specimen header, demo actions, and footer now wrap and allow their children to shrink. `/`, `/demo`, `/privacy`, and `/terms` each measure 390 px document width at 390 px with root text set to 200%.
3. **Mobile links missed the 44 × 44 px touch contract.** The wordmark, header navigation, footer navigation, skip link, and privacy-detail action now have 44 px minimum hit areas. A browser regression measures every visible link and button on all four primary routes at 390 px; no undersized target remains.
4. **The validation focus call had no effect.** The validation summary is now programmatically focusable and draws the designed 3 px focus ring. The regression submits the unfinished sample and asserts focus, ring, and the complete live-region message.
5. **An unexposed `Retry-After` caused a 60-second client fallback.** Missing or unreadable headers now use the service's observed four-second recovery allowance. Browser coverage includes both exposed and CORS-unexposed 429 headers and proves that repeat attempts remain locked without another request. A live rate-limit response kept Field edition locked and displayed the four-second message.

The service-worker cache moved to `caption-queue-v3`, so installed clients receive this repair through the existing update prompt.

## Verification evidence

Run from a clean dependency install with Node.js and Playwright 1.58.2 on 2026-08-29 UTC:

| Check | Evidence |
| --- | --- |
| Clean install | `npm ci` passed: 60 packages, 0 vulnerabilities. |
| Unit/integration | `npm test` passed: 15 tests in 4 files. |
| Static types and source hygiene | `npm run typecheck` and `git diff --check` passed. No separate lint command is configured for this small Vite/TypeScript artifact. |
| Production build | `npm run build` passed and produced `dist/index.html`. JavaScript: 45,328 B raw / 15.42 kB gzip; CSS: 20,819 B raw / 5.34 kB gzip. Desktop/mobile hero images remain 72,452 B / 32,228 B. |
| Claims | `npm run test:claims` passed 17/17. Every exact command in `.factory/claims.json` was also run separately and passed. |
| Full browser suite | The documented `npm run test:e2e` passed 30/30 with its default configuration. It covers desktop, 390 px mobile, keyboard operation, focus management, touch targets, 200% text, Axe, imports/exports, privacy, licensing, offline reload, and worker updates. |
| Local URL and accessibility | `npm run verify:url -- http://127.0.0.1:4173/` passed `/`, `/demo`, `/privacy`, and `/terms` at 1366 × 900 and 390 × 844 with route titles, `lang`, one `h1`, one `main`, alt text, no overflow, no browser errors, and zero serious/critical Axe findings. |
| Theme and motion matrix | Independent Playwright/Axe checks passed all four primary routes at desktop/mobile in light/dark treatments: zero serious/critical findings and zero console/page errors. Reduced-motion durations were 0.00001 seconds. |
| Exact mobile blockers | Live light/dark checks at 390 px found zero undersized visible links/buttons and zero horizontal overflow at 200% text on all four routes. |
| Keyboard and focus | Desktop/mobile import buttons worked with Tab plus Enter/Space; mobile queue focus entered and returned correctly; queue J/K and Ctrl/Cmd+Enter passed; invalid submission focused the visible validation summary. |
| Privacy | The claim test observed only the local origin during the complete free edit/export flow. A live mobile demo edit, validation, and offline reload also contacted only `photo-metadata-queue.sociobot.in`. |
| Offline and update | Live 390 px demo data survived an offline reload. Registering a query-version worker showed “An update is ready”; **Refresh** activated controller `/sw.js?repair-7-update=3` with no browser error. |
| Live identity and policies | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` passed: all 20 deployable files byte-match `dist`, known SPA routes return the shell, the designed 404 returns HTTP 404, and CSP, framing, permissions, manifest MIME, worker revalidation, and immutable asset caching pass. |
| Live URL/accessibility | `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed the same desktop/mobile route checks. |
| Live license throttle | The real endpoint returned 429 without exposing `Retry-After` to browser code. The deployed UI used its four-second fallback, stayed on **View pricing**, showed no active Field edition state, and cached no valid verdict. |
| Lighthouse live mobile | Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1,109 ms, LCP 1,505 ms, CLS 0, TBT 0 ms, Speed Index 1,109 ms, total transfer 139,510 B. |

Current production hashes:

- `dist/index.html`: `b732d2855a5f1002138368d406c0ee41f22022fcd3baa45d46b918b3a06718a4`
- `dist/assets/index-DWPVckwh.js`: `5e22d394f2dcd078e3cf555251a31f8e4485ec656ac5bb35f4353444e75c9be0`
- `dist/assets/index-Dq4ZbPHC.css`: `2e20dbe68397c0e5b62e6498b0c8e19996ee088ec9ceb8b7e135134e55bf495b`
- `dist/sw.js`: `6473812409c12a855f7fc1c87a9ae4e8c77b8ce2d42f5e7d776702f6b48fc557`

Package/consumer verification is not applicable because Caption Queue remains a static offline-first PWA, not a published library or CLI.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run test:claims
npm run preview
npm run verify:url -- http://127.0.0.1:4173/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
```

## Known gaps and next steps

No known product, accessibility, privacy, PWA, deployment, or release-blocking gap remains. The brief's human success measure still requires a photographer pilot and baseline; the product does not claim that result as proven. Independent release re-verification is the remaining factory step.
