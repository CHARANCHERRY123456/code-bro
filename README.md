# CodeBro

CodeBro is a full-stack collaborative coding platform with:

- Real-time collaborative editing using Yjs + WebSockets
- Project and file/folder (node) management
- Invite-based project joining
- In-browser code execution for JavaScript and Python
- NextAuth authentication (Google + credentials)

This repository is organized as a monorepo with separate `client` (Next.js) and `server` (Express + Prisma) apps.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4, NextAuth, CodeMirror, Yjs, xterm.js
- **Backend:** Express 5, Prisma ORM, PostgreSQL, JWT, WebSocket (`ws`)
- **Realtime Protocol:** Yjs sync + awareness over WebSocket
- **Code Execution:** Web Workers (JS, Pyodide for Python), optional remote execution via Piston API

## Repository Structure

```text
codebro/
  client/                  # Next.js app
    public/
      js-worker.js         # JavaScript execution worker
      py-worker.js         # Python (Pyodide) execution worker
    src/
      app/                 # App Router pages/layouts
      lib/                 # Axios + runtime helpers
      middleware.js        # Route auth guard middleware
  server/                  # Express + Prisma backend
    src/
      controllers/
      services/
      repositories/
      middlewares/
      routes/
      utils/
      constants/
    prisma/
      schema.prisma
      migrations/
```

## Core Features

### 1) Authentication

- Credentials login via backend `/auth/login`
- Google OAuth via NextAuth + backend token exchange (`/auth/google`)
- Frontend stores backend JWT in session (`session.backendJWT`)

### 2) Projects

- Create/list/detail/update/delete projects
- Owner-guarded operations for updates/deletes/member add
- Project members tracked in `ProjectMembership`

### 3) Nodes (Files/Folders)

- Unified `Node` model supports both file and folder
- Create/list/fetch/rename/update file content
- Sidebar builds a tree from flat node list on the frontend

### 4) Invites

- Project owner can generate invite links
- Authenticated users can open and join via invite token route

### 5) Collaborative Editor

- CodeMirror integrated with Yjs
- WebSocket document rooms keyed by `fileId`
- Awareness state used for collaborative presence

### 6) Terminal + Code Run

- xterm.js-powered terminal panel
- JavaScript execution in browser worker (`public/js-worker.js`)
- Python execution through Pyodide worker (`public/py-worker.js`)
- Some additional runtime helper code supports remote execution fallback

## Database Model (Prisma)

Primary models:

- `User`
- `Project`
- `ProjectMembership`
- `ProjectInvite`
- `ProjectJoinRequest`
- `Node` (FILE/FOLDER)
- `FileAccess`
- `FileVersion`
- `AuditLog`

Database provider is PostgreSQL.

## Local Setup

## 1) Prerequisites

- Node.js 18+ (recommended: 20+)
- npm
- PostgreSQL instance

## 2) Install dependencies

From repo root, install in both apps:

```bash
cd client && npm install
cd ../server && npm install
```

## 3) Configure environment variables

Create local env files (do not commit secrets):

- `client/.env.local`
- `server/.env`

Example values:

### `server/.env` (example)

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME?schema=public"
JWT_SECRET="replace_with_strong_secret"
PORT=5000
FRONTED_URL="http://localhost:3000"
EMAIL_USER="your_email@example.com"
EMAIL_PASS="your_mail_app_password"
```

### `client/.env.local` (example)

```env
NEXTAUTH_SECRET="replace_with_strong_secret"
NEXTAUTH_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"
NEXT_PUBLIC_WS_URL="ws://localhost:5000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

## 4) Run Prisma migrations

From `server/`:

```bash
npx prisma migrate dev
```

## 5) Start backend and frontend

In two terminals:

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

Then open `http://localhost:3000`.

## Useful Scripts

### Client (`client/package.json`)

- `npm run dev` - start Next.js dev server
- `npm run build` - build production bundle
- `npm run start` - run production build
- `npm run lint` - run ESLint

### Server (`server/package.json`)

- `npm run dev` - start server with nodemon
- `npm run start` - alias to `npm run dev`

## Backend API Overview

Base URL (local): `http://localhost:5000`

### Health

- `GET /health`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google`

### Projects (Bearer token required)

- `POST /project`
- `GET /project`
- `GET /project/:projectId`
- `PATCH /project/:projectId` (owner)
- `DELETE /project/:projectId` (owner)
- `POST /project/:projectId/members` (owner)

### Nodes (Bearer token required)

- `GET /node?projectId=...`
- `GET /node/:nodeId`
- `POST /node`
- `PATCH /node/:nodeId/content`
- `PATCH /node/:nodeId/name`

### Invites (Bearer token required)

- `POST /invite/:projectId`
- `GET /invite/:token`
- `POST /invite/:token/join`

## Realtime Collaboration

The backend WebSocket server runs on the same port as Express (`server.js`) and handles:

- Yjs sync messages
- Awareness updates
- Broadcasting updates to room participants

The editor connects using:

- `NEXT_PUBLIC_WS_URL` from the frontend env
- Room/document key based on current `fileId`

## Notes

- The repo currently contains local development env files with sensitive values; rotate and replace them with local-only secrets if needed.
- `BACKEND_URL` should be available to client-side code (typically via `NEXT_PUBLIC_BACKEND_URL`) in strict Next.js setups.
- There are places in the current codebase with in-progress/experimental behavior (for example, permissive login flow and invite/join handling). If you plan production use, harden auth, validation, and error handling.