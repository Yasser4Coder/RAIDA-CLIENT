import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Clock, ArrowRight, Users, Ticket, ExternalLink } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { useAsyncData } from '../hooks/useAsyncData'
import { useAuth } from '../context/AuthContext'
import { catalogApi, meApi } from '../lib/catalog'
import { ApiClientError } from '../lib/api'
import { asArray } from '../lib/normalize'
import SeoHead from '../components/seo/SeoHead'
import { absoluteUrl, breadcrumbJsonLd } from '../lib/seo'

const imageFallback =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop'
const speakerFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  const {
    data: event,
    loading,
    error,
    reload,
  } = useAsyncData(() => catalogApi.event(id!), [id])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        <SeoHead title="جاري التحميل…" path={`/events/${id || ''}`} noindex />
        <LoadingBlock />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        <SeoHead title="الفعالية غير موجودة" path={`/events/${id || ''}`} noindex />
        <ErrorBlock message={error || 'الفعالية غير موجودة'} onRetry={reload} />
      </div>
    )
  }

  const image = event.image || imageFallback
  const agenda = asArray(event.agenda)
  const speakers = asArray(event.speakers)
  const sponsors = asArray(event.sponsors)
  const description =
    event.description?.slice(0, 160) ||
    `${event.title} — ${event.date} · ${event.location}`

  const handleRegister = async () => {
    if (!user) {
      navigate('/dashboard')
      return
    }
    if (user.role === 'admin' || user.role === 'super_admin') {
      navigate('/admin')
      return
    }
    if (user.hasAccess === false) {
      navigate('/membership')
      return
    }

    setRegistering(true)
    setRegisterError(null)
    try {
      await meApi.registerEvent(event.id)
      setRegistered(true)
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 409) {
        setRegistered(true)
        return
      }
      setRegisterError(err instanceof Error ? err.message : 'تعذر التسجيل')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-ivory">
      <SeoHead
        title={event.title}
        description={description}
        path={`/events/${event.id}`}
        image={image}
        type="article"
        keywords={[event.title, event.category, event.location, 'فعالية', 'RAIDA'].filter(Boolean)}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'الرئيسية', path: '/' },
            { name: 'الفعاليات', path: '/events' },
            { name: event.title, path: `/events/${event.id}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            description,
            image: absoluteUrl(image),
            url: absoluteUrl(`/events/${event.id}`),
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            startDate: event.startsAt || undefined,
            location: {
              '@type': 'Place',
              name: event.location,
              address: {
                '@type': 'PostalAddress',
                addressLocality: event.location,
                addressCountry: 'DZ',
              },
            },
            organizer: {
              '@type': 'Organization',
              name: 'RAIDA',
              url: absoluteUrl('/'),
            },
            offers: event.price
              ? {
                  '@type': 'Offer',
                  price: event.price.replace(/[^\d.]/g, '') || undefined,
                  priceCurrency: 'DZD',
                  availability: 'https://schema.org/InStock',
                  url: absoluteUrl(`/events/${event.id}`),
                }
              : undefined,
          },
        ]}
      />
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img src={image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <Badge variant="gold">{event.category}</Badge>
          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white max-w-2xl leading-snug">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
              <h2 className="text-xl font-bold text-navy mb-3">عن الفعالية</h2>
              <p className="text-muted leading-relaxed">{event.description}</p>
            </section>

            {agenda.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
                <h2 className="text-xl font-bold text-navy mb-5">جدول الأعمال</h2>
                <div className="space-y-0">
                  {agenda.map((item, i) => (
                    <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                      {i < agenda.length - 1 && (
                        <div className="absolute right-[15px] top-8 bottom-0 w-0.5 bg-rose/20" />
                      )}
                      <div className="w-8 h-8 rounded-full bg-rose-soft border-2 border-rose flex items-center justify-center shrink-0 z-10">
                        <div className="w-2 h-2 rounded-full bg-rose" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gold-dark">{item.time}</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {speakers.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
                <h2 className="flex items-center gap-2 text-xl font-bold text-navy mb-5">
                  <Users className="w-5 h-5 text-rose" /> المتحدثات
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {speakers.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-[14px] bg-rose-soft/40 border border-rose/10">
                      <img src={s.image || speakerFallback} alt={s.name} className="w-14 h-14 rounded-[12px] object-cover" />
                      <div>
                        <p className="font-bold text-navy">{s.name}</p>
                        <p className="text-sm text-muted">{s.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sponsors.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
                <h2 className="text-xl font-bold text-navy mb-4">الرعاة</h2>
                <div className="flex flex-wrap gap-3">
                  {sponsors.map((s) => (
                    <div key={s} className="px-5 py-3 rounded-[12px] bg-ivory border border-rose/10 font-semibold text-sm text-navy">
                      {s}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft sticky top-24">
              <h3 className="font-bold text-navy mb-4">تفاصيل التسجيل</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2.5 text-muted">
                  <Calendar className="w-4 h-4 text-rose" /> {event.date}
                </p>
                <p className="flex items-center gap-2.5 text-muted">
                  <Clock className="w-4 h-4 text-gold" /> {event.time}
                </p>
                <p className="flex items-start gap-2.5 text-muted">
                  <MapPin className="w-4 h-4 text-rose mt-0.5" /> {event.location}
                </p>
                <p className="flex items-center gap-2.5 text-muted">
                  <Ticket className="w-4 h-4 text-gold" /> {event.price}
                </p>
              </div>
              {event.registrationUrl ? (
                <Button
                  href={event.registrationUrl}
                  variant="gold"
                  size="lg"
                  className="w-full mt-6"
                >
                  الانتقال إلى منصة التسجيل
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </Button>
              ) : registered ? (
                <p className="mt-6 text-center text-sm font-semibold text-navy bg-rose-soft/70 rounded-[12px] py-3">
                  تم تسجيلكِ في هذه الفعالية
                </p>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full mt-6"
                  onClick={() => void handleRegister()}
                  disabled={registering}
                >
                  {registering ? 'جاري التسجيل...' : user ? 'التسجيل الآن' : 'ادخلي للتسجيل'}
                </Button>
              )}
              {registerError && <p className="text-center text-xs text-rose mt-3">{registerError}</p>}
              <p className="text-center text-xs text-muted mt-3">المقاعد محدودة</p>
            </div>

            <Link to="/events" className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark">
              <ArrowRight className="w-4 h-4" /> كل الفعاليات
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
