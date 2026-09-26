import { useMemo, useState } from 'react'
import { School, Search, ChevronLeft, MapPin, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import SafeImg from '../components/ui/SafeImg'
import { Stagger, StaggerItem } from '../components/ui/Reveal'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { asArray } from '../lib/normalize'
import { mergeFeaturedAcademies } from '../data/featuredAcademies'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { springs, useMotionSafe } from '../lib/motion'
import type { Member } from '../types/api'

const placeholder = '/images/academies/wireframe-cps.svg'

function AcademyCard({ academy }: { academy: Member }) {
  const { reduce } = useMotionSafe()
  const programs = asArray(academy.programs).slice(0, 3)
  const isWire =
    academy.id.startsWith('wireframe-') ||
    Boolean(academy.image?.includes('/academies/wireframe-'))

  const body = (
    <>
      <div className="relative h-36 overflow-hidden">
        <SafeImg
          src={academy.cover || academy.image}
          fallback={placeholder}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
        {isWire && (
          <span className="absolute top-3 left-3 rounded-full bg-navy/80 px-2.5 py-1 text-[10px] font-semibold text-gold ring-1 ring-gold/30">
            صورة قريبًا
          </span>
        )}
        <div className="absolute bottom-3 right-3 left-3">
          <Badge variant="gold">أكاديمية</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <SafeImg
            src={academy.image}
            fallback={placeholder}
            alt={academy.name}
            className="w-14 h-14 rounded-[14px] object-cover ring-2 ring-white shadow-sm shrink-0 -mt-10 bg-navy"
          />
        </div>
        <h3 className="mt-2 text-[16px] font-extrabold text-navy tracking-[-0.02em] leading-snug">
          {academy.name}
        </h3>
        <p className="mt-1 text-[13px] text-muted">{academy.title || academy.specialty}</p>
        {academy.city && (
          <p className="mt-2 flex items-center gap-1 text-[12px] text-muted">
            <MapPin className="w-3.5 h-3.5 text-rose" />
            {academy.city}
          </p>
        )}
        {programs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {programs.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 rounded-full bg-[#F7F3EE] px-2.5 py-1 text-[11px] font-medium text-navy"
              >
                <BookOpen className="w-3 h-3 text-gold-dark" />
                {p}
              </span>
            ))}
          </div>
        )}
        {!isWire && (
          <span className="mt-auto pt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-rose">
            عرض الملف
            <ChevronLeft className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </>
  )

  const className =
    'group flex h-full flex-col overflow-hidden rounded-[22px] bg-white hairline shadow-sm pressable'

  return (
    <motion.div
      whileHover={reduce || isWire ? undefined : { y: -4 }}
      transition={springs.snappy}
      className="h-full"
    >
      {isWire ? (
        <div className={className}>{body}</div>
      ) : (
        <Link to={`/members/${academy.id}`} className={className}>
          {body}
        </Link>
      )}
    </motion.div>
  )
}

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

  const academies = useMemo(
    () => mergeFeaturedAcademies(data?.data ?? []),
    [data],
  )

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
        eyebrow="أكاديميات ومراكز تدريب"
        icon={<School className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            أكاديميات ومراكز تدريب{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              تستحق الاكتشاف
            </span>
          </>
        }
        description="مؤسسات تدريب وكوتشينق وبرامج مهنية داخل مجتمع رائدة — تعرّفي على عروضها وانضمّي لبرامجها."
      >
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/membership/academies" variant="primary" size="md">
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
            placeholder="ابحثي عن أكاديمية أو مركز تدريب..."
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
            <Button to="/membership/academies" variant="soft" size="md" className="mt-5">
              قدّمي طلب عضوية أكاديمية
            </Button>
          </div>
        ) : (
          <>
            <p className="text-center text-[13px] text-muted">
              {academies.length} أكاديمية ومركز تدريب
            </p>
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {academies.map((m) => (
                <StaggerItem key={m.id}>
                  <AcademyCard academy={m} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}
      </div>
    </div>
  )
}
