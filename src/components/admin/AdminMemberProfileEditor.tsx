import { useEffect, useMemo, useState } from 'react'
import { KeyRound, Trash2, X } from 'lucide-react'
import Button from '../ui/Button'
import ProfilePreviewEditor, { type ProfilePersistPayload } from '../ui/ProfilePreviewEditor'
import { confirmDelete } from './AdminEditor'
import { adminApi } from '../../lib/catalog'
import { PLAN_LABELS, ROLE_LABELS, MEMBERSHIP_STATUS_LABELS } from '../../lib/plans'
import { ApiClientError } from '../../lib/api'
import type { AdminUser, Member } from '../../types/api'

const selectClass =
  'w-full h-10 px-3 rounded-[10px] border border-navy/10 bg-white text-[13px] text-navy focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/15'

const inputClass =
  'w-full h-10 px-3 rounded-[10px] border border-navy/10 bg-white text-[13px] text-navy focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/15'

type AccountDraft = {
  phone: string
  wilaya: string
  category: string
  role: string
  plan: string
  membership_status: string
  is_active: boolean
}

function emptyMember(user: AdminUser): Member {
  return {
    id: user.profile?.id || user.id,
    name: user.profile?.name || user.email.split('@')[0] || 'عضوة',
    title: user.profile?.title || '',
    specialty: user.profile?.specialty || '',
    city: user.profile?.city || '',
    wilaya: user.profile?.wilaya || '',
    phone: user.profile?.phone || '',
    category: user.profile?.category || '',
    services: user.profile?.services || [],
    image: user.profile?.image || null,
    cover: user.profile?.cover || null,
    bio: user.profile?.bio || null,
    website: user.profile?.website || null,
    social: user.profile?.social || {},
    achievements: user.profile?.achievements || [],
    products: user.profile?.products || [],
    programs: user.profile?.programs || [],
    projects: user.profile?.projects || [],
    isPublic: user.profile?.isPublic,
  }
}

function accountFrom(user: AdminUser): AccountDraft {
  return {
    phone: user.profile?.phone || '',
    wilaya: user.profile?.wilaya || '',
    category: user.profile?.category || '',
    role: user.role,
    plan: user.plan || '',
    membership_status: user.membershipStatus || 'none',
    is_active: user.isActive !== false,
  }
}

export default function AdminMemberProfileEditor({
  user,
  financeAllowed,
  canAssignAdmin,
  onClose,
  onSaved,
  onDeleted,
}: {
  user: AdminUser
  financeAllowed: boolean
  canAssignAdmin: boolean
  onClose: () => void
  onSaved: () => void
  onDeleted?: () => void
}) {
  const [liveUser, setLiveUser] = useState(user)
  const [account, setAccount] = useState(() => accountFrom(user))
  const [accountBaseline, setAccountBaseline] = useState(() => accountFrom(user))
  const [accountError, setAccountError] = useState<string | null>(null)
  const [accountSaving, setAccountSaving] = useState(false)
  const [accountOk, setAccountOk] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordOk, setPasswordOk] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLiveUser(user)
    const next = accountFrom(user)
    setAccount(next)
    setAccountBaseline(next)
    setAccountError(null)
    setAccountOk(false)
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError(null)
    setPasswordOk(false)
  }, [user])

  const member = useMemo(() => emptyMember(liveUser), [liveUser])
  const isGuest = account.role === 'guest'
  const accountDirty = JSON.stringify(account) !== JSON.stringify(accountBaseline)

  const roleOptions = [
    { value: 'guest', label: ROLE_LABELS.guest },
    { value: 'member', label: ROLE_LABELS.member },
    ...(financeAllowed ? [{ value: 'worker', label: ROLE_LABELS.worker || 'موظفة' }] : []),
    ...(canAssignAdmin ? [{ value: 'admin', label: ROLE_LABELS.admin || 'مديرة' }] : []),
  ]

  const validatePassword = (value: string) => {
    if (value.length < 10) return 'كلمة المرور يجب أن تكون 10 أحرف على الأقل'
    if (!/\p{L}/u.test(value)) return 'كلمة المرور يجب أن تتضمن حرفاً'
    if (!/[0-9]/.test(value)) return 'كلمة المرور يجب أن تتضمن رقماً'
    return null
  }

  const savePassword = async () => {
    setPasswordError(null)
    setPasswordOk(false)
    const invalid = validatePassword(newPassword)
    if (invalid) {
      setPasswordError(invalid)
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('كلمتا المرور غير متطابقتين')
      return
    }
    setPasswordSaving(true)
    try {
      await adminApi.updateUser(liveUser.id, { password: newPassword })
      setNewPassword('')
      setConfirmPassword('')
      setPasswordOk(true)
      onSaved()
    } catch (err) {
      if (err instanceof ApiClientError) {
        setPasswordError(err.errors?.map((item) => item.message).join(' — ') || err.message)
      } else {
        setPasswordError(err instanceof Error ? err.message : 'تعذر تعيين كلمة المرور')
      }
    } finally {
      setPasswordSaving(false)
    }
  }

  const removeUser = async () => {
    const label = liveUser.profile?.name || liveUser.email
    if (!confirmDelete(label)) return
    setDeleting(true)
    setAccountError(null)
    try {
      await adminApi.deleteUser(liveUser.id)
      onDeleted?.()
      onSaved()
      onClose()
    } catch (err) {
      if (err instanceof ApiClientError) {
        setAccountError(err.errors?.map((item) => item.message).join(' — ') || err.message)
      } else {
        setAccountError(err instanceof Error ? err.message : 'تعذر حذف الحساب')
      }
    } finally {
      setDeleting(false)
    }
  }

  const saveAccount = async () => {
    setAccountSaving(true)
    setAccountError(null)
    setAccountOk(false)
    try {
      const payload: Record<string, unknown> = {
        role: account.role,
        membership_status: account.membership_status,
        is_active: account.is_active,
        phone: account.phone.trim() || undefined,
        wilaya: account.wilaya.trim() || undefined,
        category: account.category.trim() || undefined,
      }
      if (account.role === 'member' || account.membership_status === 'approved') {
        payload.plan = account.plan || null
      } else if (account.role === 'guest') {
        payload.plan = null
      } else {
        payload.plan = account.plan || null
      }

      const updated = await adminApi.updateUser(liveUser.id, payload)
      setLiveUser(updated)
      const next = accountFrom(updated)
      setAccount(next)
      setAccountBaseline(next)
      setAccountOk(true)
      onSaved()
    } catch (err) {
      if (err instanceof ApiClientError) {
        setAccountError(err.errors?.map((item) => item.message).join(' — ') || err.message)
      } else {
        setAccountError(err instanceof Error ? err.message : 'تعذر حفظ إعدادات الحساب')
      }
    } finally {
      setAccountSaving(false)
    }
  }

  const persistProfile = async (payload: ProfilePersistPayload) => {
    const body: Record<string, unknown> = {
      name: payload.name,
      title: payload.title,
      specialty: payload.specialty,
      city: payload.city,
      website: payload.website,
      bio: payload.bio,
      image: payload.image,
      cover: payload.cover,
      social: payload.social,
      phone: account.phone.trim() || undefined,
      wilaya: account.wilaya.trim() || undefined,
      category: account.category.trim() || undefined,
    }
    const updated = await adminApi.updateUser(liveUser.id, body)
    setLiveUser(updated)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]" onClick={onClose} aria-label="إغلاق" />
      <div className="relative w-full sm:max-w-5xl max-h-[94vh] overflow-y-auto rounded-t-[22px] sm:rounded-[22px] bg-[#F3EEE8] shadow-xl">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-navy/[0.06] bg-white/95 backdrop-blur-md">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-gold-dark uppercase">Profile preview</p>
            <h2 className="text-[16px] font-extrabold text-navy tracking-[-0.02em] truncate">
              تعديل ملف {liveUser.profile?.name || liveUser.email}
            </h2>
            <p className="text-[12px] text-muted truncate dir-ltr text-right">{liveUser.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-ivory ring-1 ring-navy/8 hover:bg-blush flex items-center justify-center pressable cursor-pointer shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <ProfilePreviewEditor
            member={member}
            simple={isGuest}
            eyebrow="معاينة ملف العضوة"
            hint="نفس شكل الصفحة العامة — عدّلي مباشرة من المعاينة ثم احفظي."
            stickyOffsetClass="bottom-4"
            showPublicLink={Boolean(liveUser.profile?.id) && account.role === 'member'}
            onSaved={async () => {
              onSaved()
            }}
            onPersist={persistProfile}
            asideSlot={
              <section className="rounded-[16px] bg-white p-4 sm:p-5 space-y-3 hairline shadow-xs">
                <h3 className="font-bold text-navy">إعدادات الحساب</h3>
                <p className="text-[12px] text-muted leading-relaxed">
                  الدور والخطة وحالة العضوية تُحفظ من هنا بشكل منفصل عن معاينة الملف.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1.5">الهاتف</label>
                  <input
                    value={account.phone}
                    onChange={(e) => {
                      setAccount((prev) => ({ ...prev, phone: e.target.value }))
                      setAccountOk(false)
                    }}
                    className={inputClass}
                    dir="ltr"
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1.5">الولاية</label>
                  <input
                    value={account.wilaya}
                    onChange={(e) => {
                      setAccount((prev) => ({ ...prev, wilaya: e.target.value }))
                      setAccountOk(false)
                    }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1.5">التصنيف</label>
                  <input
                    value={account.category}
                    onChange={(e) => {
                      setAccount((prev) => ({ ...prev, category: e.target.value }))
                      setAccountOk(false)
                    }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1.5">الدور</label>
                  <select
                    value={account.role}
                    onChange={(e) => {
                      setAccount((prev) => ({ ...prev, role: e.target.value }))
                      setAccountOk(false)
                    }}
                    className={selectClass}
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1.5">الخطة</label>
                  <select
                    value={account.plan}
                    onChange={(e) => {
                      setAccount((prev) => ({ ...prev, plan: e.target.value }))
                      setAccountOk(false)
                    }}
                    className={selectClass}
                    disabled={account.role === 'guest'}
                  >
                    <option value="">—</option>
                    <option value="BUSINESS">{PLAN_LABELS.BUSINESS}</option>
                    <option value="EXPERT">{PLAN_LABELS.EXPERT}</option>
                    <option value="ACADEMY">{PLAN_LABELS.ACADEMY}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1.5">حالة العضوية</label>
                  <select
                    value={account.membership_status}
                    onChange={(e) => {
                      setAccount((prev) => ({ ...prev, membership_status: e.target.value }))
                      setAccountOk(false)
                    }}
                    className={selectClass}
                  >
                    {Object.entries(MEMBERSHIP_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F7F3EE] px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-navy">الحساب نشط</span>
                  <input
                    type="checkbox"
                    checked={account.is_active}
                    onChange={(e) => {
                      setAccount((prev) => ({ ...prev, is_active: e.target.checked }))
                      setAccountOk(false)
                    }}
                    className="w-4 h-4 accent-gold"
                  />
                </label>

                {accountError && <p className="text-sm text-rose">{accountError}</p>}
                {accountOk && !accountDirty && (
                  <p className="text-sm text-emerald-700">تم حفظ إعدادات الحساب</p>
                )}

                <Button
                  variant="gold"
                  size="sm"
                  className="w-full !rounded-full"
                  disabled={accountSaving || !accountDirty}
                  onClick={() => void saveAccount()}
                >
                  {accountSaving ? 'جاري الحفظ...' : 'حفظ إعدادات الحساب'}
                </Button>

                <div className="pt-3 mt-1 border-t border-navy/8 space-y-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-gold-dark" />
                    <h4 className="font-bold text-navy text-[13px]">تعيين كلمة مرور</h4>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    10 أحرف على الأقل، مع حرف ورقم. سيُخرج الحساب من الجلسات الحالية.
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted mb-1.5">كلمة مرور جديدة</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setPasswordOk(false)
                        setPasswordError(null)
                      }}
                      className={inputClass}
                      autoComplete="new-password"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted mb-1.5">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setPasswordOk(false)
                        setPasswordError(null)
                      }}
                      className={inputClass}
                      autoComplete="new-password"
                      dir="ltr"
                    />
                  </div>
                  {passwordError && <p className="text-sm text-rose">{passwordError}</p>}
                  {passwordOk && <p className="text-sm text-emerald-700">تم تعيين كلمة المرور</p>}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full !rounded-full"
                    disabled={passwordSaving || !newPassword || !confirmPassword}
                    onClick={() => void savePassword()}
                  >
                    {passwordSaving ? 'جاري التعيين...' : 'تعيين كلمة المرور'}
                  </Button>
                </div>

                <div className="pt-3 mt-1 border-t border-navy/8 space-y-2">
                  <p className="text-[11px] text-muted leading-relaxed">
                    حذف الحساب نهائي ويزيل الملف من الدليل. لا يمكن التراجع.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full !rounded-full !border-rose/30 !text-rose hover:!bg-rose-soft"
                    disabled={deleting}
                    onClick={() => void removeUser()}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deleting ? 'جاري الحذف...' : 'حذف الحساب'}
                  </Button>
                </div>
              </section>
            }
          />
        </div>
      </div>
    </div>
  )
}
