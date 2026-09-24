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
      'صفحة احترافية، ظهور في الدليل، دورات واستشارات، وأولوية للمعارض والشراكات — لتبني حضوراً تجارياً موثوقاً.',
    audienceTitle: 'لمن صُمّمت هذه العضوية؟',
    audience: [
      'صاحبات المشاريع والعلامات التجارية الناشئة أو النامية',
      'رائدات يبحثن عن ظهور مهني ومبيعات عبر الشبكة',
      'من تريد فتح متجر على SOS Store ضمن منظومة رائدة',
      'من تحتاج تخفيضات على خدمات رقمية وهوية بصرية',
    ],
    story: [
      'عضوية رائدة للأعمال مصمّمة لتكون واجهتكِ الرسمية داخل المنصة: صفحة لعلامتكِ، عرض للمنتجات والخدمات، وروابط تواصل واضحة تساعد الزائرات والعضوات على الوصول إليكِ بسهولة.',
      'إلى جانب الظهور، تحصلين على مسار نمو سنوي: دورات Online، استشارات، أولوية في المعارض والبرامج، وفرص تشبيك حقيقية مع خبيرات وأكاديميات وشركاء SOS Group.',
    ],
    outcomes: [
      {
        title: 'واجهة علامتكِ',
        body: 'صفحة احترافية لمنتجاتكِ وخدماتكِ ومعلومات التواصل — جاهزة للظهور في دليل رائدة.',
        icon: Building2,
      },
      {
        title: 'نمو وتعلّم',
        body: '٤ دورات Online واستشارتان سنويًا لدعم قراراتكِ وتطوير مشروعكِ بخطوات أوضح.',
        icon: BookOpen,
      },
      {
        title: 'فرص السوق',
        body: 'أولوية المعارض والملتقيات، فرص الشراكات، وإمكانية التقديم لـ SOS Store.',
        icon: Store,
      },
      {
        title: 'توفير على الخدمات',
        body: '٣٠٪ تخفيض على خدمات SOS Group: مواقع، تطبيقات، متاجر، تصميم وهوية، واستشارات.',
        icon: Sparkles,
      },
    ],
    journeyTitle: 'ماذا تتوقعين بعد التفعيل؟',
    journey: [
      {
        label: 'الظهور',
        body: 'تفعيل صفحتكِ في الدليل وربط علامتكِ بشبكة العضوات.',
      },
      {
        label: 'التعلّم',
        body: 'اختيار دوراتكِ السنوية وحجز الاستشارات حسب احتياج مشروعكِ.',
      },
      {
        label: 'الفرص',
        body: 'متابعة دعوات المعارض والشراكات والترويج داخل المجتمع.',
      },
      {
        label: 'التوسع',
        body: 'التقديم على SOS Store والاستفادة من تخفيضات الخدمات الرقمية.',
      },
    ],
    idealFor: [
      'لديكِ منتج أو خدمة وتريدين حضوراً احترافياً',
      'تبحثين عن عميلات وشراكات داخل مجتمع نسائي موثوق',
      'تحتاجين دعماً عملياً (دورات + استشارات) خلال السنة',
    ],
    accent: 'gold',
    heroImage:
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1600&h=1000&fit=crop',
    relatedLinks: [
      { to: '/brands', label: 'دليل العلامات' },
      { to: '/sos-store', label: 'SOS Store' },
      { to: '/opportunities', label: 'الفرص' },
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
    headline: 'عضوية تُظهر مؤسستكِ وتفتح شراكات برامج رائدة',
    pitch:
      'صفحة رسمية لمؤسستكِ، عرض البرامج والدورات، وظهور في دليل الأكاديميات مع أولوية للشراكات والفعاليات.',
    audienceTitle: 'لمن صُمّمت هذه العضوية؟',
    audience: [
      'الأكاديميات ومراكز التكوين والتدريب',
      'مؤسسات تقدّم برامج مهنية وتبحث عن شريكات وعضوات',
      'مراكز تريد حضوراً رسمياً داخل منظومة رائدة',
      'من تسعى لأولوية تقديم برامج داخل المجتمع',
    ],
    story: [
      'عضوية رائدة للأكاديميات تمنحكِ حضوراً مؤسسياً واضحاً: تعريف بالمؤسسة، برامجها، دوراتها، وروابط رسمية تساعد الرائدات على اكتشاف عروضكِ والالتحاق بها.',
      'الأولوية هنا للشراكة: تقديم تكوينات داخل رائدة، المشاركة في المعارض والملتقيات، والاندماج في برامج أوسع مع SOS Group ومجتمع العضوات.',
    ],
    outcomes: [
      {
        title: 'صفحة المؤسسة',
        body: 'واجهة رسمية للأكاديمية أو المركز مع برامجكِ ومعلومات التواصل.',
        icon: Globe,
      },
      {
        title: 'دليل الأكاديميات',
        body: 'ظهور في دليل يوجّه الرائدات نحو مراكز تدريب موثوقة.',
        icon: Users,
      },
      {
        title: 'شراكات البرامج',
        body: 'أولوية تقديم تكوينات وبرامج داخل رائدة والتعاون مع الشبكة.',
        icon: Briefcase,
      },
      {
        title: 'ترويج مؤسسي',
        body: 'فرص ظهور في الملتقيات والمعارض وقنوات المجتمع.',
        icon: Megaphone,
      },
    ],
    journeyTitle: 'كيف تعمل العضوية لمؤسستكِ؟',
    journey: [
      {
        label: 'التفعيل',
        body: 'إعداد الصفحة الرسمية وعرض البرامج والدورات.',
      },
      {
        label: 'الاكتشاف',
        body: 'الظهور في دليل الأكاديميات أمام عضوات رائدة.',
      },
      {
        label: 'الشراكة',
        body: 'فرص تقديم برامج مشتركة والمشاركة في الفعاليات.',
      },
      {
        label: 'النمو',
        body: 'توسيع الوصول عبر الترويج والخصومات على خدمات SOS Group.',
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
