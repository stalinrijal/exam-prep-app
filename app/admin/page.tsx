import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FolderOpen, HelpCircle, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react'

export default async function AdminPage() {
  const supabase = createClient()

  const [{ count: setsCount }, { count: questionsCount }, { count: usersCount }, { count: attemptsCount }] = await Promise.all([
    supabase.from('exam_sets').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('attempt_sessions').select('*', { count: 'exact', head: true }).not('completed_at', 'is', null),
  ])

  const stats = [
    { icon: FolderOpen, label: 'Question Sets', value: setsCount ?? 0, href: '/admin/sets', color: 'text-brand-500', bg: 'bg-brand-50' },
    { icon: HelpCircle, label: 'Questions', value: questionsCount ?? 0, href: '/admin/questions', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Users, label: 'Learners', value: usersCount ?? 0, href: '#', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: TrendingUp, label: 'Completed Exams', value: attemptsCount ?? 0, href: '#', color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Admin Overview</h1>
          <p className="page-subtitle">Manage your exam content and monitor activity.</p>
        </div>
        <Link href="/admin/sets/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          New set
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 transition-all duration-200">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-surface-900">{s.value}</p>
            <p className="text-sm text-surface-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-surface-900">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            {[
              { href: '/admin/sets/new', label: 'Create new question set', icon: FolderOpen },
              { href: '/admin/questions/new', label: 'Add a question', icon: HelpCircle },
              { href: '/admin/sets', label: 'Manage all sets', icon: ArrowRight },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                  <a.icon className="w-4 h-4 text-surface-600 group-hover:text-brand-500 transition-colors" />
                </div>
                <span className="text-sm font-medium text-surface-700 group-hover:text-surface-900">{a.label}</span>
                <ArrowRight className="w-4 h-4 text-surface-300 ml-auto group-hover:text-brand-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-surface-900 mb-4">Getting Started</h2>
          <ol className="space-y-3">
            {[
              'Create a question set (e.g. "Mock Test 1")',
              'Add questions with options and correct answers',
              'Add explanations to help learners understand',
              'Publish the set — learners can start practising!',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-surface-600">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
