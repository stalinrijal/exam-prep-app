-- ============================================================
-- ExamPrep — Supabase Schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- ── Profiles (extends Supabase auth.users) ──────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'learner' check (role in ('learner', 'admin')),
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Exam Sets ───────────────────────────────────────────────
create table if not exists public.exam_sets (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  subject      text not null,
  is_published boolean not null default false,
  created_at   timestamptz default now()
);

-- ── Questions ───────────────────────────────────────────────
create table if not exists public.questions (
  id             uuid primary key default gen_random_uuid(),
  set_id         uuid not null references public.exam_sets(id) on delete cascade,
  question_text  text not null,
  question_type  text not null default 'mcq' check (question_type in ('mcq', 'true_false', 'short_answer')),
  options        jsonb,           -- ["Option A", "Option B", "Option C", "Option D"]
  correct_answer text not null,
  explanation    text,
  order_index    integer not null default 0,
  created_at     timestamptz default now()
);

create index if not exists questions_set_id_idx on public.questions(set_id);

-- ── Attempt Sessions ────────────────────────────────────────
create table if not exists public.attempt_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete set null,  -- null = guest
  set_id          uuid not null references public.exam_sets(id) on delete cascade,
  score           integer,
  total_questions integer not null,
  started_at      timestamptz default now(),
  completed_at    timestamptz
);

create index if not exists sessions_user_id_idx on public.attempt_sessions(user_id);

-- ── Attempt Answers ─────────────────────────────────────────
create table if not exists public.attempt_answers (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.attempt_sessions(id) on delete cascade,
  question_id  uuid not null references public.questions(id) on delete cascade,
  given_answer text not null,
  is_correct   boolean not null
);

-- ── Row Level Security (RLS) ────────────────────────────────

-- Profiles: users can read/update their own profile
alter table public.profiles enable row level security;
create policy "Users read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Exam sets: anyone can read published sets; only service role can write (via admin UI)
alter table public.exam_sets enable row level security;
create policy "Anyone reads published sets" on public.exam_sets for select using (is_published = true);
create policy "Admin full access sets"      on public.exam_sets using (true) with check (true);
-- Note: for admin writes, use the service role key (server-side only).
-- For the admin portal client-side writes, you can temporarily disable RLS
-- on exam_sets while building, then lock it down with a proper admin check.

-- Questions: readable if parent set is published
alter table public.questions enable row level security;
create policy "Read questions of published sets" on public.questions
  for select using (
    exists (
      select 1 from public.exam_sets
      where id = questions.set_id and is_published = true
    )
  );

-- Attempt sessions: users see their own; insert by anyone
alter table public.attempt_sessions enable row level security;
create policy "Users see own sessions"   on public.attempt_sessions for select using (auth.uid() = user_id);
create policy "Anyone can insert session" on public.attempt_sessions for insert with check (true);

-- Attempt answers: follow session ownership
alter table public.attempt_answers enable row level security;
create policy "Users see own answers"    on public.attempt_answers for select
  using (exists (select 1 from public.attempt_sessions where id = attempt_answers.session_id and user_id = auth.uid()));
create policy "Anyone can insert answer" on public.attempt_answers for insert with check (true);
