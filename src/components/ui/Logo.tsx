import { Link } from 'react-router-dom'

type LogoProps = {
  /** full = light-bg logo (header), light = dark-bg logo (footer), mark = icon only */
  variant?: 'full' | 'mark' | 'light'
  className?: string
  to?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { full: 'h-9', mark: 'h-8 w-8' },
  md: { full: 'h-11', mark: 'h-10 w-10' },
  lg: { full: 'h-14', mark: 'h-12 w-12' },
}

const FULL_LOGOS = {
  full: '/raida-logo-light.png',
  light: '/raida-logo-dark.png',
} as const

export function RaidaMark({ className = '', title = 'RAIDA' }: { className?: string; title?: string }) {
  return (
    <img
      src="/raida-icon.png"
      alt={title}
      width={40}
      height={40}
      className={`${className} object-contain`}
      draggable={false}
    />
  )
}

export default function Logo({ variant = 'full', className = '', to = '/', size = 'md' }: LogoProps) {
  const s = sizes[size]

  const content =
    variant === 'mark' ? (
      <RaidaMark className={`${s.mark} shrink-0`} />
    ) : (
      <img
        src={FULL_LOGOS[variant]}
        alt="RAIDA رائدة"
        className={`${s.full} w-auto max-w-[min(100%,12.5rem)] object-contain object-right shrink-0`}
        draggable={false}
      />
    )

  if (to === null) {
    return <span className={`inline-flex items-center ${className}`}>{content}</span>
  }

  return (
    <Link
      to={to}
      className={`inline-flex items-center pressable-soft ${className}`}
      aria-label="RAIDA رائدة — الصفحة الرئيسية"
    >
      {content}
    </Link>
  )
}
