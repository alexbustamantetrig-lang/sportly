import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number; filled?: boolean }

function Icon({ size = 24, filled, children, ...rest }: P & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export const HomeIcon = (p: P) => <Icon {...p}><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></Icon>
export const SearchIcon = (p: P) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>
export const CalendarIcon = (p: P) => <Icon {...p}><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M8 2v4M16 2v4M3 10h18" /></Icon>
export const HeartIcon = (p: P) => <Icon {...p}><path d="M12 21s-8-5.4-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.6-8 11-8 11z" /></Icon>
export const UserIcon = (p: P) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Icon>
export const StarIcon = (p: P) => <Icon {...p}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></Icon>
export const PinIcon = (p: P) => <Icon {...p}><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></Icon>
export const ShareIcon = (p: P) => <Icon {...p}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5" /></Icon>
export const VolumeIcon = (p: P) => <Icon {...p}><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></Icon>
export const MuteIcon = (p: P) => <Icon {...p}><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M17 9l5 6M22 9l-5 6" /></Icon>
export const PlayIcon = (p: P) => <Icon {...p} filled><path d="M7 4l13 8-13 8z" /></Icon>
export const BackIcon = (p: P) => <Icon {...p}><path d="M15 5l-7 7 7 7" /></Icon>
export const CheckIcon = (p: P) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7" /></Icon>
export const CloseIcon = (p: P) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>
export const ClockIcon = (p: P) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>
export const ShieldIcon = (p: P) => <Icon {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></Icon>
export const FlagIcon = (p: P) => <Icon {...p}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></Icon>
export const ChevronIcon = (p: P) => <Icon {...p}><path d="M9 5l7 7-7 7" /></Icon>
export const FilterIcon = (p: P) => <Icon {...p}><path d="M3 5h18M6 12h12M10 19h4" /></Icon>
