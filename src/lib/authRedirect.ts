import { canAccessAdminPanel } from './plans'

export type AuthFlash = {
  kind: 'login' | 'register'
  name?: string
  role?: string
  membershipStatus?: string
}

const FLASH_KEY = 'raida_auth_flash'

/** Where to send the user right after a successful login/register. */
export function postAuthPath(role?: string | null) {
  if (canAccessAdminPanel(role)) return '/admin'
  return '/dashboard'
}

export function setAuthFlash(flash: AuthFlash) {
  try {
    sessionStorage.setItem(FLASH_KEY, JSON.stringify(flash))
  } catch {
    /* ignore private mode */
  }
}

export function consumeAuthFlash(): AuthFlash | null {
  try {
    const raw = sessionStorage.getItem(FLASH_KEY)
    if (!raw) return null
    sessionStorage.removeItem(FLASH_KEY)
    return JSON.parse(raw) as AuthFlash
  } catch {
    return null
  }
}

export function authFlashMessage(flash: AuthFlash): { title: string; body: string } {
  const first = flash.name?.trim().split(/\s+/)[0]
  const hello = first ? `مرحباً ${first}` : 'مرحباً بك'

  if (flash.kind === 'register') {
    if (flash.membershipStatus === 'pending') {
      return {
        title: `${hello} — تم إنشاء حسابك`,
        body: 'طلب العضوية قيد المراجعة. يمكنك استكشاف المنصة، وسنُعلمك عند الموافقة.',
      }
    }
    return {
      title: `${hello} — أهلاً بك في رائدة`,
      body: 'تم إنشاء حسابك بنجاح. ابدأ من لوحة التحكم لاستكشاف الفرص والاستشارات.',
    }
  }

  if (canAccessAdminPanel(flash.role)) {
    return {
      title: `${hello} — تم تسجيل الدخول`,
      body: 'تم توجيهك إلى لوحة الإدارة.',
    }
  }

  return {
    title: `${hello} — تم تسجيل الدخول`,
    body: 'عدت إلى لوحة التحكم. يمكنك متابعة ملفك وطلباتك من هنا.',
  }
}

export function displayNameFromAuth(profileName?: string | null, email?: string | null) {
  const name = profileName?.trim()
  if (name) return name
  if (email) return email.split('@')[0] || email
  return 'حسابي'
}

export function initialsFrom(nameOrEmail?: string | null) {
  const raw = (nameOrEmail || '').trim()
  if (!raw) return 'ر'
  const parts = raw.includes('@')
    ? [raw[0]]
    : raw.split(/\s+/).filter(Boolean).slice(0, 2)
  return parts.map((p) => p[0]).join('').slice(0, 2) || 'ر'
}
