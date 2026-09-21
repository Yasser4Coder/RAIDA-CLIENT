import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../lib/catalog'
import { getAccessToken } from '../lib/api'
import type { Member, UserSafe } from '../types/api'

type AuthState = {
  user: UserSafe | null
  profile: Member | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: {
    email: string
    password: string
    name: string
    accountType: 'guest' | 'member'
    plan?: string
  }) => Promise<void>
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
  }, [])

  const register = useCallback(
    async (payload: {
      email: string
      password: string
      name: string
      accountType: 'guest' | 'member'
      plan?: string
    }) => {
      const result = await authApi.register(payload)
      if (result.requiresEmailVerification || !result.accessToken) {
        setUser(null)
        setProfile(null)
        throw new Error('تحققِ من بريدكِ لتفعيل الحساب قبل تسجيل الدخول')
      }
      setUser(result.user)
      setProfile(result.profile)
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
