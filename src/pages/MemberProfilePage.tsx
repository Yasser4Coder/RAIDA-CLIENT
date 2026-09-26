import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  MapPin, Globe, Mail, QrCode,
  Award, Briefcase, FolderKanban, GraduationCap, ArrowRight, Share2, Building2, ChevronLeft,
} from 'lucide-react'
import { InstagramIcon, LinkedinIcon } from '../components/ui/SocialIcons'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { MemberCardCompact } from '../components/ui/MemberCard'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { useAsyncData } from '../hooks/useAsyncData'
import { catalogApi } from '../lib/catalog'
import { asArray } from '../lib/normalize'
import { safeHref } from '../lib/safe'
import SafeImg from '../components/ui/SafeImg'
import SeoHead from '../components/seo/SeoHead'
import { absoluteImage, absoluteUrl, breadcrumbJsonLd } from '../lib/seo'
import ConsultationRequestForm from '../components/ui/ConsultationRequestForm'

const imageFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
const coverFallback =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop'
const brandLogoFallback =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop'

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

  const image = member.image
  const cover = member.cover
  const services = asArray(member.services)
  const products = asArray(member.products)
  const programs = asArray(member.programs)
  const projects = asArray(member.projects)
  const achievements = asArray(member.achievements)
  const brand = member.brand || null
  const brandProducts = asArray(brand?.products)
  const brandServices = asArray(brand?.services)
  const displayProducts = brandProducts.length > 0 ? brandProducts : products
  const gallery = [brand?.cover, cover, brand?.logo, image, ...related.map((m) => m.image)]
    .filter(Boolean)
    .slice(0, 6)
  const isAcademy = member.plan === 'ACADEMY'
  const acceptsConsultations = member.plan === 'EXPERT' || member.plan === 'ACADEMY'
  const description =
    (member.bio && member.bio.slice(0, 160)) ||
    `${member.name} — ${member.title}${member.specialty ? ` · ${member.specialty}` : ''}${member.city ? ` · ${member.city}` : ''}`

  return (
    <div className="pt-20 pb-16 min-h-screen bg-ivory">
      <SeoHead
        title={`${member.name} | ${isAcademy ? 'أكاديمية رائدة' : member.title}`}
        description={description}
        path={`/members/${member.id}`}
        image={image}
        type="profile"
        keywords={[member.name, member.title, member.specialty, member.city, isAcademy ? 'أكاديمية' : '', 'رائدة', 'RAIDA'].filter(Boolean)}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'الرئيسية', path: '/' },
            { name: isAcademy ? 'الأكاديميات' : 'دليل الأعضاء', path: isAcademy ? '/academies' : '/members' },
            { name: member.name, path: `/members/${member.id}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': isAcademy ? 'EducationalOrganization' : 'Person',
            name: member.name,
            jobTitle: member.title,
            description,
            image: absoluteImage(image, imageFallback),
            url: absoluteUrl(`/members/${member.id}`),
            address: member.city
              ? { '@type': 'PostalAddress', addressLocality: member.city, addressCountry: 'DZ' }
              : undefined,
            knowsAbout: [member.specialty, ...services, ...programs].filter(Boolean),
          },
        ]}
      />
      {/* Cover */}
      <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
        <SafeImg src={cover} fallback={coverFallback} alt={`غلاف ملف ${member.name}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="relative -mt-16 sm:-mt-20 mb-8">
          <div className="bg-white rounded-[20px] shadow-card border border-rose/10 p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
              <SafeImg
                src={image}
                fallback={imageFallback}
                alt={member.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-[20px] object-cover border-4 border-white shadow-elevated ring-2 ring-rose/30 -mt-16 sm:-mt-20"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    {isAcademy && (
                      <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold-dark ring-1 ring-gold/25">
                        <GraduationCap className="w-3.5 h-3.5" />
                        أكاديمية / مركز تدريب في رائدة
                      </p>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">{member.name}</h1>
                    <p className="text-muted mt-1">{member.title}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {member.specialty && <Badge variant="rose">{member.specialty}</Badge>}
                      <Badge variant="gold">{member.category || (isAcademy ? 'أكاديميات ومراكز تدريب' : '')}</Badge>
                    </div>
                    {member.city && (
                      <p className="flex items-center gap-1.5 text-sm text-muted mt-3">
                        <MapPin className="w-4 h-4 text-rose" />
                        {member.city}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brand ? (
                      <Button to={`/brands/${brand.id}`} variant="outline" size="sm">
                        <Building2 className="w-4 h-4" /> {brand.name}
                      </Button>
                    ) : null}
                    {isAcademy ? (
                      <Button variant="gold" size="sm" onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}>
                        <GraduationCap className="w-4 h-4" /> البرامج والدورات
                      </Button>
                    ) : acceptsConsultations ? (
                      <Button variant="gold" size="sm" onClick={() => document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' })}>
                        <Mail className="w-4 h-4" /> استشارة
                      </Button>
                    ) : brand ? (
                      <Button variant="gold" size="sm" onClick={() => document.getElementById('brand')?.scrollIntoView({ behavior: 'smooth' })}>
                        <Building2 className="w-4 h-4" /> علامتها التجارية
                      </Button>
                    ) : null}
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
              <h2 className="text-lg font-bold text-navy mb-3">
                {isAcademy ? 'التعريف بالمؤسسة' : 'نبذة تعريفية'}
              </h2>
              <p className="text-muted leading-relaxed">{member.bio || 'لا توجد نبذة بعد.'}</p>
            </section>

            {/* Programs — prioritized for academies */}
            {(isAcademy || programs.length > 0) && (
              <section id="programs" className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                  <GraduationCap className="w-5 h-5 text-gold" />
                  {isAcademy ? 'الدورات والتكوينات' : 'البرامج'}
                </h2>
                {programs.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {programs.map((p) => (
                      <div key={p} className="p-4 rounded-[14px] bg-[#F7F3EE] flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gold/15 text-gold-dark">
                          <GraduationCap className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-semibold text-navy">{p}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">لم تُنشر دورات بعد.</p>
                )}
              </section>
            )}

            {/* Brand */}
            {brand && (
              <section id="brand" className="bg-white rounded-[18px] overflow-hidden border border-rose/10 shadow-soft">
                <div className="relative aspect-[21/9] bg-navy/5">
                  <SafeImg
                    src={brand.cover || brand.logo}
                    fallback={coverFallback}
                    alt={`غلاف ${brand.name}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                  <div className="absolute bottom-4 start-4 end-4 flex items-end gap-3">
                    <SafeImg
                      src={brand.logo}
                      fallback={brandLogoFallback}
                      alt={brand.name}
                      className="h-14 w-14 rounded-[14px] object-cover ring-2 ring-white/80 bg-white"
                    />
                    <div className="min-w-0 pb-0.5">
                      <p className="text-[11px] font-semibold text-gold">العلامة التجارية</p>
                      <h2 className="text-xl font-extrabold text-white tracking-tight truncate">{brand.name}</h2>
                      {brand.category ? (
                        <p className="text-[12px] text-white/75">{brand.category}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {brand.description ? (
                    <p className="text-sm text-muted leading-relaxed">{brand.description}</p>
                  ) : null}
                  {brand.story ? (
                    <div>
                      <p className="text-[12px] font-semibold text-navy mb-1">قصة العلامة</p>
                      <p className="text-sm text-muted leading-relaxed">{brand.story}</p>
                    </div>
                  ) : null}
                  {brandServices.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {brandServices.map((s) => (
                        <Badge key={s} variant="soft">{s}</Badge>
                      ))}
                    </div>
                  )}
                  <Button to={`/brands/${brand.id}`} variant="gold" size="sm">
                    عرض صفحة العلامة كاملة
                    <ChevronLeft className="w-4 h-4 opacity-70" />
                  </Button>
                </div>
              </section>
            )}

            {/* Services */}
            {(services.length > 0 || brandServices.length > 0) && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                  <Briefcase className="w-5 h-5 text-rose" />
                  {isAcademy ? 'خدمات المركز' : brand ? 'خدمات العلامة' : 'الخدمات'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(brandServices.length > 0 ? brandServices : services).map((s) => (
                    <Badge key={s} variant="soft">{s}</Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Products */}
            {displayProducts.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="text-lg font-bold text-navy mb-4">
                  {brand ? `منتجات ${brand.name}` : 'المنتجات والعروض'}
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {displayProducts.map((p) => (
                    <div key={p} className="p-4 rounded-[12px] bg-rose-soft/50 border border-rose/15">
                      <p className="font-semibold text-navy text-sm">{p}</p>
                    </div>
                  ))}
                </div>
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
                    <SafeImg src={img} fallback={imageFallback} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Contact card */}
            <div id="consultation" className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h3 className="font-bold text-navy mb-2">
                {acceptsConsultations
                  ? isAcademy
                    ? 'اطلبي استشارة من الأكاديمية'
                    : 'اطلبي استشارة'
                  : 'تواصلي مع العلامة'}
              </h3>
              <p className="text-[12px] text-muted mb-4">
                {acceptsConsultations
                  ? isAcademy
                    ? 'الطلب يصل مباشرة إلى لوحة تحكّم الأكاديمية. يمكنكِ أيضًا التواصل عبر الروابط أدناه.'
                    : 'المجال → الوقت → Online/حضوري → الجلسة. الطلب يصل للخبيرة ولصندوقكِ إن كنتِ مسجّلة.'
                  : 'عضوية الأعمال للظهور وعرض العلامة — لا تستقبل طلبات استشارة. تواصلي عبر الروابط أدناه أو عبر دليل الخبراء للجلسات الاستشارية.'}
              </p>
              {(safeHref(member.website) || safeHref(member.social?.linkedin) || safeHref(member.social?.instagram)) && (
                <div className={`space-y-2 ${acceptsConsultations ? 'mb-4 pb-4 border-b border-rose/10' : ''}`}>
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
              {acceptsConsultations ? (
                <ConsultationRequestForm
                  target="expert"
                  fixedMemberId={member.id}
                  fixedMemberName={member.name}
                  compact
                />
              ) : (
                <Button to="/consultations" variant="outline" size="sm" className="w-full mt-2">
                  اطلبي استشارة من خبيرة أو أكاديمية
                </Button>
              )}
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
                <h3 className="font-bold text-navy mb-4">
                  {isAcademy ? 'أكاديميات مشابهة' : 'أعضاء مشابهات'}
                </h3>
                <div className="space-y-3">
                  {related.map((m) => (
                    <MemberCardCompact key={m.id} member={m} />
                  ))}
                </div>
              </div>
            )}

            <Link to={isAcademy ? '/academies' : '/members'} className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark transition-colors">
              <ArrowRight className="w-4 h-4" /> {isAcademy ? 'العودة إلى دليل الأكاديميات' : 'العودة إلى الدليل'}
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
