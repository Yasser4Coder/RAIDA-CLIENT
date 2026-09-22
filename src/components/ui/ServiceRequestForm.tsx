import { useState, type FormEvent } from 'react'
import Button from './Button'
import { useAuth } from '../../context/AuthContext'
import { publicApi } from '../../lib/catalog'
import { serviceDomains } from '../../data/platformContent'

const fieldClass =
  'w-full h-11 px-3 rounded-[12px] border border-separator bg-ivory text-sm text-navy focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/15'

const allServices = serviceDomains.flatMap((d) =>
  d.items.map((item) => ({ domain: d.title, item })),
)

type Props = {
  presetService?: string
  onSent?: () => void
}

export default function ServiceRequestForm({ presetService = '', onSent }: Props) {
  const { user, profile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [service, setService] = useState(presetService)
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const selected = allServices.find((s) => s.item === service)
      await publicApi.sendRaidaConsultation({
        name,
        email,
        phone: phone || undefined,
        field: selected?.domain || 'خدمات المشاريع',
        consultationType: 'طلب خدمة',
        mode: 'online',
        preferredAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        message: [
          `طلب خدمة: ${service}`,
          budget ? `الميزانية التقديرية: ${budget}` : null,
          '',
          message,
        ]
          .filter((line) => line !== null)
          .join('\n'),
      })
      setDone(true)
      setMessage('')
      onSent?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إرسال الطلب')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-[16px] bg-navy/[0.03] ring-1 ring-navy/8 p-5 text-center sm:text-right">
        <p className="font-extrabold text-navy text-lg">تم استلام طلب الخدمة</p>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          ستراجع إدارة رائدة طلبكِ وتوجّهكِ إلى الخبيرة المناسبة. ستظهر المتابعة في صندوق استشاراتكِ إن
          كنتِ مسجّلة.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label className="block text-[11px] font-semibold text-muted mb-1.5">الهاتف</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
          placeholder="اختياري"
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-muted mb-1.5">الخدمة المطلوبة</label>
        <select required value={service} onChange={(e) => setService(e.target.value)} className={fieldClass}>
          <option value="">اختاري الخدمة</option>
          {serviceDomains.map((domain) => (
            <optgroup key={domain.key} label={domain.title}>
              {domain.items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-muted mb-1.5">الميزانية التقديرية</label>
        <input
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={fieldClass}
          placeholder="مثال: 30,000 – 50,000 دج"
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-muted mb-1.5">تفاصيل الاحتياج</label>
        <textarea
          required
          minLength={10}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-3 rounded-[12px] border border-separator bg-ivory text-sm resize-none focus:outline-none focus:border-rose/40"
          placeholder="ما الذي تحتاجينه بالضبط؟ الموعد المرغوب؟"
        />
      </div>
      <p className="text-[11px] text-muted leading-relaxed">
        عند إتمام الخدمة عبر المنصة، تُطبَّق عمولة رائدة وفق سياسة المنصة.
      </p>
      {error && <p className="text-sm text-rose">{error}</p>}
      <Button type="submit" variant="gold" size="md" className="w-full" disabled={submitting}>
        {submitting ? 'جاري الإرسال...' : 'أرسلي طلب الخدمة'}
      </Button>
    </form>
  )
}
