import type { AppData, Metadata, QueueItem } from './types';

const shootId = 'demo-salt-marsh-2026';

const metadata = (values: Partial<Metadata>): Metadata => ({
  title: '',
  description: '',
  keywords: [],
  creator: 'Mira Shah',
  rights: '© 2026 Mira Shah',
  city: 'Kingston',
  state: 'Ontario',
  country: 'Canada',
  dateCreated: '2026-08-20',
  ...values
});

const item = (id: string, fileName: string, values: Partial<Metadata>, ready: boolean): QueueItem => ({
  id,
  shootId,
  fileName,
  relativePath: `Salt Marsh Survey/${fileName}`,
  mimeType: 'image/jpeg',
  size: 8_400_000,
  metadata: metadata(values),
  ready,
  updatedAt: Date.parse('2026-08-20T18:00:00Z')
});

export function createDemoData(): AppData {
  return {
    shoots: [{
      id: shootId,
      name: 'Salt marsh bird survey',
      createdAt: Date.parse('2026-08-20T17:30:00Z'),
      vocabulary: ['great blue heron', 'salt marsh', 'migration', 'dusk']
    }],
    items: [
      item('demo-heron-1842', 'BIRDS_1842.JPG', {
        title: 'Great blue heron lifting from reeds',
        description: 'A great blue heron lifts from cordgrass at the north edge of the marsh.',
        keywords: ['great blue heron', 'salt marsh', 'flight']
      }, true),
      item('demo-heron-1843', 'BIRDS_1843.JPG', {
        title: 'Heron crossing the tidal creek',
        description: 'A great blue heron crosses the tidal creek during the evening survey.',
        keywords: ['great blue heron', 'tidal creek', 'migration']
      }, true),
      item('demo-heron-1844', 'BIRDS_1844.JPG', {
        keywords: ['salt marsh', 'dusk']
      }, false)
    ],
    activeShootId: shootId,
    activeItemId: 'demo-heron-1842'
  };
}
