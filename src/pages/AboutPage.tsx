import { Info, ChevronLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { membershipBenefits } from '../data/platformContent'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.about.title}
        description={routeSeo.about.description}
        path={routeSeo.about.path}
        keywords={[...routeSeo.about.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'عن رائدة', path: '/about' },
        ])}
      />

      <PageHero
        eyebrow="عن رائدة"
        icon={<Info className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            مجتمع · معرفة · فرص و{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              نمو
            </span>
          </>
        }
        description="رائدة لا تجمع الأعضاء فقط — تبني شبكة مهنية منتقاة تجمع المشاريع والخبيرات والأكاديميات والعلامات التجارية في مجتمع واحد."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        <Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                t: 'مجتمع مفتوح',
                d: 'حساب مجاني للجميع لمتابعة المحتوى والفرص والفعاليات والتعرف على الشبكة.',
              },
              {
                t: 'عضويات مهنية',
                d: 'ثلاث عضويات سنوية: أعمال، مدربات/خبيرات، وأكاديميات — بموافقة الإدارة.',
              },
              {
                t: 'منصة فرص',
                d: 'برامج تدريبية، استشارات، معارض، شراكات، وSOS Store لتنمية المشاريع.',
              },
            ].map((card) => (
              <article key={card.t} className="rounded-[20px] bg-white hairline shadow-xs p-6">
                <h2 className="font-extrabold text-navy text-lg">{card.t}</h2>
                <p className="mt-2 text-sm text-muted leading-relaxed">{card.d}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-[22px] bg-white hairline p-8 shadow-sm">
            <h2 className="text-xl font-extrabold text-navy">ماذا تقدّم العضوية؟</h2>
            <ul className="mt-5 grid sm:grid-cols-2 gap-3">
              {membershipBenefits.map((b) => (
                <li key={b} className="text-sm text-navy flex gap-2 items-start">
                  <span className="text-rose mt-0.5">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button to="/community" variant="outline" size="md">
                استكشفي المجتمع
              </Button>
              <Button to="/membership" variant="gold" size="md">
                انضمي إلى رائدة
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
