# Caption Queue

Caption Queue is a local metadata queue for photographers handling large shoots. It turns a photo folder or CSV file into a keyboard-friendly review queue, then exports well-formed XMP sidecars without changing image files.

Live product: <https://photo-metadata-queue.sociobot.in>

One-click sample: <https://photo-metadata-queue.sociobot.in/demo>

## Who it is for

Photographers, editors, and archive teams who need focused metadata review before a DAM handoff. The free edition accepts 25 records per shoot. The optional $24 Field edition is a one-time license that removes the import limit, adds saved shoots, and enables batch edit patterns. XMP writing, backups, accessibility, and privacy remain free.

## Capabilities

- Try three realistic records at `/demo`; this uses a separate `demo:caption-queue` IndexedDB database.
- Import an image folder or a CSV with a required `filename` column.
- Save metadata locally in IndexedDB and reopen the queue offline after the first visit.
- Navigate with the queue, J/K keys, or Previous/Next; save and advance with Cmd/Ctrl+Enter.
- Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens.
- Preview well-formed, escaped XMP and validate required editorial fields before marking a record ready.
- Write `.xmp` sidecars through the File System Access API where supported, with browser downloads as a portable fallback.
- Export metadata CSV and JSON workspace backups; restore a JSON backup on another browser.

Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`.

## Develop and verify

Requires Node.js 20+.

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run preview # keep this running for the next command
npm run verify:url -- http://127.0.0.1:4173/
```

`npm run build` is the factory work-order build command. It creates the static deployment at `dist/`, with `dist/index.html` at its root. Browser tests use Playwright 1.58.2 and the preinstalled Chromium build.

## Privacy and data ownership

There are no analytics, trackers, third-party fonts, or third-party runtime scripts. The free metadata workflow makes only same-origin requests. Only a pasted paid-license token is sent to the Sociobot licensing endpoint for verification. See `/privacy` and `/terms` in the app for the full policies.

## Deployment

Deploy the contents of `dist/` to a static host. The included Azure Static Web Apps configuration rewrites `/demo`, `/privacy`, and `/terms` to the app and serves the designed 404 page for unknown paths. Documents and `sw.js` revalidate, while `/assets/*` uses one-year immutable caching. Serve HTTPS for service workers, installability, and directory writing. Do not configure secrets in the client bundle.

Every visitor-facing product promise and its clean demo test are listed in [`.factory/claims.json`](.factory/claims.json). Demo isolation and reset behavior are documented in [`.factory/demo.md`](.factory/demo.md).

## License

MIT. Generated artwork provenance is recorded in [`.factory/design.md`](.factory/design.md).
