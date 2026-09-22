import { Link } from 'react-router-dom'
import { Check, ChevronLeft, Play } from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../ui/Button'
import { springs, useMotionSafe } from '../../lib/motion'
import { useAsyncData } from '../../hooks/useAsyncData'
import { catalogApi } from '../../lib/catalog'

const HERO_IMG =
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1400&h=900&fit=crop&q=80'

const avatars = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=96&h=96&fit=crop',
]

const trust = [
  'انضمام مجاني للبداية',
  'مجتمع نسائي موثوق',
  'فرص شراكة حقيقية',
]

export default function Hero() {
  const { reduce, fadeUp, transition } = useMotionSafe()
  const { data: eventsPayload } = useAsyncData(() => catalogApi.events({ limit: 1 }), [])
  const { data: stats } = useAsyncData(() => catalogApi.stats(), [])
  const featuredEvent = eventsPayload?.data[0]
  const communityStat = stats?.find((s) => /عضو|رائد|عضوة/.test(s.label)) ?? stats?.[0]

  return (
    <section className="relative isolate overflow-hidden bg-ivory">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-rose-soft via-ivory to-cream/80" />
        <div className="hero-mesh absolute inset-0 opacity-90" />
        <div
          className={`absolute top-0 right-0 w-[min(85vw,640px)] h-[480px] rounded-full bg-gradient-to-bl from-gold/25 via-rose/20 to-transparent blur-3xl ${
            reduce ? '' : 'hero-mesh-pulse'
          }`}
        />
        <div className="absolute inset-0 opacity-[0.28] hero-dot-grid" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 xl:gap-16 items-center">
          {/* Copy */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...transition, delay: 0 }}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-3 mb-6"
            >
              <div className="inline-flex items-center gap-2.5 mx-auto lg:mx-0">
                <span className="font-display text-[11px] font-bold tracking-[0.22em] text-navy/40 uppercase">
                  RAIDA
                </span>
                <span className="h-4 w-px bg-navy/15" aria-hidden />
                <span className="text-rose font-display text-lg font-extrabold tracking-[-0.02em]">
                  رائدة
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 mx-auto lg:mx-0 rounded-full bg-white/75 px-3 py-1 text-[11px] font-semibold text-navy/70 ring-1 ring-navy/8">
                من ابتكار{' '}
                <span className="text-gold-dark font-bold">SOS Group</span>
              </span>
            </motion.div>

            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...transition, delay: reduce ? 0 : 0.04 }}
              className="mb-6"
            >
              <Link
                to={featuredEvent ? `/events/${featuredEvent.id}` : '/events'}
                className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1.5 text-[13px] font-medium text-navy ring-1 ring-inset ring-rose/25 hover:bg-blush/80 transition-colors pressable-soft shadow-xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose animate-pulse" />
                {featuredEvent?.title || 'فعاليات المجتمع'}
                <ChevronLeft className="w-3.5 h-3.5 text-muted" />
              </Link>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl xl:text-[3.35rem] font-extrabold tracking-[-0.03em] text-navy leading-[1.1]"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...transition, delay: reduce ? 0 : 0.08 }}
            >
              حيث تلتقي الطموحات{' '}
              <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
                بالخبرات والفرص
              </span>
            </motion.h1>

            <motion.p
              className="mt-5 text-[17px] sm:text-lg text-muted max-w-xl mx-auto lg:mx-0 lg:mr-0 leading-relaxed"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...transition, delay: reduce ? 0 : 0.12 }}
            >
              منصة ومجتمع مهني يجمع رائدات الأعمال والخبيرات والعلامات — فرص، برامج، واستشارات في
              مكان واحد.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center lg:items-stretch lg:justify-end gap-3"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...transition, delay: reduce ? 0 : 0.16 }}
            >
              <Button
                to="/membership"
                variant="gold"
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-gold/25 hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                انضمي إلى RAIDA
                <ChevronLeft className="w-5 h-5 opacity-70" />
              </Button>
              <Button
                to="/community"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/60"
              >
                <Play className="w-4 h-4 fill-current opacity-60" />
                اكتشفي المنصة
              </Button>
            </motion.div>

            <motion.div
              className="mt-7 flex flex-wrap items-center justify-center lg:justify-end gap-x-5 gap-y-2 text-[13px] text-muted"
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

            <motion.div
              className="mt-6 inline-flex items-center gap-3 mx-auto lg:mx-0 lg:mr-0 rounded-2xl bg-white/70 hairline px-4 py-2.5 shadow-xs"
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
                    className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-muted text-right">
                <span className="font-bold text-navy tabular-nums">
                  {communityStat
                    ? `+${communityStat.value.toLocaleString('ar-DZ')}${communityStat.suffix || ''}`
                    : 'مجتمع'}
                </span>{' '}
                {communityStat?.label || 'في رائدة'}
              </p>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            className="order-1 lg:order-2 relative max-w-xl mx-auto lg:max-w-none w-full"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={springs.settle}
          >
            <div
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-rose/30 via-gold/15 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative rounded-[1.35rem] sm:rounded-[1.65rem] overflow-hidden border border-navy/10 shadow-2xl shadow-navy/15 bg-white ring-1 ring-white/80">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-separator bg-cream/90">
                <span className="w-2.5 h-2.5 rounded-full bg-rose/55" />
                <span className="w-2.5 h-2.5 rounded-full bg-gold/55" />
                <span className="w-2.5 h-2.5 rounded-full bg-navy/12" />
                <span className="mr-2 flex-1 h-6 rounded-lg bg-white border border-separator text-[10px] text-muted flex items-center justify-center tracking-wide font-medium">
                  raaida.net
                </span>
              </div>
              <div className="relative aspect-[4/3] sm:aspect-[5/4] bg-navy">
                <img
                  src={HERO_IMG}
                  alt="مجتمع رائدات الأعمال في منصة RAIDA"
                  width={1400}
                  height={900}
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-navy/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-lg ring-1 ring-navy/5 flex items-center gap-4">
                    <div className="flex -space-x-2 space-x-reverse shrink-0">
                      {avatars.slice(0, 3).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="w-9 h-9 rounded-xl ring-2 ring-white object-cover"
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-sm font-bold text-navy truncate">شبكة مهنية منتقاة</p>
                      <p className="text-[11px] text-muted mt-0.5">أعضاء · فرص · فعاليات</p>
                    </div>
                    <Link
                      to="/members"
                      className="shrink-0 h-9 px-4 rounded-xl bg-navy text-white text-[12px] font-semibold pressable hover:bg-navy-light transition-colors inline-flex items-center"
                    >
                      استكشفي
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
