import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useInView } from 'motion/react'
import { springs, useMotionSafe } from '../../lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/** Animate into view from presentation-ready state; interruptible via Motion springs */
export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const { fadeUp, transition } = useMotionSafe()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={fadeUp.initial}
      animate={inView ? fadeUp.animate : fadeUp.initial}
      transition={{ ...transition, delay: delay * 0.06 }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-6% 0px' })
  const { reduce } = useMotionSafe()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : 0.06,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { fadeUp, transition } = useMotionSafe()
  return (
    <motion.div
      className={className}
      variants={{
        hidden: fadeUp.initial,
        show: { ...fadeUp.animate, transition: transition ?? springs.settle },
      }}
    >
      {children}
    </motion.div>
  )
}
