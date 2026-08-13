import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import Button from '../ui/Button'
import ImageUpload from '../ui/ImageUpload'
import { ApiClientError } from '../../lib/api'

export type AdminField = {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'textarea' | 'number' | 'select' | 'toggle' | 'lines' | 'url' | 'image'
  required?: boolean
  options?: { value: string; label: string }[]
  hint?: string
}

type Values = Record<string, unknown>

function toFormValue(field: AdminField, initial?: Values) {
  const value = initial?.[field.name]
  if (field.type === 'toggle') return Boolean(value)
  if (field.type === 'lines') return Array.isArray(value) ? value.join('\n') : ''
  if (value == null) return field.type === 'number' ? '' : ''
  return String(value)
}

function parseValues(fields: AdminField[], raw: Values) {
  const out: Values = {}
  for (const field of fields) {
    const value = raw[field.name]
    if (field.type === 'toggle') {
      out[field.name] = Boolean(value)
    } else if (field.type === 'number') {
      const n = Number(value)
      if (value === '' || Number.isNaN(n)) {
        if (field.required) out[field.name] = 0
        continue
      }
      out[field.name] = n
    } else if (field.type === 'lines') {
      out[field.name] = String(value || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    } else if (field.type === 'password' && !value) {
      continue
    } else {
      const str = typeof value === 'string' ? value.trim() : value
      if (str === '' && !field.required) continue
      out[field.name] = str
    }
  }
  return out
}

const inputClass =
  'w-full h-11 px-4 rounded-[12px] border border-rose/20 bg-ivory text-sm focus:outline-none focus:border-gold'
const textareaClass =
  'w-full min-h-[96px] px-4 py-3 rounded-[12px] border border-rose/20 bg-ivory text-sm focus:outline-none focus:border-gold'

export default function AdminEditor({
  title,
  fields,
  initial,
  onClose,
  onSubmit,
}: {
  title: string
  fields: AdminField[]
  initial?: Values
  onClose: () => void
  onSubmit: (values: Values) => Promise<void>
}) {
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(fields.map((field) => [field.name, toFormValue(field, initial)])),
  )
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(parseValues(fields, values))
      onClose()
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.errors?.map((item) => item.message).join(' — ') || err.message)
      } else {
        setError(err instanceof Error ? err.message : 'تعذر الحفظ')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-navy/40" onClick={onClose} aria-label="إغلاق" />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[20px] bg-white border border-rose/10 shadow-soft p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-navy">{title}</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-blush cursor-pointer">
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        {fields.map((field) => (
          <div key={field.name}>
            {field.type === 'toggle' ? (
              <label className="flex items-center justify-between gap-3 text-sm font-semibold text-navy">
                {field.label}
                <input
                  type="checkbox"
                  checked={Boolean(values[field.name])}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.checked }))}
                  className="w-4 h-4 accent-gold"
                />
              </label>
            ) : field.type === 'image' ? (
              <ImageUpload
                label={field.label}
                value={String(values[field.name] || '') || null}
                required={field.required}
                onChange={(url) => setValues((prev) => ({ ...prev, [field.name]: url }))}
              />
            ) : (
              <>
                <label className="block text-[11px] font-semibold text-muted mb-1.5">
                  {field.label}
                  {field.required ? ' *' : ''}
                </label>
                {field.type === 'textarea' || field.type === 'lines' ? (
                  <textarea
                    required={field.required}
                    value={String(values[field.name] ?? '')}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    className={textareaClass}
                  />
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={String(values[field.name] ?? '')}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">اختر...</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === 'password' ? 'password' : field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                    required={field.required}
                    value={String(values[field.name] ?? '')}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    className={inputClass}
                  />
                )}
              </>
            )}
            {field.hint && <p className="text-[11px] text-muted mt-1">{field.hint}</p>}
          </div>
        ))}

        {error && <p className="text-sm text-rose">{error}</p>}

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" variant="gold" size="sm" disabled={submitting}>
            {submitting ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export function confirmDelete(label: string) {
  return window.confirm(`هل تريد حذف ${label}؟ لا يمكن التراجع عن هذا الإجراء.`)
}
