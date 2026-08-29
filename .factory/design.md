# Caption Queue visual thesis

## Direction: working botanical field guide

Caption Queue treats a large shoot like a field collection: each photograph is a specimen to identify, describe, classify, and press into a durable record. The interface borrows the quiet precision of a botanist's desk—uncoated paper, ruled annotations, accession numbers, ink stamps, and restrained plant forms—without becoming nostalgic or ornamental. This fits the product because metadata work is patient classification, and the queue should make progress feel physical and legible.

## Palette

Light is the primary treatment; a complete dark treatment follows the system preference.

| Token | Light | Dark | Use |
|---|---|---|---|
| paper | `#f3efe3` | `#161b18` | page ground |
| surface | `#fffdf5` | `#202722` | working sheets |
| ink | `#1d2a22` | `#edf2e8` | primary text |
| muted | `#59655d` | `#b8c2ba` | secondary text |
| fern | `#285b42` | `#86c79f` | primary action, active specimen |
| fern contrast | `#ffffff` | `#102017` | action text |
| ochre | `#9a5b16` | `#e8ad61` | cautions, pending marks |
| berry | `#9a3e3e` | `#f09a96` | errors and destructive actions |
| rule | `#c9c3b2` | `#475149` | dividers and input outlines |

All text and interactive outlines target WCAG AA (4.5:1 text, 3:1 UI components). Status never relies on color: it also uses words, icons, and counts.

## Type and spacing

- Display/editorial: Georgia, Cambria, and the platform serif stack. Its bracketed forms evoke printed guide plates while staying local and zero-byte.
- Utility/body: Inter-like system stack (`ui-sans-serif`, `system-ui`, Segoe UI). Clear at dense queue sizes, with tabular figures for counts.
- Scale: 14, 16, 18, 24, 34, and clamp(40–64) px. Body never drops below 16 px.
- Spacing uses a 4 px base with 8, 12, 16, 24, 32, 48, and 64 px steps. Reading measure is capped at 68 characters.
- Corners are 2–14 px based on function: squared specimen rows and softly rounded controls. Shadows resemble stacked paper, never floating glass.

## Interaction grammar

- The queue is a vertical specimen index. The selected item is marked by a fern-colored left rule and accession number.
- Editing moves left-to-right on desktop (specimen list → annotation sheet) and stacks on phones (current specimen → fields → queue drawer).
- Every change updates a plain-language XMP preview and validation ledger immediately. `Cmd/Ctrl + Enter` saves and advances; arrow keys move the queue when focus is outside inputs.
- Completion is a stamped state (“Ready”) with both icon and label. Bulk changes always preview their affected count and can be undone.
- Empty, import error, offline, and update states each say what happened and name the next action.

## Motion policy

UI transitions last 160–220 ms and use only opacity or transform. A selected row settles a few pixels into place; the completion stamp scales once from its origin. There is no ambient or looping movement. With `prefers-reduced-motion: reduce`, transitions and scroll behavior become instant and the stamp appears without scaling.

## Asset plan and provenance

The hero is an original editorial still life: archival photo sleeves, handwritten-free specimen cards, fern fronds, pencil, and a blank contact sheet on a warm worktable. It clarifies the metaphor of classification without pretending the app performs AI analysis. No people, brands, logos, readable text, or existing characters.

Prompt sheet:

- Use case: `stylized-concept`
- Subject/world: a top-down working botanist-photographer desk, archival photo sleeves, blank specimen labels, one pressed fern, loupe, graphite pencil, contact-sheet frames
- Materials: fibrous uncoated paper, glass, aged brass, dark green book cloth
- Light/lens: soft north-window light, top-down 50 mm editorial still life, generous shadow detail
- Palette words: herbarium cream, fern ink, dried ochre, muted berry, charcoal
- Composition: quiet asymmetry, useful negative space, no interface mockup
- Negative list: no readable text, watermark, logos, hands, people, cameras, flowers, fantasy glow, gradients, plastic 3D, or misleading AI imagery

Generated with the factory Azure image deployment (`factory-image`) on 2026-08-28. The selected output is original to this product and shipped as responsive WebP (71 KB desktop, 32 KB mobile), with a PNG source and prompt sidecar in `assets/src/`. The 1200 × 630 social card added on 2026-08-29 is a center crop of that same original source. Application icons and small line illustrations are hand-authored SVG and MIT-licensed with the repository.
