import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, Sparkles, CreditCard, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { springs, useMotionSafe } from '../lib/motion'
import { useAsyncData } from '../hooks/useAsyncData'
import { useAuth } from '../context/AuthContext'
import { catalogApi, meApi } from '../lib/catalog'
import { asArray } from '../lib/normalize'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'

const faqs = [
  {
    q: 'هل يمكنني الترقية لاحقاً؟',
    a: 'نعم، يمكنكِ الترقية أو تغيير خطتك في أي وقت من لوحة التحكم.',
  },
  {
    q: 'هل توجد فترة تجريبية؟',
    a: 'الخطة المجانية متاحة دائماً، والخطة الاحترافية تشمل 14 يوماً تجريبياً.',
  },
  {
    q: 'كيف أدفع الاشتراك؟',
    a: 'نقبل البطاقات البنكية، التحويل البنكي، ووسائل الدفع المحلية.',
  },
  {
    q: 'هل يمكنني الإلغاء في أي وقت؟',
    a: 'نعم. يمكنكِ إلغاء الاشتراك المدفوع قبل موعد التجديد دون رسوم إضافية.',
  },
]

const trust = ['إلغاء في أي وقت', 'بدون بطاقة للخطة المجانية', 'ترقية فورية']

export default function MembershipPage() {
  const { reduce } = useMotionSafe()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const { user, refreshMe } = useAuth()
  const navigate = useNavigate()
  const [busyPlan, setBusyPlan] = useState<string | null>(null)
  const [planError, setPlanError] = useState<string | null>(null)

  const {
    data: pricingPlans,
    loading,
    error,
    reload,
  } = useAsyncData(() => catalogApi.plans(), [])

  const plans = pricingPlans ?? []

  const selectPlan = async (planName: string) => {
    if (!user) {
      navigate('/dashboard')
      return
    }
    if (user.role === 'admin' || user.role === 'super_admin') {
      navigate('/admin')
      return
    }
    if (user.plan === planName) {
      navigate('/dashboard')
      return
    }
    if (planName !== 'FREE') {
      setPlanError('ترقية الخطط المدفوعة تتم من خلال الإدارة بعد تأكيد الاشتراك.')
      return
    }
    setBusyPlan(planName)
    setPlanError(null)
    try {
      await meApi.updatePlan(planName)
      await refreshMe()
      navigate('/dashboard')
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'تعذر تغيير الخطة')
    } finally {
      setBusyPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.membership.title}
        description={routeSeo.membership.description}
        path={routeSeo.membership.path}
        keywords={[...routeSeo.membership.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'العضوية', path: '/membership' },
        ])}
      />
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-28 pb-12 sm:pb-14">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
          <div className="hero-mesh absolute inset-0 opacity-80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[min(90vw,720px)] h-[420px] rounded-full bg-gradient-to-br from-gold/25 via-rose/20 to-mauve/15 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.settle}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-gold/30 shadow-xs mb-5">
              <CreditCard className="w-3.5 h-3.5 text-gold-dark" />
              العضوية
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy leading-[1.12] max-w-3xl mx-auto">
              انضمي إلى مجتمع{' '}
              <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
                RAIDA
              </span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              اختاري الخطة التي تناسب مرحلة نموكِ وابدئي بناء حضورك المهني.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
              {trust.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rose shrink-0" strokeWidth={2.5} />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock message={error} onRetry={reload} />
        ) : (
          <Stagger className="grid md:grid-cols-3 gap-4 lg:gap-5 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => (
              <StaggerItem key={plan.id}>
                <motion.article
                  whileHover={reduce ? undefined : { y: -4 }}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  transition={springs.snappy}
                  className={`relative h-full p-6 lg:p-7 rounded-[22px] flex flex-col ${
                    plan.highlighted
                      ? 'bg-navy text-white shadow-lg ring-1 ring-gold/40 z-[1]'
                      : 'bg-white hairline shadow-sm'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-gold text-navy text-[11px] font-bold shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      الأكثر شعبية
                    </span>
                  )}

                  <p
                    className={`text-[12px] font-semibold tracking-[0.02em] ${
                      plan.highlighted ? 'text-gold' : 'text-rose'
                    }`}
                  >
                    {plan.nameAr}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 tracking-[0.06em] ${
                      plan.highlighted ? 'text-white/40' : 'text-muted'
                    }`}
                  >
                    {plan.name}
                  </p>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span
                      className={`text-4xl font-extrabold tracking-[-0.03em] tabular-nums ${
                        plan.highlighted ? 'text-white' : 'text-navy'
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.price !== '0' && (
                      <span className={`text-sm ${plan.highlighted ? 'text-white/45' : 'text-muted'}`}>
                        دج
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] mt-1 ${plan.highlighted ? 'text-white/45' : 'text-muted'}`}>
                    {plan.period}
                  </p>
                  <p
                    className={`mt-4 text-sm leading-relaxed ${
                      plan.highlighted ? 'text-white/70' : 'text-muted'
                    }`}
                  >
                    {plan.description}
                  </p>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {asArray(plan.features).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px]">
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            plan.highlighted ? 'text-gold' : 'text-rose'
                          }`}
                          strokeWidth={2.5}
                        />
                        <span className={plan.highlighted ? 'text-white/80' : 'text-dark'}>{f}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2.5 text-[13px]">
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.highlighted ? 'text-gold' : 'text-rose'
                        }`}
                        strokeWidth={2.5}
                      />
                      <span className={plan.highlighted ? 'text-white/80' : 'text-dark'}>
                        {plan.grantsAccess === false ? 'بدون دخول لوحة العضوة' : 'دخول لوحة العضوة'}
                      </span>
                    </li>
                  </ul>

                  <Button
                    variant={plan.highlighted ? 'gold' : 'outline'}
                    size="md"
                    className={`w-full mt-7 ${plan.highlighted ? 'shadow-md shadow-gold/20' : ''}`}
                    disabled={busyPlan === plan.name}
                    onClick={() => void selectPlan(plan.name)}
                  >
                    {user?.plan === plan.name
                      ? 'خطتك الحالية'
                      : busyPlan === plan.name
                        ? 'جاري التفعيل...'
                        : user
                          ? plan.cta
                          : 'ادخلي لاختيار الخطة'}
                    <ChevronLeft className="w-4 h-4 opacity-70" />
                  </Button>
                </motion.article>
              </StaggerItem>
            ))}
          </Stagger>
        )}
        {planError && (
          <p className="text-center text-sm text-rose mt-4">{planError}</p>
        )}

        {/* FAQ — accordion, interruptible */}
        <Reveal className="mt-20 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[12px] font-semibold text-rose tracking-[0.02em]">المساعدة</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              أسئلة شائعة
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => {
              const open = openFaq === i
              return (
                <div
                  key={faq.q}
                  className="rounded-[16px] bg-white hairline shadow-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-right pressable-soft"
                    aria-expanded={open}
                  >
                    <span className="font-bold text-navy text-[14px] sm:text-[15px] tracking-[-0.01em]">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={springs.snappy}
                      className="shrink-0 w-8 h-8 rounded-full bg-rose-soft flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4 text-rose" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={springs.settle}
                        className="overflow-hidden"
                      >
                        <p className="px-4 sm:px-5 pb-5 text-sm text-muted leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* Bottom CTA */}
        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-[24px] min-h-[240px] flex items-center">
            <img
              src="/cta-background.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/35" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(232,160,176,0.2),transparent_55%)]" />

            <div className="relative w-full p-10 lg:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                جاهزة للانطلاق؟
              </h2>
              <p className="mt-2 text-white/70 max-w-md mx-auto text-sm sm:text-base">
                ابدئي مجاناً اليوم، وترقّي متى احتجتِ لمزيد من الظهور والفرص.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button to="/dashboard" variant="gold" size="lg" className="shadow-lg shadow-gold/25">
                  ابدئي مجاناً
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
                <Button
                  to="/partnerships"
                  variant="glass"
                  size="lg"
                  className="!text-white !border-white/25 !bg-white/10 hover:!bg-white/18"
                >
                  برامج الشراكة
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
