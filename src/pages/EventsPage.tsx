import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  CalendarDays,
  Sparkles,
  X,
  MapPin,
  ChevronLeft,
  Users,
} from 'lucide-react'
import { motion } from 'motion/react'
import EventCard from '../components/ui/EventCard'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { springs, useMotionSafe } from '../lib/motion'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import type { EventItem } from '../types/api'

function eventSortKey(e: EventItem) {
  return `${e.startsAt || ''}|${e.date || ''}|${e.time || ''}`
}

export default function EventsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { reduce } = useMotionSafe()

  const { data: eventsPayload, loading, error, reload } = useAsyncData(
    () => catalogApi.events({ limit: 100 }),
    [],
  )

  const events = eventsPayload?.data ?? []
  const total = eventsPayload?.meta?.total ?? events.length

  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category).filter(Boolean))],
    [events],
  )

  const filtered = useMemo(() => {
    const q = search.trim()
    return events
      .filter((e) => {
        const matchSearch =
          !q ||
          e.title.includes(q) ||
          e.location.includes(q) ||
          e.category.includes(q) ||
          (e.description || '').includes(q)
        const matchCat = !category || e.category === category
        return matchSearch && matchCat
      })
      .sort((a, b) => eventSortKey(a).localeCompare(eventSortKey(b)))
  }, [events, search, category])

  const hasFilters = !!(search.trim() || category)
  const showSpotlight = !hasFilters && filtered.length > 0
  const featured = showSpotlight ? filtered[0] : null
  const gridItems = showSpotlight ? filtered.slice(1) : filtered

  const clearFilters = () => {
    setSearch('')
    setCategory('')
  }

  const cities = useMemo(() => {
    const set = new Set(events.map((e) => e.location?.split(/[·,،]/)[0]?.trim()).filter(Boolean))
    return [...set].slice(0, 3)
  }, [events])

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.events.title}
        description={routeSeo.events.description}
        path={routeSeo.events.path}
        keywords={[...routeSeo.events.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'الفعاليات', path: '/events' },
        ])}
      />

      <section className="relative isolate overflow-hidden pt-28 pb-10 sm:pb-12">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
          <div className="hero-mesh absolute inset-0 opacity-80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[min(90vw,720px)] h-[420px] rounded-full bg-gradient-to-br from-rose/28 via-gold/12 to-mauve/18 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.settle}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-rose/25 shadow-xs mb-4">
              <CalendarDays className="w-3.5 h-3.5 text-rose" />
              الفعاليات
              <span className="text-muted font-medium">
                · {total.toLocaleString('ar-DZ')} قادمة
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.12] max-w-3xl">
              فعاليات{' '}
              <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
                تستحق الحضور
              </span>
            </h1>
            <p className="mt-3 text-lg text-muted max-w-2xl leading-relaxed">
              مؤتمرات وورش عمل وملتقيات مهنية — فلتري حسب التصنيف، واطّلعي على التفاصيل والتسجيل.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.slice(0, 4).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="rounded-full bg-white/80 hairline px-3 py-1 text-[11px] font-medium text-muted hover:text-navy hover:bg-blush/60 transition-colors pressable-soft"
                >
                  {c}
                </button>
              ))}
              {cities[0] && (
                <span className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-3 py-1 text-[11px] font-medium text-navy/70">
                  <MapPin className="w-3 h-3 text-gold" />
                  {cities[0]}
                  {cities.length > 1 ? ` +${cities.length - 1}` : ''}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button to="/membership" variant="gold" size="md">
                أولوية الحضور للعضوات
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
              <Button to="/community" variant="outline" size="md">
                <Users className="w-4 h-4 opacity-70" />
                المجتمع
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
                placeholder="ابحثي عن فعالية، مكان، أو تصنيف..."
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
                <span className="font-semibold text-navy tabular-nums">{filtered.length}</span> فعالية
                {category ? (
                  <span className="text-rose mr-1.5"> · {category}</span>
                ) : null}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-rose pressable-soft"
                >
                  <X className="w-3.5 h-3.5" />
                  مسح الكل
                </button>
              )}
            </div>

            {categories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                <CatPill
                  active={!category}
                  label="الكل"
                  onClick={() => setCategory('')}
                  layoutId={reduce ? undefined : 'event-cat-pill'}
                />
                {categories.map((c) => (
                  <CatPill
                    key={c}
                    active={category === c}
                    label={c}
                    onClick={() => setCategory(category === c ? '' : c)}
                    layoutId={reduce ? undefined : 'event-cat-pill'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}

        {!loading && !error && featured && (
          <Reveal className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <p className="text-[12px] font-semibold text-muted">الأقرب موعدًا</p>
            </div>
            <div className="relative">
              <span className="absolute top-4 left-4 z-10 rounded-full bg-gold text-navy text-[11px] font-bold px-3 py-1 shadow-sm ring-1 ring-gold-dark/20">
                مميزة
              </span>
              <EventCard event={featured} featured />
            </div>
          </Reveal>
        )}

        {!loading && !error && gridItems.length > 0 && (
          <>
            {showSpotlight && gridItems.length > 0 && (
              <p className="text-[12px] font-semibold text-muted mb-3 px-1">فعاليات أخرى</p>
            )}
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gridItems.map((e) => (
                <StaggerItem key={e.id}>
                  <EventCard event={e} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}

        {!loading && !error && filtered.length === 0 && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.settle}
            className="text-center py-16 px-6 rounded-[24px] bg-white hairline shadow-xs max-w-md mx-auto"
          >
            <div className="mx-auto w-14 h-14 rounded-[16px] bg-rose-soft flex items-center justify-center mb-4">
              <CalendarDays className="w-6 h-6 text-rose" />
            </div>
            <h2 className="text-lg font-bold text-navy tracking-[-0.01em]">
              {events.length === 0 ? 'لا توجد فعاليات منشورة' : 'لا توجد فعاليات مطابقة'}
            </h2>
            <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
              {events.length === 0
                ? 'تابعي الصفحة لاحقًا أو انضمي للمجتمع لمعرفة المواعيد القادمة.'
                : 'جرّبي كلمات مختلفة أو امسحي الفلاتر لعرض كل الفعاليات.'}
            </p>
            {hasFilters ? (
              <Button variant="outline" size="sm" className="mt-5" onClick={clearFilters}>
                مسح الفلاتر
              </Button>
            ) : (
              <Button to="/community" variant="gold" size="sm" className="mt-5">
                استكشفي المجتمع
              </Button>
            )}
          </motion.div>
        )}

        {!loading && !error && events.length > 0 && (
          <Reveal className="mt-14">
            <div className="rounded-[24px] bg-navy text-white overflow-hidden ring-1 ring-gold/25 relative">
              <div
                className="pointer-events-none absolute -top-20 left-0 w-64 h-64 bg-rose/20 blur-3xl"
                aria-hidden
              />
              <div className="relative px-6 py-10 sm:px-10 sm:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-center lg:text-right">
                <div className="max-w-lg mx-auto lg:mx-0">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-gold uppercase">
                    حضوريّة · Online
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-[1.65rem] font-extrabold tracking-[-0.02em]">
                    لا تفوّتي شبكة رائدة
                  </h2>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">
                    العضوات يحصلن على أولوية في التسجيل والدعوات الخاصة للورشات والملتقيات.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end shrink-0">
                  {featured || filtered[0] ? (
                    <Button
                      to={`/events/${(featured || filtered[0])!.id}`}
                      variant="gold"
                      size="md"
                    >
                      أقرب فعالية
                      <ChevronLeft className="w-4 h-4 opacity-70" />
                    </Button>
                  ) : null}
                  <Link
                    to="/membership"
                    className="inline-flex items-center justify-center h-11 px-5 rounded-full text-[13px] font-semibold text-white/85 ring-1 ring-white/20 hover:bg-white/10 transition-colors"
                  >
                    خطط العضوية
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}

function CatPill({
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
