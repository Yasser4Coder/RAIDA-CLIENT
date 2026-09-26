import { useMemo, useState } from 'react'
import {
  GraduationCap,
  Search,
  ChevronLeft,
  X,
  Award,
  MessageSquare,
  BookOpen,
  Check,
} from 'lucide-react'
import { motion } from 'motion/react'
import ExpertSpotlightCard from '../components/ui/ExpertSpotlightCard'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import SafeImg from '../components/ui/SafeImg'
import SeoHead from '../components/seo/SeoHead'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { expertAccreditation, expertSpecialties } from '../data/platformContent'
import { mergeFeaturedExperts } from '../data/featuredExperts'
import { springs, useMotionSafe } from '../lib/motion'
import { RaidaMark } from '../components/ui/Logo'

const heroImage =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=900&fit=crop'

export default function ExpertsPage() {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const { reduce, fadeUp } = useMotionSafe()

  const { data, loading, error, reload } = useAsyncData(
    () => catalogApi.members({ limit: 100, plan: 'EXPERT' }),
    [],
  )

  const experts = useMemo(() => mergeFeaturedExperts(data?.data ?? []), [data?.data])

  const specialties = useMemo(() => {
    const fromData = [...new Set(experts.map((m) => m.specialty).filter(Boolean))]
    if (fromData.length > 0) return fromData.sort((a, b) => a.localeCompare(b, 'ar'))
    return expertSpecialties
  }, [experts])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return experts.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
      const matchSpecialty = !specialty || m.specialty === specialty || m.category === specialty
      return matchSearch && matchSpecialty
    })
  }, [experts, search, specialty])

  const hasFilters = !!(search || specialty)
  const clearFilters = () => {
    setSearch('')
    setSpecialty('')
  }

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.experts.title}
        description={routeSeo.experts.description}
        path={routeSeo.experts.path}
        keywords={[...routeSeo.experts.keywords]}
        image={heroImage}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'خبراء رائدة', path: '/experts' },
        ])}
      />

      {/* Full-bleed hero */}
      <section className="relative isolate min-h-[min(72vh,560px)] flex flex-col overflow-hidden">
        <SafeImg
          src={heroImage}
          fallback={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/65 to-navy/30" />
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
                  عضوية رائدة للمدربين والخبراء
                </span>
                {!loading && (
                  <span className="text-[12px] text-white/55 font-medium">
                    · {experts.length.toLocaleString('ar-DZ')} خبير
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-[-0.03em] leading-[1.12]">
                دليل الخبراء والمدربين
              </h1>
              <p className="mt-4 text-[16px] sm:text-lg text-white/75 leading-relaxed max-w-xl">
                ابحثي حسب التخصص، اطّلعي على الملفات المهنية، واطلبي استشارة مباشرة — تصل الطلبات إلى وارد الخبيرة في لوحتها.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/consultations" variant="gold" size="lg">
                  اطلب استشارة
                  <ChevronLeft className="w-4 h-4 opacity-80" />
                </Button>
                <Button
                  to="/membership"
                  variant="glass"
                  size="lg"
                  className="bg-white/10! text-white! border-white/25! hover:bg-white/18!"
                >
                  انضم كخبير
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Sticky filters */}
        <div className="sticky top-[4.5rem] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 -mt-2">
          <div className="material rounded-[20px] shadow-md hairline edge-highlight p-3 sm:p-3.5">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو التخصص أو المدينة..."
                className="w-full pr-11 pl-10 h-11 rounded-[14px] bg-white/85 border border-separator text-navy placeholder:text-muted/55 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15 transition-shadow"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted hover:bg-blush pressable"
                  aria-label="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 px-1">
            <p className="text-[13px] text-muted">
              <span className="font-semibold text-navy tabular-nums">{filtered.length}</span> خبير
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-rose hover:text-navy pressable-soft"
              >
                <X className="w-3.5 h-3.5" />
                مسح الفلاتر
              </button>
            )}
          </div>
        </div>

        {/* Specialty chips */}
        <div className="flex gap-2 overflow-x-auto pb-5 -mx-1 px-1 scrollbar-hide">
          <button
            type="button"
            onClick={() => setSpecialty('')}
            className={`relative shrink-0 h-9 px-4 rounded-full text-[13px] font-medium pressable cursor-pointer ${
              !specialty ? 'text-white' : 'text-muted bg-white hairline hover:text-navy'
            }`}
          >
            {!specialty && (
              <motion.span
                layoutId={reduce ? undefined : 'expert-specialty-pill'}
                className="absolute inset-0 rounded-full bg-navy shadow-sm"
                transition={springs.snappy}
              />
            )}
            <span className="relative z-10">الكل</span>
          </button>
          {specialties.map((s) => {
            const active = specialty === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSpecialty(active ? '' : s)}
                className={`relative shrink-0 h-9 px-4 rounded-full text-[13px] font-medium pressable cursor-pointer max-w-[220px] truncate ${
                  active ? 'text-white' : 'text-muted bg-white hairline hover:text-navy'
                }`}
                title={s}
              >
                {active && (
                  <motion.span
                    layoutId={reduce ? undefined : 'expert-specialty-pill'}
                    className="absolute inset-0 rounded-full bg-navy shadow-sm"
                    transition={springs.snappy}
                  />
                )}
                <span className="relative z-10 truncate">{s}</span>
              </button>
            )
          })}
        </div>

        {/* Directory */}
        {loading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock message={error} onRetry={reload} />
        ) : filtered.length === 0 ? (
          <div className="rounded-[22px] bg-white hairline p-10 sm:p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-[16px] bg-navy/5 ring-1 ring-navy/8 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-navy/50" />
            </div>
            <p className="text-navy font-extrabold text-lg">
              {hasFilters ? 'لا نتائج مطابقة' : 'لا يوجد خبراء معتمدون للعرض بعد'}
            </p>
            <p className="mt-2 text-sm text-muted max-w-sm mx-auto leading-relaxed">
              {hasFilters
                ? 'جرّب كلمات بحث أخرى أو امسح الفلاتر.'
                : 'سيظهر هنا أعضاء عضوية المدربين والخبراء بعد الموافقة.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              {hasFilters ? (
                <Button variant="soft" size="md" onClick={clearFilters}>
                  مسح الفلاتر
                </Button>
              ) : (
                <Button to="/members" variant="soft" size="md">
                  تصفح دليل الأعضاء
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((m) => (
              <StaggerItem key={m.id}>
                <ExpertSpotlightCard member={m} tone="light" />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {/* Accreditation */}
        <Reveal className="mt-20 sm:mt-28">
          <section>
            <div className="max-w-2xl mb-10">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                الاعتماد المهني
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
                خبير · مدرب · مستشار
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                العضوية تمنحك الظهور في الدليل. تقديم برامج أو استشارات باسم رائدة يتطلب اعتمادًا مهنيًا منفصلًا.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
              {expertAccreditation.map((card, i) => {
                const Icon = i === 0 ? Award : i === 1 ? BookOpen : MessageSquare
                return (
                  <article
                    key={card.title}
                    className={`relative flex flex-col rounded-[22px] p-6 sm:p-7 ${
                      i === 0
                        ? 'bg-navy text-white ring-1 ring-gold/25 shadow-sm'
                        : 'bg-white hairline shadow-xs'
                    }`}
                  >
                    {i === 0 && (
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-l from-gold via-rose/80 to-transparent rounded-t-[22px]" />
                    )}
                    <div
                      className={`w-11 h-11 rounded-[13px] flex items-center justify-center ${
                        i === 0 ? 'bg-gold/15 text-gold' : 'bg-navy/[0.04] text-navy ring-1 ring-navy/8'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3
                      className={`mt-4 text-lg font-extrabold tracking-[-0.01em] ${
                        i === 0 ? 'text-white' : 'text-navy'
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p className={`mt-2 font-bold text-sm ${i === 0 ? 'text-gold' : 'text-gold-dark'}`}>
                      {card.price}
                    </p>
                    {card.original ? (
                      <p className={`text-[12px] line-through ${i === 0 ? 'text-white/40' : 'text-muted'}`}>
                        {card.original}
                      </p>
                    ) : null}
                    <p className={`mt-3 text-[13px] leading-relaxed ${i === 0 ? 'text-white/60' : 'text-muted'}`}>
                      {card.note}
                    </p>
                    <ul className="mt-5 space-y-2.5 flex-1">
                      {card.points.map((p) => (
                        <li
                          key={p}
                          className={`flex gap-2.5 text-[13px] leading-snug ${
                            i === 0 ? 'text-white/85' : 'text-navy/80'
                          }`}
                        >
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${i === 0 ? 'text-gold' : 'text-rose'}`}
                            strokeWidth={2.5}
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button to="/membership" variant="gold" size="md">
                اطلب عضوية خبير
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
              <Button to="/services" variant="outline" size="md">
                دليل الخدمات
              </Button>
            </div>
          </section>
        </Reveal>

        {/* Closing CTA */}
        <Reveal className="mt-16 sm:mt-20">
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
                هل أنت خبير؟
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] leading-tight">
                انضم إلى دليل خبراء رائدة
              </h2>
              <p className="mt-3 text-white/65 leading-relaxed">
                ظهور مهني، وصول لروّاد ورائدات الأعمال، وفرص تدريب واستشارات داخل المجتمع.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/membership" variant="gold" size="lg">
                  انضم كخبير
                  <ChevronLeft className="w-4 h-4 opacity-80" />
                </Button>
                <Button
                  to="/consultations"
                  variant="outline"
                  size="lg"
                  className="border-white/25! text-white! hover:bg-white/10!"
                >
                  اطلب استشارة
                </Button>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}
