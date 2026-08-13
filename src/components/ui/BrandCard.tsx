import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'motion/react'
import type { Brand } from '../../types/api'
import { springs, useMotionSafe } from '../../lib/motion'

const placeholder =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop'

export default function BrandCard({
  brand,
  featured = false,
}: {
  brand: Brand
  featured?: boolean
}) {
  const { reduce } = useMotionSafe()

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={springs.snappy}
      className="h-full"
    >
      <Link
        to={`/brands/${brand.id}`}
        className={`group relative flex h-full overflow-hidden rounded-[22px] bg-white hairline shadow-sm pressable ${
          featured ? 'flex-col sm:flex-row' : 'flex-col'
        }`}
      >
        <div
          className={`relative overflow-hidden bg-navy/5 ${
            featured ? 'aspect-[16/10] sm:aspect-auto sm:w-[48%] sm:min-h-[280px]' : 'aspect-[16/10]'
          }`}
        >
          <img
            src={brand.cover || brand.logo || placeholder}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-apple)] group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/15 to-transparent" />

          <span className="absolute top-3 right-3 inline-flex rounded-full material-ultra-thin px-2.5 py-1 text-[11px] font-semibold text-navy ring-1 ring-white/40 shadow-xs">
            {brand.category}
          </span>

          <div className="absolute bottom-3 right-3 left-3 flex items-end gap-3">
            <img
              src={brand.logo || placeholder}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-[12px] object-cover ring-2 ring-white/90 shadow-md shrink-0"
            />
            <div className="min-w-0 pb-0.5">
              <h3
                className={`font-bold text-white tracking-[-0.02em] truncate ${
                  featured ? 'text-lg sm:text-xl' : 'text-[15px]'
                }`}
              >
                {brand.name}
              </h3>
              {brand.founder && (
                <p className="text-[11px] text-white/70 truncate mt-0.5">
                  مؤسسة: {brand.founder.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-7' : 'p-5'}`}>
          <p
            className={`text-muted leading-relaxed ${
              featured ? 'text-[15px] line-clamp-3' : 'text-sm line-clamp-2'
            }`}
          >
            {brand.description}
          </p>

          {Array.isArray(brand.products) && brand.products.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {brand.products.slice(0, featured ? 3 : 2).map((p) => (
                <span
                  key={p}
                  className="inline-flex rounded-full bg-rose-soft/80 px-2.5 py-1 text-[11px] font-medium text-navy ring-1 ring-rose/20"
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-5 flex items-center justify-between border-t border-separator/70">
            <span className="text-[11px] text-muted">{brand.services?.[0] ?? brand.category}</span>
            <span className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-rose transition-all group-hover:gap-1.5">
              زيارة العلامة
              <ChevronLeft className="w-4 h-4 opacity-70" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function BrandRow({ brand }: { brand: Brand }) {
  return (
    <Link
      to={`/brands/${brand.id}`}
      className="group flex items-center gap-4 p-3.5 rounded-[16px] bg-white hairline shadow-xs pressable-soft hover:shadow-sm transition-shadow"
    >
      <img
        src={brand.logo || placeholder}
        alt=""
        className="w-12 h-12 rounded-[12px] object-cover ring-1 ring-navy/5"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[14px] text-navy tracking-[-0.01em] truncate group-hover:text-navy-light transition-colors">
          {brand.name}
        </h4>
        <p className="text-[12px] text-muted truncate">{brand.category}</p>
      </div>
      <ChevronLeft className="w-4 h-4 text-muted opacity-50 group-hover:text-rose group-hover:opacity-100 transition-colors shrink-0" />
    </Link>
  )
}
