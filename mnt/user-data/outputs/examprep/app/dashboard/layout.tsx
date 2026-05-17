import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookOpen, LayoutDashboard, Settings, LogOut } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/dashboard')

  const initials = (user.user_metadata?.full_name as string || user.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-surface-200 fixed inset-y-0">
        <div className="h-16 flex items-center px-5 border-b border-surface-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-surface-900 text-sm">ExamPrep</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/exam" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 transition-colors">
            <BookOpen className="w-4 h-4" />
            Question Sets
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-surface-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-surface-900 truncate">
                {user.user_metadata?.full_name || 'Learner'}
              </p>
              <p className="text-xs text-surface-400 truncate">{user.email}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-2 px-3 py-1.5 text-xs text-surface-500 hover:text-surface-700 transition-colors w-full">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-56">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {children}
        </main>
      </div>
    </div>
  )
}
