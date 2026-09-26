import { useState, type FormEvent } from 'react'
import Button from './Button'
import { useAuth } from '../../context/AuthContext'
import { useAsyncData } from '../../hooks/useAsyncData'
import { catalogApi, publicApi } from '../../lib/catalog'
import {
  CONSULTATION_FIELDS,
  CONSULTATION_MODES,
  CONSULTATION_TYPES,
} from '../../data/consultationFields'

export type ConsultationPayload = {
  name: string
  email: string
  phone?: string
  field: string
  consultationType: string
  mode: 'online' | 'in_person'
  preferredAt: string
  wilaya?: string
  message: string
}

type Props = {
  /** Fix target to RAIDA admin, a specific expert, or let the user choose */
  target?: 'raida' | 'expert' | 'choose'
  fixedMemberId?: string
  fixedMemberName?: string
  onSent?: () => void
  compact?: boolean
}

const fieldClass =
  'w-full h-11 px-3 rounded-[12px] border border-separator bg-ivory text-sm text-navy focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15'

export default function ConsultationRequestForm({
  target = 'choose',
  fixedMemberId,
  fixedMemberName,
  onSent,
  compact = false,
}: Props) {
  const { user, profile } = useAuth()
  const [destination, setDestination] = useState<'raida' | 'expert'>(
    target === 'expert' || fixedMemberId ? 'expert' : 'raida',
  )
  const [memberId, setMemberId] = useState(fixedMemberId || '')
  const [name, setName] = useState(profile?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [field, setField] = useState('')
  const [consultationType, setConsultationType] = useState('')
  const [mode, setMode] = useState<'online' | 'in_person'>('online')
  const [preferredAt, setPreferredAt] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const needsExpertList = target === 'choose' && destination === 'expert' && !fixedMemberId
  const { data: consultantsPayload } = useAsyncData(async () => {
    if (!needsExpertList) return { data: [] }
    const [experts, academies] = await Promise.all([
      catalogApi.members({ limit: 100, plan: 'EXPERT' }),
      catalogApi.members({ limit: 100, plan: 'ACADEMY' }),
    ])
    const seen = new Set<string>()
    const merged = [...(experts.data ?? []), ...(academies.data ?? [])].filter((m) => {
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })
    return { data: merged }
  }, [needsExpertList])
  const { data: wilayas } = useAsyncData(() => catalogApi.wilayas(), [])

  const consultants = consultantsPayload?.data ?? []

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload: ConsultationPayload = {
      name,
      email,
      phone: phone || undefined,
      field,
      consultationType,
      mode,
      preferredAt,
      wilaya: mode === 'in_person' ? wilaya || undefined : undefined,
      message,
    }

    try {
      const toExpert = target === 'expert' || (target === 'choose' && destination === 'expert')
      const expertId = fixedMemberId || memberId
      if (toExpert) {
        if (!expertId) {
          setError('اختاري الخبيرة أو الأكاديمية')
          setSubmitting(false)
          return
        }
        await publicApi.sendConsultation(expertId, payload)
      } else {
        await publicApi.sendRaidaConsultation(payload)
      }
      setDone(true)
      setMessage('')
      onSent?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إرسال الاستشارة')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-[16px] bg-navy/[0.03] ring-1 ring-navy/8 p-5 sm:p-6 text-center sm:text-right">
        <div className="mx-auto sm:mx-0 w-12 h-12 rounded-[14px] bg-gold/15 text-gold-dark flex items-center justify-center mb-3">
          <span className="text-lg font-extrabold">✓</span>
        </div>
        <p className="font-extrabold text-navy text-lg">تم استلام طلبكِ</p>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          المسار التالي: تأكيد الموعد ← الدفع عند الاقتضاء ← الجلسة. يصل الطلب إلى لوحة تحكّم الخبيرة أو
          الأكاديمية المختارة، ويظهر أيضًا في صندوقكِ إن كنتِ مسجّلة.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${compact ? '' : 'space-y-4'}`}>
      {target === 'choose' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDestination('raida')}
            className={`h-11 rounded-[12px] text-sm font-semibold border ${
              destination === 'raida' ? 'bg-navy text-white border-navy' : 'bg-ivory text-muted border-separator'
            }`}
          >
            إدارة رائدة
          </button>
          <button
            type="button"
            onClick={() => setDestination('expert')}
            className={`h-11 rounded-[12px] text-sm font-semibold border ${
              destination === 'expert' ? 'bg-navy text-white border-navy' : 'bg-ivory text-muted border-separator'
            }`}
          >
            خبيرة أو أكاديمية
          </button>
        </div>
      )}

      {(target === 'expert' || destination === 'expert') && (
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">
            الخبيرة / الأكاديمية
          </label>
          {fixedMemberId ? (
            <p className="text-sm font-medium text-navy">
              {fixedMemberName || 'خبيرة أو أكاديمية مختارة'}
            </p>
          ) : (
            <select
              required
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className={fieldClass}
            >
              <option value="">اختاري الخبيرة أو الأكاديمية</option>
              {consultants.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.plan === 'ACADEMY' ? 'أكاديمية · ' : ''}
                  {m.name}
                  {m.specialty ? ` — ${m.specialty}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {(target === 'raida' || destination === 'raida') && target !== 'expert' && (
        <p className="text-[12px] text-muted rounded-[12px] bg-rose-soft/40 px-3 py-2">
          الطلب يُرسل مباشرة إلى <span className="font-semibold text-navy">إدارة رائدة</span> لمراجعته
          وتوجيهكِ أو ربطكِ بخبيرة مناسبة.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">الاسم</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">البريد</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-muted mb-1.5">الهاتف (اختياري)</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-muted mb-1.5">المجال</label>
        <select required value={field} onChange={(e) => setField(e.target.value)} className={fieldClass}>
          <option value="">اختاري المجال</option>
          {CONSULTATION_FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-muted mb-1.5">نوع الاستشارة</label>
        <select
          required
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value)}
          className={fieldClass}
        >
          <option value="">اختاري النوع</option>
          {CONSULTATION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">Online / حضوري</label>
          <select
            required
            value={mode}
            onChange={(e) => setMode(e.target.value as 'online' | 'in_person')}
            className={fieldClass}
          >
            {CONSULTATION_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">الوقت المفضّل</label>
          <input
            required
            type="datetime-local"
            value={preferredAt}
            onChange={(e) => setPreferredAt(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      {mode === 'in_person' && (
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">الولاية</label>
          <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className={fieldClass} required>
            <option value="">اختاري الولاية</option>
            {(wilayas ?? []).map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-[11px] font-semibold text-muted mb-1.5">تفاصيل الطلب / الجلسة</label>
        <textarea
          required
          minLength={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={compact ? 3 : 4}
          placeholder="ما الذي تحتاجين استشارة حوله؟"
          className="w-full px-3 py-3 rounded-[12px] border border-separator bg-ivory text-sm resize-none focus:outline-none focus:border-rose/40"
        />
      </div>

      <p className="text-[11px] text-muted leading-relaxed">
        بعد الإرسال: تأكيد الموعد ← الدفع عند الاقتضاء ← الجلسة. عمولة رائدة تُطبَّق وفق سياسة المنصة.
      </p>

      {error && <p className="text-sm text-rose">{error}</p>}
      <Button type="submit" variant="gold" size="md" className="w-full" disabled={submitting}>
        {submitting
          ? 'جاري الإرسال...'
          : destination === 'raida' && target !== 'expert'
            ? 'إرسال إلى إدارة رائدة'
            : 'إرسال طلب الاستشارة'}
      </Button>
    </form>
  )
}
