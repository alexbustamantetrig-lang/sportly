import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { StarIcon, BackIcon } from './Icons'
import { useNavigate } from 'react-router-dom'

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'light' }

export function Button({ variant = 'primary', className = '', ...p }: BtnProps) {
  const styles = {
    primary: 'bg-brand text-white hover:bg-[#0f57d9] disabled:bg-[#a9c3f5]',
    light: 'bg-white text-brand-dark border border-[#e1e6f0] hover:bg-[#eef2fa] disabled:opacity-50',
    ghost: 'bg-transparent text-brand hover:bg-[#e8f0ff] disabled:opacity-50',
    danger: 'bg-white text-danger border border-[#f0c4c4] hover:bg-[#fdf1f1] disabled:opacity-50',
  }[variant]
  return (
    <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition disabled:cursor-not-allowed ${styles} ${className}`} />
  )
}

export function Stars({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
      <StarIcon size={14} filled className="text-[#f5b301]" />
      {value.toFixed(1)}
      {count !== undefined && <span className="font-normal text-muted">({count})</span>}
    </span>
  )
}

export function DemoTag({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-block rounded-full bg-[#fff4d6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8a6100] ${className}`}>
      Datos de prueba
    </span>
  )
}

export function Avatar({ name, color, size = 44 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-[#08121f] ring-2 ring-white/80"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initials}
    </span>
  )
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-2 text-[14px] font-medium transition ${active ? 'border-brand bg-brand text-white' : 'border-[#dfe5f0] bg-white text-brand-dark hover:border-brand'}`}>
      {children}
    </button>
  )
}

export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 bg-surface/95 px-4 py-3 backdrop-blur">
      <button type="button" aria-label="Volver" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))}
        className="-ml-2 rounded-full p-2 text-brand-dark hover:bg-black/5"><BackIcon /></button>
      <h1 className="flex-1 truncate text-[17px] font-bold">{title}</h1>
      {right}
    </header>
  )
}

export function EmptyState({ emoji, title, text, children }: { emoji: string; title: string; text: string; children?: ReactNode }) {
  return (
    <div className="anim-fade-up mx-auto flex max-w-xs flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 text-5xl" aria-hidden="true">{emoji}</div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-[15px] text-muted">{text}</p>
      <div className="mt-6 flex flex-col gap-2 self-stretch">{children}</div>
    </div>
  )
}
