import { useEffect, useRef, useState } from 'react'
import type { Sport } from '../types'
import { SportArt } from './SportArt'
import { PlayIcon } from './Icons'

interface Props {
  src?: string
  sport: Sport
  active: boolean
  /** Si es false no se monta <video> (ahorra datos: sólo se carga el vídeo activo). */
  mount: boolean
  muted: boolean
  isDemo?: boolean
  controls?: boolean
}

/** Reproduce un vídeo con estados de carga/error, o muestra la sustitución visual si no hay `src`. */
export function VideoPlayer({ src, sport, active, mount, muted, isDemo, controls }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(!!src)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (active && !paused) {
      v.play().catch(() => setPaused(true)) // autoplay bloqueado: el usuario pulsa para reproducir
    } else {
      v.pause()
    }
    if (!active) {
      v.currentTime = 0
      setPaused(false)
    }
  }, [active, paused, mount, attempt])

  const toggle = () => setPaused((p) => !p)
  const hasVideo = !!src && mount && !error

  return (
    <div className="absolute inset-0 bg-feed">
      <SportArt sport={sport} paused={!active || paused} />
      {hasVideo && (
        <video
          key={attempt} ref={ref} src={src} playsInline loop muted={muted} preload={active ? 'auto' : 'metadata'}
          controls={controls}
          className="absolute inset-0 h-full w-full object-cover"
          onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)} onPlaying={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false) }}
        />
      )}
      <button type="button" onClick={toggle} aria-label={paused ? 'Reanudar' : 'Pausar'} className="absolute inset-0 h-full w-full" />
      {paused && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="anim-pop rounded-full bg-black/45 p-5 text-white"><PlayIcon size={34} /></span>
        </div>
      )}
      {loading && hasVideo && (
        <div role="status" className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/30 border-t-white">
          <span className="sr-only">Cargando vídeo</span>
        </div>
      )}
      {error && (
        <div role="alert" className="absolute inset-x-6 top-24 rounded-2xl bg-black/60 p-3 text-center text-sm text-white">
          No se pudo cargar el vídeo.{' '}
          <button type="button" className="font-semibold underline" onClick={() => { setError(false); setLoading(true); setAttempt((a) => a + 1) }}>Reintentar</button>
        </div>
      )}
      {(isDemo || !src) && (
        <span className="pointer-events-none absolute left-4 top-16 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur">
          {src ? 'Contenido de prueba' : 'Contenido de prueba · sin vídeo'}
        </span>
      )}
    </div>
  )
}
