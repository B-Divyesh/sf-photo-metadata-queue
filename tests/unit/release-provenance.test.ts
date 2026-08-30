import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const fixtureCommit = '0123456789abcdef0123456789abcdef01234567';

describe('release provenance', () => {
  it('writes a deterministic release marker with the complete source commit', () => {
    const directory = mkdtempSync(join(tmpdir(), 'caption-queue-release-'));
    const output = join(directory, 'release.json');

    try {
      execFileSync(process.execPath, ['scripts/write-release.mjs'], {
        cwd: root,
        env: { ...process.env, RELEASE_COMMIT: fixtureCommit, RELEASE_OUTPUT: output },
        stdio: 'pipe'
      });

      expect(JSON.parse(readFileSync(output, 'utf8'))).toEqual({ commit: fixtureCommit, schema: 1 });
      execFileSync(process.execPath, ['scripts/verify-release-provenance.mjs', `--file=${output}`, `--expected=${fixtureCommit}`], {
        cwd: root,
        stdio: 'pipe'
      });
      expect(() => execFileSync(process.execPath, ['scripts/verify-release-provenance.mjs', `--file=${output}`, '--expected=abcdefabcdefabcdefabcdefabcdefabcdefabcd'], {
        cwd: root,
        stdio: 'pipe'
      })).toThrow();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it('makes live verification require the embedded commit, the local source, and origin/main to agree', () => {
    const verifier = readFileSync(join(root, 'tests/release/verify-live.mjs'), 'utf8');
    expect(verifier).toContain("get('/release.json')");
    expect(verifier).toContain("git('ls-remote', 'origin', 'refs/heads/main')");
    expect(verifier).toContain('The live release marker does not identify this source commit');
  });
});
