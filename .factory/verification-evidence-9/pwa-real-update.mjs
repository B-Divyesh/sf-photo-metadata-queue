import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const root = join(process.cwd(), 'dist');
let updated = false;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    console.log(`server ${updated ? 'v2' : 'v1'} ${url.pathname}`);
    let pathname = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, '');
    if (!pathname || ['/demo', '/privacy', '/terms'].includes(url.pathname)) pathname = 'index.html';
    const path = join(root, pathname);
    if (!(await stat(path)).isFile()) throw new Error('not found');
    let body = await readFile(path);
    if (pathname === 'sw.js' && updated) body = Buffer.from(body.toString().replace("caption-queue-v3", "caption-queue-v3-qa9"));
    response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Cache-Control': pathname === 'sw.js' ? 'no-store' : 'no-cache' });
    response.end(body);
  } catch {
    response.writeHead(404); response.end('not found');
  }
});
await new Promise((resolve) => server.listen(4199, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));
await page.goto('http://127.0.0.1:4199/demo', { waitUntil: 'networkidle' });
await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
const before = await page.evaluate(() => caches.keys());
assert(before.includes('caption-queue-v3'));
updated = true;
await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
await page.getByText('An update is ready.').waitFor();
await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting));
console.log('waiting worker ready');
await Promise.all([
  page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  page.getByRole('button', { name: 'Refresh' }).click(),
]);
await page.waitForFunction(async () => (await caches.keys()).includes('caption-queue-v3-qa9'));
const after = await page.evaluate(() => caches.keys());
assert(after.includes('caption-queue-v3-qa9'));
assert.equal(after.includes('caption-queue-v3'), false);
assert.equal(await page.locator('main').isVisible(), true);
assert.deepEqual(errors, []);
console.log(JSON.stringify({ before, updateToast: true, refreshReloaded: true, after, appVisible: true, errors }, null, 2));
await browser.close();
await new Promise((resolve) => server.close(resolve));
