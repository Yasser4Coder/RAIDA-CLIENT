import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { safeHref } from '../../lib/safe'

type Variant = 'primary' | 'secondary' | 'gold' | 'soft' | 'outline' | 'ghost' | 'glass'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  to?: string
  href?: string
  className?: string
  target?: string
  rel?: string
}

const variants: Record<Variant, string> = {
  primary: 'bg-navy text-white shadow-sm edge-highlight hover:bg-navy-light',
  secondary: 'bg-rose text-navy shadow-sm hover:bg-rose-light',
  gold: 'bg-gold text-navy font-semibold shadow-sm edge-highlight hover:bg-gold-light',
  soft: 'bg-rose-soft text-navy border border-rose/25 hover:bg-blush',
  outline: 'bg-transparent text-navy border border-navy/12 hover:bg-white hover:border-navy/20',
  ghost: 'bg-transparent text-navy hover:bg-blush/80',
  glass: 'material-ultra-thin text-navy border border-white/40 shadow-sm hover:bg-white/70',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-[12px] gap-1.5',
  md: 'h-11 px-5 text-[15px] rounded-[14px] gap-2',
  lg: 'h-[52px] px-7 text-base rounded-[16px] gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  to,
  href,
  className = '',
  type = 'button',
  target,
  rel,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-medium select-none cursor-pointer pressable ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    )
  }

  if (href) {
    const safe = safeHref(href) || (href.startsWith('/') && !href.startsWith('//') ? href : undefined)
    if (!safe) return null
    const external = /^https?:/i.test(safe) || Boolean(target)
    return (
      <a
        href={safe}
        className={classes}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noreferrer' : undefined)}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
