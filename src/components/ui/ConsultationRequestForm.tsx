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
  const { data: expertsPayload } = useAsyncData(
    () => (needsExpertList ? catalogApi.members({ limit: 100, plan: 'EXPERT' }) : Promise.resolve({ data: [] })),
    [needsExpertList],
  )
  const { data: wilayas } = useAsyncData(() => catalogApi.wilayas(), [])

  const experts = expertsPayload?.data ?? []

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
          setError('اختاري الخبيرة')
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
      <p className="text-sm text-navy bg-rose-soft/60 rounded-[12px] p-4">
        تم استلام طلبكِ. المسار: المجال → الخبيرة/رائدة → الوقت → Online/حضوري. ستظهر في صندوق استشاراتكِ
        إن كنتِ مسجّلة، وسيُؤكَّد الدفع والجلسة لاحقًا من الإدارة أو الخبيرة.
      </p>
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
            خبيرة رائدة
          </button>
        </div>
      )}

      {(target === 'expert' || destination === 'expert') && (
        <div>
          <label className="block text-[11px] font-semibold text-muted mb-1.5">الخبيرة</label>
          {fixedMemberId ? (
            <p className="text-sm font-medium text-navy">{fixedMemberName || 'خبيرة مختارة'}</p>
          ) : (
            <select
              required
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className={fieldClass}
            >
              <option value="">اختاري الخبيرة</option>
              {experts.map((m) => (
                <option key={m.id} value={m.id}>
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
