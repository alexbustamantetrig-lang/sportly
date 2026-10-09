import type { Booking, Filters, Monitor, Review, Service, Sport, WeeklyAvailability } from '../types'
import { hasAnySlot } from './availability'

export const SPORTS: Sport[] = ['Esquí', 'Snowboard', 'Surf', 'Tenis', 'Pádel', 'Natación', 'Fútbol', 'Ciclismo']

export const DEFAULT_FILTERS: Filters = {
  query: '', sport: '', city: '', level: '', maxPrice: 150, minRating: 0, availability: 'any',
}

export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function averageRating(reviews: Review[], monitorId: string): { avg: number; count: number } | null {
  const r = reviews.filter((x) => x.monitorId === monitorId)
  if (!r.length) return null
  return { avg: r.reduce((a, x) => a + x.rating, 0) / r.length, count: r.length }
}

export interface FilterContext {
  reviews: Review[]
  services: Service[]
  availability: WeeklyAvailability[]
  bookings: Booking[]
  now?: Date
}

export function filterMonitors(monitors: Monitor[], f: Filters, ctx: FilterContext): Monitor[] {
  const q = norm(f.query.trim())
  return monitors.filter((m) => {
    if (q) {
      const hay = norm([m.name, m.sport, m.tagline, m.city, m.location, ...m.specialties].join(' '))
      if (!hay.includes(q)) return false
    }
    if (f.sport && m.sport !== f.sport) return false
    if (f.city && m.city !== f.city) return false
    if (f.level && !m.levelsTaught.includes(f.level)) return false
    if (m.fromPrice > f.maxPrice) return false
    if (f.minRating > 0) {
      const r = averageRating(ctx.reviews, m.id)
      if (!r || r.avg < f.minRating) return false
    }
    if (f.availability === 'week') {
      const now = ctx.now ?? new Date()
      const av = ctx.availability.find((a) => a.monitorId === m.id)
      if (!hasAnySlot(av, ctx.bookings, m.id, now, 7)) return false
    }
    return true
  })
}
