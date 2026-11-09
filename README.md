# MuleSoft Engineering Hub

**Engineering Better Integrations, One API at a Time.**

Admin-owned technical publishing hub for MuleSoft, DataWeave 2.0, API-led connectivity, CloudHub, integration patterns, production support, tutorials, and interview preparation.

## MVP source package

Download [MuleSoft-Engineering-Hub-MVP.zip](./MuleSoft-Engineering-Hub-MVP.zip). It contains the Next.js starter, responsive homepage, article pages, three starter articles, Supabase starter schema, and admin sign-in screen.

## Status

This is an MVP foundation, not production-ready yet. The database-backed article editor and complete create/edit/publish workflow still need implementation and testing. Configure Supabase environment variables before running. Never commit real secrets or service-role keys.

## Local setup

Requires Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Admin-only publishing; visitors can read public articles. No public contributor accounts.
