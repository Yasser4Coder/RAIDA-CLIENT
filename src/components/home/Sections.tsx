import { Link } from 'react-router-dom'
import type { ElementType } from 'react'
import AnimatedCounter from '../ui/AnimatedCounter'
import SectionHeader from '../ui/SectionHeader'
import MemberCard from '../ui/MemberCard'
import BrandCard from '../ui/BrandCard'
import EventCard from '../ui/EventCard'
import LandingEventCompact from './LandingEventCompact'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Reveal, { Stagger, StaggerItem } from '../ui/Reveal'
import SafeImg from '../ui/SafeImg'
import { LoadingBlock, ErrorBlock } from '../ui/StateBlocks'
import { useAsyncData } from '../../hooks/useAsyncData'
import { catalogApi } from '../../lib/catalog'
import { planDetailPath } from '../../data/membershipPlanDetails'
import { mergeFeaturedAcademies } from '../../data/featuredAcademies'
import {
  Rocket, GraduationCap, Lightbulb, Handshake, Calendar, Sparkles,
  Megaphone, Briefcase, Palette, Code, Calculator, Scale, TrendingUp,
  Check, ChevronLeft, Quote,
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

export function StatsSection() {
  const { data: stats, loading, error, reload } = useAsyncData(() => catalogApi.stats(), [])

  return (
    <section className="pt-6 pb-10 lg:pb-14 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {stats && (
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <StaggerItem key={stat.id}>
                <div className="relative overflow-hidden text-center p-6 lg:p-8 rounded-[22px] bg-white hairline shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-gold via-rose to-mauve opacity-80"
                    style={{ opacity: 0.5 + (i % 4) * 0.12 }}
                    aria-hidden
                  />
                  <div className="text-[1.75rem] sm:text-4xl font-extrabold text-navy tracking-[-0.03em] tabular-nums">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="caption text-muted mt-2 font-medium">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
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
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] hero-dot-grid"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="اكتشفي المجتمع"
            title="مجتمع RAIDA"
            description="كل ما تحتاجينه للنمو في مكان واحد: ريادة، تدريب، استشارات، شراكات، فعاليات وعلامات."
            centered
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {communityCards && (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {communityCards.map((card) => {
              const Icon = iconMap[card.icon] || Sparkles
              return (
                <StaggerItem key={card.id}>
                  <div className="group h-full p-6 rounded-[22px] bg-ivory/80 hairline shadow-xs pressable-soft hover:shadow-md hover:bg-blush/50 transition-all">
                    <div className="w-11 h-11 rounded-[13px] bg-navy text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors">
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                    <h3 className="mt-4 text-[17px] font-bold text-navy tracking-[-0.01em]">{card.title}</h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">{card.description}</p>
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

export function FeaturedMembers() {
  const { data, loading, error, reload } = useAsyncData(
    async () => (await catalogApi.members({ limit: 4 })).data,
    [],
  )

  return (
    <section className="py-16 lg:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="الأعضاء المميزات"
            title="تعرّفي على رائدات المجتمع"
            description="ملفات احترافية لرائدات وخبيرات من مختلف التخصصات."
            linkTo="/members"
            linkLabel="عرض كل الأعضاء"
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {data && (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((m) => (
              <StaggerItem key={m.id}>
                <MemberCard member={m} />
              </StaggerItem>
            ))}
          </Stagger>
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
    <section className="py-16 lg:py-24 bg-white">
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
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((b) => (
              <StaggerItem key={b.id}>
                <BrandCard brand={b} />
              </StaggerItem>
            ))}
          </Stagger>
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
    <section className="py-16 lg:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="أكاديميات ومراكز تدريب"
            title="أكاديميات ومراكز تدريب تستحق الاكتشاف"
            description="مؤسسات تدريب وكوتشينق وبرامج مهنية داخل مجتمع رائدة."
            linkTo="/academies"
            linkLabel="كل الأكاديميات"
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {data && data.length > 0 && (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((m) => (
              <StaggerItem key={m.id}>
                <MemberCard member={m} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
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
        <Reveal>
          <SectionHeader
            eyebrow="اطلبي خدمة"
            title="خدمات لمشروعكِ"
            description="اختر التصنيف وقدّم طلبًا — يصل إلى الخبراء المناسبين عبر رائدة."
            light
            centered
          />
        </Reveal>
        {loading && <LoadingBlock label="جاري التحميل..." />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {serviceCategories && (
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {serviceCategories.map((cat) => {
              const Icon = iconMap[cat.icon] || Sparkles
              return (
                <StaggerItem key={cat.id}>
                  <Link
                    to="/services"
                    className="group block w-full p-5 rounded-[18px] bg-white/[0.04] border border-white/8 hover:bg-white/[0.1] hover:border-gold/30 transition-colors text-center pressable"
                  >
                    <div className="w-11 h-11 mx-auto rounded-[12px] bg-white/8 flex items-center justify-center group-hover:bg-gold/25 transition-colors">
                      <Icon className="w-[18px] h-[18px] text-rose-light group-hover:text-gold transition-colors" />
                    </div>
                    <h3 className="mt-3 text-[13px] font-semibold text-white tracking-[-0.01em]">{cat.name}</h3>
                    <p className="mt-1 text-[11px] text-white/35">{cat.count} مزودة</p>
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
        <div className="text-center mt-8">
          <Button to="/services" variant="gold" size="md">
            اطلبي خدمة الآن
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
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
          <div className="mb-10 md:mb-12">
            <SectionHeader
              eyebrow="الفعاليات القادمة"
              title="فعاليات تستحق الحضور"
              description="مؤتمرات وورش عمل وملتقيات — خطّطي حضوركِ ووسّعي شبكتكِ المهنية."
              linkTo="/events"
              linkLabel="كل الفعاليات"
            />
            {count > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white hairline px-4 py-2 text-[13px] font-semibold text-navy shadow-xs">
                  <Calendar className="w-4 h-4 text-rose" />
                  {count.toLocaleString('ar-DZ')} فعاليات معروضة الآن
                </span>
              </div>
            )}
          </div>
        </Reveal>

        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}

        {!loading && !error && count === 0 && (
          <Reveal>
            <div className="rounded-[22px] bg-white hairline p-10 text-center max-w-lg mx-auto">
              <Calendar className="w-10 h-10 text-gold mx-auto mb-3" />
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
                <p className="text-[12px] font-semibold text-muted px-1 hidden lg:block">
                  أيضًا هذا الشهر
                </p>
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
              <Button to={`/events/${featured.id}`} variant="gold" size="md" className="shrink-0 w-full sm:w-auto">
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
    <section id="stories" className="py-16 lg:py-24 bg-ivory scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="رائدة الشهر"
            title="رحلات ملهمة"
            description="كل شهر نسلّط الضوء على عضوة وإنجازاتها — وقصص أخرى من المجتمع."
            centered
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {featured && (
          <div className="grid lg:grid-cols-5 gap-4">
            <Reveal className="lg:col-span-3" delay={1}>
              <article className="group relative rounded-[24px] overflow-hidden shadow-md min-h-[340px] h-full">
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
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" />
                <div className="absolute bottom-0 p-6 lg:p-8">
                  <Badge variant="gold">{featured.category}</Badge>
                  <h3 className="mt-3 text-2xl lg:text-[1.75rem] font-extrabold text-white tracking-[-0.02em] leading-snug">
                    {featured.title}
                  </h3>
                  <p className="mt-2 text-white/65 text-sm leading-relaxed max-w-md">{featured.excerpt}</p>
                  <p className="mt-3 text-rose-light text-[12px] font-medium">{featured.author}</p>
                </div>
              </article>
            </Reveal>
            <div className="lg:col-span-2 flex flex-col gap-4">
              {others.map((story, i) => (
                <Reveal key={story.id} delay={i + 2}>
                  <article className="group flex gap-3.5 p-3.5 rounded-[18px] bg-white hairline shadow-xs pressable-soft hover:shadow-sm transition-shadow">
                    {story.image ? (
                      <SafeImg src={story.image} alt="" className="w-24 h-24 rounded-[14px] object-cover shrink-0" />
                    ) : (
                      <div className="w-24 h-24 rounded-[14px] bg-rose-soft shrink-0" />
                    )}
                    <div className="flex flex-col justify-center min-w-0">
                      <Badge variant="rose" className="w-fit">{story.category}</Badge>
                      <h4 className="mt-1.5 font-bold text-[14px] text-navy tracking-[-0.01em] leading-snug line-clamp-2">
                        {story.title}
                      </h4>
                      <p className="mt-1 text-[11px] text-muted line-clamp-2">{story.excerpt}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
              <Reveal delay={4}>
                <div className="p-5 rounded-[18px] bg-navy text-white flex items-start gap-3 flex-1">
                  <Quote className="w-6 h-6 text-gold shrink-0 opacity-80" />
                  <div>
                    <p className="text-sm leading-relaxed text-white/75">
                      "RAIDA ليست مجرد منصة، إنها مجتمع غيّر مسار عملي وفتح لي أبواب شراكات لم أتخيلها."
                    </p>
                    <p className="mt-2 text-[11px] text-gold font-semibold">— سارة المنصوري</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        )}
        <div className="text-center mt-8">
          <Button to="/member-of-month" variant="outline" size="sm">
            رائدة الشهر
            <ChevronLeft className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export function PartnersSection() {
  const { data: partners, loading, error, reload } = useAsyncData(() => catalogApi.partners(), [])

  return (
    <section className="py-16 lg:py-20 bg-white border-y border-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="شركاؤنا"
            title="شركاء الثقة والنمو"
            description="نعمل مع مؤسسات رائدة لدعم مجتمع رائدات الأعمال."
            centered
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {partners && (
          <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {partners.map((p) => (
              <StaggerItem key={p.id}>
                <div className="flex flex-col items-center justify-center p-6 rounded-[18px] bg-ivory/80 hairline hover:shadow-sm transition-shadow pressable-soft">
                  <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center mb-3">
                    <span className="text-gold font-bold text-base">{p.name[0]}</span>
                  </div>
                  <p className="text-[13px] font-semibold text-navy text-center tracking-[-0.01em]">{p.name}</p>
                  <p className="text-[10px] text-muted mt-1">{p.type}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
        <div className="text-center mt-8">
          <Button to="/partnerships" variant="outline" size="sm">
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
                      className="w-full"
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
          <div className="inline-flex items-center gap-2 rounded-full material-ultra-thin px-4 py-1.5 text-[13px] font-medium text-navy ring-1 ring-white/40 shadow-sm mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-rose animate-pulse" />
            Connect · Grow · Lead
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white max-w-3xl mx-auto">
            ابدئي رحلتك مع مجتمع{' '}
            <span className="bg-gradient-to-l from-gold-light via-rose-light to-rose bg-clip-text text-transparent">
              RAIDA
            </span>
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            انضمي إلى آلاف الرائدات والخبيرات والعلامات في أكبر شبكة أعمال نسائية عربية.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              to="/membership"
              variant="gold"
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-gold/30 hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              إنشاء حساب
              <ChevronLeft className="w-5 h-5 opacity-70" />
            </Button>
            <Button
              to="/members"
              variant="glass"
              size="lg"
              className="w-full sm:w-auto !text-white !border-white/25 !bg-white/10 hover:!bg-white/18 backdrop-blur-md"
            >
              استكشاف الأعضاء
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/65">
            {['عضوية سنوية', 'مجتمع موثوق', 'فرص شراكة حقيقية'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-rose-light shrink-0" strokeWidth={2.5} />
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex -space-x-2.5 space-x-reverse">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-navy/80 shadow-sm"
                />
              ))}
            </div>
            <p className="text-sm text-white/70">
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
