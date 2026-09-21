import {
  useEffect,
  useState,
  Children,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  Users, Building2, Calendar, Handshake, CreditCard, FileText,
  DollarSign, LayoutDashboard, TrendingUp, ArrowUpRight, Search,
  Pencil, Trash2, Plus, ExternalLink, LogOut, Menu, X, Shield,
  Inbox,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { RaidaMark } from '../components/ui/Logo'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import AdminEditor, { confirmDelete, type AdminField } from '../components/admin/AdminEditor'
import { useAuth } from '../context/AuthContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { adminApi, catalogApi } from '../lib/catalog'
import { safeHref } from '../lib/safe'
import { springs, useMotionSafe } from '../lib/motion'
import type {
  AdminUser,
  Brand,
  CommunityCard,
  EventItem,
  Partner,
  PartnershipInquiry,
  PartnershipTier,
  PlatformStat,
  PricingPlan,
  ServiceCategory,
  SuccessStory,
} from '../types/api'
import SeoHead from '../components/seo/SeoHead'
import { routeSeo } from '../lib/seo'

type NavItem = {
  id: string
  label: string
  icon: typeof LayoutDashboard
  hint: string
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'المنصة',
    items: [
      { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, hint: 'ملخص الأداء والنشاط الأخير' },
      { id: 'users', label: 'المستخدمات', icon: Users, hint: 'إدارة الحسابات والأدوار والخطط' },
      { id: 'brands', label: 'العلامات', icon: Building2, hint: 'العلامات التجارية المعروضة في الدليل' },
      { id: 'events', label: 'الفعاليات', icon: Calendar, hint: 'إنشاء ونشر وإدارة الفعاليات' },
    ],
  },
  {
    label: 'النمو',
    items: [
      { id: 'partnerships', label: 'الشراكات', icon: Handshake, hint: 'الشركاء والطلبات ومستويات الرعاية' },
      { id: 'plans', label: 'خطط العضوية', icon: CreditCard, hint: 'الأسعار والمزايا وصلاحيات الدخول' },
    ],
  },
  {
    label: 'المحتوى والتحليل',
    items: [
      { id: 'content', label: 'المحتوى', icon: FileText, hint: 'قصص النجاح والإحصائيات والتصنيفات' },
      { id: 'revenue', label: 'الإيرادات', icon: DollarSign, hint: 'تحليل الاشتراكات والإيرادات التقديرية' },
    ],
  },
]

const adminNav = navGroups.flatMap((g) => g.items)

const planLabel: Record<string, string> = {
  FREE: 'مجاني',
  PROFESSIONAL: 'احترافي',
  BUSINESS: 'أعمال',
}

const roleLabel: Record<string, string> = {
  member: 'عضوة',
  moderator: 'مشرفة',
  admin: 'مديرة',
  super_admin: 'مديرة عليا',
}

const imageFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
const brandFallback =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop'
const eventFallback =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop'

function isAdminRole(role?: string) {
  return role === 'admin' || role === 'super_admin'
}

function money(value: number) {
  return `${value.toLocaleString('ar-DZ')} دج`
}

type Editor =
  | { kind: 'user'; item?: AdminUser }
  | { kind: 'brand'; item?: Brand }
  | { kind: 'event'; item?: EventItem }
  | { kind: 'partner'; item?: Partner }
  | { kind: 'tier'; item?: PartnershipTier }
  | { kind: 'plan'; item: PricingPlan }
  | { kind: 'story'; item?: SuccessStory }
  | { kind: 'card'; item?: CommunityCard }
  | { kind: 'stat'; item?: PlatformStat }
  | { kind: 'category'; item?: ServiceCategory }
  | null

function LoginForm({
  onSubmit,
  hint,
}: {
  onSubmit: (email: string, password: string) => Promise<void>
  hint: string
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تسجيل الدخول')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-full relative flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/[0.04] via-transparent to-rose-soft/40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(90vw,520px)] h-[320px] rounded-full bg-gold/10 blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[420px] rounded-[24px] bg-white/95 backdrop-blur-xl hairline shadow-md p-7 sm:p-8 space-y-5"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-[16px] bg-navy flex items-center justify-center ring-1 ring-gold/30 shadow-sm overflow-hidden">
            <RaidaMark className="w-10 h-10" />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-dark uppercase">RAIDA Admin</p>
            <h2 className="mt-1 text-xl font-extrabold text-navy tracking-[-0.03em]">دخول الإدارة</h2>
            <p className="mt-1.5 text-[13px] text-muted leading-relaxed">
              مساحة محمية لإدارة المنصة والمحتوى والعضوات.
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-muted mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="admin@…"
              className="w-full h-11 px-4 rounded-[12px] border border-navy/10 bg-ivory text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-muted mb-1.5">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full h-11 px-4 rounded-[12px] border border-navy/10 bg-ivory text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-[12px] bg-rose-soft/80 ring-1 ring-rose/25 px-3.5 py-2.5 text-[13px] text-navy">
            {error}
          </div>
        )}

        <Button type="submit" variant="gold" size="md" className="w-full" disabled={submitting}>
          {submitting ? 'جاري التحقق...' : 'دخول لوحة الإدارة'}
        </Button>

        <p className="text-[11px] text-muted text-center leading-relaxed">{hint}</p>
      </form>
    </div>
  )
}

function AdminChrome({
  children,
  onLogout,
  userEmail,
  leading,
}: {
  children: ReactNode
  onLogout?: () => void
  userEmail?: string
  leading?: ReactNode
}) {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#F5F2EE] overflow-hidden">
      <header className="relative shrink-0 h-16 sm:h-[68px] material-thick border-b border-navy/[0.07]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent"
          aria-hidden
        />
        <div className="relative h-full px-3 sm:px-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {leading}
            <div className="hidden sm:flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-[11px] bg-navy flex items-center justify-center overflow-hidden ring-1 ring-gold/20 shrink-0">
                <RaidaMark className="w-7 h-7" />
              </div>
              <div className="min-w-0 leading-none">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-gold-dark uppercase">RAIDA</p>
                <p className="mt-1 text-[14px] font-extrabold text-navy tracking-[-0.02em]">لوحة الإدارة</p>
              </div>
            </div>
            <div className="sm:hidden flex items-center gap-2">
              <div className="w-9 h-9 rounded-[11px] bg-navy flex items-center justify-center overflow-hidden">
                <RaidaMark className="w-7 h-7" />
              </div>
              <p className="text-[14px] font-extrabold text-navy">الإدارة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userEmail && (
              <div className="hidden md:flex items-center gap-2 max-w-[240px] h-10 px-3 rounded-full bg-white/80 hairline">
                <span className="w-6 h-6 rounded-full bg-navy text-gold text-[10px] font-bold flex items-center justify-center shrink-0">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
                <p className="truncate text-[12px] text-navy/70 font-medium">{userEmail}</p>
              </div>
            )}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="h-10 w-10 sm:w-auto sm:px-3.5 rounded-full bg-white hairline text-muted hover:text-navy hover:bg-blush/80 pressable inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-colors"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            )}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="h-10 px-3.5 sm:px-4 rounded-full bg-navy text-white text-[12px] sm:text-[13px] font-semibold pressable inline-flex items-center gap-2 shadow-sm ring-1 ring-gold/20 hover:bg-navy-light transition-colors"
            >
              <span className="hidden sm:inline">زيارة الموقع</span>
              <span className="sm:hidden">الموقع</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </header>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[18px] bg-white hairline shadow-xs overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="py-14 px-6 text-center">
      <div className="mx-auto w-12 h-12 rounded-[14px] bg-ivory ring-1 ring-navy/8 flex items-center justify-center mb-3">
        <Inbox className="w-5 h-5 text-muted" />
      </div>
      <p className="text-[14px] font-semibold text-navy">{title}</p>
      {hint && <p className="mt-1 text-[12px] text-muted max-w-sm mx-auto leading-relaxed">{hint}</p>}
    </div>
  )
}

function ActionBar({
  onAdd,
  addLabel,
  children,
}: {
  onAdd?: () => void
  addLabel?: string
  children?: ReactNode
}) {
  return (
    <div className="p-4 sm:p-5 border-b border-navy/[0.06] flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-gradient-to-l from-ivory/80 to-white">
      <div className="min-w-0 flex-1">{children}</div>
      {onAdd && (
        <Button variant="gold" size="sm" onClick={onAdd} className="shrink-0 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> {addLabel}
        </Button>
      )}
    </div>
  )
}

function IconActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete?: () => void
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="h-9 w-9 rounded-[10px] bg-ivory hover:bg-blush ring-1 ring-navy/8 hover:ring-rose/25 flex items-center justify-center pressable cursor-pointer transition-colors"
        title="تعديل"
        aria-label="تعديل"
      >
        <Pencil className="w-3.5 h-3.5 text-navy/70" />
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="h-9 w-9 rounded-[10px] bg-ivory hover:bg-rose-soft ring-1 ring-navy/8 hover:ring-rose/30 flex items-center justify-center pressable cursor-pointer transition-colors"
          title="حذف"
          aria-label="حذف"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose" />
        </button>
      )}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading, login, logout } = useAuth()
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [editor, setEditor] = useState<Editor>(null)
  const allowed = isAdminRole(user?.role)
  const { reduce } = useMotionSafe()
  const activeNav = adminNav.find((i) => i.id === active)

  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
    reload: reloadOverview,
  } = useAsyncData(
    () => (allowed && (active === 'overview' || active === 'plans') ? adminApi.overview() : Promise.resolve(null)),
    [user?.id, user?.role, active],
  )

  const {
    data: revenue,
    loading: revenueLoading,
    error: revenueError,
    reload: reloadRevenue,
  } = useAsyncData(
    () => (allowed && (active === 'revenue' || active === 'overview') ? adminApi.revenue() : Promise.resolve(null)),
    [user?.id, user?.role, active],
  )

  const {
    data: usersPayload,
    loading: usersLoading,
    error: usersError,
    reload: reloadUsers,
  } = useAsyncData(
    () =>
      allowed && active === 'users'
        ? adminApi.users({ limit: 100, search: userSearch.trim() || undefined })
        : Promise.resolve({ data: [] }),
    [user?.id, user?.role, active, userSearch],
  )

  const {
    data: brandsPayload,
    loading: brandsLoading,
    error: brandsError,
    reload: reloadBrands,
  } = useAsyncData(
    () => (allowed && active === 'brands' ? adminApi.brands({ limit: 100 }) : Promise.resolve({ data: [] })),
    [user?.id, user?.role, active],
  )

  const { data: membersPayload } = useAsyncData(
    () => (allowed && active === 'brands' ? catalogApi.members({ limit: 100 }) : Promise.resolve({ data: [] })),
    [user?.id, user?.role, active],
  )

  const {
    data: eventsPayload,
    loading: eventsLoading,
    error: eventsError,
    reload: reloadEvents,
  } = useAsyncData(
    () => (allowed && active === 'events' ? adminApi.events({ limit: 100 }) : Promise.resolve({ data: [] })),
    [user?.id, user?.role, active],
  )

  const {
    data: partners,
    loading: partnersLoading,
    error: partnersError,
    reload: reloadPartners,
  } = useAsyncData(
    () => (allowed && (active === 'partnerships' || active === 'overview') ? adminApi.partners() : Promise.resolve([])),
    [user?.id, user?.role, active],
  )

  const {
    data: tiers,
    loading: tiersLoading,
    error: tiersError,
    reload: reloadTiers,
  } = useAsyncData(
    () => (allowed && active === 'partnerships' ? adminApi.tiers() : Promise.resolve([])),
    [user?.id, user?.role, active],
  )

  const {
    data: inquiries,
    loading: inquiriesLoading,
    error: inquiriesError,
    reload: reloadInquiries,
  } = useAsyncData(
    () =>
      allowed && (active === 'partnerships' || active === 'overview')
        ? adminApi.partnershipInquiries()
        : Promise.resolve([] as PartnershipInquiry[]),
    [user?.id, user?.role, active],
  )

  const {
    data: plans,
    loading: plansLoading,
    error: plansError,
    reload: reloadPlans,
  } = useAsyncData(
    () => (allowed && (active === 'plans' || active === 'overview') ? adminApi.plans() : Promise.resolve([])),
    [user?.id, user?.role, active],
  )

  const {
    data: stories,
    loading: storiesLoading,
    error: storiesError,
    reload: reloadStories,
  } = useAsyncData(
    () => (allowed && active === 'content' ? adminApi.stories() : Promise.resolve([])),
    [user?.id, user?.role, active],
  )

  const {
    data: cards,
    loading: cardsLoading,
    error: cardsError,
    reload: reloadCards,
  } = useAsyncData(
    () => (allowed && active === 'content' ? adminApi.communityCards() : Promise.resolve([])),
    [user?.id, user?.role, active],
  )

  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    reload: reloadStats,
  } = useAsyncData(
    () => (allowed && active === 'content' ? adminApi.stats() : Promise.resolve([])),
    [user?.id, user?.role, active],
  )

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useAsyncData(
    () => (allowed && active === 'content' ? adminApi.serviceCategories() : Promise.resolve([])),
    [user?.id, user?.role, active],
  )

  if (authLoading) {
    return (
      <AdminChrome>
        <SeoHead
          title={routeSeo.admin.title}
          description={routeSeo.admin.description}
          path={routeSeo.admin.path}
          noindex
        />
        <LoadingBlock />
      </AdminChrome>
    )
  }

  if (!user) {
    return (
      <AdminChrome>
        <SeoHead
          title={routeSeo.admin.title}
          description={routeSeo.admin.description}
          path={routeSeo.admin.path}
          noindex
        />
        <LoginForm hint={import.meta.env.DEV ? 'admin@raida.local / Password123!' : 'أدخلي بيانات حسابك الإداري'} onSubmit={login} />
      </AdminChrome>
    )
  }

  if (!isAdminRole(user.role)) {
    return (
      <AdminChrome onLogout={() => logout()} userEmail={user.email}>
        <SeoHead
          title={routeSeo.admin.title}
          description={routeSeo.admin.description}
          path={routeSeo.admin.path}
          noindex
        />
        <div className="h-full flex items-center justify-center px-4">
          <div className="bg-white rounded-[22px] p-8 hairline shadow-sm max-w-md text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-[16px] bg-navy flex items-center justify-center ring-1 ring-gold/25">
              <Shield className="w-6 h-6 text-gold" />
            </div>
            <h2 className="text-lg font-extrabold text-navy tracking-[-0.02em]">غير مصرح بالدخول</h2>
            <p className="text-sm text-muted leading-relaxed">
              هذا الحساب لا يملك صلاحيات إدارية. إن كنتِ تحتاجين وصولاً، تواصلي مع المديرة العليا.
            </p>
            <Button to="/" target="_blank" rel="noreferrer" variant="gold" size="sm">
              زيارة الموقع
            </Button>
          </div>
        </div>
      </AdminChrome>
    )
  }

  const users = usersPayload?.data ?? []
  const brands = brandsPayload?.data ?? []
  const events = eventsPayload?.data ?? []
  const partnerList = partners ?? []
  const tierList = tiers ?? []
  const inquiryList = inquiries ?? []
  const planList = plans ?? []
  const storyList = stories ?? []
  const cardList = cards ?? []
  const statList = stats ?? []
  const categoryList = categories ?? []
  const memberOptions = (membersPayload?.data ?? []).map((m) => ({ value: m.id, label: m.name }))
  const recentMembers = overview?.recentMembers ?? []
  const planDistribution = overview?.planDistribution ?? []
  const kpis = overview?.kpis

  const tabLoading =
    ((active === 'overview' || active === 'plans') && (overviewLoading || plansLoading)) ||
    (active === 'users' && usersLoading) ||
    (active === 'brands' && brandsLoading) ||
    (active === 'events' && eventsLoading) ||
    (active === 'partnerships' && (partnersLoading || tiersLoading || inquiriesLoading)) ||
    (active === 'content' && (storiesLoading || cardsLoading || statsLoading || categoriesLoading)) ||
    (active === 'revenue' && revenueLoading)

  const tabError =
    ((active === 'overview' || active === 'plans') && (overviewError || plansError)) ||
    (active === 'users' && usersError) ||
    (active === 'brands' && brandsError) ||
    (active === 'events' && eventsError) ||
    (active === 'partnerships' && (partnersError || tiersError || inquiriesError)) ||
    (active === 'content' && (storiesError || cardsError || statsError || categoriesError)) ||
    (active === 'revenue' && revenueError) ||
    null

  const reloadActive = () => {
    if (active === 'overview') {
      reloadOverview()
      reloadRevenue()
      reloadPlans()
    }
    if (active === 'users') reloadUsers()
    if (active === 'brands') reloadBrands()
    if (active === 'events') reloadEvents()
    if (active === 'partnerships') {
      reloadPartners()
      reloadTiers()
      reloadInquiries()
    }
    if (active === 'plans') {
      reloadOverview()
      reloadPlans()
    }
    if (active === 'content') {
      reloadStories()
      reloadCards()
      reloadStats()
      reloadCategories()
    }
    if (active === 'revenue') reloadRevenue()
  }

  const kpiCards = [
    { label: 'إجمالي العضوات', value: String(kpis?.members ?? '—'), change: '', icon: Users },
    { label: 'العلامات التجارية', value: String(kpis?.brands ?? '—'), change: '', icon: Building2 },
    { label: 'الشركاء', value: String(kpis?.partners ?? '—'), change: '', icon: Handshake },
    { label: 'فعاليات نشطة', value: String(kpis?.activeEvents ?? '—'), change: '', icon: Calendar },
  ]

  const totalPlanCount = planDistribution.reduce((sum, p) => sum + Number(p.count), 0) || 1
  const maxRevenue = Math.max(1, ...(revenue?.breakdown.map((row) => row.monthlyRevenue) ?? [1]))

  const userFields = (creating: boolean): AdminField[] => [
    ...(creating
      ? [
          { name: 'email', label: 'البريد الإلكتروني', type: 'email' as const, required: true },
          { name: 'password', label: 'كلمة المرور', type: 'password' as const, required: true, hint: '10 أحرف على الأقل' },
        ]
      : []),
    { name: 'name', label: 'الاسم', required: creating },
    { name: 'title', label: 'المسمى' },
    { name: 'specialty', label: 'التخصص' },
    { name: 'city', label: 'المدينة' },
    { name: 'wilaya', label: 'الولاية' },
    { name: 'category', label: 'التصنيف' },
    { name: 'image', label: 'صورة الملف', type: 'image' },
    { name: 'cover', label: 'صورة الغلاف', type: 'image' },
    {
      name: 'role',
      label: 'الدور',
      type: 'select',
      options: [
        { value: 'member', label: 'عضوة' },
        { value: 'moderator', label: 'مشرفة' },
        { value: 'admin', label: 'مديرة' },
      ],
    },
    {
      name: 'plan',
      label: 'الخطة',
      type: 'select',
      options: [
        { value: 'FREE', label: 'مجاني' },
        { value: 'PROFESSIONAL', label: 'احترافي' },
        { value: 'BUSINESS', label: 'أعمال' },
      ],
    },
    { name: 'is_active', label: 'الحساب نشط', type: 'toggle' },
  ]

  const brandFields: AdminField[] = [
    { name: 'name', label: 'اسم العلامة', required: true },
    { name: 'category', label: 'التصنيف', required: true },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true },
    { name: 'story', label: 'القصة', type: 'textarea' },
    { name: 'logo', label: 'الشعار', type: 'image' },
    { name: 'cover', label: 'الغلاف', type: 'image' },
    { name: 'products', label: 'المنتجات (سطر لكل عنصر)', type: 'lines' },
    { name: 'services', label: 'الخدمات (سطر لكل عنصر)', type: 'lines' },
    { name: 'founder_id', label: 'المؤسسة', type: 'select', options: memberOptions },
    { name: 'is_active', label: 'نشطة', type: 'toggle' },
  ]

  const eventFields: AdminField[] = [
    { name: 'title', label: 'العنوان', required: true },
    { name: 'date', label: 'التاريخ', required: true },
    { name: 'time', label: 'الوقت' },
    { name: 'location', label: 'المكان', required: true },
    { name: 'category', label: 'التصنيف', required: true },
    { name: 'price', label: 'السعر' },
    { name: 'capacity', label: 'السعة', type: 'number' },
    { name: 'image', label: 'صورة الفعالية', type: 'image' },
    { name: 'registration_url', label: 'رابط منصة التسجيل' },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true },
    { name: 'is_published', label: 'منشورة', type: 'toggle' },
  ]

  const partnerFields: AdminField[] = [
    { name: 'name', label: 'الاسم', required: true },
    { name: 'type', label: 'النوع', required: true },
    { name: 'logo', label: 'الشعار', type: 'image' },
    { name: 'website', label: 'الموقع' },
    { name: 'is_active', label: 'نشط', type: 'toggle' },
  ]

  const tierFields: AdminField[] = [
    { name: 'name', label: 'الاسم (EN)', required: true },
    { name: 'name_ar', label: 'الاسم بالعربية', required: true },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true },
    { name: 'benefits', label: 'المزايا (سطر لكل ميزة)', type: 'lines' },
    { name: 'color', label: 'اللون' },
    { name: 'sort_order', label: 'الترتيب', type: 'number' },
  ]

  const planFields: AdminField[] = [
    { name: 'name_ar', label: 'الاسم بالعربية', required: true },
    { name: 'price', label: 'السعر', required: true },
    { name: 'period', label: 'الفترة' },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true },
    { name: 'features', label: 'المزايا (سطر لكل ميزة)', type: 'lines' },
    { name: 'cta', label: 'نص الزر' },
    { name: 'highlighted', label: 'خطة مميزة', type: 'toggle' },
    { name: 'grants_access', label: 'تمنح دخول لوحة العضوة', type: 'toggle' },
    { name: 'is_active', label: 'ظاهرة في الموقع', type: 'toggle' },
  ]

  const storyFields: AdminField[] = [
    { name: 'title', label: 'العنوان', required: true },
    { name: 'excerpt', label: 'المقتطف', type: 'textarea', required: true },
    { name: 'author', label: 'الكاتبة', required: true },
    { name: 'category', label: 'التصنيف', required: true },
    { name: 'image', label: 'صورة القصة', type: 'image' },
    { name: 'featured', label: 'مميزة', type: 'toggle' },
    { name: 'is_published', label: 'منشورة', type: 'toggle' },
  ]

  const cardFields: AdminField[] = [
    { name: 'title', label: 'العنوان', required: true },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true },
    { name: 'icon', label: 'الأيقونة', required: true },
    { name: 'color', label: 'اللون', required: true },
    { name: 'sort_order', label: 'الترتيب', type: 'number' },
  ]

  const statFields: AdminField[] = [
    { name: 'label', label: 'التسمية', required: true },
    { name: 'value', label: 'القيمة', type: 'number', required: true },
    { name: 'suffix', label: 'اللاحقة' },
    { name: 'sort_order', label: 'الترتيب', type: 'number' },
  ]

  const categoryFields: AdminField[] = [
    { name: 'name', label: 'الاسم', required: true },
    { name: 'icon', label: 'الأيقونة', required: true },
    { name: 'count', label: 'العدد', type: 'number' },
    { name: 'sort_order', label: 'الترتيب', type: 'number' },
  ]

  const editorConfig = (() => {
    if (!editor) return null
    if (editor.kind === 'user') {
      const creating = !editor.item
      return {
        title: creating ? 'إضافة عضوة' : 'تعديل عضوة',
        fields: userFields(creating),
        initial: editor.item
          ? {
              name: editor.item.profile?.name,
              title: editor.item.profile?.title,
              specialty: editor.item.profile?.specialty,
              city: editor.item.profile?.city,
              wilaya: editor.item.profile?.wilaya,
              category: editor.item.profile?.category,
              image: editor.item.profile?.image,
              cover: editor.item.profile?.cover,
              role: editor.item.role,
              plan: editor.item.plan,
              is_active: editor.item.isActive,
            }
          : { role: 'member', plan: 'FREE', is_active: true },
        submit: (values: Record<string, unknown>) =>
          creating ? adminApi.createUser(values) : adminApi.updateUser(editor.item!.id, values),
        reload: reloadUsers,
      }
    }
    if (editor.kind === 'brand') {
      return {
        title: editor.item ? 'تعديل علامة' : 'إضافة علامة',
        fields: brandFields,
        initial: editor.item
          ? { ...editor.item, founder_id: editor.item.founderId, is_active: editor.item.isActive !== false }
          : { is_active: true },
        submit: (values: Record<string, unknown>) =>
          editor.item ? adminApi.updateBrand(editor.item.id, values) : adminApi.createBrand(values),
        reload: reloadBrands,
      }
    }
    if (editor.kind === 'event') {
      return {
        title: editor.item ? 'تعديل فعالية' : 'إنشاء فعالية',
        fields: eventFields,
        initial: editor.item
          ? {
              ...editor.item,
              is_published: editor.item.isPublished !== false,
              registration_url: editor.item.registrationUrl || '',
            }
          : { is_published: true },
        submit: (values: Record<string, unknown>) =>
          editor.item ? adminApi.updateEvent(editor.item.id, values) : adminApi.createEvent(values),
        reload: reloadEvents,
      }
    }
    if (editor.kind === 'partner') {
      return {
        title: editor.item ? 'تعديل شريك' : 'إضافة شريك',
        fields: partnerFields,
        initial: editor.item ? { ...editor.item, is_active: editor.item.isActive !== false } : { is_active: true },
        submit: (values: Record<string, unknown>) =>
          adminApi.upsertPartner(editor.item ? { id: editor.item.id, ...values } : values),
        reload: reloadPartners,
      }
    }
    if (editor.kind === 'tier') {
      return {
        title: editor.item ? 'تعديل مستوى شراكة' : 'إضافة مستوى شراكة',
        fields: tierFields,
        initial: editor.item
          ? { ...editor.item, name_ar: editor.item.nameAr, sort_order: editor.item.sortOrder }
          : {},
        submit: (values: Record<string, unknown>) =>
          adminApi.upsertTier(editor.item ? { id: editor.item.id, ...values } : values),
        reload: reloadTiers,
      }
    }
    if (editor.kind === 'plan') {
      return {
        title: `تعديل خطة ${planLabel[editor.item.name] || editor.item.name}`,
        fields: planFields,
        initial: {
          name_ar: editor.item.nameAr,
          price: editor.item.price,
          period: editor.item.period,
          description: editor.item.description,
          features: editor.item.features,
          cta: editor.item.cta,
          highlighted: editor.item.highlighted,
          grants_access: editor.item.grantsAccess !== false,
          is_active: editor.item.isActive !== false,
        },
        submit: (values: Record<string, unknown>) => adminApi.updatePlan(editor.item.id, values),
        reload: () => {
          reloadPlans()
          reloadOverview()
        },
      }
    }
    if (editor.kind === 'story') {
      return {
        title: editor.item ? 'تعديل قصة نجاح' : 'إضافة قصة نجاح',
        fields: storyFields,
        initial: editor.item
          ? { ...editor.item, is_published: editor.item.isPublished !== false }
          : { featured: false, is_published: true },
        submit: (values: Record<string, unknown>) =>
          adminApi.upsertStory(editor.item ? { id: editor.item.id, ...values } : values),
        reload: reloadStories,
      }
    }
    if (editor.kind === 'card') {
      return {
        title: editor.item ? 'تعديل بطاقة مجتمع' : 'إضافة بطاقة مجتمع',
        fields: cardFields,
        initial: editor.item ? { ...editor.item, sort_order: editor.item.sortOrder } : {},
        submit: (values: Record<string, unknown>) =>
          adminApi.upsertCommunityCard(editor.item ? { id: editor.item.id, ...values } : values),
        reload: reloadCards,
      }
    }
    if (editor.kind === 'stat') {
      return {
        title: editor.item ? 'تعديل إحصائية' : 'إضافة إحصائية',
        fields: statFields,
        initial: editor.item ? { ...editor.item, sort_order: editor.item.sortOrder } : {},
        submit: (values: Record<string, unknown>) =>
          adminApi.upsertStat(editor.item ? { id: editor.item.id, ...values } : values),
        reload: reloadStats,
      }
    }
    return {
      title: editor.item ? 'تعديل تصنيف خدمة' : 'إضافة تصنيف خدمة',
      fields: categoryFields,
      initial: editor.item ? { ...editor.item, sort_order: editor.item.sortOrder } : {},
      submit: (values: Record<string, unknown>) =>
        adminApi.upsertServiceCategory(editor.item ? { id: editor.item.id, ...values } : values),
      reload: reloadCategories,
    }
  })()

  return (
    <AdminChrome
      onLogout={() => logout()}
      userEmail={user.email}
      leading={
        <button
          type="button"
          className="lg:hidden h-10 w-10 rounded-full bg-white hairline flex items-center justify-center pressable text-navy"
          onClick={() => setSidebarOpen(true)}
          aria-label="فتح القائمة"
        >
          <Menu className="w-4 h-4" />
        </button>
      }
    >
      <SeoHead
        title={routeSeo.admin.title}
        description={routeSeo.admin.description}
        path={routeSeo.admin.path}
        noindex
      />
      {editor && editorConfig && (
        <AdminEditor
          title={editorConfig.title}
          fields={editorConfig.fields}
          initial={editorConfig.initial}
          onClose={() => setEditor(null)}
          onSubmit={async (values) => {
            await editorConfig.submit(values)
            editorConfig.reload()
          }}
        />
      )}

      <div className="h-full flex min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-[268px] shrink-0 flex-col border-l border-navy/[0.07] bg-[#0A1328] text-white">
          <div className="px-4 pt-5 pb-3">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-gold/80 uppercase">Console</p>
            <p className="mt-1 text-[13px] text-white/55 leading-snug">إدارة RAIDA بالكامل من مكان واحد</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-2.5 pb-4 space-y-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/35 uppercase">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = active === item.id
                    const badgeCount =
                      item.id === 'partnerships'
                        ? inquiryList.filter((q) => q.status === 'new').length
                        : 0
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActive(item.id)}
                        className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                            : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-gold" />
                        )}
                        <span
                          className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-gold/15 text-gold' : 'bg-white/[0.06] text-white/70'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 text-right">{item.label}</span>
                        {badgeCount > 0 && (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-rose text-navy text-[10px] font-bold flex items-center justify-center">
                            {badgeCount}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="p-3 border-t border-white/10">
            <div className="rounded-[14px] bg-white/[0.06] ring-1 ring-white/10 px-3 py-3">
              <p className="text-[11px] text-white/45">الدور</p>
              <p className="mt-0.5 text-[13px] font-semibold text-gold">
                {roleLabel[user.role] || user.role}
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar sheet */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-navy/45 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                className="fixed top-0 bottom-0 right-0 z-[60] w-[min(88vw,300px)] lg:hidden flex flex-col bg-navy text-white shadow-xl"
                initial={reduce ? { opacity: 0 } : { x: 28, opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { x: 20, opacity: 0 }}
                transition={springs.snappy}
              >
                <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
                  <p className="text-[13px] font-semibold">الأقسام</p>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center pressable"
                    aria-label="إغلاق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-3 space-y-4">
                  {navGroups.map((group) => (
                    <div key={group.label}>
                      <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/35 uppercase">
                        {group.label}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const Icon = item.icon
                          const isActive = active === item.id
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setActive(item.id)
                                setSidebarOpen(false)
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-medium ${
                                isActive ? 'bg-white/10 text-white' : 'text-white/60'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : ''}`} />
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 max-w-[1280px]">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-navy/60 ring-1 ring-navy/8 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  {activeNav?.id || 'admin'}
                </div>
                <h2 className="text-[1.55rem] sm:text-[1.75rem] font-extrabold text-navy tracking-[-0.03em]">
                  {activeNav?.label}
                </h2>
                <p className="mt-1 text-[13px] text-muted max-w-xl leading-relaxed">
                  {activeNav?.hint}
                </p>
              </div>
            </div>

            {tabLoading ? (
              <LoadingBlock />
            ) : tabError ? (
              <ErrorBlock message={tabError} onRetry={reloadActive} />
            ) : (
              <>
              {active === 'overview' && (
                <div className="space-y-5 animate-fade-up">
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                    {kpiCards.map((k) => {
                      const Icon = k.icon
                      return (
                        <Panel key={k.label} className="relative p-4 sm:p-5">
                          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-l from-gold via-rose/80 to-transparent" />
                          <div className="flex items-center justify-between gap-2">
                            <div className="w-10 h-10 rounded-[12px] bg-navy/[0.04] ring-1 ring-navy/8 flex items-center justify-center">
                              <Icon className="w-[18px] h-[18px] text-navy" />
                            </div>
                            {k.change && (
                              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                                <ArrowUpRight className="w-3 h-3" /> {k.change}
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-2xl sm:text-[1.65rem] font-extrabold text-navy tracking-[-0.03em] tabular-nums">
                            {k.value}
                          </p>
                          <p className="text-[11px] text-muted mt-1">{k.label}</p>
                        </Panel>
                      )
                    })}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
                    <Panel className="lg:col-span-2 p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-bold text-navy tracking-[-0.01em]">الإيرادات حسب الخطة</h3>
                          <p className="text-[12px] text-muted mt-0.5">تقدير شهري للاشتراكات النشطة</p>
                        </div>
                        <div className="w-10 h-10 rounded-[12px] bg-gold/15 ring-1 ring-gold/25 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-gold-dark" />
                        </div>
                      </div>
                      <div className="flex items-end gap-3 h-48">
                        {(revenue?.breakdown ?? []).map((row) => (
                          <div key={row.plan} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                            <div
                              className="w-full rounded-t-[10px] bg-gradient-to-t from-navy to-gold"
                              style={{ height: `${Math.max(8, (row.monthlyRevenue / maxRevenue) * 100)}%` }}
                            />
                            <span className="text-[10px] text-muted text-center truncate w-full">{row.nameAr}</span>
                          </div>
                        ))}
                        {(revenue?.breakdown ?? []).length === 0 && (
                          <p className="w-full text-center text-sm text-muted self-center">لا توجد بيانات إيرادات بعد</p>
                        )}
                      </div>
                      <div className="mt-5 pt-4 border-t border-navy/[0.06] flex items-center justify-between gap-3">
                        <p className="text-[13px] text-muted">الإجمالي الشهري</p>
                        <p className="text-[15px] font-extrabold text-navy tabular-nums">
                          {money(revenue?.monthlyRevenue ?? 0)}
                        </p>
                      </div>
                    </Panel>

                    <Panel className="p-5 sm:p-6">
                      <h3 className="font-bold text-navy mb-1 tracking-[-0.01em]">توزيع الخطط</h3>
                      <p className="text-[12px] text-muted mb-5">نسبة العضوات حسب الاشتراك</p>
                      <div className="space-y-4">
                        {(planDistribution.length
                          ? planDistribution
                          : [
                              { plan: 'FREE', count: 0 },
                              { plan: 'PROFESSIONAL', count: 0 },
                              { plan: 'BUSINESS', count: 0 },
                            ]
                        ).map((p, i) => {
                          const pct = Math.round((Number(p.count) / totalPlanCount) * 100)
                          const color = ['bg-navy/30', 'bg-rose', 'bg-gold'][i % 3]
                          return (
                            <div key={p.plan}>
                              <div className="flex justify-between text-[13px] mb-1.5">
                                <span className="text-navy font-medium">{planLabel[p.plan] || p.plan}</span>
                                <span className="text-muted tabular-nums">{pct}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-ivory overflow-hidden ring-1 ring-navy/5">
                                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-6 p-4 rounded-[14px] bg-navy text-white">
                        <p className="text-[11px] text-white/50">إجمالي العضوات</p>
                        <p className="text-2xl font-extrabold text-gold mt-1 tabular-nums">{kpis?.members ?? 0}</p>
                      </div>
                    </Panel>
                  </div>

                  <Panel>
                    <div className="px-5 sm:px-6 py-4 border-b border-navy/[0.06] flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-navy tracking-[-0.01em]">آخر العضوات المسجّلات</h3>
                        <p className="text-[12px] text-muted mt-0.5">أحدث الحسابات في المنصة</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActive('users')}
                        className="text-[12px] font-semibold text-gold-dark hover:text-navy pressable-soft"
                      >
                        عرض الكل
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-muted text-[11px] border-b border-navy/[0.05] bg-ivory/60">
                            <th className="text-right px-5 py-3 font-semibold">العضوة</th>
                            <th className="text-right px-5 py-3 font-semibold">التخصص</th>
                            <th className="text-right px-5 py-3 font-semibold">المدينة</th>
                            <th className="text-right px-5 py-3 font-semibold">الخطة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentMembers.slice(0, 5).map((m) => (
                            <tr key={m.id} className="border-b border-navy/[0.04] hover:bg-blush/40 transition-colors">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  <img src={m.image || imageFallback} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-navy/8" />
                                  <span className="font-medium text-navy">{m.name}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-muted">{m.specialty}</td>
                              <td className="px-5 py-3 text-muted">{m.city}</td>
                              <td className="px-5 py-3">
                                <Badge variant={m.plan === 'BUSINESS' ? 'gold' : 'soft'}>
                                  {planLabel[m.plan || ''] || m.plan || 'مجاني'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                          {recentMembers.length === 0 && (
                            <tr>
                              <td colSpan={4}>
                                <EmptyState title="لا توجد عضوات بعد" hint="ستظهر هنا أحدث التسجيلات تلقائياً." />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Panel>
                </div>
              )}

              {active === 'users' && (
                <Panel className="animate-fade-up">
                  <ActionBar onAdd={() => setEditor({ kind: 'user' })} addLabel="إضافة عضوة">
                    <div className="relative max-w-sm">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        placeholder="بحث بالاسم أو البريد..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pr-10 pl-4 py-2.5 rounded-[12px] border border-navy/10 bg-white text-sm w-full focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/15 transition"
                      />
                    </div>
                  </ActionBar>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-muted text-[11px] bg-ivory/70 border-b border-navy/[0.05]">
                          <th className="text-right p-4 font-semibold">العضوة</th>
                          <th className="text-right p-4 font-semibold">الدور</th>
                          <th className="text-right p-4 font-semibold">الخطة</th>
                          <th className="text-right p-4 font-semibold">المدينة</th>
                          <th className="text-right p-4 font-semibold">الحالة</th>
                          <th className="text-right p-4 font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => {
                          const m = u.profile
                          return (
                            <tr key={u.id} className="border-t border-navy/[0.04] hover:bg-blush/35 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img src={m?.image || imageFallback} alt="" className="w-9 h-9 rounded-[10px] object-cover ring-1 ring-navy/8" />
                                  <div className="min-w-0">
                                    <p className="font-semibold text-navy truncate">{m?.name || u.email}</p>
                                    <p className="text-[11px] text-muted truncate">{u.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-muted">{roleLabel[u.role] || u.role}</td>
                              <td className="p-4">
                                <Badge variant={u.plan === 'BUSINESS' ? 'gold' : 'soft'}>
                                  {planLabel[u.plan] || u.plan}
                                </Badge>
                              </td>
                              <td className="p-4 text-muted">{m?.city || '—'}</td>
                              <td className="p-4">
                                <Badge variant={u.isActive ? 'rose' : 'soft'}>
                                  {u.isActive ? 'نشطة' : 'موقوفة'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <IconActions onEdit={() => setEditor({ kind: 'user', item: u })} />
                              </td>
                            </tr>
                          )
                        })}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={6}>
                              <EmptyState title="لا توجد مستخدمات" hint="أضيفي عضوة جديدة أو عدّلي كلمات البحث." />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              )}

              {active === 'brands' && (
                <div className="space-y-4 animate-fade-up">
                  <div className="flex justify-end">
                    <Button variant="gold" size="sm" onClick={() => setEditor({ kind: 'brand' })}>
                      <Plus className="w-4 h-4" /> إضافة علامة
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {brands.map((b) => (
                      <Panel key={b.id} className="p-4 sm:p-5 flex items-center gap-4">
                        <img src={b.logo || brandFallback} alt="" className="w-14 h-14 rounded-[14px] object-cover ring-1 ring-navy/8" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-navy truncate">{b.name}</p>
                          <p className="text-[12px] text-muted mt-0.5">{b.category}</p>
                        </div>
                        <Badge variant={b.isActive !== false ? 'gold' : 'soft'}>
                          {b.isActive !== false ? 'نشطة' : 'موقوفة'}
                        </Badge>
                        <IconActions
                          onEdit={() => setEditor({ kind: 'brand', item: b })}
                          onDelete={async () => {
                            if (!confirmDelete(b.name)) return
                            await adminApi.deleteBrand(b.id)
                            reloadBrands()
                          }}
                        />
                      </Panel>
                    ))}
                    {brands.length === 0 && (
                      <Panel className="sm:col-span-2">
                        <EmptyState title="لا توجد علامات" hint="أضيفي علامة تجارية لعرضها في الدليل." />
                      </Panel>
                    )}
                  </div>
                </div>
              )}

              {active === 'events' && (
                <div className="space-y-3 animate-fade-up">
                  <div className="flex justify-end mb-1">
                    <Button variant="gold" size="sm" onClick={() => setEditor({ kind: 'event' })}>
                      <Plus className="w-4 h-4" /> إنشاء فعالية
                    </Button>
                  </div>
                  {events.map((e) => (
                    <Panel key={e.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img src={e.image || eventFallback} alt="" className="w-full sm:w-20 h-28 sm:h-14 rounded-[12px] object-cover ring-1 ring-navy/8" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-navy">{e.title}</p>
                        <p className="text-[12px] text-muted mt-0.5">{e.date} — {e.category}</p>
                      </div>
                      <Badge variant={e.isPublished === false ? 'soft' : 'rose'}>
                        {e.isPublished === false ? 'مسودة' : e.price || 'منشورة'}
                      </Badge>
                      {safeHref(e.registrationUrl) && (
                        <a
                          href={safeHref(e.registrationUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="h-9 px-3 rounded-full bg-navy text-white text-[12px] font-semibold inline-flex items-center gap-1.5 pressable hover:bg-navy-light"
                        >
                          منصة التسجيل
                        </a>
                      )}
                      <IconActions
                        onEdit={() => setEditor({ kind: 'event', item: e })}
                        onDelete={async () => {
                          if (!confirmDelete(e.title)) return
                          await adminApi.deleteEvent(e.id)
                          reloadEvents()
                        }}
                      />
                    </Panel>
                  ))}
                  {events.length === 0 && (
                    <Panel>
                      <EmptyState title="لا توجد فعاليات" hint="أنشئي فعالية جديدة لنشرها على المنصة." />
                    </Panel>
                  )}
                </div>
              )}

              {active === 'partnerships' && (
                <div className="space-y-7 animate-fade-up">
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-navy tracking-[-0.01em]">الشركاء</h3>
                      <Button variant="gold" size="sm" onClick={() => setEditor({ kind: 'partner' })}>
                        <Plus className="w-4 h-4" /> إضافة شريك
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {partnerList.map((p) => (
                        <Panel key={p.id} className="p-5 text-center">
                          <div className="w-12 h-12 mx-auto rounded-[14px] bg-navy flex items-center justify-center mb-3 ring-1 ring-gold/20">
                            <span className="text-gold font-bold">{p.name[0]}</span>
                          </div>
                          <p className="font-bold text-navy text-sm">{p.name}</p>
                          <p className="text-[11px] text-muted mt-1">{p.type}</p>
                          <div className="mt-3 flex justify-center">
                            <IconActions
                              onEdit={() => setEditor({ kind: 'partner', item: p })}
                              onDelete={async () => {
                                if (!confirmDelete(p.name)) return
                                await adminApi.deletePartner(p.id)
                                reloadPartners()
                              }}
                            />
                          </div>
                        </Panel>
                      ))}
                      {partnerList.length === 0 && (
                        <Panel className="sm:col-span-2 lg:col-span-4">
                          <EmptyState title="لا يوجد شركاء" hint="أضيفي شركاء لإظهارهم في صفحة الشراكات." />
                        </Panel>
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-navy tracking-[-0.01em]">مستويات الشراكة</h3>
                      <Button variant="gold" size="sm" onClick={() => setEditor({ kind: 'tier' })}>
                        <Plus className="w-4 h-4" /> إضافة مستوى
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      {tierList.map((t) => (
                        <Panel key={t.id} className="p-5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-bold text-navy">{t.nameAr || t.name}</p>
                              <p className="text-[12px] text-muted mt-1 leading-relaxed">{t.description}</p>
                            </div>
                            <IconActions
                              onEdit={() => setEditor({ kind: 'tier', item: t })}
                              onDelete={async () => {
                                if (!confirmDelete(t.nameAr || t.name)) return
                                await adminApi.deleteTier(t.id)
                                reloadTiers()
                              }}
                            />
                          </div>
                        </Panel>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-navy tracking-[-0.01em]">طلبات الشراكة</h3>
                        <p className="text-[12px] text-muted mt-0.5">
                          {inquiryList.filter((q) => q.status === 'new').length} طلب جديد
                        </p>
                      </div>
                    </div>
                    <Panel className="divide-y divide-navy/[0.05]">
                      {inquiryList.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`w-full text-right p-4 sm:p-5 hover:bg-blush/40 transition-colors ${
                            item.status === 'new' ? 'bg-rose-soft/40' : ''
                          }`}
                          onClick={async () => {
                            if (item.status === 'new') {
                              await adminApi.markPartnershipInquiryRead(item.id)
                              reloadInquiries()
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[13px] font-bold text-navy">{item.organization}</p>
                              <p className="text-[12px] text-muted mt-0.5">
                                {item.name} · {item.email}
                                {item.tier ? ` · ${item.tier}` : ''}
                              </p>
                              <p className="text-[13px] text-navy/80 mt-2 leading-relaxed">{item.message}</p>
                            </div>
                            <Badge variant={item.status === 'new' ? 'rose' : 'soft'}>
                              {item.status === 'new' ? 'جديدة' : 'مقروءة'}
                            </Badge>
                          </div>
                        </button>
                      ))}
                      {inquiryList.length === 0 && (
                        <EmptyState title="لا توجد طلبات شراكة بعد" hint="ستظهر الطلبات الواردة من صفحة الشراكات هنا." />
                      )}
                    </Panel>
                  </section>
                </div>
              )}

              {active === 'plans' && (
                <div className="grid md:grid-cols-3 gap-3 sm:gap-4 animate-fade-up">
                  {planList.map((p) => {
                    const members = planDistribution.find((row) => row.plan === p.name)?.count ?? 0
                    return (
                      <Panel key={p.id} className={`p-5 sm:p-6 ${p.highlighted ? 'ring-1 ring-gold/35' : ''}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-navy text-lg tracking-[-0.02em]">{p.nameAr}</h3>
                            <p className="text-[11px] text-muted mt-0.5">{p.name}</p>
                          </div>
                          <IconActions onEdit={() => setEditor({ kind: 'plan', item: p })} />
                        </div>
                        <p className="text-3xl font-extrabold text-navy mt-4 tracking-[-0.03em]">{p.price}</p>
                        <p className="text-[12px] text-muted">{p.period}</p>
                        <p className="text-[13px] text-muted mt-3 leading-relaxed">{p.description}</p>
                        <ul className="mt-4 space-y-1.5 text-[12px] text-navy">
                          {p.features.slice(0, 4).map((feature) => (
                            <li key={feature} className="flex gap-2">
                              <span className="text-gold mt-0.5">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-5 flex items-center gap-2 flex-wrap">
                          <Badge variant={p.highlighted ? 'gold' : 'soft'}>{members} عضوة</Badge>
                          <Badge variant={p.grantsAccess === false ? 'soft' : 'rose'}>
                            {p.grantsAccess === false ? 'بدون دخول' : 'تمنح الدخول'}
                          </Badge>
                          <Badge variant={p.isActive === false ? 'soft' : 'navy'}>
                            {p.isActive === false ? 'مخفية' : 'ظاهرة'}
                          </Badge>
                        </div>
                      </Panel>
                    )
                  })}
                </div>
              )}

              {active === 'content' && (
                <div className="space-y-8 animate-fade-up">
                  <ContentSection
                    title="قصص النجاح"
                    onAdd={() => setEditor({ kind: 'story' })}
                    addLabel="إضافة قصة"
                  >
                    {storyList.map((item) => (
                      <ContentRow
                        key={item.id}
                        title={item.title}
                        subtitle={`${item.author} — ${item.category}`}
                        onEdit={() => setEditor({ kind: 'story', item })}
                        onDelete={async () => {
                          if (!confirmDelete(item.title)) return
                          await adminApi.deleteStory(item.id)
                          reloadStories()
                        }}
                      />
                    ))}
                  </ContentSection>

                  <ContentSection
                    title="بطاقات المجتمع"
                    onAdd={() => setEditor({ kind: 'card' })}
                    addLabel="إضافة بطاقة"
                  >
                    {cardList.map((item) => (
                      <ContentRow
                        key={item.id}
                        title={item.title}
                        subtitle={item.description}
                        onEdit={() => setEditor({ kind: 'card', item })}
                        onDelete={async () => {
                          if (!confirmDelete(item.title)) return
                          await adminApi.deleteCommunityCard(item.id)
                          reloadCards()
                        }}
                      />
                    ))}
                  </ContentSection>

                  <ContentSection
                    title="إحصائيات الصفحة الرئيسية"
                    onAdd={() => setEditor({ kind: 'stat' })}
                    addLabel="إضافة إحصائية"
                  >
                    {statList.map((item) => (
                      <ContentRow
                        key={item.id}
                        title={item.label}
                        subtitle={`${item.value}${item.suffix || ''}`}
                        onEdit={() => setEditor({ kind: 'stat', item })}
                        onDelete={async () => {
                          if (!confirmDelete(item.label)) return
                          await adminApi.deleteStat(item.id)
                          reloadStats()
                        }}
                      />
                    ))}
                  </ContentSection>

                  <ContentSection
                    title="تصنيفات الخدمات"
                    onAdd={() => setEditor({ kind: 'category' })}
                    addLabel="إضافة تصنيف"
                  >
                    {categoryList.map((item) => (
                      <ContentRow
                        key={item.id}
                        title={item.name}
                        subtitle={`${item.count} عنصر`}
                        onEdit={() => setEditor({ kind: 'category', item })}
                        onDelete={async () => {
                          if (!confirmDelete(item.name)) return
                          await adminApi.deleteServiceCategory(item.id)
                          reloadCategories()
                        }}
                      />
                    ))}
                  </ContentSection>
                </div>
              )}

              {active === 'revenue' && (
                <div className="space-y-5 animate-fade-up">
                  <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { label: 'إيرادات شهرية تقديرية', value: money(revenue?.monthlyRevenue ?? 0) },
                      { label: 'متوسط الاشتراك', value: money(revenue?.averageSubscription ?? 0) },
                      { label: 'عضوات مدفوعات', value: String(revenue?.payingMembers ?? 0) },
                    ].map((s) => (
                      <Panel key={s.label} className="p-5">
                        <p className="text-[12px] text-muted">{s.label}</p>
                        <p className="text-2xl font-extrabold text-navy mt-1.5 tracking-[-0.03em] tabular-nums">
                          {s.value}
                        </p>
                      </Panel>
                    ))}
                  </div>
                  <Panel className="p-5 sm:p-6">
                    <h3 className="font-bold text-navy mb-1 tracking-[-0.01em]">تفصيل الإيرادات حسب الخطة</h3>
                    <p className="text-[12px] text-muted mb-6">تقدير مبني على الاشتراكات النشطة</p>
                    <div className="space-y-4">
                      {(revenue?.breakdown ?? []).map((row) => (
                        <div key={row.plan}>
                          <div className="flex justify-between text-[13px] mb-1.5 gap-3">
                            <span className="text-navy font-medium">
                              {row.nameAr} · {row.members} عضوة
                            </span>
                            <span className="text-muted tabular-nums shrink-0">{money(row.monthlyRevenue)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-ivory overflow-hidden ring-1 ring-navy/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-l from-navy to-gold"
                              style={{
                                width: `${Math.max(4, (row.monthlyRevenue / maxRevenue) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      {(revenue?.breakdown ?? []).length === 0 && (
                        <EmptyState title="لا توجد بيانات إيرادات" />
                      )}
                    </div>
                  </Panel>
                </div>
              )}
            </>
            )}
          </div>
        </main>
      </div>
    </AdminChrome>
  )
}

function ContentSection({
  title,
  onAdd,
  addLabel,
  children,
}: {
  title: string
  onAdd: () => void
  addLabel: string
  children: ReactNode
}) {
  const count = Children.count(children)

  return (
    <Panel>
      <div className="p-4 sm:p-5 border-b border-navy/[0.06] flex items-center justify-between gap-3 bg-gradient-to-l from-ivory/70 to-white">
        <h3 className="font-bold text-navy tracking-[-0.01em]">{title}</h3>
        <Button variant="gold" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4" /> {addLabel}
        </Button>
      </div>
      <div className="divide-y divide-navy/[0.05]">
        {count > 0 ? children : <EmptyState title="لا توجد عناصر بعد" />}
      </div>
    </Panel>
  )
}

function ContentRow({
  title,
  subtitle,
  onEdit,
  onDelete,
}: {
  title: string
  subtitle: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-blush/30 transition-colors">
      <div className="min-w-0">
        <p className="font-semibold text-navy text-[13px]">{title}</p>
        <p className="text-[12px] text-muted truncate mt-0.5">{subtitle}</p>
      </div>
      <IconActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}
