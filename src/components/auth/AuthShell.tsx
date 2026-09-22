import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Logo from '../ui/Logo'
import { springs, useMotionSafe } from '../../lib/motion'

type AuthShellProps = {
  children: ReactNode
  /** Short line under the brand on the visual panel */
  tagline?: string
}

/**
 * Shared atmosphere for login / register / password flows.
 * Desktop: brand panel + form. Mobile: compact brand header + form.
 */
export default function AuthShell({
  children,
  tagline = 'مجتمع رائدات الأعمال في الجزائر',
}: AuthShellProps) {
  const { reduce } = useMotionSafe()

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-ivory pt-16 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(201,162,106,0.18),transparent_55%),radial-gradient(ellipse_at_90%_20%,rgba(196,92,122,0.12),transparent_50%),linear-gradient(180deg,#F7F3EE_0%,#FBF9F6_45%,#F3ECE6_100%)]" />
        <div className="absolute inset-0 opacity-[0.035] hero-dot-grid" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] bg-white/80 shadow-[0_24px_80px_-32px_rgba(26,32,56,0.35)] ring-1 ring-navy/8 backdrop-blur-sm lg:grid-cols-12">
          {/* Brand panel */}
          <aside className="relative hidden overflow-hidden bg-navy text-white lg:col-span-5 lg:block">
            <div
              className="pointer-events-none absolute -top-24 -left-16 h-[420px] w-[420px] rounded-full bg-gold/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-28 -right-10 h-[360px] w-[360px] rounded-full bg-rose/30 blur-3xl"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] hero-dot-grid" aria-hidden />

            <div className="relative flex h-full min-h-[520px] flex-col justify-between p-8 xl:p-10">
              <Logo variant="light" size="lg" to="/" className="w-fit" />

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.settle}
                className="space-y-4"
              >
                <p className="text-[11px] font-semibold tracking-[0.2em] text-gold uppercase">RAIDA</p>
                <h2 className="font-display text-3xl font-extrabold leading-[1.15] tracking-[-0.03em] xl:text-[2.15rem]">
                  مساحة واحدة واحدة
                  <span className="text-gold">خاصة بكِ</span>
                </h2>
                <p className="max-w-sm text-[15px] leading-relaxed text-white/65">{tagline}</p>
                <ul className="mt-6 space-y-2.5 text-[13px] text-white/55">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    لوحة تحكم لفرصكِ وفعالياتكِ واستشاراتكِ
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    ملف مهني يظهر في دليل العضوات
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    ضمن منظومة ابتكرتها SOS Group
                  </li>
                </ul>
              </motion.div>

              <p className="text-[12px] text-white/40">
                بحاجة لمساعدة؟{' '}
                <Link to="/consultations" className="text-gold/90 underline-offset-2 hover:underline">
                  تواصلي معنا
                </Link>
              </p>
            </div>
          </aside>

          {/* Form panel */}
          <div className="relative lg:col-span-7">
            <div className="border-b border-navy/6 px-5 py-4 sm:px-8 lg:hidden">
              <Logo size="md" to="/" className="w-fit" />
              <p className="mt-2 text-[13px] text-muted">{tagline}</p>
            </div>
            <div className="p-5 sm:p-8 lg:p-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthField({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string
  hint?: string
  children: ReactNode
  htmlFor?: string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="block text-[12px] font-semibold text-navy/70">
          {label}
        </label>
        {hint && <span className="text-[11px] text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export const authInputClass =
  'w-full h-12 px-4 rounded-[14px] border border-navy/10 bg-ivory/80 text-[15px] text-navy placeholder:text-muted/70 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/15 focus:bg-white transition'

export function AuthAlert({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'success' | 'info'
  children: ReactNode
}) {
  const tones = {
    error: 'bg-rose-soft/90 ring-1 ring-rose/25 text-navy',
    success: 'bg-emerald-50 ring-1 ring-emerald-200/80 text-emerald-900',
    info: 'bg-navy/[0.04] ring-1 ring-navy/8 text-navy/80',
  }
  return (
    <div role="alert" className={`rounded-[14px] px-3.5 py-3 text-[13px] leading-relaxed ${tones[tone]}`}>
      {children}
    </div>
  )
}
