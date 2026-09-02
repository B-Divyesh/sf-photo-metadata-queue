# Copy audit

Audited 2026-09-02 after adversarial review 3. Counts treat numbers, abbreviations, paths, and hyphenated terms as one word. Every landing-page line is at most 22 words. No line uses a banned marketing word.

## Landing page

| Visible copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Caption Queue | 2 | Pass; wordmark |
| Demo | 1 | Pass; destination link |
| Privacy | 1 | Pass; destination link |
| Online · data stays local | 4 | Pass; separates connection state from storage location |
| Change color theme | 3 | Pass; accessible control name |
| View pricing | 2 | Pass |
| Local photo metadata queue | 4 | Pass |
| Caption large shoots without changing originals | 6 | Pass; `original-files-unchanged` claim |
| For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files. | 20 | Pass |
| Try it with sample data | 5 | Pass; `demo-sandbox` claim |
| Opens three edited sample records. | 5 | Pass |
| Choose photo folder | 3 | Pass |
| Import CSV | 2 | Pass |
| Restore backup | 2 | Pass |
| Runs offline after the first visit. | 6 | Pass; `offline-reload` claim |
| Photos and metadata stay on this device. | 7 | Pass; `local-privacy` claim |
| Free for 25 records per shoot. | 6 | Pass; `free-limit` claim |
| Field edition costs $24 once. | 5 | Pass; `field-edition` claim |
| How it works | 3 | Pass |
| Move one photo at a time | 6 | Pass |
| Keep one shoot in view. | 5 | Pass |
| Reuse its terms, check every record, then export metadata files for your photo library. | 14 | Pass |
| Gather | 1 | Pass |
| Start from a photo folder or a CSV file. | 9 | Pass |
| Annotate | 1 | Pass |
| Move photo by photo with shared terms and caption tokens. | 10 | Pass |
| Export | 1 | Pass |
| Review the metadata file and export one `.xmp` file for each photo. | 12 | Pass |
| Privacy and limits | 3 | Pass |
| Your files stay under your control | 6 | Pass |
| Caption Queue stores the workspace in this browser. | 8 | Pass; `local-persistence` claim |
| It sends nothing during the free metadata workflow. | 8 | Pass; `local-privacy` claim |
| It writes separate `.xmp` metadata files. | 6 | Pass; `xmp-export` claim |
| It does not change photo files or generate captions. | 9 | Pass; `original-files-unchanged` and `no-generated-captions` claims |
| Read the privacy details | 4 | Pass |
| One-time license | 2 | Pass |
| Use the free queue or remove its limit | 8 | Pass |
| $24 once | 2 | Pass; `field-edition` claim |
| Field edition removes the 25-record import limit, adds saved shoots, and enables batch edit patterns. | 15 | Pass; `field-edition` claim |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 | Pass; `free-core-exports` claim |
| View Field edition | 3 | Pass |
| Photo metadata stays on this device during the free workflow. | 10 | Pass; `local-privacy` claim |
| Terms | 1 | Pass; destination link |
| Source | 1 | Pass; destination link |
| Caption Queue v1.0.0 · Built by Param Factory · Field-desk image generated for this product. | 15 | Pass |

### Pricing dialog

| Visible copy | Words | Result |
| --- | ---: | --- |
| Field edition | 2 | Pass |
| Handle shoots above 25 records | 5 | Pass |
| Close | 1 | Pass; accessible control name |
| $24 one-time purchase | 3 | Pass; `field-edition` claim |
| No record limit per imported shoot | 6 | Pass; `field-edition` claim |
| More than one saved shoot | 5 | Pass; `field-edition` claim |
| Batch title, caption, and keyword patterns | 6 | Pass; `field-edition` claim |
| The free edition handles one active shoot with up to 25 records. | 12 | Pass; `free-limit` claim |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 | Pass; `free-core-exports` claim |
| Buy Field edition | 3 | Pass |
| Have a license? | 3 | Pass |
| Paste it here | 3 | Pass |
| Verify license | 2 | Pass |
| Sociobot/Dodo handles payment and refunds. | 5 | Pass; concrete payment wording |
| A refund cancels the license. | 5 | Pass; concrete refund result |
| See terms and privacy. | 4 | Pass |

## README review

The introduction defines `.xmp` metadata files before using the shorter `.xmp` file term. The audience text names a photo library or archive instead of “DAM.” User-facing capabilities say “browser database” and “this browser” instead of exposing IndexedDB. Folder writing is described by its result, and the privacy sentence says the workflow contacts only this site's servers. The free-export sentence names the three tested export types. The CSV schema maps to `csv-import-schema`; the four tokens map to `metadata-tools`. The deployment routing and 404 behavior are two sentences; neither exceeds 22 words.

The demo helper “Creator, copyright, and location fields.” has five words. It names the visible fields without the unexplained “IPTC” acronym.

## Terminology

| Concept | One term |
| --- | --- |
| Source media | photo |
| One queued unit | record |
| Group of records | shoot |
| Ordered work | queue |
| Exported companion file | define once as `.xmp` metadata file, then `.xmp` file |
| Isolated sample experience | demo |
| Paid tier | Field edition |

The botanical field-guide identity remains in color, type, paper texture, fern marks, and layout. Task labels use photographers' plain terms.
