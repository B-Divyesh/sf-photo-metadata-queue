import { describe, expect, it } from 'vitest';
import { makeXmp, renderTokens, sidecarName, validateMetadata } from '../../src/xmp';
import { emptyMetadata, type QueueItem } from '../../src/types';

const item = (overrides = {}): QueueItem => ({
  id: '1', shootId: 's', fileName: 'IMG_0042.JPG', relativePath: 'shoot/IMG_0042.JPG',
  mimeType: 'image/jpeg', size: 100, ready: false, updatedAt: 0,
  metadata: { ...emptyMetadata(), title: 'Bird & branch', description: 'A <quiet> moment', keywords: ['wildlife', 'red "wing"'], creator: "O'Neil", ...overrides }
});

describe('XMP writer', () => {
  it('escapes XML values and preserves IPTC structures', () => {
    const xmp = makeXmp(item());
    expect(xmp).toContain('Bird &amp; branch');
    expect(xmp).toContain('A &lt;quiet&gt; moment');
    expect(xmp).toContain('red &quot;wing&quot;');
    expect(xmp).toContain('O&apos;Neil');
    expect(xmp).toContain('<rdf:Bag>');
  });

  it('names sidecars without touching the original extension', () => {
    expect(sidecarName('IMG.0042.CR3')).toBe('IMG.0042.xmp');
    expect(sidecarName('untitled')).toBe('untitled.xmp');
  });

  it('validates required editorial fields', () => {
    expect(validateMetadata(item().metadata)).toEqual([]);
    expect(validateMetadata(emptyMetadata())).toHaveLength(3);
  });

  it('renders per-image tokens', () => {
    expect(renderTokens('{shoot} {sequence}: {filename}', item(), 'Wetlands', 7)).toBe('Wetlands 007: IMG_0042');
  });
});
