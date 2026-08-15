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
