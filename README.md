# MuleSoft Engineering Hub

**Engineering Better Integrations, One API at a Time.**

An independent, owner-managed technical publication for MuleSoft developers and integration engineers. The site teaches concepts with clear explanations, practical code, architecture diagrams, production checklists and interview checkpoints.

## What's included

- Responsive public article library and long-form reading pages.
- **43 built-in starter tutorials** across Mule 4 fundamentals, DataWeave, API design and management, security, integration patterns, testing, DevOps, deployment, production support and interview preparation.
- Search across tutorial content, titles and excerpts; filter by topic and browse nine articles per page. Long-form tutorials include a linked table of contents and related reading suggestions. The article count is generated from the full library.
- Original lightweight SVG architecture diagrams stored in the repository; no image-generation service or paid image subscription is needed.
- Code blocks, headings, lists, blockquotes, linked article contents and related tutorials.
- Search across full article text, titles, excerpts and categories; category filters and pagination.
- Owner-only password login with a signed, HTTP-only admin session and publishing dashboard.
- Create, edit, publish, unpublish and delete articles.
- Public visitors can read published articles; the admin route is excluded from crawler indexing.
- Search metadata, Open Graph defaults, sitemap and responsive layouts.

## Starter article topics

The 43 tutorials include end-to-end database-to-SFTP integration, DataWeave functions and type handling, idempotency, Mule event anatomy, Scheduler and HTTP Listener, error handling, API-led connectivity, RAML/APIKit, MUnit, CloudHub 2.0, IBM MQ/MFT, performance and streaming, API Manager autodiscovery, secure properties, pagination, Object Store, batch jobs, reliable SFTP delivery, OAuth 2.0/JWT, API versioning, CI/CD, correlation IDs, deployment troubleshooting and scenario-based interviews.

Starter articles are included in the application, so the library is visible before Supabase is configured. Published Supabase articles appear first while starter tutorials remain available. New content created in the admin dashboard is stored in Supabase.

## Stack

- Next.js App Router + TypeScript
- Supabase PostgreSQL + Row Level Security
- Responsive CSS and local SVG diagrams
- GitHub Actions for lint/build validation

## Setup

1. Create a Supabase project: https://supabase.com/dashboard
2. Open the Supabase SQL Editor and run `supabase/schema.sql`.
3. In Supabase Project Settings → API, copy the Project URL and anon/publishable key.
4. Import this repository into Vercel and configure the following environment variables for Production (and Preview/Development if you use those environments):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never prefix it with `NEXT_PUBLIC_`)
   - `ADMIN_EMAIL=narsingbeesetti006@gmail.com`
   - `NEXT_PUBLIC_ADMIN_EMAIL=narsingbeesetti006@gmail.com` (login form prefill only)
   - `ADMIN_PASSWORD` (a strong, unique password you choose; server-only)
   - `ADMIN_SESSION_SECRET` (a random secret of at least 32 characters; server-only)
   - `NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN` (sitemap and crawler metadata)
5. Generate a session secret locally with `openssl rand -hex 32`. Never put the generated value in GitHub or a `NEXT_PUBLIC_` variable.
6. Redeploy, open `/admin`, and sign in with the owner email and the password configured in Vercel. No email is sent.
7. Create an article, save it as a draft or publish it.

## Owner and publishing model

Only the configured owner can create, edit, publish, unpublish or delete articles. Admin access uses `ADMIN_EMAIL` + `ADMIN_PASSWORD`; successful login creates a seven-day signed HTTP-only cookie. `ADMIN_SESSION_SECRET` signs the cookie and must remain server-only. Public visitors can read published posts but cannot create or edit content. The configured owner email is `narsingbeesetti006@gmail.com`. The admin login does not use Supabase Auth magic links or send email.

If the owner email changes, update Vercel `ADMIN_EMAIL` and `NEXT_PUBLIC_ADMIN_EMAIL`, plus the owner email in `supabase/schema.sql` policies. Re-run the updated policy statements. Rotate `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` periodically. Never expose a Supabase service-role key in browser code or commit secrets to GitHub. The admin API uses this key only on the server after validating the signed owner session.

## Article authoring

The admin editor supports:
- `#`, `##`, `###` headings
- `- ` unordered lists
- Triple-backtick fenced code blocks
- `> ` blockquotes
- Local diagrams using `![Accessible description](/diagrams/diagram-name.svg)`

Use clear learning outcomes, explain each step, include realistic synthetic examples, discuss common failure modes, and finish with a checklist or exercise. Verify code against the target Mule runtime and connector version before publishing. Never include employer/client confidential information, credentials, personal data or production payloads.

## Local development

Requires Node.js 20+:

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Configure Supabase environment variables to test authentication and publishing.

## Validation

```sh
npm run lint
npm run build
```

GitHub Actions runs these checks for pushes and pull requests to `main`.

## Free-tier notes

The project does not require paid image-generation services. Supabase and Vercel have free tiers with usage limits and terms that can change; monitor quotas before public launch. A custom domain is optional.
