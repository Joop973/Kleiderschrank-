import type { FotoSpeicher } from './fotoSpeicher';

export type { FotoSpeicher } from './fotoSpeicher';

const DB_NAME = 'schrank-fotos';
const ABLAGE = 'fotos';

function oeffne(): Promise<IDBDatabase> {
  return new Promise((aufloesen, ablehnen) => {
    const anfrage = indexedDB.open(DB_NAME, 1);
    anfrage.onupgradeneeded = () => anfrage.result.createObjectStore(ABLAGE);
    anfrage.onsuccess = () => aufloesen(anfrage.result);
    anfrage.onerror = () => ablehnen(anfrage.error);
  });
}

async function mitAblage<T>(
  modus: IDBTransactionMode,
  arbeit: (ablage: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await oeffne();
  try {
    return await new Promise<T>((aufloesen, ablehnen) => {
      const anfrage = arbeit(db.transaction(ABLAGE, modus).objectStore(ABLAGE));
      anfrage.onsuccess = () => aufloesen(anfrage.result);
      anfrage.onerror = () => ablehnen(anfrage.error);
    });
  } finally {
    db.close();
  }
}

const adressen = new Map<string, string>();

/** Fotos als Blobs in IndexedDB des Browsers (Prototyp, Plan 7.10). */
export const fotoSpeicher: FotoSpeicher = {
  async speichere(id, daten) {
    await mitAblage('readwrite', (a) => a.put(daten, id));
    const alt = adressen.get(id);
    if (alt) URL.revokeObjectURL(alt);
    adressen.delete(id);
  },
  async ladeAdresse(id) {
    const vorhanden = adressen.get(id);
    if (vorhanden) return vorhanden;
    const daten = await mitAblage<Blob | undefined>('readonly', (a) => a.get(id));
    if (!daten) return null;
    const adresse = URL.createObjectURL(daten);
    adressen.set(id, adresse);
    return adresse;
  },
  async loesche(id) {
    await mitAblage('readwrite', (a) => a.delete(id));
    const alt = adressen.get(id);
    if (alt) URL.revokeObjectURL(alt);
    adressen.delete(id);
  },
  async bitteUmDauerhaftenSpeicher() {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return navigator.storage.persist();
  },
};
