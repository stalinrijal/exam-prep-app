import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdminEmail } from '@/lib/utils'
import { BookOpen, LayoutDashboard, FolderOpen, HelpCircle, LogOut, Shield } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email || '')) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-surface-900 fixed inset-y-0">
        <div className="h-16 flex items-center px-5 border-b border-surface-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">ExamPrep</span>
              <span className="ml-1.5 text-xs text-surface-400">Admin</span>
            </div>
          </Link>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 mb-2">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-xs text-brand-400 font-semibold uppercase tracking-wider">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
            { href: '/admin/sets', icon: FolderOpen, label: 'Question Sets' },
            { href: '/admin/questions', icon: HelpCircle, label: 'Questions' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-surface-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <p className="text-xs text-surface-400 truncate">{user.email}</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-2 px-3 py-1.5 text-xs text-surface-500 hover:text-surface-300 transition-colors w-full">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-60">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {children}
        </main>
      </div>
    </div>
  )
}
