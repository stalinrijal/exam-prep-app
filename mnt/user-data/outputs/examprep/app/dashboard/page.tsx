import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, TrendingUp, Target, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch recent attempts
  const { data: sessions } = await supabase
    .from('attempt_sessions')
    .select('*, exam_sets(title, subject)')
    .eq('user_id', user?.id)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(5)

  const attempts = sessions || []
  const totalAttempts = attempts.length
  const avgScore = totalAttempts > 0
    ? Math.round(attempts.reduce((sum: number, a: any) => sum + ((a.score / a.total_questions) * 100), 0) / totalAttempts)
    : 0

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hey, {name} 👋</h1>
        <p className="page-subtitle">Here&apos;s your progress overview.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Attempts', value: totalAttempts, color: 'text-brand-500', bg: 'bg-brand-50' },
          { icon: TrendingUp, label: 'Avg. Score', value: `${avgScore}%`, color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Target, label: 'Pass Rate', value: totalAttempts > 0 ? `${Math.round((attempts.filter((a: any) => (a.score / a.total_questions) >= 0.6).length / totalAttempts) * 100)}%` : '—', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-surface-900">{stat.value}</p>
            <p className="text-sm text-surface-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent attempts */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-surface-900">Recent Attempts</h2>
          <Link href="/exam" className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
            Browse sets <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-surface-400 text-sm mb-4">No attempts yet. Start practising!</p>
            <Link href="/exam" className="btn-primary text-sm">Browse question sets</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((a: any) => {
              const pct = Math.round((a.score / a.total_questions) * 100)
              const passed = pct >= 60
              return (
                <div key={a.id} className="flex items-center gap-4 py-3 border-b border-surface-100 last:border-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {pct}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">{a.exam_sets?.title}</p>
                    <p className="text-xs text-surface-400">
                      {a.score}/{a.total_questions} correct ·{' '}
                      {new Date(a.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={passed ? 'badge-green' : 'badge-red'}>
                    {passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Link href="/exam" className="btn-primary">
        <BookOpen className="w-4 h-4" />
        Start new practice session
      </Link>
    </div>
  )
}
