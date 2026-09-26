import { useEffect } from 'react'
import { catalogApi } from '../../lib/catalog'

const STORAGE_KEY = 'raida_vid'
const PING_KEY = 'raida_vid_ping_day'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function ensureVisitorKey() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing
    const next = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, next)
    return next
  } catch {
    return null
  }
}

/** Records one unique visitor ping per browser per day (fire-and-forget). */
export default function SiteVisitTracker() {
  useEffect(() => {
    const visitorKey = ensureVisitorKey()
    if (!visitorKey) return

    try {
      if (sessionStorage.getItem(PING_KEY) === todayKey()) return
      sessionStorage.setItem(PING_KEY, todayKey())
    } catch {
      /* continue — still attempt once this load */
    }

    void catalogApi.recordVisit(visitorKey).catch(() => {
      try {
        sessionStorage.removeItem(PING_KEY)
      } catch {
        /* ignore */
      }
    })
  }, [])

  return null
}
