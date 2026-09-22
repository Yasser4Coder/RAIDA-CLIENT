import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, ChevronLeft, CalendarClock, ExternalLink, X, BookmarkPlus } from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { opportunities as fallbackOpportunities } from '../data/platformContent'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { springs, useMotionSafe } from '../lib/motion'
import { safeHref } from '../lib/safe'
import { useAuth } from '../context/AuthContext'

const INTEREST_KEY = 'raida-opportunity-interest'

function readInterests(): string[] {
  try {
    const raw = localStorage.getItem(INTEREST_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function toggleInterest(id: string): string[] {
  const current = readInterests()
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
  localStorage.setItem(INTEREST_KEY, JSON.stringify(next))
  return next
}

export default function OpportunitiesPage() {
  const [type, setType] = useState('')
  const [interests, setInterests] = useState<string[]>(() =>
    typeof window !== 'undefined' ? readInterests() : [],
  )
  const { reduce } = useMotionSafe()
  const { user } = useAuth()
  const { data: apiOpportunities } = useAsyncData(() => catalogApi.opportunities(), [])

  const opportunities =
    apiOpportunities && apiOpportunities.length > 0 ? apiOpportunities : fallbackOpportunities

  const types = useMemo(
    () => [...new Set(opportunities.map((o) => o.type).filter(Boolean))],
    [opportunities],
  )

  const filtered = useMemo(
    () => opportunities.filter((o) => !type || o.type === type),
    [opportunities, type],
  )

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.opportunities.title}
        description={routeSeo.opportunities.description}
        path={routeSeo.opportunities.path}
        keywords={[...routeSeo.opportunities.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'الفرص', path: '/opportunities' },
        ])}
      />

      <section className="relative isolate overflow-hidden pt-28 pb-10 sm:pb-12">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
          <div className="hero-mesh absolute inset-0 opacity-80" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-gold/30 shadow-xs mb-4">
            <Trophy className="w-3.5 h-3.5 text-gold-dark" />
            الفرص
            <span className="text-muted font-medium">· {opportunities.length.toLocaleString('ar-DZ')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.15] max-w-3xl">
            تمويل · مسابقات · معارض · تدريب · شراكات
          </h1>
          <p className="mt-3 text-lg text-muted max-w-2xl leading-relaxed">
            سبب للعودة كل أسبوع: فرص حقيقية للعضوات والزائرات — سجّلي اهتمامكِ وتابعيها من لوحة التحكم.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button to={user ? '/dashboard' : '/dashboard'} variant="gold" size="md">
              {user ? 'لوحة التحكم' : 'انضمي لمتابعة الفرص'}
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Button>
            <Button to="/membership" variant="outline" size="md">
              أولوية للأعضاء
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="sticky top-[4.5rem] z-30 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="material rounded-[20px] shadow-md hairline p-3 sm:p-3.5">
            <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
              <p className="text-[13px] text-muted">
                <span className="font-semibold text-navy tabular-nums">{filtered.length}</span> فرصة
              </p>
              {type && (
                <button
                  type="button"
                  onClick={() => setType('')}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-rose pressable-soft"
                >
                  <X className="w-3.5 h-3.5" /> مسح الفلتر
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              <TypePill active={!type} label="الكل" onClick={() => setType('')} layoutId={reduce ? undefined : 'opp-type'} />
              {types.map((t) => (
                <TypePill
                  key={t}
                  active={type === t}
                  label={t}
                  onClick={() => setType(type === t ? '' : t)}
                  layoutId={reduce ? undefined : 'opp-type'}
                />
              ))}
            </div>
          </div>
        </div>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const href = safeHref(item.applyUrl || undefined)
            const interested = interests.includes(item.id)
            return (
              <StaggerItem key={item.id}>
                <article className="h-full rounded-[20px] bg-white hairline shadow-xs p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex rounded-full bg-navy text-gold px-2.5 py-1 text-[11px] font-bold">
                      {item.type}
                    </span>
                    {item.deadline && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                        <CalendarClock className="w-3.5 h-3.5" />
                        {item.deadline}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-extrabold text-navy text-lg leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{item.description}</p>
                  <div className="mt-5 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setInterests(toggleInterest(item.id))}
                      className={`h-10 rounded-[12px] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 pressable ${
                        interested
                          ? 'bg-navy text-white'
                          : 'bg-rose-soft/80 text-navy ring-1 ring-rose/20 hover:bg-blush'
                      }`}
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      {interested ? 'تم حفظ الاهتمام' : 'سجّلي اهتمامكِ'}
                    </button>
                    {href ? (
                      href.startsWith('/') ? (
                        <Button to={href} variant="outline" size="sm" className="w-full">
                          التفاصيل
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                      ) : (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="h-10 rounded-[12px] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 border border-navy/12 text-navy hover:bg-white"
                        >
                          رابط التقديم
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )
                    ) : (
                      <Button to="/dashboard" variant="soft" size="sm" className="w-full">
                        تابعي من حسابكِ
                      </Button>
                    )}
                  </div>
                </article>
              </StaggerItem>
            )
          })}
        </Stagger>

        {filtered.length === 0 && (
          <div className="rounded-[20px] bg-white hairline p-10 text-center">
            <p className="font-bold text-navy">لا توجد فرص في هذا التصنيف</p>
            <Button variant="soft" size="md" className="mt-4" onClick={() => setType('')}>
              عرض الكل
            </Button>
          </div>
        )}

        <Reveal className="mt-12 rounded-[22px] bg-navy text-white p-8 text-center">
          <h2 className="text-xl font-extrabold">عضوية رائدة تمنحكِ أولوية الفرص</h2>
          <p className="mt-2 text-sm text-white/65 max-w-md mx-auto">
            المعارض، التمويل، المسابقات، وSOS Store — أولوية للعضوات المعتمدات.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <Button to="/membership" variant="gold" size="md">
              اعرفي المزايا
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Button>
            <Link to="/dashboard" className="text-[13px] font-semibold text-gold self-center">
              الفرص المحفوظة في حسابكِ ←
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function TypePill({
  active,
  label,
  onClick,
  layoutId,
}: {
  active: boolean
  label: string
  onClick: () => void
  layoutId?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 h-9 px-4 rounded-full text-[13px] font-medium pressable cursor-pointer ${
        active ? 'text-white' : 'text-muted bg-white hairline hover:text-navy'
      }`}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-full bg-navy shadow-sm"
          transition={springs.snappy}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  )
}
