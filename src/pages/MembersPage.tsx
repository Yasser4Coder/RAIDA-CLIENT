import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X, Users, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { members, wilayas, serviceCategories } from '../data/mockData'
import MemberCard from '../components/ui/MemberCard'
import Button from '../components/ui/Button'
import { Stagger, StaggerItem } from '../components/ui/Reveal'
import { materialize, springs, useMotionSafe } from '../lib/motion'

export default function MembersPage() {
  const [search, setSearch] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [service, setService] = useState('')
  const [category, setCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { reduce, transition } = useMotionSafe()

  const categories = [...new Set(members.map((m) => m.category))]

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.trim()
      const matchSearch =
        !q ||
        m.name.includes(q) ||
        m.specialty.includes(q) ||
        m.title.includes(q) ||
        m.city.includes(q)
      const matchWilaya = !wilaya || m.wilaya === wilaya
      const matchService = !service || m.services.includes(service)
      const matchCategory = !category || m.category === category
      return matchSearch && matchWilaya && matchService && matchCategory
    })
  }, [search, wilaya, service, category])

  const clearFilters = () => {
    setSearch('')
    setWilaya('')
    setService('')
    setCategory('')
  }

  const hasFilters = !!(search || wilaya || service || category)
  const activeFilterCount = [wilaya, service, category].filter(Boolean).length

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page hero — hierarchy from skill */}
      <section className="relative isolate overflow-hidden pt-28 pb-10 sm:pb-12">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
          <div className="hero-mesh absolute inset-0 opacity-80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[min(90vw,720px)] h-[420px] rounded-full bg-gradient-to-br from-rose/25 via-gold/10 to-mauve/15 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-right">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.settle}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-rose/25 shadow-xs mb-4">
              <Users className="w-3.5 h-3.5 text-rose" />
              دليل الأعضاء
              <span className="text-muted font-medium">· {members.length.toLocaleString('ar-DZ')}+ رائدة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.15]">
              اكتشفي{' '}
              <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
                الأعضاء
              </span>
            </h1>
            <p className="mt-3 text-lg text-muted max-w-xl mx-auto sm:mx-0 leading-relaxed">
              ابحثي عن رائدات أعمال وخبيرات ومستشارات حسب التخصص والمدينة والخدمة.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Sticky translucent search chrome */}
        <div className="sticky top-[4.5rem] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mb-5">
          <div className="material rounded-[20px] shadow-md hairline edge-highlight p-3 sm:p-3.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحثي بالاسم، التخصص، أو المدينة..."
                  className="w-full pr-11 pl-4 h-11 rounded-[14px] bg-white/85 border border-separator text-navy placeholder:text-muted/55 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15 transition-shadow"
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

              <Button
                variant={showFilters ? 'gold' : 'outline'}
                size="md"
                onClick={() => setShowFilters((v) => !v)}
                className="shrink-0 relative"
                aria-expanded={showFilters}
              >
                <SlidersHorizontal className="w-4 h-4" />
                فلاتر
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose text-navy text-[10px] font-bold flex items-center justify-center ring-2 ring-ivory">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Advanced filters — materialize in/out same path */}
            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={reduce ? { opacity: 0 } : materialize.initial}
                  animate={reduce ? { opacity: 1 } : materialize.animate}
                  exit={reduce ? { opacity: 0 } : materialize.exit}
                  transition={transition}
                  className="mt-3 p-4 rounded-[16px] bg-white/75 hairline grid sm:grid-cols-3 gap-3 origin-top"
                >
                  <div>
                    <label className="block text-[11px] font-semibold text-muted mb-1.5 tracking-[0.01em]">
                      الولاية
                    </label>
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full px-3 h-10 rounded-[12px] border border-separator bg-white text-sm focus:outline-none focus:border-rose/40"
                    >
                      <option value="">كل الولايات</option>
                      {wilayas.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted mb-1.5">التصنيف</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 h-10 rounded-[12px] border border-separator bg-white text-sm focus:outline-none focus:border-rose/40"
                    >
                      <option value="">كل التصنيفات</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted mb-1.5">الخدمة</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-3 h-10 rounded-[12px] border border-separator bg-white text-sm focus:outline-none focus:border-rose/40"
                    >
                      <option value="">كل الخدمات</option>
                      {serviceCategories.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results meta */}
          <div className="mt-3 flex items-center justify-between gap-3 px-1">
            <p className="text-[13px] text-muted">
              <span className="font-semibold text-navy tabular-nums">{filtered.length}</span> نتيجة
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

        {/* Category chips — spring active pill */}
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
                layoutId={reduce ? undefined : 'member-cat-pill'}
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
                    layoutId={reduce ? undefined : 'member-cat-pill'}
                    className="absolute inset-0 rounded-full bg-navy shadow-sm"
                    transition={springs.snappy}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((m) => (
              <StaggerItem key={m.id}>
                <MemberCard member={m} />
              </StaggerItem>
            ))}
          </Stagger>
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
            <h2 className="text-lg font-bold text-navy tracking-[-0.01em]">لا توجد نتائج مطابقة</h2>
            <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
              جرّبي كلمات مختلفة أو امسحي الفلاتر لعرض كل الأعضاء.
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
