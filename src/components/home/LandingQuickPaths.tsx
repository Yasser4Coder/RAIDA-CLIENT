import { Link } from 'react-router-dom'
import {
  Trophy,
  BookOpen,
  Briefcase,
  GraduationCap,
  Calendar,
  CreditCard,
  ChevronLeft,
} from 'lucide-react'
import Reveal, { Stagger, StaggerItem } from '../ui/Reveal'

const paths = [
  { to: '/opportunities', label: 'الفرص', desc: 'تمويل ومعارض', icon: Trophy },
  { to: '/programs', label: 'البرامج', desc: 'دورات وورشات', icon: BookOpen },
  { to: '/services', label: 'اطلبي خدمة', desc: 'طلب مباشر', icon: Briefcase },
  { to: '/experts', label: 'الخبيرات', desc: 'استشارات', icon: GraduationCap },
  { to: '/events', label: 'الفعاليات', desc: 'ملتقيات', icon: Calendar },
  { to: '/membership', label: 'العضوية', desc: 'خطط سنوية', icon: CreditCard },
]

export default function LandingQuickPaths() {
  return (
    <section className="pb-14 lg:pb-18 bg-ivory" aria-label="مسارات سريعة">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-[11px] font-semibold tracking-[0.14em] text-gold-dark uppercase mb-4">
            ابدئي من هنا
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {paths.map((path) => {
            const Icon = path.icon
            return (
              <StaggerItem key={path.to}>
                <Link
                  to={path.to}
                  className="group flex flex-col h-full rounded-[18px] bg-white hairline p-4 shadow-xs hover:shadow-md hover:bg-blush/40 transition-all pressable-soft"
                >
                  <span className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="mt-3 font-bold text-navy text-[14px] tracking-[-0.01em]">
                    {path.label}
                  </span>
                  <span className="mt-0.5 text-[11px] text-muted flex items-center gap-0.5">
                    {path.desc}
                    <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </span>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
