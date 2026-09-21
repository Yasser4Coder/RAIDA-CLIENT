import { useState } from 'react'
import { GraduationCap, Search, ChevronLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import MemberCard from '../components/ui/MemberCard'
import Button from '../components/ui/Button'
import { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { expertAccreditation, expertSpecialties } from '../data/platformContent'

export default function ExpertsPage() {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')

  const filtersKey = `${search}|${specialty}`
  const { data, loading, error, reload } = useAsyncData(
    () =>
      catalogApi.members({
        limit: 100,
        plan: 'EXPERT',
        search: search.trim() || undefined,
        category: specialty || undefined,
      }),
    [filtersKey],
  )

  const experts = data?.data ?? []

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.experts.title}
        description={routeSeo.experts.description}
        path={routeSeo.experts.path}
        keywords={[...routeSeo.experts.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'خبيرات رائدة', path: '/experts' },
        ])}
      />

      <PageHero
        eyebrow="خبيرات رائدة"
        icon={<GraduationCap className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            شبكة{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              المدربات والمستشارات
            </span>
          </>
        }
        description="اكتشفي خبيرات رائدة حسب التخصص، واطلعي على ملفهن المهني، واطلبي استشارة أو برنامجًا تدريبيًا."
      >
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/membership" variant="primary" size="md">
            انضمي كخبيرة
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
          <Button to="/consultations" variant="gold" size="md">
            اطلبي استشارة
          </Button>
          <Button to="/services" variant="outline" size="md">
            دليل الخدمات
          </Button>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        <div className="rounded-[20px] bg-white hairline shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحثي بالاسم أو التخصص..."
              className="w-full pr-11 pl-4 h-11 rounded-[14px] bg-white/85 border border-separator text-navy placeholder:text-muted/55 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15"
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="h-11 rounded-[14px] border border-separator bg-white px-3 text-sm text-navy min-w-[200px]"
          >
            <option value="">كل التخصصات</option>
            {expertSpecialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock message={error} onRetry={reload} />
        ) : experts.length === 0 ? (
          <div className="rounded-[20px] bg-white hairline p-10 text-center">
            <p className="text-navy font-bold">لا توجد خبيرات معتمدات للعرض بعد</p>
            <p className="mt-2 text-sm text-muted">سيظهر هنا أعضاء عضوية المدربين والخبراء بعد الموافقة.</p>
            <Button to="/members" variant="soft" size="md" className="mt-5">
              تصفحي دليل الأعضاء
            </Button>
          </div>
        ) : (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {experts.map((m) => (
              <StaggerItem key={m.id}>
                <MemberCard member={m} />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <section>
          <div className="text-center mb-8">
            <p className="text-[12px] font-semibold text-rose">الاعتماد المهني</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-navy">خبيرة · مدربة · مستشارة</h2>
            <p className="mt-2 text-sm text-muted max-w-xl mx-auto">
              العضوية تمنحكِ الظهور. تقديم برامج أو استشارات باسم رائدة يتطلب اعتمادًا مهنيًا منفصلًا.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {expertAccreditation.map((card) => (
              <article key={card.title} className="rounded-[20px] bg-white hairline shadow-xs p-6 flex flex-col">
                <h3 className="font-extrabold text-navy text-lg">{card.title}</h3>
                <p className="mt-2 text-gold-dark font-bold text-sm">{card.price}</p>
                {card.original ? (
                  <p className="text-[12px] text-muted line-through">{card.original}</p>
                ) : null}
                <p className="mt-3 text-[13px] text-muted leading-relaxed">{card.note}</p>
                <ul className="mt-4 space-y-2 flex-1">
                  {card.points.map((p) => (
                    <li key={p} className="text-[13px] text-dark flex gap-2">
                      <span className="text-rose">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
