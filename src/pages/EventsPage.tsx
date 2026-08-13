import { useMemo, useState } from 'react'
import { Search, CalendarDays, Sparkles, X } from 'lucide-react'
import { motion } from 'motion/react'
import EventCard from '../components/ui/EventCard'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { springs, useMotionSafe } from '../lib/motion'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'

export default function EventsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { reduce } = useMotionSafe()

  const filtersKey = `${search}|${category}`

  const { data: eventsPayload, loading, error, reload } = useAsyncData(
    () =>
      catalogApi.events({
        limit: 100,
        search: search.trim() || undefined,
        category: category || undefined,
      }),
    [filtersKey],
  )

  const events = eventsPayload?.data ?? []

  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category).filter(Boolean))],
    [events],
  )

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const q = search.trim()
      const matchSearch =
        !q || e.title.includes(q) || e.location.includes(q) || e.category.includes(q)
      const matchCat = !category || e.category === category
      return matchSearch && matchCat
    })
  }, [events, search, category])

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const hasFilters = !!(search || category)

  const clearFilters = () => {
    setSearch('')
    setCategory('')
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-28 pb-10 sm:pb-12">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
          <div className="hero-mesh absolute inset-0 opacity-80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[min(90vw,720px)] h-[420px] rounded-full bg-gradient-to-br from-rose/28 via-gold/12 to-mauve/18 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-right">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.settle}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-rose/25 shadow-xs mb-4">
              <CalendarDays className="w-3.5 h-3.5 text-rose" />
              الفعاليات
              <span className="text-muted font-medium">
                · {(eventsPayload?.meta?.total ?? events.length).toLocaleString('ar-DZ')} قادمة
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.15]">
              اكتشفي{' '}
              <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
                الفعاليات
              </span>
            </h1>
            <p className="mt-3 text-lg text-muted max-w-xl mx-auto sm:mx-0 leading-relaxed">
              مؤتمرات وورش عمل وملتقيات مهنية لبناء علاقات وفرص نمو.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Sticky search */}
        <div className="sticky top-[4.5rem] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mb-5">
          <div className="material rounded-[20px] shadow-md hairline edge-highlight p-3 sm:p-3.5">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحثي عن فعالية، مكان، أو تصنيف..."
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
              <span className="font-semibold text-navy tabular-nums">{filtered.length}</span> فعالية
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

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={`relative shrink-0 h-9 px-4 rounded-full text-[13px] font-medium pressable cursor-pointer ${
              !category ? 'text-white' : 'text-muted bg-white hairline hover:text-navy'
            }`}
          >
            {!category && (
              <motion.span
                layoutId={reduce ? undefined : 'event-cat-pill'}
                className="absolute inset-0 rounded-full bg-navy shadow-sm"
                transition={springs.snappy}
              />
            )}
            <span className="relative z-10">الكل</span>
          </button>
          {categories.map((c) => {
            const active = category === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(active ? '' : c)}
                className={`relative shrink-0 h-9 px-4 rounded-full text-[13px] font-medium pressable cursor-pointer ${
                  active ? 'text-white' : 'text-muted bg-white hairline hover:text-navy'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={reduce ? undefined : 'event-cat-pill'}
                    className="absolute inset-0 rounded-full bg-navy shadow-sm"
                    transition={springs.snappy}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            )
          })}
        </div>

        {loading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock message={error} onRetry={reload} />
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {featured && (
              <Reveal>
                <EventCard event={featured} featured />
              </Reveal>
            )}

            {rest.length > 0 && (
              <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((e) => (
                  <StaggerItem key={e.id}>
                    <EventCard event={e} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        ) : (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.settle}
            className="text-center py-20 px-6 rounded-[24px] bg-white hairline shadow-xs"
          >
            <div className="mx-auto w-14 h-14 rounded-[16px] bg-rose-soft flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-rose" />
            </div>
            <h2 className="text-lg font-bold text-navy tracking-[-0.01em]">لا توجد فعاليات مطابقة</h2>
            <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
              جرّبي كلمات مختلفة أو امسحي الفلاتر لعرض كل الفعاليات.
            </p>
            <Button variant="outline" size="sm" className="mt-5" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
