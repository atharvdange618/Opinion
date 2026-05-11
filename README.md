<div align="center">
  <h1>Opinion</h1>
  <p><strong>Enterprise-grade anonymous polling platform with real-time analytics, bot mitigation, and OIDC authentication.</strong></p>
  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js">
    <img alt="React" src="https://img.shields.io/badge/React-19-58c4dc?style=flat-square&logo=react">
    <img alt="Express" src="https://img.shields.io/badge/Express-5-black?style=flat-square&logo=express">
    <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss">
    <img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio">
    <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery">
    <img alt="pnpm" src="https://img.shields.io/badge/pnpm-10-F69220?style=flat-square&logo=pnpm">
  </p>
</div>

---

## Overview

Opinion reimagines the polling experience from the ground up - a privacy-first platform engineered for trust, scale, and real-time insight. Whether collecting honest anonymous feedback or gathering authenticated votes within a trusted ecosystem, Opinion delivers a seamless experience that enterprise teams can rely on.

Built with a cutting-edge monorepo architecture, Opinion leverages the latest in modern web infrastructure - Next.js 16, React 19, Express 5, and MongoDB - to deliver live-updating dashboards and enterprise-grade security out of the box.

---

## Why Opinion?

Most polling tools treat feedback as static, siloed data. Opinion treats it as a live signal - a pulse you can watch in real time. Every response flows through a sophisticated anti-spam pipeline (Cloudflare Turnstile + SHA-256 IP fingerprinting), is validated against OIDC-backed identity when needed, and is instantly reflected in an analytics experience built for decision-makers.

From a single-question pulse check to a twenty-question deep-dive, Opinion scales effortlessly - and surfaces insights your organization can act on immediately.

---

## Tech Stack

| Layer         | Technology                               | Why                                                                                   |
| ------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| **Framework** | Next.js 16 + React 19                    | Cutting-edge server components, streaming, and the latest React paradigm              |
| **Backend**   | Express 5 + TypeScript                   | Modern, type-safe Node.js HTTP layer with async error handling                        |
| **Database**  | MongoDB + Mongoose                       | Flexible document model for dynamic poll schemas with rich querying                   |
| **Real-time** | Socket.IO                                | Bi-directional, low-latency event streaming for live analytics                        |
| **Auth**      | Kleis IdP (OIDC + PKCE) - self-built     | Custom, fully self-hosted identity provider implementing the OIDC spec with PKCE flow |
| **Anti-spam** | Cloudflare Turnstile + IP fingerprinting | Invisible bot protection layered with salted SHA-256 deduplication                    |
| **UI**        | Tailwind CSS v4 + shadcn/ui              | Utility-first, design-system-driven interface with component primitives               |
| **State**     | TanStack React Query v5                  | Declarative, cache-first server state management with automatic refetching            |
| **Forms**     | React-Hook-Form + Zod                    | Performant, schema-validated forms with minimal re-renders                            |
| **Charts**    | Recharts                                 | Declarative, composable charting for rich analytics visualizations                    |
| **Monorepo**  | pnpm workspaces                          | Fast, disk-efficient dependency management across the entire codebase                 |

---

## Features

### Poll Creation & Management

- **Dynamic multi-question builder** - add, remove, and reorder questions with drag-like UX; each question supports 2–10 options with mandatory toggles
- **Granular response modes** - choose between fully anonymous (ideal for candid feedback) or authenticated (OIDC-backed for accountability)
- **Intelligent lifecycle** - polls progress through active → expired → published states, with configurable expiry and one-click result publishing

### Real-Time Analytics

- **Live-updating dashboard** - every response is reflected instantly via Socket.IO push, with zero page refreshes
- **Comprehensive metrics** - total responses, anonymous vs. authenticated breakdown, poll duration, peak activity hour, per-question vote distribution with drop-off rates
- **Visual insights** - bar charts for per-question distribution, timeline charts for response velocity over time
- **Engagement intelligence** - unique respondent count, first/last response timestamps, and poll health indicators

### Enterprise-Grade Security

- **Cloudflare Turnstile** - invisible, privacy-preserving bot detection that never requires CAPTCHA interaction
- **IP fingerprinting** - SHA-256 hashed with a configurable salt for deterministic anonymous deduplication
- **Cookie-based respondent tracking** - cryptographically random UUID prevents duplicate submissions
- **Self-built Kleis IdP** - fully custom, self-hosted OIDC provider implementing the authorization code flow with PKCE, purpose-built from the ground up rather than relying on a third-party auth service

### Developer Experience

- **TypeScript end-to-end** - shared Zod schemas between frontend and backend guarantee type safety across the wire
- **Monorepo with shared packages** - `@opinion/shared` centralizes validation, types, and contracts
- **RESTful API** - clean, resource-oriented routes with consistent error handling

---

## Architecture

```
opinion/
├── apps/
│   ├── web/                          # Next.js 16 frontend
│   │   ├── app/                      # App Router - server components, layouts, pages
│   │   ├── components/               # Composable UI components (shadcn + custom)
│   │   ├── hooks/                    # Custom React hooks for data fetching
│   │   ├── lib/                      # Utility functions and API client
│   │   └── providers/               # Context providers (auth, query, theme)
│   └── api/                          # Express 5 backend
│       └── src/
│           ├── controllers/          # Request handlers
│           ├── middleware/           # Auth, validation, error handling
│           ├── models/               # Mongoose schemas
│           ├── routes/               # Route definitions
│           └── services/            # Business logic layer
├── packages/
│   └── shared/                       # Shared Zod schemas, types, and contracts
└── docs/                             # Design and integration documentation
```

---

## Prerequisites

- Node.js (latest LTS)
- `pnpm` (`npm install -g pnpm@10.32.1`)
- MongoDB instance (local or Atlas)

---

## Quick Start

```bash
# Clone and install dependencies
git clone https://github.com/atharvdange618/Opinion.git
cd opinion
pnpm install

# Configure environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Edit .env files with your credentials (see Environment Variables below)

# Launch development servers
pnpm dev
```

The API runs on `http://localhost:3001` and the web app on `http://localhost:3000`.

---

## Environment Variables

### `apps/api/.env`

| Variable               | Description                                   | Required |
| ---------------------- | --------------------------------------------- | -------- |
| `PORT`                 | API server port                               | Yes      |
| `MONGODB_URI`          | MongoDB connection string                     | Yes      |
| `KLEIS_IDP_URL`        | Self-hosted Kleis IdP base URL (custom-built) | Yes      |
| `KLEIS_CLIENT_ID`      | OIDC client ID                                | Yes      |
| `KLEIS_CLIENT_SECRET`  | OIDC client secret                            | Yes      |
| `PUBLIC_APP_URL`       | Public-facing URL of the web frontend         | Yes      |
| `SESSION_SECRET`       | 64+ char hex key for HS256 JWT signing        | Yes      |
| `SESSION_COOKIE_NAME`  | Session cookie identifier                     | Yes      |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server-side secret       | Yes      |
| `FINGERPRINT_SALT`     | Salt for deterministic IP fingerprint hashing | Yes      |
| `CORS_ORIGIN`          | Allowed CORS origin                           | Yes      |

### `apps/web/.env.local`

| Variable                         | Description                                             | Required |
| -------------------------------- | ------------------------------------------------------- | -------- |
| `PUBLIC_APP_URL`                 | Public-facing URL of the web frontend                   | Yes      |
| `NEXT_PUBLIC_API_URL`            | Backend API URL (browser-accessible)                    | Yes      |
| `SESSION_SECRET`                 | Must match API `SESSION_SECRET` for cookie verification | Yes      |
| `SESSION_COOKIE_NAME`            | Must match API `SESSION_COOKIE_NAME`                    | Yes      |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile public site key                    | Yes      |

---

## Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Concurrently start API + Web dev servers |
| `pnpm dev:api`   | Start API in watch mode (port 3001)      |
| `pnpm dev:web`   | Start Next.js dev server (port 3000)     |
| `pnpm build`     | Build both API and Web for production    |
| `pnpm build:api` | Compile API TypeScript to `dist/`        |
| `pnpm build:web` | Run `next build` for production bundle   |

---

## Data Model

Opinion uses MongoDB with four collections, designed for flexible poll schemas and performant analytical queries:

```
User (1) ──< Poll (many)              # creator relationship
Poll (1) ──< Question (many)          # questions within a poll
Poll (1) ──< Response (many)          # responses to a poll
Question (1) ──< Response (many)      # per-question response tracking
```

Key design decisions:

- **Questions are embedded in a separate collection** - allows independent querying and ordering
- **Responses store the selected option text** - makes aggregations schema-independent
- **Compound indexes** on `(poll, respondentId)` and `(poll, question)` for fast analytics queries
- **IP fingerprints are salted and hashed** - never stored in plaintext

---

## API Reference

### Public Routes (No Auth Required)

| Method | Endpoint                          | Description                                     |
| ------ | --------------------------------- | ----------------------------------------------- |
| `GET`  | `/api/polls/public/:slug`         | Retrieve a poll by its unique slug              |
| `POST` | `/api/polls/public/:slug/respond` | Submit a response (with Turnstile verification) |
| `GET`  | `/api/polls/public/:slug/results` | View published results                          |

### Authenticated Routes (OIDC Session Required)

| Method   | Endpoint                   | Description                                         |
| -------- | -------------------------- | --------------------------------------------------- |
| `GET`    | `/api/polls`               | List all polls for the authenticated user           |
| `POST`   | `/api/polls`               | Create a new poll                                   |
| `GET`    | `/api/polls/:id`           | Get poll details                                    |
| `PATCH`  | `/api/polls/:id`           | Update poll (title, questions, expiry)              |
| `DELETE` | `/api/polls/:id`           | Delete poll (only if no responses exist)            |
| `PATCH`  | `/api/polls/:id/publish`   | Publish poll results                                |
| `GET`    | `/api/polls/:id/analytics` | Comprehensive analytics with live Socket.IO updates |

### Authentication Routes

| Method | Endpoint             | Description                           |
| ------ | -------------------- | ------------------------------------- |
| `POST` | `/api/auth/login`    | Initiate OIDC authorization code flow |
| `GET`  | `/api/auth/callback` | OIDC callback endpoint                |
| `POST` | `/api/auth/logout`   | Terminate session                     |
| `GET`  | `/api/auth/me`       | Return current user profile           |
| `POST` | `/api/auth/sync`     | Sync user data from IdP               |

---

## Security Architecture

Opinion employs a defense-in-depth strategy:

1. **Cloudflare Turnstile** - invisible challenge verification at submission time; server-side validation with zero client trust
2. **IP fingerprinting** - salted SHA-256 hash prevents duplicate anonymous submissions without storing raw IPs
3. **Cryptographic respondent tracking** - UUID v4 cookies with server-side deduplication
4. **OIDC with PKCE** - authorization code flow with Proof Key for Code Exchange; no client secret in browser
5. **HS256 session JWTs** - signed with a configurable secret; verified on every authenticated request
6. **Input validation** - Zod schemas shared between frontend and backend guarantee type safety and reject malformed payloads
7. **Helmet + HPP** - HTTP security headers and parameter pollution protection on the Express layer

---

## License

MIT
