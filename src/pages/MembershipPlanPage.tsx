import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  Check,
  ChevronLeft,
  ArrowRight,
  CreditCard,
  Sparkles,
} from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SafeImg from '../components/ui/SafeImg'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import SeoHead from '../components/seo/SeoHead'
import { useAsyncData } from '../hooks/useAsyncData'
import { useAuth } from '../context/AuthContext'
import { catalogApi, meApi } from '../lib/catalog'
import { asArray } from '../lib/normalize'
import { breadcrumbJsonLd, SITE_NAME } from '../lib/seo'
import { springs, useMotionSafe } from '../lib/motion'
import {
  membershipPlanDetails,
  planDetailPath,
  SLUG_TO_PLAN,
} from '../data/membershipPlanDetails'
import { canAccessAdminPanel } from '../lib/plans'

const accentText: Record<string, string> = {
  gold: 'text-gold',
  rose: 'text-rose',
  mauve: 'text-mauve',
}

const accentSoft: Record<string, string> = {
  gold: 'bg-gold/15 text-gold-dark ring-gold/30',
  rose: 'bg-rose-soft text-rose ring-rose/25',
  mauve: 'bg-blush text-mauve ring-mauve/25',
}

export default function MembershipPlanPage() {
  const { planSlug = '' } = useParams()
  const planKey = SLUG_TO_PLAN[planSlug]
  const detail = planKey ? membershipPlanDetails[planKey] : null
  const { fadeUp } = useMotionSafe()
  const { user, refreshMe } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    data: pricingPlans,
    loading,
    error,
    reload,
  } = useAsyncData(() => catalogApi.plans(), [])

  const plan = useMemo(
    () => (pricingPlans ?? []).find((p) => p.name === planKey) ?? null,
    [pricingPlans, planKey],
  )

  const otherPlans = useMemo(
    () => (pricingPlans ?? []).filter((p) => p.name !== planKey),
    [pricingPlans, planKey],
  )

  if (!detail || !planKey) {
    return <Navigate to="/membership" replace />
  }

  const selectPlan = async () => {
    if (!user) {
      navigate('/dashboard')
      return
    }
    if (canAccessAdminPanel(user.role)) {
      navigate('/admin')
      return
    }
    if (user.plan === planKey && user.membershipStatus === 'approved') {
      navigate('/dashboard')
      return
    }
    setBusy(true)
    setErrorMsg(null)
    try {
      await meApi.requestMembership(planKey)
      await refreshMe()
      navigate('/dashboard')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'تعذر إرسال طلب العضوية')
    } finally {
      setBusy(false)
    }
  }

  const ctaLabel =
    user?.plan === planKey && user.membershipStatus === 'approved'
      ? 'عضويتك الحالية'
      : user?.membershipStatus === 'pending' && user.plan === planKey
        ? 'بانتظار الموافقة'
        : busy
          ? 'جاري الإرسال...'
          : user
            ? plan?.cta || 'اطلبي هذه العضوية'
            : 'ادخلي لطلب العضوية'

  const seoTitle = `${plan?.nameAr || detail.eyebrow} | ${SITE_NAME}`
  const seoDescription = detail.pitch

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        path={`/membership/${detail.slug}`}
        keywords={[plan?.nameAr || '', 'عضوية رائدة', 'RAIDA', detail.eyebrow].filter(Boolean)}
        image={detail.heroImage}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'العضوية', path: '/membership' },
          { name: plan?.nameAr || detail.eyebrow, path: `/membership/${detail.slug}` },
        ])}
      />

      {/* Full-bleed hero — brand + one headline + pitch + CTA */}
      <section className="relative isolate min-h-[min(78vh,620px)] flex flex-col overflow-hidden">
        <SafeImg
          src={detail.heroImage}
          fallback={detail.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/35" />
        <div className="absolute inset-0 bg-gradient-to-l from-gold/15 via-transparent to-rose/10 mix-blend-soft-light" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ivory to-transparent" />

        <div className="relative z-10 flex-1 flex flex-col justify-end pt-28 pb-14 sm:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={springs.settle}
              className="max-w-2xl"
            >
              <Link
                to="/membership"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/70 hover:text-white transition-colors mb-5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                كل العضويات
              </Link>

              <p className="font-display text-[11px] sm:text-xs font-bold tracking-[0.2em] text-gold uppercase">
                RAIDA · {detail.eyebrow}
              </p>
              <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-[-0.03em] leading-[1.12]">
                {plan?.nameAr || detail.headline}
              </h1>
              <p className="mt-4 text-[15px] sm:text-lg text-white/72 leading-relaxed max-w-xl">
                {detail.pitch}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  className="shadow-lg shadow-gold/25"
                  disabled={busy || user?.membershipStatus === 'pending'}
                  onClick={() => void selectPlan()}
                >
                  {ctaLabel}
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
                {detail.relatedLinks[0] && (
                  <Button to={detail.relatedLinks[0].to} variant="glass" size="lg" className="!text-white !border-white/25 !bg-white/10">
                    {detail.relatedLinks[0].label}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-20 sm:space-y-24">
        {/* Price strip — one job: pricing clarity */}
        <Reveal className="-mt-6 relative z-10">
          {loading ? (
            <LoadingBlock />
          ) : error ? (
            <ErrorBlock message={error} onRetry={reload} />
          ) : plan ? (
            <PriceStrip plan={plan} accent={detail.accent} />
          ) : null}
          {errorMsg && <p className="mt-3 text-center text-sm text-rose">{errorMsg}</p>}
        </Reveal>

        {/* Story */}
        <Reveal>
          <div className="max-w-3xl">
            <p className={`text-[12px] font-semibold ${accentText[detail.accent]}`}>لماذا هذه العضوية</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em] leading-snug">
              {detail.headline}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] sm:text-base text-muted leading-relaxed">
              {detail.story.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Audience */}
        <section>
          <Reveal>
            <p className={`text-[12px] font-semibold ${accentText[detail.accent]}`}>الجمهور</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em]">
              {detail.audienceTitle}
            </h2>
          </Reveal>
          <Stagger className="mt-8 grid sm:grid-cols-2 gap-x-10 gap-y-4 max-w-4xl">
            {detail.audience.map((item) => (
              <StaggerItem key={item}>
                <div className="flex gap-3 items-start">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      detail.accent === 'gold'
                        ? 'bg-gold'
                        : detail.accent === 'rose'
                          ? 'bg-rose'
                          : 'bg-mauve'
                    }`}
                  />
                  <p className="text-[15px] text-navy/80 leading-relaxed">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Outcomes — editorial rows, not card grid */}
        <section>
          <Reveal>
            <p className={`text-[12px] font-semibold ${accentText[detail.accent]}`}>القيمة</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em]">
              ماذا تحصلين عليه فعلياً
            </h2>
            <p className="mt-2 text-[15px] text-muted max-w-xl">
              أربع ركائز تبني حضوركِ داخل رائدة على مدار السنة.
            </p>
          </Reveal>
          <div className="mt-10 divide-y divide-navy/8 border-y border-navy/8">
            {detail.outcomes.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={Math.min(i, 3)}>
                  <div className="grid sm:grid-cols-12 gap-4 sm:gap-8 py-7 sm:py-8 items-start">
                    <div className="sm:col-span-1">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-[14px] ring-1 ${accentSoft[detail.accent]}`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="sm:col-span-4">
                      <h3 className="font-bold text-navy text-lg tracking-[-0.01em]">{item.title}</h3>
                    </div>
                    <p className="sm:col-span-7 text-[15px] text-muted leading-relaxed">{item.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Journey */}
        <section>
          <Reveal>
            <p className={`text-[12px] font-semibold ${accentText[detail.accent]}`}>المسار</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em]">
              {detail.journeyTitle}
            </h2>
          </Reveal>
          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {detail.journey.map((step, i) => (
              <Reveal key={step.label} delay={i}>
                <li className="relative">
                  <span className="font-display text-3xl font-extrabold text-navy/10 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-bold text-navy">{step.label}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Ideal for */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-navy text-white px-6 py-10 sm:px-10 sm:py-12">
            <div
              className="pointer-events-none absolute -top-24 -left-16 h-[320px] w-[320px] rounded-full bg-gold/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -right-10 h-[280px] w-[280px] rounded-full bg-rose/25 blur-3xl"
              aria-hidden
            />
            <div className="relative max-w-2xl">
              <p className="text-[12px] font-semibold text-gold">مناسبة لكِ إذا</p>
              <ul className="mt-5 space-y-3">
                {detail.idealFor.map((line) => (
                  <li key={line} className="flex gap-3 items-start text-[15px] text-white/80">
                    <Check className="w-4 h-4 mt-1 text-gold shrink-0" strokeWidth={2.5} />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                {detail.relatedLinks.map((link) => (
                  <Button
                    key={link.to}
                    to={link.to}
                    variant="glass"
                    size="md"
                    className="!text-white !border-white/20 !bg-white/10"
                  >
                    {link.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Full feature list from API */}
        {plan && asArray(plan.features).length > 0 && (
          <section>
            <Reveal>
              <p className={`text-[12px] font-semibold ${accentText[detail.accent]}`}>التفاصيل</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em]">
                كل المزايا المشمولة
              </h2>
            </Reveal>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-4xl">
              {asArray(plan.features).map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[14px] text-navy/85 leading-relaxed"
                >
                  <Check className="w-4 h-4 mt-0.5 text-rose shrink-0" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Other plans */}
        {otherPlans.length > 0 && (
          <section>
            <Reveal>
              <p className="text-[12px] font-semibold text-muted">قارني أيضاً</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-navy tracking-[-0.02em]">
                العضويات الأخرى
              </h2>
            </Reveal>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {otherPlans.map((p) => (
                <Link
                  key={p.id}
                  to={planDetailPath(p.name)}
                  className="group block rounded-[20px] bg-white hairline p-5 sm:p-6 pressable-soft hover:shadow-sm transition-shadow"
                >
                  <p className="text-[12px] font-semibold text-rose">{p.nameAr}</p>
                  <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">{p.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-navy group-hover:text-rose transition-colors">
                    تعرّفي أكثر
                    <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <Reveal>
          <div className="text-center max-w-xl mx-auto">
            <Sparkles className={`w-6 h-6 mx-auto ${accentText[detail.accent]}`} />
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em]">
              جاهزة لهذه العضوية؟
            </h2>
            <p className="mt-3 text-[15px] text-muted leading-relaxed">
              الطلب يُراجع من الإدارة، ثم جلسة Online، ثم التفعيل. أسعار الإطلاق متاحة لمدة شهر واحد.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="gold"
                size="lg"
                disabled={busy || user?.membershipStatus === 'pending'}
                onClick={() => void selectPlan()}
              >
                {ctaLabel}
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
              <Button to="/membership" variant="outline" size="lg">
                العودة لكل العضويات
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function PriceStrip({
  plan,
  accent,
}: {
  plan: PricingPlan
  accent: 'gold' | 'rose' | 'mauve'
}) {
  const { reduce } = useMotionSafe()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={springs.settle}
      className="rounded-[22px] bg-white hairline shadow-sm px-5 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-[14px] ring-1 ${accentSoft[accent]}`}
        >
          <CreditCard className="w-4 h-4" />
        </span>
        <div>
          <p className="text-[12px] font-semibold text-muted">الاشتراك السنوي</p>
          <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-3xl font-extrabold text-navy tracking-[-0.03em] tabular-nums">
              {plan.launchPrice || plan.price}
            </span>
            <span className="text-sm text-muted">دج / {plan.period}</span>
          </div>
          {plan.originalPrice && (
            <p className="mt-1 text-[12px] text-muted">
              <span className="line-through">{plan.originalPrice} دج</span>
              {plan.launchSavings ? ` — توفير ${plan.launchSavings} دج عند الإطلاق` : ''}
            </p>
          )}
        </div>
      </div>
      <p className="text-[13px] text-muted max-w-sm leading-relaxed sm:text-left">
        {plan.description}
      </p>
    </motion.div>
  )
}
