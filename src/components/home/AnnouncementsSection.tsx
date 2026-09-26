import { Megaphone, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Reveal from '../ui/Reveal'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import SafeImg from '../ui/SafeImg'
import { LoadingBlock, ErrorBlock } from '../ui/StateBlocks'
import { useAsyncData } from '../../hooks/useAsyncData'
import { catalogApi } from '../../lib/catalog'
import { springs, useMotionSafe } from '../../lib/motion'
import type { Announcement } from '../../types/api'

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

function AnnouncementFeatured({ item }: { item: Announcement }) {
  const { reduce } = useMotionSafe()
  const dateLabel = formatDate(item.publishedAt)

  return (
    <article className="relative overflow-hidden rounded-[28px] bg-navy text-white shadow-md">
      <div
        className="pointer-events-none absolute -top-24 -left-16 w-[min(70vw,420px)] h-[420px] rounded-full bg-gold/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-10 w-[min(60vw,360px)] h-[360px] rounded-full bg-rose/25 blur-3xl"
        aria-hidden
      />

      <div className="relative grid lg:grid-cols-12 gap-0">
        <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[420px]">
          {item.image ? (
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...springs.settle, duration: 0.8 }}
            >
              <SafeImg
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-[center_18%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent lg:bg-gradient-to-l" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#2a1a24] to-navy" />
          )}
        </div>

        <div className="lg:col-span-7 relative p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="gold">{item.category}</Badge>
            {item.source && (
              <span className="text-[12px] font-semibold text-gold/90">{item.source}</span>
            )}
            {dateLabel && (
              <span className="text-[12px] text-white/45">{dateLabel}</span>
            )}
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] leading-snug">
            {item.title}
          </h3>

          {(item.excerpt || item.body) && (
            <p className="mt-4 text-[15px] text-white/70 leading-relaxed whitespace-pre-line max-w-xl">
              {item.excerpt || item.body.split('\n').filter(Boolean).slice(0, 2).join('\n')}
            </p>
          )}

          <div className="mt-7">
            <Button to={`/announcements#${item.id}`} variant="gold" size="md">
              اقرئي الإعلان كاملاً
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function AnnouncementsSection() {
  const { data, loading, error, reload } = useAsyncData(() => catalogApi.announcements(), [])
  const items = data ?? []
  const featured = items.find((a) => a.featured) || items[0]
  const rest = items.filter((a) => a.id !== featured?.id).slice(0, 3)

  if (!loading && !error && items.length === 0) return null

  return (
    <section id="announcements" className="py-16 lg:py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-rose mb-2">
                <Megaphone className="w-3.5 h-3.5" />
                إعلانات
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.03em]">
                آخر الإعلانات
              </h2>
              <p className="mt-2 text-[15px] text-muted max-w-xl leading-relaxed">
                قرارات وتعيينات وبيانات رسمية من مؤسسة SOS Group ومجتمع رائدة.
              </p>
            </div>
            <Button to="/announcements" variant="outline" size="md" className="shrink-0">
              كل الإعلانات
            </Button>
          </div>
        </Reveal>

        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}

        {featured && (
          <div className="space-y-5">
            <Reveal>
              <AnnouncementFeatured item={featured} />
            </Reveal>

            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((item, i) => (
                  <Reveal key={item.id} delay={i + 1}>
                    <Link
                      to={`/announcements#${item.id}`}
                      className="group block h-full rounded-[20px] bg-ivory p-4 hairline transition-shadow pressable-soft hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                    >
                      <div className="flex gap-3.5">
                        {item.image ? (
                          <SafeImg
                            src={item.image}
                            alt=""
                            loading="lazy"
                            className="w-20 h-20 rounded-[14px] object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-[14px] bg-rose-soft shrink-0" />
                        )}
                        <div className="min-w-0">
                          <Badge variant="soft" className="w-fit">
                            {item.category}
                          </Badge>
                          <h4 className="mt-1.5 font-bold text-[14px] text-navy leading-snug line-clamp-2 group-hover:text-rose transition-colors">
                            {item.title}
                          </h4>
                          {item.excerpt && (
                            <p className="mt-1 text-[12px] text-muted line-clamp-2">{item.excerpt}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
