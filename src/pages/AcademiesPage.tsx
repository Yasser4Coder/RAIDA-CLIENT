import { useState } from 'react'
import { School, Search, ChevronLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import MemberCard from '../components/ui/MemberCard'
import Button from '../components/ui/Button'
import { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'

export default function AcademiesPage() {
  const [search, setSearch] = useState('')

  const { data, loading, error, reload } = useAsyncData(
    () =>
      catalogApi.members({
        limit: 100,
        plan: 'ACADEMY',
        search: search.trim() || undefined,
      }),
    [search],
  )

  const academies = data?.data ?? []

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.academies.title}
        description={routeSeo.academies.description}
        path={routeSeo.academies.path}
        keywords={[...routeSeo.academies.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'الأكاديميات', path: '/academies' },
        ])}
      />

      <PageHero
        eyebrow="أكاديميات رائدة"
        icon={<School className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            دليل{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              الأكاديميات ومراكز التدريب
            </span>
          </>
        }
        description="تعرّفي على الأكاديميات الشريكة، برامجها ودوراتها، وفرص التعاون داخل مجتمع رائدة."
      >
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/membership" variant="primary" size="md">
            انضمي كأكاديمية
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </Button>
          <Button to="/programs" variant="outline" size="md">
            برامج رائدة
          </Button>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحثي عن أكاديمية..."
            className="w-full pr-11 pl-4 h-11 rounded-[14px] bg-white border border-separator text-navy placeholder:text-muted/55 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15"
          />
        </div>

        {loading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock message={error} onRetry={reload} />
        ) : academies.length === 0 ? (
          <div className="rounded-[20px] bg-white hairline p-10 text-center">
            <p className="text-navy font-bold">لا توجد أكاديميات منشورة بعد</p>
            <p className="mt-2 text-sm text-muted">
              ستظهر هنا عضويات الأكاديميات ومراكز التدريب بعد الموافقة والنشر.
            </p>
            <Button to="/programs" variant="soft" size="md" className="mt-5">
              استكشفي البرامج
            </Button>
          </div>
        ) : (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {academies.map((m) => (
              <StaggerItem key={m.id}>
                <MemberCard member={m} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  )
}
