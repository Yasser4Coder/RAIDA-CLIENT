import { ShoppingBag, ChevronLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { sosStoreBenefits } from '../data/platformContent'

export default function SosStorePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.sosStore.title}
        description={routeSeo.sosStore.description}
        path={routeSeo.sosStore.path}
        keywords={[...routeSeo.sosStore.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'SOS Store', path: '/sos-store' },
        ])}
      />

      <PageHero
        eyebrow="SOS Store"
        icon={<ShoppingBag className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            متجركِ الإلكتروني ضمن{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              منظومة رائدة
            </span>
          </>
        }
        description="عضوات رائدة يمكنهن التقديم لفتح متجر على SOS Store: عرض المنتجات، استقبال الطلبات، والوصول إلى العملاء مع الترويج داخل المجتمع."
      >
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/membership" variant="gold" size="lg">
            اطلبي العضوية للتقديم
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
          <Button to="/brands" variant="outline" size="lg">
            تصفحي العلامات
          </Button>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-10">
        <Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {sosStoreBenefits.map((b) => (
              <div
                key={b}
                className="rounded-[16px] bg-white hairline shadow-xs px-4 py-5 text-center text-sm font-semibold text-navy"
              >
                {b}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-[22px] bg-white hairline shadow-sm p-8 sm:p-10 max-w-3xl mx-auto">
            <p className="text-[12px] font-semibold text-rose">كيف تبدأين؟</p>
            <ol className="mt-4 space-y-3 text-sm text-muted leading-relaxed list-decimal list-inside">
              <li>انضمي إلى عضوية رائدة للأعمال (أو الخبيرة / الأكاديمية حسب نشاطكِ).</li>
              <li>بعد الموافقة وتفعيل العضوية، قدّمي طلب فتح متجر من لوحة التحكم.</li>
              <li>راجع فريق رائدة / SOS الطلب وفعّل المتجر عند الاستيفاء.</li>
            </ol>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button to="/dashboard" variant="primary" size="md">
                لوحة التحكم
              </Button>
              <Button to="/services" variant="soft" size="md">
                خدمات التجارة الإلكترونية
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
