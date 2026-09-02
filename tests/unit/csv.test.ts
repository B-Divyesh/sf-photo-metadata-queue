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

  it('maps every documented heading and uses a populated alias', () => {
    const input = [
      'filename,title,caption,description,keywords,creator,photographer,rights,city,state,country,dateCreated',
      'A.jpg,Heron,,At dawn,bird; wetland,,Mira Shah,© Mira Shah,Kingston,Ontario,Canada,2026-08-20'
    ].join('\n');
    const [item] = csvToItems(input, 'shoot');
    expect(item).toMatchObject({
      fileName: 'A.jpg',
      metadata: {
        title: 'Heron', description: 'At dawn', keywords: ['bird', 'wetland'], creator: 'Mira Shah',
        rights: '© Mira Shah', city: 'Kingston', state: 'Ontario', country: 'Canada', dateCreated: '2026-08-20'
      }
    });
  });

  it('requires a filename column', () => {
    expect(() => csvToItems('title\nNo file', 'shoot')).toThrow(/filename column/);
  });

  it('escapes exported cells', () => {
    expect(escapeCsv('one, "two"')).toBe('"one, ""two"""');
  });
});
