import { Link } from 'react-router-dom'

type LogoProps = {
  variant?: 'full' | 'mark' | 'light'
  className?: string
  to?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { mark: 'h-8 w-8', text: 'text-[15px]', sub: 'text-[9px]' },
  md: { mark: 'h-10 w-10', text: 'text-[18px]', sub: 'text-[10px]' },
  lg: { mark: 'h-11 w-11', text: 'text-[20px]', sub: 'text-[11px]' },
}

export function RaidaMark({ className = '', title = 'RAIDA' }: { className?: string; title?: string }) {
  return (
    <img
      src="/raida-icon.png"
      alt={title}
      width={40}
      height={40}
      className={`${className} object-cover`}
      draggable={false}
    />
  )
}

export default function Logo({ variant = 'full', className = '', to = '/', size = 'md' }: LogoProps) {
  const s = sizes[size]
  const light = variant === 'light'

  const mark = (
    <RaidaMark
      className={`${s.mark} rounded-[12px] shadow-xs ring-1 ${light ? 'ring-white/15' : 'ring-navy/10'} shrink-0`}
    />
  )

  const content =
    variant === 'mark' ? (
      mark
    ) : (
      <span className="flex items-center gap-2.5 min-w-0">
        {mark}
        <span className="leading-none text-right">
          <span
            className={`block font-display font-extrabold tracking-[-0.03em] ${s.text} ${
              light ? 'text-white' : 'text-navy'
            }`}
          >
            RAIDA
          </span>
          <span
            className={`block mt-0.5 font-medium tracking-[0.02em] ${s.sub} ${
              light ? 'text-rose-light' : 'text-rose'
            }`}
          >
            رائدة
          </span>
        </span>
      </span>
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
