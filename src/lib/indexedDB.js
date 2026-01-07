const DB_NAME = 'scorebookDB';
const DB_VERSION = 1;
const TOURNAMENT_STORE = 'tournaments';

export function openDB() {
  return new Promise((resolve, reject) => {
    // IndexedDB exists only in browser
    if (typeof window === 'undefined') {
      reject('IndexedDB is not available on server');
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create tournaments table
      if (!db.objectStoreNames.contains(TOURNAMENT_STORE)) {
        const store = db.createObjectStore(TOURNAMENT_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });

        // Indexes
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('tieBreak', 'tieBreak', { unique: false });
        store.createIndex('logo', 'logo', { unique: false });
        store.createIndex('runPoint', 'runPoint', { unique: false });
        store.createIndex('wicketPoint', 'wicketPoint', { unique: false });
        store.createIndex('catchPoint', 'catchPoint', { unique: false });
        store.createIndex('stumpingPoint', 'stumpingPoint', { unique: false });
        store.createIndex('runOutPoint', 'runOutPoint', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addTournament(tournament) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('tournaments', 'readwrite');
    const store = tx.objectStore('tournaments');

    const request = store.add({
      name: tournament.name,
      tieBreak: tournament.tieBreak,
      logo: tournament.logo,
      runPoint: tournament.runPoint,
      wicketPoint: tournament.wicketPoint,
      catchPoint: tournament.catchPoint,
      stumpingPoint: tournament.stumpingPoint,
      runOutPoint: tournament.runOutPoint,
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllTournaments() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('tournaments', 'readonly');
    const store = tx.objectStore('tournaments');

    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
