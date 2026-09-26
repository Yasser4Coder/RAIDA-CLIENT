import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  GraduationCap,
  Award,
  Store,
  Users,
  Megaphone,
  Handshake,
  BookOpen,
  Briefcase,
  Sparkles,
  Globe,
  BadgeCheck,
} from 'lucide-react'

export type PlanKey = 'BUSINESS' | 'EXPERT' | 'ACADEMY'

export type MembershipPlanDetail = {
  key: PlanKey
  slug: string
  /** Short label for badges */
  eyebrow: string
  /** Hero headline (can include plan focus) */
  headline: string
  /** One supporting sentence under the headline */
  pitch: string
  /** Who this plan is for */
  audienceTitle: string
  audience: string[]
  /** Narrative paragraphs explaining the plan */
  story: string[]
  /** Highlighted outcomes — not a card grid dump */
  outcomes: { title: string; body: string; icon: LucideIcon }[]
  /** What a week/month with this membership looks like */
  journeyTitle: string
  journey: { label: string; body: string }[]
  /** Ideal if you… */
  idealFor: string[]
  /** Soft visual accent */
  accent: 'gold' | 'rose' | 'mauve'
  heroImage: string
  relatedLinks: { to: string; label: string }[]
}

export const PLAN_SLUGS: Record<PlanKey, string> = {
  BUSINESS: 'business',
  EXPERT: 'experts',
  ACADEMY: 'academies',
}

export const SLUG_TO_PLAN: Record<string, PlanKey> = {
  business: 'BUSINESS',
  experts: 'EXPERT',
  academies: 'ACADEMY',
  BUSINESS: 'BUSINESS',
  EXPERT: 'EXPERT',
  ACADEMY: 'ACADEMY',
}

export function planDetailPath(planName: string): string {
  const key = planName.toUpperCase() as PlanKey
  const slug = PLAN_SLUGS[key]
  return slug ? `/membership/${slug}` : '/membership'
}

export const membershipPlanDetails: Record<PlanKey, MembershipPlanDetail> = {
  BUSINESS: {
    key: 'BUSINESS',
    slug: 'business',
    eyebrow: 'للرائدات والعلامات',
    headline: 'عضوية تضع علامتكِ في قلب مجتمع رائدة',
    pitch:
      'صفحة احترافية لعلامتكِ، عرض للمنتجات والخدمات، ظهور في الدليل، و4 دورات Online مجانية سنويًا.',
    audienceTitle: 'لمن صُمّمت هذه العضوية؟',
    audience: [
      'صاحبات المشاريع والعلامات التجارية الناشئة أو النامية',
      'رائدات يبحثن عن ظهور مهني ومبيعات عبر الشبكة',
      'من تريد صفحة علامتها ومنتجاتها واضحة داخل رائدة',
      'من تريد الاستفادة من الدورات السنوية لتطوير مشروعها',
    ],
    story: [
      'عضوية رائدة للأعمال مصمّمة لتكون واجهتكِ الرسمية داخل المنصة: صفحة لعلامتكِ، عرض للمنتجات والخدمات، وروابط تواصل واضحة تساعد الزائرات والعضوات على الوصول إليكِ بسهولة.',
      'هذه العضوية للظهور وبناء الحضور التجاري — وليست لاستقبال طلبات الاستشارة. الاستشارات تُقدَّم عبر عضوية الخبراء أو الأكاديميات.',
    ],
    outcomes: [
      {
        title: 'صفحة علامتكِ',
        body: 'صفحة احترافية خاصة بعلامتكِ التجارية على منصة رائدة.',
        icon: Building2,
      },
      {
        title: 'منتجات وخدمات',
        body: 'عرض منتجاتكِ وخدماتكِ بشكل واضح للزائرات.',
        icon: Store,
      },
      {
        title: 'تواصل وظهور',
        body: 'معلومات التواصل والموقع وحسابات التواصل، مع الظهور في دليل رائدة.',
        icon: Sparkles,
      },
      {
        title: 'تعلّم سنوي',
        body: '4 دورات تدريبية Online مجانية سنويًا ضمن مسار نموكِ.',
        icon: BookOpen,
      },
    ],
    journeyTitle: 'ماذا تتوقعين بعد التفعيل؟',
    journey: [
      {
        label: 'الملف والعلامة',
        body: 'إعداد ملفكِ الشخصي وصفحة علامتكِ (علامة واحدة).',
      },
      {
        label: 'الظهور',
        body: 'الظهور في دليل رائدة مع منتجاتكِ وروابط التواصل.',
      },
      {
        label: 'التعلّم',
        body: 'الاستفادة من 4 دورات Online مجانية خلال السنة.',
      },
      {
        label: 'النمو',
        body: 'بناء حضور تجاري أوضح داخل مجتمع رائدة.',
      },
    ],
    idealFor: [
      'لديكِ منتج أو خدمة وتريدين حضوراً احترافياً',
      'تبحثين عن ظهور في دليل العضوات والعلامات',
      'تحتاجين دورات Online سنوية لدعم مشروعكِ',
    ],
    accent: 'gold',
    heroImage:
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1600&h=1000&fit=crop',
    relatedLinks: [
      { to: '/brands', label: 'دليل العلامات' },
      { to: '/programs', label: 'البرامج والدورات' },
      { to: '/members', label: 'دليل الأعضاء' },
    ],
  },
  EXPERT: {
    key: 'EXPERT',
    slug: 'experts',
    eyebrow: 'للمدربات والخبيرات',
    headline: 'عضوية تبني سمعتكِ المهنية وتفتح باب التعاون',
    pitch:
      'صفحة مهنية، ظهور في دليل الخبراء، عرض دوراتكِ واستشاراتكِ، وأولوية للمشاركة كمدربة في برامج رائدة.',
    audienceTitle: 'لمن صُمّمت هذه العضوية؟',
    audience: [
      'المدربات والمستشارات وصاحبات التخصص المهني',
      'من تقدّم دورات أو جلسات استشارية وتريد ظهوراً موثوقاً',
      'خبيرات يبحثن عن تعاون مع مشاريع وعلامات وأكاديميات',
      'من تريد أولوية كمدرّبة أو خبيرة داخل برامج رائدة',
    ],
    story: [
      'عضوية رائدة للمدربين والخبراء تمنحكِ مساحة مهنية واضحة: سيرة، تخصص، خبرات، ودورات واستشارات معروضة بشكل يساعد العضوات على اختياركِ بثقة.',
      'الظهور في دليل الخبراء ليس مجرد اسم في قائمة — بل قناة للتعاون: برامج رائدة، ملتقيات، وشراكات مع علامات وأكاديميات تبحث عن كفاءة حقيقية.',
    ],
    outcomes: [
      {
        title: 'ملفكِ المهني',
        body: 'صفحة تعرض تخصصكِ وخبراتكِ وبرامجكِ ومعلومات التواصل بشكل احترافي.',
        icon: Award,
      },
      {
        title: 'دليل الخبراء',
        body: 'ظهور في دليل خبيرات رائدة حيث تبحث العضوات عن دعم متخصص.',
        icon: BadgeCheck,
      },
      {
        title: 'فرص التدريس',
        body: 'أولوية المشاركة كمدربة أو خبيرة في برامج وملتقيات رائدة.',
        icon: GraduationCap,
      },
      {
        title: 'شبكة تعاون',
        body: 'فرص العمل مع المشاريع والعلامات والأكاديميات داخل المنظومة.',
        icon: Handshake,
      },
    ],
    journeyTitle: 'مسار حضوركِ كخبيرة',
    journey: [
      {
        label: 'البناء',
        body: 'إكمال صفحتكِ المهنية وعرض برامجكِ واستشاراتكِ.',
      },
      {
        label: 'الظهور',
        body: 'الاندماج في دليل الخبراء واستقبال طلبات الاستشارة.',
      },
      {
        label: 'المشاركة',
        body: 'دعوات للبرامج والملتقيات حسب تخصصكِ.',
      },
      {
        label: 'الترويج',
        body: 'فرص ظهور داخل المجتمع تعزّز سمعتكِ المهنية.',
      },
    ],
    idealFor: [
      'تقدّمين تدريباً أو استشارات بصورة منتظمة',
      'تبحثين عن عميلات داخل مجتمع رائدة',
      'تريدين أن تُعرَفي كخبيرة معتمدة في شبكتكِ',
    ],
    accent: 'rose',
    heroImage:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&h=1000&fit=crop',
    relatedLinks: [
      { to: '/experts', label: 'دليل الخبراء' },
      { to: '/consultations', label: 'الاستشارات' },
      { to: '/programs', label: 'البرامج' },
    ],
  },
  ACADEMY: {
    key: 'ACADEMY',
    slug: 'academies',
    eyebrow: 'للأكاديميات ومراكز التدريب',
    headline: 'صفحة رسمية لمؤسستكِ وظهور في دليل أكاديميات رائدة',
    pitch:
      'صفحة رسمية خاصة بالأكاديمية، تعريف بالمؤسسة وبرامجها، عرض الدورات، الموقع ومعلومات التواصل، والظهور في دليل الأكاديميات.',
    audienceTitle: 'لمن صُمّمت هذه العضوية؟',
    audience: [
      'الأكاديميات ومراكز التكوين والتدريب',
      'مؤسسات تقدّم برامج مهنية وتبحث عن شريكات وعضوات',
      'مراكز تريد حضوراً رسمياً داخل منظومة رائدة',
      'من تسعى لأولوية تقديم برامج داخل المجتمع',
    ],
    story: [
      'عضوية رائدة للأكاديميات تمنحكِ حضوراً مؤسسياً واضحاً: صفحة رسمية، تعريف بالمؤسسة، برامجها ودوراتها، وروابط تواصل تساعد الرائدات على اكتشاف عروضكِ.',
      'بعد الموافقة، تظهر مؤسستكِ في دليل أكاديميات رائدة مع أولوية للشراكات والفعاليات وبرامج التكوين داخل المجتمع.',
    ],
    outcomes: [
      {
        title: 'صفحة رسمية',
        body: 'صفحة خاصة بالأكاديمية أو مركز التدريب كما يراها الزوار.',
        icon: Globe,
      },
      {
        title: 'التعريف والبرامج',
        body: 'عرّفي بالمؤسسة وبرامجها بطريقة واضحة واحترافية.',
        icon: Users,
      },
      {
        title: 'الدورات والتكوينات',
        body: 'اعرضي الدورات والتكوينات ليلتحق بها المهتمات.',
        icon: Briefcase,
      },
      {
        title: 'تواصل وموقع',
        body: 'الموقع الرسمي ومعلومات التواصل في مكان واحد.',
        icon: Megaphone,
      },
    ],
    journeyTitle: 'ماذا تحصلين عليه؟',
    journey: [
      {
        label: 'صفحة رسمية',
        body: 'صفحة خاصة بالأكاديمية أو مركز التدريب.',
      },
      {
        label: 'التعريف والبرامج',
        body: 'التعريف بالمؤسسة وبرامجها.',
      },
      {
        label: 'الدورات',
        body: 'عرض الدورات والتكوينات.',
      },
      {
        label: 'التواصل والدليل',
        body: 'الموقع ومعلومات التواصل + الظهور في دليل أكاديميات رائدة.',
      },
    ],
    idealFor: [
      'لديكِ مركز تدريب أو أكاديمية قائمة',
      'تبحثين عن شريكات وعضوات لبرامجكِ',
      'تريدين حضوراً مؤسسياً داخل شبكة رائدة',
    ],
    accent: 'mauve',
    heroImage:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=1000&fit=crop',
    relatedLinks: [
      { to: '/academies', label: 'دليل الأكاديميات' },
      { to: '/programs', label: 'برامج رائدة' },
      { to: '/partnerships', label: 'الشراكات' },
    ],
  },
}
