import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  linkTo?: string
  linkLabel?: string
  light?: boolean
  centered?: boolean
  children?: ReactNode
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  linkTo,
  linkLabel,
  light = false,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-10 md:mb-12 ${
        centered
          ? 'text-center max-w-2xl mx-auto'
          : 'flex flex-col md:flex-row md:items-end md:justify-between gap-4'
      }`}
    >
      <div className={centered ? '' : 'max-w-xl'}>
        {eyebrow && (
          <span
            className={`inline-block text-[12px] font-semibold tracking-[0.02em] mb-2.5 ${
              light ? 'text-gold' : 'text-rose'
            }`}
          >
            {eyebrow}
          </span>
        )}
        <h2 className={`display-sm ${light ? 'text-white' : 'text-navy'}`}>{title}</h2>
        {description && (
          <p className={`mt-3 body-lg ${light ? 'text-white/60' : 'text-muted'} ${centered ? '' : 'max-w-lg'}`}>
            {description}
          </p>
        )}
      </div>
      {linkTo && linkLabel && !centered && (
        <Link
          to={linkTo}
          className={`inline-flex items-center gap-1.5 text-[13px] font-semibold shrink-0 pressable-soft ${
            light ? 'text-gold hover:text-gold-light' : 'text-navy/70 hover:text-navy'
          }`}
        >
          {linkLabel}
          <ChevronLeft className="w-4 h-4 opacity-60" />
        </Link>
      )}
    </div>
  )
}
