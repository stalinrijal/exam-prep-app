# ExamPrep

A free, scalable exam preparation platform built with **Next.js 14 + Supabase**, deployable to **Vercel**.

---

## Stack

| Layer       | Tool               |
|-------------|-------------------|
| Frontend    | Next.js 14 (App Router) |
| Styling     | Tailwind CSS       |
| Database    | Supabase (Postgres) |
| Auth        | Supabase Auth      |
| Hosting     | Vercel (free tier) |

---

## Local Setup

### 1. Clone and install
```bash
git clone <your-repo-url>
cd examprep
npm install
```

### 2. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL** and **anon key** from Settings → API

### 3. Set up the database
1. In Supabase → SQL Editor → New Query
2. Paste and run the entire contents of `supabase-schema.sql`

### 4. Configure environment variables
```bash
cp .env.local.example .env.local
# Fill in your Supabase URL, anon key, and admin email
```

### 5. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

---

## Deployment to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → select your repo
3. Add environment variables (same as `.env.local`) in Vercel project settings
4. Deploy — Vercel gives you a `.vercel.app` URL
5. Point your custom domain in Vercel → Settings → Domains

**That's it.** Everything runs on free tiers.

---

## Admin Access

The admin portal is at `/admin`. Access is controlled by the `NEXT_PUBLIC_ADMIN_EMAILS` env variable.

1. Sign up normally at `/auth/signup` with your admin email
2. Set `NEXT_PUBLIC_ADMIN_EMAILS=youremail@domain.com` in your env
3. Visit `/admin` — you'll have full access

---

## Project Structure

```
examprep/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   └── callback/         # Email confirmation handler
│   ├── exam/
│   │   ├── page.tsx          # Browse question sets (public)
│   │   └── [setId]/          # Take an exam (public + guest)
│   ├── dashboard/            # Learner dashboard (auth required)
│   └── admin/                # Admin portal (admin emails only)
│       ├── page.tsx           # Overview
│       ├── sets/              # Manage question sets
│       └── questions/         # Manage questions
├── components/
│   └── exam/
│       └── ExamClient.tsx    # Interactive exam UI
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utilities
├── middleware.ts             # Auth + route protection
└── supabase-schema.sql       # Run this in Supabase
```

---

## Roadmap (future)

- [ ] Save attempt scores to DB for signed-in users
- [ ] Timer per exam set
- [ ] Question CSV bulk import for admin
- [ ] Paid courses with Stripe
- [ ] Video/text tutorials section
- [ ] Progress analytics per learner
- [ ] Multiple correct answers / multi-select questions
- [ ] Leaderboard
