import { useState, useEffect, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Briefcase, Calendar, Handshake, Bell,
  BarChart3, CreditCard, Settings, ChevronLeft, Eye, Users,
  CalendarCheck, MessageSquare, Plus, Menu, X, Trash2, Sparkles, Trophy,
  CheckCircle2, LogOut, ArrowUpLeft, MoreHorizontal, GraduationCap, Building2,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { springs, useMotionSafe } from '../lib/motion'
import { useAuth } from '../context/AuthContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { PLAN_LABELS, ROLE_LABELS, canAccessAdminPanel } from '../lib/plans'
import {
  authFlashMessage,
  consumeAuthFlash,
  postAuthPath,
  setAuthFlash,
  type AuthFlash,
} from '../lib/authRedirect'
import { catalogApi, meApi } from '../lib/catalog'
import { asArray } from '../lib/normalize'
import type { Member } from '../types/api'
import ProfilePreviewEditor from '../components/ui/ProfilePreviewEditor'
import SafeImg from '../components/ui/SafeImg'
import ConsultationRequestForm from '../components/ui/ConsultationRequestForm'
import AcademyConsultationInbox from '../components/dashboard/AcademyConsultationInbox'
import MemberBrandEditor from '../components/dashboard/MemberBrandEditor'
import SeoHead from '../components/seo/SeoHead'
import { routeSeo } from '../lib/seo'
import LoginRegisterForm from '../components/auth/LoginRegisterForm'

const planLabel = PLAN_LABELS

type SidebarItem = {
  id: string
  label: string
  icon: typeof LayoutDashboard
  badge?: number
  hint?: string
}

type NavGroup = { label: string; items: SidebarItem[] }

const memberNavGroups: NavGroup[] = [
  {
    label: 'الرئيسية',
    items: [
      { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, hint: 'ملخص سريع لنشاطك' },
      { id: 'opportunities', label: 'الفرص', icon: Trophy, hint: 'فرص ومنح ومبادرات' },
      { id: 'consultations', label: 'الاستشارات', icon: MessageSquare, hint: 'طلب ومتابعة الاستشارات' },
    ],
  },
  {
    label: 'حسابك',
    items: [
      { id: 'profile', label: 'الملف الشخصي', icon: User, hint: 'بياناتك وظهورك' },
      { id: 'brand', label: 'علامتي التجارية', icon: Building2, hint: 'صفحة علامتكِ (واحدة فقط)' },
      { id: 'services', label: 'الخدمات والمنتجات', icon: Briefcase },
      { id: 'programs', label: 'البرامج والدورات', icon: GraduationCap, hint: 'برامج أكاديميتك' },
      { id: 'events', label: 'فعالياتي', icon: Calendar },
      { id: 'partnerships', label: 'الشراكات', icon: Handshake },
    ],
  },
  {
    label: 'المزيد',
    items: [
      { id: 'notifications', label: 'الإشعارات', icon: Bell },
      { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
      { id: 'subscription', label: 'الاشتراك', icon: CreditCard },
      { id: 'settings', label: 'الإعدادات', icon: Settings },
    ],
  },
]

function buildMemberNavGroups(plan: string | null | undefined): NavGroup[] {
  const isAcademy = plan === 'ACADEMY'
  const isBusiness = plan === 'BUSINESS'
  const isExpert = plan === 'EXPERT'
  return memberNavGroups.map((group) => {
    if (group.label === 'الرئيسية') {
      return {
        ...group,
        items: group.items.map((item) => {
          if (item.id === 'consultations' && isBusiness) {
            return {
              ...item,
              label: 'طلب استشارة',
              hint: 'اطلبي من خبيرة أو أكاديمية — لا تستقبلين طلبات',
            }
          }
          if (item.id === 'consultations' && isExpert) {
            return {
              ...item,
              label: 'طلبات الاستشارة',
              hint: 'وارد العملاء على ملف الخبيرة',
            }
          }
          return item
        }),
      }
    }
    if (group.label !== 'حسابك') return group
    return {
      ...group,
      items: group.items
        .filter((item) => {
          if (item.id === 'programs') return isAcademy
          if (item.id === 'brand') return isBusiness
          return true
        })
        .map((item) => {
          if (isExpert) {
            if (item.id === 'profile') {
              return {
                ...item,
                label: 'ملف الخبيرة',
                hint: 'الاسم، التخصص، والنبذة كما يظهر للزوار',
              }
            }
            if (item.id === 'services') {
              return { ...item, label: 'خدماتي', hint: 'خدمات واستشارات تقدّمينها' }
            }
            if (item.id === 'consultations') {
              return {
                ...item,
                label: 'طلبات الاستشارة',
                hint: 'الوارد من العملاء على ملفكِ',
              }
            }
            return item
          }
          if (!isAcademy) return item
          if (item.id === 'profile') {
            return {
              ...item,
              label: 'ملف الأكاديمية',
              hint: 'اسم المركز، النبذة، والغلاف كما يظهر للزوار',
            }
          }
          if (item.id === 'services') {
            return { ...item, label: 'خدمات المركز', hint: 'خدمات ومنتجات الأكاديمية' }
          }
          if (item.id === 'consultations') {
            return {
              ...item,
              label: 'طلبات الاستشارة',
              hint: 'الوارد من العملاء على ملف الأكاديمية',
            }
          }
          return item
        }),
    }
  })
}

const guestNavGroups: NavGroup[] = [
  {
    label: 'الرئيسية',
    items: [
      { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
      { id: 'opportunities', label: 'الفرص', icon: Trophy },
      { id: 'consultations', label: 'الاستشارات', icon: MessageSquare },
    ],
  },
  {
    label: 'حسابك',
    items: [
      { id: 'profile', label: 'الملف الشخصي', icon: User },
      { id: 'notifications', label: 'الإشعارات', icon: Bell },
      { id: 'membership', label: 'الترقية للعضوية', icon: Sparkles },
    ],
  },
]

const guestSidebarItems = guestNavGroups.flatMap((g) => g.items)

const mobileTabs = ['overview', 'consultations', 'opportunities', 'profile'] as const

const toneClass: Record<string, string> = {
  rose: 'bg-rose-soft text-rose ring-rose/25',
  gold: 'bg-gold/15 text-gold-dark ring-gold/25',
  mauve: 'bg-blush text-mauve ring-mauve/25',
  navy: 'bg-navy/5 text-navy ring-navy/10',
}

const imageFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
const eventImageFallback =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop'

function profileCompleteness(m: Member): number {
  const checks = [
    Boolean(m.name?.trim()),
    Boolean(m.title?.trim()),
    Boolean(m.specialty?.trim()),
    Boolean(m.city?.trim() || m.wilaya?.trim()),
    Boolean(m.bio?.trim()),
    Boolean(m.image),
    (m.services?.length ?? 0) > 0,
    Boolean(m.phone?.trim() || m.website?.trim()),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] bg-white hairline shadow-xs overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3.5">
      <h3 className="font-bold text-navy tracking-[-0.01em]">{title}</h3>
      {action}
    </div>
  )
}

function EmptyHint({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted py-8 text-center leading-relaxed px-4">{children}</p>
}

function MembershipAccessGate({
  user,
  onRefresh,
  onLogout,
}: {
  user: { role: string; plan: string | null; membershipStatus?: string }
  onRefresh: () => Promise<void>
  onLogout: () => Promise<void>
}) {
  const { data: plans } = useAsyncData(() => catalogApi.plans(), [])
  const [plan, setPlan] = useState(user.plan || 'BUSINESS')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [welcome] = useState(() => consumeAuthFlash())
  const pending = user.membershipStatus === 'pending'
  const rejected = user.membershipStatus === 'rejected'

  const apply = async () => {
    setBusy(true)
    setError(null)
    try {
      await meApi.requestMembership(plan)
      await onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إرسال طلب العضوية')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-ivory flex items-center justify-center px-4">
      <Surface className="p-8 max-w-md text-center space-y-4">
        {welcome && (
          <div className="rounded-[14px] bg-navy text-white p-4 text-right">
            <p className="font-bold text-[14px]">{authFlashMessage(welcome).title}</p>
            <p className="mt-1 text-[12px] text-white/65 leading-relaxed">
              {authFlashMessage(welcome).body}
            </p>
          </div>
        )}
        <h2 className="text-lg font-bold text-navy">
          {pending ? 'طلب العضوية قيد المراجعة' : rejected ? 'تم رفض طلب العضوية' : 'حساب زائر'}
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          {pending
            ? 'استلمنا طلب عضويتك. ستظهر في دليل رائدة ولوحة العضو بعد موافقة الإدارة.'
            : rejected
              ? 'يمكنك إعادة التقديم على عضوية مدفوعة ليراجعها فريق رائدة.'
              : 'هذا حساب زائر. للظهور في الدليل والحصول على مزايا العضوية، قدّم طلب عضوية لإدارة رائدة.'}
        </p>
        {!pending && (
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm"
          >
            {(plans ?? []).map((item) => (
              <option key={item.name} value={item.name}>
                {item.nameAr} — {item.launchPrice || item.price} دج / {item.period}
              </option>
            ))}
          </select>
        )}
        {error && <p className="text-sm text-rose">{error}</p>}
        <div className="flex gap-2 justify-center flex-wrap">
          {!pending && (
            <Button variant="gold" size="sm" onClick={() => void apply()} disabled={busy}>
              {busy ? 'جاري الإرسال...' : 'تقديم طلب عضوية'}
            </Button>
          )}
          <Button to="/membership" variant="outline" size="sm">عرض الخطط</Button>
          <Button variant="outline" size="sm" onClick={() => void onLogout()}>تسجيل الخروج</Button>
        </div>
      </Surface>
    </div>
  )
}

function GuestUpgradePanel({
  onApplied,
}: {
  onApplied: () => Promise<void>
}) {
  const { data: plans } = useAsyncData(() => catalogApi.plans(), [])
  const [plan, setPlan] = useState('BUSINESS')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apply = async () => {
    setBusy(true)
    setError(null)
    try {
      await meApi.requestMembership(plan)
      await onApplied()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إرسال طلب العضوية')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Surface className="p-5 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-[12px] bg-gold/15 ring-1 ring-gold/25 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-gold-dark" />
        </div>
        <div>
          <h3 className="font-bold text-navy">الترقية إلى عضوية رائدة</h3>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            حساب الزائر للاستشارات والاستكشاف. العضوية تُظهرك في الدليل وتتيح الخدمات والملف العام بعد موافقة الإدارة.
          </p>
        </div>
      </div>
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm"
      >
        {(plans ?? []).map((item) => (
          <option key={item.name} value={item.name}>
            {item.nameAr} — {item.launchPrice || item.price} دج / {item.period}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-rose">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button variant="gold" size="sm" onClick={() => void apply()} disabled={busy}>
          {busy ? 'جاري الإرسال...' : 'تقديم طلب عضوية'}
        </Button>
        <Button to="/membership" variant="outline" size="sm">
          مقارنة الخطط
        </Button>
      </div>
    </Surface>
  )
}


function ServicesEditor({
  member,
  onSaved,
}: {
  member: Member
  onSaved: () => Promise<void>
}) {
  const [services, setServices] = useState(asArray<string>(member.services))
  const [products, setProducts] = useState(asArray<string>(member.products))
  const [draft, setDraft] = useState('')
  const [kind, setKind] = useState<'services' | 'products'>('services')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setServices(asArray<string>(member.services))
    setProducts(asArray<string>(member.products))
  }, [member])

  const persist = async (nextServices: string[], nextProducts: string[]) => {
    setBusy(true)
    setError(null)
    try {
      await meApi.updateProfile({ services: nextServices, products: nextProducts })
      setServices(nextServices)
      setProducts(nextProducts)
      await onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر التحديث')
    } finally {
      setBusy(false)
    }
  }

  const addItem = async () => {
    const value = draft.trim()
    if (!value) return
    const nextServices = kind === 'services' ? [...services, value] : services
    const nextProducts = kind === 'products' ? [...products, value] : products
    setDraft('')
    await persist(nextServices, nextProducts)
  }

  const removeItem = async (list: 'services' | 'products', label: string) => {
    const nextServices = list === 'services' ? services.filter((s) => s !== label) : services
    const nextProducts = list === 'products' ? products.filter((p) => p !== label) : products
    await persist(nextServices, nextProducts)
  }

  const items = [
    ...services.map((s) => ({ label: s, tone: 'rose' as const, list: 'services' as const })),
    ...products.map((p) => ({ label: p, tone: 'gold' as const, list: 'products' as const })),
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h3 className="font-bold text-navy flex-1">خدماتك ومنتجاتك</h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as 'services' | 'products')}
            className="h-9 px-3 rounded-full border border-separator bg-white text-[12px]"
          >
            <option value="services">خدمة</option>
            <option value="products">منتج</option>
          </select>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="الاسم"
            className="h-9 px-3 rounded-full border border-separator bg-white text-[13px] min-w-[140px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void addItem()
              }
            }}
          />
          <Button variant="gold" size="sm" className="!rounded-full" onClick={() => void addItem()} disabled={busy}>
            <Plus className="w-4 h-4" /> إضافة
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-rose mb-3">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <Surface key={`${item.list}-${item.label}`} className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-[12px] ring-1 flex items-center justify-center shrink-0 ${toneClass[item.tone]}`}>
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-navy text-[13px] truncate">{item.label}</p>
                <p className="text-[11px] text-muted">{item.list === 'services' ? 'خدمة' : 'منتج'}</p>
              </div>
            </div>
            <button
              type="button"
              className="p-2 rounded-[10px] hover:bg-blush pressable"
              aria-label="حذف"
              disabled={busy}
              onClick={() => void removeItem(item.list, item.label)}
            >
              <Trash2 className="w-4 h-4 text-muted" />
            </button>
          </Surface>
        ))}
      </div>
      {items.length === 0 && (
        <Surface className="p-8 text-center text-sm text-muted">أضيفي خدمة أو منتجاً ليظهر في ملفك العام</Surface>
      )}
    </div>
  )
}

function ProgramsEditor({
  member,
  onSaved,
}: {
  member: Member
  onSaved: () => Promise<void>
}) {
  const [programs, setPrograms] = useState(asArray<string>(member.programs))
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setPrograms(asArray<string>(member.programs))
  }, [member])

  const persist = async (next: string[]) => {
    setBusy(true)
    setError(null)
    try {
      await meApi.updateProfile({ programs: next })
      setPrograms(next)
      await onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر التحديث')
    } finally {
      setBusy(false)
    }
  }

  const addItem = async () => {
    const value = draft.trim()
    if (!value) return
    setDraft('')
    await persist([...programs, value])
  }

  return (
    <div>
      <div className="mb-2">
        <h3 className="font-bold text-navy">برامج ودورات الأكاديمية</h3>
        <p className="mt-1 text-[13px] text-muted leading-relaxed">
          أضيفي أسماء البرامج والدورات التي تقدّمها مؤسستكِ — تظهر في ملف الأكاديمية ودليل الأكاديميات.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 mt-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="مثال: كوتشينق احترافي"
          className="h-9 px-3 rounded-full border border-separator bg-white text-[13px] flex-1 min-w-0"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void addItem()
            }
          }}
        />
        <Button variant="gold" size="sm" className="!rounded-full shrink-0" onClick={() => void addItem()} disabled={busy}>
          <Plus className="w-4 h-4" /> إضافة برنامج
        </Button>
      </div>
      {error && <p className="text-sm text-rose mb-3">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {programs.map((label) => (
          <Surface key={label} className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-[12px] ring-1 flex items-center justify-center shrink-0 ${toneClass.gold}`}>
                <GraduationCap className="w-4 h-4" />
              </div>
              <p className="font-semibold text-navy text-[13px] truncate">{label}</p>
            </div>
            <button
              type="button"
              className="p-2 rounded-[10px] hover:bg-blush pressable"
              aria-label="حذف"
              disabled={busy}
              onClick={() => void persist(programs.filter((p) => p !== label))}
            >
              <Trash2 className="w-4 h-4 text-muted" />
            </button>
          </Surface>
        ))}
      </div>
      {programs.length === 0 && (
        <Surface className="p-8 text-center text-sm text-muted">
          لم تضيفي برامج بعد — أضيفي أول برنامج لتظهر أكاديميتكِ بشكل أوضح.
        </Surface>
      )}
    </div>
  )
}

function PublicProfileToggle({
  isPublic,
  onSaved,
}: {
  isPublic: boolean
  onSaved: () => Promise<void>
}) {
  const [on, setOn] = useState(isPublic)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setOn(isPublic)
  }, [isPublic])

  const toggle = async () => {
    const next = !on
    setOn(next)
    setBusy(true)
    setError(null)
    try {
      await meApi.updateProfile({ isPublic: next })
      await onSaved()
    } catch (err) {
      setOn(!next)
      setError(err instanceof Error ? err.message : 'تعذر تحديث الإعداد')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Surface className="p-5 sm:p-6 max-w-lg space-y-2.5">
      <h3 className="font-bold text-navy mb-3">الإعدادات</h3>
      <div className="flex items-center justify-between gap-4 p-4 rounded-[14px] bg-ivory">
        <div>
          <p className="text-[13px] font-semibold text-navy">الملف عام</p>
          <p className="text-[11px] text-muted mt-0.5">إظهار ملفك في دليل الأعضاء</p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void toggle()}
          className={`relative w-11 h-6 rounded-full pressable shrink-0 transition-colors ${
            on ? 'bg-rose' : 'bg-navy/15'
          }`}
          aria-pressed={on}
          aria-label="الملف عام"
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
              on ? 'left-1' : 'right-1'
            }`}
          />
        </button>
      </div>
      {error && <p className="text-sm text-rose">{error}</p>}
    </Surface>
  )
}

export default function DashboardPage() {
  const { user, profile: authProfile, loading: authLoading, login, register, logout, refreshMe } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [welcome, setWelcome] = useState<AuthFlash | null>(null)
  const [authBridge, setAuthBridge] = useState<'login' | 'register' | null>(null)
  const { reduce } = useMotionSafe()

  useEffect(() => {
    if (!user || authBridge) return
    if (canAccessAdminPanel(user.role)) return
    if (user.role === 'member' && user.hasAccess === false) return
    const flash = consumeAuthFlash()
    if (flash) setWelcome(flash)
  }, [user?.id, user?.role, user?.hasAccess, authBridge])

  useEffect(() => {
    if (!welcome) return
    const t = window.setTimeout(() => setWelcome(null), 8000)
    return () => window.clearTimeout(t)
  }, [welcome])

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password)
    setAuthBridge('login')
    setAuthFlash({
      kind: 'login',
      name: result.profile?.name,
      role: result.user.role,
      membershipStatus: result.user.membershipStatus,
    })
    window.setTimeout(() => {
      setAuthBridge(null)
      navigate(postAuthPath(result.user.role), { replace: true })
    }, 900)
    return result
  }

  const handleRegister = async (payload: {
    email: string
    password: string
    name: string
    phone: string
    accountType: 'guest' | 'member'
    plan?: string
    title?: string
    specialty?: string
    city?: string
    wilaya?: string
    category?: string
    website?: string
    bio?: string
    programs?: string[]
  }) => {
    const result = await register(payload)
    if (result.requiresEmailVerification || !result.user) return result
    setAuthBridge('register')
    setAuthFlash({
      kind: 'register',
      name: result.profile?.name || payload.name,
      role: result.user.role,
      membershipStatus: result.user.membershipStatus,
    })
    window.setTimeout(() => {
      setAuthBridge(null)
      navigate(postAuthPath(result.user.role), { replace: true })
    }, 900)
    return result
  }

  const {
    data: dashboard,
    loading: dashLoading,
    error: dashError,
    reload: reloadDash,
  } = useAsyncData(
    () => (user ? meApi.dashboard() : Promise.resolve(null)),
    [user?.id, user?.hasAccess],
  )

  const {
    data: notificationsPayload,
    loading: notifLoading,
    error: notifError,
    reload: reloadNotifs,
  } = useAsyncData(
    () => (user ? meApi.notifications() : Promise.resolve({ data: [] })),
    [user?.id, user?.hasAccess],
  )

  const {
    data: consultationsPayload,
    loading: consultLoading,
    error: consultError,
    reload: reloadConsults,
  } = useAsyncData(
    () =>
      user && active === 'consultations'
        ? meApi.consultations({ limit: 100 })
        : Promise.resolve({ data: [] }),
    [user?.id, user?.hasAccess, active],
  )

  const { data: opportunitiesList } = useAsyncData(
    () =>
      user && (active === 'overview' || active === 'opportunities')
        ? catalogApi.opportunities()
        : Promise.resolve([]),
    [user?.id, active],
  )

  const isGuest = user?.role === 'guest'
  const isAcademy = !isGuest && user?.plan === 'ACADEMY'
  const isBusiness = !isGuest && user?.plan === 'BUSINESS'
  const isExpert = !isGuest && user?.plan === 'EXPERT'
  const receivesConsultations = isAcademy || isExpert
  const navGroups = isGuest ? guestNavGroups : buildMemberNavGroups(user?.plan)
  const sidebarItems = navGroups.flatMap((g) => g.items)
  const member = dashboard?.profile || authProfile
  const myBrand = dashboard?.brand ?? null
  const notifications = notificationsPayload?.data ?? []
  const consultations = consultationsPayload?.data ?? []
  const unreadCount = notifications.filter((n) => n.unread).length
  const unreadConsultations = dashboard?.stats.unreadConsultations ?? consultations.filter((c) => c.status === 'new').length
  const upcomingEvents = dashboard?.upcomingEvents ?? []
  const activeItem = sidebarItems.find((i) => i.id === active)

  const overviewStats = isGuest
    ? [
        {
          label: 'استشارات',
          value: String(unreadConsultations),
          change: '',
          icon: MessageSquare,
          tone: 'gold',
        },
        {
          label: 'إشعارات',
          value: String(dashboard?.stats.unreadNotifications ?? unreadCount),
          change: '',
          icon: Bell,
          tone: 'navy',
        },
      ]
    : [
        {
          label: 'مشاهدات الملف',
          value: String(dashboard?.stats.profileViews ?? member?.profileViews ?? 0),
          change: '',
          icon: Eye,
          tone: 'rose',
        },
        {
          label: 'استشارات جديدة',
          value: String(unreadConsultations),
          change: '',
          icon: Users,
          tone: 'gold',
        },
        {
          label: 'فعاليات قادمة',
          value: String(dashboard?.stats.upcomingEvents ?? upcomingEvents.length),
          change: '',
          icon: CalendarCheck,
          tone: 'mauve',
        },
        {
          label: 'إشعارات',
          value: String(dashboard?.stats.unreadNotifications ?? unreadCount),
          change: '',
          icon: MessageSquare,
          tone: 'navy',
        },
      ]

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!isGuest) return
    if (!guestSidebarItems.some((item) => item.id === active)) {
      setActive('overview')
    }
  }, [isGuest, active])

  useEffect(() => {
    if (active === 'brand' && !isBusiness) setActive('overview')
    if (active === 'programs' && !isAcademy) setActive('overview')
  }, [active, isBusiness, isAcademy])

  const seo = (
    <SeoHead
      title={routeSeo.dashboard.title}
      description={routeSeo.dashboard.description}
      path={routeSeo.dashboard.path}
      noindex
    />
  )

  if (authLoading) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        {seo}
        <LoadingBlock />
      </div>
    )
  }

  if (authBridge) {
    return (
      <>
        {seo}
        <div className="relative isolate min-h-screen overflow-hidden bg-ivory pt-20">
          <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springs.settle}
              className="w-full rounded-[24px] bg-white p-8 shadow-sm ring-1 ring-navy/8"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-navy text-gold">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-navy tracking-[-0.03em]">
                {authBridge === 'login' ? 'تم تسجيل الدخول' : 'تم إنشاء الحساب'}
              </h1>
              <p className="mt-2 text-[14px] text-muted leading-relaxed">
                {canAccessAdminPanel(user?.role)
                  ? 'جاري تحويلك إلى لوحة الإدارة...'
                  : 'جاري تحويلك إلى لوحة التحكم...'}
              </p>
              <div className="mx-auto mt-6 h-1 w-36 overflow-hidden rounded-full bg-navy/10">
                <motion.div
                  className="h-full rounded-full bg-gold"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        {seo}
        <LoginRegisterForm
          hint={import.meta.env.DEV ? 'sara@raida.local / Password123!' : undefined}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </>
    )
  }

  if (canAccessAdminPanel(user.role)) {
    return <Navigate to="/admin" replace />
  }

  // Pending/rejected membership applications stay on the gate; guests get the dashboard inbox.
  if (user.role === 'member' && user.hasAccess === false) {
    return <MembershipAccessGate user={user} onRefresh={refreshMe} onLogout={logout} />
  }

  if (dashLoading || notifLoading || (active === 'consultations' && consultLoading)) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        <LoadingBlock />
      </div>
    )
  }

  if (dashError || notifError || consultError) {
    return (
      <div className="pt-20 min-h-screen bg-ivory">
        <ErrorBlock
          message={dashError || notifError || consultError || 'فشل التحميل'}
          onRetry={() => {
            reloadDash()
            reloadNotifs()
            reloadConsults()
          }}
        />
      </div>
    )
  }

  if (!member) {
    return (
      <div className="pt-20 min-h-screen bg-ivory flex items-center justify-center px-4">
        <Surface className="p-8 max-w-md text-center space-y-4">
          <h2 className="text-lg font-bold text-navy">لا يوجد ملف شخصي</h2>
          <p className="text-sm text-muted">الحساب مسجّل لكن لا يوجد ملف عضوية مرتبط.</p>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            تسجيل الخروج
          </Button>
        </Surface>
      </div>
    )
  }

  const select = (id: string) => {
    setActive(id)
    setSidebarOpen(false)
  }

  const withBadges = (items: SidebarItem[]) =>
    items.map((item) => {
      if (item.id === 'notifications') return { ...item, badge: unreadCount || undefined }
      if (item.id === 'consultations') return { ...item, badge: unreadConsultations || undefined }
      return item
    })

  const firstName = member.name.split(/\s+/)[0] || member.name
  const membershipLabel = isGuest
    ? ROLE_LABELS.guest
    : planLabel[user.plan || ''] || user.plan || ROLE_LABELS.member
  const completeness = profileCompleteness(member)

  const SidebarNav = (
    <>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <SafeImg
            src={member.image}
            fallback={imageFallback}
            alt=""
            className="w-11 h-11 rounded-[14px] object-cover ring-2 ring-gold/25"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-[13px] truncate tracking-[-0.01em]">{member.name}</p>
            <p className="mt-1 inline-flex rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold ring-1 ring-gold/20">
              {membershipLabel}
            </p>
          </div>
        </div>
        {!isGuest && (
          <Link
            to={`/members/${member.id}`}
            className="mt-3 flex items-center justify-center gap-1.5 h-9 rounded-[12px] bg-white/8 text-[12px] font-semibold text-white/80 hover:bg-white/12 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            عرض الملف العام
          </Link>
        )}
      </div>

      <nav className="p-2.5 space-y-4 overflow-y-auto flex-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/35 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {withBadges(group.items).map((item) => {
                const Icon = item.icon
                const isActive = active === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(item.id)}
                    className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-medium pressable-soft cursor-pointer ${
                      isActive ? 'text-white' : 'text-white/55 hover:text-white/90'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={reduce ? undefined : 'dash-nav-pill'}
                        className="absolute inset-0 rounded-[12px] bg-white/12 ring-1 ring-white/10"
                        transition={springs.snappy}
                      />
                    )}
                    <Icon className="relative z-10 w-4 h-4 shrink-0" />
                    <span className="relative z-10 flex-1 text-right">{item.label}</span>
                    {item.badge ? (
                      <span className="relative z-10 min-w-5 h-5 px-1 rounded-full bg-gold text-navy text-[10px] flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => void logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/8 pressable-soft"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </>
  )

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-[#F3EEE8]">
      {seo}
      <div className="max-w-[1400px] mx-auto flex pb-24 lg:pb-0">
        <aside className="hidden lg:flex sticky top-20 h-[calc(100vh-5rem)] w-[268px] shrink-0 flex-col bg-[#0A1328] text-white">
          {SidebarNav}
        </aside>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-navy/40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                className="fixed top-0 bottom-0 right-0 z-50 w-[min(88vw,300px)] lg:hidden flex flex-col bg-[#0A1328] text-white shadow-xl"
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                transition={springs.snappy}
              >
                <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
                  <p className="text-[13px] font-semibold text-white/80">قائمة التحكم</p>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center pressable"
                    aria-label="إغلاق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {SidebarNav}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-muted">
                مرحباً {firstName}
                <span className="mx-1.5 text-navy/20">·</span>
                {activeItem?.label}
              </p>
              <h1 className="mt-1 text-2xl sm:text-[1.85rem] font-extrabold text-navy tracking-[-0.03em] font-display">
                {active === 'overview' ? 'لوحة التحكم' : activeItem?.label}
              </h1>
              {activeItem?.hint && active !== 'overview' && (
                <p className="mt-1 text-[13px] text-muted">{activeItem.hint}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="lg:hidden inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-white hairline text-[13px] font-semibold text-navy pressable shadow-xs"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
                القائمة
              </button>
              {!isGuest && (
                <Button to={`/members/${member.id}`} variant="outline" size="sm" className="hidden sm:inline-flex !rounded-full">
                  <Eye className="w-4 h-4" />
                  الملف العام
                </Button>
              )}
            </div>
          </div>

          {welcome && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 flex items-start gap-3 rounded-[18px] bg-navy text-white p-4 sm:p-5 ring-1 ring-gold/25"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gold/15 text-gold">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold tracking-[-0.01em]">{authFlashMessage(welcome).title}</p>
                <p className="mt-1 text-[13px] text-white/65 leading-relaxed">
                  {authFlashMessage(welcome).body}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWelcome(null)}
                className="shrink-0 rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={springs.snappy}
            >
              {active === 'overview' && (
                <div className="space-y-5">
                  {(() => {
                    const programsList = asArray(member.programs)
                    let nextLabel = 'استكشفي الفرص المتاحة'
                    let nextHint = 'منح، مسابقات، ومبادرات تناسب مرحلتك'
                    let nextAction: (() => void) | null = () => select('opportunities')
                    let nextTo: string | null = null
                    if (isAcademy) {
                      if (!member.bio?.trim() || completeness < 60) {
                        nextLabel = 'أكملي صفحة الأكاديمية'
                        nextHint = 'الاسم، النبذة، الغلاف والصورة كما يراها الزوار'
                        nextAction = () => select('profile')
                      } else if (programsList.length === 0) {
                        nextLabel = 'أضيفي الدورات والتكوينات'
                        nextHint = 'اعرضي برامجكِ في الصفحة الرسمية ودليل الأكاديميات'
                        nextAction = () => select('programs')
                      } else if (!member.website && !member.phone) {
                        nextLabel = 'أضيفي الموقع أو رقم التواصل'
                        nextHint = 'الموقع الرسمي ومعلومات التواصل جزء من صفحة الأكاديمية'
                        nextAction = () => select('profile')
                      } else if (member.isPublic === false) {
                        nextLabel = 'فعّلي الظهور في الدليل'
                        nextHint = 'بعد الموافقة، فعّلي الملف العام للظهور في دليل الأكاديميات'
                        nextAction = () => select('settings')
                      } else {
                        nextLabel = 'عرض الصفحة الرسمية'
                        nextHint = 'هكذا تظهر أكاديميتكِ للزوار في رائدة'
                        nextTo = `/members/${member.id}`
                        nextAction = null
                      }
                    } else if (isExpert) {
                      if (!member.bio?.trim() || completeness < 60) {
                        nextLabel = 'أكملي ملف الخبيرة'
                        nextHint = 'التخصص، النبذة، والصورة تزيد ثقة طالبات الاستشارة'
                        nextAction = () => select('profile')
                      } else if (member.isPublic === false) {
                        nextLabel = 'فعّلي الظهور في دليل الخبراء'
                        nextHint = 'بعد الموافقة، فعّلي الملف العام لاستقبال طلبات الاستشارة'
                        nextAction = () => select('settings')
                      } else if (unreadConsultations > 0) {
                        nextLabel = 'راجعي طلبات الاستشارة'
                        nextHint = `${unreadConsultations} طلب بانتظاركِ في الوارد`
                        nextAction = () => select('consultations')
                      } else {
                        nextLabel = 'عرض ملفكِ العام'
                        nextHint = 'من هنا يطلب العملاء استشارتكِ مباشرة'
                        nextTo = `/members/${member.id}`
                        nextAction = null
                      }
                    } else if (completeness < 70) {
                      nextLabel = 'أكملي ملفك الشخصي'
                      nextHint = 'الملف المكتمل يزيد ظهورك في الدليل'
                      nextAction = () => select('profile')
                    } else if (isBusiness && !myBrand) {
                      nextLabel = 'أعدّي علامتكِ التجارية'
                      nextHint = 'صفحة علامة واحدة تظهر في دليل العلامات — ضمن عضوية رائدة للأعمال'
                      nextAction = () => select('brand')
                    } else if (isGuest) {
                      nextLabel = 'ترقّي للعضوية المهنية'
                      nextHint = 'الظهور في الدليل ومزايا العضوية بعد الموافقة'
                      nextTo = '/membership'
                      nextAction = null
                    } else if (unreadConsultations > 0) {
                      nextLabel = 'راجعي الاستشارات الجديدة'
                      nextHint = `${unreadConsultations} طلب بانتظارك`
                      nextAction = () => select('consultations')
                    } else if (upcomingEvents.length === 0) {
                      nextLabel = 'اطلبي استشارة أو خدمة'
                      nextHint = 'ادعمي مشروعك مع خبراء رائدة'
                      nextTo = '/services'
                      nextAction = null
                    }

                    const academyChecklist = isAcademy
                      ? [
                          {
                            label: 'صفحة رسمية خاصة بالأكاديمية أو مركز التدريب',
                            done: Boolean(member.name && (member.image || member.cover)),
                            action: () => select('profile'),
                          },
                          {
                            label: 'التعريف بالمؤسسة وبرامجها',
                            done: Boolean(member.bio?.trim()),
                            action: () => select('profile'),
                          },
                          {
                            label: 'عرض الدورات والتكوينات',
                            done: programsList.length > 0,
                            action: () => select('programs'),
                          },
                          {
                            label: 'الموقع الرسمي ومعلومات التواصل',
                            done: Boolean(member.website || member.phone),
                            action: () => select('profile'),
                          },
                          {
                            label: 'الظهور في دليل أكاديميات رائدة',
                            done: member.isPublic !== false && user.membershipStatus === 'approved',
                            action: () => select('settings'),
                          },
                        ]
                      : isExpert
                        ? [
                            {
                              label: 'ملف خبيرة جاهز للاستشارة',
                              done: Boolean(member.name && member.image),
                              action: () => select('profile'),
                            },
                            {
                              label: 'تخصص ونبذة مهنية',
                              done: Boolean(member.specialty?.trim() && member.bio?.trim()),
                              action: () => select('profile'),
                            },
                            {
                              label: 'خدمات أو عروض استشارية',
                              done: asArray(member.services).length > 0,
                              action: () => select('services'),
                            },
                            {
                              label: 'الظهور في دليل الخبراء واستقبال الطلبات',
                              done: member.isPublic !== false && user.membershipStatus === 'approved',
                              action: () => select('settings'),
                            },
                          ]
                      : isBusiness
                        ? [
                            {
                              label: 'الملف الشخصي في دليل الأعضاء',
                              done: completeness >= 70,
                              action: () => select('profile'),
                            },
                            {
                              label: 'إعداد علامتكِ التجارية (علامة واحدة)',
                              done: Boolean(myBrand?.id),
                              action: () => select('brand'),
                            },
                            {
                              label: 'شعار وغلاف للعلامة',
                              done: Boolean(myBrand?.logo || myBrand?.cover),
                              action: () => select('brand'),
                            },
                            {
                              label: 'الظهور في الدليل العام',
                              done: member.isPublic !== false && user.membershipStatus === 'approved',
                              action: () => select('settings'),
                            },
                          ]
                      : []

                    const quickActions = isGuest
                      ? [
                          { id: 'consultations', label: 'طلب استشارة', hint: 'من خبيرة أو أكاديمية', icon: MessageSquare, tone: 'gold' },
                          { id: 'opportunities', label: 'الفرص', hint: 'منح ومبادرات', icon: Trophy, tone: 'rose' },
                          { id: 'profile', label: 'بياناتك', hint: 'الاسم والصورة', icon: User, tone: 'mauve' },
                          { id: 'membership', label: 'الترقية', hint: 'عضوية مهنية', icon: Sparkles, tone: 'navy' },
                        ]
                      : isAcademy
                        ? [
                            { id: 'profile', label: 'صفحة الأكاديمية', hint: `${completeness}% مكتمل`, icon: User, tone: 'navy' },
                            { id: 'programs', label: 'البرامج والدورات', hint: programsList.length ? `${programsList.length} برنامج` : 'أضيفي دورات', icon: GraduationCap, tone: 'gold' },
                            { id: 'services', label: 'خدمات المركز', hint: 'خدمات ومنتجات', icon: Briefcase, tone: 'mauve' },
                            { id: 'consultations', label: 'طلبات الاستشارة', hint: unreadConsultations ? `${unreadConsultations} جديدة` : 'وارد العملاء', icon: MessageSquare, tone: 'rose' },
                          ]
                        : isExpert
                          ? [
                              { id: 'profile', label: 'ملف الخبيرة', hint: `${completeness}% مكتمل`, icon: User, tone: 'navy' },
                              { id: 'consultations', label: 'طلبات الاستشارة', hint: unreadConsultations ? `${unreadConsultations} جديدة` : 'وارد العملاء', icon: MessageSquare, tone: 'gold' },
                              { id: 'services', label: 'خدماتي', hint: 'خدمات واستشارات', icon: Briefcase, tone: 'mauve' },
                              { id: 'opportunities', label: 'الفرص', hint: 'منح ومبادرات', icon: Trophy, tone: 'rose' },
                            ]
                        : isBusiness
                          ? [
                              { id: 'profile', label: 'الملف الشخصي', hint: `${completeness}% مكتمل`, icon: User, tone: 'navy' },
                              { id: 'brand', label: 'علامتي', hint: myBrand ? myBrand.name : 'أعدّي علامتكِ', icon: Building2, tone: 'gold' },
                              { id: 'services', label: 'خدماتي', hint: 'خدمات ومنتجات', icon: Briefcase, tone: 'mauve' },
                              { id: 'consultations', label: 'الاستشارات', hint: unreadConsultations ? `${unreadConsultations} جديدة` : 'طلب ومتابعة', icon: MessageSquare, tone: 'rose' },
                            ]
                        : [
                          { id: 'consultations', label: 'الاستشارات', hint: unreadConsultations ? `${unreadConsultations} جديدة` : 'طلب ومتابعة', icon: MessageSquare, tone: 'gold' },
                          { id: 'opportunities', label: 'الفرص', hint: 'منح ومبادرات', icon: Trophy, tone: 'rose' },
                          { id: 'services', label: 'خدماتي', hint: 'خدمات ومنتجات', icon: Briefcase, tone: 'mauve' },
                          { id: 'profile', label: 'الملف', hint: `${completeness}% مكتمل`, icon: User, tone: 'navy' },
                        ]

                    return (
                      <>
                        <section className="relative overflow-hidden rounded-[24px] bg-[#0A1328] text-white p-5 sm:p-7">
                          <div
                            className="pointer-events-none absolute inset-0 opacity-[0.35]"
                            style={{
                              background:
                                'radial-gradient(ellipse 70% 80% at 0% 0%, rgba(201,162,77,0.35), transparent 55%), radial-gradient(ellipse 50% 60% at 100% 100%, rgba(232,180,184,0.18), transparent 50%)',
                            }}
                          />
                          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                            <div className="min-w-0">
                              <p className="text-[12px] font-semibold text-white/45">
                                {isAcademy
                                  ? 'لوحة الأكاديمية'
                                  : isExpert
                                    ? 'لوحة الخبيرة'
                                    : 'مرحباً بعودتك'}
                              </p>
                              <h2 className="mt-1 text-2xl sm:text-[1.85rem] font-extrabold tracking-[-0.03em] font-display">
                                {isAcademy || isExpert ? member.name : firstName}
                              </h2>
                              <p className="mt-2 inline-flex items-center gap-2 text-[12px] text-white/60">
                                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 font-semibold text-gold ring-1 ring-gold/25">
                                  {membershipLabel}
                                </span>
                                {!isGuest && (
                                  <span>اكتمال الملف {completeness}%</span>
                                )}
                              </p>
                              <p className="mt-3 max-w-md text-[13px] text-white/55 leading-relaxed">
                                {nextHint}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 shrink-0">
                              {nextTo ? (
                                <Button to={nextTo} variant="gold" size="sm" className="!rounded-full">
                                  {nextLabel}
                                  <ChevronLeft className="w-4 h-4 opacity-70" />
                                </Button>
                              ) : (
                                <Button
                                  variant="gold"
                                  size="sm"
                                  className="!rounded-full"
                                  onClick={() => nextAction?.()}
                                >
                                  {nextLabel}
                                  <ChevronLeft className="w-4 h-4 opacity-70" />
                                </Button>
                              )}
                              {!isGuest && (
                                <Button
                                  to={`/members/${member.id}`}
                                  variant="outline"
                                  size="sm"
                                  className="!rounded-full !border-white/20 !text-white hover:!bg-white/10"
                                >
                                  <Eye className="w-4 h-4" />
                                  {isAcademy ? 'الصفحة الرسمية' : 'الملف العام'}
                                </Button>
                              )}
                            </div>
                          </div>

                          {!isGuest && completeness < 100 && (
                            <div className="relative mt-5 pt-4 border-t border-white/10">
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <p className="text-[12px] font-semibold text-white/70">
                                  {isAcademy
                                    ? 'إعداد صفحة الأكاديمية'
                                    : isExpert
                                      ? 'إعداد ملف الخبيرة'
                                      : 'اكتمال الملف'}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => select('profile')}
                                  className="text-[12px] font-semibold text-gold pressable-soft"
                                >
                                  إكمال الآن
                                </button>
                              </div>
                              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gold transition-all"
                                  style={{ width: `${completeness}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </section>

                        {academyChecklist.length > 0 && (
                          <Surface className="p-5">
                            <SectionTitle
                              title={
                                isAcademy
                                  ? 'مزايا عضوية الأكاديمية — قائمة الإعداد'
                                  : isExpert
                                    ? 'عضوية رائدة للمدربين والخبراء — قائمة الإعداد'
                                    : 'عضوية رائدة للأعمال — قائمة الإعداد'
                              }
                            />
                            <div className="space-y-2">
                              {academyChecklist.map((item) => (
                                <button
                                  key={item.label}
                                  type="button"
                                  onClick={item.action}
                                  className="w-full flex items-start gap-3 rounded-[14px] bg-[#F7F3EE] p-3.5 text-right pressable-soft hover:bg-blush/50 transition-colors"
                                >
                                  <span
                                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                      item.done ? 'bg-emerald-500/15 text-emerald-700' : 'bg-navy/5 text-muted'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className={`block text-[13px] font-semibold ${item.done ? 'text-navy' : 'text-navy/80'}`}>
                                      {item.label}
                                    </span>
                                    <span className="text-[11px] text-muted">
                                      {item.done ? 'مكتمل' : 'اضغطي للإعداد'}
                                    </span>
                                  </span>
                                  <ChevronLeft className="w-4 h-4 text-muted shrink-0 mt-1" />
                                </button>
                              ))}
                            </div>
                            <Link
                              to={isAcademy ? '/academies' : isExpert ? '/experts' : '/brands'}
                              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-rose"
                            >
                              {isAcademy
                                ? 'دليل أكاديميات رائدة'
                                : isExpert
                                  ? 'دليل خبراء رائدة'
                                  : 'دليل العلامات التجارية'}
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </Link>
                          </Surface>
                        )}

                        <section>
                          <SectionTitle title="إجراءات سريعة" />
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                            {quickActions.map((action) => {
                              const Icon = action.icon
                              return (
                                <button
                                  key={action.id}
                                  type="button"
                                  onClick={() => select(action.id)}
                                  className="group text-right rounded-[18px] bg-white hairline shadow-xs p-4 sm:p-5 pressable-soft hover:ring-1 hover:ring-navy/10 transition-shadow"
                                >
                                  <div
                                    className={`w-10 h-10 rounded-[12px] ring-1 flex items-center justify-center ${toneClass[action.tone]}`}
                                  >
                                    <Icon className="w-[18px] h-[18px]" />
                                  </div>
                                  <p className="mt-3 text-[14px] font-bold text-navy tracking-[-0.01em]">
                                    {action.label}
                                  </p>
                                  <p className="mt-0.5 text-[11px] text-muted flex items-center gap-1">
                                    {action.hint}
                                    <ArrowUpLeft className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                                  </p>
                                </button>
                              )
                            })}
                          </div>
                        </section>

                        <div className={`grid grid-cols-2 ${isGuest ? '' : 'lg:grid-cols-4'} gap-2.5 sm:gap-3`}>
                          {overviewStats.map((s) => {
                            const Icon = s.icon
                            return (
                              <Surface key={s.label} className="p-4">
                                <div className="flex items-center justify-between gap-2">
                                  <div
                                    className={`w-9 h-9 rounded-[11px] ring-1 flex items-center justify-center ${toneClass[s.tone]}`}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <p className="text-xl sm:text-2xl font-extrabold text-navy tracking-[-0.03em] tabular-nums">
                                    {s.value}
                                  </p>
                                </div>
                                <p className="mt-2 text-[11px] text-muted">{s.label}</p>
                              </Surface>
                            )
                          })}
                        </div>

                        {isGuest && (
                          <GuestUpgradePanel
                            onApplied={async () => {
                              await refreshMe()
                              reloadDash()
                            }}
                          />
                        )}

                        <div className={`grid gap-4 ${isGuest ? '' : 'lg:grid-cols-2'}`}>
                          <Surface className="p-5">
                            <SectionTitle
                              title="فرص مقترحة"
                              action={
                                <button
                                  type="button"
                                  onClick={() => select('opportunities')}
                                  className="text-[12px] text-rose font-semibold pressable-soft"
                                >
                                  عرض الكل
                                </button>
                              }
                            />
                            <div className="space-y-2">
                              {(opportunitiesList ?? []).slice(0, 3).map((o) => (
                                <Link
                                  key={o.id}
                                  to="/opportunities"
                                  className="flex items-start gap-3 p-3 rounded-[14px] bg-[#F7F3EE] hover:bg-blush/60 transition-colors"
                                >
                                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gold/15 text-gold-dark">
                                    <Trophy className="w-3.5 h-3.5" />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-navy truncate">{o.title}</p>
                                    <p className="text-[11px] text-muted mt-0.5">
                                      {o.type}
                                      {o.deadline ? ` · حتى ${o.deadline}` : ''}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                              {(opportunitiesList ?? []).length === 0 && (
                                <EmptyHint>لا توجد فرص منشورة حالياً</EmptyHint>
                              )}
                            </div>
                          </Surface>

                          <Surface className="p-5">
                            <SectionTitle
                              title="آخر الإشعارات"
                              action={
                                <button
                                  type="button"
                                  onClick={() => select('notifications')}
                                  className="text-[12px] text-rose font-semibold pressable-soft"
                                >
                                  عرض الكل
                                </button>
                              }
                            />
                            <div className="space-y-2">
                              {notifications.slice(0, 4).map((n) => (
                                <button
                                  key={n.id}
                                  type="button"
                                  onClick={async () => {
                                    if (n.unread) {
                                      await meApi.markNotificationRead(n.id)
                                      reloadNotifs()
                                      reloadDash()
                                    }
                                  }}
                                  className={`w-full text-right flex items-start gap-3 p-3 rounded-[14px] ${
                                    n.unread ? 'bg-rose-soft/60' : 'bg-[#F7F3EE]'
                                  }`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                      n.unread ? 'bg-rose' : 'bg-transparent'
                                    }`}
                                  />
                                  <div>
                                    <p className="text-[13px] text-navy leading-snug">{n.text}</p>
                                    <p className="text-[11px] text-muted mt-0.5">{n.time || ''}</p>
                                  </div>
                                </button>
                              ))}
                              {notifications.length === 0 && (
                                <EmptyHint>لا توجد إشعارات جديدة</EmptyHint>
                              )}
                            </div>
                          </Surface>
                        </div>

                        {!isGuest && (
                          <div className="grid lg:grid-cols-2 gap-4">
                            <Surface className="p-5">
                              <SectionTitle
                                title="فعالياتك القادمة"
                                action={
                                  <button
                                    type="button"
                                    onClick={() => select('events')}
                                    className="text-[12px] text-rose font-semibold pressable-soft"
                                  >
                                    الكل
                                  </button>
                                }
                              />
                              <div className="space-y-2">
                                {upcomingEvents.slice(0, 3).map((e) => (
                                  <Link
                                    key={e.id}
                                    to={`/events/${e.id}`}
                                    className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F7F3EE] hover:bg-blush/60 transition-colors pressable-soft"
                                  >
                                    <SafeImg
                                      src={e.image}
                                      fallback={eventImageFallback}
                                      alt=""
                                      className="w-11 h-11 rounded-[10px] object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[13px] font-semibold text-navy truncate">{e.title}</p>
                                      <p className="text-[11px] text-muted">{e.date}</p>
                                    </div>
                                    <ChevronLeft className="w-4 h-4 text-muted shrink-0" />
                                  </Link>
                                ))}
                                {upcomingEvents.length === 0 && (
                                  <EmptyHint>لا توجد فعاليات قادمة — تصفّحي الفعاليات للتسجيل</EmptyHint>
                                )}
                              </div>
                            </Surface>

                            <Surface className="p-5">
                              <SectionTitle title="اختصارات المنصة" />
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { to: '/programs', label: 'البرامج' },
                                  { to: '/experts', label: 'الخبراء' },
                                  { to: '/services', label: 'اطلبي خدمة' },
                                  { to: '/sos-store', label: 'SOS Store' },
                                  { to: '/membership', label: 'العضوية' },
                                  { to: '/project-check', label: 'اختبري مشروعك' },
                                ].map((link) => (
                                  <Link
                                    key={link.to}
                                    to={link.to}
                                    className="flex items-center justify-between gap-2 rounded-[14px] bg-[#F7F3EE] px-3.5 py-3 text-[13px] font-semibold text-navy hover:bg-blush/70 transition-colors"
                                  >
                                    {link.label}
                                    <ChevronLeft className="w-3.5 h-3.5 text-muted" />
                                  </Link>
                                ))}
                              </div>
                            </Surface>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              )}

              {active === 'opportunities' && (
                <Surface className="p-5">
                  <SectionTitle
                    title="الفرص المتاحة"
                    action={
                      <Button to="/opportunities" variant="outline" size="sm">
                        الصفحة الكاملة
                      </Button>
                    }
                  />
                  <div className="space-y-2">
                    {(opportunitiesList ?? []).slice(0, 12).map((o) => (
                      <Link
                        key={o.id}
                        to="/opportunities"
                        className="block p-4 rounded-[14px] bg-[#F7F3EE] hover:bg-blush/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-[11px] text-muted">
                          <span className="font-semibold text-gold-dark">{o.type}</span>
                          {o.deadline && <span>· حتى {o.deadline}</span>}
                        </div>
                        <p className="mt-1 font-bold text-navy">{o.title}</p>
                        {o.description && (
                          <p className="mt-1 text-[13px] text-muted line-clamp-2">{o.description}</p>
                        )}
                      </Link>
                    ))}
                    {(opportunitiesList ?? []).length === 0 && (
                      <EmptyHint>لا توجد فرص منشورة حالياً</EmptyHint>
                    )}
                  </div>
                </Surface>
              )}

              {active === 'consultations' && (
                <div className="space-y-4">
                  {receivesConsultations ? (
                    <AcademyConsultationInbox
                      items={consultations}
                      variant={isExpert ? 'expert' : 'academy'}
                      onChanged={() => {
                        reloadConsults()
                        reloadDash()
                      }}
                    />
                  ) : (
                    <>
                      {isBusiness && (
                        <Surface className="p-4 sm:p-5 bg-gold/5">
                          <p className="text-[13px] font-semibold text-navy">
                            عضوية الأعمال لا تستقبل طلبات استشارة
                          </p>
                          <p className="mt-1 text-[12px] text-muted leading-relaxed">
                            يمكنكِ طلب استشارة من خبيرة أو أكاديمية أو إدارة رائدة. استقبال الطلبات متاح
                            لعضوية الخبراء والأكاديميات فقط.
                          </p>
                        </Surface>
                      )}
                      <Surface className="divide-y divide-separator overflow-hidden">
                        {(isBusiness
                          ? consultations.filter((item) => item.direction === 'sent')
                          : consultations
                        ).map((item) => {
                          const isSent = item.direction === 'sent'
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={async () => {
                                if (!isSent && item.status === 'new') {
                                  await meApi.markConsultationRead(item.id)
                                  reloadConsults()
                                  reloadDash()
                                }
                              }}
                              className={`w-full text-right p-4 sm:p-5 ${
                                !isSent && item.status === 'new' ? 'bg-rose-soft/35' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-[13px] font-bold text-navy">{item.subject}</p>
                                  <p className="text-[12px] text-muted mt-0.5">
                                    {isSent
                                      ? `إلى: ${item.consultantName || (item.targetType === 'raida' ? 'إدارة رائدة' : 'خبيرة / أكاديمية')}`
                                      : `من: ${item.guestName} · ${item.guestEmail}${item.guestPhone ? ` · ${item.guestPhone}` : ''}`}
                                  </p>
                                  <p className="text-[12px] text-muted mt-1">
                                    {[item.field, item.consultationType, item.mode === 'online' ? 'Online' : item.mode === 'in_person' ? 'حضوري' : null]
                                      .filter(Boolean)
                                      .join(' · ')}
                                    {item.preferredAt
                                      ? ` · ${new Date(item.preferredAt).toLocaleString('ar-DZ')}`
                                      : ''}
                                  </p>
                                  <p className="text-[13px] text-navy mt-2 leading-relaxed">{item.message}</p>
                                  {item.adminReply && (
                                    <div className="mt-3 rounded-[12px] bg-navy/[0.04] p-3 text-[13px] text-navy">
                                      <p className="text-[11px] font-bold text-rose mb-1">رد رائدة</p>
                                      {item.adminReply}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1 items-end shrink-0">
                                  <Badge variant={isSent ? 'soft' : item.status === 'new' ? 'rose' : 'soft'}>
                                    {isSent
                                      ? 'مرسَلة'
                                      : item.status === 'new'
                                        ? 'جديدة'
                                        : item.status === 'done'
                                          ? 'مكتملة'
                                          : item.status === 'archived'
                                            ? 'مؤرشفة'
                                            : 'قيد المتابعة'}
                                  </Badge>
                                  {!isSent && <Badge variant="gold">وارد</Badge>}
                                  {item.adminReply && <Badge variant="gold">يوجد رد</Badge>}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                        {(isBusiness
                          ? consultations.filter((item) => item.direction === 'sent')
                          : consultations
                        ).length === 0 && (
                          <EmptyHint>
                            {isBusiness
                              ? 'لا توجد طلبات مرسلة بعد. أرسلي طلباً أدناه إلى خبيرة أو أكاديمية أو إدارة رائدة.'
                              : 'صندوق الاستشارات فارغ. أرسلي طلباً أدناه أو من صفحة خبيرة / أكاديمية.'}
                          </EmptyHint>
                        )}
                      </Surface>
                      <Surface className="p-5">
                        <h3 className="font-bold text-navy mb-2">اطلبي استشارة من إدارة رائدة أو خبيرة / أكاديمية</h3>
                        <p className="text-sm text-muted mb-4">
                          المجال → الخبيرة أو الأكاديمية → الوقت → Online/حضوري → الدفع → الجلسة
                        </p>
                        <ConsultationRequestForm
                          target="choose"
                          compact
                          onSent={() => {
                            reloadConsults()
                            reloadDash()
                          }}
                        />
                      </Surface>
                    </>
                  )}
                </div>
              )}

              {active === 'profile' && (
                <ProfilePreviewEditor
                  member={member}
                  simple={isGuest}
                  eyebrow={
                    isAcademy
                      ? 'معاينة ملف الأكاديمية'
                      : isExpert
                        ? 'معاينة ملف الخبيرة'
                        : undefined
                  }
                  hint={
                    isAcademy
                      ? 'هكذا ستظهر أكاديميتكِ أو مركز التدريب للزوار — اسم المؤسسة، النبذة، البرامج، وروابط التواصل.'
                      : isExpert
                        ? 'هكذا يظهر ملفكِ في دليل الخبراء — من هنا يطلب العملاء استشارتكِ مباشرة.'
                      : isBusiness
                        ? 'هذا ملفكِ الشخصي في دليل الأعضاء. لإعداد صفحة علامتكِ التجارية، انتقلي إلى تبويب «علامتي التجارية».'
                        : undefined
                  }
                  asideSlot={
                    isBusiness ? (
                      <button
                        type="button"
                        onClick={() => select('brand')}
                        className="w-full rounded-[16px] bg-gold/10 ring-1 ring-gold/25 p-4 text-right pressable-soft"
                      >
                        <p className="text-[12px] font-semibold text-gold-dark">علامتكِ التجارية</p>
                        <p className="mt-1 text-[13px] font-bold text-navy">
                          {myBrand ? myBrand.name : 'أعدّي علامة واحدة ضمن عضوية الأعمال'}
                        </p>
                        <p className="mt-1 text-[12px] text-muted">
                          {myBrand ? 'تحرير الصفحة العامة للعلامة' : 'الاسم، الشعار، القصة، والمنتجات'}
                        </p>
                      </button>
                    ) : undefined
                  }
                  onSaved={async () => {
                    await refreshMe()
                    reloadDash()
                  }}
                  onEditServices={isGuest ? undefined : () => select('services')}
                  onEditPrograms={isAcademy ? () => select('programs') : undefined}
                  onOpenSettings={isGuest ? undefined : () => select('settings')}
                />
              )}

              {isBusiness && active === 'brand' && (
                <MemberBrandEditor
                  brand={myBrand}
                  onSaved={async () => {
                    await refreshMe()
                    reloadDash()
                  }}
                />
              )}

              {!isGuest && active === 'services' && (
                <ServicesEditor
                  member={member}
                  onSaved={async () => {
                    await refreshMe()
                    reloadDash()
                  }}
                />
              )}

              {isAcademy && active === 'programs' && (
                <ProgramsEditor
                  member={member}
                  onSaved={async () => {
                    await refreshMe()
                    reloadDash()
                  }}
                />
              )}

              {!isGuest && active === 'events' && (
                <div className="space-y-2.5">
                  {upcomingEvents.map((e) => (
                    <Link key={e.id} to={`/events/${e.id}`}>
                      <Surface className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                        <SafeImg src={e.image} fallback={eventImageFallback} alt="" className="w-full sm:w-20 h-28 sm:h-14 rounded-[12px] object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-navy text-[14px] tracking-[-0.01em]">{e.title}</p>
                          <p className="text-[12px] text-muted mt-0.5">{e.date} — {e.location}</p>
                        </div>
                        <Badge variant="rose">مسجّلة</Badge>
                      </Surface>
                    </Link>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <Surface className="p-8 text-center space-y-3">
                      <p className="text-sm text-muted">لا توجد فعاليات مسجّلة بعد</p>
                      <Button to="/events" variant="gold" size="sm">تصفحي الفعاليات</Button>
                    </Surface>
                  )}
                </div>
              )}

              {!isGuest && active === 'partnerships' && (
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
                    <button
                      key={n.id}
                      type="button"
                      onClick={async () => {
                        if (n.unread) {
                          await meApi.markNotificationRead(n.id)
                          reloadNotifs()
                          reloadDash()
                        }
                      }}
                      className={`w-full text-right flex items-start gap-3 p-4 sm:p-5 ${n.unread ? 'bg-rose-soft/35' : ''}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-rose' : 'bg-light'}`} />
                      <div>
                        <p className="text-[13px] text-navy font-medium leading-snug">{n.text}</p>
                        <p className="text-[11px] text-muted mt-1">{n.time || ''}</p>
                      </div>
                    </button>
                  ))}
                  {notifications.length === 0 && (
                    <EmptyHint>لا توجد إشعارات</EmptyHint>
                  )}
                </Surface>
              )}

              {!isGuest && active === 'analytics' && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { label: 'إجمالي المشاهدات', value: String(dashboard?.stats.profileViews ?? 0) },
                      { label: 'استشارات جديدة', value: String(unreadConsultations) },
                      { label: 'فعاليات مسجّلة', value: String(dashboard?.stats.upcomingEvents ?? upcomingEvents.length) },
                    ].map((s) => (
                      <Surface key={s.label} className="p-5 text-center">
                        <p className="text-2xl font-extrabold text-navy tracking-[-0.03em] tabular-nums">{s.value}</p>
                        <p className="text-[11px] text-muted mt-1">{s.label}</p>
                      </Surface>
                    ))}
                  </div>
                  <Surface className="p-5">
                    <h3 className="font-bold text-navy mb-2 tracking-[-0.01em]">نشاط الملف</h3>
                    <p className="text-sm text-muted leading-relaxed">
                      هذه الأرقام تُحدَّث مباشرة من حسابك: مشاهدات الصفحة العامة، طلبات الاستشارة غير المقروءة، والفعاليات التي سجّلتِ فيها.
                    </p>
                  </Surface>
                </div>
              )}

              {active === 'membership' && isGuest && (
                <GuestUpgradePanel
                  onApplied={async () => {
                    await refreshMe()
                    reloadDash()
                  }}
                />
              )}

              {!isGuest && active === 'subscription' && (
                <Surface className="p-6 sm:p-8 max-w-lg">
                  <Badge variant="gold">الخطة الحالية</Badge>
                  <h3 className="text-2xl font-extrabold text-navy mt-3 tracking-[-0.02em]">
                    {planLabel[user.plan || ''] || user.plan || '—'}
                  </h3>
                  <p className="text-muted mt-1 text-sm">{user.email}</p>
                  <div className="flex flex-wrap gap-2.5 mt-6">
                    <Button to="/membership" variant="gold" size="sm" className="!rounded-full">
                      تغيير الخطة
                    </Button>
                  </div>
                </Surface>
              )}

              {!isGuest && active === 'settings' && (
                <PublicProfileToggle
                  isPublic={member.isPublic !== false}
                  onSaved={async () => {
                    await refreshMe()
                    reloadDash()
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <nav
        className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-navy/10 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
        aria-label="التنقل السريع"
      >
        <div className="mx-auto max-w-[1400px] grid grid-cols-5 px-1 pt-1.5 pb-1.5">
          {mobileTabs.map((id) => {
            const item = sidebarItems.find((s) => s.id === id)
            if (!item) return null
            const Icon = item.icon
            const isActive = active === id
            const badge = id === 'consultations' ? unreadConsultations || undefined : undefined
            return (
              <button
                key={id}
                type="button"
                onClick={() => select(id)}
                className={`relative flex flex-col items-center gap-0.5 py-1.5 rounded-[12px] pressable-soft ${
                  isActive ? 'text-navy' : 'text-muted'
                }`}
              >
                <span className="relative">
                  <Icon className={`w-[20px] h-[20px] ${isActive ? 'text-navy' : ''}`} />
                  {badge ? (
                    <span className="absolute -top-1.5 -left-2 min-w-4 h-4 px-0.5 rounded-full bg-gold text-navy text-[9px] font-bold flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  ) : null}
                </span>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-navy' : 'text-muted'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-gold" />
                )}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1.5 rounded-[12px] text-muted pressable-soft"
          >
            <MoreHorizontal className="w-[20px] h-[20px]" />
            <span className="text-[10px] font-semibold">المزيد</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
