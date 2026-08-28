import { describe, expect, it } from 'vitest';
import { csvToItems, escapeCsv, parseCsv } from '../../src/csv';

describe('CSV import', () => {
  it('parses quoted commas and doubled quotes', () => {
    expect(parseCsv('filename,caption\nA.jpg,"Bird, saying ""hello"""')).toEqual([
      ['filename', 'caption'], ['A.jpg', 'Bird, saying "hello"']
    ]);
  });

  it('maps common headers to metadata', () => {
    const [item] = csvToItems('filename,title,caption,keywords,photographer\nA.jpg,Heron,At dawn,"bird; wetland",Mira', 'shoot');
    expect(item.fileName).toBe('A.jpg');
    expect(item.metadata.keywords).toEqual(['bird', 'wetland']);
    expect(item.metadata.creator).toBe('Mira');
  });

  it('requires a filename column', () => {
    expect(() => csvToItems('title\nNo file', 'shoot')).toThrow(/filename column/);
  });

  it('escapes exported cells', () => {
    expect(escapeCsv('one, "two"')).toBe('"one, ""two"""');
  });
});
