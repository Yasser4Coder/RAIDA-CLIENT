import { Info, ChevronLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'

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
            شبكة مهنية لرائدات الأعمال في{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              الجزائر
            </span>
          </>
        }
        description="رائدة تجمع المشاريع والخبيرات والأكاديميات والعلامات في مجتمع واحد — بثقة، انتقاء، وفرص حقيقية للنمو."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        <Reveal>
          <article className="rounded-[22px] bg-white hairline shadow-xs p-7 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy">مهمتنا</h2>
            <p className="mt-3 text-[15px] text-muted leading-relaxed">
              تمكين رائدات الأعمال من الوصول إلى المعرفة، الشبكة، والفرص — عبر منصة موثوقة تربط بين الطموح والخبرة والسوق.
            </p>
          </article>
        </Reveal>

        <Reveal>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { t: 'ثقة', d: 'عضويات مهنية بمراجعة الإدارة.' },
              { t: 'شبكة', d: 'أعضاء · خبيرات · أكاديميات · علامات.' },
              { t: 'فرص', d: 'برامج، استشارات، معارض، وشراكات.' },
            ].map((card) => (
              <article key={card.t} className="rounded-[18px] bg-white hairline p-5">
                <h3 className="font-extrabold text-navy">{card.t}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{card.d}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button to="/community" variant="outline" size="md">
              استكشفي المجتمع
            </Button>
            <Button to="/membership" variant="gold" size="md">
              خطط العضوية
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
