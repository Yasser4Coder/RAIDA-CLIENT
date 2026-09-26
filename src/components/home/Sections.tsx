import { Link } from 'react-router-dom'
import type { ElementType } from 'react'
import AnimatedCounter from '../ui/AnimatedCounter'
import SectionHeader from '../ui/SectionHeader'
import EventCard from '../ui/EventCard'
import LandingEventCompact from './LandingEventCompact'
import ExpertsCarousel from './ExpertsCarousel'
import ExpertSpotlightCard from '../ui/ExpertSpotlightCard'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Reveal, { Stagger, StaggerItem } from '../ui/Reveal'
import SafeImg from '../ui/SafeImg'
import { LoadingBlock, ErrorBlock } from '../ui/StateBlocks'
import { useAsyncData } from '../../hooks/useAsyncData'
import { catalogApi } from '../../lib/catalog'
import { planDetailPath } from '../../data/membershipPlanDetails'
import { mergeFeaturedAcademies } from '../../data/featuredAcademies'
import { mergeFeaturedExperts } from '../../data/featuredExperts'
import type { Member } from '../../types/api'
import {
  Rocket, GraduationCap, Lightbulb, Handshake, Calendar, Sparkles,
  Megaphone, Briefcase, Palette, Code, Calculator, Scale, TrendingUp,
  Check, ChevronLeft, Quote, MapPin, School, Users, UserPlus, Building2,
  MessageSquare,
} from 'lucide-react'

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
}

const avatarFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&h=320&fit=crop'
const brandFallback =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy'

/** Directory row: thumb + name + specialty + chevron. `md` adds city line and card chrome. */
function ProfileRow({ member, size = 'sm' }: { member: Member; size?: 'sm' | 'md' }) {
  const soon = member.id.startsWith('wireframe-')
  const shell =
    size === 'md'
      ? 'flex h-full min-h-[5.5rem] w-full items-center gap-4 rounded-[20px] bg-white p-4 hairline shadow-xs sm:p-5'
      : 'flex h-full min-h-[4.5rem] w-full items-center gap-3.5 px-4 py-3.5'

  const body = (
    <>
      <SafeImg
        src={member.image}
        fallback={avatarFallback}
        alt=""
        loading="lazy"
        className={`shrink-0 bg-navy/5 object-cover ring-1 ring-navy/5 ${
          size === 'md' ? 'h-16 w-16 rounded-[18px]' : 'h-12 w-12 rounded-[14px]'
        }`}
      />
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-bold tracking-[-0.01em] text-navy ${
            size === 'md' ? 'text-[16px]' : 'text-[15px]'
          }`}
        >
          {member.name}
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] leading-snug text-muted">
          {member.specialty}
        </span>
        {size === 'md' && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rose" aria-hidden />
            {member.city}
          </span>
        )}
      </span>
      {soon ? (
        <span className="shrink-0 text-[11.5px] font-semibold text-muted">الملف قريبًا</span>
      ) : (
        <ChevronLeft
          className="h-4 w-4 shrink-0 text-navy/25 transition-colors group-hover:text-navy/70"
          aria-hidden
        />
      )}
    </>
  )

  if (soon) {
    return (
      <div className={`group ${shell}`} role="group">
        {body}
      </div>
    )
  }

  return (
    <Link
      to={`/members/${member.id}`}
      className={`group pressable-soft hover:bg-blush/40 ${
        size === 'md' ? 'transition-all hover:shadow-sm' : 'transition-colors'
      } ${shell} ${focusRing}`}
    >
      {body}
    </Link>
  )
}

export function StatsSection() {
  const { data: stats, loading, error, reload } = useAsyncData(() => catalogApi.stats(), [])

  const meta: Record<string, { icon: typeof Users; hint: string; accent: string }> = {
    visitors: {
      icon: Users,
      hint: 'زائرات فريدات للمنصة',
      accent: 'text-rose bg-rose-soft',
    },
    registrations: {
      icon: UserPlus,
      hint: 'حسابات نشطة على رائدة',
      accent: 'text-gold-dark bg-gold/15',
    },
    brands: {
      icon: Building2,
      hint: 'علامات منشورة في الدليل',
      accent: 'text-navy bg-mauve/15',
    },
    academies: {
      icon: School,
      hint: 'مراكز تدريب معتمدة',
      accent: 'text-navy bg-navy/[0.06]',
    },
  }

  return (
    <section
      className="relative z-10 w-full border-y border-separator bg-white"
      aria-label="إحصائيات رائدة الحية"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/80 via-white to-white" aria-hidden />

      <div className="relative w-full">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pt-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pt-10 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-dark">
              أرقام حية من المنصة
            </p>
            <p className="mt-1 max-w-md text-[14px] leading-relaxed text-muted sm:text-[15px]">
              زوار، عضوات، علامات وأكاديميات — تُحدَّث مباشرة من قاعدة البيانات.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ivory px-3 py-1.5 text-[11px] font-semibold text-navy ring-1 ring-navy/8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose/50 opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose" />
            </span>
            مباشر الآن
          </span>
        </div>

        {loading && (
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <LoadingBlock />
          </div>
        )}
        {error && (
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <ErrorBlock message={error} onRetry={reload} />
          </div>
        )}

        {stats && stats.length > 0 && (
          <Stagger className="mt-6 grid w-full grid-cols-2 border-t border-separator lg:mt-8 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const config = (stat.key && meta[stat.key]) || {
                icon: Sparkles,
                hint: 'إحصائية المنصة',
                accent: 'text-navy bg-ivory',
              }
              const Icon = config.icon
              return (
                <StaggerItem
                  key={stat.id}
                  className={`group relative min-h-[9.5rem] px-5 py-8 sm:min-h-[10.5rem] sm:px-8 sm:py-10 ${
                    i % 2 === 1 ? 'border-s border-separator' : ''
                  } ${i >= 2 ? 'border-t border-separator lg:border-t-0' : ''} ${
                    i > 0 ? 'lg:border-s lg:border-separator' : ''
                  }`}
                >
                  <div className="flex h-full flex-col items-start text-start">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-[14px] transition-transform group-hover:scale-105 ${config.accent}`}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <p className="mt-5 font-display text-[2.15rem] font-extrabold leading-none tracking-[-0.03em] text-navy tabular-nums sm:text-[2.75rem]">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix || ''} />
                    </p>
                    <p className="mt-3 text-[14px] font-bold text-navy sm:text-[15px]">{stat.label}</p>
                    <p className="mt-1 text-[12px] leading-snug text-muted">{config.hint}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
      </div>
    </section>
  )
}

export function CommunitySection() {
  const { data: communityCards, loading, error, reload } = useAsyncData(
    () => catalogApi.communityCards(),
    [],
  )

  return (
    <section className="relative overflow-hidden bg-ivory py-16 lg:py-24" aria-labelledby="community-heading">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] hero-dot-grid" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Photo story panel */}
          <Reveal className="lg:col-span-5">
            <figure className="relative h-full min-h-[22rem] overflow-hidden rounded-[28px] shadow-md sm:min-h-[26rem] lg:min-h-full">
              <img
                src="/images/home/raida-community.png"
                alt="رائدات أعمال يتحاورن في مجتمع رائدة"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/10" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  اكتشفي المجتمع
                </p>
                <h2
                  id="community-heading"
                  className="mt-2 font-display text-2xl font-extrabold leading-snug tracking-[-0.02em] text-white sm:text-3xl"
                >
                  مجتمع رائدة
                </h2>
                <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/75 sm:text-[15px]">
                  ريادة، تدريب، استشارات، شراكات، فعاليات وعلامات — كل ما تحتاجينه للنمو في مكان واحد.
                </p>
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Button
                    to="/community"
                    variant="gold"
                    size="md"
                    className={`w-full sm:w-auto ${focusRing}`}
                  >
                    تصفّحي المجتمع
                    <ChevronLeft className="h-4 w-4 opacity-70" />
                  </Button>
                  <Button
                    to="/membership"
                    variant="glass"
                    size="md"
                    className={`w-full !border-white/25 !bg-white/10 !text-white hover:!bg-white/18 sm:w-auto ${focusRing}`}
                  >
                    انضمي الآن
                  </Button>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          {/* Paths */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            <Reveal>
              <div className="rounded-[24px] bg-white p-5 shadow-xs hairline sm:p-6">
                <p className="text-[13px] font-semibold text-navy">مسارات المجتمع</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  اختاري ما يناسب مرحلتك — ثم انضمي لفتح كل المسارات.
                </p>
              </div>
            </Reveal>

            {loading && <LoadingBlock />}
            {error && <ErrorBlock message={error} onRetry={reload} />}

            {communityCards && (
              <Stagger className="grid flex-1 gap-3 sm:grid-cols-2">
                {communityCards.map((card) => {
                  const Icon = iconMap[card.icon] || Sparkles
                  return (
                    <StaggerItem key={card.id} className="h-full">
                      <div className="group flex h-full min-h-[5.5rem] gap-3.5 rounded-[20px] bg-white p-4 shadow-xs hairline transition-all pressable-soft hover:-translate-y-0.5 hover:bg-blush/40 hover:shadow-sm sm:p-5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-navy text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-bold tracking-[-0.01em] text-navy">
                            {card.title}
                          </span>
                          <span className="mt-1 block text-[13px] leading-snug text-muted line-clamp-2">
                            {card.description}
                          </span>
                        </span>
                      </div>
                    </StaggerItem>
                  )
                })}
              </Stagger>
            )}

            <Reveal delay={1}>
              <div className="flex flex-col gap-3 rounded-[22px] bg-navy px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
                <p className="text-[14px] leading-relaxed text-white/80 sm:text-[15px]">
                  جاهزة للانضمام؟ العضوية تفتح لكِ كل هذه المسارات.
                </p>
                <Button
                  to="/membership"
                  variant="gold"
                  size="md"
                  className={`w-full shrink-0 sm:w-auto ${focusRing}`}
                >
                  انضمي إلى رائدة
                  <ChevronLeft className="h-4 w-4 opacity-70" />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function MemberSpotlight({ member }: { member: Member }) {
  const soon = member.id.startsWith('wireframe-')

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-md hairline">
      <div className="relative h-40 overflow-hidden sm:h-52">
        <SafeImg
          src={member.cover || member.image}
          fallback={avatarFallback}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/15 to-navy/25" />
        <span className="absolute top-4 left-4 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-semibold text-gold ring-1 ring-gold/30">
          عضوة مميزة
        </span>
      </div>

      <div className="relative -mt-12 flex flex-1 flex-col px-6 pb-6 sm:px-8 sm:pb-8">
        <SafeImg
          src={member.image}
          fallback={avatarFallback}
          alt={member.name}
          width={112}
          height={112}
          className="h-24 w-24 rounded-[24px] bg-navy object-cover shadow-md ring-4 ring-white sm:h-28 sm:w-28"
        />
        <h3 className="mt-4 text-[22px] font-extrabold leading-snug tracking-[-0.02em] text-navy sm:text-[26px]">
          {member.name}
        </h3>
        <p className="mt-1 text-[14px] text-muted">{member.title}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="rounded-full bg-rose-soft px-3 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-rose/25">
            {member.specialty}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted">
            <MapPin className="h-3.5 w-3.5 text-rose" aria-hidden />
            {member.city}
          </span>
        </div>

        {member.bio && (
          <p className="mt-4 line-clamp-3 text-[14.5px] leading-relaxed text-muted">{member.bio}</p>
        )}

        <div className="mt-auto pt-6">
          {soon ? (
            <span className="text-[13px] font-semibold text-muted">الملف قريبًا</span>
          ) : (
            <Button to={`/members/${member.id}`} variant="primary" size="md" className={focusRing}>
              الملف الشخصي
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export function FeaturedMembers() {
  const { data, loading, error, reload } = useAsyncData(
    async () => (await catalogApi.members({ limit: 4 })).data,
    [],
  )
  const spotlight = data?.[0]
  const rest = data?.slice(1) ?? []

  return (
    <section className="py-16 lg:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="الأعضاء المميزات"
            title="تعرّفي على رائدات المجتمع"
            description="ملفات احترافية لعضوات الأعمال والخبيرات والأكاديميات من مختلف التخصصات."
            linkTo="/members"
            linkLabel="عرض كل الأعضاء"
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {spotlight && (
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
            <Reveal className={rest.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
              <MemberSpotlight member={spotlight} />
            </Reveal>

            {rest.length > 0 && (
              <div className="lg:col-span-5">
                <Stagger className="flex h-full flex-col divide-y divide-separator overflow-hidden rounded-[24px] bg-white hairline shadow-xs">
                  {rest.map((m) => (
                    <StaggerItem key={m.id} className="flex-1">
                      <ProfileRow member={m} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export function FeaturedBrands() {
  const { data, loading, error, reload } = useAsyncData(
    async () => (await catalogApi.brands({ limit: 4 })).data,
    [],
  )

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="العلامات التجارية"
            title="علامات تستحق الاكتشاف"
            description="عرض أنيق للعلامات النسائية الرائدة في السوق العربي."
            linkTo="/brands"
            linkLabel="كل العلامات"
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {data && (
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {data.map((b) => (
              <StaggerItem key={b.id} className="h-full">
                <Link
                  to={`/brands/${b.id}`}
                  className={`group flex h-full min-h-[11rem] flex-col items-center justify-center gap-3 rounded-[22px] bg-white p-5 hairline shadow-xs transition-all pressable-soft hover:-translate-y-0.5 hover:shadow-md ${focusRing}`}
                >
                  <SafeImg
                    src={b.logo || b.cover}
                    fallback={brandFallback}
                    alt=""
                    loading="lazy"
                    width={72}
                    height={72}
                    className="h-[68px] w-[68px] rounded-[20px] bg-navy/5 object-cover ring-1 ring-navy/5 transition-transform duration-500 ease-[var(--ease-out-apple)] group-hover:scale-[1.04]"
                  />
                  <span className="line-clamp-2 text-center text-[14.5px] font-bold tracking-[-0.01em] text-navy">
                    {b.name}
                  </span>
                  <span className="line-clamp-1 text-center text-[11.5px] text-muted">
                    {b.category}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}

export function FeaturedExperts() {
  const { data, loading, error, reload } = useAsyncData(async () => {
    const result = await catalogApi.members({ limit: 24, plan: 'EXPERT' })
    const live = result.data.filter((m) => !m.id.startsWith('wireframe-'))
    if (live.length > 0) return live
    return mergeFeaturedExperts(result.data).slice(0, 8)
  }, [])

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-[#0B1428]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 100% 0%, rgba(201,162,77,0.22), transparent 55%), radial-gradient(ellipse 45% 55% at 0% 100%, rgba(232,180,184,0.14), transparent 50%)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8 lg:mb-10">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold text-gold ring-1 ring-gold/25">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                عضوية رائدة للمدربين والخبراء
              </span>
              <h2 className="mt-4 display-sm text-white">
                مدربات وخبيرات جاهزات لاستشاراتكِ
              </h2>
              <p className="mt-3 body-lg text-white/60">
                مرّري البطاقات لاكتشاف المزيد، أو ادخلي الدليل الكامل للبحث حسب التخصص.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button to="/experts" variant="gold" size="md">
                عرض كل الخبراء
                <ChevronLeft className="h-4 w-4 opacity-70" aria-hidden />
              </Button>
              <Link
                to="/consultations"
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-white/75 ring-1 ring-white/15 transition-colors pressable-soft hover:bg-white/8 hover:text-white ${focusRing}`}
              >
                <MessageSquare className="h-4 w-4 text-rose-light" aria-hidden />
                اطلبي استشارة
              </Link>
            </div>
          </div>
        </Reveal>

        {loading && <LoadingBlock label="جاري التحميل..." />}
        {error && <ErrorBlock message={error} onRetry={reload} />}

        {data && data.length > 0 && (
          <ExpertsCarousel
            label="خبيرات رائدة"
            footer={
              <div className="rounded-[20px] bg-white/[0.05] px-5 py-5 sm:px-7 sm:py-6 ring-1 ring-inset ring-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-[13px] font-bold text-white">دليل الخبراء الكامل</p>
                  <p className="mt-1 text-[12.5px] text-white/55 leading-relaxed max-w-md">
                    بحث، فلترة حسب التخصص، وطلب استشارة مباشرة من الملف — صفحة مخصّصة لعضوية المدربين والخبراء.
                  </p>
                </div>
                <Button to="/experts" variant="gold" size="md" className="shrink-0">
                  تصفّحي المزيد
                  <ChevronLeft className="h-4 w-4 opacity-70" aria-hidden />
                </Button>
              </div>
            }
          >
            {data.map((m) => (
              <ExpertSpotlightCard key={m.id} member={m} tone="dark" />
            ))}
          </ExpertsCarousel>
        )}

        {data && data.length === 0 && (
          <div className="rounded-[22px] bg-white/[0.05] p-10 text-center ring-1 ring-inset ring-white/10">
            <GraduationCap className="mx-auto mb-3 h-10 w-10 text-gold" aria-hidden />
            <p className="font-bold text-white">لا توجد خبيرات منشورات حاليًا</p>
            <p className="mt-2 text-sm text-white/55">
              انضمي بعضوية الخبراء أو تابعي الدليل لمعرفة القادمات.
            </p>
            <Button to="/experts" variant="gold" size="md" className="mt-5">
              صفحة الخبراء
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export function FeaturedAcademies() {
  const { data, loading, error, reload } = useAsyncData(async () => {
    const result = await catalogApi.members({ limit: 4, plan: 'ACADEMY' })
    return mergeFeaturedAcademies(result.data).slice(0, 4)
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gold-dark">
                أكاديميات ومراكز تدريب
              </span>
              <span
                className="mt-2.5 block h-0.5 w-8 rounded-full bg-gradient-to-l from-gold via-rose to-transparent"
                aria-hidden
              />
              <h2 className="mt-4 display-sm text-navy">
                أكاديميات ومراكز تدريب تستحق الاكتشاف
              </h2>
              <p className="mt-3 body-lg text-muted">
                مؤسسات تدريب وكوتشينق وبرامج مهنية داخل مجتمع رائدة.
              </p>
              <Link
                to="/academies"
                className={`mt-6 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-navy/70 transition-colors pressable-soft hover:text-navy ${focusRing}`}
              >
                كل الأكاديميات
                <ChevronLeft className="h-4 w-4 opacity-60" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <div className="lg:col-span-8">
            {loading && <LoadingBlock />}
            {error && <ErrorBlock message={error} onRetry={reload} />}
            {data && data.length > 0 && (
              <Stagger className="flex flex-col gap-3">
                {data.map((m) => (
                  <StaggerItem key={m.id}>
                    <ProfileRow member={m} size="md" />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
            {data && data.length === 0 && (
              <div className="rounded-[22px] bg-ivory/80 p-10 text-center hairline">
                <School className="mx-auto mb-3 h-10 w-10 text-gold" aria-hidden />
                <p className="font-bold text-navy">لا توجد أكاديميات منشورة حاليًا</p>
                <p className="mt-2 text-sm text-muted">
                  تابعي الصفحة أو انضمي للمجتمع لمعرفة الأكاديميات القادمة.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ServicesSection() {
  const { data: serviceCategories, loading, error, reload } = useAsyncData(
    () => catalogApi.serviceCategories(),
    [],
  )

  return (
    <section className="py-16 lg:py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(228,160,176,0.12),transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gold">
                اطلبي خدمة
              </span>
              <span
                className="mt-2.5 block h-0.5 w-8 rounded-full bg-gradient-to-l from-gold-light via-rose to-transparent"
                aria-hidden
              />
              <h2 className="mt-4 display-sm text-white">خدمات لمشروعكِ</h2>
              <p className="mt-3 body-lg text-white/60">
                اختر التصنيف وقدّم طلبًا — يصل إلى الخبراء المناسبين عبر رائدة.
              </p>
              <div className="mt-8">
                <Button
                  to="/services"
                  variant="gold"
                  size="md"
                  className="w-full sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  اطلبي خدمة الآن
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            {loading && <LoadingBlock label="جاري التحميل..." />}
            {error && <ErrorBlock message={error} onRetry={reload} />}
            {serviceCategories && (
              <Stagger className="grid gap-2.5 sm:grid-cols-2">
                {serviceCategories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Sparkles
                  return (
                    <StaggerItem key={cat.id} className="h-full">
                      <Link
                        to="/services"
                        className="group flex h-full min-h-[4.5rem] items-center gap-3.5 rounded-[18px] bg-white/[0.05] px-4 py-3.5 ring-1 ring-inset ring-white/10 transition-colors pressable hover:bg-white/[0.1] hover:ring-gold/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-white/8 transition-colors group-hover:bg-gold/25">
                          <Icon
                            className="h-[18px] w-[18px] text-rose-light transition-colors group-hover:text-gold"
                            aria-hidden
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14.5px] font-semibold tracking-[-0.01em] text-white">
                            {cat.name}
                          </span>
                          <span className="mt-0.5 block text-[11.5px] text-white/40">
                            {cat.count} مزودة
                          </span>
                        </span>
                        <ChevronLeft
                          className="h-4 w-4 shrink-0 text-white/25 transition-colors group-hover:text-gold"
                          aria-hidden
                        />
                      </Link>
                    </StaggerItem>
                  )
                })}
              </Stagger>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EventsSection() {
  const { data: events, loading, error, reload } = useAsyncData(
    async () => (await catalogApi.events({ limit: 4 })).data,
    [],
  )
  const featured = events?.[0]
  const rest = events?.slice(1) ?? []
  const count = events?.length ?? 0

  return (
    <section className="py-16 lg:py-24 bg-ivory relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-soft/50 via-ivory to-ivory" />
      <div
        className="pointer-events-none absolute top-0 left-0 w-72 h-72 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="الفعاليات القادمة"
            title="فعاليات تستحق الحضور"
            description="مؤتمرات وورش عمل وملتقيات — خطّطي حضوركِ ووسّعي شبكتكِ المهنية."
            linkTo="/events"
            linkLabel="كل الفعاليات"
          />
        </Reveal>

        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}

        {!loading && !error && count === 0 && (
          <Reveal>
            <div className="rounded-[22px] bg-white hairline p-10 text-center max-w-lg mx-auto">
              <Calendar className="w-10 h-10 text-gold mx-auto mb-3" aria-hidden />
              <p className="font-bold text-navy">لا توجد فعاليات منشورة حاليًا</p>
              <p className="mt-2 text-sm text-muted">تابعي الصفحة أو انضمي للمجتمع لمعرفة المواعيد القادمة.</p>
              <Button to="/events" variant="gold" size="md" className="mt-5">
                صفحة الفعاليات
              </Button>
            </div>
          </Reveal>
        )}

        {featured && (
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
            <Reveal className="lg:col-span-7">
              <div className="relative h-full">
                <span className="absolute top-4 left-4 z-10 rounded-full bg-gold text-navy text-[11px] font-bold px-3 py-1 shadow-sm ring-1 ring-gold-dark/20">
                  الأقرب موعدًا
                </span>
                <EventCard event={featured} featured />
              </div>
            </Reveal>

            {rest.length > 0 && (
              <div className="hidden lg:flex lg:col-span-5 flex-col gap-3">
                <p className="text-[12px] font-semibold text-muted px-1">أيضًا هذا الشهر</p>
                <Stagger className="flex flex-col gap-3 flex-1">
                  {rest.map((e) => (
                    <StaggerItem key={e.id} className="flex-1">
                      <LandingEventCompact event={e} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            )}

            {/* Mobile: horizontal scan for secondary events */}
            {rest.length > 0 && (
              <div className="lg:hidden col-span-full -mx-4 px-4">
                <p className="text-[12px] font-semibold text-muted mb-3 px-1">فعاليات أخرى</p>
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin">
                  {rest.map((e) => (
                    <div key={e.id} className="snap-start shrink-0 w-[min(88vw,320px)]">
                      <LandingEventCompact event={e} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {featured && (
          <Reveal>
            <div className="mt-10 rounded-[20px] bg-navy text-white px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ring-1 ring-gold/20">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-gold uppercase">
                  لا تفوّتي الفرصة
                </p>
                <p className="mt-1 text-[15px] sm:text-base text-white/80 leading-relaxed max-w-md">
                  سجّلي في الفعالية المناسبة لكِ، أو تصفّحي التفاصيل والمتحدثات على صفحة الفعاليات.
                </p>
              </div>
              <Button
                to={`/events/${featured.id}`}
                variant="gold"
                size="md"
                className="shrink-0 w-full sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                سجّلي في {featured.title.length > 28 ? 'الفعالية' : featured.title}
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

export function SuccessStories() {
  const { data: successStories, loading, error, reload } = useAsyncData(
    () => catalogApi.successStories(),
    [],
  )
  const featured = successStories?.find((s) => s.featured) || successStories?.[0]
  const others = successStories?.filter((s) => s.id !== featured?.id) ?? []

  return (
    <section id="stories" className="py-16 lg:py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="رائدة الشهر"
            title="رحلات ملهمة"
            description="كل شهر نسلّط الضوء على عضوة وإنجازاتها — وقصص أخرى من المجتمع."
            linkTo="/member-of-month"
            linkLabel="رائدة الشهر"
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {featured && (
          <div className="grid gap-4 lg:grid-cols-5 lg:gap-5">
            <Reveal className="lg:col-span-3" delay={1}>
              <article className="group relative h-full min-h-[22rem] overflow-hidden rounded-[28px] shadow-md lg:min-h-[30rem]">
                {featured.image ? (
                  <SafeImg
                    src={featured.image}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ transitionTimingFunction: 'var(--ease-out-apple)' }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-navy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <div className="absolute bottom-0 p-6 lg:p-9">
                  <Badge variant="gold">{featured.category}</Badge>
                  <h3 className="mt-3 text-2xl font-extrabold leading-snug tracking-[-0.02em] text-white lg:text-[2rem]">
                    {featured.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
                    {featured.excerpt}
                  </p>
                  <p className="mt-4 text-[12.5px] font-medium text-rose-light">{featured.author}</p>
                </div>
              </article>
            </Reveal>

            <div className="flex flex-col gap-4 lg:col-span-2">
              {others.map((story, i) => (
                <Reveal key={story.id} delay={i + 2}>
                  <article className="group flex gap-4 rounded-[20px] bg-ivory/80 p-4 hairline transition-shadow pressable-soft hover:shadow-sm">
                    {story.image ? (
                      <SafeImg
                        src={story.image}
                        alt=""
                        loading="lazy"
                        className="h-24 w-24 shrink-0 rounded-[16px] object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 shrink-0 rounded-[16px] bg-rose-soft" />
                    )}
                    <div className="flex min-w-0 flex-col justify-center">
                      <Badge variant="rose" className="w-fit">{story.category}</Badge>
                      <h4 className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug tracking-[-0.01em] text-navy">
                        {story.title}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-[12px] text-muted">{story.excerpt}</p>
                    </div>
                  </article>
                </Reveal>
              ))}

              <Reveal delay={4} className="flex-1">
                <figure className="flex h-full flex-col justify-center rounded-[20px] bg-navy p-6 text-white lg:p-7">
                  <Quote className="h-7 w-7 text-gold opacity-80" aria-hidden />
                  <blockquote className="mt-4 text-[16px] leading-relaxed text-white/85 lg:text-[17px]">
                    RAIDA ليست مجرد منصة، إنها مجتمع غيّر مسار عملي وفتح لي أبواب شراكات لم أتخيلها.
                  </blockquote>
                  <figcaption className="mt-4 text-[12px] font-semibold text-gold">
                    — سارة المنصوري
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function PartnersSection() {
  const { data: partners, loading, error, reload } = useAsyncData(() => catalogApi.partners(), [])

  return (
    <section className="py-16 lg:py-20 bg-ivory border-y border-separator">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gold-dark">
              شركاؤنا
            </span>
            <h2 className="mt-3 display-sm text-navy">شركاء الثقة والنمو</h2>
            <p className="mt-3 body-lg text-muted">
              نعمل مع مؤسسات رائدة لدعم مجتمع رائدات الأعمال.
            </p>
          </div>
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {partners && (
          <Stagger className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14 lg:mt-14">
            {partners.map((p) => (
              <StaggerItem key={p.id}>
                <div className="flex min-h-11 items-center gap-3">
                  {p.logo ? (
                    <SafeImg
                      src={p.logo}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-navy/10"
                    />
                  ) : (
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-base font-bold text-gold"
                      aria-hidden
                    >
                      {p.name[0]}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold tracking-[-0.01em] text-navy">
                      {p.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted">{p.type}</span>
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
        <div className="mt-12 text-center lg:mt-14">
          <Button to="/partnerships" variant="outline" size="md" className={focusRing}>
            تعرّفي على برامج الشراكة
            <ChevronLeft className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export function PricingSection() {
  const { data: pricingPlans, loading, error, reload } = useAsyncData(() => catalogApi.plans(), [])

  return (
    <section className="py-16 lg:py-24 section-fade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="خطط العضوية"
            title="اختاري عضويتك السنوية"
            description="ثلاث عضويات مدفوعة لرائدات الأعمال، المدربات والخبراء، والأكاديميات. الطلب يُراجع من الإدارة."
            centered
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {pricingPlans && (
          <Stagger className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto items-stretch">
            {pricingPlans.map((plan) => (
              <StaggerItem key={plan.id}>
                <div
                  className={`relative h-full p-6 lg:p-7 rounded-[24px] flex flex-col ${
                    plan.highlighted
                      ? 'bg-navy text-white shadow-lg border border-gold/40'
                      : 'bg-white hairline shadow-xs'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gold text-navy text-[11px] font-bold rounded-full tracking-[0.01em]">
                      سعر الإطلاق
                    </span>
                  )}
                  <p className={`text-[12px] font-semibold ${plan.highlighted ? 'text-gold' : 'text-rose'}`}>
                    {plan.nameAr}
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold tracking-[-0.03em] ${plan.highlighted ? 'text-white' : 'text-navy'}`}>
                      {plan.launchPrice || plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlighted ? 'text-white/45' : 'text-muted'}`}>دج</span>
                  </div>
                  {plan.originalPrice && (
                    <p className={`text-[12px] mt-1 ${plan.highlighted ? 'text-white/45' : 'text-muted'}`}>
                      <span className="line-through">{plan.originalPrice} دج</span>
                      {plan.launchSavings ? ` — توفير ${plan.launchSavings} دج` : ''}
                    </p>
                  )}
                  <p className={`text-[11px] mt-1 ${plan.highlighted ? 'text-white/45' : 'text-muted'}`}>/ {plan.period}</p>
                  <p className={`mt-4 text-sm ${plan.highlighted ? 'text-white/65' : 'text-muted'}`}>{plan.description}</p>
                  <ul className="mt-6 space-y-2.5 flex-1">
                    {(Array.isArray(plan.features) ? plan.features : []).slice(0, 5).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? 'text-gold' : 'text-rose'}`} />
                        <span className={plan.highlighted ? 'text-white/75' : 'text-dark'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 space-y-2">
                    <Button
                      to={planDetailPath(plan.name)}
                      variant={plan.highlighted ? 'gold' : 'primary'}
                      size="md"
                      className={`w-full ${
                        plan.highlighted
                          ? 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                          : focusRing
                      }`}
                    >
                      تعرّفي على العضوية
                      <ChevronLeft className="w-4 h-4 opacity-70" />
                    </Button>
                    <Button
                      to="/membership"
                      variant={plan.highlighted ? 'glass' : 'outline'}
                      size="sm"
                      className={`w-full ${plan.highlighted ? '!text-white/85 !border-white/20 !bg-white/10' : ''}`}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}

export function FinalCTA() {
  const avatars = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=96&h=96&fit=crop',
  ]
  const { data: stats } = useAsyncData(() => catalogApi.stats(), [])
  const communityStat = stats?.find((s) => /عضو|رائد|عضوة/.test(s.label)) ?? stats?.[0]

  return (
    <section className="relative isolate overflow-hidden min-h-[28rem] sm:min-h-[32rem] flex items-center">
      <img
        src="/cta-background.png"
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
      />
      <div className="absolute inset-0 bg-navy/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(232,160,176,0.22),transparent_55%)]" />

      <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <Reveal>
          <h2 className="text-[2.125rem] sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.025em] leading-[1.14] text-white max-w-3xl mx-auto">
            ابدئي رحلتك مع مجتمع{' '}
            <span className="text-gold-light">رائدة</span>
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-white/75 max-w-xl mx-auto leading-relaxed">
            انضمي إلى الرائدات والخبيرات والعلامات في أكبر شبكة أعمال نسائية عربية.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              to="/membership"
              variant="gold"
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-gold/30 hover:-translate-y-0.5 active:translate-y-0 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              إنشاء حساب
              <ChevronLeft className="w-5 h-5 opacity-70" />
            </Button>
            <Button
              to="/members"
              variant="glass"
              size="lg"
              className="w-full sm:w-auto !text-white !border-white/25 !bg-white/10 hover:!bg-white/18 backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              استكشاف الأعضاء
            </Button>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="flex -space-x-2.5 space-x-reverse">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  width={36}
                  height={36}
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-navy/80 shadow-sm"
                />
              ))}
            </div>
            <p className="text-sm text-white/75">
              <span className="font-semibold text-white">
                {communityStat ? `+${communityStat.value.toLocaleString('ar-DZ')}${communityStat.suffix || ''}` : 'مجتمع رائدات'}
              </span>{' '}
              {communityStat?.label || 'انضمّت بالفعل'}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
