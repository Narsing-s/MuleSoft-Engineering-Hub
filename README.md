# MuleSoft Engineering Hub

**Engineering Better Integrations, One API at a Time.**

An admin-owned technical publishing hub for MuleSoft, DataWeave 2.0, API-led connectivity, CloudHub, integration patterns, production support, tutorials, and interview preparation.

## MVP source package

Download the complete Next.js MVP source archive from this repository:

- [MuleSoft-Engineering-Hub-MVP.zip](./MuleSoft-Engineering-Hub-MVP.zip)

The package includes a responsive homepage, article routes, three starter articles, a Supabase starter schema, and an admin sign-in screen.

## Important status

This is an initial MVP foundation, not a production-ready publishing system. The database-backed article editor and complete create/edit/publish workflow still need to be implemented and tested. Configure Supabase environment variables before running the app. Never commit real secrets or service-role keys.

## Local setup

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

See the project README inside the archive for Supabase and deployment setup.

## Publishing model

Admin-only publishing. Visitors can read public articles; there are no public contributor accounts.

## Brand

MuleSoft Engineering Hub — Engineering Better Integrations, One API at a Time.
