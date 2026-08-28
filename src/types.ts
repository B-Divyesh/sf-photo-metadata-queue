export type Metadata = {
  title: string;
  description: string;
  keywords: string[];
  creator: string;
  rights: string;
  city: string;
  state: string;
  country: string;
  dateCreated: string;
};

export type QueueItem = {
  id: string;
  shootId: string;
  fileName: string;
  relativePath: string;
  mimeType: string;
  size: number;
  thumbnail?: string;
  metadata: Metadata;
  ready: boolean;
  updatedAt: number;
};

export type Shoot = {
  id: string;
  name: string;
  createdAt: number;
  vocabulary: string[];
};

export type AppData = {
  shoots: Shoot[];
  items: QueueItem[];
  activeShootId?: string;
  activeItemId?: string;
};

export const emptyMetadata = (): Metadata => ({
  title: '', description: '', keywords: [], creator: '', rights: '',
  city: '', state: '', country: '', dateCreated: ''
});
