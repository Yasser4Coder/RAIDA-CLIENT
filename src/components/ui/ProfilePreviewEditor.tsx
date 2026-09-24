import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import {
  Camera,
  Check,
  Eye,
  Globe,
  MapPin,
  Pencil,
  Briefcase,
  X,
} from 'lucide-react'
import Badge from './Badge'
import Button from './Button'
import SafeImg from './SafeImg'
import { InstagramIcon, LinkedinIcon } from './SocialIcons'
import { meApi, uploadApi } from '../../lib/catalog'
import { asArray } from '../../lib/normalize'
import type { Member } from '../../types/api'

const imageFallback =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
const coverFallback =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop'

type Draft = {
  name: string
  title: string
  specialty: string
  city: string
  website: string
  instagram: string
  linkedin: string
  bio: string
  image: string
  cover: string
}

export type ProfilePersistPayload = {
  name: string
  title: string
  specialty: string
  city: string
  website: string | null
  bio: string | null
  image: string | null
  cover: string | null
  social: { instagram: string; linkedin: string }
}

function draftFrom(member: Member): Draft {
  return {
    name: member.name || '',
    title: member.title || '',
    specialty: member.specialty || '',
    city: member.city || '',
    website: member.website || '',
    instagram: member.social?.instagram || '',
    linkedin: member.social?.linkedin || '',
    bio: member.bio || '',
    image: member.image || '',
    cover: member.cover || '',
  }
}

function isDirty(a: Draft, b: Draft) {
  return (Object.keys(a) as (keyof Draft)[]).some((k) => a[k] !== b[k])
}

function toPersistPayload(draft: Draft, member: Member): ProfilePersistPayload {
  return {
    name: draft.name.trim(),
    title: draft.title.trim(),
    specialty: draft.specialty.trim(),
    city: draft.city.trim(),
    website: draft.website.trim() || null,
    bio: draft.bio.trim() || null,
    image: draft.image || null,
    cover: draft.cover || null,
    social: {
      ...member.social,
      instagram: draft.instagram.trim(),
      linkedin: draft.linkedin.trim(),
    },
  }
}

function InlineText({
  value,
  placeholder,
  editing,
  onStart,
  onChange,
  onDone,
  className = '',
  inputClassName = '',
  multiline = false,
  rows = 3,
}: {
  value: string
  placeholder: string
  editing: boolean
  onStart: () => void
  onChange: (v: string) => void
  onDone: () => void
  className?: string
  inputClassName?: string
  multiline?: boolean
  rows?: number
}) {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!editing || !ref.current) return
    ref.current.focus()
    const len = ref.current.value.length
    ref.current.setSelectionRange(len, len)
  }, [editing])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onDone()
    }
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      onDone()
    }
  }

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={ref as RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onDone}
          onKeyDown={onKeyDown}
          rows={rows}
          placeholder={placeholder}
          className={`w-full resize-none rounded-[12px] border border-rose/35 bg-white px-3 py-2 text-sm text-navy outline-none ring-2 ring-rose/15 ${inputClassName}`}
        />
      )
    }
    return (
      <input
        ref={ref as RefObject<HTMLInputElement>}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onDone}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full rounded-[12px] border border-rose/35 bg-white px-3 py-1.5 text-navy outline-none ring-2 ring-rose/15 ${inputClassName}`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={onStart}
      className={`group/field relative w-full text-right rounded-[10px] transition-colors hover:bg-blush/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/25 ${className}`}
    >
      <span className={value ? undefined : 'text-muted/70 italic'}>{value || placeholder}</span>
      <Pencil className="absolute top-1 left-1 w-3.5 h-3.5 text-muted opacity-0 group-hover/field:opacity-70 transition-opacity" />
    </button>
  )
}

function PhotoOverlay({
  label,
  uploading,
  onFile,
  className = '',
}: {
  label: string
  uploading: boolean
  onFile: (file: File) => void
  className?: string
}) {
  return (
    <label
      className={`absolute z-10 flex items-center justify-center gap-1.5 cursor-pointer bg-navy/70 text-white text-[11px] font-semibold backdrop-blur-sm hover:bg-navy/85 transition-colors ${className}`}
      title={label}
    >
      <Camera className="w-4 h-4" />
      <span className="hidden sm:inline">{uploading ? 'جاري الرفع...' : label}</span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        disabled={uploading}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) onFile(file)
        }}
      />
    </label>
  )
}

export default function ProfilePreviewEditor({
  member,
  onSaved,
  simple = false,
  onEditServices,
  onOpenSettings,
  onPersist,
  eyebrow = 'معاينة الملف العام',
  hint = 'هكذا سيظهر الملف للزوار — انقري على أي حقل أو صورة لتعديله مباشرة.',
  asideSlot,
  showPublicLink = true,
  stickyOffsetClass = 'bottom-[4.75rem] lg:bottom-6',
}: {
  member: Member
  onSaved: () => Promise<void>
  simple?: boolean
  onEditServices?: () => void
  onOpenSettings?: () => void
  onPersist?: (payload: ProfilePersistPayload) => Promise<void>
  eyebrow?: string
  hint?: string
  asideSlot?: ReactNode
  showPublicLink?: boolean
  stickyOffsetClass?: string
}) {
  const [baseline, setBaseline] = useState(() => draftFrom(member))
  const [draft, setDraft] = useState(() => draftFrom(member))
  const [editing, setEditing] = useState<keyof Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'image' | 'cover' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const next = draftFrom(member)
    setBaseline(next)
    setDraft(next)
    setEditing(null)
    setOk(false)
    setError(null)
  }, [member])

  const dirty = isDirty(draft, baseline)
  const services = asArray(member.services)
  const products = asArray(member.products)

  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setOk(false)
  }

  const reset = () => {
    setDraft(baseline)
    setEditing(null)
    setError(null)
    setOk(false)
  }

  const upload = async (kind: 'image' | 'cover', file: File) => {
    setUploading(kind)
    setError(null)
    try {
      const result = await uploadApi.image(file)
      setField(kind, result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر رفع الصورة')
    } finally {
      setUploading(null)
    }
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    setOk(false)
    try {
      const payload = toPersistPayload(draft, member)
      if (onPersist) {
        await onPersist(payload)
      } else if (simple) {
        await meApi.updateProfile({
          name: payload.name,
          city: payload.city,
          image: payload.image,
        })
      } else {
        await meApi.updateProfile(payload)
      }
      await onSaved()
      setBaseline(draft)
      setOk(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر حفظ الملف')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-0.5">
        <div>
          <p className="text-[12px] font-semibold text-muted">{eyebrow}</p>
          <p className="mt-0.5 text-[13px] text-muted leading-relaxed">{hint}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {showPublicLink && !simple && member.id && (
            <Button to={`/members/${member.id}`} variant="outline" size="sm" className="!rounded-full">
              <Eye className="w-4 h-4" />
              عرض الصفحة العامة
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[22px] bg-white hairline shadow-xs">
        <div className="relative h-40 sm:h-52 lg:h-56 overflow-hidden group/cover">
          <SafeImg
            src={draft.cover || undefined}
            fallback={coverFallback}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent pointer-events-none" />
          {!simple && (
            <PhotoOverlay
              label="تغيير الغلاف"
              uploading={uploading === 'cover'}
              onFile={(file) => void upload('cover', file)}
              className="bottom-3 left-3 rounded-full px-3 h-9 sm:opacity-0 sm:group-hover/cover:opacity-100"
            />
          )}
        </div>

        <div className="relative px-4 sm:px-6 pb-5 -mt-12 sm:-mt-14">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 group/avatar">
              <SafeImg
                src={draft.image || undefined}
                fallback={imageFallback}
                alt={draft.name}
                className="w-full h-full rounded-[20px] object-cover border-4 border-white shadow-elevated ring-2 ring-rose/25"
              />
              <PhotoOverlay
                label="الصورة"
                uploading={uploading === 'image'}
                onFile={(file) => void upload('image', file)}
                className="inset-0 rounded-[16px] opacity-0 group-hover/avatar:opacity-100"
              />
            </div>

            <div className="flex-1 min-w-0 pt-2 sm:pt-14 space-y-1">
              <InlineText
                value={draft.name}
                placeholder="الاسم الكامل"
                editing={editing === 'name'}
                onStart={() => setEditing('name')}
                onChange={(v) => setField('name', v)}
                onDone={() => setEditing(null)}
                className="px-1.5 py-0.5 text-2xl sm:text-3xl font-extrabold text-navy tracking-[-0.02em]"
                inputClassName="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em]"
              />
              {!simple && (
                <InlineText
                  value={draft.title}
                  placeholder="الصفة المهنية (مثال: مؤسسة مشروع)"
                  editing={editing === 'title'}
                  onStart={() => setEditing('title')}
                  onChange={(v) => setField('title', v)}
                  onDone={() => setEditing(null)}
                  className="px-1.5 py-0.5 text-[15px] text-muted"
                  inputClassName="text-[15px]"
                />
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {!simple && (
                  <>
                    {editing === 'specialty' ? (
                      <div className="min-w-[160px]">
                        <InlineText
                          value={draft.specialty}
                          placeholder="التخصص"
                          editing
                          onStart={() => {}}
                          onChange={(v) => setField('specialty', v)}
                          onDone={() => setEditing(null)}
                          inputClassName="text-sm"
                        />
                      </div>
                    ) : (
                      <button type="button" onClick={() => setEditing('specialty')} className="pressable-soft">
                        <Badge variant="rose">{draft.specialty || 'أضيفي التخصص'}</Badge>
                      </button>
                    )}
                    {member.category && <Badge variant="gold">{member.category}</Badge>}
                  </>
                )}
                <div className="flex items-center gap-1 text-sm text-muted">
                  <MapPin className="w-3.5 h-3.5 text-rose shrink-0" />
                  <InlineText
                    value={draft.city}
                    placeholder="المدينة"
                    editing={editing === 'city'}
                    onStart={() => setEditing('city')}
                    onChange={(v) => setField('city', v)}
                    onDone={() => setEditing(null)}
                    className="px-1 py-0.5"
                    inputClassName="text-sm h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 px-4 sm:px-6 pb-6 border-t border-separator/70 pt-5">
          <div className="lg:col-span-2 space-y-4">
            <section className="rounded-[16px] bg-[#F7F3EE] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-navy">نبذة تعريفية</h3>
                {editing !== 'bio' && !simple && (
                  <button
                    type="button"
                    onClick={() => setEditing('bio')}
                    className="text-[12px] font-semibold text-rose pressable-soft inline-flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    تعديل
                  </button>
                )}
              </div>
              {simple ? (
                <p className="text-sm text-muted leading-relaxed">
                  النبذة والخدمات متاحة بعد الترقية للعضوية المهنية.
                </p>
              ) : (
                <InlineText
                  value={draft.bio}
                  placeholder="اكتبي نبذة قصيرة عنكِ ومشروعكِ..."
                  editing={editing === 'bio'}
                  onStart={() => setEditing('bio')}
                  onChange={(v) => setField('bio', v)}
                  onDone={() => setEditing(null)}
                  multiline
                  rows={5}
                  className="px-2 py-1.5 text-muted leading-relaxed text-[14px] min-h-[5rem]"
                />
              )}
            </section>

            {!simple && (
              <section className="rounded-[16px] bg-[#F7F3EE] p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-navy inline-flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-rose" />
                    الخدمات
                  </h3>
                  {onEditServices && (
                    <button
                      type="button"
                      onClick={onEditServices}
                      className="text-[12px] font-semibold text-rose pressable-soft"
                    >
                      إدارة الخدمات
                    </button>
                  )}
                </div>
                {services.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <Badge key={s} variant="soft">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">لم تُضف خدمات بعد.</p>
                )}
                {products.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-navy/5">
                    <p className="text-[12px] font-semibold text-muted mb-2">المنتجات والعروض</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {products.map((p) => (
                        <div
                          key={p}
                          className="rounded-[12px] bg-white/80 px-3 py-2.5 text-[13px] font-medium text-navy"
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className="space-y-4">
            {!simple && (
              <section className="rounded-[16px] bg-[#F7F3EE] p-4 sm:p-5 space-y-3">
                <h3 className="font-bold text-navy">روابط التواصل</h3>
                <label className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-rose shrink-0" />
                  <input
                    value={draft.website}
                    onChange={(e) => setField('website', e.target.value)}
                    onFocus={() => setEditing('website')}
                    onBlur={() => setEditing(null)}
                    placeholder="الموقع الإلكتروني"
                    className="flex-1 h-9 px-2.5 rounded-[10px] bg-white border border-transparent focus:border-rose/35 focus:ring-2 focus:ring-rose/15 text-[13px] outline-none"
                    dir="ltr"
                  />
                </label>
                <label className="flex items-center gap-2.5">
                  <LinkedinIcon className="w-4 h-4 text-rose shrink-0" />
                  <input
                    value={draft.linkedin}
                    onChange={(e) => setField('linkedin', e.target.value)}
                    onFocus={() => setEditing('linkedin')}
                    onBlur={() => setEditing(null)}
                    placeholder="رابط LinkedIn"
                    className="flex-1 h-9 px-2.5 rounded-[10px] bg-white border border-transparent focus:border-rose/35 focus:ring-2 focus:ring-rose/15 text-[13px] outline-none"
                    dir="ltr"
                  />
                </label>
                <label className="flex items-center gap-2.5">
                  <InstagramIcon className="w-4 h-4 text-rose shrink-0" />
                  <input
                    value={draft.instagram}
                    onChange={(e) => setField('instagram', e.target.value)}
                    onFocus={() => setEditing('instagram')}
                    onBlur={() => setEditing(null)}
                    placeholder="رابط Instagram"
                    className="flex-1 h-9 px-2.5 rounded-[10px] bg-white border border-transparent focus:border-rose/35 focus:ring-2 focus:ring-rose/15 text-[13px] outline-none"
                    dir="ltr"
                  />
                </label>
              </section>
            )}

            {asideSlot}

            {!asideSlot && (
              <section className="rounded-[16px] bg-[#0A1328] p-4 sm:p-5 text-white">
                <p className="text-[12px] font-semibold text-white/45">حالة الظهور</p>
                <p className="mt-1 text-[15px] font-bold">
                  {simple
                    ? 'حساب زائر — غير ظاهر في الدليل'
                    : member.isPublic === false
                      ? 'ملف خاص — مخفي عن الدليل'
                      : 'ظاهر في دليل الأعضاء'}
                </p>
                {!simple && onOpenSettings && (
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="mt-3 inline-flex text-[12px] font-semibold text-gold pressable-soft"
                  >
                    يمكن تغيير الظهور من الإعدادات
                  </button>
                )}
              </section>
            )}
          </aside>
        </div>
      </div>

      {error && <p className="text-sm text-rose px-1">{error}</p>}

      <div
        className={`fixed z-40 left-3 right-3 sm:left-auto sm:right-8 transition-all ${stickyOffsetClass} ${
          dirty || ok ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-xl lg:max-w-md flex items-center gap-2 rounded-[16px] bg-navy text-white p-2.5 shadow-xl ring-1 ring-white/10">
          <div className="flex-1 min-w-0 px-2">
            <p className="text-[13px] font-semibold truncate">
              {ok ? 'تم حفظ التغييرات' : 'لديك تغييرات غير محفوظة'}
            </p>
            <p className="text-[11px] text-white/50 truncate">
              {ok ? 'الملف العام محدّث' : 'احفظي لعرضها للزوار'}
            </p>
          </div>
          {ok ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
              <Check className="w-4 h-4" />
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={reset}
                disabled={saving}
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center pressable"
                aria-label="إلغاء"
              >
                <X className="w-4 h-4" />
              </button>
              <Button
                variant="gold"
                size="sm"
                className="!rounded-full shrink-0"
                disabled={saving || !draft.name.trim()}
                onClick={() => void save()}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
