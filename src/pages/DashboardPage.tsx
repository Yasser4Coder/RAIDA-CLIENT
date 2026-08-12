import { useState, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, User, Briefcase, Calendar, Handshake, Bell,
  BarChart3, CreditCard, Settings, ChevronLeft, Eye, Users,
  TrendingUp, CalendarCheck, MessageSquare, Edit3, Plus, Menu, X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { members, events } from '../data/mockData'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { materialize, springs, useMotionSafe } from '../lib/motion'

const sidebarItems = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'profile', label: 'الملف الشخصي', icon: User },
  { id: 'services', label: 'الخدمات', icon: Briefcase },
  { id: 'events', label: 'الفعاليات', icon: Calendar },
  { id: 'partnerships', label: 'الشراكات', icon: Handshake },
  { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: 2 },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
  { id: 'subscription', label: 'الاشتراك', icon: CreditCard },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
]

const overviewStats = [
  { label: 'مشاهدات الملف', value: '2,847', change: '+12%', icon: Eye, tone: 'rose' },
  { label: 'اتصالات جديدة', value: '48', change: '+8%', icon: Users, tone: 'gold' },
  { label: 'فعاليات قادمة', value: '3', change: '', icon: CalendarCheck, tone: 'mauve' },
  { label: 'رسائل', value: '12', change: '+3', icon: MessageSquare, tone: 'navy' },
]

const toneClass: Record<string, string> = {
  rose: 'bg-rose-soft text-rose ring-rose/25',
  gold: 'bg-gold/15 text-gold-dark ring-gold/25',
  mauve: 'bg-blush text-mauve ring-mauve/25',
  navy: 'bg-navy/5 text-navy ring-navy/10',
}

const notifications = [
  { id: 1, text: 'نورة البلوشي شاهدت ملفك الشخصي', time: 'منذ ساعة', unread: true },
  { id: 2, text: 'تم تأكيد تسجيلك في ملتقى رائدات الأعمال', time: 'منذ 3 ساعات', unread: true },
  { id: 3, text: 'عرض شراكة جديد من نور بيوتي', time: 'أمس', unread: false },
  { id: 4, text: 'تم ترقية اشتراكك إلى احترافي', time: 'منذ يومين', unread: false },
]

const chart30 = [40, 55, 35, 70, 50, 80, 65, 90, 45, 75, 60, 85, 70, 95, 55, 80, 70, 88, 62, 78, 90, 72, 85, 68, 92, 78, 95, 82, 88, 100]
const chart12 = [30, 45, 40, 60, 55, 75, 70, 85, 80, 95, 90, 100]

function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[18px] bg-white hairline shadow-xs ${className}`}>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { reduce, transition } = useMotionSafe()
  const member = members[0]
  const activeItem = sidebarItems.find((i) => i.id === active)

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const select = (id: string) => {
    setActive(id)
    setSidebarOpen(false)
  }

  const SidebarNav = (
    <>
      <div className="p-4 border-b border-separator">
        <div className="flex items-center gap-3">
          <img src={member.image} alt="" className="w-10 h-10 rounded-[12px] object-cover ring-1 ring-rose/20" />
          <div className="min-w-0">
            <p className="font-bold text-navy text-[13px] truncate tracking-[-0.01em]">{member.name}</p>
            <Badge variant="gold" className="mt-1">احترافي</Badge>
          </div>
        </div>
      </div>

      <nav className="p-2.5 space-y-0.5 overflow-y-auto flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => select(item.id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-medium pressable-soft cursor-pointer ${
                isActive ? 'text-navy' : 'text-muted hover:text-navy'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={reduce ? undefined : 'dash-nav-pill'}
                  className="absolute inset-0 rounded-[12px] bg-rose-soft ring-1 ring-rose/20"
                  transition={springs.snappy}
                />
              )}
              <Icon className="relative z-10 w-4 h-4 shrink-0" />
              <span className="relative z-10">{item.label}</span>
              {item.badge ? (
                <span className="relative z-10 mr-auto w-5 h-5 rounded-full bg-rose text-navy text-[10px] flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}

        <div className="pt-3 mt-2 border-t border-separator">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-medium text-gold-dark hover:bg-gold/10 pressable-soft"
          >
            <LayoutDashboard className="w-4 h-4" />
            لوحة الإدارة
          </Link>
        </div>
      </nav>
    </>
  )

  return (
    <div className="pt-20 min-h-screen bg-ivory">
      <div className="max-w-[1400px] mx-auto flex">
        {/* Desktop sidebar — thick material */}
        <aside className="hidden lg:flex sticky top-20 h-[calc(100vh-5rem)] w-[260px] shrink-0 flex-col border-l border-separator bg-white/80 backdrop-blur-xl">
          {SidebarNav}
        </aside>

        {/* Mobile sheet */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-navy/30 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                className="fixed top-20 bottom-0 right-0 z-50 w-[min(86vw,280px)] lg:hidden flex flex-col material-thick shadow-xl ring-1 ring-navy/10"
                initial={reduce ? { opacity: 0 } : { ...materialize.initial, x: 24 }}
                animate={reduce ? { opacity: 1 } : { ...materialize.animate, x: 0 }}
                exit={reduce ? { opacity: 0 } : { ...materialize.exit, x: 16 }}
                transition={transition}
                style={{ transformOrigin: 'right center' }}
              >
                <div className="flex items-center justify-between px-4 pt-3">
                  <p className="text-[12px] font-semibold text-muted">القائمة</p>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/70 ring-1 ring-separator flex items-center justify-center pressable"
                    aria-label="إغلاق"
                  >
                    <X className="w-4 h-4 text-navy" />
                  </button>
                </div>
                {SidebarNav}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="min-w-0">
              <button
                type="button"
                className="lg:hidden mb-2 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white hairline text-[13px] font-medium text-navy pressable"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
                القائمة
              </button>
              <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-navy tracking-[-0.02em]">
                {activeItem?.label}
              </h1>
              <p className="text-[13px] text-muted mt-0.5">
                مرحباً بعودتك، {member.name.split(' ')[0]}
              </p>
            </div>
            <Button to={`/members/${member.id}`} variant="outline" size="sm" className="shrink-0 !rounded-full">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">عرض الملف</span>
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={springs.snappy}
            >
              {active === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {overviewStats.map((s) => {
                      const Icon = s.icon
                      return (
                        <Surface key={s.label} className="p-4 sm:p-5">
                          <div className={`w-10 h-10 rounded-[12px] ring-1 flex items-center justify-center ${toneClass[s.tone]}`}>
                            <Icon className="w-[18px] h-[18px]" />
                          </div>
                          <p className="mt-3 text-2xl font-extrabold text-navy tracking-[-0.03em] tabular-nums">
                            {s.value}
                          </p>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="text-[11px] text-muted">{s.label}</p>
                            {s.change && (
                              <span className="text-[11px] font-semibold text-emerald-600">{s.change}</span>
                            )}
                          </div>
                        </Surface>
                      )
                    })}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <Surface className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-navy tracking-[-0.01em]">آخر الإشعارات</h3>
                        <button
                          type="button"
                          onClick={() => select('notifications')}
                          className="text-[12px] text-rose font-semibold pressable-soft"
                        >
                          عرض الكل
                        </button>
                      </div>
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex items-start gap-3 p-3 rounded-[12px] ${
                              n.unread ? 'bg-rose-soft/60' : 'bg-ivory'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-rose' : 'bg-transparent'}`} />
                            <div>
                              <p className="text-[13px] text-navy leading-snug">{n.text}</p>
                              <p className="text-[11px] text-muted mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Surface>

                    <Surface className="p-5">
                      <h3 className="font-bold text-navy tracking-[-0.01em] mb-4">فعالياتك القادمة</h3>
                      <div className="space-y-2">
                        {events.slice(0, 3).map((e) => (
                          <Link
                            key={e.id}
                            to={`/events/${e.id}`}
                            className="flex items-center gap-3 p-3 rounded-[12px] bg-ivory hover:bg-blush/70 transition-colors pressable-soft"
                          >
                            <img src={e.image} alt="" className="w-11 h-11 rounded-[10px] object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-semibold text-navy truncate">{e.title}</p>
                              <p className="text-[11px] text-muted">{e.date}</p>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-muted shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </Surface>
                  </div>

                  <Surface className="p-5">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-navy tracking-[-0.01em]">مشاهدات الملف — آخر 30 يوماً</h3>
                      <TrendingUp className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex items-end gap-1 h-40">
                      {chart30.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-rose to-rose-light hover:from-gold hover:to-gold-light transition-colors pressable-soft min-w-0"
                          style={{ height: `${h}%` }}
                          title={`يوم ${i + 1}`}
                        />
                      ))}
                    </div>
                  </Surface>
                </div>
              )}

              {active === 'profile' && (
                <Surface className="p-5 sm:p-6 max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-navy">إدارة الملف الشخصي</h3>
                    <Button variant="gold" size="sm" className="!rounded-full">
                      <Edit3 className="w-4 h-4" /> تعديل
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={member.image} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] object-cover ring-2 ring-rose/20" />
                    <div>
                      <p className="font-bold text-navy text-lg tracking-[-0.01em]">{member.name}</p>
                      <p className="text-sm text-muted">{member.title}</p>
                    </div>
                  </div>
                  <div className="space-y-3.5">
                    {[
                      { label: 'الاسم', value: member.name },
                      { label: 'الصفة المهنية', value: member.title },
                      { label: 'التخصص', value: member.specialty },
                      { label: 'المدينة', value: member.city },
                      { label: 'الموقع', value: member.website },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="block text-[11px] font-semibold text-muted mb-1.5 tracking-[0.01em]">
                          {f.label}
                        </label>
                        <input
                          defaultValue={f.value}
                          className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[11px] font-semibold text-muted mb-1.5">نبذة تعريفية</label>
                      <textarea
                        defaultValue={member.bio}
                        rows={4}
                        className="w-full px-4 py-3 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15 resize-none"
                      />
                    </div>
                    <Button variant="gold" size="md">حفظ التغييرات</Button>
                  </div>
                </Surface>
              )}

              {active === 'services' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy">خدماتك</h3>
                    <Button variant="gold" size="sm" className="!rounded-full">
                      <Plus className="w-4 h-4" /> إضافة
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[...member.services.map((s) => ({ label: s, tone: 'rose' as const })), ...member.products.map((p) => ({ label: p, tone: 'gold' as const }))].map((item) => (
                      <Surface key={item.label} className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-[12px] ring-1 flex items-center justify-center shrink-0 ${toneClass[item.tone]}`}>
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <p className="font-semibold text-navy text-[13px] truncate">{item.label}</p>
                        </div>
                        <button type="button" className="p-2 rounded-[10px] hover:bg-blush pressable" aria-label="تعديل">
                          <Edit3 className="w-4 h-4 text-muted" />
                        </button>
                      </Surface>
                    ))}
                  </div>
                </div>
              )}

              {active === 'events' && (
                <div className="space-y-2.5">
                  {events.map((e) => (
                    <Surface key={e.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                      <img src={e.image} alt="" className="w-full sm:w-20 h-28 sm:h-14 rounded-[12px] object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-navy text-[14px] tracking-[-0.01em]">{e.title}</p>
                        <p className="text-[12px] text-muted mt-0.5">{e.date} — {e.location}</p>
                      </div>
                      <Badge variant="rose">مسجّلة</Badge>
                    </Surface>
                  ))}
                </div>
              )}

              {active === 'partnerships' && (
                <Surface className="p-8 sm:p-10 text-center max-w-lg mx-auto">
                  <div className="mx-auto w-14 h-14 rounded-[16px] bg-gold/15 ring-1 ring-gold/25 flex items-center justify-center mb-4">
                    <Handshake className="w-6 h-6 text-gold-dark" />
                  </div>
                  <h3 className="text-xl font-bold text-navy tracking-[-0.02em]">فرص الشراكة</h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    استكشفي فرص الشراكة المتاحة أو قدّمي طلباً لتصبحي شريكة.
                  </p>
                  <Button to="/partnerships" variant="gold" size="md" className="mt-6">
                    استكشفي الشراكات
                    <ChevronLeft className="w-4 h-4 opacity-70" />
                  </Button>
                </Surface>
              )}

              {active === 'notifications' && (
                <Surface className="divide-y divide-separator overflow-hidden">
                  {notifications.map((n) => (
                    <div key={n.id} className={`flex items-start gap-3 p-4 sm:p-5 ${n.unread ? 'bg-rose-soft/35' : ''}`}>
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-rose' : 'bg-light'}`} />
                      <div>
                        <p className="text-[13px] text-navy font-medium leading-snug">{n.text}</p>
                        <p className="text-[11px] text-muted mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </Surface>
              )}

              {active === 'analytics' && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { label: 'إجمالي المشاهدات', value: '12,450' },
                      { label: 'معدل التفاعل', value: '8.4%' },
                      { label: 'زيارات من البحث', value: '3,200' },
                    ].map((s) => (
                      <Surface key={s.label} className="p-5 text-center">
                        <p className="text-2xl font-extrabold text-navy tracking-[-0.03em] tabular-nums">{s.value}</p>
                        <p className="text-[11px] text-muted mt-1">{s.label}</p>
                      </Surface>
                    ))}
                  </div>
                  <Surface className="p-5">
                    <h3 className="font-bold text-navy mb-6 tracking-[-0.01em]">نمو المشاهدات</h3>
                    <div className="flex items-end gap-2 h-48">
                      {chart12.map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                          <div
                            className="w-full rounded-t-[10px] bg-gradient-to-t from-navy to-navy-soft"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[10px] text-muted">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </Surface>
                </div>
              )}

              {active === 'subscription' && (
                <Surface className="p-6 sm:p-8 max-w-lg">
                  <Badge variant="gold">الخطة الحالية</Badge>
                  <h3 className="text-2xl font-extrabold text-navy mt-3 tracking-[-0.02em]">
                    احترافي — PROFESSIONAL
                  </h3>
                  <p className="text-muted mt-1 text-sm">4,900 دج / شهرياً</p>
                  <div className="mt-6 p-4 rounded-[14px] bg-rose-soft/60 ring-1 ring-rose/20">
                    <p className="text-sm text-navy">
                      التجديد التالي: <strong>12 سبتمبر 2026</strong>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 mt-6">
                    <Button to="/membership" variant="gold" size="sm" className="!rounded-full">
                      ترقية الخطة
                    </Button>
                    <Button variant="outline" size="sm" className="!rounded-full">
                      إدارة الدفع
                    </Button>
                  </div>
                </Surface>
              )}

              {active === 'settings' && (
                <Surface className="p-5 sm:p-6 max-w-lg space-y-2.5">
                  <h3 className="font-bold text-navy mb-3">الإعدادات</h3>
                  {[
                    { label: 'إشعارات البريد', desc: 'استلام تنبيهات عبر الإيميل', on: true },
                    { label: 'الملف عام', desc: 'إظهار ملفك في الدليل', on: true },
                    { label: 'رسائل الأعضاء', desc: 'السماح بالتواصل المباشر', on: false },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-4 p-4 rounded-[14px] bg-ivory">
                      <div>
                        <p className="text-[13px] font-semibold text-navy">{s.label}</p>
                        <p className="text-[11px] text-muted mt-0.5">{s.desc}</p>
                      </div>
                      <button
                        type="button"
                        className={`relative w-11 h-6 rounded-full pressable shrink-0 transition-colors ${
                          s.on ? 'bg-rose' : 'bg-navy/15'
                        }`}
                        aria-pressed={s.on}
                        aria-label={s.label}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                            s.on ? 'left-1' : 'right-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </Surface>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
