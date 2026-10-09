import { Link } from 'react-router-dom'
import type { Monitor } from '../types'
import { useApp } from '../state/AppContext'
import { averageRating } from '../utils/filters'
import { formatPrice } from '../utils/dates'
import { Avatar, Stars } from './ui'
import { PinIcon, StarIcon } from './Icons'
import { SPORT_THEME } from './SportArt'

export function MonitorCard({ monitor, onRemove }: { monitor: Monitor; onRemove?: () => void }) {
  const { catalog, favorites, toggleFavorite, showToast } = useApp()
  const r = averageRating(catalog.reviews, monitor.id)
  const faved = favorites.includes(monitor.id)
  const t = SPORT_THEME[monitor.sport]
  return (
    <article className="anim-fade-up flex gap-3 rounded-3xl bg-white p-3 shadow-[0_1px_3px_rgba(16,33,61,.08)]">
      <Link to={`/monitor/${monitor.id}`} className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-4xl"
        style={{ background: `linear-gradient(160deg, ${t.from}, ${t.to})` }} aria-label={`Ver perfil de ${monitor.name}`}>
        <span aria-hidden="true">{t.emoji}</span>
        <span className="absolute -bottom-1 -right-1"><Avatar name={monitor.name} color={monitor.accent} size={32} /></span>
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={`/monitor/${monitor.id}`} className="block">
          <h3 className="truncate text-[16px] font-bold">{monitor.name}</h3>
          <p className="text-[13px] font-medium text-brand">{monitor.sport} · {monitor.specialties[0]}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-muted"><PinIcon size={13} />{monitor.city}</p>
        </Link>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[14px]"><b>desde {formatPrice(monitor.fromPrice)}</b><span className="text-muted"> /sesión</span></span>
          {r ? <Stars value={r.avg} count={r.count} /> : <span className="text-[12px] text-muted">Sin valoraciones</span>}
        </div>
      </div>
      <button type="button" aria-label={faved ? `Quitar a ${monitor.name} de favoritos` : `Guardar a ${monitor.name} en favoritos`} aria-pressed={faved}
        onClick={() => { toggleFavorite(monitor.id); showToast(faved ? 'Eliminado de favoritos' : 'Guardado en favoritos'); onRemove?.() }}
        className={`h-fit rounded-full p-2 ${faved ? 'text-[#f5b301]' : 'text-muted'} hover:bg-black/5`}>
        <StarIcon size={22} filled={faved} />
      </button>
    </article>
  )
}
