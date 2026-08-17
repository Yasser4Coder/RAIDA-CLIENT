import { useState, useEffect, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Briefcase, Calendar, Handshake, Bell,
  BarChart3, CreditCard, Settings, ChevronLeft, Eye, Users,
  TrendingUp, CalendarCheck, MessageSquare, Plus, Menu, X, Trash2, Sparkles,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { LoadingBlock, ErrorBlock } from '../components/ui/StateBlocks'
import { materialize, springs, useMotionSafe } from '../lib/motion'
import { useAuth } from '../context/AuthContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { PLAN_LABELS, ROLE_LABELS } from '../lib/plans'
import { catalogApi, meApi } from '../lib/catalog'
import { asArray } from '../lib/normalize'
import type { Member } from '../types/api'
import ImageUpload from '../components/ui/ImageUpload'
import ConsultationRequestForm from '../components/ui/ConsultationRequestForm'
import SeoHead from '../components/seo/SeoHead'
import { routeSeo } from '../lib/seo'

const planLabel = PLAN_LABELS

type SidebarItem = {
  id: string
  label: string
  icon: typeof LayoutDashboard
  badge?: number
}

const memberSidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'consultations', label: 'الاستشارات', icon: MessageSquare },
  { id: 'profile', label: 'الملف الشخصي', icon: User },
  { id: 'services', label: 'الخدمات', icon: Briefcase },
  { id: 'events', label: 'الفعاليات', icon: Calendar },
  { id: 'partnerships', label: 'الشراكات', icon: Handshake },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
  { id: 'subscription', label: 'الاشتراك', icon: CreditCard },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
]

const guestSidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'consultations', label: 'الاستشارات', icon: MessageSquare },
  { id: 'profile', label: 'الملف الشخصي', icon: User },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'membership', label: 'الترقية للعضوية', icon: Sparkles },
]

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

function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[18px] bg-white hairline shadow-xs ${className}`}>
      {children}
    </div>
  )
}

function LoginForm({
  onLogin,
  onRegister,
  hint,
}: {
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (payload: {
    email: string
    password: string
    name: string
    accountType: 'guest' | 'member'
    plan?: string
  }) => Promise<void>
  hint: string
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [accountType, setAccountType] = useState<'guest' | 'member'>('guest')
  const [plan, setPlan] = useState('BUSINESS')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { data: plans } = useAsyncData(() => catalogApi.plans(), [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (mode === 'login') {
        await onLogin(email, password)
      } else {
        await onRegister({
          email,
          password,
          name,
          accountType,
          plan: accountType === 'member' ? plan : undefined,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : mode === 'login' ? 'فشل تسجيل الدخول' : 'تعذر إنشاء الحساب')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-ivory flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[20px] bg-white hairline shadow-sm p-6 sm:p-8 space-y-4"
      >
        <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-ivory">
          <button
            type="button"
            className={`h-9 rounded-full text-[13px] font-semibold ${mode === 'login' ? 'bg-navy text-white' : 'text-muted'}`}
            onClick={() => setMode('login')}
          >
            دخول
          </button>
          <button
            type="button"
            className={`h-9 rounded-full text-[13px] font-semibold ${mode === 'register' ? 'bg-navy text-white' : 'text-muted'}`}
            onClick={() => setMode('register')}
          >
            إنشاء حساب
          </button>
        </div>
        <h1 className="text-xl font-extrabold text-navy tracking-[-0.02em]">
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </h1>
        <p className="text-[13px] text-muted">
          {mode === 'login'
            ? 'ادخلي إلى لوحة التحكم الخاصة بكِ.'
            : 'اختاري حساب زائرة أو عضوية مدفوعة. العضوية تحتاج موافقة الإدارة.'}
        </p>
        {mode === 'register' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5">الاسم</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`h-11 rounded-[12px] text-[13px] font-semibold border ${
                  accountType === 'guest' ? 'bg-navy text-white border-navy' : 'bg-ivory text-muted border-separator'
                }`}
                onClick={() => setAccountType('guest')}
              >
                زائرة
              </button>
              <button
                type="button"
                className={`h-11 rounded-[12px] text-[13px] font-semibold border ${
                  accountType === 'member' ? 'bg-navy text-white border-navy' : 'bg-ivory text-muted border-separator'
                }`}
                onClick={() => setAccountType('member')}
              >
                عضوة
              </button>
            </div>
            {accountType === 'member' && (
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1.5">خطة العضوية</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40"
                >
                  {(plans ?? []).map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.nameAr} — {item.launchPrice || item.price} دج
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={mode === 'register' ? 10 : 1}
            className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15"
          />
        </div>
        {error && <p className="text-sm text-rose">{error}</p>}
        {mode === 'login' && (
          <Link to="/forgot-password" className="block text-[12px] text-rose font-semibold">
            نسيتِ كلمة المرور أو رابط التأكيد؟
          </Link>
        )}
        {import.meta.env.DEV && <p className="text-[11px] text-muted">تجريبي: {hint}</p>}
        <Button type="submit" variant="gold" size="md" className="w-full" disabled={submitting}>
          {submitting ? 'جاري الحفظ...' : mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
        </Button>
      </form>
    </div>
  )
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
        <h2 className="text-lg font-bold text-navy">
          {pending ? 'طلب العضوية قيد المراجعة' : rejected ? 'تم رفض طلب العضوية' : 'حساب زائرة'}
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          {pending
            ? 'استلمنا طلب عضويتكِ. ستظهرين في دليل رائدة ولوحة العضوة بعد موافقة الإدارة.'
            : rejected
              ? 'يمكنكِ إعادة التقديم على عضوية مدفوعة ليراجعها فريق رائدة.'
              : 'هذا حساب زائرة. للظهور في الدليل والحصول على مزايا العضوية، قدّمي طلب عضوية لإدارة رائدة.'}
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
    <Surface className="p-5 sm:p-6 max-w-lg space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-[12px] bg-gold/15 ring-1 ring-gold/25 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-gold-dark" />
        </div>
        <div>
          <h3 className="font-bold text-navy">الترقية إلى عضوية رائدة</h3>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            حساب الزائرة للاستشارات فقط. العضوية تُظهركِ في الدليل وتتيح الخدمات والمنتجات والملف العام بعد موافقة الإدارة.
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

const fieldClass =
  'w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15'

function ProfileEditor({
  member,
  onSaved,
  simple = false,
}: {
  member: Member
  onSaved: () => Promise<void>
  simple?: boolean
}) {
  const [name, setName] = useState(member.name)
  const [title, setTitle] = useState(member.title)
  const [specialty, setSpecialty] = useState(member.specialty)
  const [city, setCity] = useState(member.city)
  const [website, setWebsite] = useState(member.website || '')
  const [instagram, setInstagram] = useState(member.social?.instagram || '')
  const [linkedin, setLinkedin] = useState(member.social?.linkedin || '')
  const [bio, setBio] = useState(member.bio || '')
  const [image, setImage] = useState(member.image || '')
  const [cover, setCover] = useState(member.cover || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    setName(member.name)
    setTitle(member.title)
    setSpecialty(member.specialty)
    setCity(member.city)
    setWebsite(member.website || '')
    setInstagram(member.social?.instagram || '')
    setLinkedin(member.social?.linkedin || '')
    setBio(member.bio || '')
    setImage(member.image || '')
    setCover(member.cover || '')
  }, [member])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setOk(false)
    try {
      if (simple) {
        await meApi.updateProfile({
          name,
          city,
        })
      } else {
        await meApi.updateProfile({
          name,
          title,
          specialty,
          city,
          website: website.trim() || null,
          bio: bio.trim() || null,
          image: image || null,
          cover: cover || null,
          social: {
            ...member.social,
            instagram: instagram.trim(),
            linkedin: linkedin.trim(),
          },
        })
      }
      await onSaved()
      setOk(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر حفظ الملف')
    } finally {
      setSaving(false)
    }
  }

  const simpleFields = [
    { label: 'الاسم', value: name, set: setName },
    { label: 'المدينة', value: city, set: setCity },
  ]
  const memberFields = [
    { label: 'الاسم', value: name, set: setName },
    { label: 'الصفة المهنية', value: title, set: setTitle },
    { label: 'التخصص', value: specialty, set: setSpecialty },
    { label: 'المدينة', value: city, set: setCity },
    { label: 'الموقع', value: website, set: setWebsite },
    { label: 'Instagram', value: instagram, set: setInstagram },
    { label: 'LinkedIn', value: linkedin, set: setLinkedin },
  ]

  return (
    <Surface className="p-5 sm:p-6 max-w-2xl">
      <h3 className="font-bold text-navy mb-2">{simple ? 'بياناتك' : 'إدارة الملف الشخصي'}</h3>
      {simple && (
        <p className="text-sm text-muted mb-6">
          حساب زائرة بسيط: الاسم والصورة فقط. الخدمات والمنتجات والملف العام متاحة بعد الترقية للعضوية.
        </p>
      )}
      <form onSubmit={handleSubmit} className={`space-y-3.5 ${simple ? '' : 'mt-4'}`}>
        {!simple && (
          <>
            <ImageUpload label="صورة الملف" value={image} onChange={setImage} />
            <ImageUpload label="صورة الغلاف" value={cover} onChange={setCover} />
          </>
        )}
        {(simple ? simpleFields : memberFields).map((f) => (
          <div key={f.label}>
            <label className="block text-[11px] font-semibold text-muted mb-1.5 tracking-[0.01em]">
              {f.label}
            </label>
            <input
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className={fieldClass}
            />
          </div>
        ))}
        {!simple && (
          <div>
            <label className="block text-[11px] font-semibold text-muted mb-1.5">نبذة تعريفية</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15 resize-none"
            />
          </div>
        )}
        {error && <p className="text-sm text-rose">{error}</p>}
        {ok && <p className="text-sm text-emerald-700">تم حفظ التغييرات</p>}
        <Button type="submit" variant="gold" size="md" disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </form>
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
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { reduce, transition } = useMotionSafe()

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

  const isGuest = user?.role === 'guest'
  const sidebarItems = isGuest ? guestSidebarItems : memberSidebarItems
  const member = dashboard?.profile || authProfile
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

  if (!user) {
    return (
      <>
        {seo}
        <LoginForm
          hint={import.meta.env.DEV ? 'sara@raida.local / Password123!' : 'أدخلي بيانات حسابك'}
          onLogin={login}
          onRegister={register}
        />
      </>
    )
  }

  if (user.role === 'admin' || user.role === 'super_admin') {
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

  const navItems = sidebarItems.map((item) => {
    if (item.id === 'notifications') return { ...item, badge: unreadCount || undefined }
    if (item.id === 'consultations') return { ...item, badge: unreadConsultations || undefined }
    return item
  })

  const SidebarNav = (
    <>
      <div className="p-4 border-b border-separator">
        <div className="flex items-center gap-3">
          <img
            src={member.image || imageFallback}
            alt=""
            className="w-10 h-10 rounded-[12px] object-cover ring-1 ring-rose/20"
          />
          <div className="min-w-0">
            <p className="font-bold text-navy text-[13px] truncate tracking-[-0.01em]">{member.name}</p>
            <Badge variant="gold" className="mt-1">
              {isGuest
                ? ROLE_LABELS.guest
                : planLabel[user.plan || ''] || user.plan || ROLE_LABELS.member}
            </Badge>
          </div>
        </div>
      </div>

      <nav className="p-2.5 space-y-0.5 overflow-y-auto flex-1">
        {navItems.map((item) => {
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

        <div className="pt-3 mt-2 border-t border-separator space-y-0.5">
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-medium text-muted hover:text-navy hover:bg-blush pressable-soft"
          >
            تسجيل الخروج
          </button>
        </div>
      </nav>
    </>
  )

  return (
    <div className="pt-20 min-h-screen bg-ivory">
      {seo}
      <div className="max-w-[1400px] mx-auto flex">
        <aside className="hidden lg:flex sticky top-20 h-[calc(100vh-5rem)] w-[260px] shrink-0 flex-col border-l border-separator bg-white/80 backdrop-blur-xl">
          {SidebarNav}
        </aside>

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
            {!isGuest && (
              <Button to={`/members/${member.id}`} variant="outline" size="sm" className="shrink-0 !rounded-full">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">عرض الملف</span>
              </Button>
            )}
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
                  <div className={`grid grid-cols-2 ${isGuest ? '' : 'lg:grid-cols-4'} gap-3`}>
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

                  {isGuest && (
                    <GuestUpgradePanel
                      onApplied={async () => {
                        await refreshMe()
                        reloadDash()
                      }}
                    />
                  )}

                  <Surface className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-navy tracking-[-0.01em]">
                        {isGuest ? 'استشاراتك' : 'استكشفي المنصة'}
                      </h3>
                      {isGuest && (
                        <button
                          type="button"
                          onClick={() => select('consultations')}
                          className="text-[12px] text-rose font-semibold pressable-soft"
                        >
                          فتح الصندوق
                        </button>
                      )}
                    </div>
                    {isGuest ? (
                      <p className="text-sm text-muted leading-relaxed">
                        اطلبي استشارة من إدارة رائدة أو خبيرة، وتابعي الردود من هنا. لا يمكن إضافة خدمات أو منتجات على حساب الزائرة.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {[
                          { to: '/programs', label: 'البرامج' },
                          { to: '/experts', label: 'الخبيرات' },
                          { to: '/opportunities', label: 'الفرص' },
                          { to: '/sos-store', label: 'SOS Store' },
                          { to: '/benefits', label: 'المزايا' },
                          { to: '/membership', label: 'العضوية' },
                        ].map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="rounded-full bg-rose-soft/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy hover:bg-blush"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </Surface>

                  <div className={`grid ${isGuest ? '' : 'lg:grid-cols-2'} gap-4`}>
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
                            className={`w-full text-right flex items-start gap-3 p-3 rounded-[12px] ${
                              n.unread ? 'bg-rose-soft/60' : 'bg-ivory'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-rose' : 'bg-transparent'}`} />
                            <div>
                              <p className="text-[13px] text-navy leading-snug">{n.text}</p>
                              <p className="text-[11px] text-muted mt-0.5">{n.time || ''}</p>
                            </div>
                          </button>
                        ))}
                        {notifications.length === 0 && (
                          <p className="text-sm text-muted py-4 text-center">لا توجد إشعارات</p>
                        )}
                      </div>
                    </Surface>

                    {!isGuest && (
                      <Surface className="p-5">
                        <h3 className="font-bold text-navy tracking-[-0.01em] mb-4">فعالياتك القادمة</h3>
                        <div className="space-y-2">
                          {upcomingEvents.slice(0, 3).map((e) => (
                            <Link
                              key={e.id}
                              to={`/events/${e.id}`}
                              className="flex items-center gap-3 p-3 rounded-[12px] bg-ivory hover:bg-blush/70 transition-colors pressable-soft"
                            >
                              <img src={e.image || eventImageFallback} alt="" className="w-11 h-11 rounded-[10px] object-cover" />
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold text-navy truncate">{e.title}</p>
                                <p className="text-[11px] text-muted">{e.date}</p>
                              </div>
                              <ChevronLeft className="w-4 h-4 text-muted shrink-0" />
                            </Link>
                          ))}
                          {upcomingEvents.length === 0 && (
                            <p className="text-sm text-muted py-4 text-center">لا توجد فعاليات قادمة</p>
                          )}
                        </div>
                      </Surface>
                    )}
                  </div>

                  {!isGuest && (
                    <Surface className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-navy tracking-[-0.01em]">مشاهدات الملف</h3>
                        <TrendingUp className="w-5 h-5 text-gold" />
                      </div>
                      <p className="text-3xl font-extrabold text-navy tracking-[-0.03em] tabular-nums">
                        {dashboard?.stats.profileViews ?? member.profileViews ?? 0}
                      </p>
                      <p className="text-[12px] text-muted mt-1">إجمالي المشاهدات منذ نشر الملف</p>
                    </Surface>
                  )}
                </div>
              )}

              {active === 'consultations' && (
                <div className="space-y-4">
                  <Surface className="p-5">
                    <h3 className="font-bold text-navy mb-2">اطلبي استشارة من إدارة رائدة أو خبيرة</h3>
                    <p className="text-sm text-muted mb-4">
                      المجال → الخبيرة/رائدة → الوقت → Online/حضوري → الدفع → الجلسة
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
                  <Surface className="divide-y divide-separator overflow-hidden">
                    {consultations.map((item) => {
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
                                  ? `إلى: ${item.consultantName || (item.targetType === 'raida' ? 'إدارة رائدة' : 'خبيرة')}`
                                  : `${item.guestName} · ${item.guestEmail}${item.guestPhone ? ` · ${item.guestPhone}` : ''}`}
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
                                {isSent ? 'مرسَلة' : item.status === 'new' ? 'جديدة' : 'مقروءة'}
                              </Badge>
                              {item.adminReply && <Badge variant="gold">يوجد رد</Badge>}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                    {consultations.length === 0 && (
                      <p className="p-8 text-center text-sm text-muted">
                        صندوق الاستشارات فارغ. أرسلي طلبًا أعلاه أو من صفحة خبيرة.
                      </p>
                    )}
                  </Surface>
                </div>
              )}

              {active === 'profile' && (
                <ProfileEditor
                  member={member}
                  simple={isGuest}
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

              {!isGuest && active === 'events' && (
                <div className="space-y-2.5">
                  {upcomingEvents.map((e) => (
                    <Link key={e.id} to={`/events/${e.id}`}>
                      <Surface className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                        <img src={e.image || eventImageFallback} alt="" className="w-full sm:w-20 h-28 sm:h-14 rounded-[12px] object-cover" />
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
                    <p className="p-8 text-center text-sm text-muted">لا توجد إشعارات</p>
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
    </div>
  )
}
