import type { Member } from '../types/api'

/**
 * Featured academies / training centers (ACADEMY plan).
 * Merged into the academies directory when not yet returned by the API.
 */
export const featuredAcademiesWireframe: Member[] = [
  {
    id: 'wireframe-cps-academy',
    name: 'مؤسسة CPS للكوتشينق وإدارة المشاريع',
    title: 'أكاديمية ومؤسسة تدريب',
    specialty: 'الكوتشينق وإدارة المشاريع',
    city: 'الجزائر العاصمة',
    wilaya: 'الجزائر',
    category: 'أكاديميات ومراكز تدريب',
    services: ['كوتشينق', 'إدارة المشاريع', 'تدريب مهني', 'ورشات تطوير'],
    image: '/images/academies/wireframe-cps.svg',
    cover: '/images/academies/wireframe-cps.svg',
    bio: 'مؤسسة CPS للكوتشينق وإدارة المشاريع — مركز تدريب يرافق الأفراد والفرق في بناء المهارات القيادية وإدارة المشاريع باحتراف.',
    website: null,
    social: {},
    achievements: [],
    products: [],
    programs: ['كوتشينق احترافي', 'إدارة المشاريع', 'تطوير المهارات القيادية'],
    projects: [],
  },
]

export function mergeFeaturedAcademies(apiAcademies: Member[]): Member[] {
  const names = new Set(apiAcademies.map((m) => m.name.trim()))
  const missing = featuredAcademiesWireframe.filter((m) => !names.has(m.name.trim()))
  return [...missing, ...apiAcademies]
}
