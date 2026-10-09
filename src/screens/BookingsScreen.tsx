import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import type { Booking, BookingStatus } from '../types'
import { STATUS_LABEL, canCancel, effectiveStatus } from '../utils/bookings'
import { bookingStart, formatDateLong, formatDateShort, formatDuration, formatPrice, minToTime, timeToMin } from '../utils/dates'
import { BookingError } from '../services/api'
import { CANCEL_LIMIT_HOURS } from '../utils/availability'
import { Button, EmptyState, PageHeader } from '../components/ui'
import { ChevronIcon } from '../components/Icons'

const BADGE: Record<BookingStatus, string> = {
  pending: 'bg-[#fff4d6] text-[#8a6100]', confirmed: 'bg-[#e3f6ec] text-ok',
  completed: 'bg-[#e8f0ff] text-brand', cancelled: 'bg-[#fdecec] text-danger',
}
const Badge = ({ s }: { s: BookingStatus }) => <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${BADGE[s]}`}>{STATUS_LABEL[s]}</span>

export function BookingsScreen() {
  const { bookings, catalog } = useApp()
  const sorted = [...bookings]
  const upcoming = sorted.filter((b) => ['pending', 'confirmed'].includes(effectiveStatus(b))).sort((a, b) => +bookingStart(a.date, a.time) - +bookingStart(b.date, b.time))
  const history = sorted.filter((b) => effectiveStatus(b) === 'completed').sort((a, b) => +bookingStart(b.date, b.time) - +bookingStart(a.date, a.time))
  const cancelled = sorted.filter((b) => effectiveStatus(b) === 'cancelled')

  const card = (b: Booking) => {
    const m = catalog.monitors.find((x) => x.id === b.monitorId)
    const s = catalog.services.find((x) => x.id === b.serviceId)
    return (
      <li key={b.id}>
        <Link to={`/reservas/${b.id}`} className="anim-fade-up flex items-center gap-3 rounded-2xl bg-white p-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2"><b className="truncate">{m?.name}</b><Badge s={effectiveStatus(b)} /></div>
            <p className="text-[13.5px] text-brand">{m?.sport} · {s?.name}</p>
            <p className="mt-1 text-[13.5px] text-muted"><span>{formatDateShort(b.date)}</span> · {b.time} · {formatDuration(b.durationMin)} · {formatPrice(b.price)}</p>
          </div>
          <ChevronIcon className="text-muted" size={18} />
        </Link>
      </li>
    )
  }
  const section = (title: string, list: Booking[]) => list.length > 0 && (
    <section className="mb-6"><h2 className="mb-2 text-[15px] font-bold">{title}</h2><ul className="grid gap-2.5">{list.map(card)}</ul></section>
  )

  return (
    <div className="h-full overflow-y-auto bg-surface px-4 pb-6 pt-4">
      <h1 className="mb-4 text-2xl font-extrabold">Reservas</h1>
      {bookings.length === 0 ? (
        <EmptyState emoji="📅" title="Todavía no tienes entrenamientos reservados" text="Descubre tu próximo monitor.">
          <Link to="/" className="rounded-2xl bg-brand px-5 py-3.5 text-center font-semibold text-white">Ver el feed</Link>
          <Link to="/explorar" className="rounded-2xl border border-[#dfe5f0] bg-white px-5 py-3.5 text-center font-semibold">Explorar monitores</Link>
        </EmptyState>
      ) : (<>
        {section('Próximas reservas', upcoming)}
        {section('Historial', history)}
        {section('Canceladas', cancelled)}
      </>)}
    </div>
  )
}

export function BookingDetailScreen() {
  const { id } = useParams()
  const nav = useNavigate()
  const { bookings, catalog, cancelBooking, showToast } = useApp()
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const b = bookings.find((x) => x.id === id)
  if (!b) return <div className="h-full bg-surface"><PageHeader title="Reserva" /><EmptyState emoji="🤷" title="Reserva no encontrada" text="Puede que se haya eliminado."><Button onClick={() => nav('/reservas')}>Mis reservas</Button></EmptyState></div>
  const m = catalog.monitors.find((x) => x.id === b.monitorId)
  const s = catalog.services.find((x) => x.id === b.serviceId)
  const status = effectiveStatus(b)

  const cancel = async () => {
    setBusy(true)
    try { await cancelBooking(b.id); showToast('Reserva cancelada. El horario vuelve a estar libre.'); setConfirming(false) }
    catch (e) { showToast(e instanceof BookingError ? e.message : 'No se pudo cancelar') }
    finally { setBusy(false) }
  }
  const rows: [string, React.ReactNode][] = [
    ['Monitor', m?.name], ['Deporte', m?.sport], ['Entrenamiento', s?.name],
    ['Fecha', <span>{formatDateLong(b.date)}</span>],
    ['Hora', `${b.time} – ${minToTime(timeToMin(b.time) + b.durationMin)}`],
    ['Duración', formatDuration(b.durationMin)], ['Lugar', m?.location], ['Precio', formatPrice(b.price)],
  ]
  return (
    <div className="h-full overflow-y-auto bg-surface pb-8">
      <PageHeader title="Detalle de la reserva" />
      <div className="px-4">
        <div className="mb-3"><Badge s={status} /></div>
        <dl className="divide-y divide-[#eef1f6] rounded-2xl bg-white px-4 text-[15px]">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
        </dl>
        <p className="mt-3 text-[12.5px] text-muted">Referencia: {b.id.slice(0, 8)} · Reserva de prueba, sin cobro. Cancelación gratuita hasta {CANCEL_LIMIT_HOURS} h antes.</p>
        <div className="mt-5 grid gap-2">
          <Button variant="light" onClick={() => nav(`/monitor/${b.monitorId}`)}>Ver perfil del monitor</Button>
          {status === 'completed' && <Button onClick={() => nav(`/reservar/${b.monitorId}?servicio=${b.serviceId}`)}>Repetir entrenamiento</Button>}
          {(status === 'confirmed' || status === 'pending') && (canCancel(b)
            ? confirming
              ? <div className="grid gap-2 rounded-2xl bg-white p-4"><p>¿Seguro que quieres cancelar esta reserva?</p>
                  <Button variant="danger" disabled={busy} onClick={cancel}>{busy ? 'Cancelando…' : 'Sí, cancelar reserva'}</Button>
                  <Button variant="ghost" onClick={() => setConfirming(false)}>No, mantenerla</Button></div>
              : <Button variant="danger" onClick={() => setConfirming(true)}>Cancelar reserva</Button>
            : <p className="rounded-xl bg-white p-3 text-[13.5px] text-muted">Ya no se puede cancelar desde la app (quedan menos de {CANCEL_LIMIT_HOURS} h).</p>)}
        </div>
      </div>
    </div>
  )
}
