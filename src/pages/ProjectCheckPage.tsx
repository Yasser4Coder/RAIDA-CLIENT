import { useMemo, useState } from 'react'
import { ClipboardCheck, ChevronLeft, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import SeoHead from '../components/seo/SeoHead'
import { breadcrumbJsonLd } from '../lib/seo'

const questions = [
  {
    id: 'idea',
    text: 'هل فكرة مشروعكِ واضحة ومحددة؟',
    weight: 1,
  },
  {
    id: 'legal',
    text: 'هل أنجزتِ الجوانب القانونية الأساسية (تسجيل، عقود، علامة)؟',
    weight: 1.2,
  },
  {
    id: 'offer',
    text: 'هل لديكِ عرض واضح للمنتج/الخدمة والسعر؟',
    weight: 1,
  },
  {
    id: 'customers',
    text: 'هل تعرفين عميلتكِ المثالية وكيف تصلين إليها؟',
    weight: 1.1,
  },
  {
    id: 'sales',
    text: 'هل لديكِ مبيعات أو طلبات فعلية خلال آخر 3 أشهر؟',
    weight: 1.2,
  },
  {
    id: 'ops',
    text: 'هل تديرين العمليات (مخزون، فريق، مالية) بشكل منظم؟',
    weight: 1,
  },
  {
    id: 'digital',
    text: 'هل حضوركِ الرقمي (موقع/متجر/سوشيال) جاهز للبيع؟',
    weight: 1,
  },
  {
    id: 'support',
    text: 'هل سبق واستفدتِ من استشارة أو تدريب متخصص؟',
    weight: 0.8,
  },
] as const

type Answer = 0 | 1 | 2 // لا / جزئيًا / نعم

const answerLabels: Record<Answer, string> = {
  0: 'لا',
  1: 'جزئيًا',
  2: 'نعم',
}

export default function ProjectCheckPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Record<string, Answer>>>({})
  const [done, setDone] = useState(false)

  const current = questions[step]
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100)

  const result = useMemo(() => {
    if (!done) return null
    let score = 0
    let max = 0
    for (const q of questions) {
      const a = answers[q.id] ?? 0
      score += (a / 2) * q.weight
      max += q.weight
    }
    const pct = Math.round((score / max) * 100)
    const gaps = questions
      .filter((q) => (answers[q.id] ?? 0) < 2)
      .map((q) => q.text.replace('؟', ''))
      .slice(0, 4)

    let level = 'فكرة ناشئة'
    let next = 'ابدئي بتوضيح العرض والعميلة المثالية، ثم اطلبي استشارة تأسيس.'
    let links = [
      { to: '/consultations', label: 'اطلبي استشارة' },
      { to: '/programs', label: 'البرامج التدريبية' },
    ]
    if (pct >= 70) {
      level = 'جاهزية عالية'
      next = 'ركّزي على النمو: عضوية مهنية، فرص، ومتجر SOS Store.'
      links = [
        { to: '/membership', label: 'العضوية المهنية' },
        { to: '/opportunities', label: 'الفرص' },
        { to: '/sos-store', label: 'SOS Store' },
      ]
    } else if (pct >= 40) {
      level = 'قيد البناء'
      next = 'طوّري نقاط الضعف عبر خدمة متخصصة أو مسار تدريبي، ثم ارتقي للعضوية.'
      links = [
        { to: '/services', label: 'اطلبي خدمة' },
        { to: '/programs', label: 'البرامج' },
        { to: '/membership', label: 'العضوية' },
      ]
    }

    return { pct, level, next, gaps, links }
  }, [answers, done])

  const selectAnswer = (value: Answer) => {
    const nextAnswers = { ...answers, [current.id]: value }
    setAnswers(nextAnswers)
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <SeoHead
        title={`اختبري مشروعك | رائدة`}
        description="أداة مجانية لتقييم جاهزية مشروعكِ والحصول على الخطوة التالية المقترحة."
        path="/project-check"
        keywords={['اختبار مشروع', 'جاهزية', 'رائدة']}
        jsonLd={breadcrumbJsonLd([
          { name: 'الرئيسية', path: '/' },
          { name: 'اختبري مشروعك', path: '/project-check' },
        ])}
      />

      <section className="relative isolate overflow-hidden pt-28 pb-10">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-soft/90 via-ivory to-ivory" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-navy ring-1 ring-gold/30 mb-4">
            <ClipboardCheck className="w-3.5 h-3.5 text-gold-dark" />
            مجاني · تفاعلي
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight">
            اختبري مشروعكِ
          </h1>
          <p className="mt-3 text-muted text-lg leading-relaxed">
            أجيبي عن أسئلة قصيرة، واحصلي على مستوى الجاهزية والخطوة التالية المقترحة.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        {!done ? (
          <div className="rounded-[24px] bg-white hairline shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between text-[12px] text-muted mb-3">
              <span>
                سؤال {step + 1} من {questions.length}
              </span>
              <span className="tabular-nums font-semibold text-navy">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-ivory overflow-hidden ring-1 ring-navy/5 mb-8">
              <div
                className="h-full rounded-full bg-gold transition-all duration-300"
                style={{ width: `${((step + (answers[current.id] !== undefined ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy leading-snug">{current.text}</h2>
            <div className="mt-8 grid gap-2">
              {([2, 1, 0] as Answer[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectAnswer(value)}
                  className="h-12 rounded-[14px] bg-ivory hover:bg-blush/60 ring-1 ring-navy/8 text-navy font-semibold pressable"
                >
                  {answerLabels[value]}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mt-5 text-[13px] font-semibold text-muted hover:text-navy"
              >
                السؤال السابق
              </button>
            )}
          </div>
        ) : (
          result && (
            <div className="space-y-5">
              <div className="rounded-[24px] bg-navy text-white p-7 sm:p-9 ring-1 ring-gold/20">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-gold/80 uppercase">
                  نتيجتكِ
                </p>
                <p className="mt-3 text-5xl font-extrabold text-gold tabular-nums">{result.pct}%</p>
                <h2 className="mt-2 text-2xl font-extrabold">{result.level}</h2>
                <p className="mt-3 text-white/70 leading-relaxed">{result.next}</p>
              </div>

              {result.gaps.length > 0 && (
                <div className="rounded-[20px] bg-white hairline p-6">
                  <h3 className="font-extrabold text-navy">نقاط للتحسين</h3>
                  <ul className="mt-4 space-y-2">
                    {result.gaps.map((g) => (
                      <li key={g} className="flex gap-2 text-sm text-muted">
                        <Check className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-[20px] bg-white hairline p-6">
                <h3 className="font-extrabold text-navy mb-4">الخطوة التالية المقترحة</h3>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                  {result.links.map((l) => (
                    <Button key={l.to} to={l.to} variant={l === result.links[0] ? 'gold' : 'outline'} size="md">
                      {l.label}
                      <ChevronLeft className="w-4 h-4 opacity-70" />
                    </Button>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-5 text-[13px] font-semibold text-muted hover:text-navy"
                  onClick={() => {
                    setDone(false)
                    setStep(0)
                    setAnswers({})
                  }}
                >
                  أعيدي الاختبار
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
