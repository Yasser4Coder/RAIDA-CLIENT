import { Calendar, MapPin, ChevronLeft, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { EventItem } from '../../types/api'
import { springs, useMotionSafe } from '../../lib/motion'
import { safeHref } from '../../lib/safe'
import SafeImg from './SafeImg'

type Event = EventItem

const placeholder =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop'

/** Split Arabic date like "15 سبتمبر 2026" → day + rest */
function splitDate(date: string | null | undefined) {
  const parts = (date || '').trim().split(/\s+/)
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
  const speakers = Array.isArray(event.speakers) ? event.speakers : []
  const registerUrl = safeHref(event.registrationUrl)

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -4 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={springs.snappy}
      className={`group relative flex h-full overflow-hidden rounded-[22px] bg-white hairline shadow-sm hover:shadow-md transition-shadow will-change-transform ${
        featured ? 'flex-col sm:flex-row min-h-[280px]' : 'flex-col'
      }`}
    >
      <Link
        to={`/events/${event.id}`}
        className={`relative overflow-hidden bg-navy/5 shrink-0 ${
          featured ? 'sm:w-[48%] sm:min-h-full aspect-[16/11] sm:aspect-auto' : 'aspect-[16/11]'
        }`}
      >
        <SafeImg
          src={event.image}
          fallback={placeholder}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-apple)] group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-navy/10" />

        <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] text-navy ring-1 ring-white/50 shadow-xs">
          {event.category}
        </span>

        <div className="absolute bottom-3 right-3 overflow-hidden rounded-[14px] bg-white shadow-md ring-1 ring-navy/8 min-w-[3.25rem] text-center">
          <div className="bg-rose px-2.5 py-0.5 text-[9px] font-bold tracking-[0.04em] text-navy">
            {rest.split(' ')[0] || 'موعد'}
          </div>
          <div className="px-2.5 py-1.5">
            <p className="text-[1.35rem] font-extrabold leading-none tracking-[-0.03em] text-navy tabular-nums">
              {day || '—'}
            </p>
          </div>
        </div>
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-8' : 'p-5'}`}>
        <Link to={`/events/${event.id}`} className="flex-1 min-w-0">
          <p className="caption font-medium text-rose flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{event.date}</span>
            {event.time ? (
              <>
                <span className="text-navy/20">·</span>
                <span>{event.time}</span>
              </>
            ) : null}
          </p>

          <h3
            className={`mt-2 font-bold text-navy tracking-[-0.02em] leading-[1.25] group-hover:text-navy-light transition-colors ${
              featured ? 'text-xl sm:text-2xl' : 'text-[16px] line-clamp-2'
            }`}
          >
            {event.title}
          </h3>

          <p className="mt-2.5 flex items-start gap-1.5 text-[13px] text-muted leading-snug">
            <MapPin className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
            <span className="line-clamp-2">{event.location}</span>
          </p>

          {featured && event.description && (
            <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-2 max-w-xl">
              {event.description}
            </p>
          )}

          {speakers.length > 0 && (
            <div className="mt-4 flex items-center gap-2.5">
              <div className="flex -space-x-2.5 space-x-reverse">
                {speakers.slice(0, 3).map((s, i) => (
                  <SafeImg
                    key={i}
                    src={s.image}
                    fallback={placeholder}
                    alt={s.name}
                    title={s.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-navy truncate tracking-[-0.01em]">
                  {speakers[0]?.name}
                  {speakers.length > 1 ? ` +${speakers.length - 1}` : ''}
                </p>
                <p className="text-[11px] text-muted">متحدثات</p>
              </div>
            </div>
          )}
        </Link>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-separator/80">
          <span className="text-[12px] font-semibold text-navy/70">{event.price || '—'}</span>
          {registerUrl ? (
            <a
              href={registerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-navy text-white text-[12px] font-semibold pressable hover:bg-navy-light transition-colors"
            >
              التسجيل
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          ) : (
            <Link
              to={`/events/${event.id}`}
              className="inline-flex items-center gap-1 h-9 px-3.5 rounded-full bg-rose-soft text-navy text-[13px] font-semibold hover:bg-blush transition-colors"
            >
              التفاصيل
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  )
}
