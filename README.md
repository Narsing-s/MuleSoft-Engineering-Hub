# MuleSoft Engineering Hub

An admin-only technical publishing website for MuleSoft tutorials, DataWeave examples, API design and integration engineering.

## Stack
- Next.js App Router + TypeScript
- Supabase Auth (email magic link) and Postgres
- Responsive custom UI
- Deployable to Vercel or another Node.js host

## Local setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Create a Supabase project and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. In Supabase Authentication, enable email sign-in and configure the site URL and redirect URL (`http://localhost:3000/admin`).
6. Run `supabase/schema.sql` in the Supabase SQL Editor.
7. Run `npm run dev`.

## Admin security
- The admin sign-in screen sends a Supabase magic link.
- The SQL policies restrict write access to the configured owner email.
- Set the owner email in the SQL policies to the intended account before production.
- Do not expose a Supabase service-role key in browser code.
- Add your production domain to Supabase Auth redirect URLs.
- The current UI is an MVP shell: article pages use local starter content. Connect the admin editor and public listing to the `articles` table before treating this as a production CMS.

## Deploy
Import the repository into Vercel or another Next.js host and configure the two public Supabase environment variables. Configure the Supabase auth redirect URL to the deployed domain. Use a custom domain only if desired.

## Included starter content
1. Database-to-SFTP integration with Mule 4
2. Seven practical DataWeave 2.0 techniques
3. Idempotency in MuleSoft

Review all technical examples against your Mule runtime and project conventions before publishing. Never include employer/client confidential information, credentials or production data.