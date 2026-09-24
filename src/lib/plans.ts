export const PLAN_LABELS: Record<string, string> = {
  BUSINESS: 'عضوية رائدة للأعمال',
  EXPERT: 'عضوية رائدة للمدربين والخبراء',
  ACADEMY: 'عضوية رائدة للأكاديميات ومراكز التدريب',
}

export { planDetailPath } from '../data/membershipPlanDetails'

export const ROLE_LABELS: Record<string, string> = {
  guest: 'زائرة',
  client: 'زائرة',
  member: 'عضوة',
  moderator: 'مشرفة',
  worker: 'موظفة',
  admin: 'مديرة',
  super_admin: 'مديرة عليا',
}

export const MEMBERSHIP_STATUS_LABELS: Record<string, string> = {
  none: 'بدون عضوية',
  pending: 'بانتظار الموافقة',
  approved: 'مقبولة',
  rejected: 'مرفوضة',
}

export function canAccessAdminPanel(role?: string | null) {
  return role === 'worker' || role === 'moderator' || role === 'admin' || role === 'super_admin'
}

export function canAccessFinance(role?: string | null) {
  return role === 'admin' || role === 'super_admin'
}

export function isStaffRole(role?: string | null) {
  return canAccessAdminPanel(role)
}
