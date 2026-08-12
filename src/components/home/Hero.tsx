import { Link } from 'react-router-dom'
import { Check, ChevronLeft, Play } from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../ui/Button'
import { springs, useMotionSafe } from '../../lib/motion'

const HERO_IMG =
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1400&h=900&fit=crop&q=80'

const avatars = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=96&h=96&fit=crop',
]

const trust = [
  'انضمام مجاني للبداية',
  'مجتمع نسائي موثوق',
  'فرص شراكة حقيقية',
]

export default function Hero() {
  const { reduce, fadeUp, transition } = useMotionSafe()

  return (
    <section className="relative isolate overflow-hidden bg-ivory">
      {/* Mesh gradient background — interest without competing */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
        <div className="hero-mesh absolute inset-0" />
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[min(90vw,820px)] h-[520px] rounded-full bg-gradient-to-br from-rose/30 via-gold/15 to-mauve/20 blur-3xl ${
            reduce ? '' : 'hero-mesh-pulse'
          }`}
        />
        {/* Soft dot grid */}
        <div className="absolute inset-0 opacity-[0.35] hero-dot-grid" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-24 text-center">
        {/* Brand — hero-level signal */}
        <motion.div
          className="mb-7"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...transition, delay: 0 }}
        >
          <p className="font-display text-[11px] sm:text-xs font-bold tracking-[0.22em] text-navy/45 uppercase">
            RAIDA
          </p>
          <p className="mt-1 text-rose font-display text-lg sm:text-xl font-extrabold tracking-[-0.02em]">
            رائدة
          </p>
        </motion.div>

        {/* Announcement badge */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...transition, delay: reduce ? 0 : 0.04 }}
        >
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-[13px] font-medium text-navy ring-1 ring-inset ring-rose/25 hover:bg-blush/80 hover:ring-rose/40 transition-colors pressable-soft mb-8 shadow-xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose animate-pulse" />
            ملتقى رائدات الأعمال 2026
            <ChevronLeft className="w-3.5 h-3.5 text-muted" />
          </Link>
        </motion.div>

        {/* Headline — benefit, tight tracking, scale */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy max-w-4xl mx-auto leading-[1.12]"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...transition, delay: reduce ? 0 : 0.08 }}
        >
          حيث تلتقي الطموحات{' '}
          <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
            بالخبرات والفرص
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...transition, delay: reduce ? 0 : 0.12 }}
        >
          منصة ومجتمع مهني يجمع رائدات الأعمال والخبراء والشركات لبناء فرص حقيقية للنمو والتعاون.
        </motion.p>

        {/* CTAs — primary high-contrast, secondary subordinate */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...transition, delay: reduce ? 0 : 0.16 }}
        >
          <Button
            to="/membership"
            variant="gold"
            size="lg"
            className="w-full sm:w-auto shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            انضمي إلى RAIDA
            <ChevronLeft className="w-5 h-5 opacity-70" />
          </Button>
          <Button
            to="/members"
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto text-navy/70 hover:text-navy hover:bg-white/70"
          >
            <Play className="w-4 h-4 fill-current opacity-70" />
            اكتشفي المنصة
          </Button>
        </motion.div>

        {/* Trust signals near CTA */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...transition, delay: reduce ? 0 : 0.2 }}
        >
          {trust.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-gold-dark shrink-0" strokeWidth={2.5} />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-3"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...transition, delay: reduce ? 0 : 0.22 }}
        >
          <div className="flex -space-x-2 space-x-reverse">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full ring-2 ring-ivory object-cover"
              />
            ))}
          </div>
          <p className="text-sm text-muted">
            <span className="font-semibold text-navy">+12,500</span> رائدة في المجتمع
          </p>
        </motion.div>

        {/* Dominant visual — single composition, no overlays on media */}
        <motion.div
          className="mt-14 sm:mt-16 relative max-w-5xl mx-auto"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          transition={springs.settle}
        >
          {/* Glow behind image */}
          <div
            className="absolute -inset-4 sm:-inset-6 -z-10 rounded-[2rem] bg-gradient-to-b from-rose/25 via-gold/10 to-transparent blur-2xl"
            aria-hidden
          />

          <div className="relative rounded-[1.25rem] sm:rounded-[1.75rem] overflow-hidden border border-navy/8 shadow-xl shadow-navy/10 bg-white">
            {/* Browser chrome hint */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-separator bg-cream/80">
              <span className="w-2.5 h-2.5 rounded-full bg-rose/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-navy/15" />
              <span className="mr-3 flex-1 h-6 rounded-md bg-white/80 border border-separator text-[10px] text-muted flex items-center justify-center tracking-wide">
                raida.dz
              </span>
            </div>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-navy">
              <img
                src={HERO_IMG}
                alt="مجتمع رائدات الأعمال في منصة RAIDA"
                width={1400}
                height={900}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Soft vignette for depth — not a floating badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-navy/10" />

              {/* In-frame product strip — part of the composition, bottom edge */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <div className="material-thick rounded-[16px] sm:rounded-[18px] p-3 sm:p-4 shadow-lg hairline flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                  <div className="flex -space-x-2 space-x-reverse shrink-0">
                    {avatars.slice(0, 4).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        width={40}
                        height={40}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] ring-2 ring-white object-cover"
                      />
                    ))}
                  </div>
                  <div className="text-right flex-1 min-w-0">
                    <p className="text-[13px] sm:text-sm font-bold text-navy tracking-[-0.01em] truncate">
                      شبكة مهنية لرائدات الأعمال
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                      أعضاء · علامات · فعاليات · شراكات
                    </p>
                  </div>
                  <Link
                    to="/members"
                    className="shrink-0 inline-flex items-center justify-center h-9 px-4 rounded-[12px] bg-navy text-white text-[12px] font-semibold pressable hover:bg-navy-light transition-colors"
                  >
                    استكشفي
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
