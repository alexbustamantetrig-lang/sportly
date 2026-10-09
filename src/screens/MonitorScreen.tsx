import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { averageRating } from '../utils/filters'
import { formatDateShort, formatDuration, formatPrice } from '../utils/dates'
import { Avatar, Button, DemoTag, EmptyState, PageHeader, Stars } from '../components/ui'
import { CheckIcon, ClockIcon, CloseIcon, FlagIcon, PinIcon, PlayIcon, ShieldIcon, StarIcon } from '../components/Icons'
import { SPORT_THEME } from '../components/SportArt'
import { VideoPlayer } from '../components/VideoPlayer'
import { CANCEL_LIMIT_HOURS } from '../utils/availability'
import { load, save } from '../services/storage'
import type { Video } from '../types'

export function MonitorScreen() {
  const { id } = useParams()
  const nav = useNavigate()
  const { catalog, favorites, toggleFavorite, showToast } = useApp()
  const [playing, setPlaying] = useState<Video | null>(null)

  const monitor = catalog.monitors.find((m) => m.id === id)
  if (!monitor) {
    return (
      <div className="h-full bg-surface">
        <PageHeader title="Monitor" />
        <EmptyState emoji="🤷" title="Monitor no encontrado" text="Puede que el perfil ya no esté disponible.">
          <Button onClick={() => nav('/explorar')}>Explorar monitores</Button>
        </EmptyState>
      </div>
    )
  }

  const rating = averageRating(catalog.reviews, monitor.id)
  const faved = favorites.includes(monitor.id)
  const services = catalog.services.filter((s) => s.monitorId === monitor.id && s.status === 'active')
  const videos = catalog.videos.filter((v) => v.monitorId === monitor.id && v.status === 'published')
  const reviews = catalog.reviews.filter((r) => r.monitorId === monitor.id)
  const t = SPORT_THEME[monitor.sport]

  const report = () => {
    save('reports', [...load<unknown[]>('reports', []), { monitorId: monitor.id, at: new Date().toISOString() }])
    showToast('Denuncia registrada en este dispositivo (prototipo: aún no hay moderación)')
  }

  const h2 = 'mb-3 mt-7 text-[17px] font-bold'
  return (
    <div className="relative h-full bg-surface">
      <div className="h-full overflow-y-auto pb-28">
        <PageHeader title={monitor.name} right={
          <button type="button" aria-pressed={faved} aria-label={faved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            onClick={() => { toggleFavorite(monitor.id); showToast(faved ? 'Eliminado de favoritos' : 'Guardado en favoritos') }}
            className={`rounded-full p-2 hover:bg-black/5 ${faved ? 'text-[#f5b301]' : 'text-muted'}`}><StarIcon filled={faved} /></button>
        } />
        <div className="h-36" style={{ background: `linear-gradient(160deg, ${t.from}, ${t.to})` }} aria-hidden="true" />
        <div className="-mt-10 px-4">
          <Avatar name={monitor.name} color={monitor.accent} size={80} />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold">{monitor.name}</h2>
            {monitor.verified && <span className="inline-flex items-center gap-1 rounded-full bg-[#e3f6ec] px-2 py-0.5 text-xs font-bold text-ok"><ShieldIcon size={13} />Verificado</span>}
            {monitor.isDemo && <DemoTag />}
          </div>
          <p className="text-[15px] font-medium text-brand">{monitor.sport} · {monitor.specialties.join(', ')}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-muted">
            <span className="flex items-center gap-1"><PinIcon size={15} />{monitor.location}</span>
            {rating ? <Stars value={rating.avg} count={rating.count} /> : <span>Sin valoraciones todavía</span>}
          </div>
          {!monitor.verified && <p className="mt-2 text-[12.5px] text-muted">Este perfil no está verificado: SPORTLY aún no tiene un proceso de verificación de identidad y titulaciones.</p>}

          <h3 className={h2}>Sobre {monitor.name.split(' ')[0]}</h3>
          <p className="text-[15px] leading-relaxed">{monitor.bio}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[14px]">
            <Info label="Experiencia" value={`${monitor.yearsExperience} años`} />
            <Info label="Idiomas" value={monitor.languages.join(', ')} />
            <Info label="Enseña a" value={monitor.levelsTaught.join(', ')} />
            <Info label="Modalidades" value={[...new Set(services.map((s) => s.modality))].join(', ')} />
            <div className="col-span-2"><Info label="Titulaciones" value={monitor.credentials.join('; ')} /></div>
          </dl>

          <h3 className={h2}>Vídeos</h3>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {videos.map((v) => (
              <button key={v.id} type="button" onClick={() => setPlaying(v)} aria-label={`Reproducir: ${v.caption}`}
                className="relative flex h-44 w-28 shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-2 text-left text-white"
                style={{ background: `linear-gradient(160deg, ${t.from}, ${t.to})` }}>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5"><PlayIcon size={20} /></span>
                <span className="relative text-[11.5px] font-semibold leading-tight drop-shadow">{v.caption}</span>
              </button>
            ))}
          </div>

          <h3 className={h2}>Entrenamientos</h3>
          <ul className="grid gap-3">
            {services.map((s) => (
              <li key={s.id} className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(16,33,61,.08)]">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-[15.5px] font-bold">{s.name}</h4>
                  <span className="text-[16px] font-extrabold text-brand">{formatPrice(s.price)}</span>
                </div>
                <p className="mt-1 text-[14px] text-muted">{s.description}</p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-brand-dark">
                  <span className="flex items-center gap-1"><ClockIcon size={14} />{formatDuration(s.durationMin)}</span>
                  <span>{s.modality}</span><span>Nivel: {s.level}</span>
                </p>
                <Link to={`/reservar/${monitor.id}?servicio=${s.id}`} className="mt-3 inline-block text-[14px] font-semibold text-brand">Reservar este entrenamiento →</Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-muted">Cancelación gratuita hasta {CANCEL_LIMIT_HOURS} h antes de la sesión. Los precios incluyen impuestos; en esta versión no se realiza ningún cobro.</p>

          <h3 className={h2}>Valoraciones {rating && <span className="font-normal text-muted">· {rating.avg.toFixed(1)} ({rating.count})</span>}</h3>
          <p className="mb-3 -mt-1 rounded-xl bg-[#fff4d6] px-3 py-2 text-[12.5px] text-[#8a6100]">Las valoraciones de esta sección son datos de demostración, no opiniones de clientes reales.</p>
          {reviews.length === 0 ? <p className="text-muted">Todavía no hay valoraciones.</p> : (
            <ul className="grid gap-3">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-2xl bg-white p-4">
                  <div className="flex items-center justify-between"><b>{r.userAlias}</b><Stars value={r.rating} /></div>
                  <p className="mt-1 text-[14.5px]">{r.comment}</p>
                  <p className="mt-1 text-[12px] text-muted">{formatDateShort(r.date)} {r.isDemo && <DemoTag className="ml-1" />}</p>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={report} className="mt-8 flex items-center gap-1.5 text-[13px] text-muted underline"><FlagIcon size={14} />Denunciar este perfil</button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-[#e6ebf4] bg-white/95 p-3 backdrop-blur">
        <Link to={`/reservar/${monitor.id}`} className="flex items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-[16px] font-bold text-white">
          <CheckIcon size={18} />Reservar entrenamiento · desde {formatPrice(monitor.fromPrice)}
        </Link>
      </div>

      {playing && (
        <div role="dialog" aria-modal="true" aria-label={playing.caption} className="absolute inset-0 z-30 bg-feed">
          <VideoPlayer src={playing.src} sport={playing.sport} active mount muted={false} isDemo={playing.isDemo} />
          <button type="button" onClick={() => setPlaying(null)} aria-label="Cerrar vídeo" className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2.5 text-white"><CloseIcon /></button>
          <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-5 text-lg font-semibold text-white">{playing.caption}</p>
        </div>
      )}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[12px] font-semibold uppercase tracking-wide text-muted">{label}</dt><dd className="mt-0.5">{value}</dd></div>
}
