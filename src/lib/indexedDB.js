const DB_NAME = 'scorebookDB';
const DB_VERSION = 2; // ⬅️ bumped version
const TOURNAMENT_STORE = 'tournaments';
const TEAM_STORE = 'teams';

export function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('IndexedDB is not available on server');
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      /* =======================
         TOURNAMENTS TABLE
      ======================= */
      if (!db.objectStoreNames.contains(TOURNAMENT_STORE)) {
        const store = db.createObjectStore(TOURNAMENT_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });

        store.createIndex('name', 'name', { unique: false });
        store.createIndex('tieBreak', 'tieBreak', { unique: false });
        store.createIndex('logo', 'logo', { unique: false });
        store.createIndex('runPoint', 'runPoint', { unique: false });
        store.createIndex('wicketPoint', 'wicketPoint', { unique: false });
        store.createIndex('catchPoint', 'catchPoint', { unique: false });
        store.createIndex('stumpingPoint', 'stumpingPoint', { unique: false });
        store.createIndex('runOutPoint', 'runOutPoint', { unique: false });
      }

      /* =======================
         TEAMS TABLE (NEW)
      ======================= */
      if (!db.objectStoreNames.contains(TEAM_STORE)) {
        const teamStore = db.createObjectStore(TEAM_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });

        teamStore.createIndex('tournamentId', 'tournamentId', { unique: false });
        teamStore.createIndex('teamKey', 'teamKey', { unique: false });
        teamStore.createIndex('teamName', 'teamName', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/* =======================
   TOURNAMENT METHODS
======================= */

export async function addTournament(tournament) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TOURNAMENT_STORE, 'readwrite');
    const store = tx.objectStore(TOURNAMENT_STORE);

    const request = store.add({
      name: tournament.name,
      tieBreak: tournament.tieBreak,
      logo: tournament.logo,
      runPoint: tournament.runPoint,
      wicketPoint: tournament.wicketPoint,
      catchPoint: tournament.catchPoint,
      stumpingPoint: tournament.stumpingPoint,
      runOutPoint: tournament.runOutPoint,
      createdAt: new Date().toISOString(),
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateTournament(tournament) {
  if (!tournament.id) {
    throw new Error('Tournament ID is required for update');
  }

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TOURNAMENT_STORE, 'readwrite');
    const store = tx.objectStore(TOURNAMENT_STORE);

    const request = store.put({
      ...tournament,
      updatedAt: new Date().toISOString(),
    });

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllTournaments() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TOURNAMENT_STORE, 'readonly');
    const store = tx.objectStore(TOURNAMENT_STORE);

    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/* =======================
   TEAM METHODS
======================= */

export async function addTeams(teamObject, tournamentId = null) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TEAM_STORE, 'readwrite');
    const store = tx.objectStore(TEAM_STORE);

    Object.entries(teamObject).forEach(([teamKey, teamName]) => {
      store.add({
        teamKey,               // team1 / team2
        teamName,              // mani / jtah
        tournamentId,          // optional
        createdAt: new Date().toISOString(),
      });
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateTeam(team) {
  if (!team.id) throw new Error('Team ID is required');

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TEAM_STORE, 'readwrite');
    const store = tx.objectStore(TEAM_STORE);

    const request = store.put({
      ...team,
      updatedAt: new Date().toISOString(),
    });

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function getTeamsByTournament(tournamentId) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TEAM_STORE, 'readonly');
    const store = tx.objectStore(TEAM_STORE);

    let request;

    // 🔹 Case 1: Get ALL teams
    if (tournamentId === undefined) {
      request = store.getAll();
    }
    // 🔹 Case 2: Get teams without tournament
    else if (tournamentId === null) {
      const index = store.index('tournamentId');
      request = index.getAll(null);
    }
    // 🔹 Case 3: Get teams for specific tournament
    else {
      const index = store.index('tournamentId');
      request = index.getAll(tournamentId);
    }

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}





export function deleteIndexedDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('IndexedDB not available');
      return;
    }

    const request = indexedDB.deleteDatabase('scorebookDB');

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      console.warn('IndexedDB deletion blocked. Close other tabs.');
    };
  });
}


