# Real Estate CRM MVP (Monorepo)

## Stack
- `apps/web`: React + Vite + TypeScript + Tailwind + Ant Design
- `apps/api`: NestJS REST API
- `packages/db`: Drizzle schema + DB client
- PostgreSQL on Supabase
- Supabase Auth JWT verification in backend

## Project structure
- `apps/web`
- `apps/api`
- `packages/db`

## Setup
1. Copy environment files:
   - `cp .env.example apps/api/.env`
   - `cp apps/web/.env.example apps/web/.env`
   - Set real Supabase/Postgres values in `apps/api/.env`
2. Install deps:
   - `pnpm install`
3. Generate migrations:
   - `pnpm db:generate`
4. Apply migrations:
   - `pnpm db:migrate`
5. Seed demo data:
   - `pnpm db:seed`
6. Run apps:
   - `pnpm dev`

## API endpoints
- Leads: `POST /leads`, `GET /leads`, `GET /leads/:id`, `PATCH /leads/:id`, `POST /leads/:id/convert`
- Customers: `POST /customers`, `GET /customers`
- Properties: `POST /properties`, `GET /properties`
- Tasks: `POST /tasks`, `GET /tasks`, `PATCH /tasks/:id`
- Notes: `POST /notes`, `GET /notes?entity_type=&entity_id=`

## Auth
- Every API endpoint expects `Authorization: Bearer <supabase_access_token>`.
- Backend verifies JWT using Supabase JWKS endpoint, with fallback token validation through `/auth/v1/user` when `SUPABASE_ANON_KEY` is set.
- Frontend uses a login screen (email/password) and stores the Supabase session in browser storage.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `apps/web/.env`.
- Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `apps/api/.env`.

## WhatsApp action
Lead details page includes an **Open WhatsApp** button using:
- `https://wa.me/<phone>?text=<encoded_text>`
