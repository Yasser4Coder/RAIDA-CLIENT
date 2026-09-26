/** Site-wide SEO defaults and helpers for RAIDA. */

export const SITE_NAME = 'RAIDA رائدة'
export const SITE_NAME_SHORT = 'RAIDA'
export const SITE_TAGLINE = 'حيث تلتقي الطموحات بالخبرات والفرص'
export const DEFAULT_DESCRIPTION =
  'RAIDA رائدة — منصّة ومجتمع مهني من ابتكار SOS Group، يجمع رائدات الأعمال والخبراء والشركاء في الجزائر لبناء فرص حقيقية للنمو والتعاون.'

import { safeImageSrc } from './safe'

/** Public site origin — set VITE_SITE_URL in production (no trailing slash). */
export function getSiteUrl(): string {
  const fromEnv = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin
  return 'https://raaida.net'
}

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = getSiteUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export function absoluteImage(path?: string | null, fallback = '/raida-icon.png'): string {
  const resolved = safeImageSrc(path, '')
  if (resolved) return resolved
  return absoluteUrl(fallback)
}

export type SeoProps = {
  title?: string
  description?: string
  path?: string
  image?: string | null
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
  keywords?: string[]
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export const routeSeo = {
  home: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    path: '/',
    keywords: [
      'رائدة',
      'RAIDA',
      'رائدات أعمال',
      'نساء رائدات',
      'الجزائر',
      'منصة نسائية',
      'ريادة أعمال',
      'شبكات مهنية',
    ],
  },
  members: {
    title: `دليل الأعضاء | ${SITE_NAME}`,
    description:
      'اكتشفي رائدات الأعمال والخبراء في دليل RAIDA — تواصلي، تعاوني، وابنِي شبكة مهنية قوية.',
    path: '/members',
    keywords: ['دليل الأعضاء', 'رائدات أعمال', 'RAIDA', 'شبكة نسائية'],
  },
  brands: {
    title: `العلامات التجارية | ${SITE_NAME}`,
    description:
      'استكشفي العلامات التجارية النسائية على منصة RAIDA وتعرّفي على قصص نموها ومنتجاتها.',
    path: '/brands',
    keywords: ['علامات تجارية', 'براندات نسائية', 'RAIDA'],
  },
  events: {
    title: `الفعاليات | ${SITE_NAME}`,
    description:
      'فعاليات وملتقيات وورش عمل لرائدات الأعمال — سجّلي حضوركِ وانمِي شبكتكِ مع RAIDA.',
    path: '/events',
    keywords: ['فعاليات', 'ورش عمل', 'ملتقيات', 'RAIDA'],
  },
  partnerships: {
    title: `الشراكات | ${SITE_NAME}`,
    description:
      'فرص شراكة حقيقية مع مجتمع RAIDA — للشركات والمؤسسات الراغبة في دعم رائدات الأعمال.',
    path: '/partnerships',
    keywords: ['شراكات', 'رعاية', 'RAIDA'],
  },
  membership: {
    title: `العضوية والخطط | ${SITE_NAME}`,
    description:
      'انضمي إلى مجتمع RAIDA واختاري خطة العضوية التي تناسب مرحلة نمو مشروعكِ.',
    path: '/membership',
    keywords: ['عضوية', 'اشتراك', 'خطط RAIDA'],
  },
  about: {
    title: `عن رائدة | ${SITE_NAME}`,
    description:
      'تعرّفي على مجتمع رائدة: منصّة ابتُكرت وأنشئت بواسطة SOS Group لتمكين رائدات الأعمال في الجزائر.',
    path: '/about',
    keywords: ['عن رائدة', 'RAIDA', 'SOS Group', 'مجتمع نسائي'],
  },
  community: {
    title: `مجتمع رائدة | ${SITE_NAME}`,
    description: 'الانضمام إلى مجتمع رائدة مجاني — تابعي الفرص والمحتوى وتعرّفي على الشبكة المهنية.',
    path: '/community',
    keywords: ['مجتمع رائدة', 'انضمام مجاني', 'RAIDA'],
  },
  experts: {
    title: `دليل الخبراء والمدربين | ${SITE_NAME}`,
    description:
      'دليل عضوية رائدة للمدربين والخبراء — بحث حسب التخصص، ملفات احترافية، وطلب استشارة مباشرة تصل إلى وارد الخبيرة.',
    path: '/experts',
    keywords: ['خبراء', 'مدربون', 'استشارات', 'عضوية الخبراء', 'RAIDA'],
  },
  programs: {
    title: `برامج رائدة | ${SITE_NAME}`,
    description:
      'برامج تدريبية سنوية ومتخصصة لرائدات الأعمال — حضوري وأونلاين، مع 4 دورات مجانية للأعضاء سنويًا.',
    path: '/programs',
    keywords: ['برامج تدريبية', 'دورات', 'حضوري', 'أونلاين', 'أكاديمية رائدة'],
  },
  services: {
    title: `اطلبي خدمة | ${SITE_NAME}`,
    description:
      'اطلبي خدمة لمشروعكِ — محاسبة، تصميم، قانون، تسويق، مواقع — وتصل الطلبات إلى الخبراء المناسبين عبر رائدة.',
    path: '/services',
    keywords: ['اطلبي خدمة', 'خدمات', 'خبراء', 'RAIDA'],
  },
  academies: {
    title: `أكاديميات ومراكز تدريب تستحق الاكتشاف | ${SITE_NAME}`,
    description:
      'اكتشفي أكاديميات ومراكز تدريب رائدة — كوتشينق، إدارة مشاريع، وبرامج مهنية داخل مجتمع رائدة.',
    path: '/academies',
    keywords: ['أكاديميات', 'مراكز تدريب', 'كوتشينق', 'CPS', 'RAIDA'],
  },
  sosStore: {
    title: `SOS Store | ${SITE_NAME}`,
    description:
      'بِعي منتجاتكِ على SOS Store ضمن منظومة SOS Group — تجربة مجانية 30 يومًا، لوحة تحكم، ومراجعة جودة قبل النشر.',
    path: '/sos-store',
    keywords: ['SOS Store', 'متجر إلكتروني', 'انضم كبائع', 'SOS GROUP', 'RAIDA'],
  },
  opportunities: {
    title: `الفرص | ${SITE_NAME}`,
    description: 'معارض ومسابقات وتمويل وشراكات ودعوات مشاركة لأعضاء مجتمع رائدة.',
    path: '/opportunities',
    keywords: ['فرص', 'معارض', 'تمويل', 'RAIDA'],
  },
  announcements: {
    title: `الإعلانات | ${SITE_NAME}`,
    description: 'إعلانات رسمية وتعيينات ومستجدات من مؤسسة SOS Group ومجتمع رائدة.',
    path: '/announcements',
    keywords: ['إعلانات', 'تعيينات', 'SOS Group', 'RAIDA'],
  },
  consultations: {
    title: `الاستشارات | ${SITE_NAME}`,
    description:
      'اطلبي استشارة من إدارة رائدة أو خبيرة معتمدة — المجال، النوع، الوقت، Online أو حضوري.',
    path: '/consultations',
    keywords: ['استشارات', 'خبيرات رائدة', 'RAIDA'],
  },
  benefits: {
    title: `مزايا العضوية | ${SITE_NAME}`,
    description: 'من الحساب المجاني إلى العضوية المهنية — دورات واستشارات وتخفيضات وأولوية الفرص.',
    path: '/benefits',
    keywords: ['مزايا', 'عضوية رائدة', 'RAIDA'],
  },
  projectCheck: {
    title: `اختبري مشروعك | ${SITE_NAME}`,
    description: 'أداة مجانية لتقييم جاهزية مشروعكِ والحصول على الخطوة التالية المقترحة.',
    path: '/project-check',
    keywords: ['اختبار مشروع', 'جاهزية', 'رائدة'],
  },
  memberOfMonth: {
    title: `رائدة الشهر | ${SITE_NAME}`,
    description: 'كل شهر نسلّط الضوء على عضوة وإنجازاتها ومشروعها داخل مجتمع رائدة.',
    path: '/member-of-month',
    keywords: ['رائدة الشهر', 'قصة نجاح', 'RAIDA'],
  },
  dashboard: {
    title: `لوحة التحكم | ${SITE_NAME}`,
    description: 'إدارة ملفكِ الشخصي وخدماتكِ وإشعاراتكِ على منصة RAIDA.',
    path: '/dashboard',
    noindex: true,
  },
  admin: {
    title: `لوحة الإدارة | ${SITE_NAME}`,
    description: 'إدارة محتوى منصة RAIDA.',
    path: '/admin',
    noindex: true,
  },
  verifyEmail: {
    title: `تأكيد البريد | ${SITE_NAME}`,
    description: 'تأكيد البريد الإلكتروني لحساب RAIDA.',
    path: '/verify-email',
    noindex: true,
  },
  forgotPassword: {
    title: `استعادة الحساب | ${SITE_NAME}`,
    description: 'استعادة كلمة المرور أو إعادة إرسال رابط التأكيد.',
    path: '/forgot-password',
    noindex: true,
  },
  resetPassword: {
    title: `كلمة مرور جديدة | ${SITE_NAME}`,
    description: 'تعيين كلمة مرور جديدة لحساب RAIDA.',
    path: '/reset-password',
    noindex: true,
  },
} as const

export function buildTitle(pageTitle?: string, bare = false): string {
  if (!pageTitle) return `${SITE_NAME} | ${SITE_TAGLINE}`
  if (bare || pageTitle.includes(SITE_NAME_SHORT) || pageTitle.includes('رائدة')) return pageTitle
  return `${pageTitle} | ${SITE_NAME}`
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RAIDA',
    alternateName: ['رائدة', 'RAIDA رائدة'],
    url: getSiteUrl(),
    logo: absoluteImage('/raida-logo-light.png'),
    image: absoluteImage('/raida-icon.png'),
    description: DEFAULT_DESCRIPTION,
    parentOrganization: {
      '@type': 'Organization',
      name: 'SOS Group',
    },
    foundingLocation: {
      '@type': 'Place',
      name: 'Algeria',
      addressCountry: 'DZ',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Algeria',
    },
    knowsLanguage: ['ar', 'fr'],
    sameAs: [] as string[],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteUrl(),
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'ar',
    publisher: {
      '@type': 'Organization',
      name: 'RAIDA',
      logo: absoluteImage('/raida-logo-light.png'),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getSiteUrl()}/members?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
