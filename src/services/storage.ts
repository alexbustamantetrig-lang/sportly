const PREFIX = 'sportly:v1:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* almacenamiento no disponible: la app sigue funcionando en memoria */
  }
}

export function clearAll(): void {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k))
  } catch {
    /* noop */
  }
}
