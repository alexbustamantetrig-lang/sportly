import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Booking, UserProfile } from '../types'
import { localApi, type CreateBookingInput } from '../services/api'
import { clearAll } from '../services/storage'

const api = localApi
const catalog = api.catalog()

const newProfile = (): UserProfile => ({
  id: 'local-user', name: 'Invitado', sports: [], zone: '', goals: [],
  notifications: { reminders: true, offers: false }, createdAt: new Date().toISOString(),
})

interface AppState {
  catalog: typeof catalog
  profile: UserProfile
  hasProfile: boolean
  updateProfile: (p: Partial<UserProfile>) => void
  favorites: string[]
  toggleFavorite: (monitorId: string) => void
  likes: string[]
  toggleLike: (videoId: string) => void
  bookings: Booking[]
  createBooking: (i: Omit<CreateBookingInput, 'userId'>) => Promise<Booking>
  cancelBooking: (id: string) => Promise<void>
  resetAll: () => void
  toast: string | null
  showToast: (msg: string) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<UserProfile | null>(() => api.loadProfile())
  const profile = stored ?? newProfile()
  const [favorites, setFavorites] = useState<string[]>(() => api.loadFavorites())
  const [likes, setLikes] = useState<string[]>(() => api.loadLikes())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { api.listBookings().then(setBookings) }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const updateProfile = useCallback((p: Partial<UserProfile>) => {
    setStored((cur) => {
      const next = { ...(cur ?? newProfile()), ...p }
      api.saveProfile(next)
      return next
    })
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur]
      api.saveFavorites(next)
      return next
    })
  }, [])

  const toggleLike = useCallback((id: string) => {
    setLikes((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      api.saveLikes(next)
      return next
    })
  }, [])

  const createBooking = useCallback(async (i: Omit<CreateBookingInput, 'userId'>) => {
    const b = await api.createBooking({ ...i, userId: profile.id })
    setBookings(await api.listBookings())
    return b
  }, [profile.id])

  const cancelBooking = useCallback(async (id: string) => {
    await api.cancelBooking(id)
    setBookings(await api.listBookings())
  }, [])

  const resetAll = useCallback(() => {
    clearAll()
    setStored(null); setFavorites([]); setLikes([]); setBookings([])
  }, [])

  const value = useMemo<AppState>(() => ({
    catalog, profile, hasProfile: !!stored, updateProfile, favorites, toggleFavorite, likes, toggleLike,
    bookings, createBooking, cancelBooking, resetAll, toast, showToast: setToast,
  }), [profile, stored, updateProfile, favorites, toggleFavorite, likes, toggleLike, bookings, createBooking, cancelBooking, resetAll, toast])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp debe usarse dentro de AppProvider')
  return v
}
