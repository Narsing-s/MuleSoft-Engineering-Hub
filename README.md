# MuleSoft Engineering Hub

Independent owner-managed technical publication. Tagline: **Engineering Better Integrations, One API at a Time.**

## Features
- Responsive article library and article reading pages
- Owner-only Supabase magic-link authentication
- Create, edit, publish, unpublish and delete articles
- Public visitors can read published articles only
- Markdown-style headings, lists and fenced code blocks
- Row Level Security plus server-side owner checks

## Setup
1. Create a Supabase project: https://supabase.com/dashboard
2. In SQL Editor, run `supabase/schema.sql`.
3. In Project Settings → API, copy the Project URL and anon/publishable key.
4. In Authentication → URL Configuration, set Site URL to your deployed domain and add `https://YOUR-DOMAIN/auth/callback` (also add `http://localhost:3000/auth/callback` for local work).
5. Import this GitHub repo into Vercel and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL=narsingbeesetti006@gmail.com`
   - `NEXT_PUBLIC_ADMIN_EMAIL=narsingbeesetti006@gmail.com` (prefill only; not a security control)
6. Deploy. Open `/admin`, request a magic link and open it on the same device/browser.
7. Create an article, save as draft or publish immediately.

## Security
- API routes verify the Supabase user session and enforce the owner email on the server.
- RLS independently restricts insert/update/delete to the owner email.
- Anonymous users can select published articles only; authenticated owner can also select drafts.
- Never add a Supabase service-role key to this app or commit secrets.
- Keep the SQL policy email aligned with `ADMIN_EMAIL`. Enable MFA on the owner inbox.

## Content
Write with `#`, `##`, `###`, `-` list items and triple-backtick code fences. Review technical examples before publishing. Never include client confidential information, credentials or production data.

## Local development
Requires Node.js 20+:
```sh
npm install
cp .env.example .env.local
npm run dev
```
