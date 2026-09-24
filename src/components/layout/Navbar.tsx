import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu, X, LayoutDashboard, Users, Building2, Calendar,
  Briefcase, BookOpen, GraduationCap, Home, ChevronLeft, School, MessageSquare,
  Trophy, CreditCard, LogOut, Shield, ChevronDown,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { navLinks, secondaryLinks } from '../../data/nav'
import Button from '../ui/Button'
import Logo from '../ui/Logo'
import { springs, useMotionSafe } from '../../lib/motion'
import { useAuth } from '../../context/AuthContext'
import { canAccessAdminPanel, ROLE_LABELS } from '../../lib/plans'
import {
  displayNameFromAuth,
  initialsFrom,
  postAuthPath,
} from '../../lib/authRedirect'

const linkIcons: Record<string, typeof Home> = {
  '/': Home,
  '/opportunities': Trophy,
  '/programs': BookOpen,
  '/experts': GraduationCap,
  '/services': Briefcase,
  '/events': Calendar,
  '/membership': CreditCard,
  '/community': Users,
  '/consultations': MessageSquare,
  '/brands': Building2,
  '/academies': School,
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { reduce, transition } = useMotionSafe()
  const { user, profile, loading, logout } = useAuth()
  const isStaff = canAccessAdminPanel(user?.role)
  const isAdminPath = location.pathname.startsWith('/admin')
  const homePath = postAuthPath(user?.role)
  const label = displayNameFromAuth(profile?.name, user?.email)
  const initials = initialsFrom(profile?.name || user?.email)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className={`relative transition-[background,backdrop-filter,border-color,box-shadow] duration-300 ${
          scrolled || open
            ? 'bg-[rgba(251,249,247,0.78)] backdrop-blur-[24px] saturate-[180%] border-b border-navy/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.65)_inset]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="القائمة الرئيسية">
          <div className="flex items-center justify-between h-16 lg:h-[4.25rem]">
            <Logo size="md" className="relative z-10" />

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

            <div className="hidden lg:flex items-center gap-2 relative z-10">
              {loading ? (
                <div className="h-10 w-28 rounded-full bg-navy/5 animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    to={homePath}
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-full text-[13px] font-medium text-muted hover:text-navy hover:bg-navy/[0.04] transition-colors pressable-soft"
                  >
                    {isStaff ? <Shield className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                    {isStaff ? 'الإدارة' : 'لوحتي'}
                  </Link>

                  <div className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setMenuOpen((v) => !v)}
                      className="inline-flex items-center gap-2 h-10 pl-2 pr-3 rounded-full bg-navy text-white text-[13px] font-semibold pressable shadow-sm hover:bg-navy-light transition-colors ring-1 ring-gold/20"
                      aria-expanded={menuOpen}
                      aria-haspopup="menu"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-[11px] font-bold text-gold">
                        {initials}
                      </span>
                      <span className="max-w-[7.5rem] truncate">{label.split(' ')[0]}</span>
                      <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {menuOpen && (
                        <motion.div
                          role="menu"
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
                          transition={springs.snappy}
                          className="absolute left-0 mt-2 w-60 overflow-hidden rounded-[18px] bg-white shadow-lg ring-1 ring-navy/10"
                        >
                          <div className="border-b border-navy/6 px-4 py-3">
                            <p className="truncate text-[13px] font-bold text-navy">{label}</p>
                            <p className="mt-0.5 truncate text-[11px] text-muted">{user.email}</p>
                            <p className="mt-2 inline-flex rounded-full bg-ivory px-2 py-0.5 text-[10px] font-semibold text-navy ring-1 ring-navy/8">
                              {ROLE_LABELS[user.role] || user.role}
                            </p>
                          </div>
                          <div className="p-1.5">
                            <Link
                              to={homePath}
                              role="menuitem"
                              className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[13px] font-medium text-navy hover:bg-ivory"
                            >
                              {isStaff ? <Shield className="w-4 h-4 text-gold-dark" /> : <LayoutDashboard className="w-4 h-4 text-rose" />}
                              {isStaff ? 'لوحة الإدارة' : 'لوحة التحكم'}
                            </Link>
                            {!isStaff && (
                              <Link
                                to="/membership"
                                role="menuitem"
                                className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[13px] font-medium text-navy hover:bg-ivory"
                              >
                                <CreditCard className="w-4 h-4 text-rose" />
                                العضوية
                              </Link>
                            )}
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => void handleLogout()}
                              className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[13px] font-medium text-rose hover:bg-rose-soft/60"
                            >
                              <LogOut className="w-4 h-4" />
                              تسجيل الخروج
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-full text-[13px] font-medium text-muted hover:text-navy hover:bg-navy/[0.04] transition-colors pressable-soft"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-navy text-white text-[13px] font-semibold pressable shadow-sm hover:bg-navy-light transition-colors ring-1 ring-gold/20"
                  >
                    انضم مجانًا
                    <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
                  </Link>
                </>
              )}
            </div>

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

        {scrolled && !open && (
          <div
            className="pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-navy/[0.04] to-transparent"
            aria-hidden
          />
        )}
      </div>

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
                {user && (
                  <div className="mb-2 flex items-center gap-3 rounded-[16px] bg-navy px-3.5 py-3 text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gold/20 text-sm font-bold text-gold">
                      {initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold">{label}</p>
                      <p className="truncate text-[11px] text-white/55">{user.email}</p>
                    </div>
                  </div>
                )}

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

                <div className="mt-2 pt-2.5 border-t border-navy/[0.06] grid gap-2 px-1 pb-1">
                  {user ? (
                    <>
                      <Button to={homePath} variant="gold" size="sm" className="w-full !rounded-full">
                        {isStaff ? 'لوحة الإدارة' : 'لوحة التحكم'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full !rounded-full"
                        onClick={() => void handleLogout()}
                      >
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {!isAdminPath && (
                        <Button to="/membership" variant="outline" size="sm" className="w-full !rounded-full">
                          العضوية
                        </Button>
                      )}
                      <Button
                        to="/dashboard"
                        variant="gold"
                        size="sm"
                        className={`w-full !rounded-full ${isAdminPath ? 'col-span-2' : ''}`}
                      >
                        انضم مجانًا
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
