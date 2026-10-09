const pad = (n: number) => String(n).padStart(2, '0')

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const timeToMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export const minToTime = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`

/** Lunes=1 … domingo=7 */
export const isoWeekday = (d: Date) => ((d.getDay() + 6) % 7) + 1

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const addDays = (d: Date, n: number) => {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export const bookingStart = (date: string, time: string) => {
  const d = parseISODate(date)
  d.setMinutes(timeToMin(time))
  return d
}

export const bookingEnd = (date: string, time: string, durationMin: number) =>
  new Date(bookingStart(date, time).getTime() + durationMin * 60_000)

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const formatDateLong = (iso: string) =>
  cap(parseISODate(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }))

export const formatDateShort = (iso: string) =>
  parseISODate(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })

export const formatMonthYear = (d: Date) =>
  cap(d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }))

export const formatPrice = (n: number) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export const formatDuration = (min: number) =>
  min < 60 ? `${min} min` : `${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''}`
