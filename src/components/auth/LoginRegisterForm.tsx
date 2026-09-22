import { useMemo, useState, type FormEvent } from 'react'
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
} from 'lucide-react'
import Button from '../ui/Button'
import AuthShell, { AuthAlert, AuthField, authInputClass } from './AuthShell'
import { useAsyncData } from '../../hooks/useAsyncData'
import { catalogApi } from '../../lib/catalog'
import { springs, useMotionSafe } from '../../lib/motion'

type Mode = 'login' | 'register'

type RegisterPayload = {
  email: string
  password: string
  name: string
  phone: string
  accountType: 'guest' | 'member'
  plan?: string
}

type LoginRegisterFormProps = {
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (payload: RegisterPayload) => Promise<void>
  hint?: string
  initialMode?: Mode
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
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { data: plans } = useAsyncData(() => catalogApi.plans(), [])

  const strength = useMemo(() => passwordStrength(password), [password])

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
  }

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
          phone,
          accountType,
          plan: accountType === 'member' ? plan : undefined,
        })
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === 'login'
            ? 'فشل تسجيل الدخول. تحقّقي من البريد وكلمة المرور.'
            : 'تعذر إنشاء الحساب. حاولي مرة أخرى.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell tagline="ادخلي لوحة تحكمكِ أو أنشئي حساباً للانضمام إلى مجتمع رائدة.">
      <form onSubmit={(e) => void handleSubmit(e)} className="mx-auto w-full max-w-md space-y-5">
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
            {mode === 'login' ? 'مرحباً بعودتكِ' : 'انضمي إلى رائدة'}
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
            {mode === 'login'
              ? 'أدخلي بياناتكِ للوصول إلى فرصكِ وملفكِ ولوحة التحكم.'
              : 'ابدئي بحساب زائرة مجاني، أو قدّمي على عضوية مهنية بموافقة الإدارة.'}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={springs.snappy}
            className="space-y-4"
          >
            {mode === 'register' && (
              <>
                <AuthField label="الاسم الكامل" htmlFor="auth-name">
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted/70" />
                    <input
                      id="auth-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      autoComplete="name"
                      placeholder="مثال: سارة بن عمر"
                      className={`${authInputClass} pr-10`}
                    />
                  </div>
                </AuthField>

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
                        زائرة
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
                        عضوة
                      </span>
                      <span
                        className={`mt-1.5 block text-[11px] leading-relaxed ${
                          accountType === 'member' ? 'text-white/65' : 'text-muted'
                        }`}
                      >
                        خطة مدفوعة — تحتاج موافقة الإدارة
                      </span>
                    </button>
                  </div>
                </div>

                {accountType === 'member' && (
                  <AuthField label="خطة العضوية" htmlFor="auth-plan">
                    <select
                      id="auth-plan"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className={authInputClass}
                    >
                      {(plans ?? []).map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.nameAr} — {item.launchPrice || item.price} دج
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-[12px] text-muted">
                      تعرّفي على المزايا من{' '}
                      <Link to="/membership" className="font-semibold text-rose hover:underline">
                        صفحة العضوية
                      </Link>
                      .
                    </p>
                  </AuthField>
                )}
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
              نسيتِ كلمة المرور أو رابط التأكيد؟
            </Link>
          </div>
        )}

        {import.meta.env.DEV && hint && (
          <AuthAlert tone="info">تجريبي: {hint}</AuthAlert>
        )}

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
          {submitting
            ? mode === 'login'
              ? 'جاري الدخول...'
              : 'جاري إنشاء الحساب...'
            : mode === 'login'
              ? 'دخول إلى لوحة التحكم'
              : 'إنشاء الحساب'}
          {!submitting && <ChevronLeft className="h-4 w-4 opacity-70" />}
        </Button>

        <p className="text-center text-[12px] text-muted leading-relaxed">
          {mode === 'login' ? (
            <>
              ليس لديكِ حساب؟{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-semibold text-navy hover:text-rose transition-colors"
              >
                أنشئي حساباً
              </button>
            </>
          ) : (
            <>
              لديكِ حساب مسبقاً؟{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-semibold text-navy hover:text-rose transition-colors"
              >
                سجّلي الدخول
              </button>
            </>
          )}
        </p>
      </form>
    </AuthShell>
  )
}
