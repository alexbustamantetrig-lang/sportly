import type { Booking, BookingStatus } from '../types'
import { bookingEnd, bookingStart } from './dates'
import { CANCEL_LIMIT_HOURS } from './availability'

/** El estado "completada" se deriva: una reserva confirmada cuya hora de fin ya pasó. */
export function effectiveStatus(b: Booking, now = new Date()): BookingStatus {
  if ((b.status === 'confirmed' || b.status === 'pending') && bookingEnd(b.date, b.time, b.durationMin) < now) {
    return b.status === 'confirmed' ? 'completed' : 'cancelled'
  }
  return b.status
}

export function canCancel(b: Booking, now = new Date()): boolean {
  const st = effectiveStatus(b, now)
  if (st !== 'confirmed' && st !== 'pending') return false
  return bookingStart(b.date, b.time).getTime() - now.getTime() >= CANCEL_LIMIT_HOURS * 3_600_000
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Pendiente de confirmación',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}
