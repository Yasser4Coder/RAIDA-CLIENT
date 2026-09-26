import { Link } from 'react-router-dom'
import { ArrowUpLeft, Building2, ChevronLeft, ExternalLink, Sparkles, Store } from 'lucide-react'
import Reveal, { Stagger, StaggerItem } from '../ui/Reveal'

const SOS_BECOME_SELLER = 'https://store.sosgroupdz.com/become-seller'

const links = [
  {
    kind: 'internal' as const,
    to: '/about',
    title: 'عن رائدة',
    desc: 'القصة، الرؤية، وكيف تُمكّن المنصّة رائدات الأعمال.',
    icon: Sparkles,
    primary: true,
    cta: 'اكتشف المزيد',
  },
  {
    kind: 'external' as const,
    href: SOS_BECOME_SELLER,
    title: 'SOS Store',
    desc: 'بِعي منتجاتكِ على متجر SOS Group — تجربة مجانية 30 يومًا ولوحة تحكم للبائعات.',
    icon: Store,
    primary: false,
    cta: 'انضمّي كبائعة',
  },
]

export default function SosGroupOriginSection() {
  return (
    <section
      className="relative overflow-hidden border-y border-separator bg-ivory"
      aria-labelledby="sos-group-origin-heading"
    >
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-rose/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col justify-center">
              <div className="inline-flex items-center gap-2.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-navy text-gold shadow-sm">
                  <Building2 className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-dark">
                  SOS Group
                </span>
              </div>

              <h2
                id="sos-group-origin-heading"
                className="mt-6 font-display text-[1.75rem] font-extrabold leading-[1.2] tracking-[-0.025em] text-navy sm:text-3xl lg:text-[2.15rem]"
              >
                رائدة — من ابتكار وإنشاء{' '}
                <span className="text-gold-dark">SOS Group</span>
              </h2>

              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted sm:text-[16px]">
                المنصّة والهوية والمنظومة التشغيلية ابتُكرت لتمكين رائدات الأعمال، مع تكامل SOS
                Store ضمن حلول واحدة.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-semibold text-navy/55">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose" aria-hidden />
                  ابتكار المنصّة
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                  هوية رائدة
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-mauve" aria-hidden />
                  منظومة واحدة
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Stagger className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {links.map((item) => {
                const Icon = item.icon
                const className = `group relative flex h-full min-h-[11.5rem] flex-col overflow-hidden rounded-[24px] p-5 transition-all pressable sm:p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                  item.primary
                    ? 'bg-navy text-white shadow-md ring-1 ring-gold/25 hover:-translate-y-0.5'
                    : 'bg-white text-navy shadow-xs hairline hover:-translate-y-0.5 hover:shadow-md'
                }`

                const body = (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-[16px] ${
                          item.primary
                            ? 'bg-white/10 text-gold ring-1 ring-inset ring-gold/30'
                            : 'bg-ivory text-gold-dark ring-1 ring-inset ring-gold/25'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      {item.kind === 'external' ? (
                        <ExternalLink
                          className={`h-4 w-4 shrink-0 ${
                            item.primary ? 'text-white/40' : 'text-navy/25'
                          }`}
                          aria-hidden
                        />
                      ) : (
                        <ArrowUpLeft
                          className={`h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 ${
                            item.primary ? 'text-white/40' : 'text-navy/25'
                          }`}
                          aria-hidden
                        />
                      )}
                    </div>

                    <h3
                      className={`mt-auto pt-8 text-[17px] font-extrabold tracking-[-0.01em] ${
                        item.primary ? 'text-white' : 'text-navy'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mt-2 text-[13px] leading-relaxed ${
                        item.primary ? 'text-white/65' : 'text-muted'
                      }`}
                    >
                      {item.desc}
                    </p>
                    <span
                      className={`mt-4 inline-flex items-center gap-1 text-[12px] font-semibold ${
                        item.primary ? 'text-gold' : 'text-rose'
                      }`}
                    >
                      {item.cta}
                      <ChevronLeft className="h-3.5 w-3.5 opacity-70" aria-hidden />
                    </span>
                  </>
                )

                return (
                  <StaggerItem key={item.title} className="h-full">
                    {item.kind === 'external' ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {body}
                      </a>
                    ) : (
                      <Link to={item.to} className={className}>
                        {body}
                      </Link>
                    )}
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  )
}
