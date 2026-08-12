import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Building2, Calendar, Handshake, CreditCard, FileText,
  DollarSign, LayoutDashboard, TrendingUp, ArrowUpRight, Search,
  MoreHorizontal, ChevronLeft,
} from 'lucide-react'
import { members, brands, events, partners } from '../data/mockData'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const adminNav = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'users', label: 'المستخدمات', icon: Users },
  { id: 'brands', label: 'العلامات', icon: Building2 },
  { id: 'events', label: 'الفعاليات', icon: Calendar },
  { id: 'partnerships', label: 'الشراكات', icon: Handshake },
  { id: 'plans', label: 'خطط العضوية', icon: CreditCard },
  { id: 'content', label: 'إدارة المحتوى', icon: FileText },
  { id: 'revenue', label: 'تحليلات الإيرادات', icon: DollarSign },
]

const kpiCards = [
  { label: 'إجمالي العضوات', value: '12,500', change: '+4.2%', icon: Users },
  { label: 'العلامات التجارية', value: '890', change: '+2.1%', icon: Building2 },
  { label: 'إيرادات الشهر', value: '2.4M دج', change: '+18%', icon: DollarSign },
  { label: 'فعاليات نشطة', value: '24', change: '+3', icon: Calendar },
]

export default function AdminDashboardPage() {
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="pt-20 min-h-screen bg-light">
      <div className="max-w-[1400px] mx-auto flex">
        <aside
          className={`fixed lg:sticky top-20 right-0 z-40 h-[calc(100vh-5rem)] w-64 bg-navy text-white transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-5 border-b border-white/10">
            <p className="text-gold font-bold text-sm">RAIDA Admin</p>
            <p className="text-white/40 text-xs mt-0.5">لوحة التحكم الإدارية</p>
          </div>
          <nav className="p-3 space-y-0.5">
            {adminNav.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => { setActive(item.id); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-colors cursor-pointer ${
                    active === item.id
                      ? 'bg-gold/20 text-gold'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              )
            })}
          </nav>
          <div className="absolute bottom-4 inset-x-3">
            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-sm text-white/40 hover:text-white hover:bg-white/5">
              ← لوحة العضوة
            </Link>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-navy/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="mb-6">
            <button
              className="lg:hidden mb-2 text-sm text-muted flex items-center gap-1 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              القائمة <ChevronLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-extrabold text-navy">
              {adminNav.find((i) => i.id === active)?.label}
            </h1>
          </div>

          {active === 'overview' && (
            <div className="space-y-6 animate-fade-up">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((k) => {
                  const Icon = k.icon
                  return (
                    <div key={k.label} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-[10px] bg-navy/5 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-navy" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                          <ArrowUpRight className="w-3 h-3" /> {k.change}
                        </span>
                      </div>
                      <p className="mt-3 text-2xl font-extrabold text-navy">{k.value}</p>
                      <p className="text-xs text-muted mt-1">{k.label}</p>
                    </div>
                  )
                })}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-navy">الإيرادات الشهرية</h3>
                    <TrendingUp className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex items-end gap-3 h-48">
                    {[45, 52, 48, 65, 58, 72, 80, 75, 88, 92, 85, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-gold-dark to-gold hover:from-rose hover:to-rose-light transition-colors"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[10px] text-muted">
                          {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                  <h3 className="font-bold text-navy mb-4">توزيع الخطط</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'مجاني', pct: 62, color: 'bg-muted' },
                      { name: 'احترافي', pct: 28, color: 'bg-rose' },
                      { name: 'أعمال', pct: 10, color: 'bg-gold' },
                    ].map((p) => (
                      <div key={p.name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-navy font-medium">{p.name}</span>
                          <span className="text-muted">{p.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-light overflow-hidden">
                          <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-[12px] bg-navy text-white">
                    <p className="text-xs text-white/50">MRR</p>
                    <p className="text-2xl font-extrabold text-gold mt-1">2.4M دج</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                <h3 className="font-bold text-navy mb-4">آخر العضوات المسجّلات</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted text-xs border-b border-rose/10">
                        <th className="text-right pb-3 font-semibold">العضوة</th>
                        <th className="text-right pb-3 font-semibold">التخصص</th>
                        <th className="text-right pb-3 font-semibold">المدينة</th>
                        <th className="text-right pb-3 font-semibold">الخطة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.slice(0, 5).map((m) => (
                        <tr key={m.id} className="border-b border-rose/5 hover:bg-blush/50">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <img src={m.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                              <span className="font-medium text-navy">{m.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-muted">{m.specialty}</td>
                          <td className="py-3 text-muted">{m.city}</td>
                          <td className="py-3">
                            <Badge variant={m.id % 3 === 0 ? 'gold' : 'soft'}>
                              {m.id % 3 === 0 ? 'أعمال' : m.id % 2 === 0 ? 'احترافي' : 'مجاني'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {active === 'users' && (
            <div className="bg-white rounded-[16px] border border-rose/10 shadow-soft animate-fade-up">
              <div className="p-5 border-b border-rose/10 flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    placeholder="بحث عن عضوة..."
                    className="pr-10 pl-4 py-2.5 rounded-[12px] border border-rose/20 bg-ivory text-sm w-full sm:w-64 focus:outline-none focus:border-gold"
                  />
                </div>
                <Button variant="gold" size="sm">إضافة عضوة</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted text-xs bg-ivory">
                      <th className="text-right p-4 font-semibold">العضوة</th>
                      <th className="text-right p-4 font-semibold">التصنيف</th>
                      <th className="text-right p-4 font-semibold">المدينة</th>
                      <th className="text-right p-4 font-semibold">الحالة</th>
                      <th className="text-right p-4 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} className="border-t border-rose/5 hover:bg-blush/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={m.image} alt="" className="w-9 h-9 rounded-[8px] object-cover" />
                            <div>
                              <p className="font-semibold text-navy">{m.name}</p>
                              <p className="text-xs text-muted">{m.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted">{m.category}</td>
                        <td className="p-4 text-muted">{m.city}</td>
                        <td className="p-4"><Badge variant="rose">نشطة</Badge></td>
                        <td className="p-4">
                          <button className="p-1.5 rounded-lg hover:bg-blush cursor-pointer">
                            <MoreHorizontal className="w-4 h-4 text-muted" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'brands' && (
            <div className="grid sm:grid-cols-2 gap-4 animate-fade-up">
              {brands.map((b) => (
                <div key={b.id} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft flex items-center gap-4">
                  <img src={b.logo} alt="" className="w-14 h-14 rounded-[12px] object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy">{b.name}</p>
                    <p className="text-xs text-muted">{b.category}</p>
                  </div>
                  <Badge variant="gold">نشطة</Badge>
                </div>
              ))}
            </div>
          )}

          {active === 'events' && (
            <div className="space-y-3 animate-fade-up">
              <div className="flex justify-end mb-2">
                <Button variant="gold" size="sm">إنشاء فعالية</Button>
              </div>
              {events.map((e) => (
                <div key={e.id} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img src={e.image} alt="" className="w-full sm:w-20 h-28 sm:h-14 rounded-[10px] object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-navy">{e.title}</p>
                    <p className="text-xs text-muted">{e.date} — {e.category}</p>
                  </div>
                  <Badge variant="rose">{e.price}</Badge>
                </div>
              ))}
            </div>
          )}

          {active === 'partnerships' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
              {partners.map((p) => (
                <div key={p.id} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-navy flex items-center justify-center mb-3">
                    <span className="text-gold font-bold">{p.name[0]}</span>
                  </div>
                  <p className="font-bold text-navy text-sm">{p.name}</p>
                  <p className="text-[10px] text-muted mt-1">{p.type}</p>
                </div>
              ))}
            </div>
          )}

          {active === 'plans' && (
            <div className="grid md:grid-cols-3 gap-4 animate-fade-up">
              {[
                { name: 'مجاني', members: '7,750', revenue: '0' },
                { name: 'احترافي', members: '3,500', revenue: '17.1M' },
                { name: 'أعمال', members: '1,250', revenue: '16.1M' },
              ].map((p) => (
                <div key={p.name} className="bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                  <h3 className="font-bold text-navy text-lg">{p.name}</h3>
                  <p className="text-3xl font-extrabold text-navy mt-3">{p.members}</p>
                  <p className="text-xs text-muted">عضوة</p>
                  <p className="mt-4 text-sm text-gold-dark font-semibold">إيراد: {p.revenue} دج</p>
                </div>
              ))}
            </div>
          )}

          {active === 'content' && (
            <div className="bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft animate-fade-up">
              <h3 className="font-bold text-navy mb-4">إدارة المحتوى</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {['قصص النجاح', 'المدونة', 'الصفحة الرئيسية', 'الإعلانات'].map((c) => (
                  <div key={c} className="p-5 rounded-[14px] bg-ivory border border-rose/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-rose" />
                      <span className="font-semibold text-navy text-sm">{c}</span>
                    </div>
                    <Button variant="ghost" size="sm">تعديل</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 'revenue' && (
            <div className="space-y-6 animate-fade-up">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'إيرادات هذا الشهر', value: '2.4M دج' },
                  { label: 'متوسط قيمة الاشتراك', value: '6,200 دج' },
                  { label: 'معدل الاحتفاظ', value: '94%' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft">
                    <p className="text-xs text-muted">{s.label}</p>
                    <p className="text-2xl font-extrabold text-navy mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                <h3 className="font-bold text-navy mb-6">اتجاه الإيرادات</h3>
                <div className="flex items-end gap-2 h-56">
                  {[40, 48, 45, 60, 55, 70, 78, 72, 85, 90, 88, 100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-navy via-navy-soft to-rose/40" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
