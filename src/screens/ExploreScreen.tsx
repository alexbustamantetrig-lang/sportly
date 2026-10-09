import { useMemo, useState } from 'react'
import type { Filters, Level } from '../types'
import { useApp } from '../state/AppContext'
import { DEFAULT_FILTERS, SPORTS, filterMonitors } from '../utils/filters'
import { Chip, EmptyState, Button } from '../components/ui'
import { MonitorCard } from '../components/MonitorCard'
import { SearchIcon, FilterIcon } from '../components/Icons'

const LEVELS: Level[] = ['Principiante', 'Intermedio', 'Avanzado']

export function ExploreScreen() {
  const { catalog, bookings, profile } = useApp()
  const [f, setF] = useState<Filters>(DEFAULT_FILTERS)
  const [open, setOpen] = useState(false)
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((cur) => ({ ...cur, [k]: v }))

  const cities = useMemo(() => [...new Set(catalog.monitors.map((m) => m.city))].sort(), [catalog.monitors])
  const results = useMemo(() => {
    const r = filterMonitors(catalog.monitors, f, { reviews: catalog.reviews, services: catalog.services, availability: catalog.availability, bookings })
    // Personalización suave: la zona y los deportes del onboarding van primero
    const score = (m: (typeof r)[number]) => (m.city === profile.zone ? 2 : 0) + (profile.sports.includes(m.sport) ? 1 : 0)
    return [...r].sort((a, b) => score(b) - score(a))
  }, [catalog, f, bookings, profile.zone, profile.sports])
  const activeCount = [f.city, f.level, f.minRating > 0, f.maxPrice < 150, f.availability !== 'any'].filter(Boolean).length
  const field = 'w-full rounded-xl border border-[#dfe5f0] bg-white px-3 py-2.5 text-[15px]'

  return (
    <div className="h-full overflow-y-auto bg-surface pb-6">
      <div className="sticky top-0 z-10 bg-surface/95 px-4 pb-2 pt-4 backdrop-blur">
        <h1 className="mb-3 text-2xl font-extrabold">Explorar</h1>
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Buscar por nombre, especialidad o deporte</span>
            <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input type="search" value={f.query} onChange={(e) => set('query', e.target.value)} placeholder="Nombre, especialidad o deporte"
              className="w-full rounded-2xl border border-[#dfe5f0] bg-white py-3 pl-10 pr-3 text-[15px] outline-none focus:border-brand" />
          </label>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Filtros"
            className={`relative rounded-2xl border px-3.5 ${open ? 'border-brand bg-brand text-white' : 'border-[#dfe5f0] bg-white'}`}>
            <FilterIcon />
            {activeCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[11px] font-bold text-white">{activeCount}</span>}
          </button>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          <Chip active={!f.sport} onClick={() => set('sport', '')}>Todos</Chip>
          {SPORTS.map((s) => <Chip key={s} active={f.sport === s} onClick={() => set('sport', f.sport === s ? '' : s)}>{s}</Chip>)}
        </div>
        {open && (
          <div className="anim-fade-up mt-3 grid grid-cols-2 gap-3 rounded-3xl bg-white p-4 shadow">
            <label className="text-[13px] font-semibold">Ubicación
              <select className={field} value={f.city} onChange={(e) => set('city', e.target.value)}>
                <option value="">Cualquiera</option>{cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="text-[13px] font-semibold">Nivel
              <select className={field} value={f.level} onChange={(e) => set('level', e.target.value as Level | '')}>
                <option value="">Cualquiera</option>{LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="col-span-2 text-[13px] font-semibold">Precio máximo desde: {f.maxPrice >= 150 ? 'sin límite' : `${f.maxPrice} €`}
              <input type="range" min={25} max={150} step={5} value={f.maxPrice} onChange={(e) => set('maxPrice', Number(e.target.value))} className="w-full accent-brand" />
            </label>
            <label className="text-[13px] font-semibold">Valoración mínima
              <select className={field} value={f.minRating} onChange={(e) => set('minRating', Number(e.target.value))}>
                <option value={0}>Cualquiera</option><option value={4}>4,0 o más</option><option value={4.5}>4,5 o más</option>
              </select>
            </label>
            <label className="text-[13px] font-semibold">Disponibilidad
              <select className={field} value={f.availability} onChange={(e) => set('availability', e.target.value as Filters['availability'])}>
                <option value="any">Cualquiera</option><option value="week">Con horas esta semana</option>
              </select>
            </label>
            <Button variant="ghost" className="col-span-2 !py-2" onClick={() => setF(DEFAULT_FILTERS)}>Limpiar filtros</Button>
          </div>
        )}
      </div>
      <div className="px-4">
        <p className="mb-2 mt-2 text-[13px] text-muted" aria-live="polite">{results.length} {results.length === 1 ? 'monitor' : 'monitores'}</p>
        {results.length === 0 ? (
          <EmptyState emoji="🔎" title="Sin resultados" text="Prueba con otro deporte o quita algún filtro.">
            <Button onClick={() => setF(DEFAULT_FILTERS)}>Limpiar filtros</Button>
          </EmptyState>
        ) : (
          <div className="grid gap-3 md:grid-cols-1">{results.map((m) => <MonitorCard key={m.id} monitor={m} />)}</div>
        )}
      </div>
    </div>
  )
}
