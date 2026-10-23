import { useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import type { Level, Modality, Monitor, Service, Sport, UserContent, Video, WeeklyAvailability } from '../types'
import { SPORTS } from '../utils/filters'
import { MAX_VIDEO_MB, MY_MONITOR_ID, deleteBlob, putBlob } from '../services/userContent'
import { Button, Chip, PageHeader } from '../components/ui'
import { CloseIcon } from '../components/Icons'
import { SPORT_THEME } from '../components/SportArt'

const LEVELS: Level[] = ['Principiante', 'Intermedio', 'Avanzado']
const MODALITIES: Modality[] = ['Presencial', 'Online', 'Grupal']
const DAYS = [[1, 'Lunes'], [2, 'Martes'], [3, 'Miércoles'], [4, 'Jueves'], [5, 'Viernes'], [6, 'Sábado'], [7, 'Domingo']] as const
const HOURS = Array.from({ length: 15 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`)
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

const input = 'mt-1 w-full rounded-xl border border-[#dfe5f0] bg-white px-3 py-2.5 text-[15px] outline-none focus:border-brand'
const Section = ({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) => (
  <section className="mt-4 rounded-2xl bg-white p-4"><h2 className="text-[16px] font-bold">{title}</h2>
    {hint && <p className="mb-3 text-[12.5px] text-muted">{hint}</p>}{children}</section>
)

const emptyMonitor = (name: string): Monitor => ({
  id: MY_MONITOR_ID, userId: 'local-user', name, sport: 'Tenis', tagline: '', specialties: [], bio: '', location: '', city: '',
  languages: ['Español'], levelsTaught: ['Principiante'], yearsExperience: 1, credentials: [], fromPrice: 0,
  verified: false, isDemo: false, accent: '#7fb2ff', createdAt: new Date().toISOString(),
})

/** Crear / editar el perfil de monitor propio. Todo queda guardado en este dispositivo (prototipo sin backend). */
export function MonitorEditorScreen() {
  const { myContent, saveMyContent, profile, showToast } = useApp()
  const nav = useNavigate()
  const [m, setM] = useState<Monitor>(() => myContent?.monitor ?? emptyMonitor(profile.name === 'Invitado' ? '' : profile.name))
  const [services, setServices] = useState<Service[]>(() => myContent?.services ?? [])
  const [videos, setVideos] = useState<Video[]>(() => myContent?.videos ?? [])
  const [days, setDays] = useState<WeeklyAvailability['days']>(() => myContent?.availability.days ?? {})
  const [published, setPublished] = useState(myContent?.published ?? true)
  const [spec, setSpec] = useState(m.specialties.join(', '))
  const [langs, setLangs] = useState(m.languages.join(', '))
  const [creds, setCreds] = useState(m.credentials.join('\n'))
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof Monitor>(k: K, v: Monitor[K]) => setM((c) => ({ ...c, [k]: v }))
  const list = (t: string) => t.split(/[,\n]/).map((x) => x.trim()).filter(Boolean)

  /* --- servicios --- */
  const addService = () => setServices((s) => [...s, {
    id: `${MY_MONITOR_ID}-s-${uid()}`, monitorId: MY_MONITOR_ID, name: '', description: '', durationMin: 60, price: 30,
    modality: 'Presencial', level: 'Todos', status: 'active',
  }])
  const patchService = (id: string, p: Partial<Service>) => setServices((s) => s.map((x) => (x.id === id ? { ...x, ...p } : x)))

  /* --- disponibilidad --- */
  const toggleHour = (d: number, h: string) => setDays((cur) => {
    const key = d as 1
    const has = cur[key]?.includes(h)
    const next = has ? cur[key]!.filter((x) => x !== h) : [...(cur[key] ?? []), h].sort()
    return { ...cur, [key]: next }
  })

  /* --- vídeos --- */
  const fileRef = useRef<HTMLInputElement>(null)
  const [caption, setCaption] = useState('')
  const [url, setUrl] = useState('')
  const [rights, setRights] = useState(false)
  const [vErr, setVErr] = useState<string | null>(null)

  const addVideo = async (file?: File) => {
    setVErr(null)
    if (!rights) return setVErr('Confirma que tienes derechos sobre el vídeo y sobre las personas que salen en él.')
    if (!caption.trim()) return setVErr('Escribe una frase para el vídeo.')
    const base: Video = { id: `${MY_MONITOR_ID}-v-${uid()}`, monitorId: MY_MONITOR_ID, caption: caption.trim(), sport: m.sport, publishedAt: new Date().toISOString().slice(0, 10), status: 'published', likes: 0, isDemo: false }
    if (file) {
      if (!file.type.startsWith('video/')) return setVErr('El archivo no es un vídeo.')
      if (file.size > MAX_VIDEO_MB * 1024 * 1024) return setVErr(`El vídeo pesa más de ${MAX_VIDEO_MB} MB.`)
      try { base.blobId = `blob-${uid()}`; await putBlob(base.blobId, file) } catch { return setVErr('No se pudo guardar el vídeo en este navegador (¿modo privado o sin espacio?).') }
    } else {
      if (!/^https:\/\/\S+$/i.test(url.trim())) return setVErr('Pega una URL de vídeo que empiece por https://')
      base.src = url.trim()
    }
    setVideos((v) => [base, ...v]); setCaption(''); setUrl(''); if (fileRef.current) fileRef.current.value = ''
    showToast('Vídeo añadido. Pulsa «Guardar perfil» para publicarlo.')
  }
  const removeVideo = (v: Video) => { setVideos((x) => x.filter((y) => y.id !== v.id)); if (v.blobId && !myContent?.videos.some((o) => o.blobId === v.blobId)) void deleteBlob(v.blobId).catch(() => {}) }

  /* --- guardar --- */
  const save = async () => {
    const errs: string[] = []
    if (m.name.trim().length < 2) errs.push('El nombre público es obligatorio.')
    if (!m.tagline.trim()) errs.push('Añade una frase de presentación.')
    if (m.bio.trim().length < 20) errs.push('La biografía necesita al menos 20 caracteres.')
    if (!m.city.trim()) errs.push('Indica tu ciudad.')
    if (services.length === 0) errs.push('Añade al menos un entrenamiento.')
    services.forEach((s, i) => {
      if (!s.name.trim()) errs.push(`Entrenamiento ${i + 1}: falta el nombre.`)
      if (!(s.price >= 0)) errs.push(`Entrenamiento ${i + 1}: precio no válido.`)
      if (!(s.durationMin >= 15)) errs.push(`Entrenamiento ${i + 1}: duración mínima 15 min.`)
    })
    if (!Object.values(days).some((h) => h && h.length)) errs.push('Marca al menos una hora de disponibilidad.')
    setErrors(errs)
    if (errs.length) return window.scrollTo?.(0, 0)
    setSaving(true)
    const monitor: Monitor = {
      ...m, name: m.name.trim(), tagline: m.tagline.trim(), bio: m.bio.trim(), city: m.city.trim(),
      location: m.location.trim() || m.city.trim(), specialties: list(spec).length ? list(spec) : [m.sport],
      languages: list(langs), credentials: list(creds), fromPrice: Math.min(...services.map((s) => s.price)),
      sport: m.sport, accent: SPORT_THEME[m.sport].to, verified: false,
    }
    const content: UserContent = {
      monitor, services: services.map((s) => ({ ...s, name: s.name.trim() })),
      videos: videos.map((v) => ({ ...v, sport: m.sport })), availability: { monitorId: MY_MONITOR_ID, days }, published,
    }
    await saveMyContent(content)
    setSaving(false)
    showToast(published ? 'Perfil guardado y publicado' : 'Perfil guardado (oculto)')
    nav('/perfil')
  }

  const del = async () => {
    if (!window.confirm('¿Eliminar tu perfil de monitor, sus entrenamientos y vídeos de este dispositivo?')) return
    await saveMyContent(null); showToast('Perfil de monitor eliminado'); nav('/perfil')
  }

  return (
    <div className="relative h-full bg-surface">
      <div className="h-full overflow-y-auto pb-28">
      <PageHeader title={myContent ? 'Mi perfil de monitor' : 'Crear perfil de monitor'} />
      <div className="px-4">
        {errors.length > 0 && <ul role="alert" className="mb-2 list-disc rounded-xl bg-[#fdecec] p-3 pl-7 text-[14px] text-danger">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
        <p className="rounded-xl bg-[#fff4d6] p-3 text-[12.5px] text-[#8a6100]">Prototipo: tu perfil se guarda solo en este dispositivo y se mezcla con los monitores de demostración. Aún no hay verificación de identidad, así que se muestra como «no verificado».</p>

        <Section title="Datos básicos">
          <label className="block text-[13px] font-semibold">Nombre público<input className={input} value={m.name} maxLength={40} onChange={(e) => set('name', e.target.value)} /></label>
          <p className="mt-3 text-[13px] font-semibold">Deporte principal</p>
          <div className="mt-1 flex flex-wrap gap-2">{SPORTS.map((s) => <Chip key={s} active={m.sport === s} onClick={() => set('sport', s as Sport)}>{s}</Chip>)}</div>
          <label className="mt-3 block text-[13px] font-semibold">Frase de presentación<input className={input} value={m.tagline} maxLength={70} placeholder="Mejora tu técnica desde cero" onChange={(e) => set('tagline', e.target.value)} /></label>
          <label className="mt-3 block text-[13px] font-semibold">Sobre ti<textarea className={input} rows={4} value={m.bio} maxLength={600} placeholder="Tu experiencia y cómo entrenas" onChange={(e) => set('bio', e.target.value)} /></label>
          <label className="mt-3 block text-[13px] font-semibold">Especialidades (separadas por comas)<input className={input} value={spec} onChange={(e) => setSpec(e.target.value)} /></label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block text-[13px] font-semibold">Ciudad<input className={input} value={m.city} onChange={(e) => set('city', e.target.value)} /></label>
            <label className="block text-[13px] font-semibold">Lugar / zona<input className={input} value={m.location} placeholder="Barrio o instalación" onChange={(e) => set('location', e.target.value)} /></label>
            <label className="block text-[13px] font-semibold">Años de experiencia<input className={input} type="number" min={0} max={60} value={m.yearsExperience} onChange={(e) => set('yearsExperience', Math.max(0, Number(e.target.value)))} /></label>
            <label className="block text-[13px] font-semibold">Idiomas<input className={input} value={langs} onChange={(e) => setLangs(e.target.value)} /></label>
          </div>
          <p className="mt-3 text-[13px] font-semibold">Niveles a los que enseñas</p>
          <div className="mt-1 flex flex-wrap gap-2">{LEVELS.map((l) => <Chip key={l} active={m.levelsTaught.includes(l)} onClick={() => set('levelsTaught', m.levelsTaught.includes(l) ? m.levelsTaught.filter((x) => x !== l) : [...m.levelsTaught, l])}>{l}</Chip>)}</div>
          <label className="mt-3 block text-[13px] font-semibold">Titulaciones (una por línea)<textarea className={input} rows={2} value={creds} placeholder="Solo las que puedas acreditar" onChange={(e) => setCreds(e.target.value)} /></label>
        </Section>

        <Section title="Entrenamientos" hint="Lo que ofreces y a qué precio. El usuario elige uno al reservar.">
          {services.map((s, i) => (
            <div key={s.id} className="mb-3 rounded-xl border border-[#e6ebf4] p-3">
              <div className="flex items-center justify-between"><b className="text-[14px]">Entrenamiento {i + 1}</b>
                <button type="button" aria-label={`Eliminar entrenamiento ${i + 1}`} onClick={() => setServices((x) => x.filter((y) => y.id !== s.id))} className="rounded-full p-1 text-muted hover:bg-black/5"><CloseIcon size={18} /></button></div>
              <label className="block text-[13px] font-semibold">Nombre<input className={input} value={s.name} onChange={(e) => patchService(s.id, { name: e.target.value })} /></label>
              <label className="mt-2 block text-[13px] font-semibold">Descripción<input className={input} value={s.description} onChange={(e) => patchService(s.id, { description: e.target.value })} /></label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className="block text-[13px] font-semibold">Duración (min)<input className={input} type="number" step={15} min={15} max={480} value={s.durationMin} onChange={(e) => patchService(s.id, { durationMin: Number(e.target.value) })} /></label>
                <label className="block text-[13px] font-semibold">Precio (€)<input className={input} type="number" min={0} value={s.price} onChange={(e) => patchService(s.id, { price: Number(e.target.value) })} /></label>
                <label className="block text-[13px] font-semibold">Modalidad<select className={input} value={s.modality} onChange={(e) => patchService(s.id, { modality: e.target.value as Modality })}>{MODALITIES.map((x) => <option key={x}>{x}</option>)}</select></label>
                <label className="block text-[13px] font-semibold">Nivel<select className={input} value={s.level} onChange={(e) => patchService(s.id, { level: e.target.value as Service['level'] })}>{['Todos', ...LEVELS].map((x) => <option key={x}>{x}</option>)}</select></label>
              </div>
            </div>))}
          <Button variant="light" className="w-full" onClick={addService}>+ Añadir entrenamiento</Button>
        </Section>

        <Section title="Disponibilidad semanal" hint="Marca las horas de inicio en las que puedes dar clase. Se repiten cada semana.">
          {DAYS.map(([d, label]) => (
            <div key={d} className="mb-3"><p className="text-[13px] font-semibold">{label}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">{HOURS.map((h) => {
                const on = days[d]?.includes(h)
                return <button key={h} type="button" aria-pressed={!!on} onClick={() => toggleHour(d, h)} className={`rounded-lg border px-2 py-1 text-[12.5px] font-medium ${on ? 'border-brand bg-brand text-white' : 'border-[#dfe5f0] bg-white'}`}>{h}</button>
              })}</div></div>))}
        </Section>

        <Section title="Vídeos" hint={`Sube un vídeo vertical (hasta ${MAX_VIDEO_MB} MB) o pega una URL https. Aparecerán en el feed.`}>
          <label className="block text-[13px] font-semibold">Frase del vídeo<input className={input} value={caption} maxLength={80} onChange={(e) => setCaption(e.target.value)} placeholder="Ej. El saque que cambia tu partido" /></label>
          <label className="mt-3 flex items-start gap-2 text-[13px]"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand" checked={rights} onChange={(e) => setRights(e.target.checked)} />
            Confirmo que tengo derechos sobre este vídeo y el consentimiento de las personas que aparecen.</label>
          <div className="mt-3 flex flex-col gap-2">
            <input ref={fileRef} id="video-file" type="file" accept="video/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) void addVideo(f) }} />
            <Button variant="light" onClick={() => fileRef.current?.click()}>Subir vídeo desde el dispositivo</Button>
            <div className="flex gap-2"><input className={`${input} !mt-0 flex-1`} aria-label="URL del vídeo" placeholder="https://…/video.mp4" value={url} onChange={(e) => setUrl(e.target.value)} />
              <Button variant="light" onClick={() => void addVideo()}>Añadir URL</Button></div>
          </div>
          {vErr && <p role="alert" className="mt-2 text-[13.5px] text-danger">{vErr}</p>}
          {videos.length === 0 ? <p className="mt-3 text-[13.5px] text-muted">Todavía no has añadido vídeos.</p> : (
            <ul className="mt-3 grid gap-2">{videos.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 rounded-xl bg-surface p-3 text-[14px]">
                <span className="min-w-0"><b className="block truncate">{v.caption}</b><span className="text-[12px] text-muted">{v.blobId ? 'Subido desde el dispositivo' : 'Enlace externo'}</span></span>
                <button type="button" className="shrink-0 text-[13px] font-semibold text-danger" onClick={() => removeVideo(v)}>Quitar</button></li>))}</ul>)}
        </Section>

        <Section title="Visibilidad">
          <label className="flex items-center justify-between text-[15px]">Perfil visible para otros usuarios
            <input type="checkbox" role="switch" className="h-5 w-5 accent-brand" checked={published} onChange={(e) => setPublished(e.target.checked)} /></label>
        </Section>

        {myContent && <div className="mt-4 grid gap-2">
          <Link to={`/monitor/${MY_MONITOR_ID}`} className="rounded-2xl border border-[#dfe5f0] bg-white px-5 py-3.5 text-center font-semibold">Ver mi perfil público</Link>
          <Button variant="danger" onClick={del}>Eliminar mi perfil de monitor</Button></div>}
      </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-[#e6ebf4] bg-white/95 p-3 backdrop-blur">
        <Button className="w-full" disabled={saving} onClick={save}>{saving ? 'Guardando…' : 'Guardar perfil'}</Button>
      </div>
    </div>
  )
}
