import {
  ShoppingBag,
  ChevronLeft,
  ExternalLink,
  LayoutDashboard,
  Package,
  ClipboardList,
  BadgeCheck,
  Headphones,
  Users,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import Reveal, { Stagger, StaggerItem } from '../components/ui/Reveal'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd, routeSeo } from '../lib/seo'
import { sosStoreBenefits, sosStorePlans, sosStoreSteps } from '../data/platformContent'

const SOS_BECOME_SELLER = 'https://store.sosgroupdz.com/become-seller'
const SOS_SELLER_LOGIN = 'https://store.sosgroupdz.com/seller/login'
const SOS_SUPPORT = 'mailto:support@store.sosgroupdz.com'

const benefitIcons = [Users, LayoutDashboard, BadgeCheck, Headphones]

export default function SosStorePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={routeSeo.sosStore.title}
        description={routeSeo.sosStore.description}
        path={routeSeo.sosStore.path}
        keywords={[...routeSeo.sosStore.keywords]}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'SOS Store', path: '/sos-store' },
        ])}
      />

      <PageHero
        eyebrow="SOS Store · SOS Group"
        icon={<ShoppingBag className="w-3.5 h-3.5 text-rose" />}
        title={
          <>
            بِع منتجاتكِ على منصة{' '}
            <span className="bg-gradient-to-l from-gold-dark via-rose to-mauve bg-clip-text text-transparent">
              SOS Store
            </span>
          </>
        }
        description="انضمّي إلى سوق متعدد البائعين ضمن منظومة SOS Group: أديري طلباتكِ ومنتجاتكِ من لوحة تحكم خاصة، وابنِي نشاطكِ التجاري مع مراجعة جودة ودعم محلي في الجزائر."
      >
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[12px] font-semibold text-gold-dark">
          30 يومًا مجانًا على باقة Starter — بدون دفع مسبق
        </div>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href={SOS_BECOME_SELLER} variant="gold" size="lg">
            ابدئي تجربتكِ المجانية
            <ExternalLink className="w-4 h-4 opacity-70" />
          </Button>
          <Button href="https://store.sosgroupdz.com/" variant="outline" size="lg">
            تصفّحي المتجر
          </Button>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        <Reveal>
          <div className="rounded-[22px] border border-emerald-200/80 bg-gradient-to-l from-emerald-50 via-white to-emerald-50/40 p-6 sm:p-8 shadow-xs">
            <p className="text-[12px] font-bold text-emerald-700">عرض للبائعين الجدد</p>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-extrabold text-navy tracking-[-0.02em]">
              ابدئي بـ <span className="text-emerald-700">0 د.ج</span> — شهر كامل على باقة Starter
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              جرّبي البيع الإلكتروني بكل مميزات الباقة لمدة 30 يومًا: لوحة تحكم، إدارة الطلبات، ومنتجكِ
              الأول على المنصة — <strong className="text-navy">بدون دفع مسبق</strong>. بعد انتهاء
              التجربة، يبدأ الاشتراك بـ 1.000 د.ج/شهر فقط إذا قررتِ الاستمرار.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <p className="text-[12px] font-semibold text-rose text-center">لماذا SOS Store؟</p>
            <h2 className="mt-2 text-center font-display text-2xl font-extrabold text-navy tracking-[-0.02em]">
              مزايا الانضمام كبائعة
            </h2>
            <Stagger className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sosStoreBenefits.map((b, i) => {
                const Icon = benefitIcons[i] ?? ShoppingBag
                return (
                  <StaggerItem key={b.title}>
                    <div className="h-full rounded-[18px] bg-white hairline shadow-xs p-5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-ivory text-gold-dark ring-1 ring-inset ring-gold/25">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="mt-4 text-[15px] font-extrabold text-navy">{b.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">{b.description}</p>
                    </div>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <p className="text-[12px] font-semibold text-rose text-center">كيف يعمل؟</p>
            <h2 className="mt-2 text-center font-display text-2xl font-extrabold text-navy tracking-[-0.02em]">
              أربع خطوات للانضمام كبائعة
            </h2>
            <p className="mt-3 text-center text-sm text-muted max-w-2xl mx-auto">
              العملية بسيطة وشفافة — يُراجع كل طلب يدويًا لضمان جودة التجربة للجميع.
            </p>
            <ol className="mt-8 grid sm:grid-cols-2 gap-3">
              {sosStoreSteps.map((s) => (
                <li
                  key={s.step}
                  className="flex gap-4 rounded-[18px] bg-white hairline shadow-xs p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-navy font-display text-lg font-bold text-white">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-extrabold text-navy">{s.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <p className="text-[12px] font-semibold text-rose text-center">الباقات والأسعار</p>
            <h2 className="mt-2 text-center font-display text-2xl font-extrabold text-navy tracking-[-0.02em]">
              اختاري الباقة المناسبة لنشاطكِ
            </h2>
            <p className="mt-3 text-center text-sm text-muted max-w-2xl mx-auto">
              ابدئي بباقة Starter مجانًا لمدة 30 يومًا. التفعيل يتم بعد مراجعة طلبكِ على متجر SOS.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {sosStorePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex h-full flex-col rounded-[22px] p-6 ${
                    plan.popular
                      ? 'bg-navy text-white shadow-md ring-1 ring-gold/30'
                      : 'bg-white hairline shadow-xs text-navy'
                  }`}
                >
                  {plan.popular ? (
                    <span className="absolute -top-2.5 start-5 rounded-full bg-gold px-3 py-0.5 text-[11px] font-bold text-navy">
                      الأكثر طلبًا
                    </span>
                  ) : null}
                  <p
                    className={`text-[12px] font-semibold ${plan.popular ? 'text-gold' : 'text-rose'}`}
                  >
                    {plan.name}
                  </p>
                  <p
                    className={`mt-1 text-[13px] leading-relaxed ${
                      plan.popular ? 'text-white/65' : 'text-muted'
                    }`}
                  >
                    {plan.tagline}
                  </p>
                  <p className="mt-5 font-display text-3xl font-extrabold tracking-[-0.03em]">
                    {plan.monthlyPriceLabel}
                    <span
                      className={`ms-1 text-sm font-semibold ${
                        plan.popular ? 'text-white/55' : 'text-muted'
                      }`}
                    >
                      /شهر
                    </span>
                  </p>
                  {plan.trialNote ? (
                    <p
                      className={`mt-2 text-[12px] font-semibold ${
                        plan.popular ? 'text-emerald-300' : 'text-emerald-700'
                      }`}
                    >
                      {plan.trialNote}
                    </p>
                  ) : null}
                  <ul className="mt-5 space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2 text-[13px] ${
                          plan.popular ? 'text-white/75' : 'text-muted'
                        }`}
                      >
                        <BadgeCheck
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            plan.popular ? 'text-gold' : 'text-gold-dark'
                          }`}
                          aria-hidden
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href={SOS_BECOME_SELLER}
                    variant={plan.popular ? 'gold' : 'outline'}
                    size="md"
                    className="mt-6 w-full"
                  >
                    قدّمي طلب الانضمام
                  </Button>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-[11px] text-muted leading-relaxed">
              الأسعار بالدينار الجزائري. التجربة المجانية 30 يومًا على باقة Starter — مرة واحدة لكل بائعة.
              التفعيل بعد الموافقة على الطلب.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-[22px] bg-white hairline shadow-xs p-6 sm:p-8">
              <p className="text-[12px] font-semibold text-rose">لوحة التحكم</p>
              <h2 className="mt-2 font-display text-xl font-extrabold text-navy">
                كل ما تحتاجينه في مكان واحد
              </h2>
              <ul className="mt-5 space-y-4">
                {[
                  {
                    icon: Package,
                    title: 'إدارة المنتجات',
                    text: 'أضيفي، عدّلي، وتابعي حالة كل منتج.',
                  },
                  {
                    icon: ClipboardList,
                    title: 'متابعة الطلبات',
                    text: 'استلمي إشعارات وحدّثي حالة التوصيل.',
                  },
                  {
                    icon: BadgeCheck,
                    title: 'حالة المراجعة',
                    text: 'اعرفي متى يكون منتجكِ قيد المراجعة أو منشورًا.',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-ivory text-gold-dark">
                      <item.icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-navy">{item.title}</p>
                      <p className="mt-0.5 text-[13px] text-muted">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[22px] bg-navy text-white p-6 sm:p-8 shadow-md ring-1 ring-gold/20">
              <p className="text-[12px] font-semibold text-gold">سياسة الجودة</p>
              <h2 className="mt-2 font-display text-xl font-extrabold">
                المنتجات لا تُنشر فورًا — وهذا لصالحكِ
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                عند إضافة منتج جديد، يدخل في قائمة <strong className="text-white">قيد المراجعة</strong>.
                فريق SOS يتحقق من المعلومات والصور والأسعار. بعد الموافقة فقط يظهر المنتج للعملاء.
              </p>
              <ul className="mt-5 space-y-2 text-[13px] text-white/75">
                {[
                  'مراجعة يدوية لكل منتج جديد',
                  'رفض أو طلب تعديل مع توضيح السبب',
                  'أولوية مراجعة أعلى للباقات الأعلى',
                  'حماية العملاء = ثقة أكبر في متجركِ',
                ].map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-[22px] bg-white hairline shadow-sm p-8 sm:p-10 text-center max-w-3xl mx-auto">
            <p className="text-[12px] font-semibold text-rose">ابدئي الآن</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-navy tracking-[-0.02em]">
              اطلبي الانضمام كبائعة على SOS Store
            </h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              املئي النموذج على متجر SOS وسيتواصل معكِ الفريق خلال 1–3 أيام عمل لمناقشة طلبكِ وخطوات
              التفعيل. عضوية رائدة تساعدكِ على بناء علامتكِ — والمتجر يفتح لكِ قناة البيع.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button href={SOS_BECOME_SELLER} variant="gold" size="lg">
                الانتقال إلى طلب الانضمام
                <ExternalLink className="w-4 h-4 opacity-70" />
              </Button>
              <Button href={SOS_SELLER_LOGIN} variant="outline" size="lg">
                دخول لوحة البائع
              </Button>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-[13px]">
              <Button to="/membership" variant="soft" size="md">
                عضوية رائدة
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </Button>
              <a
                href={SOS_SUPPORT}
                className="text-muted hover:text-navy transition-colors underline-offset-4 hover:underline"
              >
                support@store.sosgroupdz.com
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
