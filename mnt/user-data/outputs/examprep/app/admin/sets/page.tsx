import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff, HelpCircle } from 'lucide-react'

export default async function AdminSetsPage() {
  const supabase = createClient()
  const { data: sets } = await supabase
    .from('exam_sets')
    .select('*, question_count:questions(count)')
    .order('created_at', { ascending: false })

  const allSets = (sets || []).map((s: any) => ({
    ...s,
    question_count: s.question_count?.[0]?.count ?? 0,
  }))

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Question Sets</h1>
          <p className="page-subtitle">{allSets.length} set{allSets.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/admin/sets/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          New set
        </Link>
      </div>

      {allSets.length === 0 ? (
        <div className="card p-16 text-center">
          <HelpCircle className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-surface-700 mb-1">No sets yet</h3>
          <p className="text-sm text-surface-400 mb-6">Create your first question set to get started.</p>
          <Link href="/admin/sets/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Create first set
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="text-left px-5 py-3 font-semibold text-surface-600">Title</th>
                <th className="text-left px-5 py-3 font-semibold text-surface-600">Subject</th>
                <th className="text-left px-5 py-3 font-semibold text-surface-600">Questions</th>
                <th className="text-left px-5 py-3 font-semibold text-surface-600">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-surface-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allSets.map((set: any) => (
                <tr key={set.id} className="border-b border-surface-100 last:border-0 hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-surface-900">{set.title}</td>
                  <td className="px-5 py-4">
                    <span className="badge-blue">{set.subject}</span>
                  </td>
                  <td className="px-5 py-4 text-surface-500">{set.question_count}</td>
                  <td className="px-5 py-4">
                    {set.is_published
                      ? <span className="badge-green"><Eye className="w-3 h-3" /> Published</span>
                      : <span className="badge-gray"><EyeOff className="w-3 h-3" /> Draft</span>
                    }
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/sets/${set.id}`} className="btn-ghost text-xs px-3">
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
