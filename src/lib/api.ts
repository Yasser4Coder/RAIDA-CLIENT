import type { ApiError, ApiSuccess } from '../types/api'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')
const TOKEN_KEY = 'raida_access_token'

export class ApiClientError extends Error {
  status: number
  code?: string
  errors?: ApiError['errors']

  constructor(message: string, status: number, code?: string, errors?: ApiError['errors']) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
    this.errors = errors
  }
}

export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string | null) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

/** Origin used for `/uploads/...` assets when API is on another host. */
export function getApiOrigin(): string {
  try {
    const url = new URL(API_BASE, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
    return url.origin
  } catch {
    return typeof window !== 'undefined' ? window.location.origin : ''
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  query?: Record<string, string | number | boolean | undefined | null>
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${API_BASE}${normalizedPath}`, window.location.origin)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }
  // Keep absolute URLs when VITE_API_BASE_URL is a full backend URL (production).
  // Relative bases (e.g. /api/v1) stay same-origin for the Vite/dev proxy.
  return url.href
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.auth !== false) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method || (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiError | null

  if (!response.ok || !payload || payload.success === false) {
    const err = payload && 'success' in payload && payload.success === false ? payload : null
    throw new ApiClientError(
      err?.message || `Request failed (${response.status})`,
      response.status,
      err?.code,
      err?.errors,
    )
  }

  return payload.data
}

export async function apiUpload<T>(path: string, file: File, fieldName = 'image'): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const body = new FormData()
  body.append(fieldName, file)

  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers,
    credentials: 'include',
    body,
  })

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiError | null
  if (!response.ok || !payload || payload.success === false) {
    const err = payload && 'success' in payload && payload.success === false ? payload : null
    throw new ApiClientError(
      err?.message || `Request failed (${response.status})`,
      response.status,
      err?.code,
      err?.errors,
    )
  }

  return payload.data
}

export async function apiList<T>(
  path: string,
  query?: RequestOptions['query'],
): Promise<{ data: T[]; meta?: ApiSuccess<T[]>['meta'] }> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(buildUrl(path, query), {
    method: 'GET',
    headers,
    credentials: 'include',
  })

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T[]> | ApiError | null
  if (!response.ok || !payload || payload.success === false) {
    const err = payload && 'success' in payload && payload.success === false ? payload : null
    throw new ApiClientError(
      err?.message || `Request failed (${response.status})`,
      response.status,
      err?.code,
      err?.errors,
    )
  }

  return { data: payload.data, meta: payload.meta }
}
