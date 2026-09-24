import { Link } from 'react-router-dom'
import type { ElementType } from 'react'
import {
  Users,
  ChevronLeft,
  GraduationCap,
  Building2,
  Store,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  Sparkles,
  MessageSquare,
} from 'lucide-react'
import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SafeImg from '../components/ui/SafeImg'
import SeoHead from '../components/seo/SeoHead'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { springs, useMotionSafe } from '../lib/motion'
import { RaidaMark } from '../components/ui/Logo'

const heroImage =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=900&fit=crop'

const hubs: {
  to: string
  label: string
  desc: string
  icon: ElementType
}[] = [
  { to: '/members', label: 'دليل الأعضاء', desc: 'رائدات أعمال ومشاريع', icon: Users },
  { to: '/experts', label: 'خبراء رائدة', desc: 'مدربون ومستشارون', icon: GraduationCap },
  { to: '/academies', label: 'الأكاديميات', desc: 'مراكز تدريب وبرامج', icon: Building2 },
  { to: '/brands', label: 'العلامات', desc: 'منتجات وخدمات', icon: Store },
  { to: '/opportunities', label: 'الفرص', desc: 'تمويل ومعارض وشراكات', icon: Briefcase },
  { to: '/programs', label: 'البرامج', desc: 'دورات وورشات', icon: BookOpen },
  { to: '/services', label: 'اطلبي خدمة', desc: 'طلب خدمة لمشروعكِ', icon: MessageSquare },
  { to: '/project-check', label: 'اختبري مشروعك', desc: 'تقييم جاهزية مجاني', icon: ClipboardCheck },
  { to: '/member-of-month', label: 'رائدة الشهر', desc: 'تسليط ضوء شهري', icon: Sparkles },
]

export default function CommunityPage() {
  const { reduce, fadeUp } = useMotionSafe()
  const { data: stats } = useAsyncData(() => catalogApi.stats(), [])

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.community.title}
        description={routeSeo.community.description}
        path={routeSeo.community.path}
        keywords={[...routeSeo.community.keywords]}
        image={heroImage}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'المجتمع', path: '/community' },
        ])}
      />

      <section className="relative isolate min-h-[min(72vh,560px)] flex flex-col overflow-hidden">
        <SafeImg
          src={heroImage}
          fallback={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/35" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-ivory to-transparent" />

        <div className="relative z-10 flex-1 flex flex-col justify-end pt-28 pb-14 sm:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={springs.settle}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2.5 mb-5">
                <span className="w-10 h-10 rounded-[12px] bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
                  <RaidaMark className="w-7 h-7" />
                </span>
                <span className="text-[12px] font-semibold tracking-[0.18em] text-gold uppercase">
                  مجتمع رائدة
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-[-0.03em] leading-[1.12]">
                بوابتكِ إلى الشبكة
              </h1>
              <p className="mt-4 text-[16px] sm:text-lg text-white/75 leading-relaxed max-w-xl">
                اختاري الوجهة: أعضاء، خبيرات، فرص، برامج، أو خدمات — دون تكرار قصة العضوية هنا.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/opportunities" variant="gold" size="lg">
                  استكشفي الفرص
                  <ChevronLeft className="w-4 h-4 opacity-80" />
                </Button>
                <Button
                  to="/membership"
                  variant="glass"
                  size="lg"
                  className="!bg-white/10 !text-white !border-white/25 hover:!bg-white/18"
                >
                  خطط العضوية
                </Button>
              </div>
            </motion.div>

            {stats && stats.length > 0 && (
              <motion.div
                className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.settle, delay: 0.12 }}
              >
                {stats.slice(0, 4).map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-[14px] bg-white/8 ring-1 ring-white/15 px-3.5 py-3 backdrop-blur-sm"
                  >
                    <p className="text-xl sm:text-2xl font-extrabold text-gold tabular-nums tracking-tight">
                      {stat.value.toLocaleString('ar-DZ')}
                      {stat.suffix}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/55 font-medium">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        <Reveal>
          <div className="mb-8 max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
              استكشفي
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
              بوابات المجتمع
            </h2>
          </div>
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {hubs.map((hub) => {
            const Icon = hub.icon
            return (
              <StaggerItem key={hub.to}>
                <Link
                  to={hub.to}
                  className="group relative flex h-full items-start gap-4 rounded-[18px] bg-white hairline p-5 shadow-xs pressable hover:bg-blush/30 transition-colors"
                >
                  <span className="w-12 h-12 rounded-[14px] bg-navy text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="font-bold text-navy tracking-[-0.01em]">{hub.label}</p>
                    <p className="mt-1 text-[13px] text-muted leading-snug">{hub.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-gold-dark opacity-80 group-hover:opacity-100 transition-opacity">
                      ادخلي
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </div>
  )
}
