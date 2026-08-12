import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'gold' | 'rose' | 'navy' | 'soft' | 'glass'
  className?: string
}

const variants = {
  gold: 'bg-gold/12 text-gold-dark border-gold/25',
  rose: 'bg-rose/15 text-navy border-rose/30',
  navy: 'bg-navy/6 text-navy border-navy/10',
  soft: 'bg-blush text-navy/80 border-rose/15',
  glass: 'material-ultra-thin text-navy border-white/50',
}

export default function Badge({ children, variant = 'soft', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
