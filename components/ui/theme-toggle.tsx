'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

const iconTransition = {
  duration: 0.16,
  ease: [0.23, 1, 0.32, 1],
} as const

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-surface-elevated hover:border-charcoal cursor-pointer"
      aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
    >
      <AnimatePresence initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -12, scale: 0.94 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 12, scale: 0.94 }}
            transition={iconTransition}
            className="absolute"
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 12, scale: 0.94 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -12, scale: 0.94 }}
            transition={iconTransition}
            className="absolute"
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
