export function LoadingBlock({ label = 'جاري التحميل...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-muted">
      <div className="flex items-center gap-3 rounded-[16px] bg-white px-5 py-3 hairline shadow-xs">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose border-t-transparent" />
        {label}
      </div>
    </div>
  )
}

export function ErrorBlock({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4">
      <p className="text-sm text-muted max-w-md">{message}</p>
      <p className="text-xs text-muted/80">تأكدي أن خادم RAIDA يعمل على المنفذ 5000 وقاعدة البيانات جاهزة.</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white pressable-soft"
        >
          إعادة المحاولة
        </button>
      ) : null}
    </div>
  )
}
