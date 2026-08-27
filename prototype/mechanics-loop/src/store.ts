/**
 * Kept takes live here so the next sitting on this phone can montage
 * them without dropping files in the repo. The shared pool is Blob.
 */

export type StoredTake = {
  id: string
  pool: string
  url: string
}

type Row = {
  id: string
  pool: string
  blob: Blob
}

const DB_NAME = 'onkery'
const DB_VERSION = 1
const STORE = 'takes'

const urls = new Map<string, string>()

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('pool', 'pool', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('idb open'))
  })
}

function requestOf<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('idb'))
  })
}

function asRow(value: unknown): Row | null {
  if (typeof value !== 'object' || value === null) return null
  if (!('id' in value) || !('pool' in value) || !('blob' in value)) return null
  const id = value.id
  const pool = value.pool
  const blob = value.blob
  if (typeof id !== 'string' || typeof pool !== 'string') return null
  if (!(blob instanceof Blob)) return null
  return { id, pool, blob }
}

export async function saveTake(pool: string, blob: Blob): Promise<string> {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  const db = await openDb()
  try {
    await requestOf(db.transaction(STORE, 'readwrite').objectStore(STORE).put({ id, pool, blob }))
  } finally {
    db.close()
  }
  urls.set(id, URL.createObjectURL(blob))
  return id
}

export async function takesFor(pool: string): Promise<StoredTake[]> {
  const db = await openDb()
  try {
    const index = db.transaction(STORE, 'readonly').objectStore(STORE).index('pool')
    const rows = await requestOf(index.getAll(pool))
    const out: StoredTake[] = []
    if (!Array.isArray(rows)) return out
    for (const raw of rows) {
      const row = asRow(raw)
      if (!row) continue
      let url = urls.get(row.id)
      if (!url) {
        url = URL.createObjectURL(row.blob)
        urls.set(row.id, url)
      }
      out.push({ id: row.id, pool: row.pool, url })
    }
    return out
  } finally {
    db.close()
  }
}
