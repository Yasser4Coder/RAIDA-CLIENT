import { Link } from 'react-router-dom'
import type { ElementType } from 'react'
import {
  Users,
  ChevronLeft,
  GraduationCap,
  Building2,
  Store,
  BookOpen,
  Briefcase,
  Rocket,
  Lightbulb,
  Handshake,
  Calendar,
  Sparkles,
  Megaphone,
  Palette,
  Code,
  Calculator,
  Scale,
  TrendingUp,
  Check,
} from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import SafeImg from '../components/ui/SafeImg'
import SeoHead from '../components/seo/SeoHead'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { freeCommunityBenefits, joinSteps } from '../data/platformContent'
import { springs, useMotionSafe } from '../lib/motion'
import { RaidaMark } from '../components/ui/Logo'

const heroImage =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=900&fit=crop'

const iconMap: Record<string, ElementType> = {
  rocket: Rocket,
  graduation: GraduationCap,
  lightbulb: Lightbulb,
  handshake: Handshake,
  calendar: Calendar,
  sparkles: Sparkles,
  megaphone: Megaphone,
  briefcase: Briefcase,
  palette: Palette,
  code: Code,
  calculator: Calculator,
  scale: Scale,
  trending: TrendingUp,
  users: Users,
}

const hubs: {
  to: string
  label: string
  desc: string
  icon: ElementType
}[] = [
  { to: '/members', label: 'دليل الأعضاء', desc: 'رائدات أعمال ومشاريع', icon: Users },
  { to: '/experts', label: 'خبيرات رائدة', desc: 'مدربات ومستشارات', icon: GraduationCap },
  { to: '/academies', label: 'الأكاديميات', desc: 'مراكز تدريب وبرامج', icon: Building2 },
  { to: '/brands', label: 'العلامات', desc: 'منتجات وخدمات', icon: Store },
  { to: '/programs', label: 'البرامج', desc: 'دورات وورشات', icon: BookOpen },
  { to: '/opportunities', label: 'الفرص', desc: 'معارض وتمويل وشراكات', icon: Briefcase },
]

export default function CommunityPage() {
  const { reduce, fadeUp } = useMotionSafe()

  const {
    data: communityCards,
    loading: cardsLoading,
    error: cardsError,
    reload: reloadCards,
  } = useAsyncData(() => catalogApi.communityCards(), [])

  const { data: stats } = useAsyncData(() => catalogApi.stats(), [])

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.community.title}
        description={routeSeo.community.description}
        path={routeSeo.community.path}
        keywords={[...routeSeo.community.keywords]}
        image={heroImage}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'المجتمع', path: '/community' },
        ])}
      />

      {/* Full-bleed hero */}
      <section className="relative isolate min-h-[min(88vh,720px)] flex flex-col overflow-hidden">
        <SafeImg
          src={heroImage}
          fallback={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/35" />
        <div className="absolute inset-0 bg-gradient-to-l from-gold/20 via-transparent to-rose/15 mix-blend-soft-light" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ivory to-transparent" />

        <div className="relative z-10 flex-1 flex flex-col justify-end pt-28 pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={springs.settle}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2.5 mb-5">
                <span className="w-10 h-10 rounded-[12px] bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
                  <RaidaMark className="w-7 h-7" />
                </span>
                <span className="text-[12px] font-semibold tracking-[0.18em] text-gold uppercase">
                  مجتمع رائدة
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white tracking-[-0.03em] leading-[1.12]">
                انضمي إلى مجتمع يفتح لكِ الطريق
              </h1>
              <p className="mt-4 text-[16px] sm:text-lg text-white/75 leading-relaxed max-w-xl">
                حساب مجاني للجميع — تابعي المحتوى والفرص، وتعرّفي على الخبيرات والعلامات والأكاديميات.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/dashboard" variant="gold" size="lg">
                  انضمي مجانًا
                  <ChevronLeft className="w-4 h-4 opacity-80" />
                </Button>
                <Button
                  to="/membership"
                  variant="glass"
                  size="lg"
                  className="!bg-white/10 !text-white !border-white/25 hover:!bg-white/18"
                >
                  العضويات المهنية
                </Button>
              </div>
            </motion.div>

            {stats && stats.length > 0 && (
              <motion.div
                className="mt-12 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.settle, delay: 0.12 }}
              >
                {stats.slice(0, 4).map((stat) => (
                  <div key={stat.id} className="rounded-[14px] bg-white/8 ring-1 ring-white/15 px-3.5 py-3 backdrop-blur-sm">
                    <p className="text-xl sm:text-2xl font-extrabold text-gold tabular-nums tracking-tight">
                      {stat.value.toLocaleString('ar-DZ')}
                      {stat.suffix}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/55 font-medium">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-20 sm:space-y-28">
        {/* Free benefits — one job */}
        <Reveal>
          <section className="pt-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
              مجانًا بالكامل
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] max-w-xl leading-tight">
              ماذا تستفيدين بحساب مجاني؟
            </h2>
            <p className="mt-3 text-muted max-w-lg leading-relaxed">
              ابدئي دون اشتراك. العضويات المهنية تبقى اختيارية لاحقًا.
            </p>

            <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              {freeCommunityBenefits.map((item, i) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="mt-0.5 w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-muted tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[15px] font-semibold text-navy leading-snug mt-0.5">{item}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Live community pillars */}
        <section>
          <Reveal>
            <div className="mb-8 max-w-xl">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                أعمدة المجتمع
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
                شبكة واحدة للحياة المهنية
              </h2>
            </div>
          </Reveal>

          {cardsLoading && <LoadingBlock />}
          {cardsError && <ErrorBlock message={cardsError} onRetry={reloadCards} />}
          {communityCards && communityCards.length > 0 && (
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {communityCards.map((card) => {
                const Icon = iconMap[card.icon] || Sparkles
                return (
                  <StaggerItem key={card.id}>
                    <article className="h-full rounded-[20px] bg-white hairline shadow-xs p-6 hover:shadow-sm transition-shadow">
                      <div className="w-11 h-11 rounded-[13px] bg-navy/[0.04] ring-1 ring-navy/8 flex items-center justify-center">
                        <Icon className="w-[18px] h-[18px] text-navy" />
                      </div>
                      <h3 className="mt-4 text-[17px] font-bold text-navy tracking-[-0.01em]">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted leading-relaxed">{card.description}</p>
                    </article>
                  </StaggerItem>
                )
              })}
            </Stagger>
          )}
        </section>

        {/* Destination hubs — interactive */}
        <section>
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                  استكشفي
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
                  بوابات المجتمع
                </h2>
              </div>
              <p className="text-sm text-muted max-w-xs sm:text-left">
                اختاري الوجهة التي تناسب مرحلتكِ الآن.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {hubs.map((hub) => {
              const Icon = hub.icon
              return (
                <StaggerItem key={hub.to}>
                  <Link
                    to={hub.to}
                    className="group relative flex h-full items-start gap-4 rounded-[18px] bg-white hairline p-5 shadow-xs pressable hover:bg-blush/30 transition-colors"
                  >
                    <span className="w-12 h-12 rounded-[14px] bg-navy text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="font-bold text-navy tracking-[-0.01em]">{hub.label}</p>
                      <p className="mt-1 text-[13px] text-muted leading-snug">{hub.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-gold-dark opacity-80 group-hover:opacity-100 transition-opacity">
                        ادخلي
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        </section>

        {/* Join steps — timeline */}
        <Reveal>
          <section>
            <div className="max-w-xl mb-10">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                للعضويات المهنية
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
                كيف تنضمين؟
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                طلب الانضمام → دراسة الطلب → جلسة عمل Online → تفعيل العضوية
              </p>
            </div>

            <ol className="relative space-y-0 border-r border-navy/10 mr-4 sm:mr-5">
              {joinSteps.map((step, i) => (
                <li key={step.step} className="relative pr-8 sm:pr-10 pb-10 last:pb-0">
                  <span
                    className={`absolute right-[-9px] sm:right-[-11px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-4 ring-ivory flex items-center justify-center ${
                      i === 0 ? 'bg-gold' : 'bg-navy'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.14em] text-gold-dark">
                    {step.step}
                  </span>
                  <h3 className="mt-1.5 text-xl font-extrabold text-navy tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] text-muted leading-relaxed max-w-2xl">{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <Button to="/membership" variant="gold" size="md">
                اطلبي عضوية مهنية
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
            </div>
          </section>
        </Reveal>

        {/* Closing CTA */}
        <Reveal>
          <section className="relative overflow-hidden rounded-[28px] bg-navy text-white px-6 py-12 sm:px-12 sm:py-14 ring-1 ring-gold/20">
            <div
              className="pointer-events-none absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-gold/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 right-0 w-64 h-64 rounded-full bg-rose/20 blur-3xl"
              aria-hidden
            />
            <div className="relative max-w-xl">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-gold/80 uppercase">
                جاهزة للبدء؟
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] leading-tight">
                مكانكِ في رائدة يبدأ بحساب مجاني
              </h2>
              <p className="mt-3 text-white/65 leading-relaxed">
                انضمي اليوم، واستكشفي الشبكة والفرص بالسرعة التي تناسبكِ.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/dashboard" variant="gold" size="lg">
                  إنشاء حساب
                  <ChevronLeft className="w-4 h-4 opacity-80" />
                </Button>
                <Button to="/about" variant="outline" size="lg" className="!border-white/25 !text-white hover:!bg-white/10">
                  تعرّفي على رائدة
                </Button>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}
