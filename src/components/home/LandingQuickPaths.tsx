import { Link } from 'react-router-dom'
import {
  Trophy,
  BookOpen,
  Briefcase,
  GraduationCap,
  Calendar,
  CreditCard,
  School,
  ChevronLeft,
} from 'lucide-react'
import Reveal, { Stagger, StaggerItem } from '../ui/Reveal'
import Button from '../ui/Button'

const paths = [
  { to: '/opportunities', label: 'الفرص', desc: 'تمويل ومعارض ومسابقات', icon: Trophy },
  { to: '/programs', label: 'البرامج', desc: 'دورات وورشات تدريبية', icon: BookOpen },
  { to: '/services', label: 'اطلبي خدمة', desc: 'طلب مباشر من مزوّدة معتمدة', icon: Briefcase },
  { to: '/experts', label: 'الخبراء', desc: 'استشارات فردية متخصصة', icon: GraduationCap },
  { to: '/academies', label: 'الأكاديميات', desc: 'مراكز تدريب وكوتشينق', icon: School },
  { to: '/events', label: 'الفعاليات', desc: 'ملتقيات ولقاءات مهنية', icon: Calendar },
  { to: '/membership', label: 'العضوية', desc: 'خطط سنوية للانضمام', icon: CreditCard },
]

export default function LandingQuickPaths() {
  return (
    <section className="bg-ivory py-16 lg:py-24" aria-label="مسارات سريعة في رائدة">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gold-dark">
                ابدئي من هنا
              </span>
              <span
                className="mt-2.5 block h-0.5 w-8 rounded-full bg-gradient-to-l from-gold via-rose to-transparent"
                aria-hidden
              />
              <h2 className="mt-4 display-sm text-navy">اختاري مسارك في رائدة</h2>
              <p className="mt-3 body-lg text-muted">
                سبعة مداخل واضحة إلى المجتمع — اختاري ما يناسب مرحلتك الحالية.
              </p>
              <div className="mt-8">
                <Button
                  to="/membership"
                  variant="gold"
                  size="md"
                  className="w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy sm:w-auto"
                >
                  انضمي إلى رائدة
                  <ChevronLeft className="h-4 w-4 opacity-70" />
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Stagger className="divide-y divide-separator overflow-hidden rounded-[24px] bg-white shadow-xs hairline">
              {paths.map((path) => {
                const Icon = path.icon
                return (
                  <StaggerItem key={path.to}>
                    <Link
                      to={path.to}
                      className="group flex min-h-[4.5rem] items-center gap-4 px-4 py-4 transition-colors pressable-soft hover:bg-blush/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy sm:px-6"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-navy text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15.5px] font-bold tracking-[-0.01em] text-navy">
                          {path.label}
                        </span>
                        <span className="mt-1 block text-[13px] leading-snug text-muted">
                          {path.desc}
                        </span>
                      </span>
                      <ChevronLeft
                        className="h-4 w-4 shrink-0 text-navy/25 transition-colors group-hover:text-navy/70"
                        aria-hidden
                      />
                    </Link>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  )
}
