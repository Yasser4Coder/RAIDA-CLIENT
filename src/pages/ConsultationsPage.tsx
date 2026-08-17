import { MessageSquare, ChevronLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import ConsultationRequestForm from '../components/ui/ConsultationRequestForm'
import Reveal from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'

export default function ConsultationsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.consultations.title}
        description={routeSeo.consultations.description}
        path={routeSeo.consultations.path}
        keywords={[...routeSeo.consultations.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'الاستشارات', path: '/consultations' },
        ])}
      />

      <PageHero
        eyebrow="الاستشارات"
        icon={<MessageSquare className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            احصلي على استشارة من{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              رائدة أو خبيرة
            </span>
          </>
        }
        description="المسار: المجال → الخبيرة أو إدارة رائدة → الوقت → Online/حضوري → الدفع → الجلسة."
      >
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/experts" variant="outline" size="md">
            تصفحي الخبيرات
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
          <Button to="/dashboard" variant="soft" size="md">
            صندوق استشاراتكِ
          </Button>
        </div>
      </PageHero>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal>
          <div className="rounded-[22px] bg-white hairline shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy">طلب استشارة</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              اختاري إرسال الطلب إلى <strong className="text-navy font-semibold">إدارة رائدة</strong> أو إلى
              خبيرة محددة من الشبكة.
            </p>
            <div className="mt-6">
              <ConsultationRequestForm target="choose" />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
