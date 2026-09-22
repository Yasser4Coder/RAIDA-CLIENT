import {
  Trophy,
  CalendarClock,
  ChevronLeft,
  ExternalLink,
  BookmarkPlus,
  Briefcase,
  GraduationCap,
  Handshake,
  Store,
  Sparkles,
  Users,
} from 'lucide-react'
import type { ElementType } from 'react'
import { motion } from 'motion/react'
import Button from './Button'
import { springs, useMotionSafe } from '../../lib/motion'
import { safeHref } from '../../lib/safe'
import type { CmsOpportunity } from '../../types/api'

const typeMeta: Record<string, { icon: ElementType; accent: string }> = {
  تمويل: { icon: Sparkles, accent: 'from-gold/20 to-gold/5 text-gold-dark' },
  مسابقة: { icon: Trophy, accent: 'from-rose/25 to-rose-soft text-rose' },
  معرض: { icon: Briefcase, accent: 'from-navy/15 to-navy/5 text-navy' },
  تدريب: { icon: GraduationCap, accent: 'from-mauve/25 to-blush text-mauve' },
  شراكة: { icon: Handshake, accent: 'from-gold/15 to-ivory text-gold-dark' },
  تجاري: { icon: Store, accent: 'from-rose/20 to-ivory text-navy' },
  توظيف: { icon: Users, accent: 'from-navy/12 to-ivory text-navy' },
  مرافقة: { icon: GraduationCap, accent: 'from-blush to-ivory text-navy' },
}

function typeStyle(type: string) {
  return typeMeta[type] ?? { icon: Trophy, accent: 'from-rose-soft to-ivory text-navy' }
}

type Props = {
  item: CmsOpportunity
  interested: boolean
  onToggleInterest: () => void
  featured?: boolean
}

export default function OpportunityCard({ item, interested, onToggleInterest, featured = false }: Props) {
  const { reduce } = useMotionSafe()
  const href = safeHref(item.applyUrl || undefined)
  const { icon: Icon, accent } = typeStyle(item.type)

  const inner = (
    <>
      <div
        className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${accent} p-[1px] h-full`}
      >
        <article
          className={`h-full rounded-[19px] bg-white flex flex-col ${
            featured ? 'p-7 sm:p-8' : 'p-6'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy text-gold px-2.5 py-1 text-[11px] font-bold">
              <Icon className="w-3.5 h-3.5" />
              {item.type}
            </span>
            {item.deadline ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-soft/90 px-2.5 py-1 text-[11px] font-semibold text-navy ring-1 ring-rose/25">
                <CalendarClock className="w-3.5 h-3.5 text-rose" />
                {item.deadline}
              </span>
            ) : (
              <span className="text-[11px] text-muted font-medium">مفتوحة</span>
            )}
          </div>

          <h3
            className={`mt-4 font-extrabold text-navy leading-snug tracking-[-0.02em] ${
              featured ? 'text-2xl sm:text-[1.65rem]' : 'text-lg'
            }`}
          >
            {item.title}
          </h3>
          <p
            className={`mt-2.5 text-muted leading-relaxed flex-1 ${
              featured ? 'text-[15px] max-w-2xl' : 'text-sm line-clamp-4'
            }`}
          >
            {item.description}
          </p>

          <div className={`mt-6 flex flex-col sm:flex-row gap-2 ${featured ? 'sm:items-center' : ''}`}>
            <button
              type="button"
              onClick={onToggleInterest}
              className={`h-10 px-4 rounded-[12px] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 pressable ${
                interested
                  ? 'bg-navy text-white'
                  : 'bg-rose-soft/80 text-navy ring-1 ring-rose/20 hover:bg-blush'
              } ${featured ? 'sm:min-w-[11rem]' : 'w-full sm:flex-1'}`}
            >
              <BookmarkPlus className="w-4 h-4" />
              {interested ? 'محفوظة' : 'سجّلي اهتمامكِ'}
            </button>
            {href ? (
              href.startsWith('/') ? (
                <Button
                  to={href}
                  variant="outline"
                  size="sm"
                  className={featured ? 'sm:min-w-[9rem]' : 'w-full sm:flex-1'}
                >
                  التفاصيل
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`h-10 px-4 rounded-[12px] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 border border-navy/12 text-navy hover:bg-ivory pressable ${
                    featured ? 'sm:min-w-[9rem]' : 'w-full sm:flex-1'
                  }`}
                >
                  التقديم
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )
            ) : (
              <Button
                to="/dashboard"
                variant="soft"
                size="sm"
                className={featured ? 'sm:min-w-[9rem]' : 'w-full sm:flex-1'}
              >
                من حسابكِ
              </Button>
            )}
          </div>
        </article>
      </div>
    </>
  )

  if (featured) {
    return (
      <motion.div
        whileHover={reduce ? undefined : { y: -3 }}
        transition={springs.snappy}
        className="h-full"
      >
        {inner}
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={springs.snappy}
      className="h-full"
    >
      {inner}
    </motion.div>
  )
}
