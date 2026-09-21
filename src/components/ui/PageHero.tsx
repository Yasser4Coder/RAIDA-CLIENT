import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { springs, useMotionSafe } from '../../lib/motion'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  description: string
  icon?: ReactNode
  children?: ReactNode
  centered?: boolean
}

export default function PageHero({
  eyebrow,
  title,
  description,
  icon,
  children,
  centered = true,
}: PageHeroProps) {
  const { reduce } = useMotionSafe()

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-10 sm:pb-12">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
        <div className="hero-mesh absolute inset-0 opacity-80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[min(90vw,720px)] h-[420px] rounded-full bg-gradient-to-br from-rose/25 via-gold/10 to-mauve/15 blur-3xl" />
      </div>

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          centered ? 'text-center' : 'text-center sm:text-right'
        }`}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.settle}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-rose/25 shadow-xs mb-4">
            {icon}
            {eyebrow}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.15]">
            {title}
          </h1>
          <p
            className={`mt-3 text-lg text-muted leading-relaxed ${
              centered ? 'max-w-2xl mx-auto' : 'max-w-xl mx-auto sm:mx-0'
            }`}
          >
            {description}
          </p>
          {children}
        </motion.div>
      </div>
    </section>
  )
}
