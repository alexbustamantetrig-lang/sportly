import type { Sport } from '../types'

export const SPORT_THEME: Record<Sport, { emoji: string; from: string; to: string }> = {
  'Esquí': { emoji: '⛷️', from: '#0b3a6f', to: '#4cc9f0' },
  'Snowboard': { emoji: '🏂', from: '#2b1a6b', to: '#a78bfa' },
  'Surf': { emoji: '🏄', from: '#06485a', to: '#22d3ee' },
  'Tenis': { emoji: '🎾', from: '#25420f', to: '#a3e635' },
  'Pádel': { emoji: '🏓', from: '#6b2a05', to: '#fb923c' },
  'Natación': { emoji: '🏊', from: '#0a3a66', to: '#38bdf8' },
  'Fútbol': { emoji: '⚽', from: '#0d4a26', to: '#4ade80' },
  'Ciclismo': { emoji: '🚴', from: '#5b0f3a', to: '#f472b6' },
}

/** Sustitución visual (ilustración propia) para cuando un vídeo no tiene `src` o falla. */
export function SportArt({ sport, paused = false }: { sport: Sport; paused?: boolean }) {
  const t = SPORT_THEME[sport]
  const run = paused ? { animationPlayState: 'paused' as const } : undefined
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(165deg, ${t.from}, ${t.to})` }} aria-hidden="true">
      <div className="anim-drift absolute -left-1/4 top-[18%] h-40 w-[150%] -rotate-12 bg-white/10" style={run} />
      <div className="anim-drift absolute -left-1/4 top-[48%] h-24 w-[150%] -rotate-12 bg-white/10" style={{ ...run, animationDuration: '9s' }} />
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 text-[120px] leading-none drop-shadow-xl">
        <span className="anim-float inline-block" style={run}>{t.emoji}</span>
      </div>
    </div>
  )
}
