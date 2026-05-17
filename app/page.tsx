import Link from 'next/link'
import { BookOpen, CheckCircle, Users, Zap, ArrowRight, Star } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Multiple Question Sets',
    desc: 'Practice with curated sets covering every topic in your exam syllabus.',
  },
  {
    icon: CheckCircle,
    title: 'Instant Feedback',
    desc: 'See correct answers and explanations right after each question.',
  },
  {
    icon: Users,
    title: 'Guest or Sign In',
    desc: 'Start practising immediately as a guest. Sign up to save your progress.',
  },
  {
    icon: Zap,
    title: 'Track Your Progress',
    desc: 'View scores, identify weak areas, and improve with every session.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-surface-900">ExamPrep</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">
              Sign in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 animate-fade-in">
          <Star className="w-3 h-3 fill-brand-500 text-brand-500" />
          Free exam preparation platform
        </div>

        <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-surface-900 text-balance leading-[1.1] animate-fade-up">
          Ace your exam with{' '}
          <span className="text-brand-500">focused practice</span>
        </h1>

        <p className="mt-6 text-lg text-surface-500 max-w-2xl mx-auto text-balance animate-fade-up animation-delay-100">
          Practice with real-style questions, get instant explanations, and track every improvement.
          Start right now — no account required.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-200">
          <Link href="/exam" className="btn-primary text-base px-8 py-3">
            Start practising free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/auth/signup" className="btn-secondary text-base px-8 py-3">
            Create free account
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card p-6 animate-fade-up"
              style={{ animationDelay: `${i * 80 + 300}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-display font-semibold text-surface-900 mb-1">{f.title}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="gradient-brand rounded-3xl p-10 text-center text-white">
          <h2 className="font-display text-3xl font-bold mb-3">Ready to start practising?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Browse question sets and begin your exam prep journey today.
          </p>
          <Link
            href="/exam"
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Browse question sets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-bold text-surface-700 text-sm">ExamPrep</span>
          </div>
          <p className="text-surface-400 text-xs">
            © {new Date().getFullYear()} ExamPrep. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
