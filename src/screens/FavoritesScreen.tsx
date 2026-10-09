import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { EmptyState } from '../components/ui'
import { MonitorCard } from '../components/MonitorCard'

export function FavoritesScreen() {
  const { catalog, favorites } = useApp()
  const list = favorites.map((id) => catalog.monitors.find((m) => m.id === id)).filter((m) => !!m)
  return (
    <div className="h-full overflow-y-auto bg-surface px-4 pb-6 pt-4">
      <h1 className="mb-3 text-2xl font-extrabold">Favoritos</h1>
      {list.length === 0 ? (
        <EmptyState emoji="⭐" title="Aún no tienes favoritos" text="Guarda monitores desde el feed o su perfil para encontrarlos aquí.">
          <Link to="/" className="rounded-2xl bg-brand px-5 py-3.5 text-center font-semibold text-white">Ver el feed</Link>
          <Link to="/explorar" className="rounded-2xl border border-[#dfe5f0] bg-white px-5 py-3.5 text-center font-semibold">Explorar monitores</Link>
        </EmptyState>
      ) : (
        <div className="grid gap-3">{list.map((m) => <MonitorCard key={m.id} monitor={m} />)}</div>
      )}
    </div>
  )
}
