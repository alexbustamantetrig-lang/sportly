import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import type { Level, Sport } from '../types'
import { SPORTS } from '../utils/filters'
import { effectiveStatus } from '../utils/bookings'
import { Avatar, Button, Chip } from '../components/ui'

const LEVELS: Level[] = ['Principiante', 'Intermedio', 'Avanzado']

export function ProfileScreen() {
  const { profile, updateProfile, bookings, favorites, resetAll, showToast, catalog } = useApp()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [legal, setLegal] = useState(false)
  const upcoming = bookings.filter((b) => ['pending', 'confirmed'].includes(effectiveStatus(b))).length
  const cities = [...new Set(catalog.monitors.map((m) => m.city))].sort()
  const toggleSport = (s: Sport) => updateProfile({ sports: profile.sports.includes(s) ? profile.sports.filter((x) => x !== s) : [...profile.sports, s] })
  const card = 'rounded-2xl bg-white p-4'
  const h = 'mb-2 text-[13px] font-bold uppercase tracking-wide text-muted'

  const save = () => {
    const n = name.trim()
    if (!n) return showToast('Escribe un nombre')
    updateProfile({ name: n }); setEditing(false); showToast('Perfil actualizado')
  }
  const reset = () => {
    if (window.confirm('Se borrarán tus reservas, favoritos y preferencias guardados en este dispositivo. ¿Continuar?')) { resetAll(); setName('Invitado'); showToast('Datos locales borrados') }
  }

  return (
    <div className="h-full overflow-y-auto bg-surface px-4 pb-8 pt-4">
      <h1 className="mb-4 text-2xl font-extrabold">Perfil</h1>
      <div className={`${card} flex items-center gap-4`}>
        <Avatar name={profile.name} color="#bcd4ff" size={64} />
        <div className="min-w-0 flex-1">
          {editing ? (
            <label className="block text-[13px] font-semibold">Nombre
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="mt-1 w-full rounded-xl border border-[#dfe5f0] px-3 py-2 text-[16px]" />
            </label>
          ) : (<><p className="truncate text-xl font-bold">{profile.name}</p>
            <p className="text-[13px] text-muted">{profile.level ?? 'Nivel sin indicar'}{profile.zone && ` · ${profile.zone}`}</p></>)}
        </div>
        {editing ? <Button className="!px-4 !py-2.5" onClick={save}>Guardar</Button> : <Button variant="light" className="!px-4 !py-2.5" onClick={() => { setName(profile.name); setEditing(true) }}>Editar</Button>}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Link to="/reservas" className={`${card} text-center`}><b className="block text-2xl text-brand">{upcoming}</b><span className="text-[13px] text-muted">Próximas reservas</span></Link>
        <Link to="/favoritos" className={`${card} text-center`}><b className="block text-2xl text-brand">{favorites.length}</b><span className="text-[13px] text-muted">Favoritos</span></Link>
      </div>

      <section className={`${card} mt-3`}><h2 className={h}>Deportes favoritos</h2>
        <div className="flex flex-wrap gap-2">{SPORTS.map((s) => <Chip key={s} active={profile.sports.includes(s)} onClick={() => toggleSport(s)}>{s}</Chip>)}</div>
        <p className="mt-2 text-[12.5px] text-muted">Se usan para ordenar el feed.</p>
      </section>

      <section className={`${card} mt-3`}><h2 className={h}>Nivel deportivo (opcional)</h2>
        <div className="flex flex-wrap gap-2">{LEVELS.map((l) => <Chip key={l} active={profile.level === l} onClick={() => updateProfile({ level: profile.level === l ? undefined : l })}>{l}</Chip>)}</div>
        <label className="mt-4 block text-[13px] font-semibold">Zona aproximada (opcional)
          <select value={profile.zone} onChange={(e) => updateProfile({ zone: e.target.value })} className="mt-1 w-full rounded-xl border border-[#dfe5f0] bg-white px-3 py-2.5 text-[15px]">
            <option value="">Sin indicar</option>{cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </section>

      <section className={`${card} mt-3`}><h2 className={h}>Notificaciones</h2>
        {([['reminders', 'Recordatorios de reservas'], ['offers', 'Novedades y ofertas']] as const).map(([k, label]) => (
          <label key={k} className="flex items-center justify-between py-2 text-[15px]">{label}
            <input type="checkbox" role="switch" className="h-5 w-5 accent-brand" checked={profile.notifications[k]}
              onChange={(e) => updateProfile({ notifications: { ...profile.notifications, [k]: e.target.checked } })} />
          </label>))}
        <p className="text-[12.5px] text-muted">Preferencia guardada; en esta versión no se envían notificaciones.</p>
      </section>

      <section className={`${card} mt-3`}>
        <button type="button" className="flex w-full items-center justify-between text-left font-semibold" aria-expanded={legal} onClick={() => setLegal((v) => !v)}>Privacidad y condiciones <span>{legal ? '−' : '+'}</span></button>
        {legal && <div className="mt-3 space-y-2 text-[13.5px] text-muted">
          <p>SPORTLY es un prototipo. Todos tus datos (perfil, favoritos, reservas) se guardan únicamente en este navegador y no se envían a ningún servidor.</p>
          <p>No se solicita tu ubicación ni se recopilan datos de pago. Textos legales definitivos (privacidad, términos, cancelaciones) pendientes de redactar antes de un lanzamiento real.</p>
        </div>}
      </section>

      <section className={`${card} mt-3`}>
        <p className="mb-3 text-[13px] text-muted">No hay cuentas ni inicio de sesión todavía: trabajas con un perfil local. En su lugar puedes borrar todo lo guardado en este dispositivo.</p>
        <Button variant="danger" className="w-full" onClick={reset}>Borrar mis datos locales</Button>
      </section>
    </div>
  )
}
