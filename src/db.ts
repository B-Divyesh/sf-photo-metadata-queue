import type { AppData } from './types';

const DB_NAME = 'caption-queue';
const STORE = 'workspace';
const KEY = 'current';
const initial: AppData = { shoots: [], items: [] };

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadData(): Promise<AppData> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE).objectStore(STORE).get(KEY);
      request.onsuccess = () => resolve(request.result ?? structuredClone(initial));
      request.onerror = () => reject(request.error);
    });
  } catch { return structuredClone(initial); }
}

export async function saveData(data: AppData): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(data, KEY);
    request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
  });
}
