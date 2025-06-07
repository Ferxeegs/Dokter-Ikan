// // lib/indexedDB.ts
// import { openDB } from 'idb';

// const DB_NAME = 'FishSpeciesDB';
// const STORE_NAME = 'species';

// export async function getDB() {
//   return openDB(DB_NAME, 1, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains(STORE_NAME)) {
//         const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
//       }
//     },
//   });
// }

// export async function saveSpeciesList(speciesList: any[]) {
//   const db = await getDB();
//   const tx = db.transaction(STORE_NAME, 'readwrite');
//   speciesList.forEach(species => tx.store.put(species));
//   await tx.done;
// }

// export async function getAllSpecies() {
//   const db = await getDB();
//   return db.getAll(STORE_NAME);
// }
