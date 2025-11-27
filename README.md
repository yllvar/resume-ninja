# Resume Ninja – Project Documentation

- **Live App**: https://resume-ninja-ai.vercel.app/
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4 + Radix UI + shadcn-inspired components
- **Auth/DB**: Supabase (Postgres + Auth + RLS)
- **Rate Limiting**: Upstash Redis + @upstash/ratelimit
- **AI**: Vercel AI SDK (primary: Google Gemini 2.5 Pro) with structured JSON streaming via Zod schemas


## Overview
Resume Ninja analyzes and optimizes resumes for ATS compatibility. Users upload a resume (PDF/DOCX/Plain text), optionally provide a job description, receive a structured analysis with an ATS score and recommendations, and can generate an optimized resume. Access is authenticated via Supabase; usage is gated by a credit system and tier-specific rate limits.


## Architecture
- **Next.js App Router** under `app/` drives pages and API routes.
- **Supabase SSR** clients provide authenticated requests in server components and API handlers.
- **AI layer** streams structured objects (Zod) using Vercel AI SDK; prompts/templates live in `lib/ai/`.
- **Credits and rate limits** are enforced on protected routes via helpers in `lib/api-utils.ts` and `lib/rate-limit.ts`.
- **Database** schema and security are managed with SQL in `scripts/` and Supabase RLS policies.
- **Security** middleware guards protected paths and sets security headers.


## Directory Structure
- `app/`
  - `page.tsx`: Marketing/landing page
  - `optimize/`: Client flow for uploading and analyzing resumes
  - `dashboard/`: Authenticated area with stats and history
  - `api/`: API routes (`analyze`, `optimize`, `user/*`)
- `components/`: UI building blocks and feature components
- `hooks/`: Client hooks (e.g., `use-resume-analysis`)
- `lib/`
  - `ai/`: `config.ts` (model selection), `prompts.ts`, `schemas.ts`
  - `supabase/`: SSR/browser clients and middleware
  - `security/`: validation, audit, headers
  - `rate-limit.ts`: Upstash rate limiters
  - `credits.ts`: credit checks/deductions and usage logging
  - `templates/`: resume output templates
  - `resume-parser.ts`: extraction of text from uploads
- `scripts/`: SQL for tables, RLS, and triggers
- `middleware.ts`: Auth redirects + security headers


## Environment Variables
All variables are read from `.env`. Do not commit real secrets publicly. Replace values below with your own:

- Upstash Redis/KV
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - Optional compatibility
    - `KV_REST_API_READ_ONLY_TOKEN`
    - `KV_URL`, `REDIS_URL` (legacy connection style)
- Supabase
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Optional server-side keys (keep secret; do NOT expose publicly)
    - `SUPABASE_URL`
    - `SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `SUPABASE_JWT_SECRET`
- Supabase Postgres (optional local tooling)
  - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_DATABASE`
  - `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`
- Dev redirect
  - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (optional helper)

Note: Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.


## Database Schema and Security
The SQL scripts in `scripts/` set up tables and RLS policies.

- `001_create_tables.sql`
  - `profiles` (extends `auth.users`): `credits` (default 3), `subscription_tier` (`free|pro|enterprise`)
  - `resumes`: metadata and optional parsed JSON content
  - `analyses`: links `resume_id` and `user_id`, stores `ats_score`, `analysis_result`, `optimized_content`, `credits_used`
  - `usage_logs`: generic audit/usage logging
  - Helpful indexes on FKs and timestamps

- `002_enable_rls.sql`
  - RLS enabled for all tables
  - Policies restrict rows to the current `auth.uid()`

- `003_create_profile_trigger.sql`
  - Trigger to auto-create a profile row on new Supabase auth user signup with default credits and `free` tier

Types referenced in code: `lib/supabase/types.ts`.


## Rate Limiting & Credits
- Rate limiting: `lib/rate-limit.ts`
  - Tiers and limits per minute: `anonymous` (3), `free` (5), `pro` (30), `enterprise` (100)
  - Implemented via Upstash sliding window; headers set with `X-RateLimit-*` and `Retry-After`
- Credits: `lib/credits.ts`
  - `checkCredits(userId, required)` verifies available credits
  - `deductCredits(userId, amount, action)` decrements and logs usage in `usage_logs`
  - Enterprise tier bypasses deductions
- API protection: `lib/api-utils.ts`
  - `protectApiRoute(requireCredits, creditsRequired)` enforces auth, rate limit by tier, credits if required
  - `deductCreditsAfterSuccess` helper for post-success bookkeeping


## API Endpoints
All endpoints require authenticated Supabase session unless otherwise noted. Responses are JSON; streaming endpoints use Vercel AI SDK streaming.

- POST `/api/analyze`
  - Body: `{ resumeText: string, jobDescription?: string, resumeId?: string }`
  - Validates input and content. Streams `ResumeAnalysisSchema` (Zod). On finish: deducts 1 credit, inserts into `analyses`.

- POST `/api/optimize`
  - Body: `{ resumeText: string, analysisInsights?: string, jobDescription?: string, analysisId?: string }`
  - Streams `OptimizedResumeSchema`. On finish: deducts 1 credit, updates `analyses.optimized_content` by `analysisId`.

- GET `/api/user/profile`
  - Returns the authenticated user profile row from `profiles`.

- GET `/api/user/history?limit=10&offset=0`
  - Returns paginated list of analyses with resume filename and counts.

- GET `/api/user/stats`
  - Returns usage stats and average `ats_score`.


## Frontend Flows
- Landing page (`/`): marketing sections.
- Optimize (`/optimize`):
  - Upload via `ResumeDropzone`, optionally add a job description.
  - Client hook `use-resume-analysis` orchestrates parse → analyze → show results.
- Dashboard (`/dashboard`):
  - Requires auth; shows credits, quick actions, recent analyses, and stats.


## Middleware & Security
- `middleware.ts` delegates to `lib/supabase/middleware.ts` to:
  - Read session cookies, get user, and gate protected paths (`/dashboard`, `/optimize`).
  - Redirect unauthenticated users to `/auth/login` with `redirect` param.
  - Redirect authenticated users away from `/auth/login` and `/auth/sign-up`.
- Additional security headers are set in middleware: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, and `Permissions-Policy`.
- Validation and basic content safety checks live in `lib/security/validation.ts`; audit events via `lib/security/audit.ts`.


## AI Models & Prompts
- `lib/ai/config.ts`: selects models
  - primary: `google/gemini-2.5-pro`
  - fast: `google/gemini-2.5-flash`
  - fallback: `openai/gpt-4o-mini`
- `lib/ai/prompts.ts`: prompt templates for analysis and optimization
- `lib/ai/schemas.ts`: Zod schemas
  - `ResumeAnalysisSchema` and `OptimizedResumeSchema` define the streamed JSON object structure


## Local Development
1. Prerequisites
   - Node 18+
   - Supabase project (URL and keys)
   - Upstash Redis (REST URL + token)
2. Clone and install
   - `pnpm i` (or `npm i` / `yarn`)
3. Env
   - Create `.env` based on variables above. Never commit real secrets.
4. Database
   - Run SQL in `scripts/` on your Supabase project (via Supabase SQL editor or CLI) in order: `001`, `002`, `003`.
5. Dev server
   - `pnpm dev` and open `http://localhost:3000`


## Deployment (Vercel)
- Set all required environment variables in Vercel Project Settings → Environment Variables.
- Build command: `next build` (default). Output handled by Next.js App Router.
- Images are marked `unoptimized: true` in `next.config.mjs` for portability.
- Ensure Supabase URL and keys match the deployed project. Upstash tokens must be configured in the same environment.


## Troubleshooting
- 401 Unauthorized
  - Ensure Supabase session cookies exist and `NEXT_PUBLIC_SUPABASE_*` vars are set.
- 429 Rate limited
  - Back off and check Upstash credentials; verify tier in `profiles.subscription_tier`.
- 402 Insufficient credits
  - Increase `profiles.credits` or change `subscription_tier` to `pro`/`enterprise`.
- Streaming errors
  - Verify AI provider configuration and quotas; check `lib/ai/config.ts` models.
- RLS errors
  - Confirm RLS policies applied and the correct `auth.uid()` is active.


## Notes & Best Practices
- Keep server-side secrets out of client code; only `NEXT_PUBLIC_*` should reach the browser.
- Use `protectApiRoute` for any new endpoints to inherit auth, rate-limiting, and credit checks.
- Avoid storing raw documents; store parsed text and metadata where possible.
- Audit sensitive actions via `lib/security/audit.ts`.


## License
Proprietary – all rights reserved unless stated otherwise.
