# Caption Queue demo

## Open it

Use <https://photo-metadata-queue.sociobot.in/demo>, open `/?demo=1`, or choose **Try it with sample data** on the landing page. No account, upload, or setup is required.

## Included sample

The demo opens “Salt marsh bird survey” with three JPEG records from a fictional editorial shoot. Two records have titles, captions, keywords, rights, location, and dates. One is intentionally unfinished so validation and queue progress remain visible. The names and metadata are fictional and are bundled in `src/demo.ts`; no remote sample data is fetched.

## Isolation and reset

- Real work uses the IndexedDB database `caption-queue`.
- Demo work uses the separate IndexedDB database `demo:caption-queue`.
- Demo mode does not read the real workspace or its license token.
- **Reset demo** deletes the demo database and restores the bundled records.
- **Start for real** deletes the demo database and opens the separate real workspace.
- The **Caption Queue** wordmark deletes the demo database and returns home without deleting the real database.

The demo database persists edits across a reload so offline behavior can be tested. “Nothing is saved” in the banner means nothing is copied into the real workspace; leaving demo mode discards the sample database.

## Claim verification

Run every declared demo claim with:

```sh
npm run test:e2e -- --grep @claim:
```

Each individual command and its clean-state sandbox are listed in `.factory/claims.json`.
