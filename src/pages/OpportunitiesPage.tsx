import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy,
  ChevronLeft,
  X,
  Search,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import OpportunityCard from '../components/ui/OpportunityCard'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { opportunities as fallbackOpportunities } from '../data/platformContent'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { springs, useMotionSafe } from '../lib/motion'
import { useAuth } from '../context/AuthContext'
import type { CmsOpportunity } from '../types/api'

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

function deadlineSort(a: CmsOpportunity, b: CmsOpportunity) {
  if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline)
  if (a.deadline) return -1
  if (b.deadline) return 1
  return 0
}

export default function OpportunitiesPage() {
  const [type, setType] = useState('')
  const [search, setSearch] = useState('')
  const [interests, setInterests] = useState<string[]>(() =>
    typeof window !== 'undefined' ? readInterests() : [],
  )
  const { reduce } = useMotionSafe()
  const { user } = useAuth()
  const {
    data: apiOpportunities,
    loading,
    error,
    reload,
  } = useAsyncData(() => catalogApi.opportunities(), [])

  const opportunities =
    apiOpportunities && apiOpportunities.length > 0 ? apiOpportunities : fallbackOpportunities

  const types = useMemo(
    () => [...new Set(opportunities.map((o) => o.type).filter(Boolean))],
    [opportunities],
  )

  const hasFilters = !!(type || search.trim())

  const filtered = useMemo(() => {
    const q = search.trim()
    return opportunities
      .filter((o) => {
        const matchType = !type || o.type === type
        const matchSearch =
          !q ||
          o.title.includes(q) ||
          o.description.includes(q) ||
          o.type.includes(q)
        return matchType && matchSearch
      })
      .sort(deadlineSort)
  }, [opportunities, type, search])

  const showSpotlight = !hasFilters && filtered.length > 0
  const spotlight = showSpotlight ? filtered[0] : null
  const gridItems = showSpotlight ? filtered.slice(1) : filtered

  const savedInView = filtered.filter((o) => interests.includes(o.id)).length

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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[min(90vw,720px)] h-[420px] rounded-full bg-gradient-to-br from-gold/20 via-rose/15 to-mauve/15 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.settle}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-gold/30 shadow-xs mb-4">
              <Trophy className="w-3.5 h-3.5 text-gold-dark" />
              الفرص
              <span className="text-muted font-medium">
                · {opportunities.length.toLocaleString('ar-DZ')}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.12] max-w-3xl">
              فرص{' '}
              <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
                تستحق المتابعة
              </span>
            </h1>
            <p className="mt-3 text-lg text-muted max-w-2xl leading-relaxed">
              تمويل، مسابقات، معارض، تدريب، وشراكات — فلتري، سجّلي اهتمامكِ، وتابعي من لوحة التحكم.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {interests.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-navy text-gold px-3.5 py-1.5 text-[12px] font-semibold">
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  {interests.length.toLocaleString('ar-DZ')} محفوظة
                </span>
              )}
              {types.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/80 hairline px-3 py-1 text-[11px] font-medium text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button to="/dashboard" variant="gold" size="md">
                {user ? 'فرصي في لوحة التحكم' : 'انضمي لمتابعة الفرص'}
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
              <Button to="/membership" variant="outline" size="md">
                أولوية للعضوات
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="sticky top-[4.5rem] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          <div className="material rounded-[20px] shadow-md hairline p-3 sm:p-3.5 space-y-3">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحثي عن فرصة، نوع، أو كلمة مفتاحية..."
                className="w-full pr-11 pl-10 h-11 rounded-[14px] bg-white/85 border border-separator text-navy placeholder:text-muted/55 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15"
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

            <div className="flex items-center justify-between gap-3 px-0.5">
              <p className="text-[13px] text-muted">
                <span className="font-semibold text-navy tabular-nums">{filtered.length}</span> فرصة
                {savedInView > 0 && (
                  <span className="text-rose mr-2">
                    · {savedInView} محفوظة في هذه القائمة
                  </span>
                )}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setType('')
                    setSearch('')
                  }}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-rose pressable-soft"
                >
                  <X className="w-3.5 h-3.5" />
                  مسح الكل
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

        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}

        {!loading && !error && spotlight && (
          <Reveal className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <p className="text-[12px] font-semibold text-muted">فرصة مميزة</p>
            </div>
            <OpportunityCard
              item={spotlight}
              featured
              interested={interests.includes(spotlight.id)}
              onToggleInterest={() => setInterests(toggleInterest(spotlight.id))}
            />
          </Reveal>
        )}

        {!loading && !error && gridItems.length > 0 && (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridItems.map((item) => (
              <StaggerItem key={item.id}>
                <OpportunityCard
                  item={item}
                  interested={interests.includes(item.id)}
                  onToggleInterest={() => setInterests(toggleInterest(item.id))}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-[22px] bg-white hairline p-10 text-center max-w-md mx-auto">
            <Trophy className="w-10 h-10 text-gold mx-auto mb-3 opacity-80" />
            <p className="font-bold text-navy">لا توجد فرص مطابقة</p>
            <p className="mt-2 text-sm text-muted">جرّبي تصنيفًا آخر أو امسحي البحث.</p>
            <Button variant="soft" size="md" className="mt-5" onClick={() => { setType(''); setSearch('') }}>
              عرض كل الفرص
            </Button>
          </div>
        )}

        <Reveal className="mt-14">
          <div className="rounded-[24px] bg-navy text-white overflow-hidden ring-1 ring-gold/25 relative">
            <div
              className="pointer-events-none absolute -top-20 right-0 w-64 h-64 bg-rose/20 blur-3xl"
              aria-hidden
            />
            <div className="relative px-6 py-10 sm:px-10 sm:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-center lg:text-right">
              <div className="max-w-lg mx-auto lg:mx-0">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-gold uppercase">
                  العضوية المهنية
                </p>
                <h2 className="mt-2 text-2xl sm:text-[1.65rem] font-extrabold tracking-[-0.02em]">
                  أولوية في الفرص والدعوات
                </h2>
                <p className="mt-2 text-sm text-white/65 leading-relaxed">
                  المعارض، التمويل، المسابقات، وSOS Store — العضوات المعتمدات يصلهن أولًا.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end shrink-0">
                <Button to="/membership" variant="gold" size="md">
                  خطط العضوية
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center h-11 px-5 rounded-full text-[13px] font-semibold text-white/85 ring-1 ring-white/20 hover:bg-white/10 transition-colors"
                >
                  الفرص المحفوظة
                </Link>
              </div>
            </div>
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
