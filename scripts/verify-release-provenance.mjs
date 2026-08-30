import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const shaPattern = /^[0-9a-f]{40}$/;
const args = process.argv.slice(2);
const urlArgument = args.find((argument) => !argument.startsWith('--'));
const expectedArgument = args.find((argument) => argument.startsWith('--expected='))?.slice('--expected='.length);
const fileArgument = args.find((argument) => argument.startsWith('--file='))?.slice('--file='.length);
const requireRemote = args.includes('--require-remote');

function git(...gitArgs) {
  return execFileSync('git', gitArgs, { cwd: process.cwd(), encoding: 'utf8' }).trim();
}

function parseRelease(value, label) {
  const parsed = JSON.parse(value);
  assert.equal(parsed.schema, 1, `${label} must use release schema 1`);
  assert.equal(typeof parsed.commit, 'string', `${label} must include a commit`);
  assert.match(parsed.commit, shaPattern, `${label} must contain a full lowercase Git SHA`);
  return parsed.commit;
}

const expected = (expectedArgument ?? git('rev-parse', 'HEAD')).toLowerCase();
assert.match(expected, shaPattern, 'Expected release commit must be a full Git SHA');

const releaseFile = resolve(process.cwd(), fileArgument ?? 'dist/release.json');
const local = parseRelease(await readFile(releaseFile, 'utf8'), releaseFile);
assert.equal(local, expected, 'The built release marker does not identify the source commit that built it');

if (requireRemote) {
  const remote = git('ls-remote', 'origin', 'refs/heads/main').split(/\s+/)[0];
  assert.equal(remote, expected, 'origin/main is not the source commit identified by this release');
}

if (urlArgument) {
  const base = new URL(urlArgument);
  const response = await fetch(new URL('/release.json', base), { cache: 'no-store' });
  assert.equal(response.status, 200, `Live release marker returned ${response.status}`);
  const live = parseRelease(await response.text(), `${base.origin}/release.json`);
  assert.equal(live, expected, 'The live release marker does not identify the expected source commit');
}

console.log(`Release provenance verified for ${expected}${urlArgument ? ` at ${new URL(urlArgument).origin}` : ''}.`);
