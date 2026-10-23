import type { Monitor, Service, UserContent, Video } from '../types'
import { load, save } from './storage'

export const MY_MONITOR_ID = 'me-monitor'
export const MAX_VIDEO_MB = 60

export const loadUserContent = () => load<UserContent | null>('myMonitor', null)
export const saveUserContent = (c: UserContent | null) => save('myMonitor', c)

/** Catálogo = datos de demostración + el perfil del usuario si está publicado. */
export function mergeUserContent<T extends { monitors: Monitor[]; services: Service[]; videos: Video[]; availability: { monitorId: string }[] }>(
  base: T, c: UserContent | null, blobUrls: Record<string, string>,
): T {
  if (!c || !c.published) return base
  const videos = c.videos.map((v) => (v.blobId ? { ...v, src: blobUrls[v.blobId] } : v))
  return {
    ...base,
    monitors: [c.monitor, ...base.monitors],
    services: [...c.services, ...base.services],
    videos: [...videos, ...base.videos],
    availability: [c.availability, ...base.availability],
  }
}

/* ---- Vídeos subidos: se guardan como Blob en IndexedDB (localStorage no admite ficheros grandes) ---- */
const DB = 'sportly-videos'
const open = () => new Promise<IDBDatabase>((res, rej) => {
  const r = indexedDB.open(DB, 1)
  r.onupgradeneeded = () => r.result.createObjectStore('blobs')
  r.onsuccess = () => res(r.result)
  r.onerror = () => rej(r.error)
})
async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open()
  return new Promise<T>((res, rej) => {
    const r = fn(db.transaction('blobs', mode).objectStore('blobs'))
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
}
export const putBlob = (id: string, b: Blob) => tx('readwrite', (s) => s.put(b, id))
export const getBlob = (id: string) => tx<Blob | undefined>('readonly', (s) => s.get(id))
export const deleteBlob = (id: string) => tx('readwrite', (s) => s.delete(id))
export async function clearBlobs() {
  try { await tx('readwrite', (s) => s.clear()) } catch { /* noop */ }
}
