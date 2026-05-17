import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ExamClient from '@/components/exam/ExamClient'
import type { ExamSet, Question } from '@/lib/types'

interface Props {
  params: { setId: string }
}

async function getSetWithQuestions(setId: string): Promise<{ set: ExamSet; questions: Question[] } | null> {
  try {
    const supabase = createClient()

    const { data: set } = await supabase
      .from('exam_sets')
      .select('*')
      .eq('id', setId)
      .eq('is_published', true)
      .single()

    if (!set) return null

    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('set_id', setId)
      .order('order_index', { ascending: true })

    return { set, questions: questions || [] }
  } catch {
    return null
  }
}

export default async function ExamSessionPage({ params }: Props) {
  const result = await getSetWithQuestions(params.setId)

  if (!result) notFound()

  return <ExamClient set={result.set} questions={result.questions} />
}
