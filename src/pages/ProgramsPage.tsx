import { useMemo, useState } from 'react'
import { BookOpen, ChevronLeft, Filter } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
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

export default function ProgramsPage() {
  const [field, setField] = useState('')
  const [month, setMonth] = useState('')
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

  const months = useMemo(() => [...new Set(specialized.map((p) => p.month).filter(Boolean))], [specialized])

  const filtered = specialized.filter((p) => {
    if (field && p.field !== field) return false
    if (month && p.month !== month) return false
    return true
  })

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.programs.title}
        description={routeSeo.programs.description}
        path={routeSeo.programs.path}
        keywords={[...routeSeo.programs.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'برامج رائدة', path: '/programs' },
        ])}
      />

      <PageHero
        eyebrow="برامج رائدة"
        icon={<BookOpen className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            أكاديمية رقمية —{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              تعلّم · تطبيق · فرص
            </span>
          </>
        }
        description="برامج تدريبية سنوية ومتخصصة لرائدات الأعمال. الأعضاء يستفيدون من 4 دورات Online مجانية سنويًا."
      >
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {programOutcomes.map((o) => (
            <span
              key={o}
              className="rounded-full bg-white/80 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-navy/8"
            >
              {o}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/membership" variant="gold" size="lg">
            انضمي واستفيدي مجانًا
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
          <Button to="/experts" variant="outline" size="lg">
            تعرّفي على المدربات
          </Button>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        <Reveal>
          <div className="text-center mb-8">
            <p className="text-[12px] font-semibold text-rose">البرنامج السنوي</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-navy">
              4 دورات مجانية للأعضاء كل سنة
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {annualPrograms.map((p) => (
              <article key={p.id} className="rounded-[20px] bg-white hairline shadow-xs p-6">
                <span className="text-[11px] font-bold text-gold-dark">{p.number}</span>
                <h3 className="mt-2 font-extrabold text-navy text-lg leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{p.description}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-[12px] font-semibold text-rose">برامج متخصصة</p>
              <h2 className="mt-1 text-2xl font-extrabold text-navy">التقويم والبرامج القادمة</h2>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 text-muted" />
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="h-10 rounded-[12px] border border-separator bg-white px-3 text-sm"
              >
                <option value="">كل المجالات</option>
                {specializedProgramFields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-10 rounded-[12px] border border-separator bg-white px-3 text-sm"
              >
                <option value="">كل الأشهر</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Stagger className="grid md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <StaggerItem key={p.id}>
                <article className="rounded-[20px] bg-white hairline shadow-xs p-6 flex flex-col h-full">
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                    {p.field && <span className="rounded-full bg-rose-soft px-2.5 py-1 text-rose">{p.field}</span>}
                    {p.month && <span className="rounded-full bg-navy/[0.04] px-2.5 py-1 text-muted">{p.month}</span>}
                    {p.mode && <span className="rounded-full bg-navy/[0.04] px-2.5 py-1 text-muted">{p.mode}</span>}
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold text-navy">{p.title}</h3>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <dt className="text-muted">المدربة</dt>
                      <dd className="font-medium text-navy">{p.trainer}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">المدة</dt>
                      <dd className="font-medium text-navy">{p.duration}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">المستوى</dt>
                      <dd className="font-medium text-navy">{p.level}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">للأعضاء</dt>
                      <dd className="font-medium text-rose">{p.memberPrice}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 pt-4 border-t border-separator flex gap-2">
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
        </section>

        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] bg-navy p-10 lg:p-12 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(232,160,176,0.25),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold">جاهزة للتعلّم والنمو؟</h2>
              <p className="mt-2 text-white/70 max-w-md mx-auto text-sm">
                انضمي إلى عضوية رائدة واستفيدي من 4 دورات مجانية سنويًا وأولوية البرامج المتخصصة.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button to="/membership" variant="gold" size="lg">
                  انضمي الآن
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
                <Button
                  to="/partnerships"
                  variant="glass"
                  size="lg"
                  className="!text-white !border-white/25 !bg-white/10"
                >
                  شراكة مع البرامج
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
