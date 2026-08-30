import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const base = new URL(process.argv[2] ?? 'https://photo-metadata-queue.sociobot.in/');
const dist = resolve(process.cwd(), 'dist');
const shaPattern = /^[0-9a-f]{40}$/;

function git(...args) {
  return execFileSync('git', args, { cwd: process.cwd(), encoding: 'utf8' }).trim();
}

function parseRelease(value, label) {
  const parsed = JSON.parse(value);
  assert.equal(parsed.schema, 1, `${label} must use release schema 1`);
  assert.equal(typeof parsed.commit, 'string', `${label} must include a commit`);
  assert.match(parsed.commit, shaPattern, `${label} must contain a full lowercase Git SHA`);
  return parsed.commit;
}

const sourceCommit = git('rev-parse', 'HEAD').toLowerCase();
assert.match(sourceCommit, shaPattern, 'The local source must be a full Git commit SHA');
const publishedMain = git('ls-remote', 'origin', 'refs/heads/main').split(/\s+/)[0];
assert.equal(publishedMain, sourceCommit, 'origin/main must be the source commit before live release verification');
const localRelease = parseRelease(await readFile(join(dist, 'release.json'), 'utf8'), 'dist/release.json');
assert.equal(localRelease, sourceCommit, 'dist/release.json must identify the source commit that built it');

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  }));
  return files.flat();
}

async function get(path) {
  const response = await fetch(new URL(path, base), {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' }
  });
  assert.equal(response.status, 200, `${path} returned ${response.status}`);
  return response;
}

const htmlResponse = await get('/');
const htmlBytes = Buffer.from(await htmlResponse.arrayBuffer());
assert.deepEqual(htmlBytes, await readFile(join(dist, 'index.html')), 'live HTML does not match dist/index.html');

const csp = htmlResponse.headers.get('content-security-policy') ?? '';
assert.match(csp, /default-src 'self'/, 'CSP must default to same origin');
assert.match(csp, /frame-ancestors 'none'/, 'CSP must prohibit framing');
assert.match(csp, /object-src 'none'/, 'CSP must prohibit plugins');
assert.equal(htmlResponse.headers.get('x-frame-options'), 'DENY');
const permissions = htmlResponse.headers.get('permissions-policy') ?? '';
for (const feature of ['camera=()', 'geolocation=()', 'microphone=()', 'payment=()', 'usb=()']) {
  assert.ok(permissions.includes(feature), `Permissions-Policy must include ${feature}`);
}
assert.match(htmlResponse.headers.get('cache-control') ?? '', /no-(?:cache|store)/, 'HTML must not be immutable');

const liveReleaseResponse = await get('/release.json');
const liveRelease = parseRelease(await liveReleaseResponse.text(), `${base.origin}/release.json`);
assert.equal(liveRelease, sourceCommit, 'The live release marker does not identify this source commit');

const localFiles = (await filesBelow(dist)).filter((path) => !path.endsWith('staticwebapp.config.json'));
for (const localPath of localFiles) {
  const path = `/${relative(dist, localPath).replaceAll('\\', '/')}`;
  if (path === '/index.html') continue;
  const response = await get(path);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(localPath), `${path} does not match the built artifact`);
}

const assetPath = `/${relative(dist, localFiles.find((path) => /assets\/index-.*\.js$/.test(path))).replaceAll('\\', '/')}`;
const assetResponse = await get(assetPath);
const assetCache = assetResponse.headers.get('cache-control') ?? '';
assert.match(assetCache, /max-age=31536000/, 'hashed assets must cache for one year');
assert.match(assetCache, /immutable/, 'hashed assets must be immutable');

const workerResponse = await get('/sw.js');
assert.match(workerResponse.headers.get('cache-control') ?? '', /no-(?:cache|store)/, 'service worker must revalidate');
const manifestResponse = await get('/manifest.webmanifest');
assert.match(manifestResponse.headers.get('content-type') ?? '', /^application\/manifest\+json\b/);

for (const route of ['/demo', '/privacy', '/terms']) {
  const response = await get(route);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), htmlBytes, `${route} is not the SPA shell`);
}

const missingResponse = await fetch(new URL('/this-page-does-not-exist', base), { redirect: 'manual' });
assert.equal(missingResponse.status, 404, 'unknown routes must return HTTP 404');
const missingBytes = Buffer.from(await missingResponse.arrayBuffer());
assert.deepEqual(missingBytes, await readFile(join(dist, '404.html')), 'unknown routes must use the designed 404 page');
const missingHtml = missingBytes.toString('utf8');
for (const expected of ['<h1>Page not found</h1>', 'name="description"', 'rel="canonical"', 'property="og:title"', 'href="/privacy"', 'href="/terms"', '<footer>']) {
  assert.ok(missingHtml.includes(expected), `404 shell is missing ${expected}`);
}

console.log(`Live release verified: ${sourceCommit}; ${localFiles.length} artifacts match, response policies, SPA routes, and the 404 response pass at ${base.origin}`);
