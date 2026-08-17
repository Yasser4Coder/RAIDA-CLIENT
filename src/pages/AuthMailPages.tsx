import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import SeoHead from '../components/seo/SeoHead'
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
    <div className="pt-28 min-h-screen bg-ivory flex items-center justify-center px-4">
      <SeoHead
        title={routeSeo.verifyEmail.title}
        description={routeSeo.verifyEmail.description}
        path={routeSeo.verifyEmail.path}
        noindex
      />
      <div className="w-full max-w-md rounded-[20px] bg-white hairline shadow-sm p-6 sm:p-8 space-y-4 text-center">
        <h1 className="text-xl font-extrabold text-navy">تأكيد البريد</h1>
        <p className="text-sm text-muted">{status === 'working' ? 'جاري التحقق...' : message}</p>
        {status === 'ok' && (
          <Button to="/dashboard" variant="gold" size="md" className="w-full">
            تسجيل الدخول
          </Button>
        )}
        {status === 'error' && (
          <Button to="/forgot-password" variant="outline" size="md" className="w-full">
            إعادة إرسال رابط التأكيد
          </Button>
        )}
      </div>
    </div>
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
    <div className="pt-28 min-h-screen bg-ivory flex items-center justify-center px-4">
      <SeoHead
        title={routeSeo.forgotPassword.title}
        description={routeSeo.forgotPassword.description}
        path={routeSeo.forgotPassword.path}
        noindex
      />
      <form
        onSubmit={(e) => void submit(e)}
        className="w-full max-w-md rounded-[20px] bg-white hairline shadow-sm p-6 sm:p-8 space-y-4"
      >
        <h1 className="text-xl font-extrabold text-navy">
          {mode === 'verify' ? 'إعادة إرسال رابط التأكيد' : 'استعادة كلمة المرور'}
        </h1>
        <p className="text-sm text-muted">
          إن وُجد حساب بهذا البريد، سنرسل رابطاً إن كان الإرسال مفعّلاً. لا نكشف إن كان البريد مسجّلاً.
        </p>
        {done ? (
          <p className="text-sm text-emerald-700">إذا كان البريد مسجّلاً، وصلكِ الرابط خلال دقائق.</p>
        ) : (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40"
              />
            </div>
            {error && <p className="text-sm text-rose">{error}</p>}
            <Button type="submit" variant="gold" size="md" className="w-full" disabled={busy}>
              {busy ? 'جاري الإرسال...' : 'إرسال الرابط'}
            </Button>
          </>
        )}
        <button
          type="button"
          className="text-[12px] text-rose font-semibold"
          onClick={() => {
            setMode(mode === 'verify' ? 'reset' : 'verify')
            setDone(false)
            setError(null)
          }}
        >
          {mode === 'verify' ? 'استعادة كلمة المرور' : 'لم يصلكِ رابط التأكيد؟'}
        </button>
        <Link to="/dashboard" className="block text-[12px] text-muted">
          العودة لتسجيل الدخول
        </Link>
      </form>
    </div>
  )
}

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
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
    <div className="pt-28 min-h-screen bg-ivory flex items-center justify-center px-4">
      <SeoHead
        title={routeSeo.resetPassword.title}
        description={routeSeo.resetPassword.description}
        path={routeSeo.resetPassword.path}
        noindex
      />
      <form
        onSubmit={(e) => void submit(e)}
        className="w-full max-w-md rounded-[20px] bg-white hairline shadow-sm p-6 sm:p-8 space-y-4"
      >
        <h1 className="text-xl font-extrabold text-navy">كلمة مرور جديدة</h1>
        {done ? (
          <>
            <p className="text-sm text-emerald-700">تم تحديث كلمة المرور. سجّلي الدخول بالحساب.</p>
            <Button to="/dashboard" variant="gold" size="md" className="w-full">
              تسجيل الدخول
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">عشرة أحرف على الأقل، مع حرف ورقم.</p>
            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5">كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                minLength={10}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-[12px] border border-separator bg-ivory text-sm focus:outline-none focus:border-rose/40"
              />
            </div>
            {error && <p className="text-sm text-rose">{error}</p>}
            <Button type="submit" variant="gold" size="md" className="w-full" disabled={busy || token.length < 20}>
              {busy ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}
