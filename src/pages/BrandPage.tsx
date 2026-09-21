import { useParams, Link } from 'react-router-dom'
import { Globe, ArrowRight, ExternalLink } from 'lucide-react'
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

const logoFallback =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop'
const coverFallback =
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=500&fit=crop'
const imageFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'

export default function BrandPage() {
  const { id } = useParams()

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
  const gallery = [cover, logo, founder?.image].filter(Boolean)
  const description =
    brand.description?.slice(0, 160) ||
    `تعرّفي على علامة ${brand.name} ضمن مجتمع RAIDA للرائدات.`

  return (
    <div className="pt-20 pb-16 min-h-screen bg-ivory">
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
      {/* Cover */}
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
        <SafeImg src={cover} fallback={coverFallback} alt={`غلاف ${brand.name}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <div className="flex items-end gap-5">
            <SafeImg
              src={logo}
              fallback={logoFallback}
              alt=""
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-[18px] object-cover border-4 border-white shadow-elevated"
            />
            <div className="pb-1">
              <Badge variant="gold">{brand.category}</Badge>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">{brand.name}</h1>
              <p className="text-white/70 text-sm mt-1 max-w-lg hidden sm:block">{brand.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Story */}
            <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
              <h2 className="text-xl font-bold text-navy mb-4">قصة العلامة</h2>
              <p className="text-muted leading-relaxed text-base">{brand.story || brand.description}</p>
            </section>

            {/* Products */}
            {products.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
                <h2 className="text-xl font-bold text-navy mb-5">المنتجات</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {products.map((p, i) => (
                    <div key={p} className="group rounded-[16px] overflow-hidden border border-rose/10 card-hover">
                      <div className="h-32 bg-gradient-to-br from-rose-soft to-blush overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-${['1596462502278-27bfdc403348', '1522335789203-aabd1fc54bc9', '1490481651871-ab68de25d43d'][i % 3]}?w=400&h=300&fit=crop`}
                          alt={p}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-navy text-sm">{p}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {services.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
                <h2 className="text-xl font-bold text-navy mb-4">الخدمات</h2>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <Badge key={s} variant="rose">{s}</Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
              <h2 className="text-xl font-bold text-navy mb-5">المعرض</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((img, i) => (
                  <div key={i} className={`rounded-[14px] overflow-hidden ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''} aspect-square sm:aspect-auto`}>
                    <SafeImg src={img} fallback={imageFallback} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 min-h-[120px]" />
                  </div>
                ))}
              </div>
            </section>

            {/* News */}
            {news.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
                <h2 className="text-xl font-bold text-navy mb-4">الأخبار</h2>
                <div className="space-y-3">
                  {news.map((n) => (
                    <div key={n} className="flex items-center gap-3 p-4 rounded-[12px] bg-rose-soft/40 border border-rose/10">
                      <div className="w-2 h-2 rounded-full bg-rose shrink-0" />
                      <p className="text-sm text-navy font-medium">{n}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            {/* Founder */}
            {founder && (
              <div className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h3 className="font-bold text-navy mb-4">المؤسسة</h3>
                <Link to={`/members/${founder.id}`} className="flex items-center gap-4 group">
                  <SafeImg
                    src={founder.image}
                    fallback={imageFallback}
                    alt={founder.name}
                    className="w-16 h-16 rounded-[14px] object-cover"
                  />
                  <div>
                    <p className="font-bold text-navy group-hover:text-gold-dark transition-colors">{founder.name}</p>
                    <p className="text-sm text-muted">{founder.title}</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Links */}
            <div className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h3 className="font-bold text-navy mb-4">الروابط</h3>
              <div className="space-y-3">
                {safeHref(founder?.website) && (
                  <a
                    href={safeHref(founder?.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark"
                  >
                    <Globe className="w-4 h-4 text-rose" /> الموقع الإلكتروني
                    <ExternalLink className="w-3 h-3 mr-auto" />
                  </a>
                )}
                {safeHref(founder?.social?.instagram) && (
                  <a
                    href={safeHref(founder?.social?.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark"
                  >
                    <InstagramIcon className="w-4 h-4 text-rose" /> Instagram
                  </a>
                )}
                {safeHref(founder?.social?.linkedin) && (
                  <a
                    href={safeHref(founder?.social?.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark"
                  >
                    <LinkedinIcon className="w-4 h-4 text-rose" /> LinkedIn
                  </a>
                )}
                {!safeHref(founder?.website) && !safeHref(founder?.social?.instagram) && !safeHref(founder?.social?.linkedin) && (
                  <p className="text-sm text-muted">لا توجد روابط بعد.</p>
                )}
              </div>
              {founder?.website ? (
                <Button href={founder.website} variant="gold" size="md" className="w-full mt-5">
                  زيارة الموقع
                </Button>
              ) : founder ? (
                <Button to={`/members/${founder.id}`} variant="gold" size="md" className="w-full mt-5">
                  تواصلي مع المؤسسة
                </Button>
              ) : null}
            </div>

            <Link to="/brands" className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark">
              <ArrowRight className="w-4 h-4" /> كل العلامات
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
