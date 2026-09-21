import type { ElementType } from 'react'
import AnimatedCounter from '../ui/AnimatedCounter'
import SectionHeader from '../ui/SectionHeader'
import MemberCard from '../ui/MemberCard'
import BrandCard from '../ui/BrandCard'
import EventCard from '../ui/EventCard'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Reveal, { Stagger, StaggerItem } from '../ui/Reveal'
import SafeImg from '../ui/SafeImg'
import { LoadingBlock, ErrorBlock } from '../ui/StateBlocks'
import { useAsyncData } from '../../hooks/useAsyncData'
import { catalogApi } from '../../lib/catalog'
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
    <section className="py-14 lg:py-18 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {stats && (
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.id}>
                <div className="text-center p-6 lg:p-8 rounded-[22px] bg-white hairline shadow-xs">
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
    <section className="py-16 lg:py-24 section-fade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="group h-full p-6 rounded-[22px] bg-white/80 backdrop-blur-sm hairline shadow-xs pressable-soft hover:shadow-md transition-shadow">
                    <div className="w-11 h-11 rounded-[13px] bg-rose-soft flex items-center justify-center border border-rose/20">
                      <Icon className="w-[18px] h-[18px] text-rose" />
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
            eyebrow="دليل الخدمات"
            title="ابحثي عن الخدمة المناسبة"
            description="تصنيفات واضحة تساعدك على إيجاد الخبيرة المناسبة لمشروعك."
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
                  <button className="group w-full p-5 rounded-[18px] bg-white/[0.04] border border-white/8 hover:bg-white/[0.08] hover:border-white/15 transition-colors text-center pressable cursor-pointer">
                    <div className="w-11 h-11 mx-auto rounded-[12px] bg-white/8 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-[18px] h-[18px] text-rose-light group-hover:text-gold transition-colors" />
                    </div>
                    <h3 className="mt-3 text-[13px] font-semibold text-white tracking-[-0.01em]">{cat.name}</h3>
                    <p className="mt-1 text-[11px] text-white/35">{cat.count} مزودة</p>
                  </button>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
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

  return (
    <section className="py-16 lg:py-24 bg-ivory relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-soft/40 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="الفعاليات القادمة"
            title="فعاليات تستحق الحضور"
            description="مؤتمرات وورش عمل وملتقيات لبناء علاقات وفرص حقيقية."
            linkTo="/events"
            linkLabel="كل الفعاليات"
          />
        </Reveal>
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {featured && (
          <div className="space-y-4">
            <Reveal>
              <EventCard event={featured} featured />
            </Reveal>
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((e) => (
                <StaggerItem key={e.id}>
                  <EventCard event={e} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
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
            eyebrow="قصص النجاح"
            title="رحلات ملهمة"
            description="قصص حقيقية لرائدات وعلامات صنعت الفارق."
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
                    {(Array.isArray(plan.features) ? plan.features : []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? 'text-gold' : 'text-rose'}`} />
                        <span className={plan.highlighted ? 'text-white/75' : 'text-dark'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    to="/membership"
                    variant={plan.highlighted ? 'gold' : 'outline'}
                    size="md"
                    className="w-full mt-7"
                  >
                    {plan.cta}
                  </Button>
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
