import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ChevronLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import SeoHead from '../components/seo/SeoHead'
import AuthShell, { AuthAlert, AuthField, authInputClass } from '../components/auth/AuthShell'
import { authApi } from '../lib/catalog'
import { routeSeo } from '../lib/seo'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [status, setStatus] = useState<'idle' | 'working' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('رابط التأكيد غير صالح')
      return
    }
    let cancelled = false
    setStatus('working')
    authApi
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) {
          setStatus('ok')
          setMessage('تم تأكيد بريدكِ. يمكنكِ تسجيل الدخول الآن.')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus('error')
          setMessage(err instanceof Error ? err.message : 'تعذر تأكيد البريد')
        }
      })
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <>
      <SeoHead
        title={routeSeo.verifyEmail.title}
        description={routeSeo.verifyEmail.description}
        path={routeSeo.verifyEmail.path}
        noindex
      />
      <AuthShell tagline="تأكيد بريدكِ يفعّل حسابكِ ويحمي وصولكِ إلى لوحة التحكم.">
        <div className="mx-auto w-full max-w-md space-y-5 text-center">
          <h1 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-navy">
            تأكيد البريد
          </h1>
          {status === 'working' ? (
            <AuthAlert tone="info">جاري التحقق من الرابط...</AuthAlert>
          ) : status === 'ok' ? (
            <AuthAlert tone="success">{message}</AuthAlert>
          ) : (
            <AuthAlert>{message}</AuthAlert>
          )}
          {status === 'ok' && (
            <Button to="/dashboard" variant="gold" size="lg" className="w-full">
              تسجيل الدخول
              <ChevronLeft className="h-4 w-4 opacity-70" />
            </Button>
          )}
          {status === 'error' && (
            <Button to="/forgot-password" variant="outline" size="lg" className="w-full">
              إعادة إرسال رابط التأكيد
            </Button>
          )}
        </div>
      </AuthShell>
    </>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [mode, setMode] = useState<'reset' | 'verify'>('reset')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === 'verify') {
        await authApi.resendVerification(email)
      } else {
        await authApi.forgotPassword(email)
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر الإرسال')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SeoHead
        title={routeSeo.forgotPassword.title}
        description={routeSeo.forgotPassword.description}
        path={routeSeo.forgotPassword.path}
        noindex
      />
      <AuthShell tagline="استعيدي الوصول إلى حسابكِ بأمان عبر رابط يُرسل إلى بريدكِ.">
        <form onSubmit={(e) => void submit(e)} className="mx-auto w-full max-w-md space-y-5">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-navy">
              {mode === 'verify' ? 'إعادة إرسال رابط التأكيد' : 'استعادة كلمة المرور'}
            </h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
              إن وُجد حساب بهذا البريد، سنرسل رابطاً إن كان الإرسال مفعّلاً. لا نكشف إن كان البريد مسجّلاً.
            </p>
          </div>

          {done ? (
            <AuthAlert tone="success">إذا كان البريد مسجّلاً، وصلكِ الرابط خلال دقائق.</AuthAlert>
          ) : (
            <>
              <AuthField label="البريد الإلكتروني" htmlFor="forgot-email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted/70" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="name@example.com"
                    className={`${authInputClass} pr-10`}
                  />
                </div>
              </AuthField>
              {error && <AuthAlert>{error}</AuthAlert>}
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={busy}>
                {busy ? 'جاري الإرسال...' : 'إرسال الرابط'}
              </Button>
            </>
          )}

          <div className="flex flex-col gap-2 text-center">
            <button
              type="button"
              className="text-[12px] font-semibold text-rose hover:underline underline-offset-2"
              onClick={() => {
                setMode(mode === 'verify' ? 'reset' : 'verify')
                setDone(false)
                setError(null)
              }}
            >
              {mode === 'verify' ? 'استعادة كلمة المرور' : 'لم يصلكِ رابط التأكيد؟'}
            </button>
            <Link to="/dashboard" className="text-[12px] text-muted hover:text-navy transition-colors">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </form>
      </AuthShell>
    </>
  )
}

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await authApi.resetPassword(token, password)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحديث كلمة المرور')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SeoHead
        title={routeSeo.resetPassword.title}
        description={routeSeo.resetPassword.description}
        path={routeSeo.resetPassword.path}
        noindex
      />
      <AuthShell tagline="اختاري كلمة مرور قوية لحماية حسابكِ في مجتمع رائدة.">
        <form onSubmit={(e) => void submit(e)} className="mx-auto w-full max-w-md space-y-5">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-navy">
              كلمة مرور جديدة
            </h1>
            <p className="mt-1.5 text-[14px] text-muted leading-relaxed">
              عشرة أحرف على الأقل، مع حرف ورقم.
            </p>
          </div>

          {done ? (
            <>
              <AuthAlert tone="success">تم تحديث كلمة المرور. سجّلي الدخول بالحساب.</AuthAlert>
              <Button to="/dashboard" variant="gold" size="lg" className="w-full">
                تسجيل الدخول
                <ChevronLeft className="h-4 w-4 opacity-70" />
              </Button>
            </>
          ) : (
            <>
              <AuthField label="كلمة المرور الجديدة" htmlFor="reset-password">
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted/70" />
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={10}
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
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
              </AuthField>
              {error && <AuthAlert>{error}</AuthAlert>}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={busy || token.length < 20}
              >
                {busy ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
              </Button>
            </>
          )}
        </form>
      </AuthShell>
    </>
  )
}
