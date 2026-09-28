import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ApiListMeta } from '../../types/api'

type Props = {
  meta?: ApiListMeta | null
  page: number
  onPageChange: (page: number) => void
  className?: string
  /** e.g. مستخدمة / علامة / فعالية */
  itemLabel?: string
}

export default function AdminPagination({
  meta,
  page,
  onPageChange,
  className = '',
  itemLabel = 'عنصر',
}: Props) {
  const total = meta?.total ?? 0
  const limit = meta?.limit ?? 20
  const totalPages = Math.max(1, meta?.totalPages ?? 1)
  if (total <= limit && totalPages <= 1) return null

  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const pages = pageWindow(page, totalPages)

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3.5 border-t border-navy/[0.06] bg-ivory/50 ${className}`}
    >
      <p className="text-[12px] text-muted tabular-nums">
        عرض{' '}
        <span className="font-semibold text-navy">
          {from.toLocaleString('ar-DZ')}–{to.toLocaleString('ar-DZ')}
        </span>{' '}
        من <span className="font-semibold text-navy">{total.toLocaleString('ar-DZ')}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="الصفحة السابقة"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-white ring-1 ring-navy/10 text-navy transition-colors hover:bg-blush disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronRight className="w-4 h-4" aria-hidden />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-muted text-[12px]">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`صفحة ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] px-2.5 text-[12px] font-bold tabular-nums transition-colors ${
                p === page
                  ? 'bg-navy text-white'
                  : 'bg-white ring-1 ring-navy/10 text-navy hover:bg-blush'
              }`}
            >
              {p.toLocaleString('ar-DZ')}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="الصفحة التالية"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-white ring-1 ring-navy/10 text-navy transition-colors hover:bg-blush disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}

function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const set = new Set<number>([1, total, current, current - 1, current + 1, current - 2, current + 2])
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)

  const out: (number | '…')[] = []
  let prev = 0
  for (const n of sorted) {
    if (prev && n - prev > 1) out.push('…')
    out.push(n)
    prev = n
  }
  return out
}
