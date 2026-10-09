import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { CalendarIcon, HeartIcon, HomeIcon, SearchIcon, UserIcon } from './Icons'
import { Onboarding } from './Onboarding'
import { useApp } from '../state/AppContext'

const TABS = [
  { to: '/', label: 'Inicio', icon: HomeIcon, end: true },
  { to: '/explorar', label: 'Explorar', icon: SearchIcon },
  { to: '/reservas', label: 'Reservas', icon: CalendarIcon },
  { to: '/favoritos', label: 'Favoritos', icon: HeartIcon },
  { to: '/perfil', label: 'Perfil', icon: UserIcon },
]
const TAB_PATHS = new Set(['/', '/explorar', '/reservas', '/favoritos', '/perfil'])

export function Layout() {
  const { pathname } = useLocation()
  const { hasProfile, toast } = useApp()
  const [obClosed, setObClosed] = useState(false)
  const dark = pathname === '/'
  const showNav = TAB_PATHS.has(pathname)

  return (
    <div className="flex h-dvh items-center justify-center bg-[#05070b]">
      <div className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-surface md:h-[min(100%,900px)] md:rounded-[28px] md:shadow-2xl md:ring-1 md:ring-white/10">
        <main className="relative min-h-0 flex-1"><Outlet /></main>
        {showNav && (
          <nav aria-label="Principal" className={`flex border-t pb-[env(safe-area-inset-bottom)] ${dark ? 'border-white/10 bg-feed text-white/70' : 'border-[#e6ebf4] bg-white text-muted'}`}>
            {TABS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${isActive ? (dark ? 'text-white' : 'text-brand') : ''}`}>
                {({ isActive }) => (<><Icon size={22} filled={false} strokeWidth={isActive ? 2.6 : 2} />{label}</>)}
              </NavLink>
            ))}
          </nav>
        )}
        {!hasProfile && !obClosed && <Onboarding onClose={() => setObClosed(true)} />}
        {toast && <div role="status" className="anim-fade-up pointer-events-none absolute inset-x-6 bottom-20 z-[60] rounded-2xl bg-brand-dark px-4 py-3 text-center text-[14px] font-medium text-white shadow-xl">{toast}</div>}
      </div>
    </div>
  )
}
