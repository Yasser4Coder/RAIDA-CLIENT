import { useParams, Link } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
import {
  Globe,
  ArrowRight,
  ExternalLink,
  Share2,
  Package,
  Sparkles,
  Newspaper,
  UserRound,
} from 'lucide-react'
import { motion } from 'motion/react'
import { InstagramIcon, LinkedinIcon } from '../components/ui/SocialIcons'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { asArray } from '../lib/normalize'
import { safeHref } from '../lib/safe'
import SafeImg from '../components/ui/SafeImg'
import SeoHead from '../components/seo/SeoHead'
import { absoluteImage, absoluteUrl, breadcrumbJsonLd } from '../lib/seo'
import { springs, useMotionSafe } from '../lib/motion'

const logoFallback =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop'
const coverFallback =
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=500&fit=crop'
const imageFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'

export default function BrandPage() {
  const { id } = useParams()
  const { reduce, fadeUp } = useMotionSafe()

  const {
    data: brand,
    loading,
    error,
    reload,
  } = useAsyncData(() => catalogApi.brand(id!), [id])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        <SeoHead title="جاري التحميل…" path={`/brands/${id || ''}`} noindex />
        <LoadingBlock />
      </div>
    )
  }

  if (error || !brand) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        <SeoHead title="العلامة غير موجودة" path={`/brands/${id || ''}`} noindex />
        <ErrorBlock message={error || 'العلامة غير موجودة'} onRetry={reload} />
      </div>
    )
  }

  const logo = brand.logo
  const cover = brand.cover
  const founder = brand.founder
  const products = asArray(brand.products)
  const services = asArray(brand.services)
  const news = asArray(brand.news)
  const website = safeHref(founder?.website)
  const instagram = safeHref(founder?.social?.instagram)
  const linkedin = safeHref(founder?.social?.linkedin)
  const hasLinks = Boolean(website || instagram || linkedin)
  const story = brand.story?.trim() || brand.description?.trim() || ''
  const description =
    brand.description?.slice(0, 160) ||
    `تعرّفي على علامة ${brand.name} ضمن مجتمع RAIDA للرائدات.`

  return (
    <div className="relative min-h-screen bg-ivory pb-20">
      <SeoHead
        title={`${brand.name} | ${brand.category}`}
        description={description}
        path={`/brands/${brand.id}`}
        image={cover || logo}
        keywords={[brand.name, brand.category, 'علامة تجارية', 'RAIDA'].filter(Boolean)}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'الرئيسية', path: '/' },
            { name: 'العلامات التجارية', path: '/brands' },
            { name: brand.name, path: `/brands/${brand.id}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: brand.name,
            description,
            image: absoluteImage(cover, coverFallback),
            logo: absoluteImage(logo, logoFallback),
            url: absoluteUrl(`/brands/${brand.id}`),
            category: brand.category,
          },
        ]}
      />

      {/* Full-bleed cover */}
      <section className="relative isolate h-[42vh] min-h-[280px] max-h-[480px] overflow-hidden pt-16">
        <SafeImg
          src={cover}
          fallback={coverFallback}
          alt={`غلاف ${brand.name}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-l from-gold/15 via-transparent to-rose/10 mix-blend-soft-light" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ivory to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-5 sm:py-6">
          <nav className="flex items-center gap-2 text-[12px] text-white/75">
            <Link to="/brands" className="hover:text-white transition-colors pressable-soft">
              العلامات التجارية
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-white font-medium truncate max-w-[50vw]">{brand.name}</span>
          </nav>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28">
        <motion.header
          className="rounded-[24px] bg-white/95 backdrop-blur-xl hairline shadow-md overflow-hidden"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={springs.settle}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-l from-gold via-rose to-transparent" />
          <div className="p-5 sm:p-7 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-end">
            <SafeImg
              src={logo}
              fallback={logoFallback}
              alt={brand.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-[20px] object-cover ring-4 ring-white shadow-elevated shrink-0 -mt-2 sm:-mt-4"
            />

            <div className="flex-1 min-w-0">
              <Badge variant="gold">{brand.category}</Badge>
              <h1 className="mt-2.5 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-navy tracking-[-0.03em] leading-[1.1]">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="mt-3 text-[15px] sm:text-base text-muted leading-relaxed max-w-2xl line-clamp-3">
                  {brand.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {website && (
                <Button href={website} variant="gold" size="md" target="_blank" rel="noreferrer">
                  زيارة الموقع <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              {founder && (
                <Button to={`/members/${founder.id}`} variant="outline" size="md">
                  <UserRound className="w-4 h-4" /> المؤسسة
                </Button>
              )}
              <ShareBrandButton name={brand.name} />
            </div>
          </div>
        </motion.header>

        <div className="mt-8 lg:mt-10 grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-10">
          <div className="space-y-12 sm:space-y-14 min-w-0">
            {/* Story — one job */}
            <motion.section
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={springs.settle}
            >
              <SectionLabel>قصة العلامة</SectionLabel>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em]">
                من أين بدأت {brand.name}
              </h2>
              {story ? (
                <p className="mt-5 text-[16px] sm:text-[17px] text-navy/75 leading-[1.85] max-w-3xl whitespace-pre-line">
                  {story}
                </p>
              ) : (
                <p className="mt-5 text-muted">لم تُضف قصة العلامة بعد.</p>
              )}
            </motion.section>

            {/* Products */}
            {products.length > 0 && (
              <motion.section
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={springs.settle}
              >
                <div className="flex items-end justify-between gap-4 mb-5">
                  <div>
                    <SectionLabel icon={<Package className="w-3.5 h-3.5" />}>المنتجات</SectionLabel>
                    <h2 className="mt-2 text-2xl font-extrabold text-navy tracking-[-0.02em]">
                      ماذا تقدّم العلامة
                    </h2>
                  </div>
                  <span className="text-[12px] font-semibold text-muted tabular-nums">
                    {products.length}
                  </span>
                </div>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {products.map((p, i) => (
                    <li
                      key={p}
                      className="group relative flex items-start gap-3.5 rounded-[16px] bg-white hairline px-4 py-4 transition-colors hover:bg-blush/40"
                    >
                      <span className="mt-0.5 w-8 h-8 rounded-[10px] bg-navy text-gold text-[12px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[15px] font-semibold text-navy leading-snug pt-1">{p}</p>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Services */}
            {services.length > 0 && (
              <motion.section
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={springs.settle}
              >
                <SectionLabel icon={<Sparkles className="w-3.5 h-3.5" />}>الخدمات</SectionLabel>
                <h2 className="mt-2 text-2xl font-extrabold text-navy tracking-[-0.02em]">
                  مجالات العمل
                </h2>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {services.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-full bg-white hairline px-4 py-2 text-[13px] font-semibold text-navy shadow-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* News */}
            {news.length > 0 && (
              <motion.section
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={springs.settle}
              >
                <SectionLabel icon={<Newspaper className="w-3.5 h-3.5" />}>الأخبار</SectionLabel>
                <h2 className="mt-2 text-2xl font-extrabold text-navy tracking-[-0.02em]">
                  آخر المستجدات
                </h2>
                <ol className="mt-6 relative space-y-0 border-r border-navy/10 mr-3">
                  {news.map((n) => (
                    <li key={n} className="relative pr-8 pb-6 last:pb-0">
                      <span className="absolute right-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-ivory" />
                      <p className="text-[15px] font-medium text-navy leading-relaxed">{n}</p>
                    </li>
                  ))}
                </ol>
              </motion.section>
            )}
          </div>

          {/* Sticky aside */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {founder && (
              <motion.div
                className="rounded-[20px] bg-white hairline shadow-xs overflow-hidden"
                whileHover={reduce ? undefined : { y: -2 }}
                transition={springs.snappy}
              >
                <div className="px-5 pt-5 pb-3">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                    المؤسسة
                  </p>
                </div>
                <Link
                  to={`/members/${founder.id}`}
                  className="flex items-center gap-4 px-5 pb-5 group pressable-soft"
                >
                  <SafeImg
                    src={founder.image}
                    fallback={imageFallback}
                    alt={founder.name}
                    className="w-14 h-14 rounded-[14px] object-cover ring-1 ring-navy/8 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-navy group-hover:text-gold-dark transition-colors truncate">
                      {founder.name}
                    </p>
                    <p className="text-[13px] text-muted mt-0.5 truncate">{founder.title}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted rotate-180 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            )}

            <div className="rounded-[20px] bg-navy text-white p-5 sm:p-6 shadow-sm ring-1 ring-gold/20">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold/80 uppercase">
                تواصلي
              </p>
              <p className="mt-2 text-[15px] font-semibold leading-snug text-white/90">
                اكتشفِ المزيد عن {brand.name}
              </p>

              {hasLinks ? (
                <div className="mt-5 space-y-2">
                  {website && (
                    <AsideLink href={website} icon={<Globe className="w-4 h-4" />}>
                      الموقع الإلكتروني
                    </AsideLink>
                  )}
                  {instagram && (
                    <AsideLink href={instagram} icon={<InstagramIcon className="w-4 h-4" />}>
                      Instagram
                    </AsideLink>
                  )}
                  {linkedin && (
                    <AsideLink href={linkedin} icon={<LinkedinIcon className="w-4 h-4" />}>
                      LinkedIn
                    </AsideLink>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-[13px] text-white/50">لا توجد روابط عامة بعد.</p>
              )}

              {website ? (
                <Button
                  href={website}
                  variant="gold"
                  size="md"
                  className="w-full mt-5"
                  target="_blank"
                  rel="noreferrer"
                >
                  زيارة الموقع
                </Button>
              ) : founder ? (
                <Button to={`/members/${founder.id}`} variant="gold" size="md" className="w-full mt-5">
                  ملف المؤسسة
                </Button>
              ) : null}
            </div>

            <Link
              to="/brands"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-navy/70 hover:text-navy transition-colors px-1"
            >
              <ArrowRight className="w-4 h-4" /> كل العلامات التجارية
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({
  children,
  icon,
}: {
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
      {icon}
      {children}
    </p>
  )
}

function AsideLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-[12px] bg-white/[0.06] hover:bg-white/[0.1] ring-1 ring-white/10 px-3.5 py-2.5 text-[13px] font-medium text-white/85 hover:text-white transition-colors"
    >
      <span className="text-gold shrink-0">{icon}</span>
      <span className="flex-1 truncate">{children}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-50 shrink-0" />
    </a>
  )
}

function ShareBrandButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* user cancelled share */
    }
  }

  return (
    <Button variant="soft" size="md" onClick={share} aria-label="مشاركة">
      <Share2 className="w-4 h-4" />
      {copied ? 'تم النسخ' : 'مشاركة'}
    </Button>
  )
}
