import { useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  UserRound,
  Phone,
  ChevronLeft,
  ArrowLeft,
  School,
  Briefcase,
  GraduationCap,
  Globe,
  Check,
  Plus,
  X,
} from 'lucide-react'
import Button from '../ui/Button'
import AuthShell, { AuthAlert, AuthField, authInputClass } from './AuthShell'
import { useAsyncData } from '../../hooks/useAsyncData'
import { catalogApi } from '../../lib/catalog'
import { springs, useMotionSafe } from '../../lib/motion'
import type { Member, UserSafe } from '../../types/api'
import type { RegisterResult } from '../../context/AuthContext'

type Mode = 'login' | 'register'

type RegisterPayload = {
  email: string
  password: string
  name: string
  phone: string
  accountType: 'guest' | 'member'
  plan?: string
  title?: string
  specialty?: string
  city?: string
  website?: string
  bio?: string
  programs?: string[]
  category?: string
}

type LoginRegisterFormProps = {
  onLogin: (email: string, password: string) => Promise<{ user: UserSafe; profile: Member | null }>
  onRegister: (payload: RegisterPayload) => Promise<RegisterResult>
  hint?: string
  initialMode?: Mode
}

const ACADEMY_BENEFITS = [
  'صفحة رسمية خاصة بالأكاديمية أو مركز التدريب',
  'التعريف بالمؤسسة وبرامجها',
  'عرض الدورات والتكوينات',
  'الموقع الرسمي ومعلومات التواصل',
  'الظهور في دليل أكاديميات رائدة',
]

const PLAN_ICONS: Record<string, typeof School> = {
  BUSINESS: Briefcase,
  EXPERT: GraduationCap,
  ACADEMY: School,
}

function passwordStrength(password: string): { score: number; label: string } {
  let score = 0
  if (password.length >= 10) score += 1
  if (password.length >= 14) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/\p{L}/u.test(password) && /[^\p{L}0-9]/u.test(password)) score += 1
  const labels = ['ضعيفة', 'مقبولة', 'جيدة', 'قوية', 'ممتازة']
  return { score, label: labels[score] ?? 'ضعيفة' }
}

export default function LoginRegisterForm({
  onLogin,
  onRegister,
  hint,
  initialMode = 'login',
}: LoginRegisterFormProps) {
  const { reduce } = useMotionSafe()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [accountType, setAccountType] = useState<'guest' | 'member'>('guest')
  const [plan, setPlan] = useState('BUSINESS')
  const [title, setTitle] = useState('أكاديمية ومؤسسة تدريب')
  const [specialty, setSpecialty] = useState('')
  const [city, setCity] = useState('')
  const [website, setWebsite] = useState('')
  const [bio, setBio] = useState('')
  const [programs, setPrograms] = useState<string[]>([])
  const [programDraft, setProgramDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null)
  const { data: plans } = useAsyncData(() => catalogApi.plans(), [])

  const strength = useMemo(() => passwordStrength(password), [password])
  const isAcademy = accountType === 'member' && plan === 'ACADEMY'
  const sortedPlans = useMemo(
    () => [...(plans ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [plans],
  )

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
    setVerifyEmail(null)
  }

  const addProgram = () => {
    const value = programDraft.trim()
    if (!value || programs.includes(value) || programs.length >= 8) return
    setPrograms((prev) => [...prev, value])
    setProgramDraft('')
  }

  const onProgramKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addProgram()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (mode === 'login') {
        await onLogin(email, password)
      } else {
        const result = await onRegister({
          email,
          password,
          name,
          phone,
          accountType,
          plan: accountType === 'member' ? plan : undefined,
          ...(isAcademy
            ? {
                title: title.trim() || 'أكاديمية ومؤسسة تدريب',
                specialty: specialty.trim(),
                city: city.trim(),
                website: website.trim() || undefined,
                bio: bio.trim() || undefined,
                programs,
                category: 'أكاديميات ومراكز تدريب',
              }
            : {}),
        })
        if (result.requiresEmailVerification) {
          setVerifyEmail(result.email)
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === 'login'
            ? 'فشل تسجيل الدخول. تحقّق من البريد وكلمة المرور.'
            : 'تعذر إنشاء الحساب. حاول مرة أخرى.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (verifyEmail) {
    return (
      <AuthShell tagline="خطوة أخيرة قبل الدخول إلى مجتمع رائدة.">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.settle}
          className="mx-auto w-full max-w-md space-y-5 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-gold/15 ring-1 ring-gold/30">
            <Mail className="h-6 w-6 text-gold-dark" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-navy">
              تحقّق من بريدك
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              أرسلنا رابط تفعيل إلى{' '}
              <span className="font-semibold text-navy">{verifyEmail}</span>. بعد التأكيد يمكنك
              تسجيل الدخول ومتابعة إعداد صفحة الأكاديمية.
            </p>
          </div>
          <AuthAlert tone="success">الحساب جاهز — ينتظر تأكيد البريد فقط.</AuthAlert>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="gold"
              size="md"
              onClick={() => {
                setVerifyEmail(null)
                setMode('login')
                setPassword('')
              }}
            >
              الانتقال لتسجيل الدخول
              <ChevronLeft className="h-4 w-4 opacity-70" />
            </Button>
            <Button to="/" variant="outline" size="md">
              العودة للرئيسية
            </Button>
          </div>
        </motion.div>
      </AuthShell>
    )
  }

  return (
    <AuthShell tagline="ادخل لوحة التحكم أو أنشئ حسابًا للانضمام إلى مجتمع رائدة.">
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className={`mx-auto w-full space-y-5 ${isAcademy && mode === 'register' ? 'max-w-lg' : 'max-w-md'}`}
      >
        <div
          role="tablist"
          aria-label="وضع الحساب"
          className="grid grid-cols-2 gap-1 rounded-[16px] bg-navy/[0.04] p-1 ring-1 ring-navy/5"
        >
          {(
            [
              { id: 'login' as const, label: 'تسجيل الدخول' },
              { id: 'register' as const, label: 'إنشاء حساب' },
            ] as const
          ).map((tab) => {
            const active = mode === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchMode(tab.id)}
                className={`relative h-11 rounded-[12px] text-[13px] font-semibold transition-colors ${
                  active ? 'text-navy' : 'text-muted hover:text-navy/70'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="auth-mode-pill"
                    className="absolute inset-0 rounded-[12px] bg-white shadow-sm ring-1 ring-navy/8"
                    transition={reduce ? { duration: 0 } : springs.snappy}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-navy sm:text-[1.65rem]">
            {mode === 'login'
              ? 'مرحباً بعودتك'
              : isAcademy
                ? 'سجّلي أكاديميتكِ في رائدة'
                : 'انضم إلى رائدة'}
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
            {mode === 'login'
              ? 'أدخل بياناتك للوصول إلى فرصك وملفك ولوحة التحكم.'
              : isAcademy
                ? 'أدخلي معلومات المؤسسة الآن — الصفحة الرسمية تُكمَّل من لوحة التحكم بعد الموافقة.'
                : 'ابدأ بحساب زائر مجاني، أو قدّم على عضوية مهنية بموافقة الإدارة.'}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${mode}-${accountType}-${plan}`}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={springs.snappy}
            className="space-y-4"
          >
            {mode === 'register' && (
              <>
                <div>
                  <p className="mb-2 text-[12px] font-semibold text-navy/70">نوع الحساب</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('guest')}
                      className={`rounded-[16px] p-3.5 text-right transition ring-1 ${
                        accountType === 'guest'
                          ? 'bg-navy text-white ring-navy shadow-sm'
                          : 'bg-ivory/90 text-navy ring-navy/8 hover:ring-navy/15'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-[13px] font-bold">
                        <Sparkles className={`h-3.5 w-3.5 ${accountType === 'guest' ? 'text-gold' : 'text-rose'}`} />
                        زائر / زائرة
                      </span>
                      <span
                        className={`mt-1.5 block text-[11px] leading-relaxed ${
                          accountType === 'guest' ? 'text-white/65' : 'text-muted'
                        }`}
                      >
                        مجاني للاستكشاف وطلب الاستشارات
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('member')}
                      className={`rounded-[16px] p-3.5 text-right transition ring-1 ${
                        accountType === 'member'
                          ? 'bg-navy text-white ring-navy shadow-sm'
                          : 'bg-ivory/90 text-navy ring-navy/8 hover:ring-navy/15'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-[13px] font-bold">
                        <UserRound className={`h-3.5 w-3.5 ${accountType === 'member' ? 'text-gold' : 'text-rose'}`} />
                        عضوية مهنية
                      </span>
                      <span
                        className={`mt-1.5 block text-[11px] leading-relaxed ${
                          accountType === 'member' ? 'text-white/65' : 'text-muted'
                        }`}
                      >
                        أعمال · خبيرة · أكاديمية — بموافقة الإدارة
                      </span>
                    </button>
                  </div>
                </div>

                {accountType === 'member' && (
                  <div>
                    <p className="mb-2 text-[12px] font-semibold text-navy/70">اختاري خطة العضوية</p>
                    <div className="grid gap-2">
                      {sortedPlans.map((item) => {
                        const Icon = PLAN_ICONS[item.name] || Briefcase
                        const active = plan === item.name
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setPlan(item.name)}
                            className={`rounded-[16px] p-3.5 text-right transition ring-1 ${
                              active
                                ? 'bg-white ring-gold/50 shadow-sm'
                                : 'bg-ivory/80 ring-navy/8 hover:ring-navy/15'
                            }`}
                          >
                            <span className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${
                                  active ? 'bg-gold/15 text-gold-dark' : 'bg-navy/5 text-navy'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="text-[13px] font-bold text-navy leading-snug">
                                    {item.nameAr}
                                  </span>
                                  {active && (
                                    <Check className="h-4 w-4 shrink-0 text-gold-dark" />
                                  )}
                                </span>
                                <span className="mt-1 block text-[11px] text-muted leading-relaxed">
                                  {item.name === 'ACADEMY'
                                    ? 'صفحة رسمية · برامج ودورات · دليل الأكاديميات'
                                    : item.description}
                                </span>
                                <span className="mt-1.5 block text-[12px] font-semibold text-navy">
                                  {item.launchPrice || item.price} دج / {item.period}
                                </span>
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-2 text-[12px] text-muted">
                      تفاصيل المزايا في{' '}
                      <Link
                        to={plan === 'ACADEMY' ? '/membership/academies' : '/membership'}
                        className="font-semibold text-rose hover:underline"
                      >
                        صفحة العضوية
                      </Link>
                      .
                    </p>
                  </div>
                )}

                {isAcademy && (
                  <div className="rounded-[18px] bg-navy p-4 text-white space-y-3">
                    <p className="text-[12px] font-semibold text-gold">ماذا تحصلين مع عضوية الأكاديمية؟</p>
                    <ul className="space-y-2">
                      {ACADEMY_BENEFITS.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[12px] text-white/80 leading-relaxed">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <AuthField
                  label={isAcademy ? 'اسم الأكاديمية / مركز التدريب' : 'الاسم الكامل'}
                  htmlFor="auth-name"
                >
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted/70" />
                    <input
                      id="auth-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      autoComplete="organization"
                      placeholder={
                        isAcademy ? 'مثال: مؤسسة CPS للكوتشينق وإدارة المشاريع' : 'مثال: سارة بن عمر'
                      }
                      className={`${authInputClass} pr-10`}
                    />
                  </div>
                </AuthField>

                {isAcademy && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <AuthField label="نوع المؤسسة" htmlFor="auth-title">
                        <input
                          id="auth-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="أكاديمية / مركز تدريب"
                          className={authInputClass}
                        />
                      </AuthField>
                      <AuthField label="التخصص" htmlFor="auth-specialty">
                        <input
                          id="auth-specialty"
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          placeholder="كوتشينق، إدارة مشاريع…"
                          className={authInputClass}
                        />
                      </AuthField>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <AuthField label="المدينة" htmlFor="auth-city">
                        <input
                          id="auth-city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="الجزائر العاصمة"
                          className={authInputClass}
                        />
                      </AuthField>
                      <AuthField label="الموقع الرسمي" htmlFor="auth-website" hint="اختياري">
                        <div className="relative">
                          <Globe className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted/70" />
                          <input
                            id="auth-website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://"
                            dir="ltr"
                            className={`${authInputClass} pr-10`}
                          />
                        </div>
                      </AuthField>
                    </div>
                    <AuthField label="نبذة عن المؤسسة" htmlFor="auth-bio" hint="اختياري — يمكن إكمالها لاحقاً">
                      <textarea
                        id="auth-bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder="عرّفي بالمؤسسة وبرامجها باختصار…"
                        className={`${authInputClass} h-auto py-3 resize-none`}
                      />
                    </AuthField>
                    <div>
                      <p className="mb-1.5 text-[12px] font-semibold text-navy/70">
                        برامج أو دورات أولية
                        <span className="font-normal text-muted"> (اختياري)</span>
                      </p>
                      <div className="flex gap-2">
                        <input
                          value={programDraft}
                          onChange={(e) => setProgramDraft(e.target.value)}
                          onKeyDown={onProgramKey}
                          placeholder="مثال: كوتشينق احترافي"
                          className={`${authInputClass} flex-1`}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={addProgram}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {programs.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {programs.map((p) => (
                            <span
                              key={p}
                              className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-[11px] font-semibold text-navy"
                            >
                              {p}
                              <button
                                type="button"
                                onClick={() => setPrograms((prev) => prev.filter((x) => x !== p))}
                                aria-label="حذف"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <AuthField label="رقم الهاتف" htmlFor="auth-phone" hint="للتواصل عند الحاجة">
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted/70" />
                    <input
                      id="auth-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      minLength={8}
                      maxLength={40}
                      placeholder="05XXXXXXXX"
                      inputMode="tel"
                      autoComplete="tel"
                      className={`${authInputClass} pr-10`}
                    />
                  </div>
                </AuthField>
              </>
            )}

            <AuthField label="البريد الإلكتروني" htmlFor="auth-email">
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted/70" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={`${authInputClass} pr-10`}
                />
              </div>
            </AuthField>

            <AuthField
              label="كلمة المرور"
              htmlFor="auth-password"
              hint={mode === 'register' ? '١٠ أحرف على الأقل' : undefined}
            >
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted/70" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === 'register' ? 10 : 1}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'register' ? 'حرف ورقم على الأقل' : '••••••••••'}
                  className={`${authInputClass} pr-10 pl-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 left-2.5 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:bg-navy/5 hover:text-navy transition"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === 'register' && password.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strength.score > i ? 'bg-gold' : 'bg-navy/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted">قوة كلمة المرور: {strength.label}</p>
                </div>
              )}
            </AuthField>
          </motion.div>
        </AnimatePresence>

        {error && <AuthAlert>{error}</AuthAlert>}

        {mode === 'login' && (
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-[12px] font-semibold text-rose hover:underline underline-offset-2"
            >
              نسيت كلمة المرور أو رابط التأكيد؟
            </Link>
          </div>
        )}

        {import.meta.env.DEV && hint && <AuthAlert tone="info">تجريبي: {hint}</AuthAlert>}

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
          {submitting
            ? mode === 'login'
              ? 'جاري الدخول...'
              : 'جاري إنشاء الحساب...'
            : mode === 'login'
              ? 'تسجيل الدخول'
              : isAcademy
                ? 'إنشاء حساب الأكاديمية'
                : 'إنشاء الحساب والبدء'}
          {!submitting && <ChevronLeft className="h-4 w-4 opacity-70" />}
        </Button>

        <p className="text-center text-[12px] text-muted leading-relaxed">
          {mode === 'login' ? (
            <>
              ليس لديك حساب؟{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-semibold text-navy hover:text-rose transition-colors"
              >
                أنشئ حسابًا
              </button>
            </>
          ) : (
            <>
              لديك حساب مسبقًا؟{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-semibold text-navy hover:text-rose transition-colors"
              >
                سجّل الدخول
              </button>
            </>
          )}
        </p>

        <p className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-muted hover:text-navy"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            العودة للموقع
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
