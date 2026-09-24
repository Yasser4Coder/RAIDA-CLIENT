import { useRef, useState } from 'react'
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
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import ServiceRequestForm from '../components/ui/ServiceRequestForm'
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
  const formRef = useRef<HTMLDivElement>(null)
  const [preset, setPreset] = useState('')

  const startRequest = (service?: string) => {
    if (service) setPreset(service)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.services.title}
        description="اطلبي خدمة لمشروعكِ — محاسبة، تصميم، قانون، تسويق، مواقع… وتصل الطلبات إلى الخبيرات المناسبات عبر رائدة."
        path={routeSeo.services.path}
        keywords={[...routeSeo.services.keywords, 'اطلبي خدمة']}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'الخدمات', path: '/services' },
        ])}
      />

      <section className="relative isolate overflow-hidden pt-28 pb-10 sm:pb-12">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
          <div className="hero-mesh absolute inset-0 opacity-80" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[12px] font-semibold text-gold-dark tracking-[0.14em] uppercase mb-3">
            اطلبي خدمة
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.15] max-w-3xl">
            طلبي يصل إلى الخبيرة المناسبة
          </h1>
          <p className="mt-3 text-lg text-muted max-w-2xl leading-relaxed">
            لم يعد دليل الخدمات عرضًا فقط — صفي احتياجكِ، وسنوجّه الطلب عبر إدارة رائدة إلى الشبكة المهنية.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="gold" size="lg" onClick={() => startRequest()}>
              ابدئي الطلب
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Button>
            <Button to="/experts" variant="outline" size="lg">
              تصفح الخبراء
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        <section>
          <Reveal>
            <div className="mb-8">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">المجالات</p>
              <h2 className="mt-2 text-3xl font-extrabold text-navy tracking-[-0.02em]">ماذا تحتاجين؟</h2>
            </div>
          </Reveal>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceDomains.map((domain) => {
              const Icon = domainIcons[domain.key] ?? Briefcase
              return (
                <StaggerItem key={domain.title}>
                  <article className="h-full rounded-[20px] bg-white hairline shadow-xs p-6 flex flex-col">
                    <div className="mb-3 w-10 h-10 rounded-[12px] bg-navy text-gold flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-navy text-lg leading-snug">{domain.title}</h3>
                    <ul className="mt-4 space-y-2 flex-1">
                      {domain.items.slice(0, 4).map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            onClick={() => startRequest(item)}
                            className="text-[13px] text-muted hover:text-navy text-right w-full flex gap-2 pressable-soft"
                          >
                            <span className="text-gold-dark shrink-0">+</span>
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => startRequest(domain.items[0])}
                      className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-rose pressable-soft"
                    >
                      اطلبي من هذا المجال
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </article>
                </StaggerItem>
              )
            })}
          </Stagger>
        </section>

        <section
          ref={formRef}
          id="request"
          className="scroll-mt-28 grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8"
        >
          <Reveal>
            <div className="rounded-[24px] bg-white hairline shadow-sm overflow-hidden">
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-navy/6">
                <h2 className="text-2xl font-extrabold text-navy tracking-[-0.02em]">نموذج طلب خدمة</h2>
                <p className="mt-1.5 text-sm text-muted">
                  يُرسل الطلب إلى إدارة رائدة لتوجيهه إلى الخبيرة المناسبة.
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <ServiceRequestForm key={preset || 'default'} presetService={preset} />
              </div>
            </div>
          </Reveal>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[20px] bg-navy text-white p-5 ring-1 ring-gold/20">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold/80 uppercase">لماذا عبر رائدة؟</p>
              <ul className="mt-4 space-y-2 text-[13px] text-white/75 leading-relaxed">
                <li>توجيه لاحتياجكِ الحقيقي</li>
                <li>شبكة خبيرات معتمدة</li>
                <li>متابعة من لوحة التحكم</li>
                <li>عمولة المنصة عند إتمام الخدمة</li>
              </ul>
              <Button to="/consultations" variant="gold" size="md" className="w-full mt-5">
                أو اطلبي استشارة
              </Button>
            </div>
            <div className="rounded-[20px] bg-white hairline p-5 text-sm text-muted leading-relaxed">
              تبحثين عن خبيرة بعينها؟{' '}
              <Link to="/experts" className="font-semibold text-navy hover:text-gold-dark">
                دليل الخبراء
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
