import { getApiOrigin } from './api'

const UPLOAD_PATH =
  /^\/uploads\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif)$/i

function normalizeUploadPath(value: string): string {
  const trimmed = value.trim()
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

function isUploadPath(value: string): boolean {
  return UPLOAD_PATH.test(normalizeUploadPath(value))
}

function uploadUrl(path: string): string {
  return `${getApiOrigin()}${normalizeUploadPath(path)}`
}

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

/** Resolve API upload paths and external image URLs for `<img src>`. */
export function safeImageSrc(value?: string | null, fallback = ''): string {
  if (!value) return fallback
  const trimmed = value.trim()
  if (isUploadPath(trimmed)) {
    return uploadUrl(trimmed)
  }

  const href = safeHref(trimmed)
  if (href) {
    try {
      const url = new URL(href)
      if (isUploadPath(url.pathname)) {
        return uploadUrl(url.pathname)
      }
      return href
    } catch {
      return fallback
    }
  }

  return fallback
}

export const resolveMediaUrl = safeImageSrc
