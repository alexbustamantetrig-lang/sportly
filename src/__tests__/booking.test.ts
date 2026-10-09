import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addDays, toISODate } from '../utils/dates'

const store = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  get length() { return store.size },
  key: () => null, clear: () => store.clear(),
})
Object.defineProperty(localStorage, 'keys', { value: () => [...store.keys()] })

const { localApi, BookingError } = await import('../services/api')
const { slotsForDay } = await import('../utils/availability')
const { AVAILABILITY } = await import('../data/seed')
const { filterMonitors, DEFAULT_FILTERS } = await import('../utils/filters')
const { MONITORS, REVIEWS, SERVICES } = await import('../data/seed')

/** Próximo día (≥ 3 días vista) con horas de Laura (m-laura) */
function findDay() {
  const av = AVAILABILITY.find((a) => a.monitorId === 'm-laura')!
  for (let i = 3; i < 20; i++) {
    const d = addDays(new Date(), i)
    const wd = (((d.getDay() + 6) % 7) + 1) as 1
    const times = av.days[wd]
    if (times?.length) return { date: toISODate(d), time: times[0] }
  }
  throw new Error('sin día')
}

beforeEach(() => store.clear())

describe('reservas', () => {
  it('crea una reserva y bloquea el horario', async () => {
    const { date, time } = findDay()
    const b = await localApi.createBooking({ userId: 'u', monitorId: 'm-laura', serviceId: 'm-laura-s1', date, time })
    expect(b.status).toBe('confirmed')
    const slots = slotsForDay(AVAILABILITY.find((a) => a.monitorId === 'm-laura'), await localApi.listBookings(), 'm-laura', date, 60)
    expect(slots.find((s) => s.time === time)?.available).toBe(false)
  })

  it('rechaza una segunda reserva del mismo horario', async () => {
    const { date, time } = findDay()
    const input = { userId: 'u', monitorId: 'm-laura', serviceId: 'm-laura-s1', date, time }
    await localApi.createBooking(input)
    await expect(localApi.createBooking(input)).rejects.toMatchObject({ code: 'slot_taken' })
    expect((await localApi.listBookings()).length).toBe(1)
  })

  it('rechaza horarios fuera de disponibilidad y en el pasado', async () => {
    const { date } = findDay()
    await expect(localApi.createBooking({ userId: 'u', monitorId: 'm-laura', serviceId: 'm-laura-s1', date, time: '03:00' })).rejects.toBeInstanceOf(BookingError)
    const past = toISODate(addDays(new Date(), -2))
    await expect(localApi.createBooking({ userId: 'u', monitorId: 'm-laura', serviceId: 'm-laura-s1', date: past, time: '17:00' })).rejects.toBeInstanceOf(BookingError)
  })

  it('al cancelar el horario vuelve a estar libre', async () => {
    const { date, time } = findDay()
    const b = await localApi.createBooking({ userId: 'u', monitorId: 'm-laura', serviceId: 'm-laura-s1', date, time })
    await localApi.cancelBooking(b.id)
    const slots = slotsForDay(AVAILABILITY.find((a) => a.monitorId === 'm-laura'), await localApi.listBookings(), 'm-laura', date, 60)
    expect(slots.find((s) => s.time === time)?.available).toBe(true)
  })

  it('una sesión larga bloquea las franjas solapadas', async () => {
    const { date, time } = findDay()
    // m-laura-s2 dura 90 min: bloquea también la franja de 1 h siguiente si empieza antes de que termine
    await localApi.createBooking({ userId: 'u', monitorId: 'm-laura', serviceId: 'm-laura-s2', date, time })
    const slots = slotsForDay(AVAILABILITY.find((a) => a.monitorId === 'm-laura'), await localApi.listBookings(), 'm-laura', date, 60)
    expect(slots.find((s) => s.time === time)?.available).toBe(false)
  })
})

describe('filtros', () => {
  const ctx = { reviews: REVIEWS, services: SERVICES, availability: AVAILABILITY, bookings: [] }
  it('filtra por deporte, texto sin tildes y precio', () => {
    expect(filterMonitors(MONITORS, { ...DEFAULT_FILTERS, sport: 'Surf' }, ctx).map((m) => m.id)).toEqual(['m-marco'])
    expect(filterMonitors(MONITORS, { ...DEFAULT_FILTERS, query: 'futbol' }, ctx).length).toBe(1)
    expect(filterMonitors(MONITORS, { ...DEFAULT_FILTERS, maxPrice: 35 }, ctx).every((m) => m.fromPrice <= 35)).toBe(true)
    expect(filterMonitors(MONITORS, { ...DEFAULT_FILTERS, query: 'zzz' }, ctx)).toEqual([])
  })
})
