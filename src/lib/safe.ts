import { getApiOrigin } from './api'

const UPLOAD_PATH =
  /^\/uploads\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif)$/i

export function safeHref(value?: string | null): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 500) return undefined
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined
    if (url.username || url.password) return undefined
    return url.href
  } catch {
    return undefined
  }
}

export function safeImageSrc(value?: string | null, fallback = ''): string {
  if (!value) return fallback
  const trimmed = value.trim()
  if (UPLOAD_PATH.test(trimmed)) {
    // In production the API (and uploads) live on another host — prefix the API origin.
    return `${getApiOrigin()}${trimmed}`
  }
  return safeHref(trimmed) || fallback
}
