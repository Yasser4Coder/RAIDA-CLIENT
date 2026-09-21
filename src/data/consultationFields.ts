/** Consultation fields from RAIDA product brief (additions.txt). */

export const CONSULTATION_FIELDS = [
  'ريادة الأعمال وتطوير المشاريع',
  'التسويق وبناء العلامة التجارية',
  'القانون والأعمال',
  'المالية والمحاسبة',
  'الإدارة والموارد البشرية',
  'التكنولوجيا والرقمنة',
  'التجارة الإلكترونية',
  'الذكاء الاصطناعي',
  'التصميم والإبداع',
  'الإعلام وصناعة المحتوى',
  'التصدير والتوسع',
  'التدريب والتطوير المهني',
] as const

export const CONSULTATION_TYPES = [
  'استشارة فردية',
  'جلسة جماعية',
  'برنامج مرافقة',
  'عيادة استشارية',
] as const

export const CONSULTATION_MODES = [
  { value: 'online', label: 'Online' },
  { value: 'in_person', label: 'حضوري' },
] as const

export type ConsultationField = (typeof CONSULTATION_FIELDS)[number]
export type ConsultationType = (typeof CONSULTATION_TYPES)[number]
export type ConsultationMode = (typeof CONSULTATION_MODES)[number]['value']
