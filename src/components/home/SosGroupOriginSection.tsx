import { Link } from 'react-router-dom'
import { Building2, ChevronLeft } from 'lucide-react'
import Reveal from '../ui/Reveal'

export default function SosGroupOriginSection() {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-2" aria-labelledby="sos-group-origin-heading">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="rounded-[22px] bg-navy text-white p-6 sm:p-8 shadow-xl shadow-navy/20 ring-1 ring-gold/25 relative overflow-hidden">
            <div
              className="pointer-events-none absolute -top-16 -left-10 w-48 h-48 rounded-full bg-rose/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-12 -right-8 w-40 h-40 rounded-full bg-gold/15 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 ring-1 ring-white/15">
                <Building2 className="w-5 h-5 text-gold" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-gold/90 uppercase">
                  SOS Group
                </p>
                <h2
                  id="sos-group-origin-heading"
                  className="mt-1 text-lg sm:text-xl font-extrabold tracking-[-0.02em] leading-snug"
                >
                  RAIDA رائدة — من ابتكار وإنشاء SOS Group
                </h2>
                <p className="mt-2 text-[13px] sm:text-sm text-white/65 leading-relaxed max-w-2xl">
                  المنصّة والهوية والمنظومة التشغيلية ابتُكرت لتمكين رائدات الأعمال، مع تكامل SOS
                  Store ضمن حلول واحدة.
                </p>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-full text-[13px] font-semibold bg-gold text-navy hover:bg-gold-light transition-colors pressable shrink-0 self-start sm:self-center"
              >
                عن رائدة
                <ChevronLeft className="w-4 h-4 opacity-80" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
