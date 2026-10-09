import { useMemo } from 'react'
import type { Monitor, Video } from '../types'
import { useApp } from '../state/AppContext'

export interface FeedEntry { video: Video; monitor: Monitor }

/** Feed personalizado: primero los deportes elegidos en el onboarding, manteniendo el orden original dentro de cada grupo. */
export function useFeed(): FeedEntry[] {
  const { catalog, profile } = useApp()
  return useMemo(() => {
    const entries = catalog.videos
      .filter((v) => v.status === 'published')
      .map((video) => ({ video, monitor: catalog.monitors.find((m) => m.id === video.monitorId) }))
      .filter((e): e is FeedEntry => !!e.monitor)
    // Intercalar monitores: v1 de cada uno, luego v2 de cada uno
    const byIdx = entries.sort((a, b) => Number(a.video.id.endsWith('2')) - Number(b.video.id.endsWith('2')))
    const pref = new Set(profile.sports)
    if (!pref.size) return byIdx
    return [...byIdx.filter((e) => pref.has(e.video.sport)), ...byIdx.filter((e) => !pref.has(e.video.sport))]
  }, [catalog, profile.sports])
}
