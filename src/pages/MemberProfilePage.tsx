import { useParams, Link } from 'react-router-dom'
import {
  MapPin, Globe, Mail, Phone, QrCode,
  Award, Briefcase, FolderKanban, GraduationCap, ArrowRight, Share2,
} from 'lucide-react'
import { InstagramIcon, LinkedinIcon } from '../components/ui/SocialIcons'
import { members } from '../data/mockData'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { MemberCardCompact } from '../components/ui/MemberCard'

export default function MemberProfilePage() {
  const { id } = useParams()
  const member = members.find((m) => m.id === Number(id)) || members[0]
  const related = members.filter((m) => m.id !== member.id && m.category === member.category).slice(0, 3)

  return (
    <div className="pt-20 pb-16 min-h-screen bg-ivory">
      {/* Cover */}
      <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
        <img src={member.cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="relative -mt-16 sm:-mt-20 mb-8">
          <div className="bg-white rounded-[20px] shadow-card border border-rose/10 p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
              <img
                src={member.image}
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
                    <Button variant="gold" size="sm">
                      <Mail className="w-4 h-4" /> تواصلي
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" /> مشاركة
                    </Button>
                    <Button variant="soft" size="sm">
                      <QrCode className="w-4 h-4" /> QR
                    </Button>
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
              <p className="text-muted leading-relaxed">{member.bio}</p>
            </section>

            {/* Services */}
            <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                <Briefcase className="w-5 h-5 text-rose" /> الخدمات
              </h2>
              <div className="flex flex-wrap gap-2">
                {member.services.map((s) => (
                  <Badge key={s} variant="soft">{s}</Badge>
                ))}
              </div>
            </section>

            {/* Products */}
            {member.products.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="text-lg font-bold text-navy mb-4">المنتجات والعروض</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {member.products.map((p) => (
                    <div key={p} className="p-4 rounded-[12px] bg-rose-soft/50 border border-rose/15">
                      <p className="font-semibold text-navy text-sm">{p}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Programs */}
            {member.programs.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                  <GraduationCap className="w-5 h-5 text-gold" /> البرامج
                </h2>
                <ul className="space-y-2">
                  {member.programs.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-dark">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Projects */}
            {member.projects.length > 0 && (
              <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
                <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                  <FolderKanban className="w-5 h-5 text-mauve" /> المشاريع
                </h2>
                <div className="space-y-3">
                  {member.projects.map((p) => (
                    <div key={p} className="p-4 rounded-[12px] bg-ivory border border-rose/10 flex items-center justify-between">
                      <span className="text-sm font-medium text-navy">{p}</span>
                      <Badge variant="navy">مكتمل</Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
                <Award className="w-5 h-5 text-gold" /> الإنجازات
              </h2>
              <ul className="space-y-3">
                {member.achievements.map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-gold-dark" />
                    </div>
                    <span className="text-sm text-dark pt-1.5">{a}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Gallery */}
            <section className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h2 className="text-lg font-bold text-navy mb-4">المعرض</h2>
              <div className="grid grid-cols-3 gap-3">
                {[member.cover, member.image, members[1].image, members[2].image, members[3].cover, members[4].image].map((img, i) => (
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
            <div className="bg-white rounded-[18px] p-6 border border-rose/10 shadow-soft">
              <h3 className="font-bold text-navy mb-4">التواصل</h3>
              <div className="space-y-3">
                {member.website && (
                  <a href={member.website} className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark transition-colors">
                    <Globe className="w-4 h-4 text-rose" /> الموقع الإلكتروني
                  </a>
                )}
                {member.social.linkedin && (
                  <a href={member.social.linkedin} className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark transition-colors">
                    <LinkedinIcon className="w-4 h-4 text-rose" /> LinkedIn
                  </a>
                )}
                {member.social.instagram && (
                  <a href={member.social.instagram} className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark transition-colors">
                    <InstagramIcon className="w-4 h-4 text-rose" /> Instagram
                  </a>
                )}
                <a href="#" className="flex items-center gap-3 text-sm text-muted hover:text-gold-dark transition-colors">
                  <Phone className="w-4 h-4 text-rose" /> تواصل هاتفي
                </a>
              </div>
              <Button variant="gold" size="md" className="w-full mt-5">
                <Mail className="w-4 h-4" /> أرسلي رسالة
              </Button>
            </div>

            {/* QR Code */}
            <div className="bg-gradient-to-br from-navy to-navy-soft rounded-[18px] p-6 text-center">
              <div className="w-32 h-32 mx-auto bg-white rounded-[12px] flex items-center justify-center">
                <QrCode className="w-20 h-20 text-navy" />
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
