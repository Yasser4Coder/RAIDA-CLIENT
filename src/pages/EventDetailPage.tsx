import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, ArrowRight, Users, Ticket } from 'lucide-react'
import { events } from '../data/mockData'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function EventDetailPage() {
  const { id } = useParams()
  const event = events.find((e) => e.id === Number(id)) || events[0]

  return (
    <div className="pt-20 pb-16 min-h-screen bg-ivory">
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
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

            <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
              <h2 className="text-xl font-bold text-navy mb-5">جدول الأعمال</h2>
              <div className="space-y-0">
                {event.agenda.map((item, i) => (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                    {i < event.agenda.length - 1 && (
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

            <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
              <h2 className="flex items-center gap-2 text-xl font-bold text-navy mb-5">
                <Users className="w-5 h-5 text-rose" /> المتحدثات
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {event.speakers.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-[14px] bg-rose-soft/40 border border-rose/10">
                    <img src={s.image} alt={s.name} className="w-14 h-14 rounded-[12px] object-cover" />
                    <div>
                      <p className="font-bold text-navy">{s.name}</p>
                      <p className="text-sm text-muted">{s.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[18px] p-6 sm:p-8 border border-rose/10 shadow-soft">
              <h2 className="text-xl font-bold text-navy mb-4">الرعاة</h2>
              <div className="flex flex-wrap gap-3">
                {event.sponsors.map((s) => (
                  <div key={s} className="px-5 py-3 rounded-[12px] bg-ivory border border-rose/10 font-semibold text-sm text-navy">
                    {s}
                  </div>
                ))}
              </div>
            </section>
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
              <Button variant="gold" size="lg" className="w-full mt-6">
                التسجيل الآن
              </Button>
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
