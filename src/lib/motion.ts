import { useReducedMotion } from 'motion/react'

/** Apple-mapped spring presets (damping ratio ≈ bounce inverse, response ≈ duration) */
export const springs = {
  /** Default UI — critically damped, no overshoot */
  snappy: { type: 'spring' as const, bounce: 0, duration: 0.35 },
  /** Reposition / panels */
  settle: { type: 'spring' as const, bounce: 0, duration: 0.4 },
  /** Drawer / sheet — slight bounce when momentum-driven */
  sheet: { type: 'spring' as const, bounce: 0.15, duration: 0.35 },
  /** Momentum flick */
  flick: { type: 'spring' as const, bounce: 0.2, duration: 0.4 },
}

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
}

export const materialize = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.98, filter: 'blur(4px)' },
}

/** Cross-fade only when user prefers reduced motion */
export function useMotionSafe() {
  const reduce = useReducedMotion()
  return {
    reduce: !!reduce,
    transition: reduce ? { duration: 0.2 } : springs.settle,
    fadeUp: reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
      : fadeUp,
    materialize: reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
      : materialize,
  }
}
