import { useEffect } from 'react'
import {
  absoluteImage,
  absoluteUrl,
  buildTitle,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  type SeoProps,
} from '../../lib/seo'

const META_ATTR = 'data-raida-seo'
const LINK_ATTR = 'data-raida-seo'
const SCRIPT_ID = 'raida-jsonld'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"][${META_ATTR}]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(META_ATTR, '1')
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][${LINK_ATTR}]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    el.setAttribute(LINK_ATTR, '1')
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data?: SeoProps['jsonLd']) {
  const existing = document.getElementById(SCRIPT_ID)
  if (!data) {
    existing?.remove()
    return
  }
  const payload = Array.isArray(data) ? data : [data]
  let el = existing as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = SCRIPT_ID
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(payload.length === 1 ? payload[0] : payload)
}

/**
 * Updates document title, meta tags, canonical URL, and optional JSON-LD.
 * Safe for SPA route changes (client-side).
 */
export default function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  keywords,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = buildTitle(title)
    const url = absoluteUrl(path)
    const img = absoluteImage(image)
    const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

    document.title = fullTitle

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)
    upsertMeta('name', 'googlebot', robots)
    if (keywords?.length) {
      upsertMeta('name', 'keywords', keywords.join(', '))
    }

    upsertLink('canonical', url)

    upsertMeta('property', 'og:type', type === 'profile' ? 'profile' : type)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:locale', 'ar_DZ')
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)
    upsertMeta('property', 'og:image:alt', fullTitle)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', img)

    setJsonLd(jsonLd)
  }, [title, description, path, image, type, noindex, keywords?.join(','), jsonLd])

  return null
}
