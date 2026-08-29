import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };

const root = process.cwd();
const claims = JSON.parse(readFileSync(resolve(root, '.factory/claims.json'), 'utf8')) as Claim[];
const claimTests = readFileSync(resolve(root, 'tests/e2e/claims.spec.ts'), 'utf8');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const playwrightConfig = readFileSync(resolve(root, 'playwright.config.ts'), 'utf8');

describe('factory verification artifacts', () => {
  it('maps every declared claim to exactly one tagged browser test', () => {
    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.claim).not.toBe('');
      expect(claim.where).not.toBe('');
      expect(claim.sandbox).not.toBe('');
      expect(claim.test).toBe(`npm run test:e2e -- --grep @claim:${claim.id}`);
      expect(claimTests.match(new RegExp(`@claim:${claim.id}\\b`, 'g'))).toHaveLength(1);
    }
  });

  it('builds the production artifact before Playwright serves clean-clone claim tests', () => {
    expect(playwrightConfig).toContain("command: 'npm run build && npm run preview'");
    expect(playwrightConfig).toContain('reuseExistingServer: false');
  });

  it('serializes browser tests that share origin-scoped service-worker state', () => {
    expect(playwrightConfig).toContain('workers: 1');
  });

  it('ships canonical, social-card, and mobile-icon metadata', () => {
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('name="twitter:card"');
    expect(html).toContain('rel="apple-touch-icon"');
  });
});
