import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  Users, Building2, Calendar, Handshake, CreditCard, FileText,
  DollarSign, LayoutDashboard, TrendingUp, ArrowUpRight, Search,
  Pencil, Trash2, Plus, ExternalLink, LogOut, Menu, X,
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import AdminEditor, { confirmDelete, type AdminField } from '../components/admin/AdminEditor'
import { useAuth } from '../context/AuthContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { adminApi, catalogApi } from '../lib/catalog'
import { safeHref } from '../lib/safe'
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
    <div className="h-full flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] rounded-[24px] bg-white hairline shadow-md p-7 sm:p-8 space-y-4"
      >
        <h2 className="text-xl font-extrabold text-navy tracking-[-0.03em]">دخول الإدارة</h2>
        <p className="text-[13px] text-muted">يتطلب صلاحيات إدارية.</p>
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 px-4 rounded-[12px] border border-rose/20 bg-ivory text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-11 px-4 rounded-[12px] border border-rose/20 bg-ivory text-sm focus:outline-none focus:border-gold"
          />
        </div>
        {error && <p className="text-sm text-rose">{error}</p>}
        <p className="text-[11px] text-muted">تجريبي: {hint}</p>
        <Button type="submit" variant="gold" size="md" className="w-full" disabled={submitting}>
          {submitting ? 'جاري الدخول...' : 'دخول'}
        </Button>
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
    <div className="fixed inset-0 z-40 flex flex-col bg-ivory overflow-hidden">
      <header className="relative shrink-0 h-[72px] sm:h-[80px] bg-[rgba(251,249,247,0.88)] backdrop-blur-[28px] saturate-[180%] border-b border-navy/[0.06]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/55 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center px-16 sm:px-40">
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.34em] text-gold-dark uppercase">
              Admin Dashboard
            </p>
            <h1 className="mt-1 text-[22px] sm:text-[28px] font-extrabold tracking-[-0.05em] text-navy leading-none">
              لوحة الإدارة
            </h1>
          </div>
        </div>
        <div className="relative h-full px-3 sm:px-5 flex items-center justify-between gap-3">
          <div className="min-w-10 flex items-center">{leading}</div>
          <div className="flex items-center gap-2">
            {userEmail && (
              <p className="hidden lg:block max-w-[200px] truncate text-[11px] text-muted">
                {userEmail}
              </p>
            )}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="h-10 w-10 sm:w-auto sm:px-3 rounded-full bg-white hairline text-muted hover:text-navy hover:bg-blush/80 pressable inline-flex items-center justify-center gap-1.5 text-[12px] font-medium"
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
              className="h-10 px-3.5 sm:px-4 rounded-full bg-navy text-white text-[12px] sm:text-[13px] font-semibold pressable inline-flex items-center gap-2 shadow-sm ring-1 ring-gold/25 hover:bg-navy-light transition-colors"
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
    <div className="p-5 border-b border-rose/10 flex flex-col sm:flex-row gap-3 justify-between">
      <div>{children}</div>
      {onAdd && (
        <Button variant="gold" size="sm" onClick={onAdd}>
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
      <button type="button" onClick={onEdit} className="p-1.5 rounded-lg hover:bg-blush cursor-pointer" title="تعديل">
        <Pencil className="w-4 h-4 text-muted" />
      </button>
      {onDelete && (
        <button type="button" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-blush cursor-pointer" title="حذف">
          <Trash2 className="w-4 h-4 text-rose" />
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
      allowed && active === 'partnerships'
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
          <div className="bg-white rounded-[20px] p-8 hairline shadow-sm max-w-md text-center space-y-4">
            <h2 className="text-lg font-bold text-navy">غير مصرح</h2>
            <p className="text-sm text-muted">هذا الحساب لا يملك صلاحيات إدارية.</p>
            <Button to="/" target="_blank" rel="noreferrer" variant="gold" size="sm">زيارة الموقع</Button>
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

  const userFields = (creating: boolean, currentRole?: string): AdminField[] => [
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
    ...(!currentRole || currentRole === 'member' || currentRole === 'moderator'
      ? [
          {
            name: 'role',
            label: 'الدور',
            type: 'select' as const,
            options: [
              { value: 'member', label: 'عضوة' },
              { value: 'moderator', label: 'مشرفة' },
            ],
          },
        ]
      : []),
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
        fields: userFields(creating, editor.item?.role),
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
        <aside
          className={`fixed lg:static inset-y-0 right-0 z-50 lg:z-0 w-[260px] bg-white/90 backdrop-blur-xl border-l border-navy/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
          style={{ top: sidebarOpen ? '0' : undefined }}
        >
          <div className="lg:hidden flex items-center justify-between px-4 h-[72px] border-b border-navy/[0.06]">
            <p className="text-[13px] font-semibold text-navy">الأقسام</p>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="h-9 w-9 rounded-full bg-ivory hairline flex items-center justify-center pressable"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4 text-navy" />
            </button>
          </div>
          <nav className="p-3 space-y-0.5 overflow-y-auto flex-1">
            {adminNav.map((item) => {
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[13px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-muted hover:bg-blush/80 hover:text-navy'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/12' : 'bg-rose-soft'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-rose'}`} />
                  </span>
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-navy/35 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
            <div className="mb-6">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-gold-dark uppercase">
                {adminNav.find((i) => i.id === active)?.id}
              </p>
              <h2 className="mt-1 text-[1.65rem] sm:text-[1.85rem] font-extrabold text-navy tracking-[-0.03em]">
                {adminNav.find((i) => i.id === active)?.label}
              </h2>
            </div>

            {tabLoading ? (
              <LoadingBlock />
            ) : tabError ? (
              <ErrorBlock message={tabError} onRetry={reloadActive} />
            ) : (
              <>
              {active === 'overview' && (
                <div className="space-y-6 animate-fade-up">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiCards.map((k) => {
                      const Icon = k.icon
                      return (
                        <div key={k.label} className="relative overflow-hidden rounded-[20px] bg-white hairline shadow-xs p-5">
                          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-l from-gold via-rose to-transparent" />
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-[12px] bg-rose-soft ring-1 ring-rose/20 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-navy" />
                            </div>
                            {k.change && (
                              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                                <ArrowUpRight className="w-3 h-3" /> {k.change}
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-2xl font-extrabold text-navy tracking-[-0.03em] tabular-nums">{k.value}</p>
                          <p className="text-[11px] text-muted mt-1">{k.label}</p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-navy">الإيرادات حسب الخطة</h3>
                        <TrendingUp className="w-5 h-5 text-gold" />
                      </div>
                      <div className="flex items-end gap-3 h-48">
                        {(revenue?.breakdown ?? []).map((row) => (
                          <div key={row.plan} className="flex-1 flex flex-col items-center gap-2">
                            <div
                              className="w-full rounded-t-lg bg-gradient-to-t from-gold-dark to-gold"
                              style={{ height: `${Math.max(8, (row.monthlyRevenue / maxRevenue) * 100)}%` }}
                            />
                            <span className="text-[10px] text-muted text-center">{row.nameAr}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted mt-4">
                        الإجمالي الشهري: <span className="font-bold text-navy">{money(revenue?.monthlyRevenue ?? 0)}</span>
                      </p>
                    </div>

                    <div className="bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                      <h3 className="font-bold text-navy mb-4">توزيع الخطط</h3>
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
                          const color = ['bg-muted', 'bg-rose', 'bg-gold'][i % 3]
                          return (
                            <div key={p.plan}>
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-navy font-medium">{planLabel[p.plan] || p.plan}</span>
                                <span className="text-muted">{pct}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-light overflow-hidden">
                                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-6 p-4 rounded-[12px] bg-navy text-white">
                        <p className="text-xs text-white/50">الأعضاء</p>
                        <p className="text-2xl font-extrabold text-gold mt-1">{kpis?.members ?? 0}</p>
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
                          {recentMembers.slice(0, 5).map((m) => (
                            <tr key={m.id} className="border-b border-rose/5 hover:bg-blush/50">
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <img src={m.image || imageFallback} alt="" className="w-8 h-8 rounded-full object-cover" />
                                  <span className="font-medium text-navy">{m.name}</span>
                                </div>
                              </td>
                              <td className="py-3 text-muted">{m.specialty}</td>
                              <td className="py-3 text-muted">{m.city}</td>
                              <td className="py-3">
                                <Badge variant={m.plan === 'BUSINESS' ? 'gold' : 'soft'}>
                                  {planLabel[m.plan || ''] || m.plan || 'مجاني'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                          {recentMembers.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-muted">لا توجد بيانات</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {active === 'users' && (
                <div className="bg-white rounded-[16px] border border-rose/10 shadow-soft animate-fade-up">
                  <ActionBar onAdd={() => setEditor({ kind: 'user' })} addLabel="إضافة عضوة">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        placeholder="بحث عن عضوة..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pr-10 pl-4 py-2.5 rounded-[12px] border border-rose/20 bg-ivory text-sm w-full sm:w-64 focus:outline-none focus:border-gold"
                      />
                    </div>
                  </ActionBar>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-muted text-xs bg-ivory">
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
                            <tr key={u.id} className="border-t border-rose/5 hover:bg-blush/30">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img src={m?.image || imageFallback} alt="" className="w-9 h-9 rounded-[8px] object-cover" />
                                  <div>
                                    <p className="font-semibold text-navy">{m?.name || u.email}</p>
                                    <p className="text-xs text-muted">{u.email}</p>
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
                            <td colSpan={6} className="p-8 text-center text-muted">لا توجد مستخدمات</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {active === 'brands' && (
                <div className="space-y-4 animate-fade-up">
                  <div className="flex justify-end">
                    <Button variant="gold" size="sm" onClick={() => setEditor({ kind: 'brand' })}>
                      <Plus className="w-4 h-4" /> إضافة علامة
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {brands.map((b) => (
                      <div key={b.id} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft flex items-center gap-4">
                        <img src={b.logo || brandFallback} alt="" className="w-14 h-14 rounded-[12px] object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-navy">{b.name}</p>
                          <p className="text-xs text-muted">{b.category}</p>
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
                      </div>
                    ))}
                    {brands.length === 0 && (
                      <p className="text-sm text-muted col-span-2 text-center py-10">لا توجد علامات</p>
                    )}
                  </div>
                </div>
              )}

              {active === 'events' && (
                <div className="space-y-3 animate-fade-up">
                  <div className="flex justify-end mb-2">
                    <Button variant="gold" size="sm" onClick={() => setEditor({ kind: 'event' })}>
                      <Plus className="w-4 h-4" /> إنشاء فعالية
                    </Button>
                  </div>
                  {events.map((e) => (
                    <div key={e.id} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img src={e.image || eventFallback} alt="" className="w-full sm:w-20 h-28 sm:h-14 rounded-[10px] object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-navy">{e.title}</p>
                        <p className="text-xs text-muted">{e.date} — {e.category}</p>
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
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-sm text-muted text-center py-10">لا توجد فعاليات</p>
                  )}
                </div>
              )}

              {active === 'partnerships' && (
                <div className="space-y-8 animate-fade-up">
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-navy">الشركاء</h3>
                      <Button variant="gold" size="sm" onClick={() => setEditor({ kind: 'partner' })}>
                        <Plus className="w-4 h-4" /> إضافة شريك
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {partnerList.map((p) => (
                        <div key={p.id} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft text-center">
                          <div className="w-12 h-12 mx-auto rounded-full bg-navy flex items-center justify-center mb-3">
                            <span className="text-gold font-bold">{p.name[0]}</span>
                          </div>
                          <p className="font-bold text-navy text-sm">{p.name}</p>
                          <p className="text-[10px] text-muted mt-1">{p.type}</p>
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
                        </div>
                      ))}
                      {partnerList.length === 0 && (
                        <p className="text-sm text-muted col-span-4 text-center py-10">لا يوجد شركاء</p>
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-navy">مستويات الشراكة</h3>
                      <Button variant="gold" size="sm" onClick={() => setEditor({ kind: 'tier' })}>
                        <Plus className="w-4 h-4" /> إضافة مستوى
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {tierList.map((t) => (
                        <div key={t.id} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-navy">{t.nameAr || t.name}</p>
                              <p className="text-xs text-muted mt-1">{t.description}</p>
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
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-navy mb-4">طلبات الشراكة</h3>
                    <div className="bg-white rounded-[16px] border border-rose/10 shadow-soft divide-y divide-rose/10 overflow-hidden">
                      {inquiryList.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`w-full text-right p-4 sm:p-5 ${item.status === 'new' ? 'bg-rose-soft/30' : ''}`}
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
                              <p className="text-[13px] text-navy mt-2 leading-relaxed">{item.message}</p>
                            </div>
                            <Badge variant={item.status === 'new' ? 'rose' : 'soft'}>
                              {item.status === 'new' ? 'جديدة' : 'مقروءة'}
                            </Badge>
                          </div>
                        </button>
                      ))}
                      {inquiryList.length === 0 && (
                        <p className="text-sm text-muted text-center py-10">لا توجد طلبات شراكة بعد</p>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {active === 'plans' && (
                <div className="grid md:grid-cols-3 gap-4 animate-fade-up">
                  {planList.map((p) => {
                    const members = planDistribution.find((row) => row.plan === p.name)?.count ?? 0
                    return (
                      <div key={p.id} className="bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-navy text-lg">{p.nameAr}</h3>
                            <p className="text-xs text-muted">{p.name}</p>
                          </div>
                          <IconActions onEdit={() => setEditor({ kind: 'plan', item: p })} />
                        </div>
                        <p className="text-3xl font-extrabold text-navy mt-3">{p.price}</p>
                        <p className="text-xs text-muted">{p.period}</p>
                        <p className="text-sm text-muted mt-3">{p.description}</p>
                        <ul className="mt-3 space-y-1 text-xs text-navy">
                          {p.features.slice(0, 4).map((feature) => (
                            <li key={feature}>• {feature}</li>
                          ))}
                        </ul>
                        <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                          <Badge variant={p.highlighted ? 'gold' : 'soft'}>{members} عضوة</Badge>
                          <Badge variant={p.grantsAccess === false ? 'soft' : 'rose'}>
                            {p.grantsAccess === false ? 'بدون دخول' : 'تمنح الدخول'}
                          </Badge>
                          <Badge variant={p.isActive === false ? 'soft' : 'navy'}>
                            {p.isActive === false ? 'مخفية' : 'ظاهرة'}
                          </Badge>
                        </div>
                      </div>
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
                <div className="space-y-6 animate-fade-up">
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: 'إيرادات شهرية تقديرية', value: money(revenue?.monthlyRevenue ?? 0) },
                      { label: 'متوسط الاشتراك', value: money(revenue?.averageSubscription ?? 0) },
                      { label: 'عضوات مدفوعات', value: String(revenue?.payingMembers ?? 0) },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-[16px] p-5 border border-rose/10 shadow-soft">
                        <p className="text-xs text-muted">{s.label}</p>
                        <p className="text-2xl font-extrabold text-navy mt-1">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-[16px] p-6 border border-rose/10 shadow-soft">
                    <h3 className="font-bold text-navy mb-6">تفصيل الإيرادات حسب الخطة</h3>
                    <div className="space-y-4">
                      {(revenue?.breakdown ?? []).map((row) => (
                        <div key={row.plan}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-navy font-medium">{row.nameAr} · {row.members} عضوة</span>
                            <span className="text-muted">{money(row.monthlyRevenue)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-light overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gold"
                              style={{ width: `${Math.max(4, (row.monthlyRevenue / maxRevenue) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
  return (
    <div className="bg-white rounded-[16px] border border-rose/10 shadow-soft">
      <div className="p-5 border-b border-rose/10 flex items-center justify-between">
        <h3 className="font-bold text-navy">{title}</h3>
        <Button variant="gold" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4" /> {addLabel}
        </Button>
      </div>
      <div className="divide-y divide-rose/10">{children}</div>
    </div>
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
    <div className="p-5 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-navy text-sm">{title}</p>
        <p className="text-xs text-muted truncate">{subtitle}</p>
      </div>
      <IconActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}
