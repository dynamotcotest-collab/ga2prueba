# AGENTS.md

## Repo state
- Next.js app under `src/` (App Router). `Alcance.txt` is the product spec; `supabase/schema.sql` is the database schema of record.
- Secrets live in `.env.local` (gitignored); `.env.example` lists the variable names. `supabase.txt` is also gitignored.
- Direct Postgres connections fail from this environment (the Supabase DB host is IPv6-only): apply `supabase/schema.sql` through the Supabase SQL Editor.

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest unit tests
- `npm run build` — production build
- Verification order: `npm run typecheck` -> `npm test` -> `npm run build`.

## Confirmed decisions
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS on Vercel.
- Backend: Supabase Postgres for data only. No Firebase or other providers. Auth is a fixed admin/12345 login with a signed session cookie; Supabase Auth/Google is deferred.
- Tests: Vitest unit tests plus a manual verification round.
- Deployment: handoff as a `.txt` with steps; the agent does not deploy.

## Non-obvious requirements from the spec
- Stay within the free tiers of Vercel (hosting) and Supabase (auth + DB). Stack choice is ours; paid add-ons are not.
- Single backend: Supabase stores coach data and the session-end log written on logout (a Supabase Postgres table, e.g. `sesiones`). Login is a fixed admin/12345 check, not Supabase Auth. Do not add Firebase or a second provider.
- Post-login target is a welcome page with a side menu (Coaches, Logout) and a header showing the logged-in user (admin) with an avatar/icon.
- Coach CRUD: `Codigo` is an auto-increment integer PK; delete is logical via an `estado` field, never physical. Other fields: nombres, apellidos, correo electronico, numero de telefono (WhatsApp allowed), profesion.
- UX rule: every action ends with a completion confirmation modal, but avoid extra confirmation steps ("evitando dobles pasos").
- If Supabase credentials, project URL, or redirect URLs are missing, give the user explicit step-by-step setup instructions rather than assuming they exist.

## Required end deliverables
- Run a test round and write the results into `PRUEBAS.txt`.
- Write `DESPLIEGUE.txt` with deployment steps for the user (the agent does not deploy).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
