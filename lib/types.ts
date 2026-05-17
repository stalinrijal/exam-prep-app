// ─── Database Types ───────────────────────────────────────────────────────────

export type UserRole = 'learner' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface ExamSet {
  id: string
  title: string
  description: string | null
  subject: string
  is_published: boolean
  created_at: string
  question_count?: number
}

export type QuestionType = 'mcq' | 'true_false' | 'short_answer'

export interface Question {
  id: string
  set_id: string
  question_text: string
  question_type: QuestionType
  options: string[] | null        // for MCQ: ["A) ...", "B) ...", "C) ...", "D) ..."]
  correct_answer: string          // "A", "B", "True", or short answer text
  explanation: string | null      // shown after answering
  order_index: number
  created_at: string
}

export interface AttemptSession {
  id: string
  user_id: string | null          // null = guest
  set_id: string
  score: number | null
  total_questions: number
  completed_at: string | null
  started_at: string
}

export interface AttemptAnswer {
  id: string
  session_id: string
  question_id: string
  given_answer: string
  is_correct: boolean
}

// ─── UI / Component Types ─────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon?: string
}

export interface ExamResult {
  score: number
  total: number
  percentage: number
  passed: boolean
  answers: {
    question: Question
    given: string
    correct: boolean
  }[]
}
