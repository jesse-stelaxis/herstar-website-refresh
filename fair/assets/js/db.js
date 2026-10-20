// Leads are kept in IndexedDB on the tablet, because the venue network can
// vanish at any moment. Nothing here needs a server; sync is optional (staff.js).
// A ~30-line wrapper rather than a library such as idb-keyval: the kiosk must
// load with no CDN, there is no build step, and only four operations are used.

const DB_NAME = 'hosun-fair';
const STORE = 'leads';

let opening;

function open() {
  opening ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: 'id' });
      store.createIndex('createdAt', 'createdAt');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return opening;
}

async function run(mode, work) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const result = work(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(result?.result ?? result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const putLead = (lead) => run('readwrite', (s) => s.put(lead));
export const allLeads = () => run('readonly', (s) => s.index('createdAt').getAll());
export const clearLeads = () => run('readwrite', (s) => s.clear());
export const countLeads = () => run('readonly', (s) => s.count());
