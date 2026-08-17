import { Gift, ChevronLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { freeCommunityBenefits, membershipBenefits, joinSteps } from '../data/platformContent'

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.benefits.title}
        description={routeSeo.benefits.description}
        path={routeSeo.benefits.path}
        keywords={[...routeSeo.benefits.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'مزايا العضوية', path: '/benefits' },
        ])}
      />

      <PageHero
        eyebrow="المزايا"
        icon={<Gift className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            من الحساب المجاني إلى{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              العضوية المهنية
            </span>
          </>
        }
        description="ابدئي مجانًا، ثم ارتقي إلى عضوية سنوية للظهور في الدليل والدورات والاستشارات وأولوية الفرص."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full rounded-[22px] bg-white hairline p-7 shadow-xs">
              <p className="text-[12px] font-bold text-rose">مجاني</p>
              <h2 className="mt-1 text-xl font-extrabold text-navy">مجتمع رائدة</h2>
              <ul className="mt-5 space-y-2.5">
                {freeCommunityBenefits.map((b) => (
                  <li key={b} className="text-sm text-muted flex gap-2">
                    <span className="text-rose">•</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Button to="/dashboard" variant="outline" size="md" className="mt-6">
                انضمي مجانًا
              </Button>
            </div>
          </Reveal>
          <Reveal>
            <div className="h-full rounded-[22px] bg-navy text-white p-7 shadow-md">
              <p className="text-[12px] font-bold text-gold">مدفوع · سنوي</p>
              <h2 className="mt-1 text-xl font-extrabold">عضوية مهنية</h2>
              <ul className="mt-5 space-y-2.5">
                {membershipBenefits.map((b) => (
                  <li key={b} className="text-sm text-white/80 flex gap-2">
                    <span className="text-gold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Button to="/membership" variant="gold" size="md" className="mt-6">
                اختاري خطتكِ
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-navy">مسار الانضمام المهني</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {joinSteps.map((s) => (
              <div key={s.step} className="rounded-[16px] bg-white hairline p-5">
                <span className="text-[11px] font-bold text-gold-dark">{s.step}</span>
                <h3 className="mt-1 font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-[13px] text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
