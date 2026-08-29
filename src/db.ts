import type { AppData } from './types';

export type StorageScope = 'real' | 'demo';

const DB_NAMES: Record<StorageScope, string> = {
  real: 'caption-queue',
  demo: 'demo:caption-queue'
};
const STORE = 'workspace';
const KEY = 'current';
const initial: AppData = { shoots: [], items: [] };

function openDb(scope: StorageScope): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAMES[scope], 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadData(scope: StorageScope = 'real'): Promise<AppData> {
  try {
    const db = await openDb(scope);
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE).objectStore(STORE).get(KEY);
      request.onsuccess = () => {
        const result = request.result ?? structuredClone(initial);
        db.close();
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  } catch { return structuredClone(initial); }
}

export async function saveData(data: AppData, scope: StorageScope = 'real'): Promise<void> {
  const db = await openDb(scope);
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(data, KEY);
    request.onsuccess = () => { db.close(); resolve(); };
    request.onerror = () => reject(request.error);
  });
}

export async function clearData(scope: StorageScope): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAMES[scope]);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error(`Could not clear ${scope} workspace storage.`));
  });
}
