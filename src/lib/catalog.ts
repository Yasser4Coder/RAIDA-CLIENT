import { apiList, apiRequest, apiUpload, setAccessToken, getAccessToken } from './api'
import type {
  AdminRevenue,
  AdminUser,
  Brand,
  CommunityCard,
  Consultation,
  EventItem,
  Member,
  NotificationItem,
  Partner,
  PartnershipInquiry,
  PartnershipTier,
  PlatformStat,
  PricingPlan,
  ServiceCategory,
  SuccessStory,
  UserSafe,
} from '../types/api'

export const catalogApi = {
  members: (query?: Record<string, string | number | undefined>) =>
    apiList<Member>('/members', query),
  member: (id: string) => apiRequest<Member>(`/members/${id}`, { auth: false }),
  brands: (query?: Record<string, string | number | undefined>) =>
    apiList<Brand>('/brands', query),
  brand: (id: string) => apiRequest<Brand>(`/brands/${id}`, { auth: false }),
  events: (query?: Record<string, string | number | undefined>) =>
    apiList<EventItem>('/events', query),
  event: (id: string) => apiRequest<EventItem>(`/events/${id}`, { auth: false }),
  partners: () => apiRequest<Partner[]>('/partners', { auth: false }),
  partnershipTiers: () => apiRequest<PartnershipTier[]>('/partnership-tiers', { auth: false }),
  plans: () => apiRequest<PricingPlan[]>('/plans', { auth: false }),
  successStories: () => apiRequest<SuccessStory[]>('/success-stories', { auth: false }),
  serviceCategories: () => apiRequest<ServiceCategory[]>('/service-categories', { auth: false }),
  communityCards: () => apiRequest<CommunityCard[]>('/community-cards', { auth: false }),
  stats: () => apiRequest<PlatformStat[]>('/stats', { auth: false }),
  wilayas: () => apiRequest<string[]>('/wilayas', { auth: false }),
}

export const authApi = {
  async login(email: string, password: string) {
    const data = await apiRequest<{
      user: UserSafe
      profile: Member | null
      accessToken: string
    }>('/auth/login', { method: 'POST', body: { email, password }, auth: false })
    setAccessToken(data.accessToken)
    return data
  },
  async register(payload: {
    email: string
    password: string
    name: string
    title?: string
    specialty?: string
    city?: string
    wilaya?: string
    category?: string
  }) {
    const data = await apiRequest<{
      user: UserSafe
      profile: Member | null
      accessToken: string
    }>('/auth/register', { method: 'POST', body: payload, auth: false })
    setAccessToken(data.accessToken)
    return data
  },
  async me() {
    return apiRequest<{ user: UserSafe; profile: Member | null }>('/auth/me')
  },
  async refresh() {
    const data = await apiRequest<{ user: UserSafe; accessToken: string }>('/auth/refresh', {
      method: 'POST',
      body: {},
      auth: false,
    })
    setAccessToken(data.accessToken)
    return data
  },
  async logout() {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST', body: {} })
    } finally {
      setAccessToken(null)
    }
  },
  isAuthenticated() {
    return Boolean(getAccessToken())
  },
}

export const meApi = {
  dashboard: () =>
    apiRequest<{
      user: UserSafe | null
      profile: Member | null
      stats: {
        profileViews: number
        upcomingEvents: number
        unreadNotifications: number
        unreadConsultations: number
      }
      upcomingEvents: EventItem[]
    }>('/me/dashboard'),
  notifications: () => apiList<NotificationItem>('/me/notifications'),
  markNotificationRead: (id: string) =>
    apiRequest<NotificationItem>(`/me/notifications/${id}/read`, { method: 'PATCH', body: {} }),
  updateProfile: (payload: Partial<Member>) =>
    apiRequest<Member>('/me/profile', { method: 'PATCH', body: payload }),
  consultations: () => apiList<Consultation>('/me/consultations'),
  markConsultationRead: (id: string) =>
    apiRequest<Consultation>(`/me/consultations/${id}/read`, { method: 'PATCH', body: {} }),
  updatePlan: (plan: string) =>
    apiRequest<UserSafe>('/me/plan', { method: 'PATCH', body: { plan } }),
  registerEvent: (eventId: string) =>
    apiRequest<{ registrationId: string; status: string }>(`/events/${eventId}/register`, {
      method: 'POST',
      body: {},
    }),
}

export const uploadApi = {
  image: (file: File) => apiUpload<{ url: string }>('/uploads', file),
}

export const publicApi = {
  sendConsultation: (
    memberId: string,
    payload: { name: string; email: string; phone?: string; subject?: string; message: string },
  ) =>
    apiRequest<{ received: boolean; id: string }>(`/members/${memberId}/consultations`, {
      method: 'POST',
      body: payload,
      auth: false,
    }),
  sendPartnershipInquiry: (payload: {
    name: string
    email: string
    organization: string
    tier?: string
    message: string
  }) =>
    apiRequest<{ received: boolean; id: string }>('/partnership-inquiries', {
      method: 'POST',
      body: payload,
      auth: false,
    }),
}

export const adminApi = {
  overview: () =>
    apiRequest<{
      kpis: { members: number; brands: number; activeEvents: number; partners: number }
      planDistribution: { plan: string; count: number | string }[]
      recentMembers: (Member & { plan?: string; email?: string; isActive?: boolean })[]
    }>('/admin/overview'),
  revenue: () => apiRequest<AdminRevenue>('/admin/revenue'),

  users: (query?: Record<string, string | number | undefined>) =>
    apiList<AdminUser>('/admin/users', query),
  createUser: (payload: Record<string, unknown>) =>
    apiRequest<AdminUser>('/admin/users', { method: 'POST', body: payload }),
  updateUser: (id: string, payload: Record<string, unknown>) =>
    apiRequest<AdminUser>(`/admin/users/${id}`, { method: 'PATCH', body: payload }),

  brands: (query?: Record<string, string | number | undefined>) => apiList<Brand>('/admin/brands', query),
  createBrand: (payload: Record<string, unknown>) =>
    apiRequest<Brand>('/admin/brands', { method: 'POST', body: payload }),
  updateBrand: (id: string, payload: Record<string, unknown>) =>
    apiRequest<Brand>(`/admin/brands/${id}`, { method: 'PATCH', body: payload }),
  deleteBrand: (id: string) => apiRequest<void>(`/admin/brands/${id}`, { method: 'DELETE' }),

  events: (query?: Record<string, string | number | undefined>) =>
    apiList<EventItem>('/admin/events', query),
  createEvent: (payload: Record<string, unknown>) =>
    apiRequest<EventItem>('/admin/events', { method: 'POST', body: payload }),
  updateEvent: (id: string, payload: Record<string, unknown>) =>
    apiRequest<EventItem>(`/admin/events/${id}`, { method: 'PATCH', body: payload }),
  deleteEvent: (id: string) => apiRequest<void>(`/admin/events/${id}`, { method: 'DELETE' }),

  partners: () => apiRequest<Partner[]>('/admin/partners'),
  upsertPartner: (payload: Record<string, unknown>) =>
    apiRequest<Partner>('/admin/partners', { method: 'POST', body: payload }),
  deletePartner: (id: string) => apiRequest<void>(`/admin/partners/${id}`, { method: 'DELETE' }),
  partnershipInquiries: () => apiRequest<PartnershipInquiry[]>('/admin/partnership-inquiries'),
  markPartnershipInquiryRead: (id: string) =>
    apiRequest<PartnershipInquiry>(`/admin/partnership-inquiries/${id}/read`, {
      method: 'PATCH',
      body: {},
    }),

  tiers: () => apiRequest<PartnershipTier[]>('/admin/partnership-tiers'),
  upsertTier: (payload: Record<string, unknown>) =>
    apiRequest<PartnershipTier>('/admin/partnership-tiers', { method: 'POST', body: payload }),
  deleteTier: (id: string) =>
    apiRequest<void>(`/admin/partnership-tiers/${id}`, { method: 'DELETE' }),

  plans: () => apiRequest<PricingPlan[]>('/admin/plans'),
  createPlan: (payload: Record<string, unknown>) =>
    apiRequest<PricingPlan>('/admin/plans', { method: 'POST', body: payload }),
  updatePlan: (id: string, payload: Record<string, unknown>) =>
    apiRequest<PricingPlan>(`/admin/plans/${id}`, { method: 'PATCH', body: payload }),
  deletePlan: (id: string) => apiRequest<void>(`/admin/plans/${id}`, { method: 'DELETE' }),

  stories: () => apiRequest<SuccessStory[]>('/admin/success-stories'),
  upsertStory: (payload: Record<string, unknown>) =>
    apiRequest<SuccessStory>('/admin/success-stories', { method: 'POST', body: payload }),
  deleteStory: (id: string) =>
    apiRequest<void>(`/admin/success-stories/${id}`, { method: 'DELETE' }),

  communityCards: () => apiRequest<CommunityCard[]>('/admin/community-cards'),
  upsertCommunityCard: (payload: Record<string, unknown>) =>
    apiRequest<CommunityCard>('/admin/community-cards', { method: 'POST', body: payload }),
  deleteCommunityCard: (id: string) =>
    apiRequest<void>(`/admin/community-cards/${id}`, { method: 'DELETE' }),

  stats: () => apiRequest<PlatformStat[]>('/admin/stats'),
  upsertStat: (payload: Record<string, unknown>) =>
    apiRequest<PlatformStat>('/admin/stats', { method: 'POST', body: payload }),
  deleteStat: (id: string) => apiRequest<void>(`/admin/stats/${id}`, { method: 'DELETE' }),

  serviceCategories: () => apiRequest<ServiceCategory[]>('/admin/service-categories'),
  upsertServiceCategory: (payload: Record<string, unknown>) =>
    apiRequest<ServiceCategory>('/admin/service-categories', { method: 'POST', body: payload }),
  deleteServiceCategory: (id: string) =>
    apiRequest<void>(`/admin/service-categories/${id}`, { method: 'DELETE' }),
}
