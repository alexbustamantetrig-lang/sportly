import type { Booking, UserProfile } from '../types'
import { MONITORS, REVIEWS, SERVICES, VIDEOS, AVAILABILITY } from '../data/seed'
import { isSlotTaken, MIN_NOTICE_HOURS } from '../utils/availability'
import { bookingStart } from '../utils/dates'
import { canCancel } from '../utils/bookings'
import { load, save } from './storage'
import { loadUserContent, mergeUserContent } from './userContent'

/**
 * Capa de acceso a datos. La UI sólo habla con `SportlyApi`.
 * `localApi` es una implementación PROTOTIPO sobre localStorage (un único navegador, sin servidor).
 * Para producción: implementar la misma interfaz con Supabase (ver supabase/schema.sql y README)
 * donde la comprobación de disponibilidad la hace el servidor (función `create_booking`).
 */
export interface CreateBookingInput {
  userId: string
  monitorId: string
  serviceId: string
  date: string
  time: string
}

export class BookingError extends Error {
  constructor(public code: 'slot_taken' | 'past' | 'invalid' | 'not_cancellable', message: string) {
    super(message)
  }
}

export interface SportlyApi {
  catalog: () => { monitors: typeof MONITORS; services: typeof SERVICES; videos: typeof VIDEOS; reviews: typeof REVIEWS; availability: typeof AVAILABILITY }
  listBookings: () => Promise<Booking[]>
  createBooking: (input: CreateBookingInput) => Promise<Booking>
  cancelBooking: (id: string) => Promise<Booking>
  loadFavorites: () => string[]
  saveFavorites: (ids: string[]) => void
  loadLikes: () => string[]
  saveLikes: (ids: string[]) => void
  loadProfile: () => UserProfile | null
  saveProfile: (p: UserProfile) => void
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `b-${Date.now()}-${Math.random().toString(16).slice(2)}`)

export const localApi: SportlyApi = {
  catalog: () => ({ monitors: MONITORS, services: SERVICES, videos: VIDEOS, reviews: REVIEWS, availability: AVAILABILITY }),

  async listBookings() {
    return load<Booking[]>('bookings', [])
  },

  async createBooking(input) {
    // Se lee SIEMPRE el estado persistido más reciente (no el estado de React) para evitar dobles reservas,
    // incluso entre pestañas. En el servidor real esto debe ser una restricción única + transacción.
    const all = load<Booking[]>('bookings', [])
    const cat = mergeUserContent(localApi.catalog(), loadUserContent(), {})
    const service = cat.services.find((s) => s.id === input.serviceId && s.monitorId === input.monitorId && s.status === 'active')
    if (!service) throw new BookingError('invalid', 'El entrenamiento seleccionado no existe.')
    const av = cat.availability.find((a) => a.monitorId === input.monitorId)
    const day = ((new Date(`${input.date}T00:00:00`).getDay() + 6) % 7) + 1
    const offered = av?.days[day as 1 | 2 | 3 | 4 | 5 | 6 | 7]
    if (!offered?.includes(input.time)) throw new BookingError('invalid', 'Ese horario no forma parte de la disponibilidad del monitor.')
    if (bookingStart(input.date, input.time).getTime() < Date.now() + MIN_NOTICE_HOURS * 3_600_000) {
      throw new BookingError('past', `Hay que reservar con al menos ${MIN_NOTICE_HOURS} horas de antelación.`)
    }
    if (isSlotTaken(all, input.monitorId, input.date, input.time, service.durationMin)) {
      throw new BookingError('slot_taken', 'Ese horario acaba de ocuparse. Elige otro.')
    }
    const booking: Booking = {
      id: uid(), userId: input.userId, monitorId: input.monitorId, serviceId: input.serviceId,
      date: input.date, time: input.time, durationMin: service.durationMin, price: service.price,
      status: 'confirmed', createdAt: new Date().toISOString(),
    }
    save('bookings', [booking, ...all])
    return booking
  },

  async cancelBooking(id) {
    const all = load<Booking[]>('bookings', [])
    const b = all.find((x) => x.id === id)
    if (!b) throw new BookingError('invalid', 'La reserva no existe.')
    if (!canCancel(b)) throw new BookingError('not_cancellable', 'Ya no se puede cancelar esta reserva (menos de 24 h).')
    const updated: Booking = { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() }
    save('bookings', all.map((x) => (x.id === id ? updated : x)))
    return updated
  },

  loadFavorites: () => load<string[]>('favorites', []),
  saveFavorites: (ids) => save('favorites', ids),
  loadLikes: () => load<string[]>('likes', []),
  saveLikes: (ids) => save('likes', ids),
  loadProfile: () => load<UserProfile | null>('profile', null),
  saveProfile: (p) => save('profile', p),
}
