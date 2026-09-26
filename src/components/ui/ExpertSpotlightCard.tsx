import { Link } from 'react-router-dom'
import { ChevronLeft, GraduationCap, MapPin, MessageSquare } from 'lucide-react'
import type { Member } from '../../types/api'
import SafeImg from './SafeImg'

const avatarFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&h=320&fit=crop'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

function expertInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'خ'
  if (parts.length === 1) return parts[0].slice(0, 1)
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`
}

function isSoon(member: Member) {
  return (
    member.id.startsWith('wireframe-') ||
    Boolean(member.image?.includes('/experts/wireframe-'))
  )
}

type Props = {
  member: Member
  /** dark = homepage navy strip; light = ivory directory page */
  tone?: 'dark' | 'light'
}

export default function ExpertSpotlightCard({ member, tone = 'dark' }: Props) {
  const soon = isSoon(member)
  const specialty = member.specialty || member.title || 'خبيرة رائدة'
  const title = member.title && member.title !== specialty ? member.title : null
  const dark = tone === 'dark'

  const body = (
    <>
      <div
        className={`relative aspect-[4/5] overflow-hidden ${
          dark ? 'bg-[#151D33]' : 'bg-navy/5'
        }`}
      >
        {soon ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{
              background: dark
                ? 'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(201,162,77,0.28), transparent 60%), linear-gradient(160deg, #121A2E 0%, #0B1428 100%)'
                : 'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(201,162,77,0.18), transparent 60%), linear-gradient(160deg, #F4F1EC 0%, #E8E2D8 100%)',
            }}
          >
            <span
              className={`flex h-20 w-20 items-center justify-center rounded-full text-[28px] font-extrabold tracking-wide font-display ring-1 ${
                dark
                  ? 'bg-gold/15 text-gold ring-gold/35'
                  : 'bg-navy/8 text-navy ring-navy/10'
              }`}
            >
              {expertInitials(member.name)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${
                dark
                  ? 'bg-white/8 text-white/55 ring-white/10'
                  : 'bg-white text-muted ring-navy/8'
              }`}
            >
              الصورة قريبًا
            </span>
          </div>
        ) : (
          <>
            <SafeImg
              src={member.image}
              fallback={avatarFallback}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0"
              style={{
                background: dark
                  ? 'linear-gradient(to top, rgba(11,20,40,0.92) 0%, rgba(11,20,40,0.35) 42%, transparent 70%)'
                  : 'linear-gradient(to top, rgba(10,19,40,0.88) 0%, rgba(10,19,40,0.25) 45%, transparent 72%)',
              }}
              aria-hidden
            />
          </>
        )}

        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B1428]/75 px-2.5 py-1 text-[10px] font-bold text-gold backdrop-blur-sm ring-1 ring-gold/30">
            <GraduationCap className="h-3 w-3" aria-hidden />
            خبيرة رائدة
          </span>
          {!soon && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-200 backdrop-blur-sm ring-1 ring-emerald-400/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden />
              متاحة
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 pt-10">
          <h3 className="text-[17px] font-extrabold tracking-[-0.02em] text-white leading-snug line-clamp-2">
            {member.name}
          </h3>
          {title && <p className="mt-1 text-[12px] text-white/55 line-clamp-1">{title}</p>}
        </div>
      </div>

      <div className={`flex flex-1 flex-col gap-3 p-4 ${dark ? '' : 'bg-white'}`}>
        <span
          className={`inline-flex w-fit max-w-full items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
            dark
              ? 'bg-gold/12 text-gold ring-gold/20'
              : 'bg-gold/10 text-gold-dark ring-gold/20'
          }`}
        >
          <span className="truncate">{specialty}</span>
        </span>

        {member.city && (
          <p
            className={`flex items-center gap-1.5 text-[12px] ${
              dark ? 'text-white/45' : 'text-muted'
            }`}
          >
            <MapPin
              className={`h-3.5 w-3.5 shrink-0 ${dark ? 'text-rose-light/80' : 'text-rose'}`}
              aria-hidden
            />
            <span className="truncate">{member.city}</span>
          </p>
        )}

        <div
          className={`mt-auto flex items-center justify-between gap-2 border-t pt-3 ${
            dark ? 'border-white/8' : 'border-separator/80'
          }`}
        >
          {soon ? (
            <span
              className={`text-[12px] font-semibold ${
                dark ? 'text-white/40' : 'text-muted'
              }`}
            >
              الملف قيد الإعداد
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1.5 text-[13px] font-bold transition-colors ${
                dark
                  ? 'text-gold group-hover:text-gold-light'
                  : 'text-navy group-hover:text-gold-dark'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden />
              اطلبي استشارة
              <ChevronLeft
                className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:-translate-x-0.5"
                aria-hidden
              />
            </span>
          )}
        </div>
      </div>
    </>
  )

  const shell = dark
    ? 'group flex h-full flex-col overflow-hidden rounded-[22px] bg-white/[0.04] ring-1 ring-inset ring-white/10 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]'
    : 'group flex h-full flex-col overflow-hidden rounded-[22px] bg-white hairline shadow-sm'

  const hover = dark
    ? 'transition-[transform,box-shadow,ring-color] duration-300 pressable hover:-translate-y-1 hover:ring-gold/35 hover:shadow-[0_28px_60px_-24px_rgba(201,162,77,0.35)]'
    : 'transition-[transform,box-shadow] duration-300 pressable hover:-translate-y-1 hover:shadow-md'

  if (soon) {
    return (
      <div className={shell} role="group">
        {body}
      </div>
    )
  }

  return (
    <Link to={`/members/${member.id}`} className={`${shell} ${hover} ${focusRing}`}>
      {body}
    </Link>
  )
}
