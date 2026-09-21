import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Menu, X, LayoutDashboard, Users, Building2, Calendar,
  Briefcase, BookOpen, GraduationCap, Home, ChevronLeft, School, MessageSquare,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { navLinks, secondaryLinks } from '../../data/nav'
import Button from '../ui/Button'
import Logo from '../ui/Logo'
import { springs, useMotionSafe } from '../../lib/motion'
import { useAuth } from '../../context/AuthContext'

const linkIcons: Record<string, typeof Home> = {
  '/': Home,
  '/community': Users,
  '/experts': GraduationCap,
  '/programs': BookOpen,
  '/services': Briefcase,
  '/brands': Building2,
  '/academies': School,
  '/consultations': MessageSquare,
  '/events': Calendar,
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { reduce, transition } = useMotionSafe()
  const { user } = useAuth()
  const isStaff = user?.role === 'admin' || user?.role === 'super_admin'
  const isAdminPath = location.pathname.startsWith('/admin')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Full-bleed translucent chrome */}
      <div
        className={`relative transition-[background,backdrop-filter,border-color,box-shadow] duration-300 ${
          scrolled || open
            ? 'bg-[rgba(251,249,247,0.78)] backdrop-blur-[24px] saturate-[180%] border-b border-navy/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.65)_inset]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="القائمة الرئيسية">
          <div className="flex items-center justify-between h-16 lg:h-[4.25rem]">
            {/* Logo */}
            <Logo size="md" className="relative z-10" />

            {/* Desktop nav — floating pill track */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className={`flex items-center gap-0.5 p-1 rounded-full transition-colors duration-300 ${
                  scrolled ? 'bg-navy/[0.04]' : 'bg-white/55 ring-1 ring-navy/[0.06] shadow-xs'
                }`}
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className="relative px-2.5 xl:px-3.5 py-2 text-[12px] xl:text-[13px] font-medium tracking-[-0.01em] pressable-soft rounded-full"
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId={reduce ? undefined : 'nav-active-pill'}
                            className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-navy/[0.06]"
                            transition={springs.snappy}
                          />
                        )}
                        <span
                          className={`relative z-10 transition-colors ${
                            isActive ? 'text-navy font-semibold' : 'text-muted hover:text-navy'
                          }`}
                        >
                          {link.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2 relative z-10">
              {!isStaff && !isAdminPath && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-full text-[13px] font-medium text-muted hover:text-navy hover:bg-navy/[0.04] transition-colors pressable-soft"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Link>
              )}
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-navy text-white text-[13px] font-semibold pressable shadow-sm hover:bg-navy-light transition-colors ring-1 ring-gold/20"
              >
                انضمي مجانًا
                <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              className="lg:hidden relative z-10 w-10 h-10 rounded-full flex items-center justify-center pressable text-navy bg-white/70 ring-1 ring-navy/[0.08] shadow-xs"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'close' : 'open'}
                  initial={reduce ? false : { opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={springs.snappy}
                  className="flex"
                >
                  {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Scroll edge — soft fade instead of hard divider */}
        {scrolled && !open && (
          <div
            className="pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-navy/[0.04] to-transparent"
            aria-hidden
          />
        )}
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-navy/25 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              className="fixed top-16 inset-x-0 z-50 lg:hidden mx-3 sm:mx-4 overflow-hidden rounded-[22px] bg-[rgba(251,249,247,0.92)] backdrop-blur-[28px] saturate-[180%] shadow-xl ring-1 ring-navy/[0.08]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98, filter: 'blur(6px)' }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)' }}
              transition={transition}
              style={{ transformOrigin: 'top center' }}
              aria-label="قائمة الجوال"
            >
              <div className="p-2.5">
                {navLinks.map((link, i) => {
                  const Icon = linkIcons[link.to] || Home
                  return (
                    <motion.div
                      key={link.to}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springs.snappy, delay: reduce ? 0 : 0.03 * i }}
                    >
                      <NavLink
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-[15px] font-medium pressable-soft transition-colors ${
                            isActive
                              ? 'bg-navy text-white shadow-sm'
                              : 'text-dark hover:bg-blush/70'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={`w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-white/15' : 'bg-rose-soft'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-rose'}`} />
                            </span>
                            <span className="flex-1">{link.label}</span>
                            <ChevronLeft className={`w-4 h-4 ${isActive ? 'text-white/50' : 'text-muted/50'}`} />
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  )
                })}

                <div className="mt-1 px-2 pb-1">
                  <p className="px-1.5 py-2 text-[11px] font-semibold text-muted">المزيد</p>
                  <div className="flex flex-wrap gap-1.5">
                    {secondaryLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="rounded-full bg-navy/[0.04] px-3 py-1.5 text-[12px] font-medium text-navy hover:bg-blush"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-2 pt-2.5 border-t border-navy/[0.06] grid grid-cols-2 gap-2 px-1 pb-1">
                  {!isStaff && !isAdminPath && (
                    <Button to="/membership" variant="outline" size="sm" className="w-full !rounded-full">
                      العضوية
                    </Button>
                  )}
                  <Button to="/dashboard" variant="gold" size="sm" className={`w-full !rounded-full ${isStaff || isAdminPath ? 'col-span-2' : ''}`}>
                    انضمي مجانًا
                  </Button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
