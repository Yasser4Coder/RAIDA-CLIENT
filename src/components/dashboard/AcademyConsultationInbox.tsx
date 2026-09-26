import { useMemo, useState, type ReactNode } from 'react'
import {
  Archive,
  CheckCircle2,
  Clock3,
  Inbox,
  Mail,
  Phone,
  Sparkles,
  UserRound,
  Video,
  MapPin,
  CalendarDays,
} from 'lucide-react'
import { meApi } from '../../lib/catalog'
import type { Consultation } from '../../types/api'

export type ConsultationStatus = Consultation['status']

const STATUS_FLOW: {
  id: ConsultationStatus
  label: string
  short: string
  hint: string
  nextLabel?: string
  icon: typeof Inbox
  tone: string
}[] = [
  {
    id: 'new',
    label: 'جديدة',
    short: 'جديدة',
    hint: 'طلب بانتظاركِ',
    nextLabel: 'بدء المتابعة',
    icon: Sparkles,
    tone: 'bg-rose/10 text-rose border-rose/20',
  },
  {
    id: 'read',
    label: 'قيد المتابعة',
    short: 'متابعة',
    hint: 'جارٍ التواصل أو التحضير',
    nextLabel: 'إتمام الطلب',
    icon: Clock3,
    tone: 'bg-gold/12 text-gold-dark border-gold/25',
  },
  {
    id: 'done',
    label: 'مكتملة',
    short: 'مكتملة',
    hint: 'انتهت المعالجة',
    icon: CheckCircle2,
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'archived',
    label: 'مؤرشفة',
    short: 'أرشيف',
    hint: 'محفوظة للمراجعة',
    icon: Archive,
    tone: 'bg-navy/5 text-navy/70 border-navy/10',
  },
]

const NEXT_STATUS: Partial<Record<ConsultationStatus, ConsultationStatus>> = {
  new: 'read',
  read: 'done',
}

type FilterId = 'all' | ConsultationStatus

type Props = {
  items: Consultation[]
  onChanged: () => void
  /** Academy or expert receive-inbox copy */
  variant?: 'academy' | 'expert'
}

function EmptyHint({ children }: { children: ReactNode }) {
  return <p className="p-10 text-center text-sm text-muted leading-relaxed">{children}</p>
}

function formatPreferredAt(value: string) {
  try {
    return new Intl.DateTimeFormat('ar-DZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return new Date(value).toLocaleString('ar-DZ')
  }
}

function statusMeta(status: ConsultationStatus) {
  return STATUS_FLOW.find((s) => s.id === status) || STATUS_FLOW[0]
}

export default function AcademyConsultationInbox({
  items,
  onChanged,
  variant = 'academy',
}: Props) {
  const [filter, setFilter] = useState<FilterId>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isExpert = variant === 'expert'

  const received = useMemo(
    () => items.filter((item) => item.direction !== 'sent'),
    [items],
  )

  const counts = useMemo(() => {
    const base: Record<FilterId, number> = {
      all: received.length,
      new: 0,
      read: 0,
      done: 0,
      archived: 0,
    }
    for (const item of received) base[item.status] += 1
    return base
  }, [received])

  const visible = useMemo(() => {
    if (filter === 'all') return received
    return received.filter((item) => item.status === filter)
  }, [received, filter])

  const setStatus = async (id: string, status: ConsultationStatus) => {
    setBusyId(id)
    setError(null)
    try {
      await meApi.updateConsultationStatus(id, status)
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحديث الحالة')
    } finally {
      setBusyId(null)
    }
  }

  const filters: { id: FilterId; label: string }[] = [
    { id: 'all', label: 'الكل' },
    ...STATUS_FLOW.map((s) => ({ id: s.id, label: s.short })),
  ]

  return (
    <div className="space-y-4" dir="rtl">
      <header className="rounded-2xl bg-white hairline shadow-sm p-5">
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isExpert ? 'bg-gold/15 text-gold-dark' : 'bg-rose-soft text-rose'
            }`}
          >
            <Inbox className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-muted mb-0.5">
              {isExpert ? 'عضوية رائدة للمدربين والخبراء' : 'عضوية رائدة للأكاديميات ومراكز التدريب'}
            </p>
            <h3 className="text-[17px] font-extrabold text-navy tracking-tight">
              {isExpert ? 'وارد استشارات العملاء' : 'وارد طلبات الاستشارة'}
            </h3>
            <p className="text-[13px] text-muted mt-1 leading-relaxed">
              {isExpert
                ? 'طلبات الاستشارة الفردية تصل هنا من ملفكِ العام. راجعي الطلب → ابدئي المتابعة → أتمّيه عند الانتهاء.'
                : 'راجعي الطلب → ابدئي المتابعة → أتمّيه عند الانتهاء. الأرشفة للحفظ الجانبي.'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {filters.map((tab) => {
            const active = filter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-bold transition-colors ${
                  active ? 'bg-navy text-white' : 'bg-[#F4F1EC] text-navy/65 hover:bg-navy/8'
                }`}
              >
                {tab.label}
                <span
                  className={`min-w-5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                    active ? 'bg-white/20 text-white' : 'bg-white text-muted'
                  }`}
                >
                  {counts[tab.id]}
                </span>
              </button>
            )
          })}
        </div>
      </header>

      {error && (
        <p className="rounded-2xl bg-rose-soft/70 px-4 py-3 text-sm text-rose font-medium">{error}</p>
      )}

      <div className="space-y-3">
        {visible.map((item) => {
          const busy = busyId === item.id
          const current = statusMeta(item.status)
          const nextId = NEXT_STATUS[item.status]
          const next = nextId ? statusMeta(nextId) : null
          const modeLabel =
            item.mode === 'online' ? 'عن بُعد' : item.mode === 'in_person' ? 'حضوري' : null
          const ModeIcon = item.mode === 'in_person' ? MapPin : Video

          return (
            <article
              key={item.id}
              className={`rounded-2xl bg-white hairline shadow-sm overflow-hidden transition-shadow ${
                item.status === 'new' ? 'ring-1 ring-rose/25' : ''
              }`}
            >
              {/* Top strip: status + type */}
              <div
                className={`flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 border-b border-separator/70 ${
                  item.status === 'new' ? 'bg-rose-soft/50' : 'bg-[#FAF8F5]'
                }`}
              >
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${current.tone}`}
                >
                  <current.icon className="w-3.5 h-3.5" />
                  {current.label}
                </span>
                {item.consultationType && (
                  <span className="text-[11px] font-semibold text-muted truncate">
                    {item.consultationType}
                  </span>
                )}
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {/* Who */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-navy/[0.06] text-navy flex items-center justify-center shrink-0">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-muted mb-0.5">من العميل</p>
                    <h4 className="text-[16px] font-extrabold text-navy leading-snug">
                      {item.guestName}
                    </h4>
                    {item.subject && (
                      <p className="text-[13px] text-navy/75 mt-0.5 leading-snug">{item.subject}</p>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${item.guestEmail}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F1EC] px-3 py-1.5 text-[12px] font-semibold text-navy hover:bg-navy/10 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-rose shrink-0" />
                    <span className="truncate max-w-[220px]" dir="ltr">
                      {item.guestEmail}
                    </span>
                  </a>
                  {item.guestPhone && (
                    <a
                      href={`tel:${item.guestPhone}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F1EC] px-3 py-1.5 text-[12px] font-semibold text-navy hover:bg-navy/10 transition-colors"
                      dir="ltr"
                    >
                      <Phone className="w-3.5 h-3.5 text-rose shrink-0" />
                      {item.guestPhone}
                    </a>
                  )}
                </div>

                {/* Facts */}
                <div className="grid grid-cols-2 gap-2">
                  {item.field && (
                    <div className="rounded-xl bg-[#FAF8F5] px-3 py-2.5">
                      <p className="text-[10px] font-bold text-muted mb-0.5">المجال</p>
                      <p className="text-[12px] font-semibold text-navy leading-snug">{item.field}</p>
                    </div>
                  )}
                  {modeLabel && (
                    <div className="rounded-xl bg-[#FAF8F5] px-3 py-2.5">
                      <p className="text-[10px] font-bold text-muted mb-0.5">طريقة الجلسة</p>
                      <p className="text-[12px] font-semibold text-navy inline-flex items-center gap-1">
                        <ModeIcon className="w-3.5 h-3.5 text-rose" />
                        {modeLabel}
                      </p>
                    </div>
                  )}
                  {item.preferredAt && (
                    <div className="rounded-xl bg-[#FAF8F5] px-3 py-2.5 col-span-2">
                      <p className="text-[10px] font-bold text-muted mb-0.5">الوقت المفضّل</p>
                      <p className="text-[12px] font-semibold text-navy inline-flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-rose shrink-0" />
                        {formatPreferredAt(item.preferredAt)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="rounded-xl border border-separator/80 bg-white px-3.5 py-3">
                  <p className="text-[10px] font-bold text-muted mb-1.5">رسالة العميل</p>
                  <p className="text-[13px] text-navy leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>
                </div>

                {/* Primary next step */}
                {next && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setStatus(item.id, next.id)}
                    className="w-full h-11 rounded-xl bg-navy text-white text-[13px] font-bold hover:bg-navy-light transition-colors disabled:opacity-60 active:scale-[0.99]"
                  >
                    {busy ? 'جاري التحديث...' : current.nextLabel || `نقل إلى: ${next.label}`}
                  </button>
                )}

                {/* Full status control — compact segmented */}
                <div>
                  <p className="text-[11px] font-bold text-muted mb-2">أو اختاري الحالة</p>
                  <div
                    className="flex rounded-xl bg-[#F4F1EC] p-1 gap-0.5"
                    role="group"
                    aria-label="حالة الطلب"
                  >
                    {STATUS_FLOW.map((step) => {
                      const selected = item.status === step.id
                      return (
                        <button
                          key={step.id}
                          type="button"
                          disabled={busy || selected}
                          title={step.hint}
                          onClick={() => setStatus(item.id, step.id)}
                          className={`flex-1 min-w-0 rounded-lg px-1 py-2.5 text-[11px] sm:text-[12px] font-bold transition-all disabled:cursor-default ${
                            selected
                              ? 'bg-white text-navy shadow-sm'
                              : 'text-navy/55 hover:text-navy hover:bg-white/50'
                          } ${busy && !selected ? 'opacity-50' : ''}`}
                        >
                          {step.short}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </article>
          )
        })}

        {visible.length === 0 && (
          <div className="rounded-2xl bg-white hairline shadow-sm">
            <EmptyHint>
              {received.length === 0
                ? isExpert
                  ? 'لا توجد طلبات واردة بعد. ستظهر هنا استشارات العملاء المرسلة إلى ملفكِ كخبيرة أو مدربة.'
                  : 'لا توجد طلبات واردة بعد. ستظهر هنا استشارات العملاء المرسلة إلى ملف أكاديميتكِ.'
                : 'لا توجد طلبات في هذا التصنيف.'}
            </EmptyHint>
          </div>
        )}
      </div>
    </div>
  )
}
