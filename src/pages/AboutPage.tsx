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
        keywords={[...routeSeo.about.keywords, 'SOS Group']}
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
          <article className="relative overflow-hidden rounded-[22px] bg-navy text-white p-7 sm:p-9 ring-1 ring-gold/25">
            <div
              className="pointer-events-none absolute -top-20 left-1/4 w-56 h-56 rounded-full bg-gold/15 blur-3xl"
              aria-hidden
            />
            <p className="relative text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">
              الابتكار والملكية
            </p>
            <h2 className="relative mt-3 text-2xl sm:text-[1.75rem] font-extrabold tracking-[-0.02em] leading-snug">
              رائدة من ابتكار SOS Group
            </h2>
            <p className="relative mt-4 text-[15px] text-white/75 leading-relaxed">
              منصّة <span className="text-white font-semibold">RAIDA رائدة</span> ابتُكرت وأنشئت
              بواسطة <span className="text-gold font-semibold">SOS Group</span> — مجموعة متخصصة في
              بناء حلول ومجتمعات تدعم ريادة الأعمال النسائية في الجزائر.
            </p>
            <p className="relative mt-3 text-[14px] text-white/55 leading-relaxed">
              الرؤية، الهوية، والمنظومة التشغيلية للمنصّة هي نتاج ابتكار SOS Group، بما في ذلك
              التكامل مع حلول مثل SOS Store ضمن منظومة واحدة.
            </p>
          </article>
        </Reveal>

        <Reveal>
          <article className="rounded-[22px] bg-white hairline shadow-xs p-7 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy">مهمتنا</h2>
            <p className="mt-3 text-[15px] text-muted leading-relaxed">
              تمكين رائدات الأعمال من الوصول إلى المعرفة، الشبكة، والفرص — عبر منصة موثوقة تربط بين
              الطموح والخبرة والسوق.
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
