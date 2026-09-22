import { useMemo, useRef, useState } from 'react'
import {
  BookOpen,
  ChevronLeft,
  X,
  GraduationCap,
  Clock,
  Users,
  Sparkles,
  Calendar,
} from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SafeImg from '../components/ui/SafeImg'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import {
  annualPrograms as fallbackAnnual,
  programOutcomes,
  samplePrograms as fallbackSpecialized,
  specializedProgramFields,
} from '../data/platformContent'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { springs, useMotionSafe } from '../lib/motion'
import { RaidaMark } from '../components/ui/Logo'

const heroImage =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=900&fit=crop'

export default function ProgramsPage() {
  const [field, setField] = useState('')
  const [month, setMonth] = useState('')
  const calendarRef = useRef<HTMLElement>(null)
  const { reduce, fadeUp } = useMotionSafe()
  const { data: apiPrograms } = useAsyncData(() => catalogApi.programs(), [])

  const annualPrograms = useMemo(() => {
    const fromApi = (apiPrograms ?? []).filter((p) => p.kind === 'annual')
    if (fromApi.length) {
      return fromApi.map((p) => ({
        id: p.id,
        number: p.number || '',
        title: p.title,
        description: p.description || '',
      }))
    }
    return fallbackAnnual
  }, [apiPrograms])

  const specialized = useMemo(() => {
    const fromApi = (apiPrograms ?? []).filter((p) => p.kind === 'specialized')
    if (fromApi.length) {
      return fromApi.map((p) => ({
        id: p.id,
        title: p.title,
        trainer: p.trainer || 'خبيرة رائدة',
        duration: p.duration || '',
        mode: p.mode || 'Online',
        level: p.level || '',
        memberPrice: p.memberPrice || 'مجاني للأعضاء',
        publicPrice: p.publicPrice || '',
        field: p.field || '',
        month: p.month || '',
      }))
    }
    return fallbackSpecialized
  }, [apiPrograms])

  const months = useMemo(
    () => [...new Set(specialized.map((p) => p.month).filter(Boolean))],
    [specialized],
  )

  const fields = useMemo(() => {
    const fromData = [...new Set(specialized.map((p) => p.field).filter(Boolean))]
    return fromData.length ? fromData : specializedProgramFields
  }, [specialized])

  const filtered = specialized.filter((p) => {
    if (field && p.field !== field) return false
    if (month && p.month !== month) return false
    return true
  })

  const hasFilters = !!(field || month)
  const clearFilters = () => {
    setField('')
    setMonth('')
  }

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.programs.title}
        description={routeSeo.programs.description}
        path={routeSeo.programs.path}
        keywords={[...routeSeo.programs.keywords]}
        image={heroImage}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'برامج رائدة', path: '/programs' },
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
                  برامج رائدة
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-[-0.03em] leading-[1.12]">
                أكاديمية رقمية للنمو المهني
              </h1>
              <p className="mt-4 text-[16px] sm:text-lg text-white/75 leading-relaxed max-w-xl">
                برامج سنوية ومتخصصة لرائدات الأعمال — الأعضاء يستفيدون من 4 دورات Online مجانية كل سنة.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/membership" variant="gold" size="lg">
                  انضمي واستفيدي مجانًا
                  <ChevronLeft className="w-4 h-4 opacity-80" />
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  className="bg-white/10! text-white! border-white/25! hover:bg-white/18!"
                  onClick={scrollToCalendar}
                >
                  التقويم والبرامج
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-20 sm:space-y-28">
        {/* Outcomes */}
        <Reveal>
          <section className="pt-2">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
              ماذا تكسبين؟
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] max-w-xl leading-tight">
              تعلّم يتحول إلى فرصة
            </h2>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {programOutcomes.map((o) => (
                <span
                  key={o}
                  className="inline-flex items-center gap-2 rounded-full bg-white hairline px-4 py-2.5 text-[13px] font-semibold text-navy shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                  {o}
                </span>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Annual programs */}
        <Reveal>
          <section>
            <div className="max-w-2xl mb-10">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                البرنامج السنوي
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
                4 دورات مجانية للأعضاء كل سنة
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                مسار أساسي يغطي مهارات العمل والنمو داخل مجتمع رائدة.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {annualPrograms.map((p, i) => (
                <article
                  key={p.id}
                  className={`relative flex flex-col rounded-[22px] p-6 ${
                    i === 0
                      ? 'bg-navy text-white ring-1 ring-gold/25 shadow-sm sm:col-span-2 lg:col-span-1'
                      : 'bg-white hairline shadow-xs'
                  }`}
                >
                  {i === 0 && (
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-l from-gold via-rose/80 to-transparent rounded-t-[22px]" />
                  )}
                  <span
                    className={`text-[11px] font-bold tracking-[0.14em] tabular-nums ${
                      i === 0 ? 'text-gold' : 'text-gold-dark'
                    }`}
                  >
                    {p.number || String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className={`mt-3 text-lg font-extrabold leading-snug tracking-[-0.01em] ${
                      i === 0 ? 'text-white' : 'text-navy'
                    }`}
                  >
                    {p.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed flex-1 ${
                      i === 0 ? 'text-white/65' : 'text-muted'
                    }`}
                  >
                    {p.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Specialized calendar */}
        <section ref={calendarRef} id="calendar" className="scroll-mt-28">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                  برامج متخصصة
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
                  التقويم والبرامج القادمة
                </h2>
              </div>
              <p className="text-[13px] text-muted">
                <span className="font-semibold text-navy tabular-nums">{filtered.length}</span> برنامج
              </p>
            </div>
          </Reveal>

          {/* Filters */}
          <div className="sticky top-[4.5rem] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mb-5">
            <div className="material rounded-[20px] shadow-md hairline edge-highlight p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between gap-3 px-0.5">
                <p className="text-[12px] font-semibold text-navy flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                  صفّي حسب المجال والشهر
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-rose hover:text-navy pressable-soft"
                  >
                    <X className="w-3.5 h-3.5" />
                    مسح
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-0.5 px-0.5">
                <FilterPill
                  active={!field}
                  label="كل المجالات"
                  layoutId={reduce ? undefined : 'program-field-pill'}
                  onClick={() => setField('')}
                />
                {fields.map((f) => (
                  <FilterPill
                    key={f}
                    active={field === f}
                    label={f}
                    layoutId={reduce ? undefined : 'program-field-pill'}
                    onClick={() => setField(field === f ? '' : f)}
                  />
                ))}
              </div>

              {months.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide -mx-0.5 px-0.5">
                  <FilterPill
                    active={!month}
                    label="كل الأشهر"
                    layoutId={reduce ? undefined : 'program-month-pill'}
                    onClick={() => setMonth('')}
                    soft
                  />
                  {months.map((m) => (
                    <FilterPill
                      key={m}
                      active={month === m}
                      label={m}
                      layoutId={reduce ? undefined : 'program-month-pill'}
                      onClick={() => setMonth(month === m ? '' : m)}
                      soft
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[22px] bg-white hairline p-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-[16px] bg-navy/5 ring-1 ring-navy/8 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-navy/50" />
              </div>
              <p className="text-navy font-extrabold text-lg">لا توجد برامج مطابقة</p>
              <p className="mt-2 text-sm text-muted">جرّبي مجالًا أو شهرًا آخر، أو امسحي الفلاتر.</p>
              {hasFilters && (
                <Button variant="soft" size="md" className="mt-5" onClick={clearFilters}>
                  مسح الفلاتر
                </Button>
              )}
            </div>
          ) : (
            <Stagger className="grid md:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <StaggerItem key={p.id}>
                  <article className="group h-full rounded-[22px] bg-white hairline shadow-xs p-6 flex flex-col hover:shadow-sm transition-shadow">
                    <div className="flex flex-wrap gap-2">
                      {p.field && (
                        <span className="rounded-full bg-navy text-gold px-2.5 py-1 text-[11px] font-semibold">
                          {p.field}
                        </span>
                      )}
                      {p.month && (
                        <span className="rounded-full bg-ivory ring-1 ring-navy/8 px-2.5 py-1 text-[11px] font-medium text-muted">
                          {p.month}
                        </span>
                      )}
                      {p.mode && (
                        <span className="rounded-full bg-ivory ring-1 ring-navy/8 px-2.5 py-1 text-[11px] font-medium text-muted">
                          {p.mode}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-extrabold text-navy tracking-[-0.02em] leading-snug group-hover:text-navy-light transition-colors">
                      {p.title}
                    </h3>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-[13px]">
                      <MetaItem icon={Users} label="المدربة" value={p.trainer} />
                      <MetaItem icon={Clock} label="المدة" value={p.duration || '—'} />
                      <MetaItem icon={GraduationCap} label="المستوى" value={p.level || '—'} />
                      <MetaItem icon={Sparkles} label="للأعضاء" value={p.memberPrice} accent />
                    </div>

                    <div className="mt-auto pt-5 flex gap-2 border-t border-separator/80">
                      <Button to="/membership" variant="primary" size="sm" className="flex-1">
                        سجّلي كعضوة
                      </Button>
                      <Button to="/dashboard" variant="soft" size="sm" className="flex-1">
                        حساب مجاني
                      </Button>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>

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
                جاهزة للتعلّم؟
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] leading-tight">
                4 دورات مجانية وانتظار أقل للبرامج المتخصصة
              </h2>
              <p className="mt-3 text-white/65 leading-relaxed">
                انضمي إلى عضوية رائدة، واستفيدي من المسار السنوي وأولوية البرامج القادمة.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/membership" variant="gold" size="lg">
                  انضمي الآن
                  <ChevronLeft className="w-4 h-4 opacity-80" />
                </Button>
                <Button
                  to="/experts"
                  variant="outline"
                  size="lg"
                  className="border-white/25! text-white! hover:bg-white/10!"
                >
                  تعرّفي على المدربات
                </Button>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}

function FilterPill({
  active,
  label,
  onClick,
  layoutId,
  soft = false,
}: {
  active: boolean
  label: string
  onClick: () => void
  layoutId?: string
  soft?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 h-9 px-4 rounded-full text-[13px] font-medium pressable cursor-pointer max-w-[200px] truncate ${
        active ? 'text-white' : soft ? 'text-muted bg-ivory ring-1 ring-navy/8 hover:text-navy' : 'text-muted bg-white hairline hover:text-navy'
      }`}
      title={label}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-full bg-navy shadow-sm"
          transition={springs.snappy}
        />
      )}
      <span className="relative z-10 truncate">{label}</span>
    </button>
  )
}

function MetaItem({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: typeof Users
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <span className="mt-0.5 w-7 h-7 rounded-[8px] bg-navy/[0.04] ring-1 ring-navy/8 flex items-center justify-center shrink-0">
        <Icon className={`w-3.5 h-3.5 ${accent ? 'text-gold-dark' : 'text-navy/60'}`} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted">{label}</p>
        <p className={`font-semibold truncate ${accent ? 'text-rose' : 'text-navy'}`}>{value}</p>
      </div>
    </div>
  )
}
