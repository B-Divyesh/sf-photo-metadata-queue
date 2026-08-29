import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = 'https://photo-metadata-queue.sociobot.in';
const api = 'https://api.sociobot.in';
const browser = await chromium.launch({ headless: true });
const evidence = {};

{
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push({ method: request.method(), url: request.url(), type: request.resourceType(), postData: request.postData() }));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.locator('#title').fill('Privacy flow edit');
  const xmpEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export this XMP' }).click();
  const xmp = await xmpEvent;
  const xmpPath = await xmp.path();
  assert(xmpPath);
  assert.match(await readFile(xmpPath, 'utf8'), /Privacy flow edit/);
  const csvEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export metadata CSV' }).click();
  await csvEvent;
  const origins = [...new Set(requests.map(({ url }) => new URL(url).origin))];
  assert.deepEqual(origins, [base]);
  assert.deepEqual(errors, []);
  evidence.freeWorkflow = { origins, requests, downloads: ['XMP', 'CSV'], errors };
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  page.on('request', (request) => requests.push({ method: request.method(), url: request.url(), postData: request.postData() }));
  await page.goto(base, { waitUntil: 'networkidle' });
  const scriptOrigins = await page.locator('script[src]').evaluateAll((nodes) => [...new Set(nodes.map((node) => new URL(node.src).origin))]);
  assert.deepEqual(scriptOrigins, [base]);
  await page.getByRole('button', { name: 'View pricing' }).click();
  const token = 'verification-9-browser-token';
  await page.locator('#license-token').fill(token);
  const responsePromise = page.waitForResponse((response) => response.url().startsWith(`${api}/api/v1/products/photo-metadata-queue/verify`));
  await page.getByRole('button', { name: 'Verify license' }).click();
  const response = await responsePromise;
  const licenseRequest = requests.find(({ url }) => url.startsWith(`${api}/api/v1/products/photo-metadata-queue/verify`));
  assert(licenseRequest);
  const parsed = new URL(licenseRequest.url);
  assert.equal(licenseRequest.method, 'GET');
  assert.equal(licenseRequest.postData, null);
  assert.deepEqual([...parsed.searchParams.keys()], ['license']);
  assert.equal(parsed.searchParams.get('license'), token);
  assert.equal(response.status(), 200);
  assert.match(await page.locator('#license-message').textContent(), /not (?:valid|active)/i);
  evidence.license = { request: licenseRequest, queryKeys: [...parsed.searchParams.keys()], status: response.status(), ui: await page.locator('#license-message').textContent(), scriptOrigins };
  await context.close();
}

console.log(JSON.stringify(evidence, null, 2));
await browser.close();
