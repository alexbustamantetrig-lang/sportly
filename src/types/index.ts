export type Sport =
  | 'Esquí' | 'Snowboard' | 'Surf' | 'Tenis' | 'Pádel' | 'Natación' | 'Fútbol' | 'Ciclismo'

export type Level = 'Principiante' | 'Intermedio' | 'Avanzado'
export type Modality = 'Presencial' | 'Online' | 'Grupal'

export interface Monitor {
  id: string
  userId?: string
  name: string
  sport: Sport
  tagline: string
  specialties: string[]
  bio: string
  location: string
  city: string
  languages: string[]
  levelsTaught: Level[]
  yearsExperience: number
  /** Texto libre ficticio; NO son titulaciones verificadas. */
  credentials: string[]
  fromPrice: number
  verified: boolean // sólo true si existe un proceso real de verificación
  isDemo: boolean
  accent: string
  createdAt: string
}

export interface Video {
  id: string
  monitorId: string
  /** URL de vídeo. Si falta, se muestra la sustitución visual de contenido de prueba. */
  src?: string
  caption: string
  sport: Sport
  publishedAt: string
  status: 'published' | 'hidden'
  likes: number
  isDemo: boolean
}

export interface Service {
  id: string
  monitorId: string
  name: string
  description: string
  durationMin: number
  price: number
  modality: Modality
  level: Level | 'Todos'
  status: 'active' | 'inactive'
}

/** Plantilla semanal: días ISO (1=lunes … 7=domingo) → horas de inicio "HH:MM". */
export interface WeeklyAvailability {
  monitorId: string
  days: Partial<Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string[]>>
}

export interface Review {
  id: string
  monitorId: string
  bookingId?: string
  userAlias: string
  rating: number
  comment: string
  date: string
  isDemo: boolean
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  userId: string
  monitorId: string
  serviceId: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  durationMin: number
  price: number
  status: BookingStatus
  createdAt: string
  cancelledAt?: string
  /** Referencia de pago futura (Stripe, etc.). En el MVP no hay cobro. */
  paymentRef?: string
}

export interface UserProfile {
  id: string
  name: string
  email?: string
  sports: Sport[]
  level?: Level
  zone: string
  goals: string[]
  notifications: { reminders: boolean; offers: boolean }
  createdAt: string
}

export interface Slot {
  time: string
  available: boolean
}

export interface Filters {
  query: string
  sport: Sport | ''
  city: string
  level: Level | ''
  maxPrice: number
  minRating: number
  availability: 'any' | 'week'
}
