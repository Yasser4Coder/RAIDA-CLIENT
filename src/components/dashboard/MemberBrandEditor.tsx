import { useEffect, useState, type ReactNode } from 'react'
import { Building2, Eye, ImagePlus, Plus, Trash2, Upload } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import SafeImg from '../ui/SafeImg'
import { meApi, uploadApi } from '../../lib/catalog'
import { asArray } from '../../lib/normalize'
import type { Brand } from '../../types/api'

const brandFallback =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop'
const coverFallback =
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop'

type Draft = {
  name: string
  category: string
  description: string
  story: string
  logo: string | null
  cover: string | null
  products: string[]
  services: string[]
  news: string[]
}

function draftFrom(brand: Brand | null): Draft {
  return {
    name: brand?.name ?? '',
    category: brand?.category ?? '',
    description: brand?.description ?? '',
    story: brand?.story ?? '',
    logo: brand?.logo ?? null,
    cover: brand?.cover ?? null,
    products: asArray<string>(brand?.products),
    services: asArray<string>(brand?.services),
    news: asArray<string>(brand?.news),
  }
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-navy">{label}</span>
      {hint ? <span className="block text-[11px] text-muted leading-relaxed">{hint}</span> : null}
      {children}
    </label>
  )
}

function TagList({
  items,
  onAdd,
  onRemove,
  placeholder,
  tone = 'rose',
}: {
  items: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
  placeholder: string
  tone?: 'rose' | 'gold' | 'mauve'
}) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const value = draft.trim()
    if (!value || items.includes(value)) return
    onAdd(value)
    setDraft('')
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1 text-[12px] font-medium text-navy ring-1 ring-navy/8"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-muted hover:text-rose pressable-soft"
              aria-label={`حذف ${item}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <p className="text-[12px] text-muted py-1">لا عناصر بعد — أضيفي من الحقل أدناه.</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
          className="flex-1 h-10 px-3 rounded-[12px] border border-separator bg-ivory text-sm outline-none focus:border-gold/50"
        />
        <Button type="button" variant={tone === 'gold' ? 'gold' : 'soft'} size="sm" onClick={add}>
          <Plus className="w-4 h-4" />
          إضافة
        </Button>
      </div>
    </div>
  )
}

export default function MemberBrandEditor({
  brand,
  onSaved,
}: {
  brand: Brand | null
  onSaved: () => Promise<void>
}) {
  const [draft, setDraft] = useState(() => draftFrom(brand))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'logo' | 'cover' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    setDraft(draftFrom(brand))
    setError(null)
    setOk(false)
  }, [brand])

  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setOk(false)
  }

  const upload = async (kind: 'logo' | 'cover', file: File) => {
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
    const name = draft.name.trim()
    const category = draft.category.trim()
    const description = draft.description.trim()
    if (name.length < 2) {
      setError('اسم العلامة مطلوب (حرفان على الأقل)')
      return
    }
    if (category.length < 2) {
      setError('التصنيف مطلوب')
      return
    }
    if (description.length < 10) {
      setError('الوصف يجب أن يكون 10 أحرف على الأقل')
      return
    }

    setSaving(true)
    setError(null)
    setOk(false)
    try {
      const payload = {
        name,
        category,
        description,
        story: draft.story.trim() || null,
        logo: draft.logo,
        cover: draft.cover,
        products: draft.products,
        services: draft.services,
        news: draft.news,
      }
      if (brand?.id) {
        await meApi.updateBrand(brand.id, payload)
      } else {
        await meApi.createBrand(payload)
      }
      await onSaved()
      setOk(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر حفظ العلامة')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2">
            <Badge variant="gold">علامة واحدة فقط</Badge>
            <span className="text-[12px] font-semibold text-muted">عضوية رائدة للأعمال</span>
          </div>
          <h3 className="mt-2 text-xl font-extrabold text-navy tracking-[-0.02em]">
            {brand ? 'تحرير علامتكِ التجارية' : 'إعداد علامتكِ التجارية'}
          </h3>
          <p className="mt-1.5 text-[13px] text-muted leading-relaxed max-w-xl">
            إلى جانب ملفكِ الشخصي، يمكنكِ إنشاء صفحة علامة تجارية واحدة تظهر في دليل العلامات — الاسم،
            القصة، المنتجات، والخدمات.
          </p>
        </div>
        {brand?.id ? (
          <Button to={`/brands/${brand.id}`} variant="outline" size="sm" className="!rounded-full shrink-0">
            <Eye className="w-4 h-4" />
            عرض الصفحة العامة
          </Button>
        ) : null}
      </div>

      <div className="rounded-[22px] bg-white hairline shadow-xs overflow-hidden">
        <div className="relative aspect-[21/9] bg-navy/5">
          <SafeImg
            src={draft.cover}
            fallback={coverFallback}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <label className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-navy shadow-sm cursor-pointer pressable-soft">
            <ImagePlus className="w-3.5 h-3.5" />
            {uploading === 'cover' ? 'جاري الرفع…' : 'تغيير الغلاف'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={Boolean(uploading)}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void upload('cover', file)
                e.target.value = ''
              }}
            />
          </label>
        </div>

        <div className="px-5 sm:px-7 pb-7 -mt-10 relative space-y-5">
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <SafeImg
                src={draft.logo}
                fallback={brandFallback}
                alt=""
                className="w-[88px] h-[88px] rounded-[22px] object-cover ring-4 ring-white shadow-sm bg-white"
              />
              <label className="absolute -bottom-1 -start-1 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white shadow-sm cursor-pointer pressable-soft">
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={Boolean(uploading)}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void upload('logo', file)
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
            <div className="pb-1 min-w-0">
              <p className="text-[12px] font-semibold text-muted flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                شعار العلامة
              </p>
              <p className="text-[11px] text-muted mt-0.5">
                {uploading === 'logo' ? 'جاري رفع الشعار…' : 'يظهر في الدليل وصفحة العلامة'}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="اسم العلامة">
              <input
                value={draft.name}
                onChange={(e) => setField('name', e.target.value)}
                className="w-full h-11 px-3.5 rounded-[14px] border border-separator bg-ivory text-sm outline-none focus:border-gold/50"
                placeholder="مثال: لمسة حرير"
              />
            </Field>
            <Field label="التصنيف" hint="مجال نشاط العلامة">
              <input
                value={draft.category}
                onChange={(e) => setField('category', e.target.value)}
                className="w-full h-11 px-3.5 rounded-[14px] border border-separator bg-ivory text-sm outline-none focus:border-gold/50"
                placeholder="مثال: أزياء · تجميل · أغذية"
              />
            </Field>
          </div>

          <Field label="وصف مختصر" hint="يظهر في بطاقة العلامة ودليل العلامات">
            <textarea
              value={draft.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={3}
              className="w-full px-3.5 py-3 rounded-[14px] border border-separator bg-ivory text-sm outline-none focus:border-gold/50 resize-y min-h-[88px]"
              placeholder="عرّفي بعلامتكِ بجملتين واضحتين…"
            />
          </Field>

          <Field label="قصة العلامة" hint="اختياري — تظهر في صفحة العلامة العامة">
            <textarea
              value={draft.story}
              onChange={(e) => setField('story', e.target.value)}
              rows={4}
              className="w-full px-3.5 py-3 rounded-[14px] border border-separator bg-ivory text-sm outline-none focus:border-gold/50 resize-y min-h-[110px]"
              placeholder="من أين بدأتِ، وما الذي يميز منتجكِ أو خدمتكِ…"
            />
          </Field>

          <div className="grid lg:grid-cols-2 gap-5">
            <Field label="المنتجات">
              <TagList
                items={draft.products}
                tone="gold"
                placeholder="أضيفي منتجًا"
                onAdd={(value) => setField('products', [...draft.products, value])}
                onRemove={(value) =>
                  setField(
                    'products',
                    draft.products.filter((p) => p !== value),
                  )
                }
              />
            </Field>
            <Field label="الخدمات">
              <TagList
                items={draft.services}
                tone="rose"
                placeholder="أضيفي خدمة"
                onAdd={(value) => setField('services', [...draft.services, value])}
                onRemove={(value) =>
                  setField(
                    'services',
                    draft.services.filter((s) => s !== value),
                  )
                }
              />
            </Field>
          </div>

          <Field label="أخبار وتحديثات" hint="اختياري — نقاط قصيرة تظهر في صفحة العلامة">
            <TagList
              items={draft.news}
              tone="mauve"
              placeholder="أضيفي خبرًا أو تحديثًا"
              onAdd={(value) => setField('news', [...draft.news, value])}
              onRemove={(value) =>
                setField(
                  'news',
                  draft.news.filter((n) => n !== value),
                )
              }
            />
          </Field>

          {error && <p className="text-sm text-rose">{error}</p>}
          {ok && <p className="text-sm text-emerald-700 font-medium">تم حفظ العلامة بنجاح</p>}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="gold" size="md" onClick={() => void save()} disabled={saving || Boolean(uploading)}>
              {saving ? 'جاري الحفظ…' : brand ? 'حفظ التعديلات' : 'إنشاء العلامة'}
            </Button>
            {!brand && (
              <p className="text-[12px] text-muted self-center">
                بعد الإنشاء لن تتمكني من إضافة علامة ثانية — يمكنكِ التعديل فقط.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
