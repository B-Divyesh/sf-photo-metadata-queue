import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const shaPattern = /^[0-9a-f]{40}$/;
const output = resolve(process.cwd(), process.env.RELEASE_OUTPUT ?? 'dist/release.json');

function git(...args) {
  return execFileSync('git', args, { cwd: process.cwd(), encoding: 'utf8' }).trim();
}

const commit = (process.env.RELEASE_COMMIT ?? git('rev-parse', 'HEAD')).toLowerCase();
if (!shaPattern.test(commit)) {
  throw new Error('Release provenance requires a full 40-character Git commit SHA.');
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ commit, schema: 1 })}\n`, 'utf8');
console.log(`Wrote release provenance for ${commit} to ${output}`);
