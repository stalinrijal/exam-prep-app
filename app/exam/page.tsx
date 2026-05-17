import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, ChevronRight, Clock, HelpCircle } from 'lucide-react'
import type { ExamSet } from '@/lib/types'

async function getSets(): Promise<ExamSet[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('exam_sets')
      .select('*, question_count:questions(count)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    return (data || []).map((s: any) => ({
      ...s,
      question_count: s.question_count?.[0]?.count ?? 0,
    }))
  } catch {
    return []
  }
}

export default async function ExamListPage() {
  const sets = await getSets()

  return (
    <div className="min-h-screen bg-surface-50 gradient-mesh">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-surface-900">ExamPrep</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">Sign in</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">Sign up free</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="page-header">
          <h1 className="page-title">Question Sets</h1>
          <p className="page-subtitle">Choose a set to start practising. No account required.</p>
        </div>

        {sets.length === 0 ? (
          <div className="card p-16 text-center">
            <HelpCircle className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-surface-700 mb-1">No sets published yet</h3>
            <p className="text-sm text-surface-400">Check back soon — new question sets are coming.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sets.map((set, i) => (
              <Link
                key={set.id}
                href={`/exam/${set.id}`}
                className="card p-6 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 transition-all duration-200 animate-fade-up group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="badge-blue">{set.subject}</span>
                  <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                </div>

                <h3 className="font-display font-semibold text-surface-900 mb-1 leading-snug">
                  {set.title}
                </h3>

                {set.description && (
                  <p className="text-sm text-surface-500 mb-4 line-clamp-2">{set.description}</p>
                )}

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-100 text-xs text-surface-400">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    {set.question_count} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{Math.ceil((set.question_count ?? 0) * 1.5)} min
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
