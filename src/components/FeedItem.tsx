import { useNavigate } from 'react-router-dom'
import type { Monitor, Video } from '../types'
import { useApp } from '../state/AppContext'
import { averageRating } from '../utils/filters'
import { Avatar, Stars } from './ui'
import { HeartIcon, StarIcon, ShareIcon, PinIcon, ChevronIcon } from './Icons'
import { VideoPlayer } from './VideoPlayer'

export function FeedItem({ video, monitor, active, near, muted }: { video: Video; monitor: Monitor; active: boolean; near: boolean; muted: boolean }) {
  const nav = useNavigate()
  const { catalog, likes, toggleLike, favorites, toggleFavorite, showToast } = useApp()
  const liked = likes.includes(video.id)
  const faved = favorites.includes(monitor.id)
  const rating = averageRating(catalog.reviews, monitor.id)
  const open = () => nav(`/monitor/${monitor.id}`)

  const share = async () => {
    const url = `${location.origin}/monitor/${monitor.id}`
    try {
      if (navigator.share) await navigator.share({ title: `${monitor.name} en SPORTLY`, text: video.caption, url })
      else { await navigator.clipboard.writeText(url); showToast('Enlace copiado') }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') showToast('No se pudo compartir')
    }
  }

  const side = 'flex flex-col items-center gap-1 text-[12px] font-semibold text-white drop-shadow'
  const sideBtn = 'rounded-full bg-black/35 p-3 backdrop-blur transition active:scale-90'

  return (
    <section data-testid="feed-item" aria-label={`Vídeo de ${monitor.name}`} className="relative h-full w-full snap-start snap-always overflow-hidden">
      <VideoPlayer src={video.src} sport={video.sport} active={active} mount={near} muted={muted} isDemo={video.isDemo} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />

      <div className="absolute bottom-4 right-3 z-10 flex flex-col items-center gap-5">
        <button type="button" className={side} onClick={open} aria-label={`Abrir perfil de ${monitor.name}`}>
          <Avatar name={monitor.name} color={monitor.accent} size={48} />
        </button>
        <button type="button" className={side} onClick={() => toggleLike(video.id)} aria-pressed={liked} aria-label="Me gusta">
          <span key={String(liked)} className={`${sideBtn} ${liked ? 'anim-pop text-[#ff4d6d]' : ''}`}><HeartIcon size={26} filled={liked} /></span>
          {video.likes + (liked ? 1 : 0)}
        </button>
        <button type="button" className={side} onClick={() => { toggleFavorite(monitor.id); showToast(faved ? 'Eliminado de favoritos' : 'Guardado en favoritos') }} aria-pressed={faved} aria-label="Guardar en favoritos">
          <span key={String(faved)} className={`${sideBtn} ${faved ? 'anim-pop text-[#ffd23f]' : ''}`}><StarIcon size={26} filled={faved} /></span>
          Guardar
        </button>
        <button type="button" className={side} onClick={share} aria-label="Compartir">
          <span className={sideBtn}><ShareIcon size={26} /></span>
          Compartir
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 pr-20 text-white">
        <button type="button" onClick={open} className="pointer-events-auto flex items-center gap-2 text-left">
          <span className="text-[17px] font-bold">{monitor.name}</span>
          {rating && <span className="rounded-full bg-black/35 px-2 py-0.5 text-white"><Stars value={rating.avg} /></span>}
        </button>
        <p className="mt-0.5 text-[14px] font-medium text-white/90">{monitor.sport} · {monitor.specialties[0]}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[13px] text-white/75"><PinIcon size={13} />{monitor.location}</p>
        <p className="mt-2 text-[16px] font-semibold leading-snug">«{video.caption}»</p>
        <button type="button" onClick={open}
          className="pointer-events-auto mt-3 inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-[15px] font-bold text-white shadow-lg transition active:scale-95">
          Entrenar con este monitor <ChevronIcon size={18} />
        </button>
      </div>
    </section>
  )
}
