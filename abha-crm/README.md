# ABHA Global Educare — Staff CRM & Productivity System

This repository contains the foundation for the ABHA Global Educare LLP Staff CRM & Productivity System.

## Phase 1 — Foundation Completed

What is included:

- Next.js 14 App Router scaffold
- TypeScript strict mode configuration
- Tailwind CSS setup
- Basic `shadcn/ui`-style component scaffolding
- PWA manifest + service worker basics
- Supabase client scaffolding
- ESLint + Prettier + Husky + lint-staged foundation
- Folder structure scaffold matching the project specification
- `.env.example` for required environment variables

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Notes

- `prompt.md` contains the full project requirements and phase plan.
- Real Supabase integration will be wired in Phase 2.
- Use `.env.example` as a template and create `.env.local` before connecting cloud services.

## How to create a Supabase project

1. Visit https://supabase.com and sign up for a free account.
2. Create a new project.
3. In Project Settings, copy the `API URL` and `anon key`.
4. Create a new `SERVICE_ROLE` key under `API` -> `Project API keys`.
5. Add them to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Next steps

After you confirm Phase 1, I will proceed with Phase 2: database migrations, auth flows, and route protection.
