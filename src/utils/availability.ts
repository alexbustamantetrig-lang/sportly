import type { Booking, Slot, WeeklyAvailability } from '../types'
import { isoWeekday, parseISODate, timeToMin } from './dates'

export const BOOKING_WINDOW_DAYS = 30
/** Las reservas deben hacerse con al menos esta antelación (horas). */
export const MIN_NOTICE_HOURS = 2
/** Cancelación gratuita hasta esta antelación (horas). */
export const CANCEL_LIMIT_HOURS = 24

const blocks = (b: Booking) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'completed'

/** ¿Se solapan [start, start+duration) del hueco y de alguna reserva activa del monitor? */
export function isSlotTaken(
  bookings: Booking[], monitorId: string, date: string, time: string, durationMin: number,
): boolean {
  const s = timeToMin(time)
  const e = s + durationMin
  return bookings.some((b) => {
    if (!blocks(b) || b.monitorId !== monitorId || b.date !== date) return false
    const bs = timeToMin(b.time)
    return s < bs + b.durationMin && bs < e
  })
}

/** Franjas del día para un monitor, marcando no disponibles las ocupadas o pasadas. */
export function slotsForDay(
  availability: WeeklyAvailability | undefined, bookings: Booking[], monitorId: string,
  date: string, durationMin: number, now: Date = new Date(),
): Slot[] {
  if (!availability) return []
  const day = isoWeekday(parseISODate(date)) as 1 | 2 | 3 | 4 | 5 | 6 | 7
  const times = availability.days[day] ?? []
  const limit = now.getTime() + MIN_NOTICE_HOURS * 3_600_000
  return times.map((time) => {
    const start = parseISODate(date)
    start.setMinutes(timeToMin(time))
    const past = start.getTime() < limit
    return { time, available: !past && !isSlotTaken(bookings, monitorId, date, time, durationMin) }
  })
}

export function hasAnySlot(
  availability: WeeklyAvailability | undefined, bookings: Booking[], monitorId: string,
  from: Date, days: number, durationMin = 60,
): boolean {
  for (let i = 0; i < days; i++) {
    const d = new Date(from)
    d.setDate(d.getDate() + i)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (slotsForDay(availability, bookings, monitorId, iso, durationMin, from).some((s) => s.available)) return true
  }
  return false
}
