# MuleSoft Engineering Hub

**Engineering Better Integrations, One API at a Time.**

An independent, owner-managed technical publication for MuleSoft developers and integration engineers. The site teaches concepts with clear explanations, practical code, architecture diagrams, production checklists and interview checkpoints.

## What's included

- Responsive public article library and long-form reading pages.
- **15 starter tutorials** covering Mule 4, DataWeave 2.0, API-led connectivity, RAML/APIKit, MUnit, CloudHub 2.0, IBM MQ/MFT, performance and production support.
- Original lightweight SVG architecture diagrams stored in the repository; no image-generation service or paid image subscription is needed.
- Code blocks, headings, lists, blockquotes and embedded local SVG diagrams.
- Owner-only Supabase magic-link login and publishing dashboard.
- Create, edit, publish, unpublish and delete articles.
- Public visitors can read published articles; the admin route is excluded from crawler indexing.
- Search metadata, Open Graph defaults, sitemap and responsive layouts.

## Starter article topics

1. Database-to-SFTP integration using Mule 4
2. Seven practical DataWeave 2.0 techniques
3. Idempotency and duplicate prevention
4. Mule 4 event anatomy
5. Scheduler vs HTTP Listener
6. Error handling: On Error Continue vs Propagate
7. API-led connectivity: System, Process and Experience
8. RAML and APIKit
9. MUnit testing and mocking
10. CloudHub 2.0 deployment and Runtime Manager
11. Production support incident checklist
12. DataWeave null handling, types and dates
13. HTTP Request timeouts and retries
14. IBM MQ and managed file transfer
15. Streaming, batch and database connection pooling

Starter articles are included in the application, so the library is visible before Supabase is configured. Published Supabase articles appear first while starter tutorials remain available. New content created in the admin dashboard is stored in Supabase.

## Stack

- Next.js App Router + TypeScript
- Supabase Auth + PostgreSQL + Row Level Security
- Responsive CSS and local SVG diagrams
- GitHub Actions for lint/build validation

## Setup

1. Create a Supabase project: https://supabase.com/dashboard
2. Open the Supabase SQL Editor and run `supabase/schema.sql`.
3. In Supabase Project Settings → API, copy the Project URL and anon/publishable key.
4. In Authentication → URL Configuration, set your deployed Site URL and add `https://YOUR-DOMAIN/auth/callback`. Add `http://localhost:3000/auth/callback` only for local development.
5. Import this repository into Vercel and configure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL=narsingbeesetti006@gmail.com`
   - `NEXT_PUBLIC_ADMIN_EMAIL=narsingbeesetti006@gmail.com` (display prefill only; not a security control)
   - `NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN` (sitemap and crawler metadata)
6. Deploy and open `/admin`.
7. Request a magic link using the owner email and open it on the same device/browser.
8. Create an article, save it as a draft or publish it.

## Owner and publishing model

Only the configured owner can create, edit, publish, unpublish or delete articles. Public visitors can read published posts but cannot create or edit content. The configured owner email is `narsingbeesetti006@gmail.com`.

If the owner email changes, update Vercel `ADMIN_EMAIL` and `NEXT_PUBLIC_ADMIN_EMAIL`, plus the owner email in `supabase/schema.sql` policies. Re-run the updated policy statements. Enable MFA on the owner email account. Never expose a Supabase service-role key in browser code or commit secrets to GitHub.

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
