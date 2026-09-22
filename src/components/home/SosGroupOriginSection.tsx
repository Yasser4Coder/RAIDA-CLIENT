import { Link } from 'react-router-dom'
import { Building2, ChevronLeft } from 'lucide-react'
import Reveal from '../ui/Reveal'

export default function SosGroupOriginSection() {
  return (
    <section
      className="relative border-y border-navy/[0.06] bg-white/90 backdrop-blur-sm"
      aria-labelledby="sos-group-origin-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4 max-w-2xl">
              <span className="w-12 h-12 rounded-[14px] bg-navy text-gold flex items-center justify-center shrink-0 ring-1 ring-gold/25">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-dark uppercase">
                  الابتكار والملكية
                </p>
                <h2
                  id="sos-group-origin-heading"
                  className="mt-1.5 text-xl sm:text-2xl font-extrabold text-navy tracking-[-0.02em] leading-snug"
                >
                  RAIDA رائدة — من ابتكار وإنشاء SOS Group
                </h2>
                <p className="mt-2.5 text-[14px] sm:text-[15px] text-muted leading-relaxed">
                  المنصّة والهوية والمنظومة التشغيلية ابتُكرت بواسطة SOS Group لتمكين رائدات الأعمال في
                  الجزائر، بما في ذلك التكامل مع SOS Store ضمن حلول واحدة.
                </p>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full text-[13px] font-semibold text-navy bg-rose-soft/80 ring-1 ring-rose/20 hover:bg-blush transition-colors pressable shrink-0 self-start lg:self-center"
            >
              المزيد عن رائدة
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
