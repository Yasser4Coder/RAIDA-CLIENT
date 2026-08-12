import { Calendar, MapPin, ChevronLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { events } from '../../data/mockData'
import { springs, useMotionSafe } from '../../lib/motion'

type Event = (typeof events)[number]

/** Split Arabic date like "15 سبتمبر 2026" → day + rest */
function splitDate(date: string) {
  const parts = date.trim().split(/\s+/)
  return { day: parts[0] ?? '', rest: parts.slice(1).join(' ') }
}

export default function EventCard({
  event,
  featured = false,
}: {
  event: Event
  featured?: boolean
}) {
  const { reduce } = useMotionSafe()
  const { day, rest } = splitDate(event.date)

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -5 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={springs.snappy}
      className="h-full"
    >
      <Link
        to={`/events/${event.id}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white hairline shadow-sm pressable will-change-transform ${
          featured ? 'sm:flex-row' : ''
        }`}
      >
        {/* Media */}
        <div
          className={`relative overflow-hidden bg-navy/5 ${
            featured ? 'sm:w-[46%] sm:min-h-full aspect-[16/11] sm:aspect-auto' : 'aspect-[16/11]'
          }`}
        >
          <img
            src={event.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-apple)] group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-navy/10" />

          {/* Material category chip */}
          <span className="absolute top-3 right-3 inline-flex items-center rounded-full material-ultra-thin px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] text-navy ring-1 ring-white/40 shadow-xs">
            {event.category}
          </span>

          {/* Apple Calendar–style date tile */}
          <div className="absolute bottom-3 right-3 overflow-hidden rounded-[14px] material-thick shadow-md ring-1 ring-white/50 min-w-[3.25rem] text-center">
            <div className="bg-rose/90 px-2.5 py-0.5 text-[9px] font-bold tracking-[0.04em] text-navy">
              {rest.split(' ')[0] || 'موعد'}
            </div>
            <div className="px-2.5 py-1.5 bg-white/90">
              <p className="text-[1.35rem] font-extrabold leading-none tracking-[-0.03em] text-navy tabular-nums">
                {day}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-7' : 'p-5'}`}>
          <p className="caption font-medium text-rose flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
            <span className="text-navy/20">·</span>
            {event.time}
          </p>

          <h3
            className={`mt-2 font-bold text-navy tracking-[-0.02em] leading-[1.25] group-hover:text-navy-light transition-colors ${
              featured ? 'text-xl sm:text-2xl' : 'text-[16px]'
            }`}
          >
            {event.title}
          </h3>

          <p className="mt-2.5 flex items-start gap-1.5 text-[13px] text-muted leading-snug">
            <MapPin className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
            <span className="line-clamp-2">{event.location}</span>
          </p>

          {event.speakers.length > 0 && (
            <div className="mt-4 flex items-center gap-2.5">
              <div className="flex -space-x-2.5 space-x-reverse">
                {event.speakers.slice(0, 3).map((s, i) => (
                  <img
                    key={i}
                    src={s.image}
                    alt={s.name}
                    title={s.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-navy truncate tracking-[-0.01em]">
                  {event.speakers[0]?.name}
                  {event.speakers.length > 1 ? ` +${event.speakers.length - 1}` : ''}
                </p>
                <p className="text-[11px] text-muted">متحدثات</p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-separator/80">
            <span className="text-[12px] font-medium text-muted">{event.price}</span>
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-rose group-hover:gap-1.5 transition-all">
              التسجيل الآن
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
