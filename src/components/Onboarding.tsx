import { useState } from 'react'
import type { Level, Sport } from '../types'
import { SPORTS } from '../utils/filters'
import { useApp } from '../state/AppContext'
import { Button, Chip } from './ui'

const LEVELS: Level[] = ['Principiante', 'Intermedio', 'Avanzado']
const GOALS = ['Aprender desde cero', 'Mejorar mi técnica', 'Competir', 'Mantenerme en forma', 'Pasarlo bien']

/** Onboarding corto y saltable. Sólo guarda lo que el usuario elige. */
export function Onboarding({ onClose }: { onClose: () => void }) {
  const { updateProfile, catalog } = useApp()
  const [sports, setSports] = useState<Sport[]>([])
  const [level, setLevel] = useState<Level | undefined>()
  const [goals, setGoals] = useState<string[]>([])
  const [zone, setZone] = useState('')
  const [step, setStep] = useState(0)
  const cities = [...new Set(catalog.monitors.map((m) => m.city))].sort()
  const toggle = <T,>(l: T[], v: T) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v])

  const finish = (skip: boolean) => {
    updateProfile(skip ? {} : { sports, level, goals, zone })
    onClose()
  }
  const titles = ['¿Qué deportes te interesan?', '¿Qué nivel tienes?', '¿Qué buscas?', '¿Dónde quieres entrenar?']
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="ob-title" className="absolute inset-0 z-50 flex flex-col bg-surface p-5">
      <div className="flex items-center justify-between"><span className="font-extrabold tracking-[0.18em] text-brand">SPORTLY</span>
        <button type="button" onClick={() => finish(true)} className="text-[14px] font-semibold text-muted">Saltar</button></div>
      <div className="mt-8 flex-1 overflow-y-auto">
        <p className="text-[13px] font-semibold text-brand">Paso {step + 1} de 4 · opcional</p>
        <h1 id="ob-title" className="mb-5 mt-1 text-2xl font-extrabold">{titles[step]}</h1>
        <div className="flex flex-wrap gap-2">
          {step === 0 && SPORTS.map((s) => <Chip key={s} active={sports.includes(s)} onClick={() => setSports(toggle(sports, s))}>{s}</Chip>)}
          {step === 1 && LEVELS.map((l) => <Chip key={l} active={level === l} onClick={() => setLevel(level === l ? undefined : l)}>{l}</Chip>)}
          {step === 2 && GOALS.map((g) => <Chip key={g} active={goals.includes(g)} onClick={() => setGoals(toggle(goals, g))}>{g}</Chip>)}
          {step === 3 && cities.map((c) => <Chip key={c} active={zone === c} onClick={() => setZone(zone === c ? '' : c)}>{c}</Chip>)}
        </div>
        {step === 3 && <p className="mt-4 text-[13px] text-muted">Solo usamos esta zona para ordenar resultados. No se pide acceso a tu ubicación.</p>}
      </div>
      <div className="flex gap-2 pt-4">
        {step > 0 && <Button variant="light" onClick={() => setStep(step - 1)}>Atrás</Button>}
        <Button className="flex-1" onClick={() => (step < 3 ? setStep(step + 1) : finish(false))}>{step < 3 ? 'Siguiente' : 'Empezar'}</Button>
      </div>
    </div>
  )
}
