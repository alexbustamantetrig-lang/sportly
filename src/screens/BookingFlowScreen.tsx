import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { BookingError } from '../services/api'
import { BOOKING_WINDOW_DAYS, CANCEL_LIMIT_HOURS, slotsForDay } from '../utils/availability'
import { addDays, formatDateLong, formatDuration, formatMonthYear, formatPrice, minToTime, startOfDay, timeToMin, toISODate } from '../utils/dates'
import { Button, DemoTag, EmptyState, PageHeader } from '../components/ui'
import { CheckIcon } from '../components/Icons'
import type { Booking } from '../types'

const STEPS = ['Entrenamiento', 'Fecha', 'Horario', 'Resumen']

export function BookingFlowScreen() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { catalog, bookings, createBooking } = useApp()
  const monitor = catalog.monitors.find((m) => m.id === id)
  const services = useMemo(() => catalog.services.filter((s) => s.monitorId === id && s.status === 'active'), [catalog, id])

  const preset = services.find((s) => s.id === params.get('servicio'))
  const [step, setStep] = useState(preset ? 1 : 0)
  const [serviceId, setServiceId] = useState<string | null>(preset?.id ?? null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [month, setMonth] = useState(() => startOfDay(new Date()))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<Booking | null>(null)
  const lock = useRef(false)

  const service = services.find((s) => s.id === serviceId)
  const availability = catalog.availability.find((a) => a.monitorId === id)

  if (!monitor || services.length === 0) {
    return (
      <div className="h-full bg-surface"><PageHeader title="Reservar" />
        <EmptyState emoji="🤷" title="No se puede reservar" text="Este monitor no existe o no tiene entrenamientos activos.">
          <Button onClick={() => nav('/explorar')}>Explorar monitores</Button>
        </EmptyState></div>
    )
  }

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-surface px-6 text-center">
        <div className="anim-pop mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ok text-white"><CheckIcon size={40} /></div>
        <h1 className="text-2xl font-extrabold">¡Reserva confirmada!</h1>
        <p className="mt-2 text-[15px]">{service?.name} con <b>{monitor.name}</b></p>
        <p className="text-[15px] text-muted">{formatDateLong(done.date)} · {done.time}</p>
        <p className="mt-4 max-w-xs text-[12.5px] text-muted">Reserva de prueba: no se ha realizado ningún cobro ni se ha avisado al monitor (datos de demostración).</p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
          <Button onClick={() => nav(`/reservas/${done.id}`, { replace: true })}>Ver mi reserva</Button>
          <Button variant="light" onClick={() => nav('/', { replace: true })}>Volver al inicio</Button>
        </div>
      </div>
    )
  }

  const duration = service?.durationMin ?? 60
  const slotsOf = (iso: string) => slotsForDay(availability, bookings, monitor.id, iso, duration)
  const slots = date ? slotsOf(date) : []

  const confirm = async () => {
    if (lock.current || !service || !date || !time) return // evita dobles envíos
    lock.current = true
    setSubmitting(true); setError(null)
    try {
      setDone(await createBooking({ monitorId: monitor.id, serviceId: service.id, date, time }))
    } catch (e) {
      setError(e instanceof BookingError ? e.message : 'No se pudo crear la reserva. Inténtalo de nuevo.')
      if (e instanceof BookingError && e.code === 'slot_taken') { setTime(null); setStep(2) }
    } finally {
      lock.current = false
      setSubmitting(false)
    }
  }

  const canNext = [!!service, !!date, !!time, true][step]
  const back = () => (step === 0 ? nav(-1) : setStep(step - 1))

  return (
    <div className="flex h-full flex-col bg-surface">
      <PageHeader title={`Reservar con ${monitor.name}`} />
      <ol className="flex gap-1 px-4 pb-3" aria-label="Progreso">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1" aria-current={i === step ? 'step' : undefined}>
            <div className={`h-1.5 rounded-full ${i <= step ? 'bg-brand' : 'bg-[#dfe5f0]'}`} />
            <span className={`mt-1 block text-[11px] ${i === step ? 'font-bold' : 'text-muted'}`}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {error && <div role="alert" className="mb-3 rounded-xl bg-[#fdecec] p-3 text-[14px] text-danger">{error}</div>}

        {step === 0 && (
          <fieldset><legend className="mb-3 text-lg font-bold">Elige tu entrenamiento</legend>
            <div className="grid gap-3">{services.map((s) => (
              <label key={s.id} className={`cursor-pointer rounded-2xl border-2 bg-white p-4 ${serviceId === s.id ? 'border-brand' : 'border-transparent'}`}>
                <input type="radio" name="service" className="sr-only" checked={serviceId === s.id}
                  onChange={() => { setServiceId(s.id); setTime(null); setDate(null) }} />
                <div className="flex justify-between gap-3"><b>{s.name}</b><b className="text-brand">{formatPrice(s.price)}</b></div>
                <p className="text-[14px] text-muted">{s.description}</p>
                <p className="mt-1 text-[13px]">{formatDuration(s.durationMin)} · {s.modality} · Nivel: {s.level}</p>
              </label>))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div><h2 className="mb-3 text-lg font-bold">Elige el día</h2>
            <Calendar month={month} setMonth={setMonth} selected={date} onSelect={(d) => { setDate(d); setTime(null) }}
              isAvailable={(iso) => slotsOf(iso).some((s) => s.available)} />
            <p className="mt-3 text-[13px] text-muted">Puedes reservar hasta {BOOKING_WINDOW_DAYS} días vista. Los días en gris no tienen horas libres.</p>
          </div>
        )}

        {step === 2 && date && (
          <div><h2 className="mb-1 text-lg font-bold">Elige la hora</h2>
            <p className="mb-3 text-[14px] text-muted">{formatDateLong(date)} · {formatDuration(duration)}</p>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Horarios">
              {slots.map((s) => (
                <button key={s.time} type="button" role="radio" aria-checked={time === s.time} disabled={!s.available} onClick={() => setTime(s.time)}
                  className={`rounded-xl border-2 py-3 text-[15px] font-semibold ${time === s.time ? 'border-brand bg-brand text-white' : s.available ? 'border-[#dfe5f0] bg-white text-ok hover:border-brand' : 'border-transparent bg-[#eceff5] text-[#aab3c2] line-through'}`}>
                  {s.time}
                </button>))}
            </div>
            {slots.every((s) => !s.available) && <p className="mt-4 text-muted">No quedan horas este día. Elige otra fecha.</p>}
          </div>
        )}

        {step === 3 && service && date && time && (
          <div><h2 className="mb-3 text-lg font-bold">Resumen</h2>
            <dl className="divide-y divide-[#eef1f6] rounded-2xl bg-white px-4 text-[15px]">
              <Row k="Monitor" v={<>{monitor.name} {monitor.isDemo && <DemoTag />}</>} />
              <Row k="Entrenamiento" v={service.name} />
              <Row k="Fecha" v={<span>{formatDateLong(date)}</span>} />
              <Row k="Hora" v={`${time} – ${minToTime(timeToMin(time) + service.durationMin)}`} />
              <Row k="Duración" v={formatDuration(service.durationMin)} />
              <Row k="Modalidad" v={`${service.modality} · ${monitor.location}`} />
              <Row k="Precio" v={<b className="text-brand">{formatPrice(service.price)}</b>} />
            </dl>
            <p className="mt-3 text-[13px] text-muted">Cancelación gratuita hasta {CANCEL_LIMIT_HOURS} h antes. Después no es posible cancelar desde la app. En esta versión no se cobra nada: es una reserva de prueba.</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-[#e6ebf4] bg-white p-3">
        <Button variant="light" onClick={back} disabled={submitting}>{step === 0 ? 'Cancelar' : 'Atrás'}</Button>
        {step < 3 ? (
          <Button className="flex-1" disabled={!canNext} onClick={() => { setError(null); setStep(step + 1) }}>Continuar</Button>
        ) : (
          <Button className="flex-1" disabled={submitting} onClick={confirm}>{submitting ? 'Reservando…' : 'Confirmar reserva'}</Button>
        )}
      </div>
      <Link to={`/monitor/${monitor.id}`} className="sr-only">Volver al perfil</Link>
    </div>
  )
}

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-3"><dt className="text-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
)

function Calendar({ month, setMonth, selected, onSelect, isAvailable }: {
  month: Date; setMonth: (d: Date) => void; selected: string | null; onSelect: (iso: string) => void; isAvailable: (iso: string) => boolean
}) {
  const today = startOfDay(new Date())
  const last = addDays(today, BOOKING_WINDOW_DAYS)
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  const prevOk = first > today
  const nextOk = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= last
  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="Mes anterior" disabled={!prevOk} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-full px-3 py-1 text-xl disabled:opacity-30">‹</button>
        <b>{formatMonthYear(month)}</b>
        <button type="button" aria-label="Mes siguiente" disabled={!nextOk} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-full px-3 py-1 text-xl disabled:opacity-30">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[12px] text-muted">{['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />
          const iso = toISODate(d)
          const inWindow = d >= today && d <= last
          const ok = inWindow && isAvailable(iso)
          const sel = selected === iso
          return (
            <button key={iso} type="button" disabled={!ok} aria-pressed={sel} aria-label={`${formatDateLong(iso)}${ok ? '' : ', sin disponibilidad'}`} onClick={() => onSelect(iso)}
              className={`aspect-square rounded-full text-[14px] font-medium ${sel ? 'bg-brand text-white' : ok ? 'bg-[#e3f6ec] text-ok hover:bg-[#cdeedd]' : 'text-[#c0c7d3]'}`}>
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
