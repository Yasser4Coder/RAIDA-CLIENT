/** Site-wide SEO defaults and helpers for RAIDA. */

export const SITE_NAME = 'RAIDA رائدة'
export const SITE_NAME_SHORT = 'RAIDA'
export const SITE_TAGLINE = 'حيث تلتقي الطموحات بالخبرات والفرص'
export const DEFAULT_DESCRIPTION =
  'منصة ومجتمع مهني يجمع رائدات الأعمال والخبراء والشركات والشركاء في الجزائر لبناء فرص حقيقية للنمو والتعاون.'

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
  return absoluteUrl(path || fallback)
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
    description: 'تعرّفي على مجتمع رائدة: شبكة مهنية تجمع المشاريع والخبيرات والأكاديميات والعلامات.',
    path: '/about',
    keywords: ['عن رائدة', 'RAIDA', 'مجتمع نسائي'],
  },
  community: {
    title: `مجتمع رائدة | ${SITE_NAME}`,
    description: 'الانضمام إلى مجتمع رائدة مجاني — تابعي الفرص والمحتوى وتعرّفي على الشبكة المهنية.',
    path: '/community',
    keywords: ['مجتمع رائدة', 'انضمام مجاني', 'RAIDA'],
  },
  experts: {
    title: `خبيرات رائدة | ${SITE_NAME}`,
    description: 'دليل المدربات والمستشارات في رائدة — تواصلي واطلبي استشارة أو برنامجًا تدريبيًا.',
    path: '/experts',
    keywords: ['خبيرات', 'مدربات', 'استشارات', 'RAIDA'],
  },
  programs: {
    title: `برامج رائدة | ${SITE_NAME}`,
    description: 'برامج تدريبية سنوية ومتخصصة لرائدات الأعمال — 4 دورات مجانية للأعضاء سنويًا.',
    path: '/programs',
    keywords: ['برامج تدريبية', 'دورات', 'أكاديمية رائدة'],
  },
  services: {
    title: `دليل الخدمات | ${SITE_NAME}`,
    description: 'ابحثي عن خدمات تطوير المشاريع والتسويق والقانون والتقنية والتجارة الإلكترونية.',
    path: '/services',
    keywords: ['دليل الخدمات', 'خبيرات', 'RAIDA'],
  },
  academies: {
    title: `الأكاديميات | ${SITE_NAME}`,
    description: 'دليل أكاديميات ومراكز تدريب رائدة — برامج وتعاون داخل المجتمع.',
    path: '/academies',
    keywords: ['أكاديميات', 'مراكز تدريب', 'RAIDA'],
  },
  sosStore: {
    title: `SOS Store | ${SITE_NAME}`,
    description: 'قدّمي لفتح متجر على SOS Store عبر عضوية رائدة — عرض منتجاتكِ واستقبال الطلبات.',
    path: '/sos-store',
    keywords: ['SOS Store', 'متجر إلكتروني', 'RAIDA'],
  },
  opportunities: {
    title: `الفرص | ${SITE_NAME}`,
    description: 'معارض ومسابقات وتمويل وشراكات ودعوات مشاركة لأعضاء مجتمع رائدة.',
    path: '/opportunities',
    keywords: ['فرص', 'معارض', 'تمويل', 'RAIDA'],
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
