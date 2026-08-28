import { emptyMetadata, type QueueItem } from './types';

export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted && char === '"' && input[i + 1] === '"') { field += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && input[i + 1] === '\n') i++;
      row.push(field); if (row.some((cell) => cell.trim())) rows.push(row); row = []; field = '';
    } else field += char;
  }
  row.push(field); if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

export function csvToItems(input: string, shootId: string): QueueItem[] {
  const rows = parseCsv(input);
  if (rows.length < 2) throw new Error('The CSV needs a header row and at least one photo row.');
  const headers = rows[0].map((h) => h.trim().toLowerCase().replaceAll(' ', ''));
  const fileIndex = headers.findIndex((h) => ['filename', 'file', 'image'].includes(h));
  if (fileIndex < 0) throw new Error('Add a filename column to the CSV.');
  const get = (row: string[], names: string[]) => {
    const index = headers.findIndex((h) => names.includes(h));
    return index >= 0 ? (row[index] ?? '').trim() : '';
  };
  return rows.slice(1).map((row, index) => {
    const fileName = row[fileIndex]?.trim();
    if (!fileName) throw new Error(`Row ${index + 2} has no filename.`);
    return {
      id: crypto.randomUUID(), shootId, fileName, relativePath: fileName,
      mimeType: '', size: 0, ready: false, updatedAt: Date.now(),
      metadata: {
        ...emptyMetadata(),
        title: get(row, ['title', 'headline']),
        description: get(row, ['caption', 'description']),
        keywords: get(row, ['keywords', 'tags']).split(/[;|]/).map((v) => v.trim()).filter(Boolean),
        creator: get(row, ['creator', 'author', 'photographer']),
        rights: get(row, ['rights', 'copyright']),
        city: get(row, ['city']), state: get(row, ['state', 'province']), country: get(row, ['country']),
        dateCreated: get(row, ['datecreated', 'date'])
      }
    };
  });
}

export function escapeCsv(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}
