import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from './_components/admin-sidebar'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-zinc-950">
      <AdminSidebar user={{ email: user.email }} />
      <div className="flex min-w-0 flex-col md:pl-64">
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <div className="mx-auto min-w-0 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
