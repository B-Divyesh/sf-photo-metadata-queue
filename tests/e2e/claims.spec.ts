import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const demoDb = 'demo:caption-queue';

async function clearBrowserData(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(async (names) => {
    localStorage.clear();
    await Promise.all(names.map((name) => new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    })));
  }, ['caption-queue', demoDb]);
  await page.reload();
}

async function openFreshDemo(page: Page): Promise<void> {
  await clearBrowserData(page);
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
}

function manifestCsv(count: number): string {
  return ['filename,title,caption,creator,rights', ...Array.from({ length: count }, (_, index) => `FRAME_${String(index + 1).padStart(3, '0')}.jpg,Frame ${index + 1},Documentary frame ${index + 1},Mira Shah,© Mira Shah`)].join('\n');
}

async function downloadText(page: Page, action: () => Promise<void>): Promise<{ name: string; text: string }> {
  const pending = page.waitForEvent('download');
  await action();
  const download = await pending;
  const path = await download.path();
  if (!path) throw new Error('Download did not produce a local file.');
  return { name: download.suggestedFilename(), text: await readFile(path, 'utf8') };
}

async function fixtureSnapshot(directory: string): Promise<Record<string, string>> {
  const names = (await readdir(directory)).sort();
  return Object.fromEntries(await Promise.all(names.map(async (name) => [name, createHash('sha256').update(await readFile(resolve(directory, name))).digest('hex')])));
}

test('@claim:demo-sandbox sample mode is one click, isolated, resettable, and discardable', async ({ page }) => {
  await clearBrowserData(page);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { name: 'Salt marsh bird survey', level: 1 })).toBeVisible();
  await expect(page.locator('.specimen-row')).toHaveCount(3);
  await expect(page.getByText('2 of 3 ready')).toBeVisible();

  await page.locator('#title').fill('Temporary demo edit');
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('caption-queue', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('workspace');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const value = {
        shoots: [{ id: 'real-shoot', name: 'Private client shoot', createdAt: 1, vocabulary: [] }],
        items: [{ id: 'real-item', shootId: 'real-shoot', fileName: 'CLIENT_001.JPG', relativePath: 'CLIENT_001.JPG', mimeType: 'image/jpeg', size: 1, metadata: { title: '', description: '', keywords: [], creator: '', rights: '', city: '', state: '', country: '', dateCreated: '' }, ready: false, updatedAt: 1 }],
        activeShootId: 'real-shoot', activeItemId: 'real-item'
      };
      const transaction = db.transaction('workspace', 'readwrite');
      transaction.objectStore('workspace').put(value, 'current');
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
  }));
  expect(await page.evaluate(async () => (await indexedDB.databases()).map((entry) => entry.name))).toEqual(expect.arrayContaining(['caption-queue', demoDb]));

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#title')).toHaveValue('Great blue heron lifting from reeds');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'Private client shoot', level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(async () => (await indexedDB.databases()).map((entry) => entry.name))).not.toContain(demoDb);

  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator('.specimen-row')).toHaveCount(3);
});

test('@claim:offline-reload demo and saved real queues reopen offline after the first visit', async ({ page, context }) => {
  await openFreshDemo(page);
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.locator('#title').fill('Offline marsh record');
  await expect.poll(() => page.evaluate(async () => {
    const request = indexedDB.open('demo:caption-queue');
    return await new Promise<string>((resolve) => {
      request.onsuccess = () => {
        const db = request.result;
        const get = db.transaction('workspace').objectStore('workspace').get('current');
        get.onsuccess = () => { const title = get.result.items[0].metadata.title; db.close(); resolve(title); };
      };
    });
  })).toBe('Offline marsh record');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Salt marsh bird survey', level: 1 })).toBeVisible();
  await expect(page.locator('#title')).toHaveValue('Offline marsh record');

  await context.setOffline(false);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('#csv-input').setInputFiles({ name: 'saved-real.csv', mimeType: 'text/csv', buffer: Buffer.from(manifestCsv(2)) });
  await expect(page.getByRole('heading', { name: 'saved-real', level: 1 })).toBeVisible();
  await page.locator('#title').fill('Offline saved queue');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'saved-real', level: 1 })).toBeVisible();
  await expect(page.locator('#title')).toHaveValue('Offline saved queue');
});

test('@claim:local-privacy free demo editing and export make same-origin requests only', async ({ page }) => {
  const urls: string[] = [];
  page.on('request', (request) => urls.push(request.url()));
  await openFreshDemo(page);
  await page.locator('#description').fill('A local-only metadata change.');
  await downloadText(page, () => page.getByRole('button', { name: 'Export metadata CSV' }).click());
  const origins = [...new Set(urls.map((url) => new URL(url).origin))];
  expect(origins).toEqual(['http://127.0.0.1:4173']);
  expect(await page.evaluate(async () => (await indexedDB.databases()).map((entry) => entry.name))).toContain(demoDb);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:photo-metadata-queue'))).toBeNull();
});

test('@claim:xmp-export exported sample XMP is well formed and escapes XML-sensitive text', async ({ page }) => {
  await openFreshDemo(page);
  await page.locator('#title').fill('Heron & <returning>');
  const output = await downloadText(page, () => page.getByRole('button', { name: 'Export this XMP' }).click());
  expect(output.name).toBe('BIRDS_1842.xmp');
  expect(output.text).toContain('Heron &amp; &lt;returning&gt;');
  expect(await page.evaluate((xml) => new DOMParser().parseFromString(xml, 'application/xml').querySelector('parsererror')?.textContent ?? '', output.text)).toBe('');
});

test('@claim:original-files-unchanged import and every metadata export leave original photo bytes and names unchanged', async ({ page }) => {
  const fixtureDirectory = resolve('tests/fixtures/photo-shoot');
  const before = await fixtureSnapshot(fixtureDirectory);
  await openFreshDemo(page);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('#photo-input').setInputFiles(fixtureDirectory);
  await expect(page.locator('.specimen-row')).toHaveCount(2);

  const single = await downloadText(page, () => page.getByRole('button', { name: 'Export this XMP' }).click());
  expect(single.name).toBe('RAW_PROXY_001.xmp');

  await page.evaluate(() => {
    const writes: Record<string, string> = {};
    (window as typeof window & { sidecarWrites: Record<string, string> }).sidecarWrites = writes;
    window.showDirectoryPicker = async () => ({
      getFileHandle: async (name: string, options: { create: boolean }) => {
        if (!options.create || !name.endsWith('.xmp')) throw new Error(`Unexpected write target: ${name}`);
        return { createWritable: async () => ({ write: async (content: string) => { writes[name] = content; }, close: async () => undefined }) };
      }
    }) as unknown as FileSystemDirectoryHandle;
  });
  await page.getByRole('button', { name: 'Export 2 .xmp files' }).click();
  await expect.poll(() => page.evaluate(() => Object.keys((window as typeof window & { sidecarWrites: Record<string, string> }).sidecarWrites).sort()))
    .toEqual(['RAW_PROXY_001.xmp', 'RAW_PROXY_002.xmp']);

  await page.evaluate(() => { delete window.showDirectoryPicker; });
  const bulkNames: string[] = [];
  page.on('download', (download) => bulkNames.push(download.suggestedFilename()));
  await page.getByRole('button', { name: 'Export 2 .xmp files' }).click();
  await expect.poll(() => bulkNames.slice().sort()).toEqual(['RAW_PROXY_001.xmp', 'RAW_PROXY_002.xmp']);

  expect(await fixtureSnapshot(fixtureDirectory)).toEqual(before);
  expect(Object.keys(before)).toEqual(['RAW_PROXY_001.JPG', 'RAW_PROXY_002.JPG']);
  expect([single.name, ...bulkNames].every((name) => name.endsWith('.xmp'))).toBe(true);
});

test('@claim:photo-import selected photos become queue records when previews cannot be decoded', async ({ page }) => {
  await openFreshDemo(page);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('#photo-input').setInputFiles(resolve('tests/fixtures/photo-shoot'));
  await expect(page.locator('.specimen-row')).toHaveCount(2);
  await expect(page.getByText('RAW_PROXY_001.JPG', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('RAW_PROXY_002.JPG', { exact: true }).first()).toBeVisible();
});

test('@claim:no-generated-captions imported empty records stay empty and make no model request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openFreshDemo(page);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('#photo-input').setInputFiles(resolve('tests/fixtures/photo-shoot'));
  await expect(page.locator('#description')).toHaveValue('');
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page.locator('#description')).toHaveValue('');
  await page.waitForTimeout(500);
  expect(requests.some((url) => /openai|responses|model/i.test(url))).toBe(false);
});

test('@claim:metadata-tools tokens, terms, and validation update demo metadata', async ({ page }) => {
  await openFreshDemo(page);
  await page.getByRole('button', { name: '{filename}' }).click();
  await expect(page.locator('#description')).toHaveValue(/BIRDS_1842/);
  await page.getByRole('button', { name: '+ dusk' }).click();
  await expect(page.locator('#keywords')).toHaveValue(/dusk/);
  await page.getByRole('button', { name: /BIRDS_1844.JPG/ }).click();
  await page.getByRole('button', { name: 'Mark ready & next' }).click();
  await expect(page.locator('.notice-toast')).toContainText('required items remain');
  await page.locator('#title').fill('Heron settling into cordgrass');
  await page.locator('#description').fill('A great blue heron settles into cordgrass after the evening survey.');
  await page.getByRole('button', { name: 'Mark ready & next' }).click();
  await expect(page.locator('.status-badge')).toContainText('Ready');
});

test('@claim:bulk-xmp export this shoot downloads one .xmp file per sample record', async ({ page }) => {
  await openFreshDemo(page);
  await page.evaluate(() => { delete window.showDirectoryPicker; });
  const downloads: string[] = [];
  page.on('download', (download) => downloads.push(download.suggestedFilename()));
  await page.getByRole('button', { name: 'Export 3 .xmp files' }).click();
  await expect.poll(() => downloads.slice().sort()).toEqual(['BIRDS_1842.xmp', 'BIRDS_1843.xmp', 'BIRDS_1844.xmp']);
});

test('@claim:free-limit free mode accepts 25 records and rejects 26', async ({ page }) => {
  await openFreshDemo(page);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('#csv-input').setInputFiles({ name: 'over-limit.csv', mimeType: 'text/csv', buffer: Buffer.from(manifestCsv(26)) });
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.notice-toast').getByText('This CSV has more than 25 records.')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.locator('#csv-input').setInputFiles({ name: 'exact-limit.csv', mimeType: 'text/csv', buffer: Buffer.from(manifestCsv(25)) });
  await expect(page.getByRole('heading', { name: 'exact-limit', level: 1 })).toBeVisible();
  await expect(page.getByText('0 of 25 ready')).toBeVisible();
});

test('@claim:field-edition shows the one-time price and enables unlimited imports, saved shoots, and batch patterns with a valid license fixture', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', async (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await openFreshDemo(page);
  await page.getByRole('button', { name: 'View pricing' }).click();
  await expect(page.getByText('$24 one-time purchase')).toBeVisible();
  await expect(page.getByText('No record limit per imported shoot')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'View pricing' }).click();
  await page.getByLabel('Have a license? Paste it here').fill('fixture-valid-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByRole('button', { name: 'Field edition', exact: true })).toBeVisible();
  await page.locator('#csv-input').setInputFiles({ name: 'field-shoot.csv', mimeType: 'text/csv', buffer: Buffer.from(manifestCsv(26)) });
  await expect(page.getByRole('heading', { name: 'field-shoot', level: 1 })).toBeVisible();
  await expect(page.getByText('0 of 26 ready')).toBeVisible();
  await page.getByRole('button', { name: 'Batch edit' }).click();
  await expect(page.getByRole('heading', { name: 'Apply to 26 records', level: 2 })).toBeVisible();
  await page.locator('#batch-title').fill('Catalog {sequence} — {filename}');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Apply changes' }).click();
  await expect(page.locator('#title')).toHaveValue('Catalog 001 — FRAME_001');
  await expect(page.locator('.toast')).toContainText('26 records updated.');
  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'New shoot' }).click();
  const chooser = await chooserPromise;
  await chooser.setFiles(resolve('tests/fixtures/photo-shoot'));
  await expect(page.locator('#shoot-select option')).toHaveCount(2);
});

test('@claim:local-persistence a demo metadata edit survives reload', async ({ page }) => {
  await openFreshDemo(page);
  await page.locator('#title').fill('Saved field observation');
  await expect.poll(() => page.evaluate(async () => {
    const request = indexedDB.open('demo:caption-queue');
    return await new Promise<string>((resolve) => {
      request.onsuccess = () => {
        const db = request.result;
        const get = db.transaction('workspace').objectStore('workspace').get('current');
        get.onsuccess = () => { const title = get.result.items[0].metadata.title; db.close(); resolve(title); };
      };
    });
  })).toBe('Saved field observation');
  await page.reload();
  await expect(page.locator('#title')).toHaveValue('Saved field observation');
});

test('@claim:csv-export metadata CSV has its header and one row per sample record', async ({ page }) => {
  await openFreshDemo(page);
  const output = await downloadText(page, () => page.getByRole('button', { name: 'Export metadata CSV' }).click());
  const rows = output.text.trim().split('\n');
  expect(rows[0]).toBe('filename,title,caption,keywords,creator,rights,city,state,country,dateCreated');
  expect(rows).toHaveLength(4);
  expect(output.text).toContain('BIRDS_1842.JPG');
});

test('@claim:backup-restore an exported demo backup restores changed records', async ({ page }) => {
  await openFreshDemo(page);
  const backup = await downloadText(page, () => page.getByRole('button', { name: 'Export workspace backup' }).click());
  await page.locator('#title').fill('Changed after backup');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#backup-input').setInputFiles({ name: backup.name, mimeType: 'application/json', buffer: Buffer.from(backup.text) });
  await expect(page.locator('#title')).toHaveValue('Great blue heron lifting from reeds');
  await expect(page.locator('.specimen-row')).toHaveCount(3);
});

test('@claim:backup-cross-browser a JSON backup restores into a separate fresh browser workspace', async ({ page, browser }) => {
  await openFreshDemo(page);
  await page.locator('#title').fill('Portable salt-marsh record');
  const backup = await downloadText(page, () => page.getByRole('button', { name: 'Export workspace backup' }).click());

  const otherContext = await browser.newContext();
  try {
    const otherPage = await otherContext.newPage();
    await otherPage.goto('http://127.0.0.1:4173/');
    otherPage.once('dialog', (dialog) => dialog.accept());
    await otherPage.locator('#backup-input').setInputFiles({ name: backup.name, mimeType: 'application/json', buffer: Buffer.from(backup.text) });
    await expect(otherPage.getByRole('heading', { name: 'Salt marsh bird survey', level: 1 })).toBeVisible();
    await expect(otherPage.locator('#title')).toHaveValue('Portable salt-marsh record');
    await expect(otherPage.locator('.specimen-row')).toHaveCount(3);
    await expect.poll(() => otherPage.evaluate(async () => (await indexedDB.databases()).map((entry) => entry.name))).toContain('caption-queue');
  } finally {
    await otherContext.close();
  }
});

test('@claim:direct-sidecar-write compatible directory handles receive one .xmp file for every queue record', async ({ page }) => {
  await openFreshDemo(page);
  await page.evaluate(() => {
    const writes: Record<string, string> = {};
    (window as typeof window & { sidecarWrites: Record<string, string> }).sidecarWrites = writes;
    window.showDirectoryPicker = async () => ({
      getFileHandle: async (name: string) => ({
        createWritable: async () => ({
          write: async (content: string) => { writes[name] = content; },
          close: async () => undefined
        })
      })
    }) as unknown as FileSystemDirectoryHandle;
  });
  await page.getByRole('button', { name: 'Export 3 .xmp files' }).click();
  await expect.poll(() => page.evaluate(() => Object.keys((window as typeof window & { sidecarWrites: Record<string, string> }).sidecarWrites).sort()))
    .toEqual(['BIRDS_1842.xmp', 'BIRDS_1843.xmp', 'BIRDS_1844.xmp']);
  const writes = await page.evaluate(() => (window as typeof window & { sidecarWrites: Record<string, string> }).sidecarWrites);
  expect(writes['BIRDS_1842.xmp']).toContain('<x:xmpmeta');
  expect(writes['BIRDS_1842.xmp']).toContain('Great blue heron lifting from reeds');
});

test('@claim:keyboard-save-next queue controls and Ctrl+Enter move and save a record', async ({ page }) => {
  await openFreshDemo(page);
  await page.locator('body').press('j');
  await expect(page.getByRole('heading', { name: 'BIRDS_1843.JPG', level: 2 })).toBeVisible();
  await page.getByRole('button', { name: '← Previous', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'BIRDS_1842.JPG', level: 2 })).toBeVisible();
  await page.getByRole('button', { name: 'Next →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'BIRDS_1843.JPG', level: 2 })).toBeVisible();
  await page.getByRole('button', { name: /BIRDS_1844.JPG/ }).click();
  await page.locator('#title').fill('Heron settling into cordgrass');
  await page.locator('#description').fill('A great blue heron settles into cordgrass after the evening survey.');
  await page.locator('#description').press('Control+Enter');
  await expect(page.locator('.status-badge')).toContainText('Ready');
  await expect(page.getByText('3 of 3 ready')).toBeVisible();
});

test('@claim:license-verification-privacy paid verification sends the pasted token as its only request value', async ({ page }) => {
  let observed: { method: string; url: string; postData: string | null } | undefined;
  await page.route('https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify**', async (route) => {
    const request = route.request();
    observed = { method: request.method(), url: request.url(), postData: request.postData() };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
  });
  await clearBrowserData(page);
  await page.getByRole('button', { name: 'View pricing' }).click();
  await page.getByLabel('Have a license? Paste it here').fill('private-fixture-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByRole('button', { name: 'Field edition', exact: true })).toBeVisible();
  expect(observed).toBeDefined();
  const url = new URL(observed!.url);
  expect(observed!.method).toBe('GET');
  expect(`${url.origin}${url.pathname}`).toBe('https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify');
  expect([...url.searchParams.keys()]).toEqual(['license']);
  expect(url.searchParams.get('license')).toBe('private-fixture-token');
  expect(observed!.postData).toBeNull();
});

test('@claim:keyboard-controls queue movement and a landing import control are keyboard operable', async ({ page }) => {
  await openFreshDemo(page);
  await page.locator('body').press('j');
  await expect(page.getByRole('heading', { name: 'BIRDS_1843.JPG', level: 2 })).toBeVisible();
  await page.locator('body').press('k');
  await expect(page.getByRole('heading', { name: 'BIRDS_1842.JPG', level: 2 })).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  const button = page.getByRole('button', { name: 'Choose photo folder' });
  for (let index = 0; index < 20 && !(await button.evaluate((element) => element === document.activeElement)); index += 1) await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  const chooser = page.waitForEvent('filechooser');
  await page.keyboard.press('Enter');
  expect(await (await chooser).element().getAttribute('id')).toBe('photo-input');
});
