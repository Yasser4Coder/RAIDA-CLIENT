import { ChevronLeft } from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../ui/Button'
import { springs, useMotionSafe } from '../../lib/motion'

const HERO_IMG = '/images/hero/raida-hero.png'

export default function Hero() {
  const { reduce, fadeUp, transition } = useMotionSafe()
  const step = (i: number) => ({ ...transition, delay: reduce ? 0 : i * 0.07 })

  return (
    <section className="relative isolate flex min-h-[90svh] items-end overflow-hidden bg-ivory sm:min-h-[88svh] sm:items-center">
      {/* Dominant edge-to-edge visual plane */}
      <motion.div
        className="absolute inset-0 -z-20"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduce ? { duration: 0.3 } : { ...springs.settle, duration: 1.2 }}
      >
        <img
          src={HERO_IMG}
          alt="رائدات أعمال في لقاء مهني على منصة رائدة"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[28%_40%]"
        />
      </motion.div>

      {/* Brand light plane — keeps Arabic copy readable over the media */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/85 to-ivory/40 sm:bg-gradient-to-l sm:from-ivory sm:via-ivory/88 sm:to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ivory/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory to-transparent" />
        <div className="hero-mesh absolute inset-0 opacity-60" />
        <div
          className={`absolute top-0 left-1/2 h-[480px] w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-rose/25 via-gold/12 to-mauve/18 blur-3xl ${
            reduce ? '' : 'hero-mesh-pulse'
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-32 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8 lg:pt-40 lg:pb-32">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Brand — hero-level signal */}
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={step(0)}>
            <p className="font-display text-3xl font-extrabold tracking-[-0.02em] text-navy sm:text-4xl">
              رائدة
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="h-0.5 w-10 rounded-full bg-gradient-to-l from-gold via-rose to-transparent" aria-hidden />
              <span className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-gold-dark sm:text-xs">
                RAIDA
              </span>
            </div>
          </motion.div>

          {/* One headline */}
          <motion.h1
            className="mt-7 text-[2rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-navy sm:text-5xl lg:text-[3.5rem]"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={step(1)}
          >
            حيث تلتقي الطموحات{' '}
            <span className="text-gold-dark">بالخبرات والفرص</span>
          </motion.h1>

          {/* One supporting sentence */}
          <motion.p
            className="mt-5 max-w-lg text-[17px] leading-relaxed text-navy/75 sm:text-xl"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={step(2)}
          >
            مجتمع مهني يجمع رائدات الأعمال والخبراء والعلامات لبناء فرص حقيقية للنمو والتعاون.
          </motion.p>

          {/* One CTA group */}
          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={step(3)}
          >
            <Button
              to="/membership"
              variant="gold"
              size="lg"
              className="w-full shadow-lg shadow-gold/25 transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy sm:w-auto"
            >
              انضمي إلى رائدة
              <ChevronLeft className="h-5 w-5 opacity-70" />
            </Button>
            <Button
              to="/community"
              variant="outline"
              size="lg"
              className="w-full border-navy/15 bg-white/60 text-navy backdrop-blur-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy sm:w-auto"
            >
              اكتشفي المجتمع
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
