import { useCallback, useEffect, useRef, useState } from 'react'
import { FeedItem } from '../components/FeedItem'
import { VolumeIcon, MuteIcon } from '../components/Icons'
import { useFeed } from '../hooks/useFeed'
import { EmptyState } from '../components/ui'

export function FeedScreen() {
  const entries = useFeed()
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      (obs) => obs.forEach((o) => { if (o.isIntersecting) setActive(Number((o.target as HTMLElement).dataset.index)) }),
      { root: el, threshold: 0.6 },
    )
    el.querySelectorAll('[data-index]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [entries.length])

  const go = useCallback((dir: 1 | -1) => {
    const el = root.current
    if (el) el.scrollBy({ top: dir * el.clientHeight, behavior: 'smooth' })
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowUp') { e.preventDefault(); go(-1) }
  }

  if (!entries.length) return <EmptyState emoji="🎬" title="Todavía no hay vídeos" text="Vuelve en unos minutos o explora monitores por deporte." />

  return (
    <div className="relative h-full bg-feed">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent px-4 pb-6 pt-4 text-white">
        <span className="text-[19px] font-extrabold tracking-[0.18em]">SPORT<span className="text-[#6ea2ff]">LY</span></span>
        <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={!muted}
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 text-[13px] font-semibold backdrop-blur">
          {muted ? <MuteIcon size={18} /> : <VolumeIcon size={18} />}{muted ? 'Sin sonido' : 'Sonido'}
        </button>
      </div>
      <div ref={root} tabIndex={0} onKeyDown={onKey} aria-label="Feed de vídeos de monitores"
        className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll overscroll-contain outline-none">
        {entries.map((e, i) => (
          <div key={e.video.id} data-index={i} className="h-full">
            <FeedItem video={e.video} monitor={e.monitor} active={i === active} near={Math.abs(i - active) <= 1} muted={muted} />
          </div>
        ))}
      </div>
    </div>
  )
}
