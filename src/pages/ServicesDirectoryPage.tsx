import { Link } from 'react-router-dom'
import {
  Briefcase,
  ChevronLeft,
  Megaphone,
  Scale,
  MonitorSmartphone,
  ShoppingBag,
  GraduationCap,
  LineChart,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { serviceDomains } from '../data/platformContent'

const domainIcons: Record<string, typeof Briefcase> = {
  business: Briefcase,
  marketing: Megaphone,
  legal: Scale,
  tech: MonitorSmartphone,
  ecommerce: ShoppingBag,
  training: GraduationCap,
  finance: LineChart,
}

export default function ServicesDirectoryPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.services.title}
        description={routeSeo.services.description}
        path={routeSeo.services.path}
        keywords={[...routeSeo.services.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'دليل الخدمات', path: '/services' },
        ])}
      />

      <PageHero
        eyebrow="دليل الخدمات"
        icon={<Briefcase className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            ابحثي عن الخدمة المناسبة{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              لمشروعكِ
            </span>
          </>
        }
        description="اكتشفي شبكة من الخبيرات والمدربات والأكاديميات ومقدّمي الخدمات — اختاري الشريك المناسب لتطوير مشروعكِ."
      >
        <p className="mt-5 text-sm font-semibold text-navy/70">اختاري — تواصلي — طوّري مشروعكِ</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/experts" variant="primary" size="md">
            تصفحي الخبيرات
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
          <Button to="/members" variant="outline" size="md">
            دليل الأعضاء
          </Button>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal className="mb-8 text-center">
          <p className="text-[12px] font-semibold text-rose">تصفحي حسب المجال</p>
          <h2 className="mt-1 text-2xl font-extrabold text-navy">مجالات الخدمات</h2>
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceDomains.map((domain) => (
            <StaggerItem key={domain.title}>
              <article className="h-full rounded-[20px] bg-white hairline shadow-xs p-6 flex flex-col">
                {(() => {
                  const Icon = domainIcons[domain.key] ?? Briefcase
                  return (
                    <div className="mb-3 w-10 h-10 rounded-[12px] bg-rose-soft flex items-center justify-center">
                      <Icon className="w-5 h-5 text-rose" />
                    </div>
                  )
                })()}
                <h3 className="font-extrabold text-navy text-lg leading-snug">{domain.title}</h3>
                <ul className="mt-4 space-y-2 flex-1">
                  {domain.items.map((item) => (
                    <li key={item} className="text-[13px] text-muted flex gap-2">
                      <span className="text-rose shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/experts`}
                  className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-rose pressable-soft"
                >
                  اعثري على خبيرة
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-14 rounded-[22px] bg-navy text-white p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-extrabold">رائدة تربطكِ بمن يساعد مشروعكِ على النمو</h2>
          <p className="mt-2 text-white/65 text-sm max-w-lg mx-auto">
            ابحثي حسب الخدمة أو المجال أو الولاية، ثم اطّلعي على الملف المهني ومعلومات التواصل.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button to="/dashboard" variant="gold" size="md">
              انضمي مجانًا
            </Button>
            <Button to="/sos-store" variant="glass" size="md" className="!text-white !border-white/25 !bg-white/10">
              SOS Store
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
