import { expect, test } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const initialCache = 'caption-queue-v4';
const updatedCache = 'caption-queue-v4-regression';
const contentTypes: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp'
};

async function listen(server: Server): Promise<number> {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Update-test server did not bind to a TCP port.');
  return address.port;
}

async function close(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

test('applying a same-URL worker update reloads once under the new controller and keeps the app usable', async ({ browser }) => {
  const root = join(process.cwd(), 'dist');
  let updated = false;
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      let pathname = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, '');
      if (!pathname || ['/demo', '/privacy', '/terms'].includes(url.pathname)) pathname = 'index.html';
      const path = join(root, pathname);
      if (!(await stat(path)).isFile()) throw new Error('not found');
      let body = await readFile(path);
      if (pathname === 'sw.js' && updated) body = Buffer.from(body.toString().replace(initialCache, updatedCache));
      response.writeHead(200, {
        'Cache-Control': pathname === 'sw.js' ? 'no-store' : 'no-cache',
        'Content-Type': contentTypes[extname(path)] ?? 'application/octet-stream'
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('not found');
    }
  });
  const port = await listen(server);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors: string[] = [];
  let reloads = 0;
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('framenavigated', (frame) => { if (updated && frame === page.mainFrame()) reloads += 1; });

  try {
    await page.goto(`http://127.0.0.1:${port}/demo`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
    await expect.poll(() => page.evaluate(() => caches.keys())).toContain(initialCache);

    updated = true;
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
    await expect(page.getByText('An update is ready.')).toBeVisible();
    await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting))).toBe(true);
    await page.evaluate(() => {
      sessionStorage.setItem('pwa-update-controller-changes', '0');
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        const count = Number(sessionStorage.getItem('pwa-update-controller-changes') ?? '0');
        sessionStorage.setItem('pwa-update-controller-changes', String(count + 1));
      });
    });

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.getByRole('button', { name: 'Refresh' }).click()
    ]);

    await expect.poll(() => page.evaluate(() => caches.keys())).toContain(updatedCache);
    expect(await page.evaluate(() => caches.keys())).not.toContain(initialCache);
    expect(await page.evaluate(() => sessionStorage.getItem('pwa-update-controller-changes'))).toBe('1');
    expect(reloads).toBe(1);
    await expect(page.getByRole('heading', { name: 'Salt marsh bird survey', level: 1 })).toBeVisible();
    await page.locator('#title').fill('Usable after worker update');
    await expect(page.locator('#title')).toHaveValue('Usable after worker update');
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await close(server);
  }
});
