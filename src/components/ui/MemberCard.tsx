import { Link } from 'react-router-dom'
import { MapPin, ChevronLeft } from 'lucide-react'
import { motion } from 'motion/react'
import type { members } from '../../data/mockData'
import { springs, useMotionSafe } from '../../lib/motion'

type Member = (typeof members)[number]

export default function MemberCard({ member }: { member: Member }) {
  const { reduce } = useMotionSafe()

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={springs.snappy}
      className="h-full"
    >
      <Link
        to={`/members/${member.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white hairline shadow-sm pressable"
      >
        {/* Cover */}
        <div className="relative h-[5.5rem] overflow-hidden">
          <img
            src={member.cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-apple)] group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-navy/15" />
        </div>

        <div className="relative flex flex-1 flex-col px-5 pb-5 -mt-10">
          <img
            src={member.image}
            alt={member.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-[18px] object-cover ring-[3px] ring-white shadow-md"
          />

          <h3 className="mt-3 text-[16px] font-bold tracking-[-0.02em] text-navy leading-snug group-hover:text-navy-light transition-colors">
            {member.name}
          </h3>
          <p className="mt-0.5 text-[12px] text-muted leading-snug line-clamp-1">{member.title}</p>

          <span className="mt-3 inline-flex w-fit items-center rounded-full bg-rose-soft px-2.5 py-1 text-[11px] font-semibold text-navy ring-1 ring-rose/25">
            {member.specialty}
          </span>

          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-muted">
            <MapPin className="h-3.5 w-3.5 text-rose shrink-0" />
            {member.city}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-separator/70">
            <span className="text-[11px] text-muted">{member.category}</span>
            <span className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-rose transition-all group-hover:gap-1.5">
              الملف الشخصي
              <ChevronLeft className="h-4 w-4 opacity-70" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function MemberCardCompact({ member }: { member: Member }) {
  return (
    <Link
      to={`/members/${member.id}`}
      className="flex items-center gap-3.5 p-3.5 bg-white rounded-[16px] hairline shadow-xs pressable-soft hover:shadow-sm transition-shadow"
    >
      <img src={member.image} alt={member.name} className="w-12 h-12 rounded-[12px] object-cover" />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[15px] text-navy truncate tracking-[-0.01em]">{member.name}</h4>
        <p className="caption text-muted truncate">{member.specialty}</p>
      </div>
    </Link>
  )
}
