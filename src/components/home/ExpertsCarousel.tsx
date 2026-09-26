import { useCallback, useEffect, useRef, useState, type ReactNode, Children } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  children: ReactNode
  label?: string
  footer?: ReactNode
  countClassName?: string
}

export default function ExpertsCarousel({
  children,
  label = 'خبيرات رائدة',
  footer,
  countClassName = 'text-white/45',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [index, setIndex] = useState(0)
  const slides = Children.toArray(children)
  const count = slides.length

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    const scrolled = Math.abs(el.scrollLeft)
    setCanPrev(scrolled > 10)
    setCanNext(max > 10 && scrolled < max - 10)

    const card = el.querySelector<HTMLElement>('[data-carousel-item]')
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.7
    const i = Math.round(scrolled / Math.max(step, 1))
    setIndex(Math.min(count - 1, Math.max(0, i)))
  }, [count])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [update, count])

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-carousel-item]')
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.75
    const rtl = getComputedStyle(el).direction === 'rtl'
    const delta = rtl ? -dir * step : dir * step
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  if (count === 0) return null

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className={`text-[12px] font-semibold tabular-nums ${countClassName}`}>
          {count.toLocaleString('ar-DZ')} خبيرة
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={!canPrev}
            aria-label="السابق"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white ring-1 ring-white/15 transition-colors hover:bg-white/14 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronRight className="h-[18px] w-[18px]" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={!canNext}
            aria-label="التالي"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy transition-colors hover:bg-gold-light disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {slides.map((child, i) => (
          <div
            key={(child as { key?: string | null }).key ?? i}
            data-carousel-item
            className="w-[min(78vw,280px)] shrink-0 snap-start sm:w-[260px] lg:w-[272px]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} من ${count}`}
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-5 flex justify-center gap-1.5" aria-hidden>
          {Array.from({ length: Math.min(count, 8) }).map((_, i) => {
            const active = index === i || (count > 8 && i === 7 && index >= 7)
            return (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  active ? 'w-5 bg-gold' : 'w-1.5 bg-white/25'
                }`}
              />
            )
          })}
        </div>
      )}

      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  )
}
