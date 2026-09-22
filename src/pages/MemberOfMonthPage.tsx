import { Link } from 'react-router-dom'
import { Sparkles, ChevronLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import SafeImg from '../components/ui/SafeImg'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd } from '../lib/seo'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'

const imageFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop'

export default function MemberOfMonthPage() {
  const { data: stories, loading, error, reload } = useAsyncData(
    () => catalogApi.successStories(),
    [],
  )

  const featured =
    stories?.find((s) => s.featured) ||
    stories?.find((s) => /شهر|رائدة الشهر/i.test(s.category)) ||
    stories?.[0]

  const others = (stories ?? []).filter((s) => s.id !== featured?.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title="رائدة الشهر | رائدة"
        description="كل شهر نسلّط الضوء على عضوة وإنجازاتها ومشروعها داخل مجتمع رائدة."
        path="/member-of-month"
        image={featured?.image}
        keywords={['رائدة الشهر', 'قصة نجاح', 'RAIDA']}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'رائدة الشهر', path: '/member-of-month' },
        ])}
      />

      <section className="relative isolate overflow-hidden pt-28 pb-10">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-gold/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            تسليط ضوء شهري
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight max-w-2xl">
            رائدة الشهر
          </h1>
          <p className="mt-3 text-lg text-muted max-w-xl leading-relaxed">
            قصة · مشروع · إنجازات — قيمة تسويقية حقيقية للعضوية المهنية.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading && <LoadingBlock />}
        {error && <ErrorBlock message={error} onRetry={reload} />}

        {!loading && !error && !featured && (
          <div className="rounded-[22px] bg-white hairline p-10 text-center">
            <p className="font-bold text-navy">لم تُحدَّد رائدة الشهر بعد</p>
            <p className="mt-2 text-sm text-muted">فعّلي قصة مميزة من لوحة الإدارة لتظهر هنا.</p>
            <Button to="/membership" variant="gold" size="md" className="mt-5">
              انضمي لتكوني التالية
            </Button>
          </div>
        )}

        {featured && (
          <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] sm:aspect-[5/4] lg:aspect-square bg-navy/5">
              <SafeImg
                src={featured.image}
                fallback={imageFallback}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
              <span className="absolute bottom-4 right-4 rounded-full bg-gold text-navy text-[12px] font-bold px-3 py-1.5">
                {featured.category || 'رائدة الشهر'}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                البطلة هذا الشهر
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-navy tracking-[-0.02em] leading-tight">
                {featured.title}
              </h2>
              <p className="mt-2 text-[15px] font-semibold text-rose">{featured.author}</p>
              <p className="mt-5 text-[16px] text-muted leading-relaxed whitespace-pre-line">
                {featured.excerpt}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/membership" variant="gold" size="md">
                  أريد الظهور كعضوة
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
                <Button to="/members" variant="outline" size="md">
                  دليل الأعضاء
                </Button>
              </div>
            </div>
          </article>
        )}

        {others.length > 0 && (
          <section className="mt-16">
            <h3 className="text-xl font-extrabold text-navy mb-5">قصص أخرى من المجتمع</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {others.map((s) => (
                <Link
                  key={s.id}
                  to="/member-of-month"
                  className="rounded-[18px] bg-white hairline p-4 hover:shadow-sm transition-shadow"
                >
                  <SafeImg
                    src={s.image}
                    fallback={imageFallback}
                    alt=""
                    className="w-full aspect-[4/3] object-cover rounded-[12px]"
                  />
                  <p className="mt-3 font-bold text-navy text-sm line-clamp-2">{s.title}</p>
                  <p className="mt-1 text-[12px] text-muted">{s.author}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
