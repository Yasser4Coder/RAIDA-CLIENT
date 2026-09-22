import { ExternalLink, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { springs, useMotionSafe } from '../../lib/motion'

const PHOTO_SRC = '/images/nour-soudani.jpeg'
const LOGO_SRC = '/images/chic-de-noor-logo.jpeg'

export default function CommunityManagerSection() {
  const { reduce } = useMotionSafe()

  return (
    <section
      id="community-manager"
      className="relative isolate overflow-hidden scroll-mt-24"
      aria-labelledby="community-manager-heading"
    >
      <div className="absolute inset-0 -z-10 bg-navy" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 -left-20 w-[min(80vw,560px)] h-[560px] rounded-full bg-rose/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-16 w-[min(70vw,480px)] h-[480px] rounded-full bg-gold/25 blur-3xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] hero-dot-grid" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <motion.figure
              className="relative mx-auto max-w-sm lg:max-w-none"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={springs.settle}
            >
              <div
                className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-gold/45 via-rose/20 to-transparent blur-[2px]"
                aria-hidden
              />
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden ring-1 ring-white/15 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.55)] bg-[#2a1a24]">
                <motion.img
                  src={PHOTO_SRC}
                  alt="سوداني نور الهدى — مديرة مجتمع رائدة وصاحبة Chic de Noor"
                  className="absolute inset-0 w-full h-full object-cover object-[center_18%]"
                  initial={reduce ? false : { scale: 1.06 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...springs.settle, duration: 0.85 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                <figcaption className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-gold uppercase">
                      Chic de Noor
                    </p>
                    <p className="mt-0.5 text-[12px] text-white/70">L&apos;élégance de la femme moderne</p>
                  </div>
                  <img
                    src={LOGO_SRC}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/25 shrink-0"
                  />
                </figcaption>
              </div>
            </motion.figure>
          </Reveal>

          <div className="lg:col-span-7 text-white">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[12px] font-semibold text-gold ring-1 ring-gold/35 mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                مديرة مجتمع رائدة
              </div>

              <h2
                id="community-manager-heading"
                className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-[-0.03em] leading-[1.12]"
              >
                سوداني نور الهدى
              </h2>

              <p className="mt-3 text-[15px] sm:text-base text-gold font-semibold">
                صاحبة مؤسسة Chic de Noor
              </p>

              <p className="mt-6 text-[15px] sm:text-lg text-white/72 leading-relaxed max-w-xl">
                رائدة أعمال تقود مجتمع رائدة بروح القرب والدعم — وفي الوقت نفسه تؤسس علامة
                Chic de Noor لأناقة المرأة العصرية، بحضور يتجاوز مئات الآلاف من المتابعات.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row flex-wrap gap-3">
                <Button to="/community" variant="gold" size="md">
                  انضمي إلى المجتمع
                </Button>
                <a
                  href="https://www.instagram.com/chic.de.noor.dz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-[13px] font-semibold text-white/90 ring-1 ring-white/20 hover:bg-white/10 transition-colors pressable"
                >
                  Instagram
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
                <a
                  href="https://chic-de-noor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-[13px] font-semibold text-white/75 hover:text-white transition-colors pressable-soft"
                >
                  chic-de-noor.com
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
