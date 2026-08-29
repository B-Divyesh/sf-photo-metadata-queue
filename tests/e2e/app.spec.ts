import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const csv = 'filename,title,caption,keywords,photographer,rights,city,country,dateCreated\nIMG_0001.jpg,Marsh heron,A heron at the edge of the marsh,bird; wetland,Mira Shah,© Mira Shah,Kingston,Canada,2026-08-20\nIMG_0002.jpg,,,,,,,,2026-08-20';

async function tabTo(page: Page, selector: string, limit = 80): Promise<void> {
  for (let step = 0; step < limit; step += 1) {
    await page.keyboard.press('Tab');
    if (await page.locator(selector).evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error(`Keyboard focus did not reach ${selector} after ${limit} Tab presses`);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    indexedDB.deleteDatabase('caption-queue');
    localStorage.clear();
  });
  await page.reload();
});

test('imports a CSV, edits a record, and exports valid XMP', async ({ page }) => {
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await expect(page.getByRole('heading', { name: 'wetlands', level: 1 })).toBeVisible();
  await expect(page.getByText('IMG_0001.jpg', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: /IMG_0002.jpg/ }).click();
  await page.locator('#title').fill('Heron returning');
  await page.locator('#description').fill('A heron returns to the marsh.');
  await page.locator('#keywords').fill('bird; wetland');
  await page.getByRole('button', { name: /Mark ready/ }).click();
  await expect(page.getByText('1 of 2 ready')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export this XMP' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('IMG_0002.xmp');
});

test('a first license verification accepts only a valid verdict', async ({ page }) => {
  const cases = [
    {
      name: 'invalid verdict',
      fulfill: { status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) },
      message: 'That license is not active. Check the token and try again.'
    },
    {
      name: 'network failure',
      abort: 'failed' as const,
      message: 'Could not verify this license right now. Check your connection and try again.'
    },
    {
      name: 'rate limit',
      fulfill: { status: 429, headers: { 'Retry-After': '4', 'Access-Control-Expose-Headers': 'Retry-After' } },
      message: 'The license service asked us to wait 4 seconds before retrying.'
    },
    {
      name: 'rate limit without an exposed header',
      fulfill: { status: 429, headers: { 'Retry-After': '4', 'Access-Control-Expose-Headers': 'X-Unrelated' } },
      message: 'The license service asked us to wait 4 seconds before retrying.'
    }
  ];

  for (const scenario of cases) {
    let verificationRequests = 0;
    await page.route('https://api.sociobot.in/**', async (route) => {
      verificationRequests += 1;
      if ('abort' in scenario) await route.abort(scenario.abort);
      else await route.fulfill(scenario.fulfill);
    });
    await page.getByRole('button', { name: 'View pricing' }).click();
    await page.getByLabel('Have a license? Paste it here').fill(`fixture-${scenario.name}`);
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.locator('#license-message')).toHaveText(scenario.message);
    await expect(page.locator('#license-button')).toHaveText('View pricing');
    await expect(page.getByText('Field edition is active')).toHaveCount(0);
    expect(verificationRequests).toBe(1);

    if (scenario.name.startsWith('rate limit')) {
      await page.getByRole('button', { name: 'Verify license' }).click();
      await expect(page.locator('#license-message')).toHaveText(scenario.message);
      expect(verificationRequests).toBe(1);
    }

    await page.unroute('https://api.sociobot.in/**');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  }
});

test('only a fresh cached valid verdict stays unlocked during a verification outage', async ({ page }) => {
  let verificationRequests = 0;
  await page.route('https://api.sociobot.in/**', async (route) => {
    verificationRequests += 1;
    await route.abort('failed');
  });
  await page.evaluate(() => {
    localStorage.setItem('sb_license:photo-metadata-queue', 'previously-verified-token');
    localStorage.setItem('sb_license:photo-metadata-queue:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.reload();
  await expect(page.locator('#license-button')).toHaveText('Field edition');
  expect(verificationRequests).toBe(0);

  await page.evaluate(() => localStorage.setItem('sb_license:photo-metadata-queue:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() - 86_400_001 })));
  await page.reload();
  await expect(page.locator('#license-button')).toHaveText('View pricing');
  expect(verificationRequests).toBe(1);
});

test('landing and editor have no serious axe violations', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: 'Change color theme' }).click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  expect(await page.locator('h1').count()).toBe(1);
  expect(consoleErrors).toEqual([]);
});

test('keyboard focus reaches visible import buttons and each activates its file picker on desktop and mobile', async ({ page }) => {
  const importButtons = [
    ['Choose photo folder', 'photo-input'],
    ['Import CSV', 'csv-input'],
    ['Restore backup', 'backup-input']
  ] as const;

  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const [index, [name, inputId]] of importButtons.entries()) {
      const button = page.getByRole('button', { name });
      await tabTo(page, `[data-file-picker="${inputId}"]`);
      await expect(button).toBeFocused();
      await expect(button).toHaveCSS('outline-style', 'solid');
      await expect(button).toHaveCSS('outline-width', '3px');
      expect(await button.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.width >= 44 && box.height >= 44;
      })).toBe(true);
      await expect(page.locator(`#${inputId}`)).not.toBeFocused();
      await expect(page.locator(`#${inputId}`)).toHaveAttribute('tabindex', '-1');
      const picker = page.waitForEvent('filechooser');
      await page.keyboard.press(index === 1 ? 'Space' : 'Enter');
      expect(await (await picker).element().getAttribute('id')).toBe(inputId);
    }
  }
});

test('workspace backup import uses the same visible keyboard control', async ({ page }) => {
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  const button = page.getByRole('button', { name: 'Import workspace backup' });
  await tabTo(page, '[data-file-picker="backup-input"]');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-width', '3px');
  await expect(page.locator('#backup-input')).toHaveAttribute('tabindex', '-1');
  const picker = page.waitForEvent('filechooser');
  await page.keyboard.press('Space');
  expect(await (await picker).element().getAttribute('id')).toBe('backup-input');
});

test('mobile editor touch controls meet the 44px target contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });

  const controls = [
    page.locator('[data-token]'),
    page.locator('[data-remove-keyword]'),
    page.getByRole('button', { name: 'Add term' })
  ];
  for (const control of controls) {
    const count = await control.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      const box = await control.nth(index).boundingBox();
      expect(box, `control ${index} should have a rendered box`).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('all visible mobile links and buttons meet the 44px touch target contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(path);
    const undersized = await page.locator('a[href], button').evaluateAll((elements) => elements
      .filter((element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
      })
      .map((element) => {
        const box = element.getBoundingClientRect();
        return { label: element.getAttribute('aria-label') || element.textContent?.trim() || element.tagName, width: box.width, height: box.height };
      })
      .filter(({ width, height }) => width < 44 || height < 44));
    expect(undersized, `${path} has undersized touch targets`).toEqual([]);
  }
});

test('transient mobile toast actions meet the 44px touch target contract', async ({ page }) => {
  const expectTouchTarget = async (name: string): Promise<void> => {
    const button = page.getByRole('button', { name });
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box, `${name} should have a rendered box`).not.toBeNull();
    expect(box!.width, `${name} should be at least 44px wide`).toBeGreaterThanOrEqual(44);
    expect(box!.height, `${name} should be at least 44px tall`).toBeGreaterThanOrEqual(44);
  };

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');

  // Validation failures use the dismissible notice toast.
  await page.getByRole('button', { name: /Queue 1\/3/ }).click();
  await page.getByRole('button', { name: /BIRDS_1844.JPG/ }).click();
  await page.getByRole('button', { name: 'Mark ready & next' }).click();
  await expectTouchTarget('Dismiss message');
  await page.getByRole('button', { name: 'Dismiss message' }).click();

  // Batch edits use the reversible Undo toast. Seed the recorded valid verdict
  // before loading the real workspace, just as the Field-edition claim does.
  await Promise.all([
    page.waitForURL('http://127.0.0.1:4173/'),
    page.getByRole('button', { name: 'Start for real' }).click()
  ]);
  await page.evaluate(() => {
    localStorage.setItem('sb_license:photo-metadata-queue', 'touch-target-fixture');
    localStorage.setItem('sb_license:photo-metadata-queue:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.reload();
  await page.locator('#csv-input').setInputFiles({ name: 'touch-targets.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await page.getByRole('button', { name: /Queue 1\/2/ }).click();
  await page.getByRole('button', { name: 'Batch edit' }).click();
  await page.locator('#batch-title').fill('Checked {sequence}');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Apply changes' }).click();
  await expectTouchTarget('Undo');
  await page.getByRole('button', { name: 'Undo' }).click();

  // A waiting service worker uses the refresh toast.
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.evaluate(() => navigator.serviceWorker.register('/sw.js?qa-update=touch-target'));
  await expectTouchTarget('Refresh');
});

test('primary routes reflow without horizontal scrolling at 200 percent text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(path);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} should reflow at 200% text`).toBe(true);
  }
});

test('mobile Back and Forward restore route scroll and focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.locator('.nav-privacy').evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { name: 'Keep your photo metadata private' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 280));
  await expect.poll(() => page.evaluate(() => ({ y: window.scrollY, saved: history.state?.scrollY }))).toEqual({ y: 280, saved: 280 });

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Caption large shoots without changing originals' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.goForward();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { name: 'Keep your photo metadata private' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(280);
});

test('demo uses clear singular and plural review status wording', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('1 record still needs review.')).toBeVisible();
  await page.locator('#title').fill('Edited ready record');
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page.getByText('2 records still need review.')).toBeVisible();
});

test('designed 404 has route metadata, the shared navigation shell, and no serious axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Caption Queue');
  await expect(page.getByRole('heading', { name: 'Page not found', level: 1 })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /requested Caption Queue page/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://photo-metadata-queue.sociobot.in/404.html');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Caption Queue');
  await expect(page.getByRole('link', { name: 'Privacy', exact: true }).first()).toHaveAttribute('href', '/privacy');
  await expect(page.getByRole('link', { name: 'Terms', exact: true })).toHaveAttribute('href', '/terms');
  await expect(page.locator('footer')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const undersized = await page.locator('a[href], button').evaluateAll((elements) => elements
    .filter((element) => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
    })
    .filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width < 44 || box.height < 44;
    })
    .map((element) => element.textContent?.trim()));
  expect(undersized).toEqual([]);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('unfinished metadata moves focus to its validation summary', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /BIRDS_1844.JPG/ }).click();
  await page.getByRole('button', { name: 'Mark ready & next' }).click();
  await expect(page.locator('.validation')).toBeFocused();
  await expect(page.locator('.validation')).toHaveCSS('outline-width', '3px');
  await expect(page.locator('#live')).toHaveText('2 required items remain. Add a title.');
});

test('closed mobile queue is inert and opening it manages keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  const queue = page.locator('.queue-panel');
  await expect(queue).toHaveAttribute('inert', '');
  await expect(queue).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('heading', { name: 'wetlands', level: 1 })).toBeVisible();
  const toggle = page.getByRole('button', { name: /Queue/ });
  await toggle.click();
  await expect(queue).not.toHaveAttribute('inert');
  await expect(page.getByRole('button', { name: 'Close queue' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(queue).toHaveAttribute('inert', '');
  await expect(toggle).toBeFocused();
});

test('installed shell reopens offline at mobile width', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await expect(page.getByRole('heading', { name: 'wetlands', level: 1 })).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'wetlands', level: 1 })).toBeVisible();
  await expect(page.getByText('IMG_0001.jpg', { exact: true }).first()).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
});

test('installed shell announces a waiting service-worker update', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.evaluate(() => navigator.serviceWorker.register('/sw.js?qa-update=1'));
  const toast = page.getByText('An update is ready.');
  await expect(toast).toBeVisible();
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting))).toBe(true);
  expect(errors).toEqual([]);
});
