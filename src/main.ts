import './styles.css';
import { loadData, saveData } from './db';
import { csvToItems, escapeCsv } from './csv';
import { emptyMetadata, type AppData, type Metadata, type QueueItem, type Shoot } from './types';
import { makeXmp, renderTokens, sidecarName, validateMetadata } from './xmp';
import { captureLicense, checkoutUrl, hasLicense, removeLicense, saveLicense, verifyLicense } from './license';

declare global {
  interface Window { showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle> }
  interface FileSystemDirectoryHandle { getFileHandle(name: string, options: { create: boolean }): Promise<FileSystemFileHandle> }
  interface FileSystemFileHandle { createWritable(): Promise<{ write(data: string): Promise<void>; close(): Promise<void> }> }
}

const app = document.querySelector<HTMLDivElement>('#app')!;
let data: AppData = await loadData();
let paid = false;
let licenseNotice = '';
let filter: 'all' | 'unfinished' | 'ready' = 'all';
let query = '';
let showQueue = false;
let undoSnapshot: QueueItem[] | null = null;
const imageUrls = new Map<string, string>();

captureLicense();
paid = hasLicense();
if (paid) verifyLicense().then((valid) => { if (!valid) licenseNotice = 'Your license is no longer active.'; paid = valid; render(); });

const e = (value: unknown) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
const activeShoot = (): Shoot | undefined => data.shoots.find((s) => s.id === data.activeShootId) ?? data.shoots[0];
const shootItems = (): QueueItem[] => data.items.filter((item) => item.shootId === activeShoot()?.id);
const activeItem = (): QueueItem | undefined => data.items.find((item) => item.id === data.activeItemId) ?? shootItems()[0];
const persist = () => saveData(data).catch(() => announce('Could not save locally. Export a backup before closing.'));
const announce = (message: string) => {
  const live = document.querySelector<HTMLElement>('#live');
  if (live) live.textContent = message;
  const previous = document.querySelector('.notice-toast'); previous?.remove();
  const notice = document.createElement('div'); notice.className = 'toast notice-toast'; notice.setAttribute('role', 'status');
  notice.innerHTML = `<span>${e(message)}</span><button aria-label="Dismiss message">×</button>`;
  document.body.append(notice); notice.querySelector('button')!.addEventListener('click', () => notice.remove());
  setTimeout(() => notice.remove(), 6000);
};

function icon(name: 'leaf' | 'check' | 'photo' | 'download' | 'plus' | 'settings' | 'queue'): string {
  const paths = {
    leaf: '<path d="M19 3C11 4 5 8 5 15c0 2 1 4 3 5 0-5 3-9 8-12-4 4-6 8-7 12 8 0 12-6 10-17Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>', photo: '<path d="M4 5h16v14H4zM4 15l4-4 4 4 2-2 6 6M15 9h.01"/>',
    download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M4 20h16"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a2 2 0 0 0 .4 2.2l.1.1-2.6 2.6-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V21h-3.6v-.2A2 2 0 0 0 9 19a2 2 0 0 0-2.2.4l-.1.1-2.6-2.6.1-.1A2 2 0 0 0 4.6 15a2 2 0 0 0-1.8-1.2H3v-3.6h.2A2 2 0 0 0 5 9a2 2 0 0 0-.4-2.2l-.1-.1 2.6-2.6.1.1A2 2 0 0 0 9 4.6a2 2 0 0 0 1.2-1.8V3h3.6v.2A2 2 0 0 0 15 5a2 2 0 0 0 2.2-.4l.1-.1 2.6 2.6-.1.1a2 2 0 0 0-.4 2.2 2 2 0 0 0 1.8 1.2h.2v3.6h-.2A2 2 0 0 0 19.4 15Z"/>',
    queue: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
}

function shell(content: string): string {
  return `<header class="topbar">
    <a class="brand" href="/" data-nav><span class="brand-mark">${icon('leaf')}</span><span>Caption Queue</span></a>
    <nav aria-label="Utility navigation">
      <span class="connection" id="connection"><span></span>${navigator.onLine ? 'Local & online' : 'Offline · work is saved'}</span>
      <button class="icon-button" id="theme-button" aria-label="Change color theme" title="Change color theme">◐</button>
      <button class="quiet-button" id="license-button">${paid ? 'Field edition' : 'Unlock'}</button>
    </nav>
  </header>
  <div id="live" class="sr-only" aria-live="polite"></div>
  ${licenseNotice ? `<div class="license-notice" role="status">${e(licenseNotice)} <button id="renew-license">View license options</button></div>` : ''}
  ${content}
  <footer><span>Private by design. Your photos never leave this device.</span><span><a href="/privacy" data-nav>Privacy</a><a href="/terms" data-nav>Terms</a><a href="https://github.com/B-Divyesh/sf-photo-metadata-queue" rel="noreferrer">Source</a></span><small>Field-desk image generated for Caption Queue.</small></footer>
  ${licenseDialog()}`;
}

function landing(): string {
  return shell(`<main id="main" class="landing">
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">A local metadata workbench</p><h1>Caption the shoot.<br><em>Keep your originals untouched.</em></h1>
        <p class="lede">Turn a folder or spreadsheet into a deliberate queue for titles, captions, keywords, and IPTC fields—then write standards-valid XMP sidecars.</p>
        <div class="hero-actions">
          <label class="primary-button" for="photo-input">${icon('photo')} Choose photo folder</label>
          <label class="secondary-button" for="csv-input">Import CSV</label>
          <label class="secondary-button" for="backup-input">Restore backup</label>
        </div>
        <input class="sr-only" id="photo-input" type="file" accept="image/*,.dng,.cr2,.cr3,.nef,.arw,.raf" multiple webkitdirectory />
        <input class="sr-only" id="csv-input" type="file" accept=".csv,text/csv" />
        <input class="sr-only" id="backup-input" type="file" accept=".json,application/json" />
        <p class="microcopy">No upload. No account. Sidecars only—original image bytes are never modified.</p>
      </div>
      <figure class="hero-plate"><picture><source media="(max-width: 680px)" srcset="/assets/field-desk-mobile.webp"><img src="/assets/field-desk.webp" width="1200" height="800" alt="A blank herbarium sheet with a fern, archival sleeves, and an empty contact sheet arranged on a wooden worktable" decoding="async" fetchpriority="high"></picture><figcaption><span>Plate 01</span> From contact sheet to catalog record</figcaption></figure>
    </section>
    <section class="workflow" aria-labelledby="workflow-title"><div><p class="eyebrow">The working method</p><h2 id="workflow-title">A queue, not another catalog</h2><p>Bring only the shoot in front of you. Reuse the words that matter, validate every record, and hand clean sidecars back to your DAM.</p></div>
      <ol><li><span>01</span><strong>Gather</strong><p>Start from an image folder or an existing CSV manifest.</p></li><li><span>02</span><strong>Annotate</strong><p>Move image by image with shared terms and smart tokens.</p></li><li><span>03</span><strong>Press</strong><p>Review the exact XML and write <code>.xmp</code> beside your files.</p></li></ol>
    </section>
  </main>`);
}

function workspace(): string {
  const shoot = activeShoot()!;
  const items = shootItems();
  const current = activeItem();
  if (!current) return landing();
  const ready = items.filter((item) => item.ready).length;
  const visible = items.filter((item) => (filter === 'all' || (filter === 'ready') === item.ready) && item.fileName.toLowerCase().includes(query.toLowerCase()));
  const position = items.findIndex((item) => item.id === current.id);
  return shell(`<main id="main" class="workbench">
    <aside class="queue-panel ${showQueue ? 'queue-open' : ''}" aria-label="Photo queue">
      <div class="shoot-heading"><div><span class="eyebrow">Current shoot</span><h1>${e(shoot.name)}</h1>${data.shoots.length > 1 ? `<label class="sr-only" for="shoot-select">Choose shoot</label><select id="shoot-select">${data.shoots.map((s) => `<option value="${e(s.id)}" ${s.id === shoot.id ? 'selected' : ''}>${e(s.name)}</option>`).join('')}</select>` : ''}</div><button class="icon-button mobile-close" id="close-queue" aria-label="Close queue">×</button></div>
      <div class="progress-row"><span>${ready} of ${items.length} ready</span><span>${Math.round(ready / items.length * 100)}%</span></div><div class="progress"><i style="width:${ready / items.length * 100}%"></i></div>
      <div class="queue-tools"><label><span class="sr-only">Search filenames</span><input id="queue-search" type="search" placeholder="Search filenames" value="${e(query)}"></label><select id="queue-filter" aria-label="Filter queue"><option value="all" ${filter === 'all' ? 'selected' : ''}>All</option><option value="unfinished" ${filter === 'unfinished' ? 'selected' : ''}>Needs work</option><option value="ready" ${filter === 'ready' ? 'selected' : ''}>Ready</option></select></div>
      <ol class="specimen-list">${visible.map((item) => queueRow(item, items.indexOf(item))).join('') || '<li class="no-results">No photographs match this filter.</li>'}</ol>
      <div class="queue-bottom"><button class="secondary-button" id="new-shoot">${icon('plus')} New shoot</button><button class="quiet-button" id="batch-button">Batch edit</button></div>
    </aside>
    <section class="editor" aria-label="Metadata editor">
      <div class="editor-bar"><button class="queue-toggle" id="queue-toggle">${icon('queue')} Queue <span>${position + 1}/${items.length}</span></button><div><button class="quiet-button" id="previous-button" ${position === 0 ? 'disabled' : ''}>← Previous</button><button class="quiet-button" id="next-button" ${position === items.length - 1 ? 'disabled' : ''}>Next →</button></div></div>
      <article class="annotation-sheet">
        <header class="specimen-header"><div class="thumb">${previewFor(current)}</div><div><p class="accession">Specimen ${String(position + 1).padStart(3, '0')} / ${String(items.length).padStart(3, '0')}</p><h2>${e(current.fileName)}</h2><p>${current.size ? formatBytes(current.size) : 'CSV record'} · ${e(current.relativePath)}</p></div><span class="status-badge ${current.ready ? 'is-ready' : ''}">${current.ready ? `${icon('check')} Ready` : 'In progress'}</span></header>
        <form id="metadata-form" novalidate>${editorFields(current, shoot)}
          <section class="validation" aria-labelledby="validation-title"><div><span class="eyebrow">Validation ledger</span><h3 id="validation-title">${validationHeading(current)}</h3></div><ul id="validation-list">${validationList(current)}</ul></section>
          <details class="xmp-preview"><summary>Inspect XMP output <span>Escaped XML</span></summary><pre><code id="xmp-code">${e(makeXmp(current))}</code></pre></details>
          <div class="editor-actions"><button type="button" class="secondary-button" id="export-one">${icon('download')} Export this XMP</button><button type="submit" class="primary-button">${current.ready ? 'Save & next' : `${icon('check')} Mark ready & next`}</button></div>
          <p class="shortcut">Keyboard: <kbd>⌘/Ctrl</kbd> + <kbd>Enter</kbd> saves and advances. <kbd>J</kbd>/<kbd>K</kbd> moves the queue.</p>
        </form>
      </article>
    </section>
    <aside class="field-notes" aria-label="Shoot tools"><section><span class="eyebrow">Vocabulary</span><h2>Field notes</h2><p>Reuse controlled terms across this shoot.</p><div class="vocab">${shoot.vocabulary.map((word) => `<button data-keyword="${e(word)}">+ ${e(word)}</button>`).join('')}</div><form id="vocab-form"><label for="vocab-input">Add a controlled term</label><div><input id="vocab-input" maxlength="60" required><button class="icon-button" aria-label="Add term">${icon('plus')}</button></div></form></section>
      <section class="export-panel"><span class="eyebrow">Sidecar press</span><h2>Write the set</h2><p>${ready === items.length ? 'Every record is marked ready.' : `${items.length - ready} record${items.length - ready === 1 ? '' : 's'} still need review.`}</p><button class="primary-button" id="export-all">${icon('download')} Write ${items.length} XMP sidecars</button><button class="quiet-button" id="export-csv">Export metadata CSV</button><button class="quiet-button" id="export-backup">Export workspace backup</button><label class="quiet-button" for="backup-input">Import workspace backup</label><input class="sr-only" id="backup-input" type="file" accept=".json,application/json"><small>Writes new <code>.xmp</code> files. Image originals are never changed.</small></section>
    </aside>
  </main>${batchDialog(shoot, items)}`);
}

function queueRow(item: QueueItem, index: number): string {
  const errors = validateMetadata(item.metadata);
  return `<li><button class="specimen-row ${item.id === activeItem()?.id ? 'active' : ''}" data-item="${e(item.id)}" aria-current="${item.id === activeItem()?.id ? 'true' : 'false'}"><span class="row-number">${String(index + 1).padStart(3, '0')}</span><span class="row-thumb">${previewFor(item)}</span><span class="row-copy"><strong>${e(item.fileName)}</strong><small>${item.ready ? 'Ready to write' : errors.length ? `${errors.length} field${errors.length === 1 ? '' : 's'} needed` : 'Review needed'}</small></span><span class="row-state" aria-label="${item.ready ? 'Ready' : 'In progress'}">${item.ready ? icon('check') : '·'}</span></button></li>`;
}

function previewFor(item: QueueItem): string {
  const src = item.thumbnail || imageUrls.get(item.id);
  return src ? `<img data-preview="${e(item.id)}" src="${e(src)}" alt="Preview of ${e(item.fileName)}">` : `<span class="file-placeholder">${icon('photo')}<small>${e(item.fileName.split('.').pop()?.toUpperCase())}</small></span>`;
}

function editorFields(item: QueueItem, shoot: Shoot): string {
  const m = item.metadata;
  return `<section class="field-section"><div class="section-heading"><span>01</span><div><h3>Describe</h3><p>The words people will read.</p></div></div><div class="fields">
    ${field('title', 'Title', m.title, 'A concise, identifying title', 256)}
    ${textarea('description', 'Caption / description', m.description, 'Who, what, where, and why—without unsupported claims.', 2000)}
    <div class="token-strip" aria-label="Caption tokens"><span>Insert token</span>${['{filename}', '{sequence}', '{shoot}', '{date}'].map((t) => `<button type="button" data-token="${t}">${t}</button>`).join('')}</div>
  </div></section>
  <section class="field-section"><div class="section-heading"><span>02</span><div><h3>Classify</h3><p>Terms for search and retrieval.</p></div></div><div class="fields"><label for="keywords">Keywords <span class="optional">separate with semicolons</span></label><input id="keywords" name="keywords" value="${e(m.keywords.join('; '))}" autocomplete="off"><div class="keyword-preview">${m.keywords.map((k) => `<span>${e(k)}<button type="button" data-remove-keyword="${e(k)}" aria-label="Remove ${e(k)}">×</button></span>`).join('') || '<small>No keywords yet</small>'}</div></div></section>
  <section class="field-section"><div class="section-heading"><span>03</span><div><h3>Credit & locate</h3><p>Portable IPTC ownership and place fields.</p></div></div><div class="fields field-grid">${field('creator', 'Creator / photographer', m.creator, '', 256)}${field('rights', 'Copyright notice', m.rights, '', 512)}${field('city', 'City', m.city, '', 128)}${field('state', 'State / province', m.state, '', 128)}${field('country', 'Country', m.country, '', 128)}<div><label for="dateCreated">Date created</label><input id="dateCreated" name="dateCreated" type="date" value="${e(m.dateCreated)}"></div></div></section>`;
}

function field(name: keyof Metadata, label: string, value: string, help = '', max = 256): string {
  return `<div><label for="${name}">${label}${help ? ` <span class="optional">${e(help)}</span>` : ''}</label><input id="${name}" name="${name}" value="${e(value)}" maxlength="${max}"></div>`;
}
function textarea(name: keyof Metadata, label: string, value: string, help: string, max: number): string {
  return `<div><label for="${name}">${label} <span class="optional">${e(help)}</span></label><textarea id="${name}" name="${name}" maxlength="${max}" rows="5">${e(value)}</textarea><small class="char-count" id="${name}-count">${value.length} / ${max}</small></div>`;
}
function validationHeading(item: QueueItem): string { const n = validateMetadata(item.metadata).length; return n ? `${n} ${n === 1 ? 'item' : 'items'} to resolve` : 'Standards ready'; }
function validationList(item: QueueItem): string { const list = validateMetadata(item.metadata); return list.length ? list.map((v) => `<li><span>○</span>${e(v)}</li>`).join('') : '<li class="valid"><span>✓</span>Required fields are present and XML-safe</li>'; }

function batchDialog(shoot: Shoot, items: QueueItem[]): string {
  return `<dialog id="batch-dialog"><form method="dialog" class="dialog-card"><header><div><span class="eyebrow">Batch annotation</span><h2>Apply to ${items.length} records</h2></div><button class="icon-button" value="cancel" aria-label="Close">×</button></header><p>Tokens render separately for each photo. Existing text is replaced; keywords are added.</p><label for="batch-title">Title pattern</label><input id="batch-title" placeholder="${e(shoot.name)} — {sequence}"><label for="batch-caption">Caption pattern</label><textarea id="batch-caption" rows="3" placeholder="Photograph from ${e(shoot.name)}."></textarea><label for="batch-keywords">Add keywords <span class="optional">semicolon separated</span></label><input id="batch-keywords"><label class="check-row"><input id="batch-unfinished" type="checkbox" checked> Only records not marked ready</label><footer><button class="quiet-button" value="cancel">Cancel</button><button class="primary-button" id="apply-batch" value="default">Apply changes</button></footer></form></dialog>`;
}

function licenseDialog(): string {
  return `<dialog id="license-dialog"><div class="dialog-card license-card"><header><div><span class="eyebrow">Field edition</span><h2>Keep large shoots moving</h2></div><button class="icon-button dialog-close" aria-label="Close">×</button></header>${paid ? `<div class="license-active">${icon('check')}<div><strong>Field edition is active</strong><p>Unlimited saved shoots and reusable batch recipes are unlocked on this device.</p></div></div><button class="danger-link" id="remove-license">Remove license from this device</button>` : `<p class="price"><strong>$24</strong> one-time purchase</p><ul><li>Unlimited saved shoots</li><li>Reusable batch patterns</li><li>Support independent development</li></ul><p>The free edition handles one active shoot with up to 25 records. XMP writing, backups, accessibility, and privacy are always included.</p><a class="primary-button" href="${checkoutUrl}">Buy Field edition</a><hr><form id="restore-form"><label for="license-token">Have a license? Paste it here</label><div><input id="license-token" autocomplete="off" required><button class="secondary-button">Verify</button></div><p id="license-message" role="status"></p></form>`}<small>Sociobot/Dodo is the merchant of record. Refunds are handled there and revoke the license. See <a href="/terms" data-nav>terms</a> and <a href="/privacy" data-nav>privacy</a>.</small></div></dialog>`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = `<p class="eyebrow">Last updated 28 August 2026</p><h2>Privacy, in plain language</h2><p class="lede">Caption Queue is local-first. Your photographs, captions, keywords, and workspace records stay in your browser unless you explicitly export them.</p><h3>What stays on your device</h3><p>Queue data is stored in IndexedDB. A license token and its last verification result are stored in localStorage. You can remove either through the app or your browser settings.</p><h3>What leaves your device</h3><p>Photos and metadata are never uploaded by Caption Queue. When you verify a paid license, only that token is sent to Sociobot's licensing API. The hosted checkout has its own payment privacy terms. This app contains no analytics, advertising, tracking pixels, or third-party scripts.</p><h3>Your control</h3><p>Use “Export workspace backup” before clearing browser storage. Clearing site data deletes the local workspace and license from this device.</p>`;
  const terms = `<p class="eyebrow">Last updated 28 August 2026</p><h2>Terms of use</h2><p class="lede">Caption Queue helps prepare XMP metadata. You remain responsible for reviewing the accuracy, rights, and suitability of every record you export.</p><h3>License and purchase</h3><p>The free edition is usable without an account. Field edition is a $24 one-time license for the purchaser. Sociobot/Dodo is merchant of record and handles checkout and refunds. A refund or charge reversal revokes the license.</p><h3>Your data</h3><p>You own your photographs and metadata. Caption Queue does not claim rights to them. Exported sidecars are provided as generated; keep backups and test them with your DAM before a production handoff.</p><h3>Warranty</h3><p>The software is provided “as is,” without warranties. To the maximum extent permitted by law, the authors are not liable for lost data, missed delivery, or downstream metadata changes.</p>`;
  return shell(`<main id="main" class="legal"><h1>Caption Queue</h1><article>${kind === 'privacy' ? privacy : terms}<p><a class="secondary-button" href="/" data-nav>← Back to the workbench</a></p></article></main>`);
}

function render(): void {
  const path = location.pathname;
  app.innerHTML = path === '/privacy' ? legalPage('privacy') : path === '/terms' ? legalPage('terms') : data.items.length ? workspace() : landing();
  bindCommon();
  if (path === '/' && data.items.length) bindWorkspace();
  else if (path === '/') bindImports();
}

function bindCommon(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((link) => link.addEventListener('click', (event) => { if (link.origin !== location.origin) return; event.preventDefault(); history.pushState({}, '', link.pathname); render(); window.scrollTo(0, 0); }));
  document.querySelector('#theme-button')?.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; localStorage.setItem('cq-theme', next); });
  document.querySelector('#license-button')?.addEventListener('click', () => (document.querySelector('#license-dialog') as HTMLDialogElement).showModal());
  document.querySelector('#renew-license')?.addEventListener('click', () => (document.querySelector('#license-dialog') as HTMLDialogElement).showModal());
  document.querySelector('.dialog-close')?.addEventListener('click', () => (document.querySelector('#license-dialog') as HTMLDialogElement).close());
  document.querySelector('#remove-license')?.addEventListener('click', () => { removeLicense(); paid = false; render(); });
  document.querySelector('#restore-form')?.addEventListener('submit', async (event) => { event.preventDefault(); const token = (document.querySelector('#license-token') as HTMLInputElement).value; const message = document.querySelector('#license-message')!; saveLicense(token); message.textContent = 'Checking license…'; paid = await verifyLicense(true); if (paid) render(); else message.textContent = 'That license is not active. Check the token and try again.'; });
}

function bindImports(): void {
  document.querySelector<HTMLInputElement>('#photo-input')?.addEventListener('change', async (event) => importPhotos(Array.from((event.target as HTMLInputElement).files ?? [])));
  document.querySelector<HTMLInputElement>('#csv-input')?.addEventListener('change', async (event) => { const file = (event.target as HTMLInputElement).files?.[0]; if (file) await importCsv(file); });
  document.querySelector<HTMLInputElement>('#backup-input')?.addEventListener('change', async (event) => { const file = (event.target as HTMLInputElement).files?.[0]; if (file) await importBackup(file); });
}

async function importPhotos(files: File[]): Promise<void> {
  const accepted = files.filter((file) => file.type.startsWith('image/') || /\.(dng|cr2|cr3|nef|arw|raf)$/i.test(file.name));
  if (!accepted.length) { announce('No supported photo files were found.'); return; }
  if (!paid && accepted.length > 25) { openLicense(); announce('The free edition accepts 25 records per shoot. Choose fewer photos or unlock Field edition.'); return; }
  announce(`Preparing ${accepted.length} photo${accepted.length === 1 ? '' : 's'} locally…`);
  const root = (accepted[0] as File & { webkitRelativePath?: string }).webkitRelativePath?.split('/')[0];
  const shoot: Shoot = { id: crypto.randomUUID(), name: root || `Shoot ${new Date().toLocaleDateString()}`, createdAt: Date.now(), vocabulary: [] };
  const items: QueueItem[] = accepted.map((file) => {
    const item: QueueItem = { id: crypto.randomUUID(), shootId: shoot.id, fileName: file.name, relativePath: (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name, mimeType: file.type, size: file.size, metadata: emptyMetadata(), ready: false, updatedAt: Date.now() };
    const originalUrl = URL.createObjectURL(file); imageUrls.set(item.id, originalUrl); createThumbnail(file).then((thumb) => { if (thumb) { item.thumbnail = thumb; document.querySelectorAll<HTMLImageElement>(`img[data-preview="${CSS.escape(item.id)}"]`).forEach((image) => { image.src = thumb; }); persist(); } imageUrls.delete(item.id); URL.revokeObjectURL(originalUrl); }); return item;
  });
  data.shoots.push(shoot); data.items.push(...items); data.activeShootId = shoot.id; data.activeItemId = items[0].id; await persist(); history.pushState({}, '', '/'); render();
}

async function importCsv(file: File): Promise<void> {
  try {
    const shoot: Shoot = { id: crypto.randomUUID(), name: file.name.replace(/\.csv$/i, '') || 'Imported shoot', createdAt: Date.now(), vocabulary: [] };
    const items = csvToItems(await file.text(), shoot.id);
    if (!paid && items.length > 25) { openLicense(); announce('This CSV has more than 25 records. Unlock Field edition or import a smaller manifest.'); return; }
    data.shoots.push(shoot); data.items.push(...items); data.activeShootId = shoot.id; data.activeItemId = items[0].id; await persist(); render();
  } catch (error) { announce(error instanceof Error ? error.message : 'The CSV could not be read.'); }
}

async function importBackup(file: File): Promise<void> {
  try {
    const parsed = JSON.parse(await file.text()) as Partial<AppData> & { version?: number };
    if (parsed.version !== 1 || !Array.isArray(parsed.shoots) || !Array.isArray(parsed.items)) throw new Error('This is not a Caption Queue v1 backup.');
    if (!parsed.shoots.every((s) => s && typeof s.id === 'string' && typeof s.name === 'string') || !parsed.items.every((i) => i && typeof i.id === 'string' && typeof i.fileName === 'string' && i.metadata)) throw new Error('The backup is incomplete or damaged.');
    if (!paid && parsed.items.length > 25) { openLicense(); announce('This backup needs Field edition because it contains more than 25 records.'); return; }
    if (!confirm(`Replace this browser's workspace with ${parsed.items.length} imported records? Export a backup first if needed.`)) return;
    data = { shoots: parsed.shoots as Shoot[], items: parsed.items as QueueItem[], activeShootId: parsed.activeShootId, activeItemId: parsed.activeItemId };
    await persist(); history.pushState({}, '', '/'); render(); announce(`${data.items.length} records restored.`);
  } catch (error) { announce(error instanceof Error ? error.message : 'The backup could not be imported.'); }
}

async function createThumbnail(file: File): Promise<string | undefined> {
  if (!file.type.startsWith('image/')) return;
  try { const bitmap = await createImageBitmap(file); const scale = Math.min(1, 360 / bitmap.width); const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale); canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close(); return canvas.toDataURL('image/jpeg', .72); } catch { return; }
}

function bindWorkspace(): void {
  document.querySelectorAll<HTMLElement>('[data-item]').forEach((button) => button.addEventListener('click', () => { data.activeItemId = button.dataset.item; showQueue = false; persist(); render(); }));
  document.querySelector('#queue-toggle')?.addEventListener('click', () => { showQueue = true; document.querySelector('.queue-panel')?.classList.add('queue-open'); });
  document.querySelector('#close-queue')?.addEventListener('click', () => { showQueue = false; document.querySelector('.queue-panel')?.classList.remove('queue-open'); });
  document.querySelector<HTMLSelectElement>('#shoot-select')?.addEventListener('change', (event) => { data.activeShootId = (event.target as HTMLSelectElement).value; data.activeItemId = data.items.find((item) => item.shootId === data.activeShootId)?.id; persist(); render(); });
  document.querySelector<HTMLSelectElement>('#queue-filter')?.addEventListener('change', (event) => { filter = (event.target as HTMLSelectElement).value as typeof filter; render(); });
  document.querySelector<HTMLInputElement>('#queue-search')?.addEventListener('input', (event) => { query = (event.target as HTMLInputElement).value; render(); requestAnimationFrame(() => { const input = document.querySelector<HTMLInputElement>('#queue-search'); input?.focus(); input?.setSelectionRange(query.length, query.length); }); });
  document.querySelector('#previous-button')?.addEventListener('click', () => move(-1)); document.querySelector('#next-button')?.addEventListener('click', () => move(1));
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('#metadata-form input, #metadata-form textarea').forEach((input) => input.addEventListener('input', updateMetadata));
  document.querySelector('#metadata-form')?.addEventListener('submit', (event) => { event.preventDefault(); markReadyAndMove(); });
  document.querySelectorAll<HTMLButtonElement>('[data-token]').forEach((button) => button.addEventListener('click', () => insertToken(button.dataset.token!)));
  document.querySelectorAll<HTMLButtonElement>('[data-keyword]').forEach((button) => button.addEventListener('click', () => addKeyword(button.dataset.keyword!)));
  document.querySelectorAll<HTMLButtonElement>('[data-remove-keyword]').forEach((button) => button.addEventListener('click', () => removeKeyword(button.dataset.removeKeyword!)));
  document.querySelector('#vocab-form')?.addEventListener('submit', addVocabulary);
  document.querySelector('#export-one')?.addEventListener('click', () => downloadXmp(activeItem()!));
  document.querySelector('#export-all')?.addEventListener('click', writeAllSidecars);
  document.querySelector('#export-backup')?.addEventListener('click', exportBackup);
  document.querySelector('#export-csv')?.addEventListener('click', () => downloadBlob(exportCsv(shootItems()), `${activeShoot()!.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-metadata.csv`, 'text/csv'));
  document.querySelector<HTMLInputElement>('#backup-input')?.addEventListener('change', async (event) => { const file = (event.target as HTMLInputElement).files?.[0]; if (file) await importBackup(file); });
  document.querySelector('#new-shoot')?.addEventListener('click', newShoot);
  const batch = document.querySelector<HTMLDialogElement>('#batch-dialog')!;
  document.querySelector('#batch-button')?.addEventListener('click', () => { if (!paid) openLicense(); else batch.showModal(); });
  document.querySelector('#apply-batch')?.addEventListener('click', applyBatch);
}

function updateMetadata(event: Event): void {
  const input = event.target as HTMLInputElement | HTMLTextAreaElement; const item = activeItem(); if (!item || !(input.name in item.metadata)) return;
  if (input.name === 'keywords') item.metadata.keywords = input.value.split(/[;|]/).map((v) => v.trim()).filter(Boolean);
  else (item.metadata as unknown as Record<string, string>)[input.name] = input.value;
  item.ready = false; item.updatedAt = Date.now(); persist();
  const count = document.querySelector(`#${input.name}-count`); if (count) count.textContent = `${input.value.length} / ${input.maxLength}`;
  const heading = document.querySelector('#validation-title'); const list = document.querySelector('#validation-list'); const code = document.querySelector('#xmp-code');
  if (heading) heading.textContent = validationHeading(item); if (list) list.innerHTML = validationList(item); if (code) code.textContent = makeXmp(item);
}

function markReadyAndMove(): void { const item = activeItem()!; const errors = validateMetadata(item.metadata); if (errors.length) { announce(`${errors.length} required items remain. ${errors[0]}.`); document.querySelector<HTMLElement>('.validation')?.focus(); return; } item.ready = true; item.updatedAt = Date.now(); persist(); announce(`${item.fileName} is ready.`); move(1, true); }
function move(delta: number, stayAtEnd = false): void { const items = shootItems(); const index = items.findIndex((i) => i.id === activeItem()?.id); const next = items[index + delta]; if (next) data.activeItemId = next.id; else if (!stayAtEnd) return; persist(); render(); document.querySelector('.annotation-sheet')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
function insertToken(token: string): void { const item = activeItem()!; const shoot = activeShoot()!; const textarea = document.querySelector<HTMLTextAreaElement>('#description')!; const rendered = renderTokens(token, item, shoot.name, shootItems().indexOf(item) + 1); textarea.setRangeText(rendered, textarea.selectionStart, textarea.selectionEnd, 'end'); textarea.dispatchEvent(new Event('input', { bubbles: true })); textarea.focus(); }
function addKeyword(word: string): void { const item = activeItem()!; if (!item.metadata.keywords.includes(word)) item.metadata.keywords.push(word); item.ready = false; persist(); render(); }
function removeKeyword(word: string): void { const item = activeItem()!; item.metadata.keywords = item.metadata.keywords.filter((k) => k !== word); item.ready = false; persist(); render(); }
function addVocabulary(event: Event): void { event.preventDefault(); const input = document.querySelector<HTMLInputElement>('#vocab-input')!; const shoot = activeShoot()!; const word = input.value.trim(); if (word && !shoot.vocabulary.includes(word)) shoot.vocabulary.push(word); persist(); render(); }

function applyBatch(event: Event): void {
  event.preventDefault(); const shoot = activeShoot()!; const items = shootItems(); const unfinished = document.querySelector<HTMLInputElement>('#batch-unfinished')!.checked; const title = document.querySelector<HTMLInputElement>('#batch-title')!.value; const caption = document.querySelector<HTMLTextAreaElement>('#batch-caption')!.value; const keywords = document.querySelector<HTMLInputElement>('#batch-keywords')!.value.split(/[;|]/).map((v) => v.trim()).filter(Boolean);
  const targets = items.filter((item) => !unfinished || !item.ready); if (!targets.length || (!title && !caption && !keywords.length)) { announce('Nothing was changed. Add a pattern or keyword first.'); return; }
  if (!confirm(`Apply these changes to ${targets.length} record${targets.length === 1 ? '' : 's'}? Existing title or caption patterns will be replaced.`)) return;
  undoSnapshot = structuredClone(items); targets.forEach((item) => { const sequence = items.indexOf(item) + 1; if (title) item.metadata.title = renderTokens(title, item, shoot.name, sequence); if (caption) item.metadata.description = renderTokens(caption, item, shoot.name, sequence); item.metadata.keywords = [...new Set([...item.metadata.keywords, ...keywords])]; item.ready = false; item.updatedAt = Date.now(); }); persist(); render(); showUndo(`${targets.length} records updated.`);
}
function showUndo(message: string): void { const toast = document.createElement('div'); toast.className = 'toast'; toast.innerHTML = `<span>${e(message)}</span><button>Undo</button>`; document.body.append(toast); toast.querySelector('button')!.addEventListener('click', () => { if (undoSnapshot) { const id = activeShoot()!.id; data.items = [...data.items.filter((i) => i.shootId !== id), ...undoSnapshot]; undoSnapshot = null; persist(); render(); } toast.remove(); }); setTimeout(() => toast.remove(), 8000); }

async function writeAllSidecars(): Promise<void> {
  const items = shootItems();
  if (window.showDirectoryPicker) try { const directory = await window.showDirectoryPicker(); for (const item of items) { const file = await directory.getFileHandle(sidecarName(item.fileName), { create: true }); const writer = await file.createWritable(); await writer.write(makeXmp(item)); await writer.close(); } announce(`${items.length} XMP sidecars written to the selected folder.`); return; } catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return; }
  items.forEach((item, index) => setTimeout(() => downloadXmp(item), index * 120)); announce(`${items.length} sidecar downloads started. Your browser may ask permission for multiple files.`);
}
function downloadXmp(item: QueueItem): void { downloadBlob(makeXmp(item), sidecarName(item.fileName), 'application/rdf+xml'); announce(`${sidecarName(item.fileName)} exported.`); }
function exportBackup(): void { downloadBlob(JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...data }, null, 2), `caption-queue-${activeShoot()?.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'backup'}.json`, 'application/json'); }
function downloadBlob(content: string, name: string, type: string): void { const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function newShoot(): void { if (!paid && data.shoots.length >= 1) { openLicense(); return; } const input = document.createElement('input'); input.type = 'file'; input.multiple = true; input.accept = 'image/*,.dng,.cr2,.cr3,.nef,.arw,.raf'; input.setAttribute('webkitdirectory', ''); input.addEventListener('change', () => importPhotos(Array.from(input.files ?? []))); input.click(); }
function openLicense(): void { (document.querySelector('#license-dialog') as HTMLDialogElement)?.showModal(); }
function formatBytes(bytes: number): string { return bytes > 1_048_576 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`; }

window.addEventListener('popstate', render);
window.addEventListener('online', render); window.addEventListener('offline', render);
window.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && data.items.length) { event.preventDefault(); markReadyAndMove(); return; }
  const target = event.target as HTMLElement; if (/INPUT|TEXTAREA|SELECT/.test(target.tagName) || document.querySelector('dialog[open]')) return;
  if (event.key.toLowerCase() === 'j') move(1); if (event.key.toLowerCase() === 'k') move(-1);
});
document.documentElement.dataset.theme = localStorage.getItem('cq-theme') ?? 'light';
render();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').then((registration) => {
  registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) { const toast = document.createElement('div'); toast.className = 'toast'; toast.innerHTML = '<span>An update is ready.</span><button>Refresh</button>'; toast.querySelector('button')!.addEventListener('click', () => { worker.postMessage('SKIP_WAITING'); location.reload(); }); document.body.append(toast); } }); });
}).catch(() => { /* app remains usable without install support */ });

export function exportCsv(items: QueueItem[]): string {
  return ['filename,title,caption,keywords,creator,rights,city,state,country,dateCreated', ...items.map((item) => [item.fileName, item.metadata.title, item.metadata.description, item.metadata.keywords.join('; '), item.metadata.creator, item.metadata.rights, item.metadata.city, item.metadata.state, item.metadata.country, item.metadata.dateCreated].map(escapeCsv).join(','))].join('\n');
}
