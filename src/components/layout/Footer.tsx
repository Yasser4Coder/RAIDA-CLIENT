import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, ChevronLeft, ArrowUp } from 'lucide-react'
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from '../ui/SocialIcons'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { navLinks } from '../../data/nav'

const explore = navLinks
const community = [
  { to: '/members', label: 'دليل الأعضاء' },
  { to: '/brands', label: 'العلامات التجارية' },
  { to: '/events', label: 'الفعاليات' },
  { to: '/partnerships', label: 'الشراكات' },
]
const company = [
  { to: '/membership', label: 'العضوية' },
  { to: '/dashboard', label: 'لوحة التحكم' },
  { to: '/#stories', label: 'قصص النجاح' },
  { to: '/membership', label: 'المساعدة' },
]

const socials = [
  { Icon: InstagramIcon, label: 'Instagram' },
  { Icon: LinkedinIcon, label: 'LinkedIn' },
  { Icon: YoutubeIcon, label: 'YouTube' },
]

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative text-white overflow-hidden">
      {/* Soft scroll-edge into footer — not a hard divider */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-transparent to-navy"
        aria-hidden
      />

      <div className="relative bg-navy">
        {/* Atmospheric depth — restrained */}
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-rose/25 to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-rose/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full bg-gold/8 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter strip — one clear job */}
          <div className="pt-14 pb-10 border-b border-white/[0.07]">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-md">
                <p className="text-[12px] font-semibold tracking-[0.04em] text-rose-light/90 mb-2">
                  العضوية
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] leading-snug">
                  جاهزة للانضمام؟
                </h2>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  أنشئي حسابكِ واختاري الخطة التي تناسب مرحلة نموكِ.
                </p>
              </div>

              <div className="w-full lg:max-w-md">
                <Button to="/membership" variant="gold" size="md" className="w-full sm:w-auto">
                  انضمي إلى RAIDA
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main columns */}
          <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-6">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-4">
              <Logo variant="light" size="lg" className="mb-4" />
              <p className="text-sm text-white/55 leading-relaxed max-w-xs tracking-[0.01em]">
                حيث تلتقي الطموحات بالخبرات والفرص
              </p>
              <p className="mt-2 text-[11px] font-medium tracking-[0.06em] text-gold/85">
                Connect · Grow · Lead
              </p>

              <div className="mt-6 flex gap-2">
                {socials.map(({ Icon, label }) => (
                  <span
                    key={label}
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-white/[0.06] ring-1 ring-white/10 flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4 text-white/75" />
                  </span>
                ))}
              </div>

              <ul className="mt-7 space-y-2.5">
                <li>
                  <a
                    href="mailto:hello@raaida.net"
                    className="inline-flex items-center gap-2.5 text-[13px] text-white/50 hover:text-white/90 transition-colors pressable-soft"
                  >
                    <span className="w-8 h-8 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 text-rose" />
                    </span>
                    hello@raaida.net
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+213555000000"
                    className="inline-flex items-center gap-2.5 text-[13px] text-white/50 hover:text-white/90 transition-colors pressable-soft"
                  >
                    <span className="w-8 h-8 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5 text-rose" />
                    </span>
                    +213 555 000 000
                  </a>
                </li>
                <li className="inline-flex items-start gap-2.5 text-[13px] text-white/50">
                  <span className="w-8 h-8 rounded-[10px] bg-white/[0.06] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-rose" />
                  </span>
                  <span className="pt-1.5">الجزائر العاصمة، الجزائر</span>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h3 className="text-[12px] font-semibold tracking-[0.04em] text-white/90 mb-4">
                استكشفي
              </h3>
              <ul className="space-y-2.5">
                {explore.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-white/45 hover:text-rose-light transition-colors pressable-soft inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div className="lg:col-span-2">
              <h3 className="text-[12px] font-semibold tracking-[0.04em] text-white/90 mb-4">
                المجتمع
              </h3>
              <ul className="space-y-2.5">
                {community.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-white/45 hover:text-rose-light transition-colors pressable-soft inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="lg:col-span-2">
              <h3 className="text-[12px] font-semibold tracking-[0.04em] text-white/90 mb-4">
                المنصة
              </h3>
              <ul className="space-y-2.5">
                {company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-white/45 hover:text-rose-light transition-colors pressable-soft inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="py-5 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/30 tracking-[0.01em]">
              © 2026 RAIDA رائدة. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-5">
              <a href="mailto:hello@raaida.net?subject=سياسة الخصوصية" className="text-[11px] text-white/30 hover:text-white/65 transition-colors">
                سياسة الخصوصية
              </a>
              <a href="mailto:hello@raaida.net?subject=شروط الاستخدام" className="text-[11px] text-white/30 hover:text-white/65 transition-colors">
                شروط الاستخدام
              </a>
              <button
                type="button"
                onClick={scrollTop}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-light/80 hover:text-rose-light pressable-soft"
                aria-label="العودة للأعلى"
              >
                للأعلى
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
