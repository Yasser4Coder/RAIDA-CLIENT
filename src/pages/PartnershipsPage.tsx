import type { ElementType } from 'react'
import {
  Handshake, Check, ChevronLeft, Building2, Award, Newspaper,
  BookOpen, Wrench, Calendar, Sparkles,
} from 'lucide-react'
import { motion } from 'motion/react'
import { partnershipTiers, partners } from '../data/mockData'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import { springs, useMotionSafe } from '../lib/motion'

const tierIcons: Record<string, ElementType> = {
  'Strategic Partner': Building2,
  'Gold Partner': Award,
  'Media Partner': Newspaper,
  'Knowledge Partner': BookOpen,
  'Service Partner': Wrench,
  'Event Partner': Calendar,
}

const accentMap: Record<string, string> = {
  navy: 'bg-navy text-gold',
  gold: 'bg-gold/15 text-gold-dark ring-gold/25',
  rose: 'bg-rose-soft text-rose ring-rose/30',
  mauve: 'bg-blush text-mauve ring-mauve/30',
}

const barMap: Record<string, string> = {
  navy: 'from-navy to-navy-soft',
  gold: 'from-gold-dark to-gold',
  rose: 'from-rose to-mauve',
  mauve: 'from-mauve to-rose-light',
}

const trust = ['ظهور مؤسسي', 'فرص حصرية', 'دعم مخصص']

export default function PartnershipsPage() {
  const { reduce } = useMotionSafe()

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero — light mesh, consistent with discovery pages */}
      <section className="relative isolate overflow-hidden pt-28 pb-14 sm:pb-16">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
          <div className="hero-mesh absolute inset-0 opacity-80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[min(90vw,760px)] h-[440px] rounded-full bg-gradient-to-br from-gold/22 via-rose/22 to-mauve/16 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.settle}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-gold/30 shadow-xs mb-5">
              <Handshake className="w-3.5 h-3.5 text-gold-dark" />
              بوابة الشراكات
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy leading-[1.12] max-w-3xl mx-auto">
              شراكات تبني{' '}
              <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
                المستقبل
              </span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              انضمي كشريكة استراتيجية إلى أكبر مجتمع أعمال نسائي عربي واصنعي أثراً حقيقياً.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="gold" size="lg" className="w-full sm:w-auto shadow-lg shadow-gold/25">
                <Handshake className="w-5 h-5" />
                قدّمي طلب شراكة
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" to="#tiers">
                استكشفي المستويات
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
              {trust.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rose shrink-0" strokeWidth={2.5} />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Tiers */}
        <div id="tiers" className="scroll-mt-28">
          <Reveal>
            <SectionHeader
              eyebrow="أنواع الشراكة"
              title="اختاري مستوى الشراكة المناسب"
              description="ستة مستويات شراكة مصممة لتلبية أهداف المؤسسات والعلامات التجارية."
              centered
            />
          </Reveal>

          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnershipTiers.map((tier, i) => {
              const Icon = tierIcons[tier.name] || Handshake
              const featured = i === 0
              return (
                <StaggerItem key={tier.id} className={featured ? 'sm:col-span-2 lg:col-span-1' : ''}>
                  <motion.article
                    whileHover={reduce ? undefined : { y: -4 }}
                    whileTap={reduce ? undefined : { scale: 0.985 }}
                    transition={springs.snappy}
                    className={`group relative h-full overflow-hidden rounded-[22px] bg-white hairline shadow-sm flex flex-col ${
                      featured ? 'ring-1 ring-gold/35 shadow-md' : ''
                    }`}
                  >
                    <div className={`h-1.5 bg-gradient-to-l ${barMap[tier.color] ?? barMap.rose}`} />
                    <div className="p-6 lg:p-7 flex flex-col flex-1">
                      {featured && (
                        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold text-gold-dark tracking-[0.02em]">
                          <Sparkles className="w-3 h-3" />
                          الأعلى تأثيراً
                        </span>
                      )}
                      <div
                        className={`w-11 h-11 rounded-[13px] flex items-center justify-center ring-1 ${
                          accentMap[tier.color] ?? accentMap.rose
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      <p className="mt-4 text-[11px] font-semibold tracking-[0.04em] text-gold-dark">
                        {tier.name}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-navy tracking-[-0.02em]">
                        {tier.nameAr}
                      </h3>
                      <p className="mt-2.5 text-sm text-muted leading-relaxed">{tier.description}</p>
                      <ul className="mt-5 space-y-2.5 flex-1">
                        {tier.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-[13px] text-dark">
                            <Check className="w-4 h-4 text-rose mt-0.5 shrink-0" strokeWidth={2.5} />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <Button variant={featured ? 'gold' : 'outline'} size="sm" className="w-full mt-6">
                        اعرفي المزيد
                        <ChevronLeft className="w-4 h-4 opacity-60" />
                      </Button>
                    </div>
                  </motion.article>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>

        {/* Partners wall */}
        <div className="mt-20">
          <Reveal>
            <SectionHeader
              eyebrow="شركاؤنا الحاليون"
              title="مؤسسات تثق بـ RAIDA"
              description="علامات ومؤسسات رائدة تبني أثراً مشتركاً مع مجتمعنا."
              centered
            />
          </Reveal>
          <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {partners.map((p) => (
              <StaggerItem key={p.id}>
                <div className="flex flex-col items-center p-6 lg:p-7 rounded-[18px] bg-white hairline shadow-xs pressable-soft hover:shadow-sm transition-shadow text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mb-3 ring-1 ring-gold/25">
                    <span className="text-gold font-bold text-lg">{p.name[0]}</span>
                  </div>
                  <p className="font-bold text-navy text-[13px] tracking-[-0.01em]">{p.name}</p>
                  <p className="text-[10px] text-muted mt-1">{p.type}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Final CTA */}
        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-[24px] min-h-[280px] flex items-center">
            <img
              src="/cta-background.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/35" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(232,160,176,0.2),transparent_55%)]" />

            <div className="relative w-full p-10 lg:p-14 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                هل أنتِ مستعدة للشراكة؟
              </h2>
              <p className="mt-3 text-white/70 max-w-lg mx-auto text-[15px] sm:text-base leading-relaxed">
                تواصلي مع فريق الشراكات لدينا لبناء تعاون استراتيجي يخدم أهدافكِ ومجتمعنا.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="gold" size="lg" className="shadow-lg shadow-gold/25">
                  تواصلي مع فريق الشراكات
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  className="!text-white !border-white/25 !bg-white/10 hover:!bg-white/18"
                  to="/membership"
                >
                  خطط العضوية
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
