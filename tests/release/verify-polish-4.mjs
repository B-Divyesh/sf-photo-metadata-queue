import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'https://photo-metadata-queue.sociobot.in';
const evidence = process.env.POLISH_EVIDENCE_DIR ?? '.factory/evidence-polish-4';
process.env.POLISH_EVIDENCE_DIR = evidence;
await mkdir(evidence, { recursive: true });

// Retain every round-three live check, then add the review-four routing regression.
await import('./verify-polish-3.mjs');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));

try {
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Salt marsh bird survey', level: 1 }).waitFor();
  await page.locator('#title').fill('Discard this live demo edit');
  await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('caption-queue', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('workspace');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('workspace', 'readwrite');
      transaction.objectStore('workspace').put({ owner: 'real workspace', preserved: true }, 'real-data-sentinel');
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
  }));

  const wordmark = page.getByRole('link', { name: 'Caption Queue' }).first();
  assert.equal(await wordmark.getAttribute('href'), '/');
  await page.screenshot({ path: `${evidence}/live-demo-wordmark-mobile.png` });
  await wordmark.click();

  assert.equal(new URL(page.url()).pathname, '/');
  const heading = page.getByRole('heading', { name: 'Caption large shoots without changing originals', level: 1 });
  await heading.waitFor();
  assert.equal(await heading.evaluate((element) => element === document.activeElement), true);
  await page.waitForFunction(async () => !(await indexedDB.databases()).some((entry) => entry.name === 'demo:caption-queue'));
  assert.deepEqual(await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('caption-queue');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const get = db.transaction('workspace').objectStore('workspace').get('real-data-sentinel');
      get.onsuccess = () => { db.close(); resolve(get.result); };
      get.onerror = () => reject(get.error);
    };
  })), { owner: 'real workspace', preserved: true });
  assert.deepEqual(errors, []);
  await page.screenshot({ path: `${evidence}/live-wordmark-home-mobile.png` });
  console.log(`Polish 4 wordmark regression passed at ${base}`);
} finally {
  await context.close();
  await browser.close();
}
