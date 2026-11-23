# AGENTS.md

## Repo state
- Next.js app under `src/` (App Router). `Alcance.txt` is the product spec; `supabase/schema.sql` is the database schema of record.
- Secrets live in `.env.local` (gitignored); `.env.example` lists the variable names. `supabase.txt` is also gitignored.
- Direct Postgres connections fail from this environment (the Supabase DB host is IPv6-only): apply `supabase/schema.sql` through the Supabase SQL Editor.
- Code is pushed to GitHub: `https://github.com/dynamotcotest-collab/ga2prueba.git` (branch `main`).

## Stack confirmed
- Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.
- Backend: Supabase Postgres for data only. No Firebase or other providers.
- Auth: fixed `admin` / `12345` login with a signed session cookie; Supabase Auth/Google is deferred.
- Tests: Vitest unit tests plus a manual verification round.
- Deployment: handoff as `.txt` files; the agent does not deploy.
- Dark mode: Tailwind `darkMode: "class"`, toggle in header, persisted in `localStorage` as `clases-theme`.

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest unit tests
- `npm run build` — production build
- Verification order: `npm run typecheck` -> `npm test` -> `npm run build`.

## Database schema (Supabase Postgres)
Tables (create via Supabase SQL Editor using `supabase/schema.sql`):
- `public.coaches`: `codigo` (int, auto PK), `nombres`, `apellidos`, `correo`, `telefono`, `profesion`, `estado` (boolean, logical delete — never physical), `creado_en`, `actualizado_en`. Trigger auto-updates `actualizado_en` on update.
- `public.talleres`: `id` (int, auto PK), `nombre`, `descripcion`, `duracion_horas`, `estado`, `creado_en`. Catalog of courses coaches can teach.
- `public.coach_talleres`: `id` (int, auto PK), `coach_id` (FK → coaches.codigo), `taller_id` (FK → talleres.id), `asignado_en`. Many-to-many link between coaches and talleres. Unique on (coach_id, taller_id).
- `public.sesiones`: `id` (bigint, auto PK), `usuario`, `fin`, `user_agent`. Logout writes a session-end row here.

## Routes
- `/login` — fixed credential login (`admin` / `12345`), sets signed cookie `clases_session`.
- `/` — welcome page (protected), header with user name + avatar, side menu.
- `/coaches` — coach CRUD with confirmation modal per action, logical delete, taller assignment checkboxes.
- `/talleres` — taller CRUD (create, edit, delete).

## Non-obvious requirements from the spec
- Stay within free tiers of Vercel and Supabase. No paid add-ons.
- Single backend: Supabase only. Login is fixed admin/12345, not Supabase Auth. Do not add Firebase or a second provider.
- Post-login target: welcome page with side menu (Coaches, Talleres, Logout) and header showing logged-in user + avatar/icon.
- Coach CRUD: `Codigo` is auto-increment integer PK; delete is logical via `estado`, never physical. Fields: nombres, apellidos, correo electronico, numero de telefono (WhatsApp allowed), profesion.
- UX rule: every action ends with a completion confirmation modal, but avoid extra confirmation steps ("evitando dobles pasos").
- Logout: clear session cookie, write session-end row to `sesiones` table in Supabase, redirect to login.
- If Supabase credentials, project URL, or redirect URLs are missing, give the user explicit step-by-step setup instructions.

## Environment variables (`.env.local` / Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://bcvftzkbkroofuqfqozh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
AUTH_USERNAME=admin
AUTH_PASSWORD=12345
AUTH_SECRET=<long random string>
```
- `NEXT_PUBLIC_*` are browser-safe. `SUPABASE_SECRET_KEY` and `AUTH_SECRET` are server-only — never ship to client.
- Values for the current project are in `supabase.txt` (gitignored).

## Required end deliverables
- `PRUEBAS.txt` — test round results (unit + functional against Supabase).
- `DESPLIEGUE.txt` — deployment steps for the user (agent does not deploy).

## Verification results (last run)
- Unit tests: 13/13 passed (Vitest)
- TypeScript typecheck: clean
- Next.js build: clean
- Functional tests vs Supabase: 21/21 passed (coaches CRUD + talleres CRUD + coach-taller assignments)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
