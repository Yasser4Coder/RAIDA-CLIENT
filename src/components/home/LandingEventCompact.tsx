import { Link } from 'react-router-dom'
import { Calendar, MapPin, ChevronLeft } from 'lucide-react'
import type { EventItem } from '../../types/api'
import SafeImg from '../ui/SafeImg'

const placeholder =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'

function splitDate(date: string | null | undefined) {
  const parts = (date || '').trim().split(/\s+/)
  return { day: parts[0] ?? '—', rest: parts.slice(1).join(' ') }
}

export default function LandingEventCompact({ event }: { event: EventItem }) {
  const { day, rest } = splitDate(event.date)

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex gap-3.5 p-3.5 sm:p-4 rounded-[18px] bg-white hairline shadow-xs hover:shadow-md hover:bg-blush/40 transition-all pressable-soft h-full min-h-[5.5rem]"
    >
      <div className="relative w-[4.5rem] sm:w-20 shrink-0 rounded-[14px] overflow-hidden bg-navy/5 aspect-[4/5] sm:aspect-square sm:h-auto">
        <SafeImg
          src={event.image}
          fallback={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-navy/15" />
        <div className="absolute bottom-1 inset-x-1 rounded-lg bg-white/95 py-1 text-center ring-1 ring-white/80 sm:hidden">
          <span className="text-[11px] font-bold text-navy tabular-nums">{day}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col min-w-0 py-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="hidden sm:inline-flex flex-col items-center shrink-0 rounded-[12px] bg-navy text-white px-2 py-1.5 min-w-[3rem] text-center">
            <span className="text-lg font-extrabold leading-none tabular-nums">{day}</span>
            <span className="text-[9px] text-white/70 mt-0.5 leading-tight max-w-[4rem] truncate">
              {rest.split(' ')[0]}
            </span>
          </span>
          <span className="text-[10px] font-semibold text-rose bg-rose-soft/80 px-2 py-0.5 rounded-full truncate max-w-[10rem] mr-auto sm:mr-0">
            {event.category}
          </span>
        </div>

        <h3 className="mt-1.5 sm:mt-2 text-[14px] sm:text-[15px] font-bold text-navy leading-snug line-clamp-2 group-hover:text-navy-light transition-colors">
          {event.title}
        </h3>

        <p className="mt-1.5 flex items-center gap-1 text-[11px] sm:text-[12px] text-muted truncate">
          <MapPin className="w-3 h-3 text-gold shrink-0" />
          {event.location}
        </p>

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted">
            <Calendar className="w-3 h-3" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-gold-dark opacity-0 group-hover:opacity-100 transition-opacity">
            التفاصيل
            <ChevronLeft className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
