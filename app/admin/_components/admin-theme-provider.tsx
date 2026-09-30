'use client'

import React, { createContext, useContext, useSyncExternalStore } from 'react'
import { Toaster } from 'sonner'

export type AdminTheme = 'light' | 'dark'

const ADMIN_THEME_STORAGE_KEY = 'snava-admin-theme'
const ADMIN_THEME_EVENT = 'snava-admin-theme-change'

interface AdminThemeContextValue {
  theme: AdminTheme
  setTheme: (theme: AdminTheme) => void
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null)

function applyTheme(theme: AdminTheme) {
  document.documentElement.dataset.adminTheme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(ADMIN_THEME_EVENT, onStoreChange)
  return () => window.removeEventListener(ADMIN_THEME_EVENT, onStoreChange)
}

function getThemeSnapshot(): AdminTheme {
  return document.documentElement.dataset.adminTheme === 'dark' ? 'dark' : 'light'
}

function getServerThemeSnapshot(): AdminTheme {
  return 'light'
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  )

  function setTheme(nextTheme: AdminTheme) {
    applyTheme(nextTheme)
    try {
      window.localStorage?.setItem(ADMIN_THEME_STORAGE_KEY, nextTheme)
    } catch {
      // Theme switching still works when storage is blocked or unavailable.
    }
    window.dispatchEvent(new Event(ADMIN_THEME_EVENT))
  }

  const toastStyle =
    theme === 'dark'
      ? {
          background: '#18181b',
          border: '1px solid #27272a',
          color: '#fafafa',
        }
      : {
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          color: '#18181b',
        }

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme }}>
      {children}
      <Toaster
        theme={theme}
        position="top-right"
        richColors
        toastOptions={{ style: toastStyle }}
      />
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext)

  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider')
  }

  return context
}
