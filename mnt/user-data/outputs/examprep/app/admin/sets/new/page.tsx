'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function NewSetPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: dbError } = await supabase
      .from('exam_sets')
      .insert({ title, subject, description, is_published: false })
      .select()
      .single()

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    router.push(`/admin/sets/${data.id}`)
  }

  return (
    <div>
      <div className="page-header">
        <Link href="/admin/sets" className="btn-ghost text-sm mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to sets
        </Link>
        <h1 className="page-title">Create Question Set</h1>
        <p className="page-subtitle">Add a title and subject, then add questions.</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="card p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Set Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="e.g. Mock Test 1 — Civil Services"
              required
            />
          </div>

          <div>
            <label className="label">Subject / Category *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input"
              placeholder="e.g. General Knowledge"
              required
            />
          </div>

          <div>
            <label className="label">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input resize-none"
              rows={3}
              placeholder="Brief description of this question set…"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              {loading ? 'Creating…' : 'Create set'}
            </button>
            <Link href="/admin/sets" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
