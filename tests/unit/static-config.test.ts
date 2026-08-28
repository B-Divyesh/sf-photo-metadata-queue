import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type StaticConfig = {
  globalHeaders: Record<string, string>;
  routes: Array<{ route: string; headers?: Record<string, string> }>;
  mimeTypes: Record<string, string>;
};

const config = JSON.parse(readFileSync(resolve(process.cwd(), 'public/staticwebapp.config.json'), 'utf8')) as StaticConfig;

describe('static deployment response policy', () => {
  it('uses a restrictive privacy policy and anti-framing headers', () => {
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("connect-src 'self' https://api.sociobot.in");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['X-Frame-Options']).toBe('DENY');
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(config.globalHeaders['Permissions-Policy']).toContain('payment=()');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  });

  it('keeps documents and the worker revalidating while immutable assets cache for a year', () => {
    expect(config.globalHeaders['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
    expect(config.routes.find((route) => route.route === '/sw.js')?.headers?.['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  });
});
