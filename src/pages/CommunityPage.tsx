import { Link } from 'react-router-dom'
import { Users, ChevronLeft, Sparkles } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { freeCommunityBenefits, joinSteps } from '../data/platformContent'

const hubs = [
  { to: '/members', label: 'دليل الأعضاء', desc: 'رائدات أعمال ومشاريع' },
  { to: '/experts', label: 'خبيرات رائدة', desc: 'مدربات ومستشارات' },
  { to: '/academies', label: 'الأكاديميات', desc: 'مراكز تدريب وبرامج' },
  { to: '/brands', label: 'العلامات', desc: 'منتجات وخدمات' },
  { to: '/programs', label: 'البرامج', desc: 'دورات وورشات' },
  { to: '/opportunities', label: 'الفرص', desc: 'معارض وتمويل وشراكات' },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.community.title}
        description={routeSeo.community.description}
        path={routeSeo.community.path}
        keywords={[...routeSeo.community.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'المجتمع', path: '/community' },
        ])}
      />

      <PageHero
        eyebrow="مجتمع رائدة"
        icon={<Users className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            مجتمع مفتوح للجميع —{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              الانضمام مجاني
            </span>
          </>
        }
        description="أنشئي حسابًا مجانيًا، تابعي المحتوى والفرص، وتعرّفي على الخبيرات والأكاديميات والعلامات. العضويات المهنية اختيارية بعد ذلك."
      >
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/dashboard" variant="primary" size="lg">
            انضمي مجانًا
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
          <Button to="/membership" variant="outline" size="lg">
            اعرفي العضويات المهنية
          </Button>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        <Reveal>
          <div className="rounded-[22px] bg-white hairline shadow-sm p-6 sm:p-8">
            <p className="text-[12px] font-semibold text-rose mb-2">ماذا تستفيدين مجانًا؟</p>
            <h2 className="text-2xl font-extrabold text-navy tracking-tight">حساب مجاني = دخول إلى المجتمع</h2>
            <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {freeCommunityBenefits.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 rounded-[14px] bg-rose-soft/50 px-4 py-3 text-sm text-navy"
                >
                  <Sparkles className="w-4 h-4 text-rose shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div>
          <div className="text-center mb-8">
            <p className="text-[12px] font-semibold text-rose">استكشفي</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-navy">بوابات المجتمع</h2>
          </div>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hubs.map((hub) => (
              <StaggerItem key={hub.to}>
                <Link
                  to={hub.to}
                  className="block rounded-[18px] bg-white hairline shadow-xs p-5 hover:shadow-md transition-shadow pressable-soft"
                >
                  <p className="font-bold text-navy">{hub.label}</p>
                  <p className="mt-1 text-sm text-muted">{hub.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-rose">
                    ادخلي
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal>
          <div className="text-center mb-8">
            <p className="text-[12px] font-semibold text-rose">للعضويات المهنية</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-navy">كيف تنضمين؟</h2>
            <p className="mt-2 text-muted text-sm max-w-lg mx-auto">
              طلب الانضمام → دراسة الطلب → جلسة عمل Online → تفعيل العضوية
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {joinSteps.map((step) => (
              <div key={step.step} className="rounded-[18px] bg-white hairline p-5 shadow-xs">
                <span className="text-[11px] font-bold text-gold-dark tracking-wider">{step.step}</span>
                <h3 className="mt-2 font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button to="/membership" variant="gold" size="md">
              اطلبي عضوية مهنية
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
