# Health Routine

## Overview

Health Routine is a multilingual daily wellness companion web application that guides users through structured health routines (morning wipe-down, eye exercises, stretching). Users enter their name, select a routine type, follow step-by-step instructions, provide mood feedback after completion, and can review their history. The app supports Japanese, English, and Chinese languages with Japanese as the default.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with pages: Home (`/`), Routine (`/routine`), Settings (`/settings`), History (`/history`)
- **State Management**: Zustand with `persist` middleware for local state (language preference, user name, routine type, active routine progress). The store also provides a `t` object for translations.
- **Data Fetching**: TanStack React Query for server state (routine records from the API)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS v4
- **Styling**: Tailwind CSS with CSS variables for theming (warm cream/rose light theme), custom fonts (Plus Jakarta Sans, Outfit)
- **Animations**: Framer Motion for page transitions and UI interactions
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via `tsx`)
- **API Design**: Simple REST API under `/api/` prefix
  - `GET /api/routine-records` — fetch all routine records
  - `POST /api/routine-records` — create a new routine record with Zod validation
- **Storage Layer**: `IStorage` interface implemented by `DatabaseStorage` class using Drizzle ORM, making the storage layer swappable
- **Dev Server**: Vite dev server middleware integrated into Express for HMR during development
- **Production**: Client built to `dist/public`, server bundled to `dist/index.cjs` via esbuild

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema** (in `shared/schema.ts`):
  - `routine_records` table: `id` (UUID, auto-generated), `userName` (text), `date` (timestamp, defaults to now), `feeling` (text), `comment` (text, nullable), `routineType` (text, defaults to 'morning')
- **Validation**: `drizzle-zod` generates Zod schemas from the Drizzle table definition for request validation
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Connection**: `pg.Pool` using `DATABASE_URL` environment variable

### Build System
- **Development**: `npm run dev` starts the Express server with Vite middleware for HMR
- **Production Build**: `npm run build` runs a custom build script that first builds the client with Vite, then bundles the server with esbuild. Server dependencies are selectively bundled vs externalized to optimize cold start times.

### Key Design Decisions
1. **Shared schema between client and server** — The `shared/` directory contains the database schema and types used by both frontend and backend, ensuring type safety across the stack.
2. **Zustand for local UI state, React Query for server state** — Clean separation between persistent UI preferences (language, username) and server-fetched data (routine history).
3. **Multi-language support via translation objects** — All UI strings come from a translations module keyed by language code, stored in Zustand with persistence.
4. **Three routine types** — Morning (wipe-down), Eye Exercise, and Stretching, each with different step counts defined in constants.

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection via `DATABASE_URL` environment variable. Used for persisting routine completion records.

### Key npm Packages
- **drizzle-orm** + **drizzle-kit**: Database ORM and schema management
- **express** (v5): HTTP server framework
- **@tanstack/react-query**: Server state management
- **zustand**: Client-side state management
- **wouter**: Client-side routing
- **framer-motion**: Animation library
- **shadcn/ui** components (Radix UI + Tailwind): Full UI component library
- **date-fns**: Date formatting with locale support (ja, en, zh)
- **zod** + **drizzle-zod**: Runtime validation

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required)