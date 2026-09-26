import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../lib/catalog'
import { getAccessToken } from '../lib/api'
import type { Member, UserSafe } from '../types/api'

export type RegisterResult =
  | { ok: true; user: UserSafe; profile: Member | null; requiresEmailVerification: false }
  | {
      ok: true
      user: null
      profile: null
      requiresEmailVerification: true
      email: string
    }

type AuthState = {
  user: UserSafe | null
  profile: Member | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ user: UserSafe; profile: Member | null }>
  register: (payload: {
    email: string
    password: string
    name: string
    phone: string
    accountType: 'guest' | 'member'
    plan?: string
    title?: string
    specialty?: string
    city?: string
    wilaya?: string
    category?: string
    website?: string
    bio?: string
    programs?: string[]
  }) => Promise<RegisterResult>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSafe | null>(null)
  const [profile, setProfile] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshMe = useCallback(async () => {
    if (!getAccessToken()) {
      return
    }

    const me = await authApi.me()
    setUser(me.user)
    setProfile(me.profile)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await refreshMe()
      } catch {
        if (!cancelled) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshMe])

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    setUser(result.user)
    setProfile(result.profile)
    return { user: result.user, profile: result.profile }
  }, [])

  const register = useCallback(
    async (payload: {
      email: string
      password: string
      name: string
      phone: string
      accountType: 'guest' | 'member'
      plan?: string
      title?: string
      specialty?: string
      city?: string
      wilaya?: string
      category?: string
      website?: string
      bio?: string
      programs?: string[]
    }): Promise<RegisterResult> => {
      const result = await authApi.register(payload)
      if (result.requiresEmailVerification || !result.accessToken) {
        setUser(null)
        setProfile(null)
        return {
          ok: true,
          user: null,
          profile: null,
          requiresEmailVerification: true,
          email: payload.email,
        }
      }
      setUser(result.user)
      setProfile(result.profile)
      return {
        ok: true,
        user: result.user,
        profile: result.profile,
        requiresEmailVerification: false,
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({ user, profile, loading, login, register, logout, refreshMe }),
    [user, profile, loading, login, register, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
