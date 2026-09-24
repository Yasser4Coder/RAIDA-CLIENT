import { useRef } from 'react'
import {
  MessageSquare,
  ChevronLeft,
  Sparkles,
  UserRound,
  Clock,
  Video,
  Wallet,
  Inbox,
  ArrowLeft,
} from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import ConsultationRequestForm from '../components/ui/ConsultationRequestForm'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SafeImg from '../components/ui/SafeImg'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { CONSULTATION_FIELDS, CONSULTATION_TYPES } from '../data/consultationFields'
import { springs, useMotionSafe } from '../lib/motion'
import { RaidaMark } from '../components/ui/Logo'

const heroImage =
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&h=900&fit=crop'

const processSteps = [
  {
    step: '01',
    title: 'اختاري المجال',
    body: 'حدّدي التخصص الذي تحتاجين دعمًا فيه.',
    icon: Sparkles,
  },
  {
    step: '02',
    title: 'رائدة أو خبيرة',
    body: 'أرسلي الطلب لإدارة رائدة أو لخبيرة محددة.',
    icon: UserRound,
  },
  {
    step: '03',
    title: 'الوقت والوضع',
    body: 'اختاري الموعد المفضّل: Online أو حضوري.',
    icon: Clock,
  },
  {
    step: '04',
    title: 'التأكيد والجلسة',
    body: 'بعد التأكيد والدفع عند الحاجة تُعقد الجلسة.',
    icon: Video,
  },
]

export default function ConsultationsPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const { fadeUp } = useMotionSafe()

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.consultations.title}
        description={routeSeo.consultations.description}
        path={routeSeo.consultations.path}
        keywords={[...routeSeo.consultations.keywords]}
        image={heroImage}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'الاستشارات', path: '/consultations' },
        ])}
      />

      {/* Full-bleed hero */}
      <section className="relative isolate min-h-[min(78vh,600px)] flex flex-col overflow-hidden">
        <SafeImg
          src={heroImage}
          fallback={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/35" />
        <div className="absolute inset-0 bg-gradient-to-l from-gold/20 via-transparent to-rose/15 mix-blend-soft-light" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-ivory to-transparent" />

        <div className="relative z-10 flex-1 flex flex-col justify-end pt-28 pb-14 sm:pb-16">
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
                  الاستشارات
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-[-0.03em] leading-[1.12]">
                احصلي على استشارة من رائدة أو خبيرة
              </h1>
              <p className="mt-4 text-[16px] sm:text-lg text-white/75 leading-relaxed max-w-xl">
                مسار واضح: المجال → الخبيرة أو الإدارة → الوقت → Online أو حضوري → التأكيد والجلسة.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button variant="gold" size="lg" onClick={scrollToForm}>
                  ابدئي طلب الاستشارة
                  <ChevronLeft className="w-4 h-4 opacity-80" />
                </Button>
                <Button
                  to="/experts"
                  variant="glass"
                  size="lg"
                  className="bg-white/10! text-white! border-white/25! hover:bg-white/18!"
                >
                  تصفح الخبراء
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16 sm:space-y-24">
        {/* Process */}
        <Reveal>
          <section className="pt-2">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
              كيف يعمل؟
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] max-w-xl leading-tight">
              أربع خطوات بسيطة
            </h2>

            <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {processSteps.map((item) => {
                const Icon = item.icon
                return (
                  <StaggerItem key={item.step}>
                    <div className="relative h-full rounded-[20px] bg-white hairline shadow-xs p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="w-10 h-10 rounded-[12px] bg-navy text-gold flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.14em] text-gold-dark tabular-nums">
                          {item.step}
                        </span>
                      </div>
                      <h3 className="mt-4 font-extrabold text-navy tracking-[-0.01em]">{item.title}</h3>
                      <p className="mt-1.5 text-[13px] text-muted leading-relaxed">{item.body}</p>
                    </div>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </section>
        </Reveal>

        {/* Form + aside */}
        <section
          ref={formRef}
          id="request"
          className="scroll-mt-28 grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-10"
        >
          <Reveal>
            <div className="rounded-[24px] bg-white hairline shadow-sm overflow-hidden">
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-navy/[0.06]">
                <div className="flex items-start gap-3">
                  <span className="w-11 h-11 rounded-[13px] bg-navy/[0.04] ring-1 ring-navy/8 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-navy" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-extrabold text-navy tracking-[-0.02em]">
                      طلب استشارة
                    </h2>
                    <p className="mt-1.5 text-sm text-muted leading-relaxed">
                      أرسلي الطلب إلى{' '}
                      <span className="font-semibold text-navy">إدارة رائدة</span> أو إلى خبيرة
                      محددة من الشبكة.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <ConsultationRequestForm target="choose" />
              </div>
            </div>
          </Reveal>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={1}>
              <div className="rounded-[20px] bg-navy text-white p-5 sm:p-6 ring-1 ring-gold/20">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-gold/80 uppercase">
                  بعد الإرسال
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    { icon: Inbox, text: 'يظهر الطلب في صندوق استشاراتكِ إن كنتِ مسجّلة' },
                    { icon: Wallet, text: 'تأكيد الموعد والدفع عند الاقتضاء' },
                    { icon: Video, text: 'عقد الجلسة Online أو حضوريًا' },
                  ].map((row) => {
                    const Icon = row.icon
                    return (
                      <li key={row.text} className="flex gap-3 text-[13px] text-white/80 leading-snug">
                        <span className="w-8 h-8 rounded-[10px] bg-white/8 flex items-center justify-center shrink-0 text-gold">
                          <Icon className="w-4 h-4" />
                        </span>
                        {row.text}
                      </li>
                    )
                  })}
                </ul>
                <Button to="/dashboard" variant="gold" size="md" className="w-full mt-6">
                  صندوق استشاراتكِ
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="rounded-[20px] bg-white hairline shadow-xs p-5">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                  مجالات شائعة
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CONSULTATION_FIELDS.slice(0, 6).map((f) => (
                    <span
                      key={f}
                      className="inline-flex rounded-full bg-ivory px-3 py-1.5 text-[11px] font-medium text-navy ring-1 ring-navy/8"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={3}>
              <div className="rounded-[20px] bg-white hairline shadow-xs p-5">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                  أنواع الجلسات
                </p>
                <ul className="mt-3 space-y-2">
                  {CONSULTATION_TYPES.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-[13px] text-navy font-medium">
                      <ArrowLeft className="w-3.5 h-3.5 text-gold-dark rotate-180 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
                <Button to="/experts" variant="outline" size="sm" className="w-full mt-5">
                  دليل الخبراء
                </Button>
              </div>
            </Reveal>
          </aside>
        </section>

        {/* Closing note */}
        <Reveal>
          <section className="relative overflow-hidden rounded-[28px] bg-white hairline px-6 py-10 sm:px-10 sm:py-12">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-l from-gold via-rose/70 to-transparent" />
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                ملاحظة
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
                عمولة رائدة تُطبَّق وفق سياسة المنصة
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                الاستشارات عبر إدارة رائدة أو الخبيرات المعتمدات تمر عبر مسار تأكيد واضح. إن لم تكوني
                متأكدة من التخصص، ابدئي بطلب إلى إدارة رائدة وسنوجّهكِ.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button variant="gold" size="md" onClick={scrollToForm}>
                  املئي الطلب الآن
                </Button>
                <Button to="/membership" variant="outline" size="md">
                  عضوية المستشارات
                </Button>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}
