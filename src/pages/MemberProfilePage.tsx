import { useParams, Link } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import {
  MapPin, Globe, Mail, QrCode,
  Award, Briefcase, FolderKanban, GraduationCap, ArrowRight, Share2,
} from 'lucide-react'
import { InstagramIcon, LinkedinIcon } from '../components/ui/SocialIcons'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { MemberCardCompact } from '../components/ui/MemberCard'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi, publicApi } from '../lib/catalog'
import { asArray } from '../lib/normalize'
import { safeHref } from '../lib/safe'
import SeoHead from '../components/seo/SeoHead'
import { absoluteUrl, breadcrumbJsonLd } from '../lib/seo'

const imageFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
const coverFallback =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop'

export default function MemberProfilePage() {
  const { id } = useParams()

  const {
    data: member,
    loading,
    error,
    reload,
  } = useAsyncData(() => catalogApi.member(id!), [id])

  const { data: relatedPayload } = useAsyncData(
    () =>
      member
        ? catalogApi.members({ category: member.category, limit: 4 })
        : Promise.resolve({ data: [] }),
    [member?.id, member?.category],
  )

  const related =
    relatedPayload?.data.filter((m) => m.id !== member?.id).slice(0, 3) ?? []

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        <SeoHead title="جاري التحميل…" path={`/members/${id || ''}`} noindex />
        <LoadingBlock />
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        <SeoHead title="العضوة غير موجودة" path={`/members/${id || ''}`} noindex />
        <ErrorBlock message={error || 'العضوة غير موجودة'} onRetry={reload} />
      </div>
    )
  }

  const image = member.image || imageFallback
  const cover = member.cover || coverFallback
  const services = asArray(member.services)
  const products = asArray(member.products)
  const programs = asArray(member.programs)
  const projects = asArray(member.projects)
  const achievements = asArray(member.achievements)
  const gallery = [cover, image, ...(related.map((m) => m.image || imageFallback))].slice(0, 6)
  const description =
    (member.bio && member.bio.slice(0, 160)) ||
    `${member.name} — ${member.title}${member.specialty ? ` · ${member.specialty}` : ''}${member.city ? ` · ${member.city}` : ''}`

  return (
    <div className="pt-20 pb-16 min-h-screen bg-ivory">
      <SeoHead
        title={`${member.name} | ${member.title}`}
        description={description}
        path={`/members/${member.id}`}
        image={image}
        type="profile"
        keywords={[member.name, member.title, member.specialty, member.city, 'رائدة', 'RAIDA'].filter(Boolean)}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'الرئيسية', path: '/' },
            { name: 'دليل الأعضاء', path: '/members' },
            { name: member.name, path: `/members/${member.id}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: member.name,
            jobTitle: member.title,
            description,
            image: absoluteUrl(image),
            url: absoluteUrl(`/members/${member.id}`),
            address: member.city
              ? { '@type': 'PostalAddress', addressLocality: member.city, addressCountry: 'DZ' }
              : undefined,
            knowsAbout: [member.specialty, ...services].filter(Boolean),
          },
        ]}
      />
      {/* Cover */}
      <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
        <img src={cover} alt={`غلاف ملف ${member.name}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="relative -mt-16 sm:-mt-20 mb-8">
          <div className="bg-white rounded-[20px] shadow-card border border-rose/10 p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
              <img
                src={image}
                alt={member.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-[20px] object-cover border-4 border-white shadow-elevated ring-2 ring-rose/30 -mt-16 sm:-mt-20"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">{member.name}</h1>
                    <p className="text-muted mt-1">{member.title}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="rose">{member.specialty}</Badge>
                      <Badge variant="gold">{member.category}</Badge>
                    </div>
                    <p className="flex items-center gap-1.5 text-sm text-muted mt-3">
                      <MapPin className="w-4 h-4 text-rose" />
                      {member.city}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="gold" size="sm" onClick={() => document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' })}>
                      <Mail className="w-4 h-4" /> استشارة
                    </Button>
                    <ShareProfileButton name={member.name} />
                    <QrProfileButton name={member.name} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h2 className="text-lg font-bold text-navy mb-3">نبذة تعريفية</h2>
              <p className="text-muted leading-relaxed">{member.bio || 'لا توجد نبذة بعد.'}</p>
            </section>

            {/* Services */}
            <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                <Briefcase className="w-5 h-5 text-rose" /> الخدمات
              </h2>
              <div className="flex flex-wrap gap-2">
                {(services).map((s) => (
                  <Badge key={s} variant="soft">{s}</Badge>
                ))}
              </div>
            </section>

            {/* Products */}
            {products.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="text-lg font-bold text-navy mb-4">المنتجات والعروض</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {products.map((p) => (
                    <div key={p} className="p-4 rounded-[12px] bg-rose-soft/50 border border-rose/15">
                      <p className="font-semibold text-navy text-sm">{p}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Programs */}
            {programs.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                  <GraduationCap className="w-5 h-5 text-gold" /> البرامج
                </h2>
                <ul className="space-y-2">
                  {programs.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-dark">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                  <FolderKanban className="w-5 h-5 text-mauve" /> المشاريع
                </h2>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p} className="p-4 rounded-[12px] bg-ivory border border-rose/10 flex items-center justify-between">
                      <span className="text-sm font-medium text-navy">{p}</span>
                      <Badge variant="navy">مكتمل</Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                  <Award className="w-5 h-5 text-gold" /> الإنجازات
                </h2>
                <ul className="space-y-3">
                  {achievements.map((a) => (
                    <li key={a} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-gold-dark" />
                      </div>
                      <span className="text-sm text-dark pt-1.5">{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Gallery */}
            <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h2 className="text-lg font-bold text-navy mb-4">المعرض</h2>
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((img, i) => (
                  <div key={i} className="aspect-square rounded-[12px] overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Contact card */}
            <div id="consultation" className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h3 className="font-bold text-navy mb-2">اطلبي استشارة</h3>
              <p className="text-[12px] text-muted mb-4">
                يمكنكِ إرسال طلب استشارة دون إنشاء حساب. ستصله الرسالة في صندوق استشاراتها.
              </p>
              {(safeHref(member.website) || safeHref(member.social?.linkedin) || safeHref(member.social?.instagram)) && (
                <div className="space-y-2 mb-4 pb-4 border-b border-rose/10">
                  {safeHref(member.website) && (
                    <a href={safeHref(member.website)} className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark transition-colors">
                      <Globe className="w-4 h-4 text-rose" /> الموقع الإلكتروني
                    </a>
                  )}
                  {safeHref(member.social?.linkedin) && (
                    <a href={safeHref(member.social.linkedin)} className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark transition-colors">
                      <LinkedinIcon className="w-4 h-4 text-rose" /> LinkedIn
                    </a>
                  )}
                  {safeHref(member.social?.instagram) && (
                    <a href={safeHref(member.social.instagram)} className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark transition-colors">
                      <InstagramIcon className="w-4 h-4 text-rose" /> Instagram
                    </a>
                  )}
                </div>
              )}
              <ConsultationForm memberId={member.id} />
            </div>

            {/* QR Code */}
            <div id="qr-card" className="bg-gradient-to-br from-navy to-navy-soft rounded-[18px] p-6 text-center">
              <div className="w-32 h-32 mx-auto bg-white rounded-[12px] flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(window.location.href)}`}
                  alt={`رمز QR لملف ${member.name}`}
                  className="w-28 h-28"
                />
              </div>
              <p className="mt-4 text-sm text-white/70">امسحي الرمز لحفظ البطاقة</p>
              <p className="text-gold text-xs font-semibold mt-1">{member.name}</p>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h3 className="font-bold text-navy mb-4">أعضاء مشابهات</h3>
                <div className="space-y-3">
                  {related.map((m) => (
                    <MemberCardCompact key={m.id} member={m} />
                  ))}
                </div>
              </div>
            )}

            <Link to="/members" className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark transition-colors">
              <ArrowRight className="w-4 h-4" /> العودة إلى الدليل
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

function ShareProfileButton({ name }: { name: string }) {
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
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={() => void share()}>
      <Share2 className="w-4 h-4" /> {copied ? 'تم النسخ' : 'مشاركة'}
    </Button>
  )
}

function QrProfileButton({ name }: { name: string }) {
  return (
    <Button
      variant="soft"
      size="sm"
      onClick={() => document.getElementById('qr-card')?.scrollIntoView({ behavior: 'smooth' })}
    >
      <QrCode className="w-4 h-4" /> QR
      <span className="sr-only">{name}</span>
    </Button>
  )
}

function ConsultationForm({ memberId }: { memberId: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await publicApi.sendConsultation(memberId, {
        name,
        email,
        phone: phone || undefined,
        subject: subject || undefined,
        message,
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إرسال الاستشارة')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <p className="text-sm text-navy bg-rose-soft/60 rounded-[12px] p-4">
        تم إرسال استشارتكِ. ستتواصل معكِ العضوة عبر البريد الذي أدخلته.
      </p>
    )
  }

  const fieldClass =
    'w-full h-11 px-3 rounded-[12px] border border-rose/20 bg-ivory text-sm focus:outline-none focus:border-gold'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" className={fieldClass} />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className={fieldClass} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="الهاتف (اختياري)" className={fieldClass} />
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="الموضوع (اختياري)" className={fieldClass} />
      <textarea
        required
        minLength={10}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="نص الاستشارة"
        rows={4}
        className="w-full px-3 py-3 rounded-[12px] border border-rose/20 bg-ivory text-sm focus:outline-none focus:border-gold resize-none"
      />
      {error && <p className="text-sm text-rose">{error}</p>}
      <Button type="submit" variant="gold" size="md" className="w-full" disabled={submitting}>
        {submitting ? 'جاري الإرسال...' : 'إرسال الاستشارة'}
      </Button>
    </form>
  )
}
