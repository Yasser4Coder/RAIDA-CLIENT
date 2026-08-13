import { useState, type ChangeEvent } from 'react'
import { ImagePlus } from 'lucide-react'
import { uploadApi } from '../../lib/catalog'
import { safeImageSrc } from '../../lib/safe'

export default function ImageUpload({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value?: string | null
  onChange: (url: string) => void
  required?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const result = await uploadApi.image(file)
      onChange(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <p className="block text-[11px] font-semibold text-muted mb-1.5">
        {label}
        {required ? ' *' : ''}
      </p>
      <label className="flex items-center gap-3 p-3 rounded-[14px] border border-dashed border-separator bg-ivory cursor-pointer hover:border-rose/40 pressable-soft">
        {value ? (
          <img src={safeImageSrc(value) || undefined} alt="" className="w-14 h-14 rounded-[10px] object-cover shrink-0" />
        ) : (
          <span className="w-14 h-14 rounded-[10px] bg-white hairline flex items-center justify-center shrink-0">
            <ImagePlus className="w-5 h-5 text-muted" />
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-[13px] font-semibold text-navy">
            {uploading ? 'جاري الرفع...' : value ? 'تغيير الصورة' : 'ارفع صورة'}
          </span>
          <span className="block text-[11px] text-muted mt-0.5">JPEG أو PNG أو WebP — حتى 5MB</span>
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          required={required && !value}
          disabled={uploading}
          onChange={(e) => void handleChange(e)}
        />
      </label>
      {error && <p className="text-sm text-rose mt-1">{error}</p>}
    </div>
  )
}
