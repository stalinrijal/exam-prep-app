'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, Save, Loader2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import type { ExamSet, Question } from '@/lib/types'

const EMPTY_QUESTION = {
  question_text: '',
  question_type: 'mcq' as const,
  options: ['', '', '', ''],
  correct_answer: '',
  explanation: '',
}

export default function EditSetPage() {
  const { setId } = useParams<{ setId: string }>()
  const router = useRouter()

  const [set, setSet] = useState<ExamSet | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishLoading, setPublishLoading] = useState(false)

  // New question form state
  const [showForm, setShowForm] = useState(false)
  const [newQ, setNewQ] = useState({ ...EMPTY_QUESTION })
  const [formError, setFormError] = useState('')

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const [{ data: setData }, { data: qData }] = await Promise.all([
      supabase.from('exam_sets').select('*').eq('id', setId).single(),
      supabase.from('questions').select('*').eq('set_id', setId).order('order_index'),
    ])
    setSet(setData)
    setQuestions(qData || [])
    setLoading(false)
  }, [setId])

  useEffect(() => { fetchData() }, [fetchData])

  async function togglePublish() {
    if (!set) return
    setPublishLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('exam_sets')
      .update({ is_published: !set.is_published })
      .eq('id', setId)
    if (!error) setSet({ ...set, is_published: !set.is_published })
    setPublishLoading(false)
  }

  async function addQuestion() {
    if (!newQ.question_text.trim() || !newQ.correct_answer.trim()) {
      setFormError('Question text and correct answer are required.')
      return
    }
    setFormError('')
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('questions').insert({
      set_id: setId,
      question_text: newQ.question_text,
      question_type: newQ.question_type,
      options: newQ.question_type === 'mcq' ? newQ.options.filter(Boolean) : null,
      correct_answer: newQ.correct_answer,
      explanation: newQ.explanation || null,
      order_index: questions.length,
    })
    if (!error) {
      setNewQ({ ...EMPTY_QUESTION })
      setShowForm(false)
      fetchData()
    }
    setSaving(false)
  }

  async function deleteQuestion(id: string) {
    if (!confirm('Delete this question?')) return
    const supabase = createClient()
    await supabase.from('questions').delete().eq('id', id)
    setQuestions((qs) => qs.filter((q) => q.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!set) {
    return <div className="text-center py-24 text-surface-500">Set not found.</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <Link href="/admin/sets" className="btn-ghost text-sm mb-3 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            All sets
          </Link>
          <h1 className="page-title">{set.title}</h1>
          <p className="page-subtitle">{set.subject} · {questions.length} questions</p>
        </div>
        <button
          onClick={togglePublish}
          disabled={publishLoading}
          className={set.is_published ? 'btn-secondary text-sm' : 'btn-primary text-sm'}
        >
          {publishLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {set.is_published ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish</>}
        </button>
      </div>

      {/* Questions list */}
      <div className="card mb-4">
        {questions.length === 0 ? (
          <div className="p-12 text-center text-surface-400 text-sm">
            No questions yet. Add your first question below.
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-start gap-3 p-4 group">
                <GripVertical className="w-4 h-4 text-surface-300 mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 mb-1">
                    <span className="text-surface-400 mr-2">#{i + 1}</span>
                    {q.question_text}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-gray">{q.question_type}</span>
                    <span className="text-xs text-green-700 font-medium">✓ {q.correct_answer}</span>
                    {q.explanation && <span className="text-xs text-surface-400 italic">Has explanation</span>}
                  </div>
                </div>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add question form */}
      <div className="card mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-between p-5 text-sm font-semibold text-surface-700 hover:text-surface-900"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </span>
          {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showForm && (
          <div className="px-5 pb-5 border-t border-surface-100 pt-5 space-y-4">
            {formError && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {formError}
              </div>
            )}

            <div>
              <label className="label">Question Type</label>
              <select
                value={newQ.question_type}
                onChange={(e) => setNewQ({ ...newQ, question_type: e.target.value as any })}
                className="input"
              >
                <option value="mcq">Multiple Choice (MCQ)</option>
                <option value="true_false">True / False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>

            <div>
              <label className="label">Question Text *</label>
              <textarea
                value={newQ.question_text}
                onChange={(e) => setNewQ({ ...newQ, question_text: e.target.value })}
                className="input resize-none"
                rows={2}
                placeholder="Enter the question…"
              />
            </div>

            {newQ.question_type === 'mcq' && (
              <div>
                <label className="label">Answer Options</label>
                <div className="space-y-2">
                  {newQ.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const opts = [...newQ.options]
                        opts[i] = e.target.value
                        setNewQ({ ...newQ, options: opts })
                      }}
                      className="input"
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {newQ.question_type === 'true_false' && (
              <div>
                <label className="label">Correct Answer *</label>
                <select
                  value={newQ.correct_answer}
                  onChange={(e) => setNewQ({ ...newQ, correct_answer: e.target.value })}
                  className="input"
                >
                  <option value="">Select…</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              </div>
            )}

            {newQ.question_type !== 'true_false' && (
              <div>
                <label className="label">
                  Correct Answer *
                  {newQ.question_type === 'mcq' && (
                    <span className="font-normal text-surface-400"> (must match one of the options above)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={newQ.correct_answer}
                  onChange={(e) => setNewQ({ ...newQ, correct_answer: e.target.value })}
                  className="input"
                  placeholder={newQ.question_type === 'mcq' ? 'e.g. Option A text exactly' : 'Short answer text'}
                />
              </div>
            )}

            <div>
              <label className="label">Explanation (optional)</label>
              <textarea
                value={newQ.explanation}
                onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })}
                className="input resize-none"
                rows={2}
                placeholder="Explain why this is the correct answer…"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={addQuestion} className="btn-primary text-sm" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" />
                Save question
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
