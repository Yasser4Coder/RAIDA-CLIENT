import { Megaphone } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Reveal from '../components/ui/Reveal'
import Badge from '../components/ui/Badge'
import SafeImg from '../components/ui/SafeImg'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import type { Announcement } from '../types/api'

function formatDate(value?: string | null) {
  if (!value) return null
  try {
    return new Intl.DateTimeFormat('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function AnnouncementCard({ item }: { item: Announcement }) {
  const dateLabel = formatDate(item.publishedAt)

  return (
    <article
      id={item.id}
      className="scroll-mt-28 rounded-[24px] bg-white hairline shadow-xs overflow-hidden"
    >
      <div className="grid md:grid-cols-12 gap-0">
        {item.image && (
          <div className="md:col-span-4 relative min-h-[220px] md:min-h-full bg-[#2a1a24]">
            <SafeImg
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-[center_18%]"
            />
          </div>
        )}
        <div className={`${item.image ? 'md:col-span-8' : 'md:col-span-12'} p-6 sm:p-8`}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant={item.featured ? 'gold' : 'rose'}>{item.category}</Badge>
            {item.source && (
              <span className="text-[12px] font-semibold text-navy/70">{item.source}</span>
            )}
            {dateLabel && <span className="text-[12px] text-muted">{dateLabel}</span>}
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-navy tracking-[-0.02em] leading-snug">
            {item.title}
          </h2>

          <div className="mt-5 text-[15px] text-muted leading-relaxed whitespace-pre-line">
            {item.body}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function AnnouncementsPage() {
  const seo = routeSeo.announcements
  const { data, loading, error, reload } = useAsyncData(() => catalogApi.announcements(), [])
  const items = data ?? []

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={[...seo.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'الإعلانات', path: '/announcements' },
        ])}
      />

      <PageHero
        eyebrow="إعلانات"
        icon={<Megaphone className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            إعلانات{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              رائدة
            </span>
          </>
        }
        description="بيانات رسمية وتعيينات ومستجدات من مؤسسة SOS Group ومجتمع رائدة."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}
        {!loading && !error && items.length === 0 && (
          <Reveal>
            <div className="rounded-[20px] bg-white hairline p-10 text-center text-muted">
              لا توجد إعلانات منشورة حالياً.
            </div>
          </Reveal>
        )}
        {items.map((item, i) => (
          <Reveal key={item.id} delay={Math.min(i, 3)}>
            <AnnouncementCard item={item} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
