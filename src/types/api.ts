export type SocialLinks = Record<string, string>

export type Member = {
  id: string
  userId?: string
  name: string
  title: string
  specialty: string
  city: string
  wilaya: string
  category: string
  services: string[]
  image: string | null
  cover: string | null
  bio: string | null
  website: string | null
  social: SocialLinks
  achievements: string[]
  products: string[]
  programs: string[]
  projects: string[]
  isPublic?: boolean
  profileViews?: number
}

export type Brand = {
  id: string
  name: string
  category: string
  description: string
  logo: string | null
  cover: string | null
  story: string | null
  founderId?: string
  founder?: Member
  products: string[]
  services: string[]
  news: string[]
  isActive?: boolean
}

export type EventSpeaker = {
  name: string
  title?: string
  image?: string
}

export type EventItem = {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string | null
  speakers: EventSpeaker[]
  description: string
  agenda: { time: string; title: string }[]
  sponsors: string[]
  category: string
  price: string
  capacity?: number | null
  registrationUrl?: string | null
  isPublished?: boolean
  startsAt?: string | null
}

export type Partner = {
  id: string
  name: string
  type: string
  logo?: string | null
  website?: string | null
  isActive?: boolean
}

export type PartnershipTier = {
  id: string
  name: string
  nameAr: string
  description: string
  benefits: string[]
  color: string
  sortOrder?: number
}

export type PricingPlan = {
  id: string
  name: string
  nameAr: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
  sortOrder?: number
  isActive?: boolean
  grantsAccess?: boolean
}

export type SuccessStory = {
  id: string
  title: string
  excerpt: string
  image: string | null
  author: string
  category: string
  featured: boolean
  isPublished?: boolean
}

export type ServiceCategory = {
  id: string
  name: string
  icon: string
  count: number
  sortOrder?: number
}

export type CommunityCard = {
  id: string
  title: string
  description: string
  icon: string
  color: string
  sortOrder?: number
}

export type PlatformStat = {
  id: string
  label: string
  value: number
  suffix: string
  sortOrder?: number
}

export type Consultation = {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string | null
  subject: string
  message: string
  status: 'new' | 'read' | 'archived'
  createdAt: string
}

export type PartnershipInquiry = {
  id: string
  name: string
  email: string
  organization: string
  tier: string | null
  message: string
  status: 'new' | 'read' | 'archived'
  createdAt: string
}

export type NotificationItem = {
  id: string
  text: string
  time?: string
  unread: boolean
  type?: string
  createdAt?: string
}

export type UserSafe = {
  id: string
  email: string
  role: string
  plan: string
  isActive: boolean
  isEmailVerified: boolean
  hasAccess?: boolean
}

export type AdminUser = UserSafe & { profile: Member | null }

export type AdminRevenue = {
  monthlyRevenue: number
  averageSubscription: number
  payingMembers: number
  totalMembers: number
  breakdown: {
    plan: string
    nameAr: string
    price: string
    members: number
    monthlyRevenue: number
  }[]
}

export type ApiListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ApiSuccess<T> = {
  success: true
  data: T
  meta?: ApiListMeta
}

export type ApiError = {
  success: false
  message: string
  code?: string
  errors?: { path: string; message: string }[]
}
