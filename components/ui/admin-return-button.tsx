'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import { motion } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

export function AdminReturnButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    void supabase.auth.getUser().then(({ data, error }) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(data.user) && !error)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && isMounted) {
        setIsAuthenticated(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (!isAuthenticated) return null

  return (
    <motion.div
      initial={{ opacity: 0, transform: 'translateY(12px)' }}
      animate={{ opacity: 1, transform: 'translateY(0)' }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-5 left-5 z-40 sm:bottom-6 sm:left-6"
    >
      <Link
        href="/admin"
        prefetch={false}
        className="inline-flex h-12 items-center justify-center gap-2 border border-accent bg-accent px-3 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-accent/20 transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-accent-light hover:bg-accent-light active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-4"
        aria-label="Kembali ke admin panel"
      >
        <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Admin Panel</span>
      </Link>
    </motion.div>
  )
}
