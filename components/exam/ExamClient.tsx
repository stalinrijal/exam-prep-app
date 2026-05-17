'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, CheckCircle2, XCircle, RotateCcw, Home, ArrowLeft } from 'lucide-react'
import { cn, shuffle, formatScore } from '@/lib/utils'
import type { ExamSet, Question, ExamResult } from '@/lib/types'

interface Props {
  set: ExamSet
  questions: Question[]
}

type ExamPhase = 'intro' | 'exam' | 'result'

export default function ExamClient({ set, questions: rawQuestions }: Props) {
  const [phase, setPhase] = useState<ExamPhase>('intro')
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<{ question: Question; given: string; correct: boolean }[]>([])
  const [result, setResult] = useState<ExamResult | null>(null)

  const startExam = useCallback(() => {
    setQuestions(shuffle(rawQuestions))
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setAnswers([])
    setResult(null)
    setPhase('exam')
  }, [rawQuestions])

  function handleSelect(option: string) {
    if (revealed) return
    setSelected(option)
  }

  function handleCheck() {
    if (!selected || revealed) return
    setRevealed(true)
  }

  function handleNext() {
    if (!selected) return
    const q = questions[current]
    const correct = selected === q.correct_answer

    const updatedAnswers = [...answers, { question: q, given: selected, correct }]
    setAnswers(updatedAnswers)

    if (current + 1 >= questions.length) {
      // Finish
      const score = updatedAnswers.filter((a) => a.correct).length
      setResult({
        score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        passed: Math.round((score / questions.length) * 100) >= 60,
        answers: updatedAnswers,
      })
      setPhase('result')
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-surface-50 gradient-mesh flex items-center justify-center p-4">
        <div className="w-full max-w-lg card p-10 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <span className="badge-blue mb-3">{set.subject}</span>
          <h1 className="font-display text-2xl font-bold text-surface-900 mt-3 mb-2">{set.title}</h1>
          {set.description && (
            <p className="text-surface-500 text-sm mb-6">{set.description}</p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm text-surface-500 mb-8 py-4 border-y border-surface-100">
            <span><strong className="text-surface-900">{rawQuestions.length}</strong> questions</span>
            <span><strong className="text-surface-900">~{Math.ceil(rawQuestions.length * 1.5)}</strong> minutes</span>
            <span><strong className="text-surface-900">60%</strong> to pass</span>
          </div>
          <button onClick={startExam} className="btn-primary w-full text-base py-3">
            Start exam
            <ChevronRight className="w-4 h-4" />
          </button>
          <Link href="/exam" className="btn-ghost w-full mt-3 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to sets
          </Link>
        </div>
      </div>
    )
  }

  if (phase === 'result' && result) {
    return (
      <div className="min-h-screen bg-surface-50 gradient-mesh">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Score card */}
          <div className={cn(
            'card p-8 text-center mb-6 animate-fade-up',
            result.passed ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
          )}>
            <div className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-display font-extrabold',
              result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}>
              {result.percentage}%
            </div>
            <h2 className="font-display text-2xl font-bold text-surface-900 mb-1">
              {result.passed ? '🎉 You passed!' : 'Keep practising'}
            </h2>
            <p className="text-surface-500 text-sm">
              {result.score} correct out of {result.total} questions
            </p>
          </div>

          {/* Answer review */}
          <div className="card p-6 mb-6 animate-fade-up animation-delay-100">
            <h3 className="font-display font-semibold text-surface-900 mb-4">Answer Review</h3>
            <div className="space-y-4">
              {result.answers.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    {a.correct
                      ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                      : <XCircle className="w-5 h-5 text-red-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800 mb-1">{a.question.question_text}</p>
                    {!a.correct && (
                      <p className="text-xs text-surface-500">
                        Your answer: <span className="text-red-600 font-medium">{a.given}</span>
                        {' · '}
                        Correct: <span className="text-green-700 font-medium">{a.question.correct_answer}</span>
                      </p>
                    )}
                    {a.question.explanation && (
                      <p className="text-xs text-surface-400 mt-1 italic">{a.question.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 animate-fade-up animation-delay-200">
            <button onClick={startExam} className="btn-primary flex-1">
              <RotateCcw className="w-4 h-4" />
              Try again
            </button>
            <Link href="/exam" className="btn-secondary flex-1">
              <Home className="w-4 h-4" />
              All sets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Exam phase
  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-surface-200 z-50">
        <div
          className="h-full gradient-brand transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-surface-200 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/exam" className="btn-ghost text-sm px-2">
            <ArrowLeft className="w-4 h-4" />
            Exit
          </Link>
          <span className="text-sm font-medium text-surface-600">
            {current + 1} / {questions.length}
          </span>
          <span className="text-sm text-surface-400">
            {formatScore(answers.filter((a) => a.correct).length, answers.length || 1)}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-fade-up" key={current}>
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
            Question {current + 1}
          </p>
          <h2 className="font-display text-xl font-semibold text-surface-900 mb-8 text-balance">
            {q.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {(q.options || [q.correct_answer]).map((opt) => {
              const isSelected = selected === opt
              const isCorrect = opt === q.correct_answer

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    'option-btn',
                    !revealed && isSelected && 'selected',
                    revealed && isCorrect && 'correct',
                    revealed && isSelected && !isCorrect && 'incorrect',
                  )}
                >
                  <span className="text-sm">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {revealed && q.explanation && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800 animate-fade-in">
              <strong className="font-semibold">Explanation: </strong>
              {q.explanation}
            </div>
          )}

          {/* Actions */}
          {!revealed ? (
            <button
              onClick={handleCheck}
              disabled={!selected}
              className="btn-primary w-full py-3"
            >
              Check answer
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary w-full py-3">
              {current + 1 >= questions.length ? 'See results' : 'Next question'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
