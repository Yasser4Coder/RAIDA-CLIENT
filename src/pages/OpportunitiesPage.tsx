import { Trophy, ChevronLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { opportunities as fallbackOpportunities } from '../data/platformContent'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'

export default function OpportunitiesPage() {
  const { data: apiOpportunities } = useAsyncData(() => catalogApi.opportunities(), [])
  const opportunities =
    apiOpportunities && apiOpportunities.length > 0 ? apiOpportunities : fallbackOpportunities

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.opportunities.title}
        description={routeSeo.opportunities.description}
        path={routeSeo.opportunities.path}
        keywords={[...routeSeo.opportunities.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'الفرص', path: '/opportunities' },
        ])}
      />

      <PageHero
        eyebrow="الفرص"
        icon={<Trophy className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            معارض · مسابقات · تمويل ·{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              شراكات
            </span>
          </>
        }
        description="اطّلعي على فرص المشاركة في المعارض والملتقيات والمسابقات والتمويل ودعوات التقديم وSOS Store."
      >
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/membership" variant="gold" size="md">
            أولوية للأعضاء
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
          <Button to="/events" variant="outline" size="md">
            الفعاليات
          </Button>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((item) => (
            <StaggerItem key={item.id}>
              <article className="h-full rounded-[20px] bg-white hairline shadow-xs p-6 flex flex-col">
                <span className="inline-flex self-start rounded-full bg-rose-soft px-2.5 py-1 text-[11px] font-bold text-rose">
                  {item.type}
                </span>
                <h3 className="mt-3 font-extrabold text-navy text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{item.description}</p>
                <Button to="/dashboard" variant="soft" size="sm" className="mt-5 self-start">
                  سجّلي اهتمامكِ
                </Button>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12 rounded-[22px] bg-white hairline p-8 text-center shadow-xs">
          <h2 className="text-xl font-extrabold text-navy">عضوية رائدة تمنحكِ أولوية الفرص</h2>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            المعارض، الملتقيات، برامج الشراكة، وطلبات SOS Store — أولوية للعضوات المعتمدات.
          </p>
          <Button to="/membership" variant="primary" size="md" className="mt-5">
            اعرفي المزايا
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
        </Reveal>
      </div>
    </div>
  )
}
